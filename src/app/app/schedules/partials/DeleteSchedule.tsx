
import { AnimatePresence, motion } from "framer-motion";
import { Dispatch, SetStateAction } from "react";

interface DeleteScheduleProps {
    reference: string | null;
    onClose: () => void;
    onDelete: (ref: string) => void;
}

export function DeleteSchedule({
    reference,
    onDelete,
    onClose
}: DeleteScheduleProps) {
    return (
        <AnimatePresence>
            {reference && (
                <ModalOverlay onClose={onClose}>
                    <motion.div
                        initial={{ y: 300, opacity: 0, scale: 0.8 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: 300, opacity: 0, scale: 0.8 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="grid sm:max-w-md mx-auto gap-4 w-full p-6 rounded-t-2xl sm:rounded-2xl bg-card relative z-20 shadow-2xl"
                    >
                        <h1 className="text-center text-xl font-semibold">Are you sure?</h1>
                        <p className="text-center text-stone-400 text-sm">
                            This action cannot be undone. The schedule will be permanently deleted.
                        </p>
                        <div className="flex gap-3 mt-4">
                            <button
                                onClick={onClose}
                                className="flex-1 p-3 rounded-xl bg-stone-700 hover:bg-stone-600 transition-colors text-lg font-semibold text-white"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    onDelete(reference);
                                }}
                                className="flex-1 p-3 rounded-xl bg-red-500 hover:bg-red-600 transition-colors text-lg font-semibold text-white"
                            >
                                Delete
                            </button>
                        </div>
                    </motion.div>
                </ModalOverlay>
            )}
        </AnimatePresence>
    );
}

const ModalOverlay = ({ children, onClose }: { children: React.ReactNode; onClose: () => void }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="w-full h-screen fixed top-0 left-0 flex items-end sm:items-center justify-center bg-black/50 z-50"
    >
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full absolute top-0 left-0 backdrop-blur-xl"
            onClick={onClose}
        />
        {children}
    </motion.div>
);
