import api from "@/lib/axios";
import { ApiResponse } from "@/types/api";
import React from "react";
import toast from "react-hot-toast";

interface Favourite {
  id: string;
  data?: any;
  reference?: string;
  action?: string;
  created_at?: string;
}

export default function useFavourite() {
  const [favourites, setFavourites] = React.useState<Favourite[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [status, setStatus] = React.useState<string | null>(null);

  const fetchFavourites = async (action: string | null) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<ApiResponse>(`/favorites?action=${action}`);
      if (!res.data.error && res.data.data) {
        setFavourites(res.data.data.data);
        setStatus(res.data.message);
      } else {
        const errorMessage = res.data.message || "Failed to fetch favourites";
        setError(errorMessage);
        setStatus(errorMessage);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to fetch favourites";
      setError(errorMessage);
      setStatus(errorMessage);
      console.error("Failed to fetch favourites:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteFavourite = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.delete<ApiResponse>(`/favorites/${id}`);
      if (!res.data.error) {
        setFavourites((prev) => prev.filter((fav) => fav.id !== id));
        setStatus(res.data.message);
        toast.success("Favorite Deleted")
      } else {
        const errorMessage = res.data.message || "Failed to delete favourite";
        setError(errorMessage);
        setStatus(errorMessage);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to delete favourite";
      setError(errorMessage);
      setStatus(errorMessage);
      console.error("Failed to delete favourite:", err);
    } finally {
      setLoading(false);
    }
  };

  const addFavourite = async (favouriteData: any) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post<ApiResponse>("/favorites", favouriteData);
      if (!res.data.error && res.data.data) {
        setFavourites((prev) => [...prev, res.data.data.data]);
        setStatus(res.data.message);
      } else {
        const errorMessage = res.data.message || "Failed to add favourite";
        setError(errorMessage);
        setStatus(errorMessage);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to add favourite";
      setError(errorMessage);
      setStatus(errorMessage);
      console.error("Failed to add favourite:", err);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return { 
    favourites, 
    deleteFavourite, 
    status, 
    error, 
    addFavourite, 
    loading, 
    fetchFavourites,
    clearError 
  };
}