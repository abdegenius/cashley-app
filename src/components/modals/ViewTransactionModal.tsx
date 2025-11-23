"use client";

import { Transaction } from "@/types/api";
import { formatToNGN } from "@/utils/amount";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import * as htmlToImage from "html-to-image";
import jsPDF from "jspdf";
import React, { useRef } from "react";

interface TransactionProps {
  transaction: Transaction;
  onClose: () => void;
}

export default function ViewTransactionDetails({
  transaction,
  onClose,
}: TransactionProps) {
  const shareRef = useRef<HTMLDivElement>(null);
  const filename = `${transaction.action}-${transaction.created_at}`;

  // ------------------------------------------------
  // SHARE AS IMAGE
  // ------------------------------------------------
  const handleShareAsImage = async () => {
    if (!shareRef.current) return;

    try {
      const dataUrl = await htmlToImage.toPng(shareRef.current);

      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], `${filename}.png`, { type: "image/png" });

      // If device supports the share API (mobile)
      if (navigator.share) {
        await navigator.share({
          title: "Transaction Receipt",
          text: "Here is my transaction receipt",
          files: [file],
        });
      } else {
        // Desktop fallback: download image
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = `${filename}.png`;
        link.click();
      }
    } catch (err) {
      console.error("Error sharing image:", err);
    }
  };

  // ------------------------------------------------
  // SHARE AS PDF
  // ------------------------------------------------
  const handleShareAsPDF = async () => {
    if (!shareRef.current) return;

    try {
      const dataUrl = await htmlToImage.toPng(shareRef.current);

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      });

      const imgProps = (pdf as any).getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const ratio = imgProps.height / imgProps.width;
      const pdfHeight = pdfWidth * ratio;

      pdf.addImage(dataUrl, "PNG", 0, 20, pdfWidth, pdfHeight);

      const pdfBlob = pdf.output("blob");
      const file = new File([pdfBlob], `${filename}.pdf`, {
        type: "application/pdf",
      });

      if (navigator.share) {
        await navigator.share({
          title: "Transaction Receipt (PDF)",
          text: "Here is my transaction receipt",
          files: [file],
        });
      } else {
        pdf.save(`${filename}.pdf`);
      }
    } catch (err) {
      console.error("Error sharing PDF:", err);
    }
  };

  return (
    <div>
      <div className="fixed z-5 inset-0 w-full h-full bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center max-w-xl mx-auto p-4">

        {/* Receipt container wrapped for image export */}
        <motion.div
          ref={shareRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4 text-center py-4 bg-card rounded-2xl px-4 w-full max-w-md"
        >
          <div className="w-full flex p-2 items-end justify-end">
            <button onClick={onClose} className="text-lg font-medium text-red-400">
              Close
            </button>
          </div>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 primary-purple-to-blue rounded-full flex items-center justify-center mx-auto"
          >
            {transaction.status === "completed" ? (
              <Check size={40} />
            ) : (
              <X size={40} />
            )}
          </motion.div>

          <div className="space-y-0">
            <h2 className="text-xl font-black">
              {transaction.status === "completed"
                ? "Transaction Successful"
                : "Transaction Failed"}
            </h2>

            <p className="text-sm text-muted-foreground">
              {transaction.status === "completed"
                ? "Your transaction has been processed successfully"
                : "Something went wrong. Please try again."}
            </p>

            <div className="flex flex-col gap-0 pt-2">
              <span className="font-black purple-text text-4xl">
                {formatToNGN(Number(transaction.amount))}
              </span>
              <span className="text-sm">Amount</span>
            </div>
          </div>

          {/* DETAILS */}
          <div className="w-full rounded-2xl p-2 space-y-2">
            <Detail label="Type" value={transaction.type} />
            <Detail label="Service" value={transaction.action} />
            <Detail label="Status" value={transaction.status} />
            <Detail label="Amount" value={formatToNGN(Number(transaction.amount))} />
            <Detail label="Date" value={transaction.created_at} />
            <Detail label="Reference" value={transaction.reference} />

            {transaction.session_id && (
              <Detail label="Session ID" value={transaction.session_id} />
            )}

            <Detail label="Description" value={transaction.description} />
          </div>
        </motion.div>

        {/* SHARE BUTTONS */}
        <div className="my-6 w-full flex gap-4 max-w-md">
          <button
            onClick={handleShareAsImage}
            className="w-full p-4 rounded-full bg-card hover:bg-muted transition"
          >
            Share as Image
          </button>

          <button
            onClick={handleShareAsPDF}
            className="w-full p-4 rounded-full bg-card hover:bg-muted transition"
          >
            Share as PDF
          </button>
        </div>

      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start space-x-4">
      <span className="text-sm">{label}</span>
      <span className="font-mono text-sm text-right text-muted-foreground">
        {value}
      </span>
    </div>
  );
}
