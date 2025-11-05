"use client";
import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { LoadingOverlay } from "./Loading";
import { AuthProvider } from "@/context/AuthContext";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { loading, authenticated, user } = useAuth();

    if (loading)
        return (
            <div className="bg-black w-full h-full">
                <LoadingOverlay />
            </div>
        );

    if (!authenticated) return null;

    return <AuthProvider user={user}>{children}</AuthProvider>;
}
