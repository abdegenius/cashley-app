"use client";

import Button from "@/components/ui/Button";
import TextInput from "@/components/ui/TextInput";
import {
  ArrowLeftRight,
  ArrowRight,
  Check,
  User,
  Mail,
  Phone,
  Building,
  ChevronDown,
} from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useTheme } from "@/providers/ThemeProvider";
import api from "@/lib/axios";
import { ApiResponse } from "@/types/api";
import toast from "react-hot-toast";

type SendMethod = "nickname" | "email" | "phone" | "bank";

interface FormData {
  nickname: string;
  email: string;
  phone: string;
  bankAccount: string;
  bankName: string;
  accountName: string;
  amount: string;
  description: string;
  bankCode:string;
}

interface QuickSendContact {
  img: string;
  lastname: string;
  firstName: string;
  tag: string;
}

interface Banks {
  name: string;
  code: string;
}

export default function Send() {
  const [step, setStep] = useState(1);
  const [sendMethod, setSendMethod] = useState<SendMethod | null>(null);
  const [bank, setbank] = useState<Banks[]>([]);
  const [loading, setLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false)
  const [search, setSearch] = useState("");
  const [toggleBanks, setToggleBanks] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    nickname: "",
    email: "",
    phone: "",
    bankAccount: "",
    bankName: "",
    accountName: "",
    bankCode: "",
    amount: "",
    description: "",
  });
  const { resolvedTheme } = useTheme();
  const [imageSrc, setImageSrc] = useState("");
  
useEffect(() => {
  if (formData.bankName && formData.bankName.trim() !== "" && 
      formData.bankAccount && formData.bankAccount.length >= 10) {
    verifyBanks();
  }
}, [formData.bankName, formData.bankAccount]); 

  useEffect(() => {
    setImageSrc(
      resolvedTheme === "dark" ? "/svg/cashley.svg" : "/svg/cashley-dark.svg"
    );
  }, [resolvedTheme]);

  const number = [
    1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000, 20000, 50000,
  ];

  const quickSend: QuickSendContact[] = [
    { img: "/globe.svg", lastname: "Tali", firstName: "Moses", tag: "@tali" },
    { img: "/globe.svg", lastname: "Tali", firstName: "Moses", tag: "@ljtwp" },
    { img: "/globe.svg", lastname: "Tali", firstName: "Moses", tag: "@sani" },
    { img: "/globe.svg", lastname: "Tali", firstName: "Moses", tag: "@barny" },
  ];
  console.log(bank);
  const fetchBanks = async () => {
    try {
      const res = await api.get<ApiResponse>("/transfers/banks");
      // if(res.data.message && !res.data.data){
      //   const errmessage = res.data.message
      //   toast.error("failed to fetch banks", errmessage)
      // }
      setbank(res.data.data);
    } catch (err) {
      toast.error("failed to fetch banks");
    }
  };

  const filteredBanks = bank.filter(
    (banks) =>
      banks.name.toLowerCase().includes(search.toLowerCase()) ||
      banks.code.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    fetchBanks();
  }, []);

  const handleSelectedBank = (name: string, code: string) => {
    setFormData((prev) => ({
      ...prev,
      bankName: name,
      bankCode: code
    }));

    setToggleBanks(false);
  };

  const verifyBanks = async() =>{
    setVerifyLoading(true)
    try{
      const payload = {
        account_number: formData.bankAccount,
        bank_code: formData.bankCode
      }
        const res = await api.post<ApiResponse>("/transfers/verify-bank", payload)
        if(res.data.data || !res.data.error){
          setFormData(prev=> (
            {
              ...prev,
              accountName: res?.data?.data?.account_name
            }
            
          ))
        }else{
          const errmessage =  res?.data?.message || "Login failed";
          toast.error( errmessage)
        }
    }
    catch(err){
        console.log("Failed to fetch", err)
    }
  }


  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleMethodSelect = (method: SendMethod) => {
    setSendMethod(method);
    setStep(3);
  };

  const handleBackToMethods = () => {
    setSendMethod(null);
    setStep(2);
  };

  const validateStep = (currentStep: number): boolean => {
    switch (currentStep) {
      case 3: // Input step
        if (!sendMethod) return false;

        switch (sendMethod) {
          case "nickname":
            return (
              formData.nickname.trim().length > 0 &&
              formData.nickname.startsWith("@")
            );
          case "email":
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(formData.email);
          case "phone":
            return formData.phone.trim().length >= 10;
          case "bank":
            return (
              formData.bankAccount.trim().length >= 10 &&
              formData.bankName.trim().length > 0
            );
          default:
            return false;
        }

      case 4: // Amount step
        const amount = parseFloat(formData.amount.replace(/[^\d.]/g, ""));
        return !isNaN(amount) && amount > 0 && amount <= 125000;

      default:
        return true;
    }
  };

  const simulateAPICall = async (): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 2000);
    });
  };

  const handleContinue = async () => {
    if (!validateStep(step)) return;

    if (step === 4) {
      setLoading(true);
      try {
        const success = await simulateAPICall();
        if (success) {
          setStep(6);
        }
      } catch (error) {
        console.error("Transfer failed:", error);
      } finally {
        setLoading(false);
      }
    } else {
      setStep((prev) => prev + 1);
    }
  };

  const handleQuickAmount = (amount: number) => {
    setFormData((prev) => ({
      ...prev,
      amount: amount.toString(),
    }));
  };

  const getCurrentInputValue = (): string => {
    if (!sendMethod) return "";

    switch (sendMethod) {
      case "nickname":
        return formData.nickname;
      case "email":
        return formData.email;
      case "phone":
        return formData.phone;
      case "bank":
        return formData.bankAccount;
      default:
        return "";
    }
  };

  const renderMethodSelection = () => (
    <div className="w-full h-full space-y-10 overflow-scroll">
      <div className="w-full flex items-center flex-col justify-center py-5 space-y-3 bg-card rounded-xl">
        <h2 className="text-lg">Available Balance</h2>
        <h2 className="text-3xl font-black">₦125,000.00</h2>
        <h2 className="text-sm sm:text-md">Tap to view other wallet</h2>
      </div>

      <div className="space-y-6 w-full">
        <div className="flex justify-between items-center">
          <h1 className="text-xl">Send to Cashley user</h1>
        </div>
        <div className="w-full space-y-6">
          <button
            onClick={() => handleMethodSelect("nickname")}
            className="w-full flex items-center justify-between p-4 hover:bg-card rounded-xl transition-colors"
          >
            <div className="flex gap-3 items-center">
              <div className="p-6 rounded-full bg-card">
                <User size={24} />
              </div>
              <div className="space-y-1 text-left">
                <h4 className="text-lg">Send to Nickname</h4>
                <h4 className="text-sm text-zinc-500">
                  {"Enter recipient's unique @nickname"}
                </h4>
              </div>
            </div>
            <ArrowRight size={24} className="text-zinc-400" />
          </button>

          <button
            onClick={() => handleMethodSelect("email")}
            className="w-full flex items-center justify-between p-4 hover:bg-card rounded-xl transition-colors"
          >
            <div className="flex gap-3 items-center">
              <div className="p-6 rounded-full bg-card">
                <Mail size={24} />
              </div>
              <div className="space-y-1 text-left">
                <h4 className="text-lg">Send via email</h4>
                <h4 className="text-sm text-zinc-500">
                  {"Enter recipient's email address"}
                </h4>
              </div>
            </div>
            <ArrowRight size={24} className="text-zinc-400" />
          </button>

          <button
            onClick={() => handleMethodSelect("phone")}
            className="w-full flex items-center justify-between p-4 hover:bg-card rounded-xl transition-colors"
          >
            <div className="flex gap-3 items-center">
              <div className="p-6 rounded-full bg-card">
                <Phone size={24} />
              </div>
              <div className="space-y-1 text-left">
                <h4 className="text-lg">Send via phone</h4>
                <h4 className="text-sm text-zinc-500">
                  {"Enter recipient's phone number"}
                </h4>
              </div>
            </div>
            <ArrowRight size={24} className="text-zinc-400" />
          </button>

          <button
            onClick={() => handleMethodSelect("bank")}
            className="w-full flex items-center justify-between p-4 hover:bg-card rounded-xl transition-colors"
          >
            <div className="flex gap-3 items-center">
              <div className="p-6 rounded-full bg-card">
                <Building size={24} />
              </div>
              <div className="space-y-1 text-left">
                <h4 className="text-lg">Send to other bank</h4>
                <h4 className="text-sm text-zinc-500">
                  Transfer to any Nigerian bank account
                </h4>
              </div>
            </div>
            <ArrowRight size={24} className="text-zinc-400" />
          </button>
        </div>
      </div>

      <div className="w-full">
        <div className="flex justify-between items-center py-5">
          <h1 className="text-xl">Recent Recipients</h1>
        </div>

        {quickSend.map((tag) => (
          <div
            key={tag.tag}
            className="flex justify-between items-center w-full hover:bg-card py-4 rounded-xl"
          >
            <div className="flex gap-3 items-center">
              <Image
                src={tag.img}
                alt={tag.tag}
                width={40}
                height={40}
                className="rounded-full object-center"
              />
              <div>
                <div className="text-sm w-full text-start">
                  {tag.firstName + " " + tag.lastname}
                </div>
                <div className="text-sm w-full text-start">{tag.tag}</div>
              </div>
            </div>
            <button
              onClick={() => {
                setFormData((prev) => ({ ...prev, nickname: tag.tag }));
                handleMethodSelect("nickname");
              }}
              className="px-6 py-2 bg-background rounded-2xl cursor-pointer hover:bg-gray-100"
            >
              Send Again
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderInputStep = () => {
    const getMethodConfig = () => {
      const config = {
        nickname: {
          title: "Send to Nickname",
          placeholder: "Enter nickname (e.g., @username)",
          description: "Enter the recipient's unique @nickname",
        },
        email: {
          title: "Send via Email",
          placeholder: "Enter email address",
          description: "Enter the recipient's email address",
        },
        phone: {
          title: "Send via Phone",
          placeholder: "Enter phone number",
          description: "Enter the recipient's phone number",
        },
        bank: {
          title: "Send to Bank",
          placeholder: "Enter account number",
          description: "Enter recipient's bank account number",
        },
      };
      return sendMethod ? config[sendMethod] : config.nickname;
    };

    const config = getMethodConfig();

    return (
      <div className="w-full py-8 h-full flex  justify-between flex-col">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={handleBackToMethods}
              className="p-2 hover:bg-card rounded-full"
            >
              <ArrowRight size={20} className="rotate-180" />
            </button>
            <h1 className="text-2xl sm:text-4xl font-bold">{config.title}</h1>
          </div>
          <p className="text-zinc-500 mb-4">{config.description}</p>

          <TextInput
            value={getCurrentInputValue()}
            onChange={(value) => {
              if (sendMethod) {
                handleInputChange(
                  sendMethod === "nickname"
                    ? "nickname"
                    : sendMethod === "email"
                    ? "email"
                    : sendMethod === "phone"
                    ? "phone"
                    : "bankAccount",
                  value
                );
              }
            }}
            placeholder={config.placeholder}
            type={
              sendMethod === "phone" || sendMethod === "bank"
                ? "number"
                : "text"
            }
          />

          {sendMethod === "bank" && (
            <div className="space-y-4 mt-4 relative">
              <button
                onClick={() => setToggleBanks(true)}
                className="flex w-full h-auto items-center bg-card rounded-full pr-5"
              >
                <TextInput
                  value={formData.bankName}
                  onChange={(value) => handleInputChange("bankName", value)}
                  placeholder="Select Bank"
                  disabled
                  type="text"
                />
                <ChevronDown size="24" className="placeholder-text" />
              </button>

              {toggleBanks && (
                <div className="w-full h-100 overflow-hidden space-y-5 bg-card rounded-2xl absolute  z-10 p-5">
                  <input
                    placeholder="Search bank"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="py-5 px-5 outline-none bg-background w-full rounded-2xl"
                  />
                  <div className="overflow-auto w-full h-full flex flex-col">
                    {filteredBanks?.map((banks) => (
                      <button
                        onClick={() =>
                          handleSelectedBank(banks.name, banks.code)
                        }
                        key={banks.code}
                        className="px-5 py-5 hover:bg-hover rounded-2xl text-start"
                      >
                        {banks.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <TextInput
                value={formData.accountName}
                onChange={(value) => handleInputChange("accountName", value)}
                placeholder="Account Name"
                type="text"
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderAmountStep = () => (
    <div className="w-full py-8 h-full flex justify-between flex-col">
      <div className="space-y-4">
        <div className="space-y-2">
          <h1 className="text-lg sm:text-2xl font-bold">
            {sendMethod === "nickname" && formData.nickname}
            {sendMethod === "email" && formData.email}
            {sendMethod === "phone" && formData.phone}
            {sendMethod === "bank" &&
              `${formData.bankName} - ${formData.bankAccount}`}
          </h1>
          <h4 className="text-zinc-600">
            {sendMethod === "nickname" && "Cashley User"}
            {sendMethod === "email" && "Cashley User"}
            {sendMethod === "phone" && "Cashley User"}
            {(sendMethod === "bank" && formData.accountName) || "Account Name"}
          </h4>
        </div>

        <div className="space-y-6">
          <TextInput
            type="number"
            value={formData.amount}
            onChange={(value) => handleInputChange("amount", value)}
            currency="₦"
            placeholder="0.00"
          />

          {formData.amount && (
            <div className="text-sm text-zinc-600">Available: ₦125,000.00</div>
          )}
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 gap-5">
          {number.map((num) => (
            <button
              key={num}
              onClick={() => handleQuickAmount(num)}
              className="w-full bg-card rounded-3xl py-3 px-6 hover:bg-gray-100 transition-colors"
            >
              {num.toLocaleString()}
            </button>
          ))}
        </div>

        <div className="mt-4">
          <TextInput
            value={formData.description}
            onChange={(value) => handleInputChange("description", value)}
            placeholder="Add a description (optional)"
            type="text"
          />
        </div>
      </div>
    </div>
  );

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="w-full h-full space-y-20">
            <div className="w-full flex items-center flex-col justify-center py-5 space-y-3 bg-card rounded-xl">
              <h2 className="text-lg">Available Balance</h2>
              <h2 className="text-3xl font-black">₦125,000.00</h2>
              <h2 className="text-sm sm:text-md">Tap to view other wallet</h2>
            </div>

            <div className="space-y-6 w-full">
              <div className="flex justify-between items-center">
                <h1 className="text-lg">Quick Send</h1>
                <button className="cursor-pointer">See All</button>
              </div>
              <div className="flex justify-between w-full">
                <button className="flex flex-col gap-1 cursor-pointer items-center">
                  <span className="border-2 text-3xl placeholder-text border-dashed rounded-full w-15 h-15 bg-card flex items-center justify-center">
                    +
                  </span>
                  <span className="text-sm placeholder-text">Add new</span>
                </button>
                {quickSend.map((tag) => (
                  <button
                    key={tag.tag}
                    className="flex flex-col gap-1 cursor-pointer items-center"
                  >
                    <Image
                      src={tag.img}
                      alt={tag.tag}
                      width={40}
                      height={40}
                      className="rounded-full object-center"
                    />
                    <span className="text-sm">{tag.firstName}</span>
                    <span className="text-sm">{tag.tag}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h1 className="text-xl">Choose method</h1>
              <button
                onClick={() => setStep(2)}
                className="w-full flex gap-3 items-center p-4 hover:bg-card rounded-xl transition-colors"
              >
                <div className="p-8 rounded-full bg-card" />
                <div className="space-y-1 text-left">
                  <h4 className="text-lg">Send to Cashley user</h4>
                  <h4 className="text-sm text-zinc-500">
                    Send to users via nickname, email, or phone
                  </h4>
                </div>
              </button>
              <button
                onClick={() => handleMethodSelect("bank")}
                className="w-full flex gap-3 items-center p-4 hover:bg-card rounded-xl transition-colors"
              >
                <div className="p-8 rounded-full bg-card" />
                <div className="space-y-1 text-left">
                  <h4 className="text-lg">Send to other bank</h4>
                  <h4 className="text-sm text-zinc-500">
                    Transfer to any Nigerian bank account
                  </h4>
                </div>
              </button>
            </div>
          </div>
        );
      case 2:
        return renderMethodSelection();
      case 3:
        return renderInputStep();
      case 4:
        return renderAmountStep();
      case 5:
        return (
          <div className="flex flex-col justify-end w-full h-full">
            <div className="w-full h-auto rounded-t-3xl bg-card py-6 px-6 sm:px-13 space-y-6">
              <h3 className="text-2xl w-full text-center">Summary</h3>

              <div className="w-fit flex items-center gap-10 mx-auto">
                <div className="text-xl font-black">
                  ₦{parseFloat(formData.amount || "0").toLocaleString()}
                </div>
                <Image
                  src={"/svg/leftRight.svg"}
                  alt="arrow left right"
                  width={30}
                  height={30}
                />
                <div className="text-xl font-black">
                  {sendMethod === "nickname" && formData.nickname}
                  {sendMethod === "email" && formData.email}
                  {sendMethod === "phone" && formData.phone}
                  {sendMethod === "bank" && formData.bankName}
                </div>
              </div>

              <div className="text-sm w-full space-y-3">
                <div className="flex justify-between w-full items-center">
                  <div>Name:</div>
                  <div>
                    {sendMethod === "bank"
                      ? formData.accountName
                      : "Cashley User"}
                  </div>
                </div>
                <div className="flex justify-between w-full items-center">
                  <div>Account:</div>
                  <div>
                    {sendMethod === "nickname" && "Cashley Account"}
                    {sendMethod === "email" && formData.email}
                    {sendMethod === "phone" && formData.phone}
                    {sendMethod === "bank" && formData.bankAccount}
                  </div>
                </div>
                <div className="flex justify-between w-full items-center">
                  <div>Amount:</div>
                  <div>
                    ₦{parseFloat(formData.amount || "0").toLocaleString()}
                  </div>
                </div>
                {sendMethod === "bank" && (
                  <div className="flex justify-between w-full items-center">
                    <div>Bank:</div>
                    <div>{formData.bankName}</div>
                  </div>
                )}
                {formData.description && (
                  <div className="flex justify-between w-full items-center">
                    <div>Description:</div>
                    <div>{formData.description}</div>
                  </div>
                )}
              </div>

              <div className="w-full flex items-center gap-6">
                <Button
                  onclick={() => setStep(4)}
                  type="secondary"
                  text="Back"
                />
                <Button
                  onclick={handleContinue}
                  type="primary"
                  text="Transfer"
                  loading={loading}
                />
              </div>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="w-full h-auto space-y-10">
            <div className="w-full h-auto bg-card py-20 px-6 space-y-6 rounded-2xl">
              <div className="w-20 h-20 rounded-full primary-purple-to-blue mx-auto items-center justify-center flex">
                <Check size={40} />
              </div>

              <div className="text-center w-fit mx-auto space-y-1">
                <h1 className="text-xl font-black">Transaction Successful</h1>
                <h4 className="text-sm">
                  Your money has been sent successfully
                </h4>
              </div>

              <div className="text-center w-fit mx-auto space-y-1">
                <h1 className="text-sm">Amount Sent</h1>
                <h4 className="text-xl font-black">
                  ₦{parseFloat(formData.amount || "0").toLocaleString()}
                </h4>
              </div>

              <div className="w-full max-w-md mx-auto flex items-center justify-between">
                <div className="flex gap-3 items-center">
                  <Image
                    src={"/globe.svg"}
                    alt="user image"
                    width={45}
                    height={45}
                    className="rounded-full object-cover"
                  />
                  <div className="space-y-1">
                    <h4 className="text-lg">
                      {sendMethod === "bank"
                        ? formData.accountName
                        : "Cashley User"}
                    </h4>
                    <h4 className="">
                      {sendMethod === "nickname" && formData.nickname}
                      {sendMethod === "email" && formData.email}
                      {sendMethod === "phone" && formData.phone}
                      {sendMethod === "bank" && formData.bankAccount}
                    </h4>
                  </div>
                </div>
                <ArrowRight size={24} className="placeholder-text" />
              </div>

              <div className="text-sm w-full space-y-3 max-w-md pt-8 mx-auto">
                <div className="flex justify-between w-full items-center">
                  <div>Receivers Bank:</div>
                  <div>
                    {sendMethod === "bank" ? formData.bankName : "Cashley"}
                  </div>
                </div>
                <div className="flex justify-between w-full items-center">
                  <div>Date & Time:</div>
                  <div>
                    {new Date().toLocaleString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </div>
                </div>
                <div className="flex justify-between w-full items-center">
                  <div>Payment method:</div>
                  <div>Cashley</div>
                </div>
                <div className="flex justify-between w-full items-center">
                  <div>Status:</div>
                  <div>Completed</div>
                </div>
                <div className="flex justify-between w-full items-center">
                  <div>Description:</div>
                  <div>{formData.description || "Transfer"}</div>
                </div>
                <div className="flex justify-between w-full items-center">
                  <div>Transaction:</div>
                  <div>{Math.random().toString().slice(2, 22)}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 justify-center">
                <Image
                  src={imageSrc || "/svg/cashley.svg"}
                  alt="cashley"
                  width={69}
                  height={20}
                />
                <span className="text-xs">Receipt</span>
              </div>
            </div>

            <div className="w-full flex gap-6">
              <button className="w-full rounded-full py-4 bg-card text-lg hover:bg-gray-100 transition-colors">
                Save as image
              </button>
              <button className="w-full rounded-full py-4 bg-card text-lg hover:bg-gray-100 transition-colors">
                Save as PDF
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const getButtonText = () => {
    if (step === 5) return "Transfer";
    return "Continue";
  };

  return (
    <div className="flex flex-col h-full gap-10 py-4 w-full relative">
      {step < 3 && (
        <h1 className="text-xl sm:text-4xl font-black">Send Money</h1>
      )}

      {renderStep()}

      {(step === 3 || step === 4) && (
        <Button
          onclick={handleContinue}
          type="secondary"
          text={getButtonText()}
          loading={loading}
        />
      )}
    </div>
  );
}
