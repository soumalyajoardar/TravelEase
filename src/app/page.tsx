import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TrustStrip from "@/components/TrustStrip";
import ComparisonPreview from "@/components/ComparisonPreview";
import PopularRoutes from "@/components/PopularRoutes";
import HowItWorks from "@/components/HowItWorks";
import TransparentPricing from "@/components/TransparentPricing";
import Offers from "@/components/Offers";
import AppPromotion from "@/components/AppPromotion";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import { getPublishedHomepageContent } from "@/services/cmsAdminService";
import Link from "next/link";

export default async function Home() {
  const cmsData = await getPublishedHomepageContent();

  return (
    <>
      <Header />
      
      {/* Announcement Banner */}
      {cmsData?.announcement_active && cmsData.announcement_text && (
        <div className="bg-primary text-white px-4 py-3 text-center text-sm font-medium">
          {cmsData.announcement_link ? (
            <Link href={cmsData.announcement_link} className="hover:underline">
              {cmsData.announcement_text}
            </Link>
          ) : (
            <span>{cmsData.announcement_text}</span>
          )}
        </div>
      )}

      <main className="flex-1 flex flex-col">
        <Hero cmsData={cmsData} />
        <TrustStrip />
        <ComparisonPreview />
        <PopularRoutes />
        <HowItWorks />
        <TransparentPricing />
        <Offers />
        <AppPromotion />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
