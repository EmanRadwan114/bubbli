import CategoryCard from "../../components/CategoryCard/CategoryCard";
import Coupons from "../../components/Coupons/Coupons";
import HomeHero from "../../components/HomeHero/HomeHero";

export default function Home() {
  return (
    <div style={{ minHeight: "500vh" }}>
      <HomeHero></HomeHero>
      <Coupons />
      <CategoryCard />
    </div>
  );
}
