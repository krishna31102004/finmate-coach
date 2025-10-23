import React from 'react';

interface Props {
  role: 'user' | 'coach';
  text: string;
  isTyping?: boolean;
}

export default function MessageBubble({ role, text, isTyping = false }: Props) {
  const isUser = role === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-${isUser ? 'right' : 'left'}-2 duration-200`}>
      <div
        className={`px-4 py-3 rounded-2xl max-w-[80%] md:max-w-[70%] shadow-sm ${
          isUser
            ? 'bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-700 dark:to-blue-600 text-white'
            : 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/40 dark:to-indigo-900/40 text-textBody dark:text-gray-200 border border-blue-200 dark:border-blue-700'
        }`}
      >
        {!isUser && (
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-xl">🤖</span>
            <span className="text-xs font-semibold text-primary dark:text-blue-400">FinMate Coach</span>
          </div>
        )}
        <div className="text-sm md:text-base whitespace-pre-wrap break-words">
          {text}
          {isTyping && <span className="typing-caret"></span>}
        </div>
      </div>
    </div>
  );
}
