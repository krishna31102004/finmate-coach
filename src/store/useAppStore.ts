import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import transactionsData from '../data/transactions.json';
import categoriesMap from '../data/categories.json';
import goalsData from '../data/goals.json';
import tipsData from '../data/tips.json';
import lessonsData from '../data/lessons.json';
import localResources from '../data/local_resources.json';
import { categorizeTransactions, computeBudgetSummary } from '../lib/budget';
import { generateAlerts } from '../lib/alerts';
import { generateSuggestions } from '../lib/coach';

export type Transaction = {
  id: string;
  date: string;
  merchant: string;
  amount: number;
};
export type Goal = {
  id: string;
  name: string;
  target: number;
  current: number;
};
export type Lesson = {
  id: string;
  title: string;
  content: string;
};
export type Tip = {
  id: string;
  tag: string;
  text: string;
};
export type ChatMessage = {
  id: string;
  role: 'user' | 'coach';
  text: string;
  ts: number;
};
type Alert = { id: string; message: string };
type Budgets = { needs: number; wants: number; savings: number };

export type Profile = {
  name: string;
  campus: string;
  incomeCycle: 'weekly' | 'biweekly' | 'monthly';
  weeklyPlan: number | null;
  currency: string;
  roundUpsEnabled: boolean;
};

interface StoreState {
  // Data
  transactions: Transaction[];
  categoriesTotals: Record<string, number>;
  budgets: Budgets;
  goals: Goal[];
  alerts: Alert[];
  suggestions: string[];
  lessons: Lesson[];
  tips: Tip[];
  resources: Record<string, any>;
  
  // UI Preferences
  ui: {
    largeText: boolean;
    darkMode: boolean;
    needsAlertDismissed: string | null; // week key when dismissed
  };
  setLargeText: (value: boolean) => void;
  setDarkMode: (value: boolean) => void;
  dismissNeedsAlert: (weekKey: string) => void;
  
  // Profile
  profile: Profile;
  setProfile: (p: Partial<Profile>) => void;
  
  // Coach
  coach: {
    messages: ChatMessage[];
    isThinking: boolean;
    isTyping: boolean;
  };
  sendUserMessage: (text: string) => void;
  respondDemoOrRule: () => Promise<void>;
  
  // Data Management
  loadSeeds: () => void;
  resetAll: () => void;
  hasData: () => boolean;
  
  // Legacy
  addContribution: (goalId: string, amount: number) => void;
  getCoachResponse: (question: string) => string;
}

// Demo Q&A Map (case-insensitive matching)
const DEMO_QA_MAP: Record<string, string[]> = {
  'where did my money go': [
    'This week most spending is in **Food** ($59.7), then **Transportation** ($42), then **Utilities** ($60). You have spent about **$329** total, mostly on essentials.',
    'Let me check... **Food** leads at $59.7, followed by **Transportation** and **Utilities**. Overall, you are at about **$329** this period.',
  ],
  'how do i start saving': [
    'Two quick wins: turn on **round-ups** and add **$5** to your emergency fund today. That builds momentum. I can also set a **$2/day** auto-rule if you like.',
    'Start small! Try **$5** today into your Emergency Fund. Enable **round-ups** on purchases. Small steps compound fast.',
  ],
  'am i on track this week': [
    'You are at about **65%** of your weekly plan. If you keep today pace, you will land around **$380**. To finish strong, try capping **Food** spending for the next few days.',
    'You have used **65%** of your budget. Staying on track means keeping **Food** and **Entertainment** light through the weekend.',
  ],
  'is this a subscription': [
    'I spotted at least one repeating merchant: **streaming service** ($9.99). Want to set a **$0** test week and see if you miss it?',
    'Yes, **streaming service** appears to be recurring. Consider pausing it for a week to test if you really need it.',
  ],
  'if i invest $10/wk': [
    'At **8%** for **5 years**, **$10/week** grows to about **$3,200**. Try it in the **Invest** tab; we will show a clear projection and a confidence band.',
    'Great question! **$10/week** at **8%** becomes roughly **$3,200** after **5 years**. Check the Invest tab for a visual breakdown.',
  ],
};

const THINKING_PRELUDES = ['Hmm...', 'Let me check that...', 'One sec...', 'Looking into it...', 'Give me a moment...'];

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function findDemoAnswer(question: string): string | null {
  const lowerQ = question.toLowerCase();
  for (const [key, answers] of Object.entries(DEMO_QA_MAP)) {
    if (lowerQ.includes(key)) {
      return getRandomItem(answers);
    }
  }
  return null;
}

function generateRuleFallback(state: StoreState): string {
  const { categoriesTotals, budgets, goals, transactions } = state;
  
  // Calculate total spent
  const totalSpent = Object.values(categoriesTotals).reduce((acc, cur) => acc + cur, 0);
  
  // Get top 3 categories
  const sortedCategories = Object.entries(categoriesTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);
  
  // Find biggest goal
  const biggestGoal = goals.reduce((max, g) => 
    (g.target - g.current) > (max.target - max.current) ? g : max, 
    goals[0] || { name: 'a goal', target: 0, current: 0 }
  );
  
  const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
  
  return `Based on your current spending, you've spent ${formatter.format(totalSpent)} this period. Top categories are ${sortedCategories.map(([name, amt]) => `**${name}** (${formatter.format(amt)})`).join(', ')}. Your biggest savings goal is **${biggestGoal.name}** — you need ${formatter.format(biggestGoal.target - biggestGoal.current)} more to reach it!`;
}

const useAppStore = create<StoreState>()(
  persist(
    (set, get) => {
      return {
        // Initialize with empty data
        transactions: [],
        categoriesTotals: {},
        budgets: { needs: 0, wants: 0, savings: 0 },
        goals: [],
        alerts: [],
        suggestions: [],
        lessons: lessonsData as any,
        tips: tipsData as any,
        resources: localResources as any,
        
        // UI Preferences
        ui: {
          largeText: false,
          darkMode: false,
          needsAlertDismissed: null,
        },
        setLargeText: (value: boolean) => {
          set((state) => ({
            ui: { ...state.ui, largeText: value },
          }));
        },
        setDarkMode: (value: boolean) => {
          // Apply to DOM immediately
          if (typeof window !== 'undefined') {
            document.documentElement.classList.toggle('dark', value);
            localStorage.setItem('finmate-theme', value ? 'dark' : 'light');
          }
          set((state) => ({
            ui: { ...state.ui, darkMode: value },
          }));
        },
        dismissNeedsAlert: (weekKey: string) => {
          set((state) => ({
            ui: { ...state.ui, needsAlertDismissed: weekKey },
          }));
        },
        
        // Profile
        profile: {
          name: 'Krishna',
          campus: 'Tempe',
          incomeCycle: 'weekly',
          weeklyPlan: 500,
          currency: 'USD',
          roundUpsEnabled: false,
        },
        setProfile: (p: Partial<Profile>) => {
          set((state) => ({
            profile: { ...state.profile, ...p },
          }));
        },
        
        // Coach
        coach: {
          messages: [],
          isThinking: false,
          isTyping: false,
        },
        
        sendUserMessage: (text: string) => {
          const userMsg: ChatMessage = {
            id: `msg-${Date.now()}-user`,
            role: 'user',
            text,
            ts: Date.now(),
          };
          set((state) => ({
            coach: {
              ...state.coach,
              messages: [...state.coach.messages, userMsg],
            },
          }));
        },
        
        respondDemoOrRule: async () => {
          const state = get();
          
          // Step 1: Show thinking state
          set((s) => ({
            coach: { ...s.coach, isThinking: true },
          }));
          
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
          // Step 2: Get the last user message
          const lastUserMsg = [...state.coach.messages].reverse().find((m) => m.role === 'user');
          if (!lastUserMsg) return;
          
          // Step 3: Generate response
          const prelude = getRandomItem(THINKING_PRELUDES);
          let answer = findDemoAnswer(lastUserMsg.text);
          if (!answer) {
            answer = generateRuleFallback(state);
          }
          const fullResponse = `${prelude} ${answer}`;
          
          // Step 4: Create initial coach message
          const coachMsg: ChatMessage = {
            id: `msg-${Date.now()}-coach`,
            role: 'coach',
            text: '',
            ts: Date.now(),
          };
          
          set((s) => ({
            coach: {
              ...s.coach,
              isThinking: false,
              isTyping: true,
              messages: [...s.coach.messages, coachMsg],
            },
          }));
          
          // Step 5: Stream characters
          let currentText = '';
          for (let i = 0; i < fullResponse.length; i++) {
            currentText += fullResponse[i];
            const delay = 40 + Math.random() * 20; // 40-60ms
            
            await new Promise((resolve) => setTimeout(resolve, delay));
            
            set((s) => {
              const messages = [...s.coach.messages];
              const lastMsg = messages[messages.length - 1];
              if (lastMsg && lastMsg.role === 'coach') {
                lastMsg.text = currentText;
              }
              return {
                coach: { ...s.coach, messages },
              };
            });
          }
          
          // Step 6: Done typing
          set((s) => ({
            coach: { ...s.coach, isTyping: false },
          }));
        },
        
        // Data Management
        loadSeeds: () => {
          const transactions = transactionsData as Transaction[];
          const goals = goalsData as Goal[];
          const categoriesTotals = categorizeTransactions(transactions, categoriesMap as Record<string, string>);
          const budgets = computeBudgetSummary(categoriesTotals);
          const alerts = generateAlerts(transactions, categoriesTotals, budgets);
          const suggestions = generateSuggestions(categoriesTotals, budgets, localResources as any);
          
          set({
            transactions,
            goals,
            categoriesTotals,
            budgets,
            alerts,
            suggestions,
          });
        },
        
        resetAll: () => {
          const ui = get().ui; // Preserve UI prefs
          set({
            transactions: [],
            categoriesTotals: {},
            budgets: { needs: 0, wants: 0, savings: 0 },
            goals: [],
            alerts: [],
            suggestions: [],
            coach: {
              messages: [],
              isThinking: false,
              isTyping: false,
            },
            ui, // Restore UI prefs
          });
        },
        
        hasData: () => {
          const state = get();
          return state.transactions.length > 0 || state.goals.length > 0;
        },
        
        // Legacy methods
        addContribution: (goalId: string, amount: number) => {
          set((state) => ({
            goals: state.goals.map((g) =>
              g.id === goalId ? { ...g, current: g.current + amount } : g
            ),
          }));
        },
        
        getCoachResponse: (question: string) => {
          const state = get();
          return generateRuleFallback(state);
        },
      };
    },
    {
      name: 'finmate-rubric-store',
      partialize: (state) => ({
        transactions: state.transactions,
        categoriesTotals: state.categoriesTotals,
        budgets: state.budgets,
        goals: state.goals,
        alerts: state.alerts,
        suggestions: state.suggestions,
        ui: state.ui,
        profile: state.profile,
        coach: {
          messages: state.coach.messages,
          isThinking: false,
          isTyping: false,
        },
      }),
    }
  )
);

export default useAppStore;
