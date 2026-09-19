import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { 
  Map, 
  DollarSign, 
  GitMerge, 
  CheckCircle2, 
  HelpCircle,
  Search
} from 'lucide-react';
import { getPublishedHomepageContent } from '@/services/cmsAdminService';

export const metadata = {
  title: 'About TravelEase | TravelEase',
  description: 'TravelEase brings train and bus options together so you can compare your journey clearly before you book.',
};

export default async function AboutPage() {
  // We can fetch global settings or future about-page specific CMS data here
  const cmsData = await getPublishedHomepageContent();
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        
        {/* Hero Section */}
        <section className="relative w-full bg-primary py-20 md:py-32">
          <div className="absolute inset-0 overflow-hidden">
            <div 
              className="absolute inset-0 bg-primary/40 mix-blend-multiply"
              style={{
                backgroundImage: 'url(/images/hero-train-alt.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
              aria-hidden="true"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-primary/90 via-primary/80 to-primary/90" />
          </div>
          
          <div className="relative max-w-4xl mx-auto px-4 md:px-8 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-6 leading-tight">
              Travel should be easier to compare.
            </h1>
            <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-2xl mx-auto">
              TravelEase brings train and bus options together so you can compare your journey clearly before you book.
            </p>
          </div>
        </section>

        {/* Our Purpose */}
        <section className="py-16 md:py-24 bg-white border-b border-border">
          <div className="max-w-3xl mx-auto px-4 md:px-8 text-center">
            <h2 className="text-3xl font-bold text-primary mb-6">Our purpose</h2>
            <p className="text-lg text-secondary leading-relaxed mb-6">
              Travelers often need to compare different ways of getting from one place to another. 
            </p>
            <p className="text-lg text-secondary leading-relaxed">
              TravelEase aims to make that comparison easier by bringing relevant train and bus information together and showing pricing clearly before booking.
            </p>
          </div>
        </section>

        {/* How TravelEase Helps */}
        <section className="py-16 md:py-24 bg-gray-50 border-b border-border">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
              
              <div className="flex flex-col items-center md:items-start text-center md:text-left">
                <div className="w-12 h-12 bg-white border border-border rounded-lg flex items-center justify-center mb-6 shadow-sm">
                  <GitMerge className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">Compare clearly</h3>
                <p className="text-secondary leading-relaxed">
                  See train and bus options together.
                </p>
              </div>

              <div className="flex flex-col items-center md:items-start text-center md:text-left">
                <div className="w-12 h-12 bg-white border border-border rounded-lg flex items-center justify-center mb-6 shadow-sm">
                  <DollarSign className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">Understand the price</h3>
                <p className="text-secondary leading-relaxed">
                  Know the payable amount before you continue.
                </p>
              </div>

              <div className="flex flex-col items-center md:items-start text-center md:text-left">
                <div className="w-12 h-12 bg-white border border-border rounded-lg flex items-center justify-center mb-6 shadow-sm">
                  <Map className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">Choose for yourself</h3>
                <p className="text-secondary leading-relaxed">
                  Compare time, price and journey details and make your own decision.
                </p>
              </div>

              <div className="flex flex-col items-center md:items-start text-center md:text-left">
                <div className="w-12 h-12 bg-white border border-border rounded-lg flex items-center justify-center mb-6 shadow-sm">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">Keep it simple</h3>
                <p className="text-secondary leading-relaxed">
                  Travel information should not be unnecessarily complicated.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* Transparency Principle */}
        <section className="py-16 md:py-24 bg-white border-b border-border">
          <div className="max-w-3xl mx-auto px-4 md:px-8 text-center">
            <h2 className="text-3xl font-bold text-primary mb-6">Clear information. Clear choices.</h2>
            <p className="text-lg text-secondary leading-relaxed mb-6">
              TravelEase is designed to make the cost and journey information easier to understand before booking.
            </p>
            <p className="text-lg text-secondary leading-relaxed">
              Different travelers have different priorities. Someone may care more about price, travel time, departure time, or comfort. TravelEase aims to present the relevant information so customers can decide which option suits them best.
            </p>
          </div>
        </section>

        {/* Train + Bus */}
        <section className="py-16 md:py-24 bg-gray-50 border-b border-border">
          <div className="max-w-3xl mx-auto px-4 md:px-8 text-center">
            <h2 className="text-3xl font-bold text-primary mb-6">Why train and bus?</h2>
            <p className="text-lg text-secondary leading-relaxed mb-8">
              Some journeys may have several practical options. TravelEase brings train and bus choices into one search experience where available, allowing for a straightforward comparison without switching between different platforms.
            </p>
          </div>
        </section>

        {/* Principles */}
        <section className="py-16 md:py-24 bg-white border-b border-border">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-primary">How we build TravelEase</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
              <div className="flex flex-col text-center border border-border rounded-xl p-8 shadow-sm">
                <h3 className="text-xl font-bold text-primary mb-4">Clarity</h3>
                <p className="text-secondary leading-relaxed">
                  Important information should be easy to understand.
                </p>
              </div>

              <div className="flex flex-col text-center border border-border rounded-xl p-8 shadow-sm">
                <h3 className="text-xl font-bold text-primary mb-4">Transparency</h3>
                <p className="text-secondary leading-relaxed">
                  Prices should be presented clearly.
                </p>
              </div>

              <div className="flex flex-col text-center border border-border rounded-xl p-8 shadow-sm">
                <h3 className="text-xl font-bold text-primary mb-4">Simplicity</h3>
                <p className="text-secondary leading-relaxed">
                  Booking should not feel complicated.
                </p>
              </div>

              <div className="flex flex-col text-center border border-border rounded-xl p-8 shadow-sm">
                <h3 className="text-xl font-bold text-primary mb-4">Customer choice</h3>
                <p className="text-secondary leading-relaxed">
                  Travelers should have the information needed to make their own decision.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTAs */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              
              <div className="bg-white border border-border rounded-xl p-8 md:p-12 text-center shadow-sm flex flex-col items-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                  <Search className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-primary mb-3">Ready to compare your journey?</h3>
                <p className="text-secondary mb-8">
                  Start searching for train and bus options.
                </p>
                <Link 
                  href="/"
                  className="bg-primary text-white px-8 py-3 rounded font-medium hover:bg-opacity-90 transition-opacity w-full sm:w-auto"
                >
                  Search trips
                </Link>
              </div>

              <div className="bg-white border border-border rounded-xl p-8 md:p-12 text-center shadow-sm flex flex-col items-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                  <HelpCircle className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-primary mb-3">Have a question?</h3>
                <p className="text-secondary mb-8">
                  Visit the Help Center or contact TravelEase support.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <Link 
                    href="/help"
                    className="border border-border text-primary px-8 py-3 rounded font-medium hover:bg-gray-50 transition-colors w-full sm:w-auto"
                  >
                    Help Center
                  </Link>
                  <Link 
                    href="/contact"
                    className="border border-border text-primary px-8 py-3 rounded font-medium hover:bg-gray-50 transition-colors w-full sm:w-auto"
                  >
                    Contact support
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </section>

      </main>
      
      <Footer />
    </div>
  );
}
