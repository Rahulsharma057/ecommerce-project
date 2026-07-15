"use client";

import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/home/HeroSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Footer from "@/components/layout/Footer";
import NewArrivals from "@/components/home/NewArrivals";
import AdvertisementBanner from "@/components/advertisement/AdvertisementBanner";
import HomeCollectionSection from "@/components/home/HomeCollectionSection";
import LuxuryStorySection from "@/components/home/LuxuryStorySection";
import CategoryHighlightSection from "@/components/home/CategoryHighlightSection";
import FashionSection from "@/components/fashion-section/FashionSection";
import ModelShowcase from "@/components/home/ModelShowcase";
import WebsiteLoader from "@/components/common/WebsiteLoader";
import { HomeLoadingProvider, useHomeLoading} from "@/context/HomeLoadingContext";
// Only the sections that actually fetch their own data via API need to be
// "waited on" here. Right now that's FeaturedProducts + NewArrivals — bump
// EXPECTED_SECTIONS up (and call markReady() inside more components) if you
// add more API-driven sections later.
const EXPECTED_SECTIONS = 2;

function HomeContent() {
  const { isLoading } = useHomeLoading();

  return (
    <>
      {isLoading && <WebsiteLoader />}

      {/* Hidden (not unmounted) while loading, so FeaturedProducts/NewArrivals
          can still fire their useEffect fetches and call markReady() — if we
          conditionally didn't render them at all, they'd never get a chance
          to load and isLoading would stay true forever. */}
      <div style={{ visibility: isLoading ? "hidden" : "visible", height: isLoading ? 0 : "auto", overflow: isLoading ? "hidden" : "visible" }}>
        <HeroSection />
        {/*   <CategoriesSection /> */}
        <FeaturedProducts />

        <NewArrivals />
        <AdvertisementBanner />
        <CategoryHighlightSection />
        <HomeCollectionSection />
        <FashionSection />
        <LuxuryStorySection />

        <ModelShowcase />
      </div>
    </>
  );
}

export default function Home() {
  return (
    <HomeLoadingProvider expectedCount={EXPECTED_SECTIONS}>
      <HomeContent />
    </HomeLoadingProvider>
  );
}
