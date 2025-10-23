"use client";

import React, { useState } from 'react';

interface Lesson {
  id: string;
  title: string;
  content: string;
}

export default function LessonCard({ lesson }: { lesson: Lesson }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm p-4 hover:shadow-md transition-shadow">
      <h3 className="font-semibold text-lg text-textHeading dark:text-slate-100">{lesson.title}</h3>
      {open ? (
        <p className="mt-3 text-sm text-textBody dark:text-slate-300 leading-relaxed">{lesson.content}</p>
      ) : (
        <button
          className="text-primary dark:text-blue-400 underline mt-2 text-sm hover:opacity-80 focus:outline-none transition-opacity"
          onClick={() => setOpen(true)}
        >
          Read more
        </button>
      )}
    </div>
  );
}
