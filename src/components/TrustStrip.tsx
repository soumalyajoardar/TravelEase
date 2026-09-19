import React from 'react';
import { TrainFront, BadgeIndianRupee, FileText, CheckCircle2 } from 'lucide-react';

export default function TrustStrip() {
  const trustItems = [
    {
      icon: TrainFront,
      text: "Compare trains and buses"
    },
    {
      icon: BadgeIndianRupee,
      text: "See the full price upfront"
    },
    {
      icon: FileText,
      text: "Clear booking information"
    },
    {
      icon: CheckCircle2,
      text: "Simple, straightforward travel"
    }
  ];

  return (
    <section className="bg-background border-b border-border py-8">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {trustItems.map((item, index) => (
            <div key={index} className="flex flex-col items-center text-center space-y-3">
              <div className="text-secondary">
                <item.icon className="w-8 h-8" strokeWidth={1.5} />
              </div>
              <p className="text-primary font-medium text-sm md:text-base max-w-[200px]">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
