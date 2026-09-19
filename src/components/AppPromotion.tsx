import React from 'react';
import { Smartphone, Train, Bus } from 'lucide-react';

export default function AppPromotion() {
  return (
    <section className="py-16 md:py-24 bg-primary text-white overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          
          {/* Text Content */}
          <div className="flex-1 text-center md:text-left z-10">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              TravelEase wherever you go.
            </h2>
            <p className="text-lg md:text-xl text-white/80 mb-8 max-w-lg mx-auto md:mx-0">
              Keep your bookings and trip details close at hand. The TravelEase mobile experience is being built to make managing your journeys simple and fast.
            </p>
            <div className="inline-block bg-white/10 border border-white/20 px-6 py-3 rounded-full">
              <span className="font-semibold text-accent">Coming soon</span>
            </div>
          </div>

          {/* App Mockup UI */}
          <div className="flex-1 flex justify-center md:justify-end relative">
            <div className="w-[280px] h-[580px] bg-background rounded-[40px] border-[8px] border-white/20 shadow-2xl relative overflow-hidden flex flex-col">
              
              {/* Mockup Top Bar */}
              <div className="bg-primary pt-12 pb-6 px-6 text-white shrink-0">
                <div className="font-bold text-lg mb-4">TravelEase</div>
                <div className="bg-white/20 rounded h-10 w-full mb-4"></div>
                <div className="flex space-x-2">
                  <div className="bg-white/20 rounded h-8 flex-1"></div>
                  <div className="bg-white/20 rounded h-8 flex-1"></div>
                </div>
              </div>

              {/* Mockup Content Area */}
              <div className="flex-1 bg-background p-4 space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-border flex items-center space-x-4">
                  <div className="bg-background p-2 rounded text-primary">
                    <Train className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                    <div className="h-3 bg-gray-100 rounded w-16"></div>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm border border-border flex items-center space-x-4">
                  <div className="bg-background p-2 rounded text-primary">
                    <Bus className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                    <div className="h-3 bg-gray-100 rounded w-12"></div>
                  </div>
                </div>
              </div>

              {/* Mockup Bottom Navigation */}
              <div className="bg-white border-t border-border h-16 flex justify-around items-center px-4 shrink-0 text-secondary">
                <Smartphone className="w-6 h-6 text-primary" />
                <div className="w-6 h-6 rounded-full bg-gray-200"></div>
                <div className="w-6 h-6 rounded-full bg-gray-200"></div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
