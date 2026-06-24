// Centralized product catalog - single source of truth for the whole app.
// Each product has a stable id, category, price, rating and gallery so that
// the Shop (filter/sort/search/pagination) and the Home sliders all stay in sync.

const gallery = (a, b, c, d) => [a, b, c, d];

export const categories = [
  "All Products",
  "Festival Collection",
  "Wedding Collection",
  "Birthday Collection",
  "Seasonal Collection",
  "Limited Edition",
];

// Characters available across the catalog (every product maps to one of these).
export const characters = [
  "All Characters",
  "Krishna",
  "Radha",
  "Madhav",
  "Maya",
  "Shiva",
  "Mohini",
  "Govinda",
];

export const sortOptions = [
  { label: "Featured", value: "featured" },
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Top Rated", value: "rating" },
];

export const products = [
  {
    id: 1,
    name: "Mohan Maya - Krishna",
    price: 200,
    oldPrice: 300,
    rating: 4.8,
    category: "Festival Collection",
    character: "Krishna",
    badge: "Top Sale",
    image: "/Featured-images/mm4.png",
    gallery: gallery("/Featured-images/mm4.png", "/Featured-images/mm5.png", "/Featured-images/mm6.png", "/Featured-images/mm7.png"),
  },
  {
    id: 2,
    name: "Mohan Maya - Radha",
    price: 249,
    oldPrice: 320,
    rating: 4.9,
    category: "Wedding Collection",
    character: "Radha",
    badge: "New",
    image: "/Featured-images/mm5.png",
    gallery: gallery("/Featured-images/mm5.png", "/Featured-images/mm4.png", "/Featured-images/mm6.png", "/Featured-images/mm7.png"),
  },
  {
    id: 3,
    name: "Mohan Maya - Madhav",
    price: 150,
    oldPrice: 199,
    rating: 4.6,
    category: "Birthday Collection",
    character: "Madhav",
    image: "/Featured-images/mm6.png",
    gallery: gallery("/Featured-images/mm6.png", "/Featured-images/mm4.png", "/Featured-images/mm5.png", "/Featured-images/mm7.png"),
  },
  {
    id: 4,
    name: "Mohan Maya - Maya",
    price: 180,
    oldPrice: 240,
    rating: 4.7,
    category: "Limited Edition",
    character: "Maya",
    badge: "Limited",
    image: "/Featured-images/mm7.png",
    gallery: gallery("/Featured-images/mm7.png", "/Featured-images/mm4.png", "/Featured-images/mm5.png", "/Featured-images/mm6.png"),
  },
  {
    id: 5,
    name: "Mohan Maya - Shiva",
    price: 220,
    oldPrice: 290,
    rating: 4.9,
    category: "Festival Collection",
    character: "Shiva",
    badge: "Top Sale",
    image: "/trandy-images/mm4.png",
    gallery: gallery("/trandy-images/mm4.png", "/trandy-images/mm5.png", "/trandy-images/mm6.png", "/trandy-images/mm7.png"),
  },
  {
    id: 6,
    name: "Mohan Maya - Madhvi",
    price: 175,
    oldPrice: 215,
    rating: 4.5,
    category: "Seasonal Collection",
    character: "Radha",
    image: "/trandy-images/mm5.png",
    gallery: gallery("/trandy-images/mm5.png", "/trandy-images/mm4.png", "/trandy-images/mm6.png", "/trandy-images/mm7.png"),
  },
  {
    id: 7,
    name: "Mohan Maya - Mohini",
    price: 280,
    oldPrice: 350,
    rating: 4.8,
    category: "Wedding Collection",
    character: "Mohini",
    badge: "New",
    image: "/trandy-images/mm6.png",
    gallery: gallery("/trandy-images/mm6.png", "/trandy-images/mm4.png", "/trandy-images/mm5.png", "/trandy-images/mm7.png"),
  },
  {
    id: 8,
    name: "Mohan Maya - Govinda",
    price: 149,
    oldPrice: 199,
    rating: 4.4,
    category: "Birthday Collection",
    character: "Govinda",
    image: "/trandy-images/mm7.png",
    gallery: gallery("/trandy-images/mm7.png", "/trandy-images/mm4.png", "/trandy-images/mm5.png", "/trandy-images/mm6.png"),
  },
  {
    id: 9,
    name: "Mohan Maya - Banke Bihari",
    price: 350,
    oldPrice: 430,
    rating: 5.0,
    category: "Limited Edition",
    character: "Krishna",
    badge: "Limited",
    image: "/bestseller-image/mm4.png",
    gallery: gallery("/bestseller-image/mm4.png", "/bestseller-image/mm5.png", "/bestseller-image/mm6.png", "/bestseller-image/mm7.png"),
  },
  {
    id: 10,
    name: "Mohan Maya - Giridhari",
    price: 210,
    oldPrice: 270,
    rating: 4.6,
    category: "Festival Collection",
    character: "Govinda",
    image: "/bestseller-image/mm5.png",
    gallery: gallery("/bestseller-image/mm5.png", "/bestseller-image/mm4.png", "/bestseller-image/mm6.png", "/bestseller-image/mm7.png"),
  },
  {
    id: 11,
    name: "Mohan Maya - Murari",
    price: 330,
    oldPrice: 410,
    rating: 4.9,
    category: "Seasonal Collection",
    character: "Krishna",
    badge: "Top Sale",
    image: "/bestseller-image/mm6.png",
    gallery: gallery("/bestseller-image/mm6.png", "/bestseller-image/mm4.png", "/bestseller-image/mm5.png", "/bestseller-image/mm7.png"),
  },
  {
    id: 12,
    name: "Mohan Maya - Keshava",
    price: 199,
    oldPrice: 259,
    rating: 4.7,
    category: "Wedding Collection",
    character: "Madhav",
    image: "/bestseller-image/mm7.png",
    gallery: gallery("/bestseller-image/mm7.png", "/bestseller-image/mm4.png", "/bestseller-image/mm5.png", "/bestseller-image/mm6.png"),
  },
];

// Curated subsets for the home page sliders (derived, not duplicated).
export const featuredProducts = products.slice(0, 5);
export const bestSellers = products.slice(6, 12);

export const trendyTabs = [
  { label: "All Collection", value: "all" },
  { label: "New In", value: "newIn" },
  { label: "Top Rated", value: "topRated" },
  { label: "Trending", value: "trending" },
];

export const trendyData = {
  all: products.slice(0, 5),
  newIn: products.filter((p) => p.badge === "New" || p.id > 8),
  topRated: [...products].sort((a, b) => b.rating - a.rating).slice(0, 4),
  trending: products.slice(4, 9),
};
