"use client"


import React, { act, useState } from "react";
import SideNav from "../components/sideNav";
import TopNav from "../components/topNav";
import Dashboard from "../components/tabs/dashboard";
import Users from "../components/tabs/users";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<string>("Dashboard");
  return (
    <div className="flex min-h-screen w-full ">
      <SideNav activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="w-full">
        <TopNav activeTab={activeTab} />
        <div className="w-full h-full ">
          {activeTab === "Dashboard" && <Dashboard />}
          {activeTab === "Users" && <Users />}
        </div>
      </div>
    </div>
  );
}
