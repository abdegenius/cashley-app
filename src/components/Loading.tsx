
import { motion, AnimatePresence } from "framer-motion";
export const LoadingOverlay = () => (
    <div className="fixed w-full h-full bg-card">
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed max-w-xl mx-auto w-full h-full m-0 p-0 z-50 inset-0 bg-stone-900/40 backdrop-blur-sm flex items-center justify-center"
            >
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-20 h-20 border-6 border-purple-500 border-t-transparent rounded-full"
                />
            </motion.div>
        </AnimatePresence>
    </div>
);
