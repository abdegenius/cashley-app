"use client";

import api from "@/lib/axios";
import React, { useEffect, useState } from "react";
import { ApiResponse, Notification } from "@/types/api";
import moment from "moment";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { LoadingOverlay } from "@/components/Loading";

export default function NotificationPage() {
  const [activeTab, setActiveTab] = useState<string>("unread");
  const [notifications, setNotifications] = useState<Notification[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const updateNotification = async (reference: string) => {
    try {
      setLoading(true)
      const res = await api.put<ApiResponse>(`/notifications/${reference}`, { status: "read" });
      if (res.data.error) {
        toast.error(res.data.message)
        return;
      }
      toast.success("Marked as read");
    } catch (err) {
      console.warn("Failed to update notifications", err);
    } finally {
      setLoading(false)
      fetchNotifications();
    }
  };

  const deleteNotification = async (reference: string) => {
    try {
      setLoading(true)
      const res = await api.delete<ApiResponse>(`/notifications/${reference}`);
      if (res.data.error) {
        toast.error(res.data.message)
        return;
      }
      toast.success("Notification deleted");
    } catch (err) {
      console.warn("Failed to update notifications", err);
    } finally {
      setLoading(false)
      fetchNotifications();
    }
  };

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/notifications/all?status=${activeTab}`);

      const list = Array.isArray(res.data?.data?.data)
        ? res.data.data.data
        : [];

      setNotifications(list);
    } catch (err) {
      console.warn("Failed to fetch notifications", err);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  // fetch when tab changes
  useEffect(() => {
    fetchNotifications();
  }, [activeTab]);

  const handleActiveTab = (status: string) => {
    setActiveTab(status);
  };

  return (
    <div className="w-full h-full flex flex-col my-auto items-center justify-between space-y-6 px-4">
      {loading && <LoadingOverlay />}

      <div className="w-full flex flex-col space-y-12 items-center">

        <div className="space-y-2 w-full">
          <h1 className="text-3xl font-black">Notifications</h1>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 bg-card p-2 w-full max-w-xs rounded-full">
          {[
            { id: "unread", title: "Unread" },
            { id: "read", title: "Read" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleActiveTab(tab.id)}
              className={`w-1/2 flex-1 text-sm font-black p-3 rounded-3xl transition-all duration-300 ${activeTab === tab.id
                ? "primary-purple-to-blue shadow-md"
                : "hover:primary-orange-to-purple"
                }`}
            >
              {tab.title}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="w-full flex flex-col space-y-3 h-auto overflow-y-auto justify-around">

          {/* Loading */}
          {loading && (
            <div className="text-center text-zinc-500 py-8">
              Loading notifications...
            </div>
          )}

          {/* Loaded */}
          {!loading && notifications && notifications.length > 0 && (
            notifications.map((notification) => (
              <div onClick={() => {
                if (notification.status === "unread") {
                  updateNotification(notification.reference)
                }
                return;
              }}
                key={notification.id}
                className="w-full bg-card gap-2 p-4 rounded-xl overflow-hidden flex items-center relative"
              >
                <div>
                  <h4 className="text-xs text-stone-400">
                    {moment(notification.created_at).fromNow()}
                  </h4>
                  <h2 className="text-md font-semibold">{notification.title}</h2>
                  <p className="text-xs text-stone-400">{notification.body}</p>
                </div>


                <span
                  onClick={() => deleteNotification(notification.reference)}
                  className="bg-background p-2 rounded-md cursor-pointer absolute -top-1 -right-1"
                >
                  <Trash2 color="red" size={16} />
                </span>
              </div>
            ))
          )}

          {/* Empty state */}
          {!loading && notifications && notifications.length === 0 && (
            <div className="text-center text-zinc-500 py-8">
              No {activeTab} notifications
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
