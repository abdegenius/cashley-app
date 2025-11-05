
import { motion } from "framer-motion";
export const LoadingOverlay = () => (
    <div className="fixed inset-0 w-full h-full max-w-xl mx-auto flex flex-col items-center justify-center z-[99]">
        <div className="absolute w-full h-full bg-stone-900/40 backdrop-blur-sm" />
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="w-20 h-20 border-6 border-purple-500 border-t-transparent rounded-full"
            />
        </motion.div>
    </div>
);
