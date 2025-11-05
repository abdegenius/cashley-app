"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  UserCircle,
  Contact,
  ChartNoAxesColumn,
  Keyboard,
  LockKeyhole,
  CircleQuestionMark,
  CircleAlert,
  Ticket,
  Palette,
  Copy,
  LogOut,
} from "lucide-react";

import Button from "@/components/ui/Button";
import { MenuItem } from "@/components/ui/buttons";
import { Section } from "@/components/ui/Section";
import { useAuthContext } from "@/context/AuthContext";
import { logoutModal } from "@/controllers/logout-modal";

export default function ProfilePage() {
  const { user } = useAuthContext();
  const router = useRouter();

  return (
    <div className="w-full h-full flex items-start justify-center px-4 py-6">
      <div className="w-full flex flex-col gap-10 max-w-lg">
        {/* === PROFILE CARD === */}
        <div className="relative w-full bg-card rounded-2xl shadow-sm p-6 flex flex-col items-center justify-center space-y-3 border border-border/30">
          <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-purple-500/20">
            <Image
              src={user?.photo ?? "/default-avatar.png"}
              alt="Profile photo"
              width={96}
              height={96}
              className="object-cover"
            />
          </div>

          <div className="text-center space-y-1">
            <h2 className="text-lg font-semibold capitalize">
              {user?.firstname} {user?.lastname}
            </h2>
            <div className="flex justify-center items-center gap-2 text-xs text-muted-foreground">
              <span className="tracking-wide">UID: {user?.uid}</span>
              <button className="hover:text-purple-600 transition">
                <Copy size={14} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-purple-50 dark:bg-purple-900/30 px-3 py-1.5 rounded-full text-purple-600 text-xs font-medium">
            <span>Level - {user?.level}</span>
            <CircleAlert size={14} />
          </div>
        </div>

        {/* === ACCOUNT INFO === */}
        <Section title="Account Information">
          <MenuItem
            icon={<UserCircle size={18} />}
            label="Profile Details"
            label2="View and manage your info"
            link="/app/profile/edit"
            showBorder
            type="link"
          />
          <MenuItem
            icon={<Contact size={18} />}
            label="KYC Verification"
            label2="Upgrade your account limit"
            link="/app/profile/kyc-verification"
            showBorder
            type="link"
          />
          <MenuItem
            icon={<ChartNoAxesColumn size={18} />}
            label="Leaderboard"
            label2="Check weekly rankings"
            link="/app/leaderboard"
            showBorder
            type="link"
          />
        </Section>

        {/* === SECURITY === */}
        <Section title="Security & Privacy">
          <MenuItem
            icon={<Keyboard size={18} />}
            label="Change PIN"
            label2="Update your transaction PIN"
            link="/app/profile/change-pin"
            showBorder
            type="link"
          />
          <MenuItem
            icon={<LockKeyhole size={18} />}
            label="Change Password"
            label2="Update your login password"
            link="/app/profile/change-password"
            showBorder
            type="link"
          />
        </Section>

        {/* === REFERRAL === */}
        <div className="w-full bg-card rounded-2xl shadow-sm border border-border/30 py-6 px-5 flex flex-col gap-4">
          <div>
            <h3 className="font-bold text-lg">Refer & Earn</h3>
            <p className="text-xs text-muted-foreground">
              Earn ₦500 for each friend you invite
            </p>
          </div>

          <div className="flex justify-between items-center bg-background/60 px-3 py-2 rounded-xl">
            <div>
              <div className="text-xs text-muted-foreground">Referral Code</div>
              <div className="font-semibold text-sm">
                {user?.referral_code}
              </div>
            </div>
            <button className="hover:text-purple-600 transition">
              <Copy size={16} />
            </button>
          </div>

          <Button type="secondary" text="Share Referral Code" width="w-full" />
        </div>

        {/* === SUPPORT === */}
        <Section title="Support & Help">
          <MenuItem
            icon={<CircleQuestionMark size={18} />}
            label="FAQs"
            label2="Find answers or ask questions"
            link="/app/faq"
            showBorder
            type="link"
          />
          <MenuItem
            icon={<Ticket size={18} />}
            label="Submit a Ticket"
            label2="Get help from our support team"
            link="#"
            showBorder
            type="link"
          />
        </Section>

        {/* === APP SETTINGS === */}
        <Section title="App Settings">
          <MenuItem
            icon={<Palette size={18} />}
            label="Appearance"
            label2="Customize your theme"
            link="/app/profile/appearance"
            showBorder
            type="link"
          />
          <MenuItem
            icon={<CircleAlert size={18} />}
            label="About Cashley"
            label2="Learn more about the app"
            link="/app/profile/about"
            showBorder
            type="link"
          />

          {/* LOGOUT BUTTON */}
          <div className="w-full mt-4 p-0.5 rounded-2xl bg-gradient-to-r from-orange-500 to-purple-600">
            <button
              onClick={() => logoutModal.open()}
              className="w-full py-4 px-5 rounded-2xl bg-card flex items-center justify-between font-medium hover:opacity-90 transition"
            >
              <span>Log out</span>
              <LogOut size={18} />
            </button>
          </div>
        </Section>
      </div>
    </div>
  );
}
