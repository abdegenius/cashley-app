"use client"
import Image from "next/image";
import React, { useState } from "react";

export default function LeaderboardPage() {

    const [activeTab, setActiveTab] = useState<number>(1);

    const leaderboards = [
        { id: 1, name: "James", photo: "/globe.svg" },
        { id: 1, name: "James", photo: "/globe.svg" },
        { id: 1, name: "James", photo: "/globe.svg" },
        { id: 1, name: "James", photo: "/globe.svg" },
        { id: 1, name: "James", photo: "/globe.svg" },
        { id: 1, name: "James", photo: "/globe.svg" },
        { id: 1, name: "James", photo: "/globe.svg" },
        { id: 1, name: "James", photo: "/globe.svg" },
        { id: 1, name: "James", photo: "/globe.svg" },
        { id: 1, name: "James", photo: "/globe.svg" },
    ]
    const getRankTitle = (rank: number) => {
        let response;
        switch (rank) {
            case 1:
                response = "1st";
                break;
            case 2:
                response = "2nd";
                break;
            case 3:
                response = "3rd";
                break;
            default:
                response = `${rank}th`;
                break;
        }
        return response;
    }
    const getRankDesc = (rank: number) => {
        let response;
        switch (rank) {
            case 1:
                response = "Be on the podium next time champ.";
                break;
            default:
                response = "Be on the podium next time champ.";
                break;
        }
        return response;
    }
    return (
        <div className="max-w-lg mx-auto w-full flex flex-col min-h-full h-full justify-between space-y-2">
            <h1 className="text-xl font-black">Leaderboard</h1>
            <div className="pb-4 text-sm placeholder-text">Here is the list of cashley top performers</div>
            <div className="space-y-4 w-full mx-auto text-lg pt-4">
                <div className="w-full grid grid-cols-1 items-center gap-6">
                    <div className="flex items-center justify-between mx-auto gap-2 bg-card p-2 flex-1 w-full max-w-[320px] rounded-full">
                        {[
                            { id: 1, title: "This Week" },
                            { id: 2, title: "Last Week" },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-1/2 truncate flex-1 font-bold text-sm p-3 rounded-3xl transition-all duration-300 ${activeTab === tab.id
                                    ? "primary-purple-to-blue shadow-md"
                                    : " hover:primary-orange-to-purple"
                                    }`}
                            >
                                {tab.title}
                            </button>
                        ))}
                    </div>

                    <div className="w-full bg-card p-3 flex flex-row items-center justify-start space-x-4 rounded-xl">
                        <div className="w-full flex flex-row items-center justify-start">
                            <div className="w-16 h-16 rounded-full">
                                <Image
                                    src={"/globe.svg"}
                                    alt="user profile"
                                    width={60}
                                    height={60}
                                    className="object-cover"
                                />
                            </div>
                            <div className="w-full flex flex-col space-y-0 px-2">
                                <div className="text-xl font-bold">You</div>
                                <div className="text-sm font-normal text-card">You are left far behind!</div>
                            </div>
                        </div>

                        <div className="w-16 h-16 px-4 text-center rounded-full flex-1 flex items-center justify-center mx-auto primary-purple-to-blue text-md font-bold">
                            24th
                        </div>

                    </div>


                    <div className="text-2xl font-semibold">All Rankings</div>

                    <ul className="w-full items-start justify-start space-y-2 divide-y divide-stone-200">
                        {leaderboards.map((user, i) => (
                            <li key={i} className="w-full pb-4 pt-2 flex flex-row items-center justify-start space-x-2">
                                <div className="w-full flex flex-row items-center justify-start">
                                    <div className="w-12 h-12 rounded-full">
                                        <Image
                                            src={user.photo}
                                            alt="user profile"
                                            width={48}
                                            height={48}
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="w-full flex flex-col space-y-0 px-2">
                                        <div className="text-md font-semibold">{user.name}</div>
                                        <div className="text-xs font-normal text-card">{getRankDesc(user.id)}</div>
                                    </div>
                                </div>

                                <div className="w-12 h-12 p-4 text-center rounded-full flex-1 flex items-center justify-center mx-auto bg-card text-lg font-semibold">
                                    {getRankTitle(user.id)}
                                </div>

                            </li>
                        ))}
                    </ul>

                </div>
            </div>
        </div>
    );
}
