"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Building,
  Tag,
  User,
} from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import TextInput from "@/components/ui/TextInput";
import { useTheme } from "@/providers/ThemeProvider";
import { useAuthContext } from "@/context/AuthContext";
import api from "@/lib/axios";
import { ApiResponse } from "@/types/api";
import { formatToNGN } from "@/utils/amount";

type SendMethod = "entity" | "bank";

interface FormData {
  entity: string;
  account_number: string;
  account_name: string;
  bank_code: string;
  bank_name: string;
  amount: string;
  remarks: string;
}

interface Bank {
  bank_name: string;
  bank_code: string;
  bank_logo?: string;
}

export default function SendMoney() {
  const { user } = useAuthContext();
  const { resolvedTheme } = useTheme();

  const [step, setStep] = useState(1);
  const [sendMethod, setSendMethod] = useState<SendMethod | null>(null);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [bank, setBank] = useState<Bank | null>(null);
  const [toggleBanks, setToggleBanks] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<boolean | null>(null);
  const [purchasing, setPurchasing] = useState<boolean>(false);
  const [verifying, setVerifying] = useState<boolean>(false);
  const [verifyData, setVerifyData] = useState<any>(null);
  const [transaction, setTransaction] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [imageSrc, setImageSrc] = useState("");

  const [formData, setFormData] = useState<FormData>({
    entity: "",
    account_number: "",
    account_name: "",
    bank_code: "",
    bank_name: "",
    amount: "",
    remarks: "",
  });

  const fetchBanks = async () => {
    try {
      const res = await api.get<ApiResponse>("/banks");
      if (!res.data.error) setBanks(res.data.data);
    } catch {
      toast.error("Failed to fetch banks");
    }
  };

  const handleVerify = async () => {
    setVerifying(true);
    try {
      const payload = {
        ...(sendMethod === "entity" && { entity: formData.entity }),
        ...(sendMethod === "bank" && { account_number: formData.account_number, bank_code: formData.bank_code }),
      }
      const url = sendMethod === "entity" ? "/verify-user" : "/verify-bank";
      const res = await api.post<ApiResponse>(url, payload);
      if (res.data.error || !res.data.data) {
        toast.error("Verification failed")
      } else {
        setFormData((prev) => ({
          ...prev,
          account_name: res.data.data.name,
        }));
        setVerifyData(res.data.data);
        toast.success("Verification successful");
      }
    } catch (err) {
    } finally {
      setVerifying(false)
    }
  }

  const verifyBank = async () => {
    setVerifying(true);
    try {
      const res = await api.post<ApiResponse>("/verify-bank", {
        account_number: formData.account_number,
        bank_code: formData.bank_code,
      });
      if (!res.data.error && res.data.data?.account_name) {
        setFormData((prev) => ({
          ...prev,
          account_name: res.data.data.account_name,
        }));
      } else toast.error(res.data.message || "Verification failed");
    } catch {
      toast.error("Could not verify bank account");
    } finally {
      setVerifying(false);
    }
  };

  const handleInputChange = (key: keyof FormData, value: string) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  const quickAmounts = [1000, 2000, 5000, 10000, 20000, 50000];

  const nextStep = () => setStep((s) => s + 1);
  const backStep = () => setStep((s) => s - 1);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 2000)); // simulate
      setStep(5);
    } catch {
      toast.error("Transfer failed");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    setImageSrc(
      resolvedTheme === "dark" ? "/svg/cashley.svg" : "/svg/cashley-dark.svg"
    );
  }, [resolvedTheme]);

  useEffect(() => {
    fetchBanks();
  }, []);

  useEffect(() => {
    if ((formData.entity && formData.entity.length >= 3) || (
      formData.bank_code &&
      formData.account_number.length >= 10)
    ) {
      handleVerify();
    }
  }, [formData.bank_code, formData.entity, formData.account_number]);


  const renderStep1 = () => (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Send Money</h1>
        <p className="text-zinc-500">
          Choose how you want to send money
        </p>
      </div>

      <div className="bg-card p-6 rounded-2xl text-center">
        <h2 className="text-sm text-zinc-400">Available Balance</h2>
        <h1 className="text-3xl font-black mt-1">
          {formatToNGN(Number(user?.ngn_balance ?? 0))}
        </h1>
      </div>

      <div className="space-y-4">
        <button
          onClick={() => {
            setSendMethod("entity");
            nextStep();
          }}
          className="flex items-center justify-between w-full p-4 rounded-xl hover:bg-card transition"
        >
          <div className="flex gap-4 items-center">
            <div className="p-3 rounded-full bg-card">
              <User />
            </div>
            <div className="text-left">
              <h4 className="font-semibold">Send to Tag</h4>
              <p className="text-sm text-zinc-500">
                via username or UID or phone number
              </p>
            </div>
          </div>
          <ArrowRight />
        </button>

        <button
          onClick={() => {
            setSendMethod("bank");
            nextStep();
          }}
          className="flex items-center justify-between w-full p-4 rounded-xl hover:bg-card transition"
        >
          <div className="flex gap-4 items-center">
            <div className="p-3 rounded-full bg-card">
              <Building />
            </div>
            <div className="text-left">
              <h4 className="font-semibold">Send to Bank</h4>
              <p className="text-sm text-zinc-500">
                Transfer to any Nigerian bank
              </p>
            </div>
          </div>
          <ArrowRight />
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={backStep} className="p-2 hover:bg-card rounded-full">
          <ArrowRight className="rotate-180" />
        </button>
        <h2 className="text-2xl font-bold">
          {sendMethod === "entity"
            ? "Send to Cashley User"
            : "Send to Bank Account"}
        </h2>
      </div>

      {sendMethod === "bank" && (
        <div className="relative space-y-3">
          <button
            onClick={() => setToggleBanks(!toggleBanks)}
            className="flex items-center justify-between w-full bg-card p-4 rounded-full"
          >
            <span>{bank?.bank_name || "Select Bank"}</span>
            <ChevronDown />
          </button>
          {toggleBanks && (
            <div className="absolute top-16 w-full bg-card rounded-2xl shadow-lg p-4 z-20 space-y-3 max-h-64 overflow-auto">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search bank..."
                className="w-full px-4 py-3 rounded-xl bg-background outline-none"
              />
              {banks
                // .filter((b) =>
                //   b.bank_name.toLowerCase().includes(search.toLowerCase())
                // )
                .map((b) => (
                  <button
                    key={b.bank_code}
                    onClick={() => {
                      setBank(b);
                      setFormData({
                        ...formData,
                        bank_name: b.bank_name,
                        bank_code: b.bank_code,
                      });
                      setToggleBanks(false);
                    }}
                    className="block w-full text-left p-3 rounded-xl hover:bg-hover"
                  >
                    {b.bank_name}
                  </button>
                ))}
            </div>
          )}
        </div>
      )}

      <TextInput
        type={sendMethod === "bank" ? "number" : "text"}
        placeholder={
          sendMethod === "bank"
            ? "Enter account number"
            : "Enter username or UID"
        }
        value={
          sendMethod === "bank"
            ? formData.account_number
            : formData.entity
        }
        onChange={(val) =>
          handleInputChange(
            sendMethod === "bank" ? "account_number" : "entity",
            val
          )
        }
      />
      {verifyData && formData.account_name && <p className="text-sm font-normal purple-text uppercase">{formData.account_name}</p>}

      {formData.account_name && (
        <div className="text-center py-3 bg-card rounded-full">
          <span className="text-sm text-zinc-600">
            Account Name:{" "}
            <b className="font-medium">{formData.account_name}</b>
          </span>
        </div>
      )}

      <Button text="Continue" loading={verifying} disabled={!formData.account_name} onclick={nextStep} type="secondary" />
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={backStep} className="p-2 hover:bg-card rounded-full">
          <ArrowRight className="rotate-180" />
        </button>
        <h2 className="text-2xl font-bold">Enter Amount</h2>
      </div>

      <TextInput
        type="number"
        currency="₦"
        placeholder="0.00"
        value={formData.amount}
        onChange={(val) => handleInputChange("amount", val)}
      />

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {quickAmounts.map((a) => (
          <button
            key={a}
            onClick={() => handleInputChange("amount", a.toString())}
            className="py-3 bg-card rounded-2xl hover:bg-hover"
          >
            ₦{a.toLocaleString()}
          </button>
        ))}
      </div>

      <TextInput
        placeholder="Add a remark (optional)"
        value={formData.remarks}
        onChange={(v) => handleInputChange("remarks", v)}
      />

      <Button text="Continue" onclick={nextStep} type="secondary" />
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6 text-sm">
      <h2 className="text-2xl font-bold text-center">Confirm Transfer</h2>

      <div className="bg-card p-6 rounded-2xl space-y-3">
        <div className="flex justify-between">
          <span>Recipient</span>
          <span className="font-medium">
            {sendMethod === "bank"
              ? formData.account_name
              : formData.entity}
          </span>
        </div>
        {sendMethod === "bank" && (
          <div className="flex justify-between">
            <span>Bank</span>
            <span>{formData.bank_name}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span>Amount</span>
          <span>{formatToNGN(Number(formData.amount))}</span>
        </div>
        {formData.remarks && (
          <div className="flex justify-between">
            <span>Remarks</span>
            <span>{formData.remarks}</span>
          </div>
        )}
      </div>

      <div className="flex gap-4">
        <Button text="Back" type="secondary" onclick={backStep} />
        <Button
          text="Transfer"
          type="primary"
          loading={loading}
          onclick={handleSubmit}
        />
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="text-center space-y-6 py-10">
      <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center primary-purple-to-blue">
        <Check size={40} />
      </div>
      <h2 className="text-2xl font-bold">Transfer Successful</h2>
      <p className="text-zinc-500">Your money has been sent</p>

      <h1 className="text-3xl font-black">
        {formatToNGN(Number(formData.amount))}
      </h1>

      <div className="text-sm text-zinc-500 space-y-2">
        <p>
          To:{" "}
          <b>
            {sendMethod === "bank"
              ? formData.account_name
              : formData.entity}
          </b>
        </p>
        {sendMethod === "bank" && <p>{formData.bank_name}</p>}
        <p>{new Date().toLocaleString()}</p>
      </div>

      <div className="flex justify-center gap-3 pt-4">
        <button className="px-5 py-3 bg-card rounded-full hover:bg-hover">
          Save Receipt
        </button>
        <button className="px-5 py-3 bg-card rounded-full hover:bg-hover">
          Share
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-lg mx-auto w-full space-y-6 py-6">
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
      {step === 4 && renderStep4()}
      {step === 5 && renderStep5()}
    </div>
  );
}
