import React from 'react';

export default function FinalCTA() {
  return (
    <section className="py-20 md:py-32 bg-white border-b border-border">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
          Ready to plan your journey?
        </h2>
        <p className="text-xl text-secondary mb-10 max-w-2xl mx-auto">
          Compare your options and find a trip that works for you.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <button className="bg-primary hover:bg-opacity-90 text-white font-medium text-lg px-8 py-4 rounded transition-opacity focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 w-full sm:w-auto">
            Search trips
          </button>
          <button className="bg-white border-2 border-primary text-primary hover:bg-background font-medium text-lg px-8 py-4 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 w-full sm:w-auto">
            Learn more
          </button>
        </div>
      </div>
    </section>
  );
}
