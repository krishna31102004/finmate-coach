import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

interface Props {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export default function ChatBox({ onSend, disabled = false }: Props) {
  const [text, setText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (text.trim() && !disabled) {
      onSend(text.trim());
      setText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    } else if (e.key === 'Escape') {
      setText('');
      inputRef.current?.blur();
    }
  };

  useEffect(() => {
    // Focus input when component mounts
    if (!disabled) {
      inputRef.current?.focus();
    }
  }, [disabled]);

  return (
    <div className="flex space-x-2">
      <input
        ref={inputRef}
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className="flex-1 border border-surface dark:border-gray-700 px-4 py-3 rounded-xl bg-white dark:bg-gray-800 text-textBody dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        placeholder={disabled ? "Coach is typing..." : "Ask a question..."}
        aria-label="Chat message input"
      />
      <button
        onClick={handleSend}
        disabled={!text.trim() || disabled}
        className="px-6 py-3 bg-primary dark:bg-blue-600 text-white rounded-xl font-semibold hover:bg-primary/90 dark:hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2 shadow-md"
        aria-label="Send message"
      >
        <Send className="w-5 h-5" />
        <span className="hidden md:inline">Send</span>
      </button>
    </div>
  );
}
