"use client";

import React, { useState } from "react";

export default function Notifications() {
  const [activeTab, setActiveTab] = useState<number>(1);

  const notifications = [
    {
      id: "dmdkmodkcemecm",
      title: "Funds transfer notification",
      date: "Tuesday, July 1, 2025 - 8:00AM",
      description: "Your transfer of ₦100,000 to @divine was successful.",
    },
    {
      id: "sslskkcwq",
      title: "Funds transfer notification",
      date: "Tuesday, July 1, 2025 - 8:00AM",
      description: "Your transfer of ₦100,000 to @divine was successful.",
    },
    {
      id: "dmdklmdlmmodkcemecm",
      title: "Funds transfer notification",
      date: "Tuesday, July 1, 2025 - 8:00AM",
      description: "Your transfer of ₦100,000 to @divine was successful.",
    },
    {
      id: "dqqfdnwnwk",
      title: "Funds transfer notification",
      date: "Tuesday, July 1, 2025 - 8:00AM",
      description: "Your transfer of ₦100,000 to @divine was successful.",
    },
  ];

  return (
    <div className="w-full h-full flex flex-col my-auto items-center justify-between space-y-6">
      <div className="w-full flex flex-col space-y-12 items-center">
        <div className="space-y-2 w-full">
          <h1 className="text-3xl font-black">Notifications</h1>
          <h3>Stay up to date with news and updates,</h3>
        </div>
        <div className="flex items-center gap-2 bg-card p-2 flex-1 w-full max-w-xs rounded-full">
          {[
            { id: 1, title: "Unread" },
            { id: 2, title: "Read" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-1/2 truncate flex-1 text-sm  font-black p-3 rounded-3xl transition-all duration-300 ${
                activeTab === tab.id
                  ? "primary-purple-to-blue shadow-md "
                  : " hover:primary-orange-to-purple"
              }`}
            >
              {tab.title}
            </button>
          ))}
        </div>

        {activeTab === 1 ? (
          <div className="w-full flex flex-col space-y-3 max-h-161 overflow-scroll justify-around">
            {notifications?.map((notif) => (
              <div
                key={notif.id}
                className="w-full bg-card gap-3 p-4 rounded-xl flex items-center "
              >
                <span className="w-3 h-3 rounded-full bg-red-300" />
                <div className="">
                  <h4 className="text-sm">{notif.date}</h4>
                  <h2 className="text-lg font-semibold">{notif.title}</h2>
                  <h3>{notif.description}</h3>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3 mt-5 w-full max-w-sm"></div>
        )}
      </div>
    </div>
  );
}
