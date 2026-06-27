import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Keyboard } from "swiper/modules";
import { FiEye, FiShoppingBag, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import ActionButton from "../../../components/common/ActionButton";
import HeartIcon from "../../../components/common/HeartIcon";
import ProductPreviewModal from "./Productmodal";
import { trendyData, trendyTabs } from "../../../data/products";
import { useApp } from "../../../context/AppContext";

import "swiper/css";

const TrendyCollection = () => {
  const { addToCart, toggleWishlist, isWishlisted } = useApp();
  const [activeTab, setActiveTab] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [active, setActive] = useState(0);
  const swiperRef = useRef(null);

  const items = trendyData[activeTab] || [];

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-[#fbfefb] dark:bg-[#0d0508]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-8 mb-14">
          <div>
            <span className="bg-transparent text-[#fe4462] border border-[#fe4462] px-4 py-1 text-sm font-bold uppercase rounded-full">
              This Month
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#fe4462] mt-4">
              Trending Collection
            </h2>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap justify-center lg:justify-end gap-4 sm:gap-6 lg:gap-10 mt-4 lg:mt-0">
            {trendyTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`relative pb-2 text-sm sm:text-base lg:text-lg cursor-pointer font-medium transition-all ${
                  activeTab === tab.value
                    ? "text-black dark:text-white border-b-2 border-black dark:border-white"
                    : "text-gray-500 hover:text-black dark:hover:text-white"
                }`}
              >
                {activeTab === tab.value && (
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#fe4462] text-white text-xs font-bold px-3 py-1 rounded">
                    {trendyData[tab.value].length}
                  </span>
                )}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Slider - keyed on tab so it re-inits cleanly when data changes */}
        <Swiper
          key={activeTab}
          modules={[Keyboard]}
          keyboard={{ enabled: true }}
          onSwiper={(s) => { swiperRef.current = s; setActive(s.realIndex); }}
          onSlideChange={(s) => setActive(s.realIndex)}
          loop={items.length > 4}
          spaceBetween={30}
          slidesPerView={4}
          breakpoints={{
            320: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1400: { slidesPerView: 4 },
          }}
        >
          {items.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="flex flex-col h-full" data-fly-card>
                <div className="group relative bg-[#c1bbbb8a] dark:bg-white/5 overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 rounded-full">
                  <div className="h-80 flex items-center justify-center overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      className="w-[50%] object-contain transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-8">
                    <div className="flex gap-4 items-center">
                      <ActionButton
                        icon={FiShoppingBag}
                        label="Add to Cart"
                        onClick={(e) => addToCart(item, 1, e)}
                        className="bg-[#fe4462] hover:bg-[#d93550] text-white"
                      />
                      <ActionButton
                        icon={FiEye}
                        label="Quick View"
                        onClick={() => setSelectedProduct(item)}
                        className="bg-[#fe4462] hover:bg-[#d93550] text-white"
                      />
                      <ActionButton
                        label={isWishlisted(item.id) ? "In Wishlist" : "Add to Wishlist"}
                        onClick={() => toggleWishlist(item)}
                        className="bg-white/15 hover:bg-white/25 backdrop-blur-md"
                      >
                        <HeartIcon active={isWishlisted(item.id)} size={22} />
                      </ActionButton>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grow text-center">
                  <h3 className="text-[18px] font-bold text-[#1d1d1d] dark:text-white line-clamp-2">
                    {item.name}
                  </h3>
                  <div className="mt-3 flex items-center justify-center flex-wrap gap-x-2 gap-y-1">
                    <span className="text-[#fe4462] text-[18px] font-bold">₹{item.price}</span>
                    {item.oldPrice && item.oldPrice > item.price && (
                      <>
                        <span className="text-gray-400 dark:text-gray-500 text-sm line-through">
                          ₹{item.oldPrice}
                        </span>
                        <span className="text-[11px] font-semibold text-[#fe4462] bg-[#fe4462]/10 border border-[#fe4462]/20 px-2 py-0.5 rounded-full">
                          {Math.round(((item.oldPrice - item.price) / item.oldPrice) * 100)}% OFF
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation -dots centered between the arrows, all below the cards */}
        <div className="flex items-center justify-center gap-4 mt-10">
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            className="w-14 h-14 bg-white dark:bg-white/5 text-gray-700 dark:text-white rounded-full flex items-center justify-center border border-gray-200 dark:border-white/10 shadow-sm hover:bg-[#fe4462] hover:text-white hover:border-[#fe4462] transition-all duration-300"
            aria-label="Previous"
          >
            <FiChevronLeft size={26} />
          </button>

          <div className="flex items-center gap-2">
            {items.map((item, i) => (
              <button
                key={item.id}
                onClick={() => swiperRef.current?.slideToLoop(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={active === i ? "true" : undefined}
                className={`h-2.5 rounded-full bg-[#fe4462] transition-all duration-300 ${
                  active === i ? "w-6 opacity-100" : "w-2.5 opacity-30 hover:opacity-60"
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => swiperRef.current?.slideNext()}
            className="w-14 h-14 bg-white dark:bg-white/5 text-gray-700 dark:text-white rounded-full flex items-center justify-center border border-gray-200 dark:border-white/10 shadow-sm hover:bg-[#fe4462] hover:text-white hover:border-[#fe4462] transition-all duration-300"
            aria-label="Next"
          >
            <FiChevronRight size={26} />
          </button>
        </div>

        {selectedProduct && (
          <ProductPreviewModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
        )}
      </div>
    </section>
  );
};

export default TrendyCollection;
