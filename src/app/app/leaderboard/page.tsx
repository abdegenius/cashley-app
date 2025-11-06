"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Trophy, Medal, Sparkles, Loader2 } from "lucide-react";
import api from "@/lib/axios";
import { ApiResponse } from "@/types/api";
import { formatToNGN } from "@/utils/amount";

export default function LeaderboardPage() {
    const [activeTab, setActiveTab] = useState<"this_week" | "last_week">("this_week");
    const [leaderboard, setLeaderboard] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getLeaderboard = async () => {
            try {
                const res = await api.get<ApiResponse>("/transactions/leaderboard");
                if (!res.data.error) {
                    setLeaderboard(res.data.data);
                } else {
                    setLeaderboard(null);
                }
            } catch (err) {
                console.error("Error fetching leaderboard:", err);
                setLeaderboard(null);
            } finally {
                setLoading(false);
            }
        };
        getLeaderboard();
    }, []);

    const getRankTitle = (rank: number) => {
        switch (rank) {
            case 1:
                return "1st";
            case 2:
                return "2nd";
            case 3:
                return "3rd";
            default:
                return `${rank}th`;
        }
    };

    const activeData = leaderboard?.[activeTab] || { leaderboard: [], me: null };
    const top3 = activeData.leaderboard.slice(0, 3);
    const others = activeData.leaderboard.slice(3);

    const fallbackPhoto = "/default-avatar.png";

    return (
        <div className="max-w-lg mx-auto w-full flex flex-col min-h-screen h-full space-y-4 px-4 py-6 text-gray-100">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-black tracking-tight">Leaderboard</h1>
                {/* <Sparkles size={22} className="text-purple-400" /> */}
            </div>

            <p className="text-sm text-gray-400">
                Meet our top performers and climb your way to the top!
            </p>

            {/* Tabs */}
            <div className="flex bg-zinc-800 p-1 rounded-full mt-2">
                {[
                    { id: "this_week", title: "This Week" },
                    { id: "last_week", title: "Last Week" },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as "this_week" | "last_week")}
                        className={`flex-1 text-center py-2.5 text-sm font-semibold rounded-full transition-all ${activeTab === tab.id
                            ? "bg-gradient-to-r from-purple-600 to-blue-600 shadow-md"
                            : "text-gray-400 hover:text-white"
                            }`}
                    >
                        {tab.title}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center h-60 text-gray-400">
                    <Loader2 className="animate-spin mb-2" />
                    Loading, please wait...
                </div>
            ) : (
                <>
                    {activeData.leaderboard.length > 0 ? (
                        <>
                            {/* Podium Section (Top 3) */}
                            <div className="relative flex items-end justify-center gap-6 mt-6 mb-8">
                                {top3.map((user: any, index: number) => {
                                    const heights = [120, 90, 60];
                                    const colors = ["text-gray-300", "text-yellow-400", "text-orange-400"];
                                    const order = [0, 1, 2];
                                    const userPhoto = user.photo || fallbackPhoto;

                                    return (
                                        <div
                                            key={user.user_id}
                                            className={`flex flex-col items-center transition-all duration-300 transform ${index === 1 ? "scale-100 z-10" : "scale-100"
                                                }`}
                                            style={{ order: order[index] }}
                                        >
                                            <div
                                                className={`w-16 h-16 rounded-full border-4 border-purple-500 shadow-md overflow-hidden`}
                                            >
                                                <Image
                                                    src={userPhoto}
                                                    alt={user.username}
                                                    width={60}
                                                    height={60}
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="mt-2 flex flex-col items-center">
                                                <div className={`text-lg font-bold ${colors[index]}`}>
                                                    {getRankTitle(user.rank)}
                                                </div>
                                                <div className="text-sm text-gray-300 uppercase">
                                                    {/* {user.firstname} {user.lastname} */}
                                                    {user.username}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {formatToNGN(Number(user.total_amount))}
                                                </div>
                                            </div>
                                            <div
                                                className="mt-2 w-12 rounded-t-lg bg-gradient-to-b from-purple-600 to-zinc-800"
                                                style={{ height: `${heights[index]}px` }}
                                            ></div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Your Position */}
                            {activeData.me && (
                                <div className="w-full bg-zinc-900 rounded-xl flex items-center justify-between p-4 shadow-lg">
                                    <div className="flex items-center gap-3">
                                        <Image
                                            src={activeData.me.photo || fallbackPhoto}
                                            alt="you"
                                            width={50}
                                            height={50}
                                            className="rounded-full object-cover"
                                        />
                                        <div>
                                            <h3 className="text-lg font-bold uppercase">
                                                {/* {activeData.me.firstname} {activeData.me.lastname} */}
                                                {activeData.me.username}
                                            </h3>
                                            <p className="text-sm text-gray-400">
                                                Keep going, almost there!
                                            </p>
                                        </div>
                                    </div>
                                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full font-semibold">
                                        {getRankTitle(activeData.me.rank)}
                                    </div>
                                </div>
                            )}

                            {/* Rankings List */}
                            <div className="mt-6">
                                <h2 className="text-lg font-bold mb-3">All Rankings</h2>
                                <ul className="space-y-3">
                                    {others.map((user: any) => (
                                        <li
                                            key={user.user_id}
                                            className="flex items-center justify-between bg-zinc-800 p-3 rounded-xl hover:bg-zinc-700 transition"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Image
                                                    src={user.photo || fallbackPhoto}
                                                    alt={user.firstname}
                                                    width={44}
                                                    height={44}
                                                    className="rounded-full object-cover"
                                                />
                                                <div>
                                                    <h3 className="text-sm font-semibold uppercase">
                                                        {/* {user.firstname} {user.lastname} */}
                                                        {activeData.me.username}
                                                    </h3>
                                                    <p className="text-xs text-gray-400">
                                                        {formatToNGN(Number(user.total_amount))}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-sm font-bold text-purple-400">
                                                {getRankTitle(user.rank)}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-60 text-gray-400">
                            <Trophy className="mb-3 text-purple-400" size={36} />
                            <p>No leaderboard data available for this period.</p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
