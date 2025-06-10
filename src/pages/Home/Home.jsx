import CategoryCard from "../../components/CategoryCard/CategoryCard";
import HomeHero from "../../components/HomeHero/HomeHero";

export default function Home() {
  return (
    <div style={{ minHeight: "500vh" }}>
      <HomeHero></HomeHero>
      <CategoryCard />
    </div>
  );
}
