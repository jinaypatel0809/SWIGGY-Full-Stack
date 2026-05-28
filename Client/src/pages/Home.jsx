import Hero from "../components/Hero";
import FoodCategories from "../components/FoodCategories";
import RestaurantCards from "../components/RestaurantCards";
import CitiesSection from "../components/CitiesSection";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <main>
      {/* Section 1: Hero Banner */}
      <Hero />

      {/* Section 2: Food Categories */}
      <FoodCategories />

      {/* Section 3: Restaurant Cards (Dineout) */}
      <RestaurantCards />

      {/* Section 4: Cities with delivery */}
      <CitiesSection />

      {/* Section 5: Footer */}
      <Footer />
    </main>
  );
}
