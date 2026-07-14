import React from 'react';

interface WeilyWordmarkProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function WeilyWordmark({ className = "", size = "md" }: WeilyWordmarkProps) {
  // Determine text size based on prop
  const textSizeClass = {
    sm: 'text-xl sm:text-2xl',
    md: 'text-2xl sm:text-3xl',
    lg: 'text-3xl sm:text-4xl'
  }[size];

  return (
    <div className={`flex items-center justify-center select-none leading-none ${className}`}>
      {/* Lowercase weily wordmark with 'w' in white and 'eily' in green */}
      <span className={`${textSizeClass} font-amazon font-bold tracking-tight text-white lowercase`}>
        w<span className="text-emerald-400">eily</span>
      </span>
    </div>
  );
}
