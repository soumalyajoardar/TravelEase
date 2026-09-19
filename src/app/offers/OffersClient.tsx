"use client";

import React, { useEffect, useState } from 'react';
import { getActiveOffers, Offer } from '@/services/offerService';
import { Tag, Copy, CheckCircle2, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function OffersClient() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    loadOffers();
  }, []);

  async function loadOffers() {
    try {
      setIsLoading(true);
      setError(false);
      const data = await getActiveOffers();
      setOffers(data);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  }

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDiscount = (offer: Offer) => {
    if (offer.discount_type === 'percentage') {
      return `${offer.discount_value}% off`;
    }
    return `₹${(offer.discount_value / 100).toFixed(0)} off`;
  };

  if (isLoading) {
    // Relying on Suspense fallback primarily, but Client fallback if needed
    return null;
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-2xl font-bold text-primary mb-2">Unable to load offers</h1>
        <p className="text-secondary mb-6">Please try again.</p>
        <button 
          onClick={loadOffers}
          className="bg-primary text-white font-medium px-6 py-2.5 rounded hover:bg-opacity-90 transition-opacity"
        >
          Retry
        </button>
      </div>
    );
  }

  if (offers.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-border">
          <Tag className="w-8 h-8 text-secondary" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-primary mb-3">No offers available right now</h1>
        <p className="text-secondary text-lg mb-8 max-w-md mx-auto">
          Check back later for new TravelEase offers. New TravelEase offers will appear here when available.
        </p>
        <Link 
          href="/"
          className="bg-primary text-white font-medium px-8 py-3 rounded hover:bg-opacity-90 transition-opacity"
        >
          Search trips
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">Offers</h1>
        <p className="text-secondary text-lg">
          Explore available TravelEase offers and savings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {offers.map(offer => (
          <div key={offer.id} className="bg-white border border-border rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col">
            <div className="p-6 md:p-8 flex-1">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-primary pr-4">{offer.title}</h2>
                <div className="bg-primary/5 text-primary text-sm font-bold px-3 py-1 rounded-full whitespace-nowrap">
                  {formatDiscount(offer)}
                </div>
              </div>
              
              <p className="text-secondary mb-6">{offer.description}</p>
              
              <div className="space-y-2 text-sm mb-8">
                {offer.travel_type && offer.travel_type !== 'all' && (
                  <div className="flex items-center text-secondary">
                    <span className="font-medium mr-2 text-primary">Eligibility:</span>
                    <span className="capitalize">{offer.travel_type} bookings only</span>
                  </div>
                )}
                {offer.min_booking_amount && (
                  <div className="flex items-center text-secondary">
                    <span className="font-medium mr-2 text-primary">Min. Booking:</span>
                    <span>₹{(offer.min_booking_amount / 100).toFixed(0)}</span>
                  </div>
                )}
                <div className="flex items-center text-secondary">
                  <span className="font-medium mr-2 text-primary">Valid until:</span>
                  <span>{formatDate(offer.end_at)}</span>
                </div>
              </div>
            </div>

            <div className="px-6 md:px-8 py-5 bg-gray-50 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between rounded-b-xl gap-4">
              
              {offer.coupon_code ? (
                <div className="flex items-center">
                  <div className="border border-dashed border-gray-300 bg-white px-4 py-2 rounded-l font-mono font-bold text-primary tracking-wider">
                    {offer.coupon_code}
                  </div>
                  <button 
                    onClick={() => handleCopy(offer.coupon_code!)}
                    className="bg-white border border-l-0 border-gray-300 px-3 py-2 rounded-r hover:bg-gray-50 transition-colors flex items-center justify-center h-[42px]"
                    aria-label={`Copy coupon code ${offer.coupon_code}`}
                  >
                    {copiedCode === offer.coupon_code ? (
                      <CheckCircle2 className="w-5 h-5 text-success" />
                    ) : (
                      <Copy className="w-5 h-5 text-secondary" />
                    )}
                  </button>
                  {copiedCode === offer.coupon_code && (
                    <span className="ml-3 text-xs font-medium text-success absolute mt-12 sm:mt-0 sm:relative">Copied!</span>
                  )}
                </div>
              ) : (
                <div className="text-sm font-medium text-secondary">
                  Applied automatically
                </div>
              )}

              <button className="text-primary font-semibold text-sm flex items-center hover:underline group shrink-0">
                View offer details
                <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </button>

            </div>
          </div>
        ))}
      </div>
      
    </div>
  );
}
