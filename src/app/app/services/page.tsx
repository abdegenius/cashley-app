import {
  Bandage,
  Banknote,
  Bitcoin,
  Gift,
  Phone,
  PiggyBank,
  Tv,
  Wifi,
} from "lucide-react";
import Link from "next/link";
import React from "react";

export default function Services() {
  const services = [
    {
      name: "Airtime",
      description: "Buy airtime for all networks",
      icon: <Phone size={24} className="purple-text" />,
      link: "/",
    },
    {
      name: "Data",
      description: "Purchase data bundles",
      icon: <Wifi size={24} className="purple-text" />,
      link: "/",
    },
    {
      name: "TV",
      description: "Pay for cable subscriptions",
      icon: <Tv size={24} className="purple-text" />,
      link: "/",
    },
    {
      name: "Transfer",
      description: "Send money to friends & family",
      icon: <Banknote size={24} className="purple-text" />,
      link: "/",
    },
    {
      name: "Crypto",
      description: "Receive cryptocurrency",
      icon: <Bitcoin size={24} className="purple-text" />,
      link: "/",
    },
    {
      name: "Gift cards",
      description: "Save and Invest with interest",
      icon: <Gift size={24} className="purple-text" />,
      link: "/",
    },
    {
      name: "Savings",
      description: "Save funds with interest",
      icon: <PiggyBank size={24} className="purple-text" />,
      link: "/",
    },
    {
      name: "Investment",
      description: "Invest with interest",
      icon: <Bandage size={24} className="purple-text" />,
      link: "/",
    },
  ];
  return (
    <div className="w-full h-full flex flex-col gap-10 py-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-black">Services</h1>
        <h1 className="text-xl font-black">Choose a service to get started</h1>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6  w-full">
        {services?.map((service, id) => (
          <Link
            key={id}
            href={service.link}
            className="w-full p-7 rounded-2xl bg-card flex flex-col hover:bg-hover transition-all duration-300 items-center justify-center gap-3"
          >
            {service.icon}
            <span className="text-lg font-semibold">{service.name}</span>
            <span className="text-sm text-center">{service.description}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
