import api from "@/lib/axios";
import { ApiResponse } from "@/types/api";
import { AxiosRequestConfig } from "axios";
import { useEffect, useState, useCallback } from "react";

export default function useFetch<T = any>(endpoint: string, config?: AxiosRequestConfig<any>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (url: string, config?: AxiosRequestConfig<any>) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<ApiResponse<T>>(url, config);

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
    if (endpoint) {
      fetchData(endpoint, config);
    }
  }, [endpoint, fetchData, JSON.stringify(config)]);

  const refetch = useCallback(() => {
    if (endpoint) {
      fetchData(endpoint, config);
    }
  }, [endpoint, fetchData, config]);

  return { data, loading, error, refetch };
}
