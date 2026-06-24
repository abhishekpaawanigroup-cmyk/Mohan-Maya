import Hero from './Hero'
import Products from './AllProduct'
import FAQSection from './FAQ'
import RecentlyViewed from '../../../components/product/RecentlyViewed'
import RecommendedProducts from '../../../components/product/RecommendedProducts'
import Reviews from '../../../components/product/Reviews'
import { usePageMeta } from '../../../hooks/useHooks'

const Shop = () => {
  usePageMeta(
    "Shop Handcrafted Miniatures - Mohan Maya",
    "Browse our collection of handcrafted miniature figurines and divine characters, made with precision and timeless artistry."
  );
  return (
    <>
      <Hero />
      <Products />
      <RecentlyViewed />
      <RecommendedProducts title="Recommended For You" />
      <Reviews />
      <FAQSection />
    </>
  )
}

export default Shop
