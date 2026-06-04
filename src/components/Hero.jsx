import React from "react";
import { motion } from "framer-motion";

const Hero = ({ onEnter }) => {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#fff5f5]">
      {/* Cinematic Background Elements (Keep existing hearts/floating bits) */}
      <div className="z-10 text-center px-4 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="bg-white/30 backdrop-blur-md border border-white/60 p-12 rounded-[50px] shadow-2xl"
        >
          <motion.h1
            className="text-6xl md:text-8xl font-serif text-pink-500 mb-6 drop-shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            Happy Birthday
          </motion.h1>

          <motion.p
            className="text-pink-400/80 text-xl md:text-2xl font-light tracking-[0.2em] uppercase mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
          >
            Our Story in Every Moment
          </motion.p>

          <motion.button
            onClick={onEnter}
            whileHover={{ scale: 1.05, letterSpacing: "0.1em" }}
            whileTap={{ scale: 0.95 }}
            className="px-14 py-4 bg-white/60 backdrop-blur-lg border border-white text-pink-500 rounded-full text-lg font-medium shadow-lg hover:shadow-pink-200/50 transition-all duration-300"
          >
            Enter Our Story
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
