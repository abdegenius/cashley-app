import api from "@/lib/axios";
import { ApiResponse } from "@/types/api";
import React from "react";
import toast from "react-hot-toast";

export default function useBeneficiary() {
  const [beneficiaries, setBeneficiaries] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [status, setStatus] = React.useState<string | null>();

  const fetchBeneficiaries = async (action: string | null) => {
    if (!action || typeof action !== 'string') {
      setError("Invalid action parameter");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await api.get<ApiResponse>(`/beneficiaries?action=${action}`);
      if (!res.data.error && res.data.data) {
        setBeneficiaries(res.data.data.data);
        setStatus(res.data.message);
      } else {
        const errorMessage = res.data.message || "Failed to fetch beneficiaries";
        setError(errorMessage);
        setStatus(errorMessage);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to fetch beneficiaries";
      setError(errorMessage);
      setStatus(errorMessage);
      console.error("Failed to fetch beneficiaries", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteBeneficiary = async (reference: string) => {
  setLoading(true);
  setError(null);
  try {
    const res = await api.delete<ApiResponse>(`/beneficiaries/${reference}`);
    if (res.data.message === "Successful") {
      toast.success("Beneficiary deleted");
      
      setBeneficiaries(prev => prev.filter(ben => ben.data.reference !== reference));
    } else {
      const errorMessage = res.data.message || "Failed to delete beneficiary";
      toast.error(errorMessage);
      setStatus(errorMessage);
    }
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || "Failed to delete beneficiary";
    setError(errorMessage);
    toast.error(errorMessage);
    setStatus(errorMessage);
    console.error("Failed to delete beneficiary", err);
  } finally {
    setLoading(false);
  }
};

  const addBeneficiary = async (beneficiaryData: any) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post<ApiResponse>("/beneficiaries", beneficiaryData);
      
      if (!res.data.error && res.data.data) {
        setBeneficiaries((prev) => [...prev, res.data.data]);
        setStatus(res.data.message);
      } else {
        const errorMessage = res.data.message || "Failed to add beneficiary";
        setError(errorMessage);
        setStatus(errorMessage);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to add beneficiary";
      setError(errorMessage);
      setStatus(errorMessage);
      console.error("Failed to add beneficiary", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    beneficiaries,
    error,
    addBeneficiary,
    status,
    deleteBeneficiary,
    loading,
    fetchBeneficiaries,
  };
}