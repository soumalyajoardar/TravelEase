import React from 'react';
import { Tag, CalendarHeart, Sparkles } from 'lucide-react';

export default function Offers() {
  const offers = [
    {
      icon: Tag,
      title: "First booking",
      desc: "Special introductory offer for new TravelEase customers.",
      action: "Learn more",
      active: true
    },
    {
      icon: CalendarHeart,
      title: "Weekend travel",
      desc: "Check available fares for upcoming weekend journeys.",
      action: "Check fares",
      active: true
    },
    {
      icon: Sparkles,
      title: "Coming soon",
      desc: "More TravelEase offers are on the way. Stay tuned.",
      action: "Stay updated",
      active: false
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Offers and travel deals
          </h2>
          <p className="text-lg text-secondary">
            Simple, straightforward ways to save on your next trip.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {offers.map((offer, index) => (
            <div 
              key={index} 
              className={`border border-border rounded-lg p-6 flex flex-col ${offer.active ? 'bg-background hover:shadow-md transition-shadow' : 'bg-gray-50 opacity-80'}`}
            >
              <div className="mb-6">
                <div className="bg-white p-3 rounded-full inline-block mb-4 shadow-sm">
                  <offer.icon className={`w-6 h-6 ${offer.active ? 'text-accent' : 'text-secondary'}`} />
                </div>
                <h3 className="text-xl font-bold text-primary mb-2">{offer.title}</h3>
                <p className="text-secondary">{offer.desc}</p>
              </div>
              
              <div className="mt-auto pt-6">
                <button className={`font-medium focus:outline-none focus:underline ${offer.active ? 'text-primary hover:text-accent' : 'text-secondary cursor-not-allowed'}`}>
                  {offer.action}
                </button>
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
}
