import React from 'react';

interface LoadingStateProps {
  message?: string;
  fullScreen?: boolean;
}

export default function LoadingState({ 
  message = "Loading...", 
  fullScreen = false 
}: LoadingStateProps) {
  
  const content = (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
      <div 
        className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" 
        role="status"
        aria-label="Loading"
      />
      <p className="text-sm font-medium text-secondary" aria-live="polite">
        {message}
      </p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
}
