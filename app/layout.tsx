'use client';

import './globals.css';
import Link from 'next/link';
import { ReactNode, useEffect } from 'react';
import useAppStore from '@/store/useAppStore';

function NavBar() {
  return (
    <nav className="flex flex-wrap items-center justify-center md:justify-start space-x-4 px-6 py-4 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border-b border-surface dark:border-slate-700 shadow-sm text-sm">
      <Link href="/" className="text-primary dark:text-blue-400 font-medium hover:underline">Dashboard</Link>
      <Link href="/coach" className="text-primary dark:text-blue-400 font-medium hover:underline">Coach</Link>
      <Link href="/goals" className="text-primary dark:text-blue-400 font-medium hover:underline">Goals</Link>
      <Link href="/learn" className="text-primary dark:text-blue-400 font-medium hover:underline">Learn</Link>
      <Link href="/invest" className="text-primary dark:text-blue-400 font-medium hover:underline">Invest</Link>
      <Link href="/settings" className="text-primary dark:text-blue-400 font-medium hover:underline">Settings</Link>
    </nav>
  );
}

export default function RootLayout({ children }: { children: ReactNode }) {
  const { ui } = useAppStore();

  useEffect(() => {
    // On mount, check localStorage for theme preference
    const savedTheme = localStorage.getItem('finmate-theme');
    const isDark = savedTheme === 'dark';
    document.documentElement.classList.toggle('dark', isDark);
    
    // Apply dark mode from store
    if (ui.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Apply large text
    if (ui.largeText) {
      document.body.setAttribute('data-lg', 'true');
    } else {
      document.body.setAttribute('data-lg', 'false');
    }
  }, [ui.darkMode, ui.largeText]);

  return (
    <html lang="en" className="h-full">
      <body className="min-h-screen h-full bg-gradient-to-br from-[#F8FAFF] via-[#F4F6FF] to-[#EAF3FF] dark:from-[#0b1220] dark:via-[#0b1220] dark:to-[#0b1220] text-textBody dark:text-gray-200 font-sans">
        <NavBar />
        <main className="max-w-6xl mx-auto py-10 px-6">
          <div className="backdrop-blur-md bg-white/80 dark:bg-slate-900/60 shadow-xl rounded-2xl p-6 space-y-8">
            {children}
            <footer className="pt-6 border-t border-surface dark:border-gray-700 text-xs text-center text-textBody dark:text-gray-400">
              <p>FinMate by ASU Student Innovation Team • ASU Edition 1.0</p>
            </footer>
          </div>
        </main>
      </body>
    </html>
  );
}