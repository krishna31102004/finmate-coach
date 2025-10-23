"use client";

import React from 'react';
import useAppStore from '@/store/useAppStore';
import LessonCard from '@/components/LessonCard';

export default function LearnPage() {
  const lessons = useAppStore((state) => state.lessons);
  return (
    <main className="p-4 space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-textHeading dark:text-slate-100 mb-2">
          Learning Hub
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Quick lessons to build your financial confidence.
        </p>
      </div>
      <div className="space-y-4">
        {lessons.map((lesson) => (
          <LessonCard key={lesson.id} lesson={lesson} />
        ))}
      </div>
    </main>
  );
}
