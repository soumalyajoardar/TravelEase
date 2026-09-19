import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function TransparentPricing() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-24 max-w-6xl mx-auto">
          
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 bg-success/10 text-success px-4 py-2 rounded-full mb-6 border border-success/20">
              <ShieldCheck className="w-5 h-5" />
              <span className="font-semibold text-sm">Transparent Pricing</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
              Know the price before you book.
            </h2>
            <p className="text-lg text-secondary mb-8 max-w-lg mx-auto lg:mx-0">
              See the complete payable amount clearly before you continue. We believe in showing you the full cost upfront so you can make an informed decision without surprises at checkout.
            </p>
            <ul className="space-y-4 text-left max-w-md mx-auto lg:mx-0 text-primary font-medium">
              <li className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full bg-primary" aria-hidden="true" />
                <span>Clear breakdown of base fares</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full bg-primary" aria-hidden="true" />
                <span>Exact tax amounts shown</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full bg-primary" aria-hidden="true" />
                <span>Straightforward service fees</span>
              </li>
            </ul>
          </div>

          {/* Pricing Card */}
          <div className="flex-1 w-full max-w-md">
            <div className="bg-white border border-border rounded-xl shadow-lg p-6 md:p-8">
              <h3 className="font-bold text-xl text-primary mb-6 border-b border-border pb-4">
                Fare Breakdown
              </h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center text-secondary">
                  <span>Base fare</span>
                  <span className="font-medium text-primary">₹750</span>
                </div>
                <div className="flex justify-between items-center text-secondary">
                  <span>Taxes</span>
                  <span className="font-medium text-primary">₹45</span>
                </div>
                <div className="flex justify-between items-center text-secondary">
                  <span>Service fee</span>
                  <span className="font-medium text-primary">₹30</span>
                </div>
              </div>

              <div className="border-t border-border pt-6 mt-6">
                <div className="flex justify-between items-end">
                  <div>
                    <span className="block text-primary font-bold text-2xl">Total</span>
                    <span className="text-sm text-secondary">Complete payable amount</span>
                  </div>
                  <span className="text-4xl font-bold text-primary">₹825</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
