import React from 'react';

export default function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Search",
      desc: "Enter where you are travelling from and where you want to go."
    },
    {
      num: "02",
      title: "Compare",
      desc: "See available train and bus options together."
    },
    {
      num: "03",
      title: "Choose",
      desc: "Compare price, timing, duration and travel details."
    },
    {
      num: "04",
      title: "Book",
      desc: "Select the option that suits you and complete your booking."
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white border-y border-border">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            How TravelEase works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative">
          
          {/* Connecting Line - Desktop Only */}
          <div className="hidden lg:block absolute top-8 left-[12%] right-[12%] h-[2px] bg-border z-0" aria-hidden="true" />
          
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center relative z-10">
              <div className="w-16 h-16 rounded-full bg-background border-2 border-primary flex items-center justify-center mb-6">
                <span className="text-2xl font-bold text-primary">{step.num}</span>
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">{step.title}</h3>
              <p className="text-secondary max-w-xs">
                {step.desc}
              </p>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}
