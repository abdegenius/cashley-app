import api from "@/lib/axios";
import { ApiResponse } from "@/types/api";
import { useEffect, useState, useCallback } from "react";

/**
 * A reusable hook to fetch data from any API endpoint
 * @param endpoint - The API endpoint to fetch from
 * @param immediate - Whether to fetch immediately on mount (default: true)
 * @returns { data, loading, error, refetch }
 */
export default function useFetch<T = any>(
  endpoint: string, 
  immediate: boolean = true
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (url: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<ApiResponse<T>>(url);
      
      if (res.data.data !== undefined && res.data.data !== null) {
        setData(res.data.data);
      } else if (res.data) {
        setData(res.data as T);
      }
      
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "An error occurred";
      setError(errorMessage);
      console.error(`Error fetching ${url}:`, err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (immediate && endpoint) {
      fetchData(endpoint);
    }
  }, [endpoint, fetchData, immediate]);

  const refetch = useCallback(() => {
    fetchData(endpoint);
  }, [endpoint, fetchData]);

  return { data, loading, error, refetch };
}