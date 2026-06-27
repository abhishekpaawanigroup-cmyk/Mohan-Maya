import { Suspense, lazy } from "react";
import { FaArrowRight } from "react-icons/fa";
import Breadcrumb from "../../../components/common/Breadcrumb";

// Lazy so the heavy three.js bundle only downloads with the hero, never blocking
// initial page render.
const Hero3DModel = lazy(() => import("./Hero3DModel"));

const Hero = () => {

  return (
    <section className="relative h-screen max-h-[1000px]  overflow-hidden pt-30 ">
 
      {/* Background video (poster falls back to the image while it loads) */}

      <video
        autoPlay
        muted
        loop
        playsInline
        poster="/Shop/Shopbg.png"
        className="absolute inset-0 w-full h-full object-cover scale-105"
      >
        <source src="/hero/hero-all.mp4" type="video/mp4" />
      </video>
 
      {/* Dark Overlay */}
 
      <div className="absolute inset-0 bg-black/55"></div>
 
      {/* Gradient Overlay */}
 
      <div className="absolute inset-0 bg-gradient-to-r from-[#090909]/95 via-[#090909]/60 to-transparent"></div>
 
     
 
      {/* Main Content */}
 
      <div className="relative z-20 max-w-7xl mx-auto h-full px-5 flex items-center">
 
        <div className="grid lg:grid-cols-2 gap-10 items-center w-full h-full">
 
          {/* Left (centered on mobile where the model is hidden) */}

          <div className="flex flex-col items-center md:items-start gap-8 text-center md:text-left">
 
            {/* Breadcrumb - above all hero text */}
            <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "Shop" }]} light />

            {/* Badge */}

            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#fe4462] bg-pink-500/10 backdrop-blur-md text-[#fe4462] text-sm font-semibold">

              HANDCRAFTED MINIATURES

            </div>
 
            {/* Heading */}
 
            <div className="space-y-5">
 
              <h1 className="text-white text-4xl md:text-6xl xl:text-7xl leading-[1.05] font-bold">
 
                Where Tiny Art
 
                <br />
 
                Comes to
 
                <span className="bg-[#fe4462] bg-clip-text text-transparent">
                  {" "}Life
                </span>
 
              </h1>
 
              <p className="text-gray-300 text-sm md:text-lg max-w-xl mx-auto md:mx-0">
 
                Discover beautifully handcrafted miniature creations
                designed with precision, passion, and timeless artistry.
                Every piece tells a unique story.
 
              </p>
 
            </div>
 
            {/* Buttons */}
 
            <div className="flex flex-wrap gap-4">
 
              <a href="#products" className="group px-8 py-4 rounded-full bg-[#fe4462] border border-[#fe4462] text-white font-semibold flex items-center gap-3 hover:bg-transparent hover:text-[#fe4462] duration-200 shadow-xl cursor-pointer">

                Shop Collection

                <FaArrowRight className="group-hover:translate-x-1 duration-300" />

              </a>

            </div>
 
 
          </div>
 
          {/* Right - hidden on mobile (≤768px), shown from tablet up */}

          <div className="relative hidden md:flex justify-center items-center self-center lg:self-stretch h-[300px] sm:h-[420px] lg:h-full">
 
         
 
     
            {/* Soft glow behind the model for a premium, lit look */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] aspect-square rounded-full bg-transparent blur-3xl" />

            {/* Auto-rotating 3D model (replaces the character image) */}
            <Suspense fallback={null}>
              <Hero3DModel className="!absolute inset-0 z-10 !w-[80%] !h-[80%]" />
            </Suspense>
 
          </div>
 
        </div>
 
      </div>
 
    </section>
  );
};
 
export default Hero;