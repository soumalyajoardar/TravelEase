import React from 'react';
import { LucideIcon } from 'lucide-react';

interface AdminEmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel: string;
  onAction?: () => void;
}

export default function AdminEmptyState({ icon: Icon, title, description, actionLabel, onAction }: AdminEmptyStateProps) {
  return (
    <div className="bg-white border border-border rounded-lg p-12 text-center shadow-sm w-full">
      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-border">
        <Icon className="w-8 h-8 text-secondary" />
      </div>
      <h3 className="text-lg font-bold text-primary mb-2">{title}</h3>
      <p className="text-secondary text-sm mb-6 max-w-sm mx-auto">{description}</p>
      <button 
        onClick={onAction}
        className="bg-primary text-white text-sm font-medium px-6 py-2.5 rounded hover:bg-opacity-90 transition-opacity"
      >
        {actionLabel}
      </button>
    </div>
  );
}
