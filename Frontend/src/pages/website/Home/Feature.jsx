import { ShieldCheck, Truck, PencilRuler } from "lucide-react";
import { LuHandHeart } from "react-icons/lu";
import { motion } from "framer-motion";

const features = [
  {
    icon: <LuHandHeart size={32} />,
    title: "Handmade Quality",
    description: "Each piece is carefully handcrafted with love.",
  },
  {
    icon: <ShieldCheck size={32} />,
    title: "High Accuracy",
    description: "Super realistic details for a true-to-life look.",
  },
  {
    icon: <Truck size={32} />,
    title: "Fast Delivery",
    description: "Safe packaging & on-time delivery.",
  },
  {
    icon: <PencilRuler size={32} />,
    title: "Custom Designs",
    description: "We create custom miniatures as per your imagination.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-10 px-4 bg-[#f4edee] dark:bg-[#0d0508]">
      <div className="max-w-7xl mx-auto">
        <div className="bg-[#f4edee] dark:bg-white/5 border-2 border-[#fe4462] rounded-lg lg:rounded-full overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {features.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`flex items-center gap-4 p-6 ${
                  index !== features.length - 1
                    ? "lg:border-r-2 border-[#fe4462]"
                    : ""
                }`}
              >
                {/* Icon */}
                <div className="flex items-center justify-center w-18 h-18 rounded-full bg-white text-[#fe4462] shrink-0">
                  {item.icon}
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {item.title}
                  </h3>

                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}