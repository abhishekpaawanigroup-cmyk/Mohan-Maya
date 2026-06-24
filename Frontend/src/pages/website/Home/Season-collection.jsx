import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import SectionHeading from "../../../components/common/SectionHeading";
import LazyVideo from "../../../components/common/LazyVideo";

const SeasonalCollection = () => {
  return (
    <section className="py-20 bg-[#f5f0e8] dark:bg-[#0d0508]">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <SectionHeading
          badge="Seasonal Collection"
          title="Shop By Season"
          subtitle="Explore exclusive seasonal products crafted for every celebration."
          accent="#c48212"
          className="mb-14"
        />

        <div className="grid lg:grid-cols-3 gap-8">

          {/* LEFT VIDEO SECTION */}
          <div className="lg:col-span-2">
            <div className="relative overflow-hidden rounded-lg h-[380px] sm:h-[500px] lg:h-[600px] shadow-2xl">

              {/* Video - lazy-loaded & paused when off-screen */}
              <LazyVideo
                src="/hero/mohan-maya.mp4"
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

              {/* Content */}
              <div className="absolute z-10 left-10 top-1/2 -translate-y-1/2 text-white max-w-lg">

                <span className="inline-block bg-white/15 backdrop-blur-md px-4 py-2 rounded-full text-sm uppercase tracking-wider mb-5">
                  Limited Collection
                </span>

                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-5">
                  Seasonal
                  <br />
                  Collection 2026
                </h3>

                <p className="text-lg text-white/90 mb-8">
                  Discover handcrafted products inspired by every season and
                  celebration.
                </p>

                <Link
                  to="/shop"
                  className="inline-flex items-center gap-3 bg-white text-black px-7 py-4 rounded-full font-semibold hover:bg-[#ef4462] hover:text-white transition-all duration-300 cursor-pointer"
                >
                  Shop Collection
                  <FiArrowRight />
                </Link>
              </div>
            </div>
          </div>

          {/* RIGHT IMAGE CARDS */}
          <div className="flex flex-col gap-6">

            {/* Winter */}
            <div className="group relative overflow-hidden rounded-lg h-[184px] shadow-lg cursor-pointer bg-[#d4cbf9]">
              <img
                src="/season/mm5.png"
                alt="Winter"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-contain transition duration-700 group-hover:scale-110"
              />

              

              <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                <span className="text-xs uppercase tracking-wider">
                  Winter Special
                </span>

                <h4 className="text-2xl font-bold">
                  Winter Collection
                </h4>
              </div>
            </div>

            {/* Summer */}
            <div className="group relative overflow-hidden rounded-lg h-[184px] shadow-lg cursor-pointer bg-[#d2e591]">
              <img
                src="/season/mm6.png"
                alt="Summer"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-contain transition duration-700 group-hover:scale-110"
              />

             

              <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                <span className="text-xs uppercase tracking-wider">
                  Summer Special
                </span>

                <h4 className="text-2xl font-bold">
                  Summer Collection
                </h4>
              </div>
            </div>

            {/* Christmas */}
            <div className="group relative overflow-hidden rounded-lg h-[184px] shadow-lg cursor-pointer bg-[#e18888]">
              <img
                src="/season/mm7.png"
                alt="Christmas"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-contain transition duration-700 group-hover:scale-110"
              />

              

              <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                <span className="text-xs uppercase tracking-wider">
                  Christmas Special
                </span>

                <h4 className="text-2xl font-bold">
                  Christmas Collection
                </h4>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default SeasonalCollection;