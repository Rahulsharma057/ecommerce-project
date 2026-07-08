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
export default function Home() {
  return (
    <>
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
    </>
  );
}
