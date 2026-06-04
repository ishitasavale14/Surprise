import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Letter = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="min-h-screen flex items-center justify-center py-20"
      style={{ perspective: "2000px" }}
    >
      {!isOpen ? (
        <motion.div
          onClick={() => setIsOpen(true)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ rotateX: 20, rotateY: -10, scale: 1.05 }}
          className="relative w-80 h-56 bg-[#fdf2f0] rounded-xl shadow-2xl cursor-pointer group flex items-center justify-center border border-white/40"
        >
          {/* Wax Seal Effect */}
          <motion.div
            className="z-20 w-16 h-16 bg-red-700/90 rounded-full flex items-center justify-center text-white text-2xl shadow-lg border-2 border-red-800"
            whileHover={{ scale: 1.2, rotate: 15 }}
          >
            ❤
          </motion.div>
          {/* Envelope Back */}
          <div className="absolute inset-0 bg-pink-50/50 rounded-xl overflow-hidden">
            <div
              className="absolute top-0 left-0 w-full h-full"
              style={{ clipPath: "polygon(0 0, 50% 50%, 100% 0)" }}
            />
          </div>
        </motion.div>
      ) : (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-md p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="relative w-full max-w-2xl bg-[#fffdfa] rounded-sm shadow-[0_50px_100px_rgba(0,0,0,0.1)] overflow-hidden"
            initial={{ y: 500, rotateX: 90 }}
            animate={{ y: 0, rotateX: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 80 }}
          >
            {/* Paper Texture and Content */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]" />

            <div className="p-10 md:p-20">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 1.5 } },
                }}
                className="font-serif text-gray-800 space-y-8 italic text-lg leading-relaxed"
              >
                {/* Ink Reveal Text */}
                <motion.p
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  My Dearest,
                </motion.p>
                <motion.p
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  Every day with you feels like a dream I never want to wake up
                  from. This website is just a small piece of our magic.
                </motion.p>
                <motion.p
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  Happy Birthday, my love. Forever is just the beginning.
                </motion.p>
                <motion.p
                  variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                  className="text-pink-500 font-handwriting text-3xl pt-10"
                >
                  Always yours.
                </motion.p>
              </motion.div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 text-pink-300 hover:text-pink-500 transition-colors"
            >
              ✕
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Letter;
