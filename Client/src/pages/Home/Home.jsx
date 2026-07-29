import { useEffect, useMemo, useState } from 'react'
import {
  CategoryResults,
  ExploreOptions,
  FAQ,
  FoodCategories,
  Footer,
  GetTheApp,
  HeroSection,
  OffersNearYou,
  PopularRestaurants,
  TopBrands,
} from '../../components/home/HomeSections'
import { apiRequest } from '../../services/api'
import { locationSlug, useLocationSelection } from '../../context/LocationContext'

function Home() {
  const [contentItems, setContentItems] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const { location } = useLocationSelection()

  useEffect(() => {
    apiRequest('/content')
      .then((data) => setContentItems(data.items))
      .catch(() => setContentItems([]))
  }, [])

  const restaurants = useMemo(
    () => contentItems.filter(
      (item) => item.section === 'restaurant' && item.location === locationSlug(location),
    ),
    [contentItems, location],
  )
  const offers = useMemo(
    () => contentItems.filter(
      (item) => item.section === 'offer' && item.location === locationSlug(location),
    ),
    [contentItems, location],
  )
  const categoryItems = useMemo(
    () => contentItems.filter((item) => item.section === 'food' && item.category === selectedCategory),
    [contentItems, selectedCategory],
  )

  const selectCategory = (category) => {
    setSelectedCategory(category)
    window.setTimeout(() => {
      document.getElementById('category-results')?.scrollIntoView({ behavior: 'smooth' })
    }, 0)
  }

  return (
    <main className="bg-white dark:bg-zinc-950">
      <HeroSection />
      <FoodCategories selectedCategory={selectedCategory} onSelectCategory={selectCategory} />
      <div id="category-results">
        <CategoryResults category={selectedCategory} items={categoryItems} onClear={() => setSelectedCategory('')} />
      </div>
      <TopBrands />
      <PopularRestaurants dynamicItems={restaurants} location={location} />
      <OffersNearYou dynamicItems={offers} location={location} />
      <GetTheApp />
      <FAQ />
      <ExploreOptions />
      <Footer />
    </main>
  )
}

export default Home
