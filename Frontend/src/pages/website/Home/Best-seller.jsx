import { FiStar, FiShoppingBag } from "react-icons/fi";
import ScrollReveal from "../../../components/common/ScrollReveal";
import SectionHeading from "../../../components/common/SectionHeading";
import ExpectedDelivery from "../../../components/common/ExpectedDelivery";
import { bestSellers } from "../../../data/products";
import { useApp } from "../../../context/AppContext";

const BestSellers = () => {
  const { addToCart } = useApp();

  return (
    <section className="bg-[#fbfefb] dark:bg-[#0d0508] py-24">
      <div className="max-w-7xl mx-auto px-5">
        <SectionHeading
          badge="This Week"
          title="Best Sellers"
          accent="#c48212"
          className="mb-12"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-8">
          {bestSellers.map((item, idx) => (
            <ScrollReveal key={item.id} delay={idx * 0.05}>
              <div className="group flex items-center gap-4 sm:gap-6">
                <div className="w-[110px] h-[130px] sm:w-[180px] sm:h-[200px] bg-transparent overflow-hidden flex items-center justify-center shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                <div>
                  <h3 className="text-[20px] font-bold text-[#111] dark:text-white mb-2 group-hover:text-[#c48212] transition-colors duration-300">
                    {item.name}
                  </h3>
                  <p className="text-[#ff7f50] text-lg font-medium mb-3">INR {item.price.toFixed(2)}</p>

                  <div className="flex gap-1 text-[#ff7f50] mb-4" aria-label={`${item.rating} star rating`}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FiStar key={i} className={i < Math.round(item.rating) ? "fill-current" : ""} />
                    ))}
                  </div>

                  <ExpectedDelivery compact className="mb-4" />

                  <button
                    onClick={() => addToCart(item)}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#c48212] hover:gap-3 transition-all"
                  >
                    <FiShoppingBag size={16} /> Add to Cart
                  </button>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestSellers;
