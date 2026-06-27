import { Lightbulb, PencilRuler, Box, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import SectionHeading from "../../../components/common/SectionHeading";

const steps = [
  {
    id: "01",
    title: "Concept & Story",
    desc: "Every miniature begins with a unique story and creative concept carefully planned by our artists.",
    icon: <Lightbulb size={28} />,
  },
  {
    id: "02",
    title: "Design & Sculpt",
    desc: "Our designers transform ideas into detailed digital and handcrafted miniature sculptures.",
    icon: <PencilRuler size={28} />,
  },
  {
    id: "03",
    title: "Painting & Finishing",
    desc: "Each piece is hand-painted with precision to capture every tiny detail and expression.",
    icon: <Sparkles size={28} />,
  },
  {
    id: "04",
    title: "Quality & Delivery",
    desc: "After strict quality checks, every collectible is carefully packed and prepared for its new home.",
    icon: <Box size={28} />,
  },
];

const CraftingProcess = () => {
  return (
    <section className="py-20 bg-[#fbfefb] dark:bg-[#0d0508]">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <SectionHeading
          badge="Behind The Magic"
          title="Our Crafting Process"
          subtitle="From imagination to reality, every miniature goes through a carefully crafted journey to ensure exceptional quality and detail."
          accent="#c48212"
          className="mb-16"
        />

        {/* Process Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative bg-[#fafafa] dark:bg-white/5 p-8 rounded-3xl border border-gray-200 dark:border-white/10 hover:border-[#ff8d36] hover:shadow-xl transition-all duration-300"
            >
              <span className="absolute top-5 right-5 text-5xl font-bold text-[#ffeadb] dark:text-white/10">
                {step.id}
              </span>

              <div className="w-14 h-14 rounded-2xl bg-[#fce6b3] text-orange-500 flex items-center justify-center mb-6 group-hover:bg-[#ff8d36] group-hover:text-white transition-all">
                {step.icon}
              </div>

              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {step.title}
              </h3>

              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CraftingProcess;