import { Suspense, lazy } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import Breadcrumb from "../../../components/common/Breadcrumb";

// Lazy so the heavy three.js bundle only downloads with the hero, never blocking
// initial page render. Reuses the Shop hero's exact 3D presentation.
const Hero3DModel = lazy(() => import("../Shop/Hero3DModel"));

const HeroSection = () => {
  return (
    <section className="relative h-screen max-h-[1000px] overflow-hidden pt-30">
      {/* Background video (poster falls back to the image while it loads) */}
      <video
        autoPlay
        muted
        loop
        playsInline
        poster="/About/Hero/about-bg.png"
        className="absolute inset-0 w-full h-full object-cover scale-105"
      >
        <source src="/hero/hero-all.mp4" type="video/mp4" />
      </video>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/55"></div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#090909]/95 via-[#090909]/60 to-transparent"></div>

      {/* Main Content */}
      <div className="relative z-20 max-w-7xl mx-auto h-full px-6 md:px-12 flex items-center">
        <div className="grid lg:grid-cols-2 gap-10 items-center w-full h-full">

          {/* Left - existing About text (unchanged) */}
          <div className="text-white">
            {/* Breadcrumb - above all hero text */}
            <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "About" }]} light className="mb-4" />

            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
              Every Miniature Has <br/> <span className="text-[#fe4462]">A Story</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-xl">
              We transform imagination into handcrafted miniatures, designed to capture emotions , memories and timeless moments.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/shop" className="px-6 py-3 bg-[#fe4462] text-[#fff] border border-[#fe4462] hover:bg-transparent hover:text-[#fe4462] rounded-full font-semibold transition cursor-pointer mt-8 inline-flex group items-center gap-1">
                Get Started
                <FiArrowRight className="group-hover:translate-x-1 duration-300" />
              </Link>

              <Link to="/contact" className="px-6 py-3 bg-transparent text-[#fe4462] border border-[#fe4462] hover:bg-[#fe4462] hover:text-[#fff] rounded-full font-semibold transition cursor-pointer mt-8 inline-flex group items-center gap-1">
                Contact Us
                <FiArrowRight className="group-hover:translate-x-1 duration-300" />
                
              </Link>
            </div>
          </div>

          {/* Right - auto-rotating mm-modal.glb, vertically centered (matches Shop hero) */}
          <div className="relative flex justify-center items-center self-center lg:self-stretch h-[420px] sm:h-[520px] lg:h-full">
            <Suspense fallback={null}>
              {/* Canvas fills the container so the model stays centered; the
                  pulled-back camera (z=4.8) adds top/bottom margin so the full
                  model is visible without clipping. */}
              <Hero3DModel
                modelPath="/models/mm-modal.glb"
                cameraPosition={[0, 0, 4.8]}
                className="!absolute inset-0 z-10 !w-full !h-[90%]"
              />
            </Suspense>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
