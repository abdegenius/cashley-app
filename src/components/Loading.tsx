import { motion } from "framer-motion";
export const LoadingOverlay = () => (
  <div className="w-full h-full fixed inset-0 z-[99]">
    <div className="relative w-full h-full max-w-xl mx-auto flex flex-col items-center justify-center">
      <div className="absolute w-full h-full bg-stone-900/40 backdrop-blur-sm" />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative flex items-center justify-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
            className="w-20 h-20 border-[6px] border-transparent rounded-full 
                   bg-gradient-to-tr from-purple-500 via-fuchsia-500 to-cyan-400 
                   animate-spin-slow"
            style={{
              mask: "radial-gradient(farthest-side, transparent calc(100% - 6px), black 100%)",
              WebkitMask:
                "radial-gradient(farthest-side, transparent calc(100% - 6px), black 100%)",
            }}
          />
          {/* Center dot */}
          <div className="absolute w-6 h-6 bg-purple-500 rounded-full shadow-lg shadow-purple-500/40" />
        </motion.div>
      </motion.div>
    </div>
  </div>
);
