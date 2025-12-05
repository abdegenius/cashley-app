"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { ApiResponse } from "@/types/api";
import toast from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";

export default function GiftcardHistoryPage() {
    const [loading, setLoading] = useState(false);
    const [transactions, setTransactions] = useState<any[] | null>(null);
    const [activeTx, setActiveTx] = useState<any | null>(null); // modal data

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await api.get<ApiResponse>("/giftcard-transactions");
                if (res.data.error) {
                    toast.error("Unable to fetch history");
                    return;
                }
                setTransactions(res.data.data);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="w-full mx-auto max-w-xl flex flex-col space-y-4 px-4">

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <Link
                    href={"/app/giftcards"}
                    className="py-2 px-4 rounded-3xl border border-stone-800 bg-stone-900/50 hover:bg-stone-800/50 transition"
                >
                    Back to Sell Giftcard
                </Link>
            </div>

            <h2 className="text-xl font-bold text-stone-300">Giftcard Sale History</h2>

            {/* Loading */}
            {loading && (
                <p className="text-center text-stone-400 py-10">Loading...</p>
            )}

            {/* Empty */}
            {!loading && transactions?.length === 0 && (
                <p className="text-center text-stone-400 py-10">
                    No giftcard sales yet.
                </p>
            )}

            {/* COMPACT LIST */}
            <div className="flex flex-col space-y-2">
                {transactions?.map((tx) => {
                    const statusColor =
                        tx.status === "pending"
                            ? "text-yellow-400"
                            : tx.status === "failed"
                                ? "text-red-400"
                                : "text-green-400";

                    return (
                        <button
                            key={tx.id}
                            onClick={() => setActiveTx(tx)}
                            className="flex items-center justify-between w-full p-3 rounded-xl border border-stone-800 bg-stone-900/40 hover:bg-stone-800/40 transition"
                        >
                            <div className="flex items-center gap-3">
                                <Image
                                    src={`/img/giftcard/${tx.logo}`}
                                    alt={tx.name}
                                    width={38}
                                    height={38}
                                    className="rounded-lg"
                                />
                                <div className="text-left">
                                    <p className="font-semibold text-stone-200 text-sm">
                                        {tx.name}
                                    </p>
                                    <p className="text-xs text-stone-400">
                                        {tx.value} {tx.currency} • {tx.country}
                                    </p>
                                </div>
                            </div>

                            <div className={`text-xs font-semibold ${statusColor}`}>
                                {tx.status}
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* ===================== MODAL ===================== */}
            {activeTx && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-xl relative">

                        {/* Close Button */}
                        <button
                            onClick={() => setActiveTx(null)}
                            className="absolute top-3 right-3 text-stone-300 hover:text-white"
                        >
                            ✕
                        </button>

                        {/* Header */}
                        <div className="flex items-center gap-3">
                            <Image
                                src={`/img/giftcard/${activeTx.logo}`}
                                alt={activeTx.name}
                                width={50}
                                height={50}
                                className="rounded-xl"
                            />
                            <div>
                                <h3 className="font-bold text-lg text-stone-200">
                                    {activeTx.name}
                                </h3>
                                <p className="text-stone-400 text-sm">
                                    {activeTx.country} • {activeTx.currency}
                                </p>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="space-y-2 text-sm text-stone-300">
                            <Row label="Face Value" value={`${activeTx.value} ${activeTx.currency}`} />
                            <Row label="Amount (NGN)" value={`₦${Number(activeTx.amount).toLocaleString()}`} />
                            <Row label="Voucher Code" value={activeTx.voucher} />
                            <Row label="Reference" value={activeTx.reference} />
                            <Row label="Date" value={new Date(activeTx.created_at).toLocaleString()} />

                            {/* Status */}
                            <div className="flex justify-between">
                                <span>Status:</span>
                                <span
                                    className={`px-3 py-1 rounded-full text-xs 
                                        ${activeTx.status === "pending"
                                            ? "bg-yellow-500/20 text-yellow-400"
                                            : activeTx.status === "failed"
                                                ? "bg-red-500/20 text-red-400"
                                                : "bg-green-500/20 text-green-400"
                                        }`}
                                >
                                    {activeTx.status}
                                </span>
                            </div>

                            {/* Reason */}
                            {activeTx.status === "failed" && activeTx.reason && (
                                <p className="text-red-400 text-sm">Reason: {activeTx.reason}</p>
                            )}

                            {/* Proof Image */}
                            {activeTx.proof && (
                                <div className="pt-3">
                                    <p className="mb-1 text-stone-400">Proof Image</p>
                                    <a href={activeTx.proof} target="_blank">
                                        <Image
                                            src={activeTx.proof}
                                            alt="Proof"
                                            width={400}
                                            height={400}
                                            className="rounded-xl border border-stone-800"
                                        />
                                    </a>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => setActiveTx(null)}
                            className="w-full py-2 mt-4 rounded-xl bg-stone-800 text-stone-200 hover:bg-stone-700 transition"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
}

// REUSABLE ROW COMPONENT
function Row({ label, value }: { label: string; value: any }) {
    return (
        <div className="flex justify-between">
            <span>{label}:</span>
            <span className="font-medium">{value}</span>
        </div>
    );
}
