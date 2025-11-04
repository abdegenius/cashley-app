"use client";

import { Keypad } from "@/components/models/Keypad";
import Button from "@/components/ui/Button";
import TextInput from "@/components/ui/TextInput";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Check,
  X,
  Eye,
  EyeOff,
  ArrowRight,
  Search,
} from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface Countries {
  name: string;
  flag: string;
}
type TransactionData = {
  dateTime: string;
  paymentMethod: string;
  status: string;
  description: string;
  transactionId: string;
  providerLogo: string;
  providerName: string;
  planName: string;
  voucherCode?: string;
  country?: string;
  currency?: string;
};

type Provider = {
  service_id: string;
  service_name: string;
  logo: string;
  countries?: Countries[];
  category?: string;
};

type Variation = {
  variation_id: string;
  service_name: string;
  service_id: string;
  price: string;
  amount?: string;
  currency?: string;
  country?: string;
};

const countries: Countries[] = [
  { name: "USA", flag: "/img/usa.png" },
  { name: "CAD", flag: "/img/canada.png" },
  { name: "UK", flag: "/img/uk.png" },
  { name: "GER", flag: "/img/germany.png" },
];
const giftCardProviders: Provider[] = [
  {
    service_id: "playstation",
    service_name: "Playstation",
    logo: "/img/playstation.png",
    countries: countries,
    category: "Gaming",
  },
  {
    service_id: "amazon",
    service_name: "Amazon",
    logo: "/img/amazon.png",
    countries: countries,
    category: "Shopping",
  },
  {
    service_id: "steam",
    service_name: "Steam",
    logo: "/img/steam.png",
    countries: countries,
    category: "Gaming",
  },
  {
    service_id: "xbox",
    service_name: "Xbox",
    logo: "/img/xbox.png",
    countries: countries,
    category: "Gaming",
  },
  {
    service_id: "google-play",
    service_name: "Google Play",
    logo: "/img/google-play.png",
    countries: countries,
    category: "Entertainment",
  },
  {
    service_id: "apple",
    service_name: "Apple",
    logo: "/img/apple.png",
    countries: countries,
    category: "Technology",
  },
  {
    service_id: "nintendo",
    service_name: "Nintendo",
    logo: "/img/nintendo.png",
    countries: countries,
    category: "Gaming",
  },
  {
    service_id: "spotify",
    service_name: "Spotify",
    logo: "/img/spotify.png",
    countries: countries,
    category: "Entertainment",
  },
  {
    service_id: "netflix",
    service_name: "Netflix",
    logo: "/img/netflix.png",
    countries: countries,
    category: "Entertainment",
  },
  {
    service_id: "uber",
    service_name: "Uber",
    logo: "/img/uber.png",
    countries: countries,
    category: "Transportation",
  },
  {
    service_id: "airbnb",
    service_name: "Airbnb",
    logo: "/img/airbnb.png",
    countries: countries,
    category: "Travel",
  },
  {
    service_id: "bestbuy",
    service_name: "Best Buy",
    logo: "/img/bestbuy.png",
    countries: countries,
    category: "Shopping",
  },
];

export default function GiftCard() {
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<boolean | null>(null);
  const [showOTPFull] = useState(false);
  const [reference, setReference] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProviders, setFilteredProviders] =
    useState<Provider[]>(giftCardProviders);

  const [formData, setFormData] = useState({
    service_id: "",
    amount: "",
    variation: null as Variation | null,
    transactionData: null as TransactionData | null,
  });

  const [variations, setVariations] = useState<Variation[]>([]);

  // Filter providers based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredProviders(giftCardProviders);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = giftCardProviders.filter(
        (provider) =>
          provider.service_name.toLowerCase().includes(query) ||
          provider.category?.toLowerCase().includes(query)
      );
      setFilteredProviders(filtered);
    }
  }, [searchQuery]);



  // Fetch variations when provider is selected
  useEffect(() => {
    if (!formData.service_id || step !== 2) return;

    const fetchVariations = async () => {
      setLoading(true);
      try {
        const mockVariations: Variation[] = [
          {
            variation_id: "1",
            service_id: formData.service_id,
            service_name: "$10",
            price: "15770",
            amount: "10",
            currency: "$",
            country: "USA",
          },
          {
            variation_id: "2",
            service_id: formData.service_id,
            service_name: "$20",
            price: "31540",
            amount: "20",
            currency: "$",
            country: "USA",
          },
          {
            variation_id: "3",
            service_id: formData.service_id,
            service_name: "$25",
            price: "39425",
            amount: "25",
            currency: "$",
            country: "USA",
          },
          {
            variation_id: "4",
            service_id: formData.service_id,
            service_name: "$50",
            price: "78850",
            amount: "50",
            currency: "$",
            country: "USA",
          },
          {
            variation_id: "5",
            service_id: formData.service_id,
            service_name: "$100",
            price: "157700",
            amount: "100",
            currency: "$",
            country: "USA",
          },
        ];

        setVariations(mockVariations);
      } catch (error) {
        console.error("Failed to fetch variations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVariations();
  }, [formData.service_id, step]);

  const handleBack = () => {
    if (step === 1) {
      window.history.back();
    } else {
      setStep((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    setStep((prev) => prev + 1);
  };

  const handleNumberClick = (num: string) => {
    if (num === "←") {
      const lastFilledIndex = otp.reduce(
        (acc, digit, idx) => (digit ? idx : acc),
        -1
      );
      if (lastFilledIndex >= 0) {
        const newOtp = [...otp];
        newOtp[lastFilledIndex] = "";
        setOtp(newOtp);
      }
    } else if (num === "✓") {
      if (otp.every((d) => d)) {
        handleSubmit();
      }
    } else {
      const emptyIndex = otp.findIndex((digit) => !digit);
      if (emptyIndex !== -1) {
        const newOtp = [...otp];
        newOtp[emptyIndex] = num;
        setOtp(newOtp);
      }
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Generate voucher code for gift cards
      const voucherCode = `PSN-${Math.random()
        .toString(36)
        .substr(2, 9)
        .toUpperCase()}`;

      const selectedProvider = giftCardProviders.find(
        (p) => p.service_id === formData.service_id
      );

      // Create transaction data
      const transactionData: TransactionData = {
        dateTime: new Date().toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
          second: "2-digit",
        }),
        paymentMethod: "Cashley",
        status: "Completed",
        description: "Gift Card",
        transactionId: `TRX${Date.now()}`,
        providerLogo: selectedProvider?.logo || "",
        providerName: selectedProvider?.service_name || "",
        planName: formData.variation?.service_name || "",
        voucherCode: voucherCode,
        country: selectedCountry,
        currency: formData.variation?.currency || "US$",
      };

      setSuccess(true);
      setReference(transactionData.transactionId);
      setFormData((prev) => ({ ...prev, transactionData }));
      handleNext();
    } catch (error) {
      setSuccess(false);
      handleNext();
    } finally {
      setLoading(false);
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.service_id !== "";
      case 2:
        return selectedCountry !== "" && formData.variation !== null;
      case 3:
        return true; // Summary step is always valid
      case 4:
        return otp.every((d) => d);
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="space-y-1">
              <h2 className="text-3xl font-black">Select Gift Card</h2>
            </div>

            <div className="space-y-6">
              {/* Search Bar */}
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-400"
                  size={20}
                />
                <TextInput
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Search gift cards..."
                  type="text"
                  className="pl-12"
                />
              </div>

              {/* Gift Card Providers Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {filteredProviders.map((provider) => (
                  <motion.button
                    key={provider.service_id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        service_id: provider.service_id,
                      }));
                      handleNext();
                    }}
                    className={`flex flex-col items-center rounded-2xl overflow-hidden transition-all ${
                      formData.service_id === provider.service_id
                        ? "bg-primary/10"
                        : "bg-card"
                    }`}
                  >
                    <div className="w-full h-auto mb-2 flex items-center justify-center">
                      <div className="w-full h-20 relative">
                        <Image
                          src={provider.logo}
                          alt={provider.service_name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                    <span className="text-sm font-medium py-1 text-center">
                      {provider.service_name}
                    </span>
                  </motion.button>
                ))}
              </div>

              {filteredProviders.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-zinc-500">
                    No gift cards found matching your search.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        );

      case 2:
        const selectedProvider = giftCardProviders.find(
          (p) => p.service_id === formData.service_id
        );

        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="space-y-1">
              <h2 className="text-3xl font-black">
                {selectedProvider?.service_name}
              </h2>
            </div>

            <div className="w-full h-40 relative rounded-2xl overflow-hidden">
              <Image
                src={selectedProvider?.logo || "/img/placeholder.png"}
                alt={selectedProvider?.service_name || "Provider"}
                fill
                className=" object-cover"
              />
            </div>

            <div className="space-y-6">
              {/* Country selection */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1">
                  {selectedProvider?.countries?.map((country) => (
                    <div
                      key={country.flag}
                      className={` rounded-2xl overflow-hidden h-30 transition-all w-full flex   ${
                        selectedCountry === country.name
                          ? "purple-bg font-black p-0.5"
                          : "bg-card"
                      }`}
                    >
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedCountry(country.name)}
                        className={`w-full rounded-2xl overflow-hidden bg-card`}
                      >
                        <div className="w-full h-3/4 relative ">
                          <Image
                            src={country.flag}
                            alt={country.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        {country.name}
                      </motion.button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Amount selection */}
              {selectedCountry && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {variations.map((variation) => (
                      <div
                      key={variation.variation_id}
                        className={` rounded-2xl text-center transition-all p-0.5 ${
                          formData.variation?.variation_id ===
                          variation.variation_id
                            ? "purple-bg"
                            : "bg-card"
                        }`}
                      >
                        <motion.button
                          key={variation.variation_id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              variation,
                              amount: variation.price,
                            }))
                          }
                          className={`w-full bg-card relative z-20 rounded-2xl p-4`}
                        >
                          <div className="flex flex-col justify-between items-center">
                            <div>
                              <h4 className="font-black text-center">
                                {variation.service_name}
                              </h4>
                            </div>
                            <span className="text-center text-lg">
                              ₦{parseInt(variation.price).toLocaleString()}
                            </span>
                          </div>
                        </motion.button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Note for gift cards */}
              <div className="bg-card rounded-2xl p-4">
                <p className="text-sm text-center">
                  <strong>Note:</strong> This gift card will only work in the{" "}
                  <strong>{selectedCountry || "selected country"}.</strong>
                </p>
              </div>

              <Button
                onclick={handleNext}
                type="secondary"
                text="Continue"
                width="w-full py-4"
                disabled={!isStepValid()}
              />
            </div>
          </motion.div>
        );

      case 3:
        const provider = giftCardProviders.find(
          (p) => p.service_id === formData.service_id
        );

        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8 w-full min-h-[89vh] flex flex-col justify-end"
          >
            <div className="w-full bg-card py-5 rounded-t-3xl">
              <div className="space-y-1">
                <h2 className="text-xl font-black w-full text-center">
                  Summary
                </h2>
              </div>

              <div className="w-full rounded-2xl p-6 space-y-4">
                <div className="flex justify-between items-center max-w-md mx-auto">
                  <span className="text-xl font-black w-full">
                    ₦{parseInt(formData.amount || "0").toLocaleString()}
                  </span>
                  <Image
                    src={"/svg/leftRight.svg"}
                    alt="swap arrow"
                    width={30}
                    height={30}
                    className=""
                  />
                  <span className="font-black w-full">
                    {formData.variation?.service_name}
                  </span>
                </div>

                <div className="space-y-3">
                  <ReviewItem label="Product" value="Gift Card" />
                  <ReviewItem
                    label="Brand"
                    value={provider?.service_name || ""}
                  />
                  <ReviewItem label="Country" value={selectedCountry} />
                  <ReviewItem
                    label="Amount"
                    value={formData.variation?.service_name || ""}
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  onclick={handleBack}
                  type="primary"
                  text="Back"
                  width="flex-1 py-4"
                />
                <Button
                  onclick={handleNext}
                  type="secondary"
                  text="Confirm & Pay"
                  width="flex-1 py-4"
                />
              </div>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-black">Enter Your PIN</h2>
              <p className="text-lg">
                To complete this transaction, please enter your 4-digit PIN
              </p>
            </div>

            <div className="flex justify-center gap-4 mb-6">
              {otp.map((digit, index) => (
                <motion.div
                  key={index}
                  animate={{ scale: digit ? 1.1 : 1 }}
                  className={`w-15 h-15 rounded-full flex items-center justify-center text-xl font-semibold ${
                    showOTPFull
                      ? ""
                      : digit
                      ? "primary-purple-to-blue"
                      : "bg-card"
                  }`}
                >
                  {showOTPFull ? digit || "" : digit ? "•" : ""}
                </motion.div>
              ))}
            </div>

            <button
              onClick={() => !showOTPFull}
              className="flex items-center justify-center gap-2 mx-auto mb-6 text-sm hover:text-stone-800"
            >
              {showOTPFull ? <EyeOff size={18} /> : <Eye size={18} />}
              {showOTPFull ? "Hide" : "Show"} PIN
            </button>

            <Keypad
              numbers={[
                "1",
                "2",
                "3",
                "4",
                "5",
                "6",
                "7",
                "8",
                "9",
                "✓",
                "0",
                "←",
              ]}
              onNumberClick={handleNumberClick}
              onDelete={() => handleNumberClick("←")}
              onConfirm={() => handleNumberClick("✓")}
              disableConfirm={!otp.every((d) => d)}
              loading={loading}
            />
          </motion.div>
        );

      case 5:
        return (
          <div className="space-y-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8 text-center bg-card rounded-2xl px-3"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-20 h-20 primary-purple-to-blue rounded-full flex items-center justify-center mx-auto"
              >
                {success ? (
                  <Check size={40} className="" />
                ) : (
                  <X size={40} className="" />
                )}
              </motion.div>

              <div className="space-y-2">
                <h2 className="text-3xl font-black">
                  {success ? "Voucher Generated" : "Transaction Failed"}
                </h2>
                <p className="text-lg">
                  {success
                    ? "Voucher has been generated successfully"
                    : "Something went wrong. Please try again."}
                </p>
                <div className="flex flex-col gap-2">
                  <span>Amount Paid</span>
                  <span className="font-black text-2xl">
                    ₦{parseInt(formData.amount).toLocaleString()}
                  </span>
                </div>

                {/* Voucher code for gift cards */}
                {success && formData.transactionData?.voucherCode && (
                  <div className="space-y-4 my-5 max-w-sm mx-auto">
                    <h5 className="text-center text-sm">Voucher</h5>
                    <div className="w-full bg-primary/10 rounded-2xl p-4">
                      <span className="font-mono text-lg">
                        {formData.transactionData.voucherCode}
                      </span>
                    </div>
                  </div>
                )}

                <div className="space-y-4 my-5 max-w-sm mx-auto">
                  <h5 className="text-center text-sm">Details</h5>
                  <div className="w-full flex justify-between items-center">
                    <div className="flex gap-2 items-center">
                      <Image
                        src={formData.transactionData?.providerLogo || ""}
                        alt="service provider"
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                      />
                      <div>{formData.transactionData?.providerName}</div>
                    </div>
                    <ArrowRight size={24} className="placeholder-text" />
                  </div>
                </div>
              </div>

              {success && formData.transactionData && (
                <div className="w-full rounded-2xl p-6 space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Date & Time</span>
                    <span className="font-medium">
                      {formData.transactionData.dateTime}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment method</span>
                    <span className="font-mono text-sm">
                      {formData.transactionData.paymentMethod}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status</span>
                    <span className="font-mono text-sm">
                      {formData.transactionData.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Description</span>
                    <span className="font-mono text-sm">
                      {formData.transactionData.description}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Transaction ID</span>
                    <span className="font-mono text-sm">
                      {formData.transactionData.transactionId}
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
            <div className="w-full flex gap-6">
              <button className="w-full py-4 px-5 rounded-full bg-card">
                Share as image
              </button>
              <button className="w-full py-4 px-5 rounded-full bg-card">
                Share as PDF
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full h-full  mx-auto max-w-xl flex flex-col">
      {step > 1 && (
        <div className=" flex items-center justify-between">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-card rounded-full transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
        </div>
      )}
      {/* Header */}

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
      </div>
    </div>
  );
}

function ReviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-2 last:border-b-0">
      <span>{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
