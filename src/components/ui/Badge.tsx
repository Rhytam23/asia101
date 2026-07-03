import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'emerald' | 'blue' | 'amber' | 'red' | 'slate';
  className?: string;
}

export function Badge({ children, variant = 'slate', className = '' }: BadgeProps) {
  const variants = {
    emerald: 'bg-emerald-50/80 text-emerald-700 border-emerald-200/60',
    blue: 'bg-blue-50/80 text-blue-700 border-blue-200/60',
    amber: 'bg-amber-50/80 text-amber-700 border-amber-200/60',
    red: 'bg-red-50/80 text-red-700 border-red-200/60',
    slate: 'bg-slate-50/80 text-slate-700 border-slate-200/60',
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold tracking-wider uppercase border backdrop-blur-sm ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
