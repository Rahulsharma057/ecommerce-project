import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/home/HeroSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import dynamic from "next/dynamic";

const FeaturedProducts = dynamic(
  ()=>import("@/components/home/FeaturedProducts"),
  {
    loading:()=>null
  }
);

const NewArrivals = dynamic(
  ()=>import("@/components/home/NewArrivals"),
  {
    loading:()=>null
  }
);


const AdvertisementBanner = dynamic(
  ()=>import("@/components/advertisement/AdvertisementBanner"),
  {
    loading:()=>null
  }
);


const CategoryHighlightSection = dynamic(
  ()=>import("@/components/home/CategoryHighlightSection"),
  {
    loading:()=>null
  }
);


const HomeCollectionSection = dynamic(
  ()=>import("@/components/home/HomeCollectionSection"),
  {
    loading:()=>null
  }
);


const FashionSection = dynamic(
  ()=>import("@/components/fashion-section/FashionSection"),
  {
    loading:()=>null
  }
);


const LuxuryStorySection = dynamic(
  ()=>import("@/components/home/LuxuryStorySection"),
  {
    loading:()=>null
  }
);


const ModelShowcase = dynamic(
  ()=>import("@/components/home/ModelShowcase"),
  {
    loading:()=>null
  }
);
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
