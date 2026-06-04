import React from "react";
import { motion } from "framer-motion";
import { memories } from "../constants"; // Adjust path based on your file

const Memories = () => {
  return (
    <div className="min-h-screen py-20 bg-[#fffafa]">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
        {memories.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            className="group relative"
          >
            {/* Scrapbook Image Container */}
            <div className="relative overflow-hidden rounded-xl bg-white p-3 shadow-xl transform transition-transform group-hover:rotate-2 group-hover:scale-105 duration-500 border border-white/50">
              <div className="relative aspect-[4/5] overflow-hidden rounded-lg">
                <motion.img
                  src={item.image}
                  alt={item.month}
                  whileHover={{ scale: 1.1 }}
                  className="w-full h-full object-cover transition-all duration-700 brightness-[1.02]"
                />
                {/* Soft Pastel Overlay */}
                <div className="absolute inset-0 bg-pink-100/10 mix-blend-soft-light group-hover:opacity-0 transition-opacity" />
              </div>

              {/* Image Glow Pulse */}
              <div className="absolute -inset-2 bg-pink-200/20 blur-2xl opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-1000" />
            </div>

            {/* Text Content */}
            <div className="mt-8 text-center space-y-3">
              <h3 className="font-serif text-3xl text-pink-600/70">
                {item.month}
              </h3>
              <p className="text-gray-500 italic text-sm px-4">
                "{item.caption}"
              </p>
              <div className="pt-4 border-t border-pink-100 w-1/2 mx-auto">
                <p className="text-[10px] uppercase tracking-[0.2em] text-pink-400 font-semibold">
                  {item.quote}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Memories;
