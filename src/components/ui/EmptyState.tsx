import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface EmptyStateProps {
  icon: typeof LucideIcon;
  title: string;
  description: string;
  primaryAction?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  secondaryAction?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

export default function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  primaryAction, 
  secondaryAction 
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 md:p-12 text-center max-w-md mx-auto">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <Icon className="w-8 h-8 text-secondary" aria-hidden="true" />
      </div>
      <h3 className="text-xl font-bold text-primary mb-2">{title}</h3>
      <p className="text-secondary mb-8 leading-relaxed">
        {description}
      </p>
      
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
        {primaryAction && (
          primaryAction.href ? (
            <Link 
              href={primaryAction.href}
              className="w-full sm:w-auto bg-primary text-white px-6 py-2.5 rounded font-medium hover:bg-opacity-90 transition-opacity"
            >
              {primaryAction.label}
            </Link>
          ) : (
            <button 
              onClick={primaryAction.onClick}
              className="w-full sm:w-auto bg-primary text-white px-6 py-2.5 rounded font-medium hover:bg-opacity-90 transition-opacity"
            >
              {primaryAction.label}
            </button>
          )
        )}
        
        {secondaryAction && (
          secondaryAction.href ? (
            <Link 
              href={secondaryAction.href}
              className="w-full sm:w-auto border border-border text-primary px-6 py-2.5 rounded font-medium hover:bg-gray-50 transition-colors"
            >
              {secondaryAction.label}
            </Link>
          ) : (
            <button 
              onClick={secondaryAction.onClick}
              className="w-full sm:w-auto border border-border text-primary px-6 py-2.5 rounded font-medium hover:bg-gray-50 transition-colors"
            >
              {secondaryAction.label}
            </button>
          )
        )}
      </div>
    </div>
  );
}
