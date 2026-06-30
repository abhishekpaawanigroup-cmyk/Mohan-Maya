import { Link } from "react-router-dom";
import LazyVideo from "../../../components/common/LazyVideo";

const Hero = () => {
  return (
    <div className="relative pb-10 mt-20 bg-[#fbfefb] dark:bg-[#0d0508]">
      {/* Hero Video Section */}
      <div className="w-full h-[600px] sm:h-[700px] lg:h-[835px] relative overflow-hidden after:content-[''] after:absolute after:inset-0 after:bg-black/50 after:z-10">
        <LazyVideo
          src="/hero/mohan-maya.mp4"
          className="w-full h-full object-cover"
        />

        <div className="absolute top-1/2 left-1/2 z-20 w-full px-4 text-center text-white -translate-x-1/2 -translate-y-1/2">
          <h1 className="font-bold text-3xl sm:text-4xl md:text-6xl">
            Every Miniature Holds <br/> <span className="text-[#fe4462]">A Story</span>
          </h1>

          <p className="text-lg leading-relaxed max-w-[650px] mx-auto mt-4">
            Handcrafted miniatures inspired by Krishna's divine world, created to bring beauty, faith, and timeless memories into your home. 
          </p>

          <Link
            to="/shop"
            className="mt-6 inline-block px-6 py-3 bg-[#ef4462] border border-[#ef4462] rounded-[30px] hover:bg-transparent hover:border-white transition-all duration-300 cursor-pointer font-semibold"
          >
            Discover the Collection 
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;
