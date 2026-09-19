"use client";

import React, { useEffect, useState } from 'react';
import { getPublishedHelpArticles, HelpArticle } from '@/services/helpService';
import { Search, ChevronRight, Ticket, CreditCard, Undo2, Map, Users, HelpCircle } from 'lucide-react';
import Link from 'next/link';

const CATEGORIES = [
  { name: 'Bookings', icon: Ticket, desc: 'Managing and finding your bookings' },
  { name: 'Payments', icon: CreditCard, desc: 'Payment methods and issues' },
  { name: 'Cancellation & Refunds', icon: Undo2, desc: 'How to cancel and get refunded' },
  { name: 'Travel Guide', icon: Map, desc: 'Boarding, luggage, and journey info' },
  { name: 'Account', icon: Users, desc: 'Managing your profile and security' },
  { name: 'Other', icon: HelpCircle, desc: 'General inquiries and policies' }
];

export default function HelpCenterClient() {
  const [articles, setArticles] = useState<HelpArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getPublishedHelpArticles();
        setArticles(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  if (isLoading) return null; // Fallback to Suspense

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      
      {/* Header & Search */}
      <div className="text-center mb-16">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">How can we help?</h1>
        <p className="text-secondary text-lg mb-8 max-w-2xl mx-auto">
          Find answers about bookings, payments, cancellations, refunds and travel.
        </p>
        
        <div className="max-w-xl mx-auto relative">
          <label htmlFor="help-search" className="sr-only">Search help</label>
          <div className="relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary" />
            <input 
              id="help-search"
              type="text"
              placeholder="Search help articles..."
              className="w-full pl-12 pr-4 py-3.5 rounded-lg border border-border focus:outline-none focus:border-primary shadow-sm text-base"
              disabled={articles.length === 0}
            />
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="mb-16">
        <h2 className="text-xl font-bold text-primary mb-6">Browse by category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {CATEGORIES.map(cat => (
            <div key={cat.name} className="border border-border rounded-lg p-5 bg-white hover:border-primary transition-colors cursor-pointer group flex flex-col">
              <cat.icon className="w-6 h-6 text-primary mb-3" />
              <h3 className="font-semibold text-primary mb-1 group-hover:text-primary transition-colors">{cat.name}</h3>
              <p className="text-sm text-secondary line-clamp-2">{cat.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Featured / Articles (Empty State handled here) */}
      <div className="mb-16">
        <h2 className="text-xl font-bold text-primary mb-6">Common questions</h2>
        {articles.length === 0 ? (
          <div className="bg-gray-50 border border-border rounded-lg p-8 text-center">
            <HelpCircle className="w-8 h-8 text-secondary mx-auto mb-3" />
            <p className="text-primary font-medium mb-1">Help articles are being prepared.</p>
            <p className="text-sm text-secondary">Our team is currently writing documentation.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {articles.map(article => (
              <Link 
                key={article.id} 
                href={`/help/article/${article.slug}`}
                className="block bg-white border border-border rounded-lg p-4 hover:border-primary transition-colors flex justify-between items-center group"
              >
                <div>
                  <h3 className="font-medium text-primary mb-1">{article.title}</h3>
                  <p className="text-sm text-secondary">{article.category}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-secondary group-hover:text-primary transition-colors" />
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Support CTA */}
      <div className="bg-primary/5 border border-primary/10 rounded-xl p-8 text-center">
        <h2 className="text-xl font-bold text-primary mb-2">Still need help?</h2>
        <p className="text-secondary mb-6 max-w-md mx-auto">
          If you couldn't find the answer you're looking for, our support team is here to help.
        </p>
        <Link 
          href="/contact"
          className="inline-block bg-primary text-white font-medium px-6 py-2.5 rounded hover:bg-opacity-90 transition-opacity"
        >
          Contact support
        </Link>
      </div>

    </div>
  );
}
