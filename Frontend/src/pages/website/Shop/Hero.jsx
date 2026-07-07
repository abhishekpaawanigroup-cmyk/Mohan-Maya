import { Suspense, lazy } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FaArrowRight, FaStar } from "react-icons/fa";
import { FiTruck, FiRefreshCw, FiLock, FiCheckCircle } from "react-icons/fi";
import Breadcrumb from "../../../components/common/Breadcrumb";

// Lazy so the heavy three.js bundle only downloads with the hero, never blocking
// initial page render.
const Hero3DModel = lazy(() => import("./Hero3DModel"));

// Realistic customer placeholders (reuse the local testimonial portraits so no
// external/network image is needed). Swap for real customer photos later.
const CUSTOMERS = [
  "/testimonials-images/pic1.png",
  "/testimonials-images/pic2.png",
  "/testimonials-images/pic3.png",
  "/testimonials-images/pic4.png",
];

const TRUST_BADGES = [
  { icon: FiTruck, label: "Free Shipping" },
  { icon: FiRefreshCw, label: "Easy Returns" },
  { icon: FiLock, label: "Secure Checkout" },
  { icon: FiCheckCircle, label: "Premium Quality" },
];

const Hero = () => {
  // Respect the user's reduced-motion preference: drop the slide offset but keep
  // the (near-instant) fade so nothing pops in abruptly.
  const reduce = useReducedMotion();
  const groupV = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
  };
  const itemV = {
    hidden: { opacity: 0, y: reduce ? 0 : 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <section className="relative h-screen min-h-[680px] max-h-[1000px] overflow-hidden pt-30">
 
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
 
          {/* Left (centered until lg, where the 2-col grid + model appear) */}

          <div className="flex flex-col items-center lg:items-start gap-6 sm:gap-8 text-center lg:text-left">
 
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

            {/* Social proof / trust — directly below the CTA */}
            <motion.div
              variants={groupV}
              initial="hidden"
              animate="show"
              className="flex flex-col items-center lg:items-start gap-5"
            >
              {/* Overlapping avatars + customer count & rating */}
              <motion.div
                variants={itemV}
                className="flex items-center gap-4"
              >
                <div className="flex -space-x-3">
                  {CUSTOMERS.map((src) => (
                    <img
                      key={src}
                      src={src}
                      alt=""
                      loading="lazy"
                      aria-hidden="true"
                      className="relative h-10 w-10 sm:h-11 sm:w-11 rounded-full border-2 border-white object-cover shadow-[0_4px_14px_rgba(0,0,0,0.4)] ring-1 ring-black/5 transition duration-300 hover:z-10 hover:-translate-y-1 hover:scale-105"
                    />
                  ))}
                </div>

                <div className="text-left">
                  <p className="font-bold text-white leading-tight">
                    10,000+{" "}
                    <span className="font-medium text-gray-300">Happy Customers</span>
                  </p>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="flex text-[#ffb400]" aria-hidden="true">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <FaStar key={i} className="h-3.5 w-3.5" />
                      ))}
                    </span>
                    <span className="text-sm font-semibold text-white">4.9/5</span>
                    <span className="text-xs text-gray-400">Customer Rating</span>
                  </div>
                </div>
              </motion.div>

              {/* Trust badges — wrap neatly on small screens */}
              <motion.ul
                variants={itemV}
                className="flex flex-wrap items-center justify-start lg:justify-start gap-x-5 gap-y-2.5"
              >
                {TRUST_BADGES.map(({ icon: Icon, label }) => (
                  <li
                    key={label}
                    className="group flex items-center gap-2 text-sm text-gray-200"
                  >
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-white/10 text-[#fe4462] ring-1 ring-white/15 transition duration-300 group-hover:bg-[#fe4462] group-hover:text-white">
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <span className="font-medium transition-colors duration-300 group-hover:text-white">
                      {label}
                    </span>
                  </li>
                ))}
              </motion.ul>
            </motion.div>

          </div>

          {/* Right - hidden below lg; only shown once the 2-col grid is active
              so the model never stacks under the text or gets clipped. */}

          <div className="relative hidden lg:flex justify-center items-center self-stretch h-full">
 
         
 
     
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