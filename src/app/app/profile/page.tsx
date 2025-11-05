"use client";

import Button from "@/components/ui/Button";
import { MenuItem } from "@/components/ui/buttons";
import { Section } from "@/components/ui/Section";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useRouter } from "next/navigation";
import {
  Bell,
  ChartNoAxesColumn,
  CircleAlert,
  CircleQuestionMark,
  Contact,
  Copy,
  Headphones,
  Keyboard,
  LockKeyhole,
  LogOut,
  Ticket,
  UserIcon,
  UserCircle,
} from "lucide-react";
import Image from "next/image";
import React from "react";
import { useAuthContext } from "@/context/AuthContext";
import { logoutModal } from "@/controllers/logout-modal";

export default function ProfilePage() {
  const { user } = useAuthContext();
  const router = useRouter();
  return (
    <div className="w-full h-full flex items-start justify-center px-4">
      <div className="w-full flex flex-col gap-10 max-w-lg">
        <div className="w-full bg-card rounded-xl gap-1 py-4 flex flex-col items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-white relative ">
            <Image
              src={"/globe.svg"}
              alt="user profile"
              fill
              className="object-cover"
            />
          </div>
          <div>{user?.firstname + " " + user?.lastname}</div>
          <div className="flex gap-2 items-center">
            <span className="text-lg font-black">{user?.phone}</span>
            <button>
              <Copy size={16} />
            </button>
          </div>
          <div>{user?.username}</div>
          <div className="py-2 px-6 bg-background rounded-3xl flex gap-1 items-center text-purple-600">
            <span>Verified Account</span>
            <CircleAlert size={16} />
          </div>
        </div>
        <Section title="Account Information" description="" delay={0.12}>
          <MenuItem
            showBorder={true}
            icon={<UserCircle size={18} />}
            label="Profile Details"
            label2="Edit Profile"
            type="link"
            link="/app/profile/edit"
          />
          <MenuItem
            showBorder={true}
            icon={<Contact size={18} />}
            label="KYC Verification"
            label2="Tier 1 Verified"
            type="link"
            link="/app/profile/kyc-verification"
          />
          <MenuItem
            showBorder={true}
            icon={<ChartNoAxesColumn size={18} />}
            label="Leaderboard"
            label2="View Cashley weekly ranking"
            type="link"
            link="/app/leaderboard"
          />
        </Section>
        <Section title="Security & Privacy" description="" delay={0.12}>
          <MenuItem
            showBorder={true}
            icon={<Keyboard size={18} />}
            label="Change Pin"
            label2="Update your transaction PIN"
            type="link"
            link="/app/profile/change-pin"
          />
          <MenuItem
            showBorder={true}
            icon={<LockKeyhole size={18} />}
            label="Change Password"
            label2="Update your login password"
            type="link"
            link="/app/profile/change-password"
          />
        </Section>

        <div className="w-full bg-card rounded-xl gap-4 py-6 px-4 sm:px-6 flex flex-col items-start justify-start">
          <div className="flex flex-col gap-1">
            <div className="text-lg font-bold">Refer & Earn</div>
            <div className="text-xs">Earn ₦500 for each friend you refer</div>
          </div>
          <div className="flex justify-between w-full items-center">
            <div className="">
              <div className="text-xs">Your Referral Code</div>
              <div className=" font-bold">{user?.referral_code}</div>
            </div>
            <button className="placeholder-text">
              <Copy size={16} />
            </button>
          </div>

          <Button type="secondary" text="Share Referral Code" width="w-full" />
        </div>

        <Section title="Support & Help" description="" delay={0.12}>
          <MenuItem
            showBorder={true}
            icon={<CircleQuestionMark size={18} />}
            label="FAQs"
            label2="Ask a question or find answers"
            type="link"
            link="/app/faq"
          />
          <MenuItem
            showBorder={true}
            icon={<Headphones size={18} />}
            label="Contact Support"
            label2="Chat with us for assistance"
            type="link"
            link="/app/profile/chat"
          />
          <MenuItem
            showBorder={true}
            icon={<Ticket size={18} />}
            label="Submit a Ticket"
            label2=""
            type="link"
            link="#"
          />
        </Section>

        <Section title="App Settings" description="" delay={0.12}>
          <MenuItem
            showBorder={true}
            icon={<UserIcon size={18} />}
            label="Appearance"
            label2="Choose your preferred theme"
            type="link"
            link="/app/profile/appearance"
          />
          <MenuItem
            showBorder={true}
            icon={<Bell size={18} />}
            label="Notifications"
            label2="Manage push notifications"
            type="link"
            link="/app/notification"
          />
          <MenuItem
            showBorder={true}
            icon={<CircleAlert size={18} />}
            label="About Cashley"
            label2=""
            type="link"
            link="/app/profile/about"
          />

          <div className="w-full mt-4 p-0.5 rounded-2xl primary-orange-to-purple">
            <button
              onClick={() => logoutModal.open()} className="w-full cursor-pointer py-5 px-4 rounded-2xl bg-card flex items-center justify-between">
              <span className="">
                Log out
              </span>
              <LogOut />
            </button>
          </div>
        </Section>
      </div>
    </div>
  );
}
