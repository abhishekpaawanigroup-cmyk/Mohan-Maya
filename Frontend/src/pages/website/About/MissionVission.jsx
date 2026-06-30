import { Target, Eye } from "lucide-react";
import { motion } from "framer-motion";
import SectionHeading from "../../../components/common/SectionHeading";

const MissionVision = () => {
  return (
    <section className="py-10 bg-[#fbfefb] dark:bg-[#0d0508]">
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
            className="max-w-[400px] bg-transparent border border-[#fe4462] p-8 rounded-3xl shadow-lg mb-8 lg:mb-0"
          >
            <div className="w-16 h-16 rounded-full bg-[#d1d0d09e] flex items-center justify-center mb-6">
              <Target size={30} className="text-[#fe4462]" />
            </div>

            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Our Mission
            </h3>

            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              To bring people closer to India's culture, spirituality, and craftsmanship through meaningful miniature creations that inspire joy, devotion, and imagination
            </p>
          </motion.div>

          {/* Vision */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="max-w-[400px] bg-transparent border border-[#fe4462] p-8 rounded-3xl shadow-lg"
          >
            <div className="w-16 h-16 rounded-full bg-[#d1d0d09e] flex items-center justify-center mb-6">
              <Eye size={30} className="text-[#fe4462]" />
            </div>

            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Our Vision
            </h3>

            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              To become a global destination for handcrafted miniature art where every creation tells a story, preserves tradition, and brings hearts closer together.
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default MissionVision;