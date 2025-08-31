
import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-8">
      <div className="w-16 h-16 border-4 border-t-4 border-brand-lightblue border-t-transparent rounded-full animate-spin"></div>
      <p className="text-brand-text font-semibold">Analyzing your potential...</p>
    </div>
  );
};
