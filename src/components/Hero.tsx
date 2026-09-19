import React from 'react';
import SearchCard from './SearchCard';
import { HomepageContent } from '@/services/cmsAdminService';

interface HeroProps {
  cmsData?: HomepageContent | null;
}

export default function Hero({ cmsData }: HeroProps) {
  const title = cmsData?.hero_title || 'Your journey. Your choice.';
  const subtitle = cmsData?.hero_subtitle || 'Compare trains and buses in one place, see the complete price upfront, and choose the option that works best for you.';
  // Default image or CMS image
  const bgImage = cmsData?.hero_image_url || '/images/hero-train.jpg';

  return (
    <section className="relative w-full">
      {/* Background Image Container */}
      <div className="relative min-h-[650px] lg:min-h-[650px] w-full overflow-hidden pb-12 lg:pb-0">
        {/* Placeholder for real image: use an img tag pointing to local asset */}
        <div 
          className="absolute inset-0 bg-primary/20"
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: '#0B1F33' // fallback color
          }}
          aria-hidden="true"
        />
        {/* Overlay to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1F33]/80 via-[#0B1F33]/40 to-transparent lg:bg-gradient-to-r lg:from-[#0B1F33]/90 lg:via-[#0B1F33]/60 lg:to-transparent" />
        
        {/* Hero Content */}
        <div className="relative max-w-[1440px] mx-auto px-4 md:px-8 min-h-[650px] flex flex-col justify-start lg:justify-center pt-12 lg:pt-0">
          <div className="max-w-xl text-white mb-8 lg:mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight whitespace-pre-wrap">
              {title}
            </h1>
            <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-lg whitespace-pre-wrap">
              {subtitle}
            </p>
          </div>
          
          {/* Desktop Search Card positioning: overlapping or inside hero */}
          <div className="w-full lg:w-auto">
            <SearchCard />
          </div>
        </div>
      </div>
    </section>
  );
}
