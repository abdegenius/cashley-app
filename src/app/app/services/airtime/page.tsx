"use client"
import Purchase from '@/components/flows/service-flow'
import React from 'react'
import { useAuthContext } from "@/context/AuthContext";

export default function AirtimePage() {
  const { user } = useAuthContext();
  return (
    <div>
      <Purchase type='airtime' user={user} />
    </div>
  )
}
