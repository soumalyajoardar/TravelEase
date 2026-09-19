import React from 'react';
import { Train, Bus, Clock } from 'lucide-react';

export default function ComparisonPreview() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Compare your options
          </h2>
          <p className="text-lg text-secondary max-w-2xl mx-auto">
            See train and bus options side-by-side before you decide.
          </p>
        </div>

        {/* Comparison Cards */}
        <div className="flex flex-col lg:flex-row justify-center items-stretch gap-6 md:gap-8 max-w-5xl mx-auto mb-12">
          
          {/* Train Option */}
          <div className="flex-1 border border-border rounded-lg p-6 hover:shadow-lg transition-shadow bg-white flex flex-col">
            <div className="flex justify-between items-start mb-6 border-b border-border pb-4">
              <div className="flex items-center space-x-3 text-primary">
                <div className="bg-background p-2 rounded">
                  <Train className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Train</h3>
                  <p className="text-sm text-secondary">Departure → Arrival</p>
                </div>
              </div>
              <div className="text-right">
                <span className="block text-2xl font-bold text-primary">₹--</span>
              </div>
            </div>

            <div className="space-y-4 flex-1">
              <div className="flex justify-between items-center">
                <span className="text-secondary text-sm">Departure</span>
                <span className="font-semibold text-primary">--:--</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-secondary text-sm">Arrival</span>
                <span className="font-semibold text-primary">--:--</span>
              </div>
              <div className="flex justify-between items-center text-primary">
                <div className="flex items-center space-x-2 text-secondary">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">Duration</span>
                </div>
                <span className="font-semibold">--h --m</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-secondary text-sm">Travel type</span>
                <span className="font-semibold text-primary">Class</span>
              </div>
            </div>
            
            <button className="mt-8 w-full border border-primary text-primary font-medium py-3 rounded hover:bg-primary hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
              Select Train
            </button>
          </div>

          {/* VS Divider - Desktop Only */}
          <div className="hidden lg:flex flex-col justify-center items-center px-4">
            <span className="text-secondary font-medium text-lg uppercase tracking-widest bg-background px-4 py-2 rounded-full border border-border">
              VS
            </span>
          </div>

          {/* Bus Option */}
          <div className="flex-1 border border-border rounded-lg p-6 hover:shadow-lg transition-shadow bg-white flex flex-col">
            <div className="flex justify-between items-start mb-6 border-b border-border pb-4">
              <div className="flex items-center space-x-3 text-primary">
                <div className="bg-background p-2 rounded">
                  <Bus className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Bus</h3>
                  <p className="text-sm text-secondary">Departure → Arrival</p>
                </div>
              </div>
              <div className="text-right">
                <span className="block text-2xl font-bold text-primary">₹--</span>
              </div>
            </div>

            <div className="space-y-4 flex-1">
              <div className="flex justify-between items-center">
                <span className="text-secondary text-sm">Departure</span>
                <span className="font-semibold text-primary">--:--</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-secondary text-sm">Arrival</span>
                <span className="font-semibold text-primary">--:--</span>
              </div>
              <div className="flex justify-between items-center text-primary">
                <div className="flex items-center space-x-2 text-secondary">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">Duration</span>
                </div>
                <span className="font-semibold">--h --m</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-secondary text-sm">Travel type</span>
                <span className="font-semibold text-primary">Class</span>
              </div>
            </div>
            
            <button className="mt-8 w-full border border-primary text-primary font-medium py-3 rounded hover:bg-primary hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
              Select Bus
            </button>
          </div>

        </div>

        {/* Global CTA */}
        <div className="text-center">
          <button className="bg-primary text-white font-medium text-lg px-8 py-3 rounded hover:bg-opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
            View full comparison
          </button>
        </div>

      </div>
    </section>
  );
}
