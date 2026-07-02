import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/home/HeroSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <>

      <HeroSection />
    {/*   <CategoriesSection /> */}
      <FeaturedProducts />

    </>
  );
}