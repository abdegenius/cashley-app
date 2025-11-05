import { services } from "@/utils/string";
import Link from "next/link";
import React from "react";
import { useAuthContext } from "@/context/AuthContext";

export default function ServicesPage() {
  const { user } = useAuthContext();
  return (
    <div className="w-full h-full flex flex-col space-y-6 p-4">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Services</h1>
        <h4 className="text-md font-normal">Choose a service to get started</h4>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full">
        {services?.map((service, id) => (
          <Link
            key={id}
            href={service.link}
            className="w-full p-4 rounded-2xl bg-card flex flex-col border-2 border-transparent hover:border-purple-600 transition-all duration-300 items-center justify-center gap-0"
          >
            <div className="mb-2"><service.icon size={24} className="purple-text" /></div>
            <span className="text-lg text-center font-semibold">{service.name}</span>
            <span className="text-xs font-normal text-center">{service.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
