"use client";

import { useState } from "react";
import { Copy, Share2, X, Send, Facebook, Twitter, MessageCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import { copyToClipboard } from "@/utils/copy";
import { User } from "@/types/api"
interface ReferAndEarnProps {
    user: User | null
}
export default function ReferAndEarn({ user }: ReferAndEarnProps) {
    const [openShare, setOpenShare] = useState(false);
    const referral = user?.referral_code ?? "";

    return (
        <>
            {/* === REFERRAL CARD === */}
            <div className="w-full bg-card rounded-2xl shadow-sm border border-stone-700 py-6 px-5 flex flex-col gap-5">
                <div>
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <Share2 size={18} className="text-purple-600" />
                        Refer & Earn
                    </h3>
                    <p className="text-xs text-muted-foreground">
                        Earn ₦500 for each friend you invite
                    </p>
                </div>

                {/* REFERRAL CODE BOX */}
                <div className="flex justify-between items-center bg-background/60 px-3 py-3 rounded-xl border border-stone-700 shadow-inner">
                    <div>
                        <div className="text-[11px] text-muted-foreground">Your Invite Code</div>
                        <div className="font-semibold text-sm tracking-wide">{referral}</div>
                    </div>

                    <button
                        onClick={() => copyToClipboard(referral)}
                        className="hover:text-purple-600 transition"
                    >
                        <Copy size={16} />
                    </button>
                </div>

                {/* SHARE BUTTON */}
                <Button
                    type="secondary"
                    width="w-full"
                    text="Share Invite Code"
                    onclick={() => setOpenShare(true)}
                />
            </div>

            {/* === SHARE MODAL === */}
            {openShare && (
                <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-card w-full max-w-sm rounded-t-2xl md:rounded-2xl p-6 shadow-xl animate-slideUp">
                        {/* HEADER */}
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Share Invite Code</h3>
                            <button onClick={() => setOpenShare(false)}>
                                <X size={20} className="text-muted-foreground hover:text-foreground transition" />
                            </button>
                        </div>

                        <p className="text-xs text-muted-foreground mb-5">
                            Invite your friends and earn rewards instantly.
                        </p>

                        {/* SOCIAL SHARE OPTIONS */}
                        <div className="grid grid-cols-4 gap-4">
                            {/* WhatsApp */}
                            <ShareButton
                                icon={<MessageCircle size={20} />}
                                label="WhatsApp"
                                url={`https://wa.me/?text=Use my referral code ${referral} to join Cashley!`}
                            />

                            {/* Telegram */}
                            <ShareButton
                                icon={<Send size={20} />}
                                label="Telegram"
                                url={`https://t.me/share/url?url=${encodeURIComponent(
                                    "Join Cashley"
                                )}&text=Use my referral code ${referral}`}
                            />

                            {/* Facebook */}
                            <ShareButton
                                icon={<Facebook size={20} />}
                                label="Facebook"
                                url={`https://www.facebook.com/sharer/sharer.php?u=https://cashley.app&quote=Use my referral code ${referral}`}
                            />

                            {/* X/Twitter */}
                            <ShareButton
                                icon={<Twitter size={20} />}
                                label="Twitter"
                                url={`https://twitter.com/intent/tweet?text=Use my Cashley referral code ${referral}`}
                            />
                        </div>

                        {/* Copy Link */}
                        <button
                            onClick={() => copyToClipboard(referral)}
                            className="mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-background border border-border hover:bg-muted transition"
                        >
                            <Copy size={16} />
                            <span className="text-sm font-medium">Copy Invitation Code</span>
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
interface ShareButtonProps {
    icon: any;
    label: string;
    url: string;
}
function ShareButton({ icon, label, url }: ShareButtonProps) {
    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 p-3 rounded-xl bg-background hover:bg-muted transition border border-stone-700"
        >
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-purple-600/10 text-purple-600">
                {icon}
            </div>
            <span className="text-[11px] text-center text-muted-foreground">{label}</span>
        </a>
    );
}
