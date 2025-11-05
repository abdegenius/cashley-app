"use client";

import Modal from "./ui/Modal";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { logoutModal } from "@/controllers/logout-modal";

const LogoutModal = () => {
    const router = useRouter();
    const [show, setShow] = useState(false);

    useEffect(() => {
        logoutModal.register(setShow);
    }, []);

    const handleLogout = async () => {
        try {
            await api.post("/auth/logout");
            toast.success("Logged out");
            router.push("/auth/login");
            setShow(false);
        } catch (err) {
            toast.error("Logout failed");
        }
    };

    return (
        <Modal show={show} onClose={() => setShow(false)}>
            <div className="w-full text-center px-6 py-12 bg-card rounded-t-3xl">
                <h3 className="text-lg font-semibold text-stone-300">Confirm Logout</h3>
                <p className="mt-2 text-sm text-stone-200">
                    Are you sure you want to log out? You can always sign back in.
                </p>

                <div className="mt-6 flex gap-3 mx-auto flex-1 items-center justify-center max-w-[80%]">
                    <button
                        onClick={() => setShow(false)}
                        className="flex-1 py-3 rounded-xl border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleLogout}
                        className="flex-1 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default LogoutModal;
