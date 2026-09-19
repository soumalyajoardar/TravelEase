import React from 'react';

export default function CheckoutProgress({ currentStep }: { currentStep: number }) {
  const steps = [
    { num: 1, label: "Trip" },
    { num: 2, label: "Passenger details" },
    { num: 3, label: "Payment" },
    { num: 4, label: "Confirmation" }
  ];

  return (
    <div className="bg-white border-b border-border py-4 shadow-sm mb-6 md:mb-8">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 flex justify-center">
        <div className="flex items-center space-x-2 md:space-x-4 max-w-2xl w-full justify-between relative">
          
          {/* Background connector line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2 z-0" aria-hidden="true" />

          {steps.map((step) => {
            const isActive = step.num === currentStep;
            const isCompleted = step.num < currentStep;

            return (
              <div key={step.num} className="relative z-10 flex flex-col items-center bg-white px-2">
                <div 
                  className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs md:text-sm font-bold border-2 transition-colors ${
                    isActive ? 'border-primary bg-primary text-white' : 
                    isCompleted ? 'border-primary bg-white text-primary' : 
                    'border-border bg-white text-secondary'
                  }`}
                >
                  {isCompleted ? '✓' : step.num}
                </div>
                <span 
                  className={`text-[10px] md:text-xs font-medium mt-1 md:mt-2 text-center absolute top-full w-24 -ml-12 left-1/2 ${
                    isActive ? 'text-primary' : 'text-secondary'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
