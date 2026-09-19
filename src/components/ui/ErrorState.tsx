import React from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';
import Link from 'next/link';

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  primaryAction?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  referenceId?: string;
}

export default function ErrorState({ 
  title = "Something went wrong", 
  description = "TravelEase couldn't complete this request right now.", 
  onRetry,
  primaryAction,
  referenceId
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 md:p-12 text-center max-w-md mx-auto">
      <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
        <AlertCircle className="w-8 h-8 text-red-500" aria-hidden="true" />
      </div>
      <h3 className="text-xl font-bold text-primary mb-2">{title}</h3>
      <p className="text-secondary mb-2 leading-relaxed">
        {description}
      </p>
      
      {referenceId && (
        <p className="text-xs text-gray-500 mb-8 font-mono">
          Reference: {referenceId}
        </p>
      )}
      
      {!referenceId && <div className="h-6"></div>}

      <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
        {onRetry && (
          <button 
            onClick={onRetry}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-primary text-white px-6 py-2.5 rounded font-medium hover:bg-opacity-90 transition-opacity"
          >
            <RefreshCcw className="w-4 h-4" />
            <span>Try again</span>
          </button>
        )}
        
        {primaryAction && (
          primaryAction.href ? (
            <Link 
              href={primaryAction.href}
              className={`w-full sm:w-auto px-6 py-2.5 rounded font-medium transition-colors ${
                onRetry 
                  ? 'border border-border text-primary hover:bg-gray-50' 
                  : 'bg-primary text-white hover:bg-opacity-90'
              }`}
            >
              {primaryAction.label}
            </Link>
          ) : (
            <button 
              onClick={primaryAction.onClick}
              className={`w-full sm:w-auto px-6 py-2.5 rounded font-medium transition-colors ${
                onRetry 
                  ? 'border border-border text-primary hover:bg-gray-50' 
                  : 'bg-primary text-white hover:bg-opacity-90'
              }`}
            >
              {primaryAction.label}
            </button>
          )
        )}
      </div>
    </div>
  );
}
