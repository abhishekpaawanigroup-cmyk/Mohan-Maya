import { Target, Eye } from "lucide-react";
import { motion } from "framer-motion";
import SectionHeading from "../../../components/common/SectionHeading";

const MissionVision = () => {
  return (
    <section className="py-8 sm:py-10 md:py-12 lg:py-14 xl:py-16 bg-[#fbfefb] dark:bg-[#0d0508]">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Heading */}
        <SectionHeading
          badge="Who We Are"
          title=
          {<>
          <span className="text-[#101828]">Our Mission &</span> Vision
          </>}
          subtitle="We are committed to creating meaningful experiences and delivering exceptional value through innovation, creativity, and dedication."
          className="mb-14"
        />

        {/* Cards */}
        <div className="w-full gap-8 lg:flex justify-center">

          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="max-w-[420px] bg-transparent border border-[#fe4462] p-8 rounded-3xl shadow-lg mb-8 lg:mb-0"
          >
            <div className="w-16 h-16 rounded-full bg-[#d1d0d09e] flex items-center justify-center mb-4">
              <Target size={30} className="text-[#fe4462]" />
            </div>

            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Our Mission
            </h3>

            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Our mission is to create handcrafted miniature art that inspires people through meaningful stories and exceptional craftsmanship. We are dedicated to spreading values of faith, kindness, gratitude, courage, and hope by transforming memorable moments into timeless collectibles. Every creation is designed to spark emotions, strengthen connections, and remind people that even the smallest stories can have the greatest impact.
            </p>
          </motion.div>

          {/* Vision */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="max-w-[420px] bg-transparent border border-[#fe4462] p-8 rounded-3xl shadow-lg"
          >
            <div className="w-16 h-16 rounded-full bg-[#d1d0d09e] flex items-center justify-center mb-4">
              <Eye size={30} className="text-[#fe4462]" />
            </div>

            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Our Vision
            </h3>

            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Our vision is to become the world's most loved storytelling miniature brand, where every handcrafted creation inspires positivity, celebrates meaningful moments, and preserves timeless values for future generations. We aspire to create a community that cherishes art, storytelling, and craftsmanship while bringing the wisdom of Mohan and Maya into homes across the globe.
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default MissionVision;