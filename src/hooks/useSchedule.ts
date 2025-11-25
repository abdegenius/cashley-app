"use client";
import api from "@/lib/axios";
import { ApiResponse } from "@/types/api";
import React, { useState } from "react";
import toast from "react-hot-toast";

export default function useSchedule() {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSchedules = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<ApiResponse>("/schedules");
      if (!res.data.error && res.data.data) {
        setSchedules(res.data.data.data);
      } else {
        const errorMessage = res.data.message || "Failed to fetch schedules";
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to fetch schedules";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Failed to fetch schedules:", err);
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
        setSchedules(prev => [...prev, res.data.data]);
        toast.success("Schedule created successfully");
        return res.data.data; 
      } else {
        const errorMessage = res.data.message || "Failed to create schedule";
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to create schedule";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Failed to create schedule:", err);
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
        setSchedules(prev => prev.filter(schedule => schedule.reference !== reference));
        toast.success("Schedule deleted successfully");
      } else {
        const errorMessage = res.data.message || "Failed to delete schedule";
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to delete schedule";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Failed to delete schedule:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSingleSchedule = async (id: any) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<ApiResponse>(`/schedules/${id}`);
      if (!res.data.error && res.data.data) {
        return res.data.data;
      } else {
        const errorMessage = res.data.message || "Failed to fetch schedule";
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to fetch schedule";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Failed to fetch schedule:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchScheduleHistory = async (id: any) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<ApiResponse>(`/schedules/history/${id}`);
      if (!res.data.error && res.data.data) {
        return res.data.data; 
      } else {
        const errorMessage = res.data.message || "Failed to fetch schedule history";
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to fetch schedule history";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Failed to fetch schedule history:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateSchedule = async (reference: any, updateData: any) => {
  setLoading(true);
  setError(null);
  try {
    const res = await api.put<ApiResponse>(`/schedules/${reference}`, updateData);
    if (!res.data.error && res.data.data) {
      
      setSchedules(prev => 
        prev.map(schedule => 
          schedule.reference === reference 
            ? { 
                ...schedule,
                ...res.data.data,
                data: {
                  ...schedule.data, 
                  ...(res.data.data.data || {}),
                  status: updateData.status 
                }
              } 
            : schedule
        )
      );
      toast.success("Schedule updated successfully");
      return res.data.data;
    } else {
      const errorMessage = res.data.message || "Failed to update schedule";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || "Failed to update schedule";
    setError(errorMessage);
    toast.error(errorMessage);
    console.error("Failed to update schedule:", err);
  } finally {
    setLoading(false);
  }
};

  const clearError = () => setError(null);

  return {
    schedules,
    loading,
    error,
    fetchSchedules,
    addSchedule, 
    deleteSchedule, 
    fetchSingleSchedule,
    fetchScheduleHistory, 
    updateSchedule, 
    clearError,
  };
}