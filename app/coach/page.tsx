"use client";

import React, { useState, useRef, useEffect, Suspense } from 'react';
import useAppStore from '@/store/useAppStore';
import ChatBox from '@/components/ChatBox';
import MessageBubble from '@/components/MessageBubble';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';

const QUICK_PROMPTS = [
  "Where did my money go?",
  "How do I start saving?",
  "Am I on track this week?",
  "Is this a subscription?",
  "If I invest $10/wk?",
];

function CoachContent() {
  const { coach, sendUserMessage, respondDemoOrRule } = useAppStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const [hasPrefilled, setHasPrefilled] = useState(false);

  const handleSend = async (text: string) => {
    sendUserMessage(text);
    // Small delay to ensure the user message is rendered before responding
    setTimeout(() => {
      respondDemoOrRule();
    }, 100);
  };

  const handleQuickPrompt = (prompt: string) => {
    handleSend(prompt);
  };

  // Handle prefilled query from URL
  useEffect(() => {
    const prefillQuery = searchParams.get('prefill');
    if (prefillQuery && !hasPrefilled && coach.messages.length === 0) {
      setHasPrefilled(true);
      setTimeout(() => {
        handleSend(prefillQuery);
      }, 300);
    }
  }, [searchParams, hasPrefilled, coach.messages.length]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [coach.messages, coach.isThinking]);

  return (
    <main className="p-4 space-y-4 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-textHeading dark:text-gray-100">💬 Coach</h1>
          <p className="text-sm text-textBody dark:text-gray-300 mt-1">
            Ask me anything about your finances!
          </p>
        </div>
      </div>

      {/* Quick Prompts */}
      {coach.messages.length === 0 && (
        <div className="space-y-2">
          <p className="text-sm text-textBody dark:text-gray-400 font-medium">Quick questions:</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickPrompt(prompt)}
                className="px-3 py-2 text-xs md:text-sm bg-primary/10 dark:bg-blue-900/30 text-primary dark:text-blue-300 rounded-full border border-primary/20 dark:border-blue-700 hover:bg-primary/20 dark:hover:bg-blue-900/50 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-blue-400 transition-all hover:scale-105"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div className="border border-surface dark:border-gray-700 rounded-2xl p-4 h-[500px] overflow-y-auto bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm shadow-inner space-y-3">
        {coach.messages.length === 0 && (
          <div className="flex items-center justify-center h-full text-center">
            <div className="space-y-2">
              <div className="text-4xl">🤖</div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Start a conversation by sending a message or using a quick prompt above!
              </p>
            </div>
          </div>
        )}
        
        {coach.messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            role={msg.role}
            text={msg.text}
            isTyping={msg.role === 'coach' && msg.id === coach.messages[coach.messages.length - 1]?.id && coach.isTyping}
          />
        ))}
        
        {/* Thinking indicator */}
        {coach.isThinking && (
          <div className="flex justify-start">
            <div className="px-4 py-3 rounded-2xl bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 border border-blue-200 dark:border-blue-700 shadow-sm max-w-[70%]">
              <div className="flex items-center space-x-1">
                <span className="thinking-dot bg-blue-600 dark:bg-blue-400"></span>
                <span className="thinking-dot bg-blue-600 dark:bg-blue-400"></span>
                <span className="thinking-dot bg-blue-600 dark:bg-blue-400"></span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <ChatBox onSend={handleSend} disabled={coach.isThinking || coach.isTyping} />
    </main>
  );
}

export default function CoachPage() {
  return (
    <Suspense fallback={
      <main className="p-4 space-y-4 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-textHeading dark:text-gray-100">💬 Coach</h1>
            <p className="text-sm text-textBody dark:text-gray-300 mt-1">
              Loading...
            </p>
          </div>
        </div>
      </main>
    }>
      <CoachContent />
    </Suspense>
  );
}
