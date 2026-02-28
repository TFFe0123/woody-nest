import { useState } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CategorySection from "@/components/CategorySection";
import FilterSection from "@/components/FilterSection";
import TodayFurniture from "@/components/TodayFurniture";
import BrowseFurniture from "@/components/BrowseFurniture";
import MyFurniture from "@/components/MyFurniture";
import Footer from "@/components/Footer";

const Index = () => {
  const [selectedStyle, setSelectedStyle] = useState("전체");
  const [selectedMaterial, setSelectedMaterial] = useState("전체");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <CategorySection />
        <FilterSection 
          selectedStyle={selectedStyle}
          selectedMaterial={selectedMaterial}
          onStyleChange={setSelectedStyle}
          onMaterialChange={setSelectedMaterial}
        />
        <BrowseFurniture 
          selectedStyle={selectedStyle}
          selectedMaterial={selectedMaterial}
        />
        <TodayFurniture />
        <MyFurniture />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
