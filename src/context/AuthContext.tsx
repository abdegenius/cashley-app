"use client";
import { createContext, useContext } from "react";
import { User } from "@/types/api";

interface AuthContextType {
    user?: User | null;
}

const AuthContext = createContext<AuthContextType>({});

export const useAuthContext = () => useContext(AuthContext);

export function AuthProvider({ user, children }: { user?: User | null; children: React.ReactNode }) {
    return <AuthContext.Provider value={{  user: user ?? undefined }}>{children}</AuthContext.Provider>;
}

