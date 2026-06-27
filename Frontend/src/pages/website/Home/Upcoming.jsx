import { motion } from "framer-motion";

const UpcomingCollection = () => {
  return (
    <section
      className="relative min-h-[350px] sm:min-h-[450px] md:min-h-[500px] w-full bg-cover bg-center bg-no-repeat overflow-hidden"
      // style={{
      //   backgroundImage: "url('/upcoming-image/up-bg.png')",
      //   backgroundPosition: "bottom",
      //   backgroundSize: "cover",
      // }}
    >
      <video
  autoPlay
  muted
  loop
  playsInline
  className="absolute inset-0 w-full h-full object-cover"
>
  <source src="/hero/hero-all.mp4" type="video/mp4" />
</video>
      {/* Overlay */}
      <div className="absolute inset-0 bg-[#00000094] backdrop-blur-[1px]" />

      {/* Content */}
      <div className="relative z-10 flex items-start justify-start h-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-8 sm:py-12 md:py-16"
        >
          <span className="inline-block text-white text-xs sm:text-sm md:text-lg font-semibold uppercase tracking-wider border border-white px-3 py-2 sm:px-4 rounded-full">
            Upcoming Collection
          </span>

          <h2 className="mt-4 text-2xl sm:text-4xl md:text-5xl font-bold text-white max-w-3xl">
            A New World of Miniature <br /> Magic is <span className="text-[#fe4462]">Coming Soon</span>
          </h2>

          <p className="mt-4 text-white/90 text-sm sm:text-base md:text-lg max-w-xl leading-relaxed">
            Get ready to explore our latest handcrafted miniature creations,
            featuring unique designs, intricate details, and imaginative
            characters that bring every collection to life.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default UpcomingCollection;
