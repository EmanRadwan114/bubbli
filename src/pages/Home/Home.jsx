import CategoryCard from "../../components/CategoryCard/CategoryCard";
import GiftTipsSection from "../../components/GiftTips/GiftTips";
import BestSellers from "../../components/HomeFrSection/HomeFrSection";
import HomeHero from "../../components/HomeHero/HomeHero";
import WhyChooseUs from "../../components/HomeSndSection/HomeSndSection";

export default function Home() {
  return (
    <div>
      <HomeHero></HomeHero>
      <CategoryCard />
      <BestSellers></BestSellers>
      <GiftTipsSection></GiftTipsSection>
      <WhyChooseUs />
    </div>
  );
}
