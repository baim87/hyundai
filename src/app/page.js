import Image from "next/image";
import styles from "./page.module.css";
import Header from "@/components/Header/Header";
import HeroSlider from "@/components/HeroSlider/HeroSlider";
import CategorySection from "@/components/CategorySection/CategorySection";
import DealsSection from "@/components/DealsSection/DealsSection";
import ProductLineup from "@/components/ProductLineup/ProductLineup";
import BigFeatureSection from "@/components/BigFeatureSection/BigFeatureSection";
import FullImageFeatureSection from "@/components/FullImageFeatureSection/FullImageFeatureSection";
import RepresentativeSection from "@/components/RepresentativeSection/RepresentativeSection";
import TestimonialSection from "@/components/TestimonialSection/TestimonialSection";
import InstagramFeed from "@/components/InstagramFeed/InstagramFeed";
import Footer from "@/components/Footer/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <HeroSlider />
      <DealsSection />
      <ProductLineup />
      <RepresentativeSection />
      <InstagramFeed />
      <Footer />
    </>
  );
}
