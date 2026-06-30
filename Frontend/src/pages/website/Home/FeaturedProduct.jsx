import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Keyboard } from "swiper/modules";
import { FiEye, FiShoppingBag, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import ActionButton from "../../../components/common/ActionButton";
import HeartIcon from "../../../components/common/HeartIcon";
import ExpectedDelivery from "../../../components/common/ExpectedDelivery";
import ProductPreviewModal from "./Productmodal";
import SectionHeading from "../../../components/common/SectionHeading";
import { featuredProducts } from "../../../data/products";
import { useApp } from "../../../context/AppContext";

import "swiper/css";

const FeaturedProduct = () => {
  const { addToCart, toggleWishlist, isWishlisted } = useApp();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [active, setActive] = useState(0);
  const swiperRef = useRef(null);

  return (
    <section className="bg-[#fbfefb] dark:bg-[#0d0508] pb-20 pt-10">
      <div className="mx-auto px-4 sm:px-8 relative max-w-[1440px]">
        <SectionHeading badge="Top Sale" title="Featured Characters" className="mb-14" />

        <Swiper
          modules={[Keyboard]}
          keyboard={{ enabled: true }}
          onSwiper={(s) => { swiperRef.current = s; setActive(s.realIndex); }}
          onSlideChange={(s) => setActive(s.realIndex)}
          spaceBetween={30}
          loop
          slidesPerView={4}
          breakpoints={{
            320: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1400: { slidesPerView: 4 },
          }}
        >
          {featuredProducts.map((item) => (
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
                  <ExpectedDelivery compact className="mt-2 justify-center" />
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
            {featuredProducts.map((item, i) => (
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

export default FeaturedProduct;
