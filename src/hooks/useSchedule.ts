"use client";
import api from "@/lib/axios";
import { ApiResponse } from "@/types/api";
import React, { useState, useCallback } from "react";
import toast from "react-hot-toast";

export default function useSchedule() {
  const [schedules, setSchedules] = useState<any[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSchedules = async (action?: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<ApiResponse>(`/schedules?action=${action}`);
      if (!res.data.error && res.data.data) {
        setSchedules(res.data.data.data || []);
      } else {
        const message = res.data.message || "Failed to fetch schedules";
        setError(message);
        toast.error(message);
      }
    } catch (err: any) {
      const message = err.response?.data?.message || "Failed to fetch schedules";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const addSchedule = async (payload: any) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post<ApiResponse>("/schedules", payload);
      if (!res.data.error && res.data.data) {
        setSchedules((prev) => [...(prev || []), res.data.data]);
        toast.success("Schedule created successfully");
        return res.data.data;
      } else {
        const message = res.data.message || "Failed to create schedule";
        setError(message);
        toast.error(message);
      }
    } catch (err: any) {
      const message = err.response?.data?.message || "Failed to create schedule";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const deleteSchedule = async (reference: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.delete<ApiResponse>(`/schedules/${reference}`);
      if (!res.data.error) {
        setSchedules((prev) => (prev || []).filter((schedule) => schedule.reference !== reference));
        toast.success("Schedule deleted successfully");
      } else {
        const message = res.data.message || "Failed to delete schedule";
        setError(message);
        toast.error(message);
      }
    } catch (err: any) {
      const message = err.response?.data?.message || "Failed to delete schedule";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const viewSchedule = async (reference: any) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<ApiResponse>(`/schedules/${reference}`);
      if (!res.data.error && res.data.data) {
        return res.data.data;
      } else {
        const message = res.data.message || "Failed to fetch schedule";
        setError(message);
        toast.error(message);
      }
    } catch (err: any) {
      const message = err.response?.data?.message || "Failed to fetch schedule";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const viewScheduleHistory = async (reference: any) => {
    setLoading(true);
    setError(null);
    let message = null;
    try {
      const res = await api.get<ApiResponse>(`/schedules/history/${reference}`);
      if (!res.data.error && res.data.data) {
        return res.data.data.data || [];
      } else {
        message = res.data.message || "Failed to fetch schedule history";
      }
    } catch (err: any) {
      message = err.response?.data?.message || "Failed to fetch schedule history";
    } finally {
      if (message) {
        setError(message);
        toast.error(message);
        message = null;
      }
      setLoading(false);
      return null;
    }
  };

  const updateSchedule = async (reference: any, updateData: any) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.put<ApiResponse>(`/schedules/${reference}`, updateData);
      if (!res.data.error && res.data.data) {
        setSchedules((prev) => {
          const list = prev || [];
          return list.map((schedule) =>
            schedule.reference === reference
              ? {
                  ...schedule,
                  ...res.data.data,
                  data: {
                    ...schedule.data,
                    ...(res.data.data.data || {}),
                    status: updateData.data?.status || updateData.status,
                  },
                }
              : schedule
          );
        });

        toast.success("Schedule updated successfully");
        return res.data.data;
      } else {
        const message = res.data.message || "Failed to update schedule";
        setError(message);
        toast.error(message);
      }
    } catch (err: any) {
      const message = err.response?.data?.message || "Failed to update schedule";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const updateScheduleStatus = useCallback(
    async (reference: string) => {
      if (!reference) {
        toast.error("Invalid schedule reference");
        return;
      }

      if (!schedules || schedules.length === 0) {
        toast.error("No schedules available");
        return;
      }

      const schedule = schedules.find((s) => s.reference === reference);

      if (!schedule) {
        toast.error("Schedule not found");
        return;
      }

      const currentStatus = schedule.data?.status || schedule.status;
      if (!["running", "pause"].includes(currentStatus)) {
        toast.error("Invalid schedule status");
        return;
      }

      const newStatus = currentStatus === "running" ? "pause" : "running";

      try {
        const payload = {
          data: {
            ...schedule.data,
            status: newStatus,
          },
        };
        await updateSchedule(reference, payload);

        toast.success(`Schedule ${newStatus === "running" ? "resumed" : "paused"}`);
      } catch (err) {
        toast.error("Failed to update schedule status");
      }
    },
    [schedules, updateSchedule]
  );

  const isRunning = useCallback(
    (reference: string) => {
      if (!schedules) return false; // ← SAFE
      const schedule = schedules.find((s) => s.reference === reference);
      const status = schedule?.data?.status || schedule?.status;
      return status === "running";
    },
    [schedules]
  );

  const clearError = () => setError(null);

  return {
    schedules,
    loading,
    error,
    fetchSchedules,
    addSchedule,
    deleteSchedule,
    viewSchedule,
    viewScheduleHistory,
    updateSchedule,
    updateScheduleStatus,
    isRunning,
    clearError,
  };
}
