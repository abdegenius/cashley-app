import { motion } from "framer-motion";
import { ArrowRight, Check, Fingerprint } from "lucide-react";

export function Keypad({
    numbers,
    onNumberClick,
    onDelete,
    onConfirm,
    disableConfirm,
    loading,
    step
}: {
    numbers: string[];
    onNumberClick: (num: string) => void;
    onDelete: () => void;
    onConfirm: () => void;
    disableConfirm: boolean;
    loading: boolean;
    step?: number
}) {
    return (
        <div className="grid grid-cols-3 gap-3 mx-auto sm:w-90 justify-center items-center">
            {numbers.map((num, idx) => {
                if (num === "←") {
                    return (
                        <motion.button
                            key={idx}
                            whileTap={{ scale: 0.9 }}
                            onClick={onDelete}
                            className="text-lg w-20 h-20 rounded-full bg-background font-semibold mx-auto hover:bg-stone-200 transition-all shadow-sm flex items-center justify-center"
                        >
                            ⌫
                        </motion.button>
                    );
                } else if (num === "✓") {
                    return (
                        <motion.button
                            key={idx}
                            whileTap={{ scale: 0.95 }}
                            onClick={onConfirm}
                            disabled={disableConfirm || loading}
                            className={`text-lg w-20 h-20 rounded-full font-semibold mx-auto hover:bg-stone-100  transition-all shadow-sm flex items-center justify-center ${disableConfirm || loading
                                ? "bg-background text-stone-400 cursor-not-allowed"
                                : "primary-purple-to-blue shadow-md"
                                }`}
                        >
                            <Fingerprint size={36} />
                        </motion.button>
                    );
                } else if (num === "#" && step) {
                    return (
                        <motion.button
                            key={idx}
                            whileTap={{ scale: 0.95 }}
                            onClick={onConfirm}
                            disabled={disableConfirm || loading}
                            className={`text-lg w-20 h-20 rounded-full font-semibold mx-auto hover:bg-stone-100  transition-all shadow-sm flex items-center justify-center ${disableConfirm || loading
                                ? "bg-background text-stone-400 cursor-not-allowed"
                                : "primary-purple-to-blue shadow-md"
                                }`}
                        >
                            {step == 1 ? <ArrowRight size={36} /> : <Check size={36} />}
                        </motion.button>
                    );
                }
                else {
                    return (
                        <motion.button
                            key={idx}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onNumberClick(num)}
                            className="text-lg w-20 h-20 rounded-full bg-card font-semibold mx-auto hover:bg-stone-100 transition-all shadow-sm"
                        >
                            {num}
                        </motion.button>
                    );
                }
            })}
        </div>
    );
}