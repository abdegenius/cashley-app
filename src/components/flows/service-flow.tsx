"use client";

import Button from "@/components/ui/Button";
import TextInput from "@/components/ui/TextInput";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import api from "@/lib/axios";
import { ApiResponse, Transaction, User, PurchaseType, Variation, Provider } from "@/types/api";
import toast from "react-hot-toast";
import { formatToNGN } from "@/utils/amount";
import { EnterPin } from "../EnterPin";
import { cleanServiceName, pinExtractor, getPurchaseableService } from "@/utils/string";
import { useRouter } from "next/navigation";
import { LoadingOverlay } from "../Loading";
import { Calendar, ChevronRight, Star, Trash2, Users, X } from "lucide-react";
import ViewTransactionDetails from "../modals/ViewTransactionModal";
import useBeneficiary from "@/hooks/useBeneficiary";
import useFavourite from "@/hooks/useFavourite";
import Link from "next/link";

interface PurchaseProps {
  type: PurchaseType;
  user?: User | null;
}

export default function Purchase({ type, user }: PurchaseProps) {
  const router = useRouter();
  const { beneficiaries, fetchBeneficiaries } = useBeneficiary();
  const { favourites, fetchFavourites } = useFavourite();

  const [step, setStep] = useState<number>(1);
  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const [success, setSuccess] = useState<boolean | null>(null);
  const [purchasing, setPurchasing] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [toggleBeneficiary, setToggleBeneficiary] = useState(false);
  const [toggleFavorite, setToggleFavorite] = useState(false);

  const [formData, setFormData] = useState({
    service_id: "",
    amount: "",
    customer_id: "",
    variation: null as Variation | null,
    type: "",
  });

  const [providers, setProviders] = useState<Provider[]>([]);
  const [variations, setVariations] = useState<Variation[]>([]);
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [verifyData, setVerifyData] = useState<any>(null);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<string | null>(null);
  const [addBeneficiary, setAddBeneficiary] = useState(false);

  const [loadingProviders, setLoadingProviders] = useState(false);
  const [loadingVariations, setLoadingVariations] = useState(false);

  const presetAmounts = useMemo(() => [100, 200, 500, 1000, 2000, 5000], []);

  const config = getPurchaseableService(type);

  const providersCache = useRef<Record<string, Provider[]>>({});
  const variationsCache = useRef<Record<string, Variation[]>>({});

  const providersAbort = useRef<AbortController | null>(null);
  const variationsAbort = useRef<AbortController | null>(null);

  const existingBeneficiary = beneficiaries.find((b) => b.data.phone === formData.customer_id);
  const existingFavourites = favourites.find((b) => b.data.phone === formData.customer_id);

  useEffect(() => {
    fetchBeneficiaries(type);
    fetchFavourites(type);
  }, []);

  useEffect(() => {
    if (selectedBeneficiary) {
      setFormData((prev) => ({
        ...prev,
        customer_id: selectedBeneficiary,
      }));
    }

    if (selectedBeneficiary) {
      setToggleBeneficiary(false);
    }
  }, [selectedBeneficiary]);

  const onClose = () => {
    setToggleBeneficiary(!toggleBeneficiary);
  };

  // fetch provider
  const fetchProviders = useCallback(async () => {
    const cacheKey = config?.api_key;
    if (!cacheKey) return;

    if (providersCache.current[cacheKey]) {
      setProviders(providersCache.current[cacheKey]);
      return;
    }

    providersAbort.current?.abort();
    const controller = new AbortController();
    providersAbort.current = controller;

    setLoadingProviders(true);
    try {
      const response = await api.get<ApiResponse>(`/bill/service?service=${cacheKey}`, {
        signal: controller.signal,
      });

      if (response?.data && !response.data?.error && Array.isArray(response.data?.data)) {
        const providersData: Provider[] = response.data.data.map((provider: any) => ({
          service_id: String(provider.serviceID ?? provider.service_id ?? ""),
          name: cleanServiceName(provider.name ?? provider.serviceName ?? ""),
          logo: provider.image ?? provider.logo ?? "",
          minimum_amount: String(provider.minimum_amount ?? provider.min_amount ?? ""),
          maximum_amount: String(provider.maximum_amount ?? provider.max_amount ?? ""),
          type: provider.product_type ?? provider.type ?? "",
        }));

        providersCache.current[cacheKey] = providersData;
        setProviders(providersData);
      }
    } catch (error: any) {
      if (error?.code === "ERR_CANCELED" || error?.name === "AbortError") return;
      console.error("Network Error (fetchProviders):", error);
      toast.error(`Network error: ${error?.message ?? "Unknown error"}`);
    } finally {
      setLoadingProviders(false);
    }
  }, [config?.api_key]);

  //fetch variation
  const fetchVariations = useCallback(async (service_id: string) => {
    if (!service_id) return;
    if (variationsCache.current[service_id]) {
      setVariations(variationsCache.current[service_id]);
      return;
    }

    variationsAbort.current?.abort();
    const controller = new AbortController();
    variationsAbort.current = controller;

    setLoadingVariations(true);
    try {
      const response = await api.get<ApiResponse>(
        `/bill/service-variations?service_id=${service_id}`,
        {
          signal: controller.signal as any,
        }
      );

      const raw = response?.data;
      if (!raw.error && raw.data && Array.isArray(raw.data.variations)) {
        const variationsData: Variation[] = raw.data.variations.map((v: any) => ({
          variation_code: String(v.variation_code ?? v.code ?? ""),
          name: v.name ?? v.plan ?? "",
          variation_amount: String(v.variation_amount ?? v.amount ?? v.price ?? ""),
          fixed_price: String(v.fixedPrice ?? v.fixed_price ?? ""),
          service_id,
        }));
        variationsCache.current[service_id] = variationsData;
        setVariations(variationsData);
      }
    } catch (error: any) {
      if (error?.name === "CanceledError" || error?.name === "AbortError") {
      } else {
        console.error("Network Error (fetchVariations):", error);
      }
    } finally {
      setLoadingVariations(false);
    }
  }, []);

  useEffect(() => {
    fetchProviders();
    return () => {
      providersAbort.current?.abort();
    };
  }, [fetchProviders]);

  useEffect(() => {
    if (!formData.service_id) {
      setVariations([]);
      setVerifyData(null);
      return;
    }
    if (typeof formData.service_id !== "string" || !formData.service_id.trim()) {
      console.error("Invalid service_id:", formData.service_id);
      return;
    }
    if (config?.show_variations) {
      fetchVariations(formData.service_id);
    } else {
      setVariations([]);
    }
    return () => {
      variationsAbort.current?.abort();
    };
  }, [formData.service_id, config?.show_variations, fetchVariations]);

  const handlePrev = useCallback(() => {
    if (step === 1) {
      router.back();
    } else if (step === 2) {
      setStep(1);
    } else if (step === 3) {
      setStep(2);
    }
  }, [router, step]);

  const handlePartialReset = useCallback(() => {
    setStep(1);
    setOtp(["", "", "", ""]);
    setPurchasing(false);
  }, []);

  const handleReset = useCallback(() => {
    setStep(1);
    setOtp(["", "", "", ""]);
    setSuccess(null);
    setFormData({
      service_id: "",
      amount: "",
      customer_id: "",
      variation: null,
      type: "",
    });
    setVariations([]);
    setTransaction(null);
    setVerifyData(null);
    setVerifying(false);
    setLoadingProviders(false);
    setLoadingVariations(false);
    setPurchasing(false);
    fetchBeneficiaries(type);
    fetchFavourites(type);
  }, []);

  const handleNext = useCallback(() => setStep((s) => s + 1), []);

  const isStep1Valid = useCallback(() => {
    const baseCheck = !!formData.service_id;
    const amount = Number(formData.amount ?? 0);
    const balance = Number(user?.ngn_balance ?? 0);

    if (!baseCheck) return false;
    if (!Number.isFinite(amount) || amount <= 0) return false;

    // Check balance for non-fixed price items or after amount is set
    if (amount > balance) return false;

    switch (type) {
      case "airtime":
        return !!formData.customer_id && amount >= 10;
      case "data":
        return !!formData.customer_id && !!formData.variation && amount > 0;
      case "tv":
        return !!formData.customer_id && !!formData.variation && !!formData.type && amount > 0;
      case "electricity":
        return !!formData.customer_id && !!formData.variation && amount >= 500 && !!verifyData;
      case "betting":
        return !!formData.customer_id && !!formData.variation && amount > 0;
      default:
        return false;
    }
  }, [formData, type, user?.ngn_balance, verifyData]);

  const handleVerify = useCallback(async () => {
    if (!formData.service_id || !formData.customer_id) {
      toast.error("Please select a provider and enter customer details.");
      return;
    }

    if (["tv", "electricity"].includes(type) && !formData.variation) {
      toast.error("Please select a package first.");
      return;
    }

    setVerifying(true);
    try {
      const payload = {
        service_id: formData.service_id,
        number: formData.customer_id,
        type: formData.variation?.variation_code,
      };
      const url = "/bill/verify";
      const res = await api.post<ApiResponse>(url, payload);
      if (res.data.error || !res.data.data?.customer_name) {
        toast.error(res.data.message ?? "Verification failed");
        setVerifyData(null);
      } else {
        setVerifyData(res.data.data);
        toast.success("Verification successful");
      }
    } catch (err: any) {
      console.error("Verification error:", err);
      toast.error("Verification error. Try again.");
      setVerifyData(null);
    } finally {
      setVerifying(false);
    }
  }, [formData.service_id, formData.customer_id, formData.variation, type]);

  const handleSubmit = useCallback(async () => {
    setPurchasing(true);
    try {
      const basePayload: Record<string, any> = {
        service_id: formData.service_id,
        pin: pinExtractor(otp),
        amount: formData.amount,
        save_as_beneficiary: addBeneficiary,
        add_to_favorites: toggleFavorite,
      };

      if (["airtime", "data"].includes(type)) {
        if (formData.customer_id) basePayload.phone = formData.customer_id;
      } else {
        basePayload.phone = formData.customer_id ?? user?.phone ?? null;
      }

      if (["betting", "tv", "data", "electricity"].includes(type) && formData.variation) {
        basePayload.variation_code = String(formData.variation.variation_code);
      }

      if (["betting"].includes(type) && formData.customer_id) {
        basePayload.customer_id = formData.customer_id;
      }
      if (["tv"].includes(type) && formData.customer_id) {
        basePayload.smartcard_number = formData.customer_id;
      }
      if (["electricity"].includes(type) && formData.customer_id) {
        basePayload.meter_number = formData.customer_id;
      }
      if (["tv"].includes(type) && formData.type) {
        basePayload.type = formData.type;
      }
      if (verifyData) {
        basePayload.verify_data = verifyData;
      }

      const url = `/transactions/buy-${type}`;
      const res = await api.post<ApiResponse<Transaction | null>>(url, basePayload);

      if (res.data.error || !res.data.data) {
        setSuccess(false);
        toast.error(res.data.message ?? "Transaction failed");
      } else {
        setSuccess(true);
        setTransaction(res.data.data);
        toast.success("Transaction successful");
      }
    } catch (err: any) {
      console.error("Purchase error:", err);
      toast.error("An error occurred while processing your request. Please try again.");
      setSuccess(false);
    } finally {
      handlePartialReset();
    }
  }, [formData, otp, type, user?.phone, verifyData, handlePartialReset]);

  const selectedProvider = useMemo(
    () => providers.find((p) => p.service_id === formData.service_id) ?? null,
    [providers, formData.service_id]
  );

  const getProviderImage = useCallback((provider: Provider) => {
    const mapKey = (provider.service_id || "").toLowerCase();
    const imageMap: Record<string, string> = {
      mtn: "/img/mtn.png",
      airtel: "/img/airtel.png",
      glo: "/img/glo.png",
      etisalat: "/img/9mobile.png",
      "9mobile": "/img/9mobile.png",
      "foreign-airtime": "/img/international.png",
      dstv: "/img/dstv.png",
      gotv: "/img/gotv.png",
      startimes: "/img/startimes.png",
      showmax: "/img/showmax.png",
      "airtel-data": "/img/airtel.png",
      "mtn-data": "/img/mtn.png",
      "glo-data": "/img/glo.png",
      "etisalat-data": "/img/9mobile.png",
      "smile-direct": "/img/smile.png",
      spectranet: "/img/spectranet.png",
      "glo-sme-data": "/img/glo.png",
      "ikeja-electric": "/img/ikeja-electric.png",
      "ibadan-electric": "/img/ibadan-electric.png",
      "eko-electric": "/img/eko-electric.png",
      "abuja-electric": "/img/abuja-electric.png",
      "kano-electric": "/img/kano-electric.png",
      "portharcourt-electric": "/img/portharcourt-electric.png",
      "jos-electric": "/img/jos-electric.png",
      "kaduna-electric": "/img/kaduna-electric.png",
      "enugu-electric": "/img/enugu-electric.png",
      "benin-electric": "/img/benin-electric.png",
      "aba-electric": "/img/aba-electric.png",
      "yola-electric": "/img/yola-electric.png",
    };
    return imageMap[mapKey] ?? "/img/default.png";
  }, []);

  return (
    <div className="w-full h-full min-h-screen mx-auto max-w-xl relative flex flex-col px-4">
      <div className="flex-1 w-full overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key="purchase-main"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 p-2 z-0"
          >
            <div className="space-y-1 justify-between flex items-center w-full">
              <h2 className="text-2xl font-black">{config?.step_1_title}</h2>
              <Link href={`/app/schedules?type=${type}`}>
                <Calendar size={20} color="purple" />
              </Link>
            </div>

            <div className="space-y-6">
              <ProviderSelect
                providers={providers}
                value={formData.service_id}
                onChange={(service_id) =>
                  setFormData((prev) => ({
                    ...prev,
                    service_id: prev.service_id === service_id ? "" : service_id,
                    variation: prev.service_id === service_id ? prev.variation : null,
                    amount: prev.service_id === service_id ? prev.amount : "",
                    type: prev.service_id === service_id ? prev.type : "",
                  }))
                }
                loading={loadingProviders}
                getProviderImage={getProviderImage}
              />
              <div className="w-full flex items-start relative">
                <Favourites favourites={favourites} setSelected={setSelectedBeneficiary} />

                <ChevronRight size={16} color="purple" />
              </div>
              <Beneficiary
                toggle={toggleBeneficiary}
                onclose={onClose}
                beneficiaries={beneficiaries}
                setSelected={setSelectedBeneficiary}
              />
              {config?.show_variations && formData.service_id && (
                <VariationSelect
                  variations={variations}
                  value={formData.variation}
                  onSelect={(variation) =>
                    setFormData((prev) => ({
                      ...prev,
                      variation,
                      amount: String(
                        variation.variation_amount ?? variation.fixed_price ?? prev.amount
                      ),
                    }))
                  }
                  type={type}
                  loading={loadingVariations}
                />
              )}

              {type === "tv" && formData.service_id && formData.variation && (
                <div className="space-y-1">
                  <label className="text-sm font-semibold">Subscription Type</label>
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setFormData((prev) => ({ ...prev, type: "renew" }))}
                      className={`flex-1 p-4 rounded-2xl transition-all border-2 ${formData.type === "renew"
                        ? "border-purple-600 bg-purple-600/10"
                        : "border-transparent bg-card"
                        }`}
                    >
                      Renew
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setFormData((prev) => ({ ...prev, type: "change" }))}
                      className={`flex-1 p-4 rounded-2xl transition-all border-2 ${formData.type === "change"
                        ? "border-purple-600 bg-purple-600/10"
                        : "border-transparent bg-card"
                        }`}
                    >
                      Change Package
                    </motion.button>
                  </div>
                </div>
              )}

              {formData.service_id && (config?.show_amount_grid || formData.variation) && (
                <div className="space-y-1">
                  <div className="w-full flex justify-between ">
                    <label className="text-sm font-semibold pb-0">{config?.recipient}</label>
                    <button
                      onClick={() => setToggleBeneficiary(!toggleBeneficiary)}
                      className="w-fit  flex justify-between items-center"
                    >
                      {toggleBeneficiary ? (
                        <ChevronRight color="purple" />
                      ) : (
                        <div className="flex gap-2 items-center gradient-text-purple-to-blue">
                          <Users color="purple" />
                          <span>Beneficiaries</span>
                        </div>
                      )}
                    </button>
                  </div>
                  <div className="w-full flex gap-3 items-center">
                    {["airtime", "data"].includes(type) && (
                      <div className="p-4 my-3 rounded-full bg-card">+234</div>
                    )}
                    <TextInput
                      value={formData.customer_id}
                      onChange={(customer_id) => {
                        setFormData((prev) => ({ ...prev, customer_id }));
                        // Clear verification when customer ID changes
                        if (["tv", "electricity"].includes(type)) {
                          setVerifyData(null);
                        }
                      }}
                      placeholder={config?.placeholder}
                      type="text"
                      minLength={10}
                      maxLength={10}
                    />
                    {["tv", "electricity"].includes(type) && formData.variation && (
                      <button
                        type="button"
                        onClick={handleVerify}
                        className="py-4 px-12 my-3 rounded-full primary-purple-to-blue disabled:opacity-50"
                        disabled={verifying || !formData.customer_id || !formData.variation}
                      >
                        {verifying ? "Verifying..." : "Verify"}
                      </button>
                    )}
                  </div>

                  {verifyData && (
                    <div className="purple-text text-sm font-normal">
                      {verifyData.customer_name}
                      {verifyData.customer_address ? ` / ${verifyData.customer_address}` : ""}
                    </div>
                  )}
                </div>
              )}

              {type === "electricity" && formData.service_id && formData.variation && (
                <div className="space-y-1">
                  <label className="text-sm font-semibold">Meter Type</label>
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setFormData((prev) => ({ ...prev, type: "prepaid" }))}
                      className={`flex-1 p-4 rounded-2xl transition-all border-2 ${formData.type === "prepaid"
                        ? "border-purple-600 bg-purple-600/10"
                        : "border-transparent bg-card"
                        }`}
                    >
                      Prepaid
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setFormData((prev) => ({ ...prev, type: "postpaid" }))}
                      className={`flex-1 p-4 rounded-2xl transition-all border-2 ${formData.type === "postpaid"
                        ? "border-purple-600 bg-purple-600/10"
                        : "border-transparent bg-card"
                        }`}
                    >
                      Postpaid
                    </motion.button>
                  </div>
                </div>
              )}

              {config?.show_amount_grid && formData.service_id && !formData.variation && (
                <AmountGrid
                  value={formData.amount}
                  onChange={(amount) => setFormData((prev) => ({ ...prev, amount }))}
                  presetAmounts={presetAmounts}
                  minAmount={selectedProvider?.minimum_amount}
                  maxAmount={selectedProvider?.maximum_amount}
                />
              )}

              {type === "electricity" && formData.service_id && formData.variation && (
                <Amount
                  value={formData.amount}
                  onChange={(amount) => setFormData((prev) => ({ ...prev, amount }))}
                  minAmount={selectedProvider?.minimum_amount}
                  maxAmount={selectedProvider?.maximum_amount}
                />
              )}
            </div>

            <Button
              onclick={handleNext}
              type="secondary"
              text="Continue"
              width="w-full py-4"
              disabled={!isStep1Valid()}
              loading={loadingProviders || loadingVariations}
            />
          </motion.div>
        </AnimatePresence>

        {/* Step 2: Summary Modal */}
        {step === 2 && (
          <motion.div
            key="summary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="z-1 fixed max-w-xl inset-0 mx-auto space-y-8 w-full h-full"
          >
            <div className="z-1 inset-0 relative w-full h-full backdrop-blur-sm bg-zinc-900/10" />
            <div className="bottom-0 absolute z-2 w-full h-auto flex flex-col justify-end items-end">
              <div className="w-full bg-card py-5 rounded-t-3xl">
                <div className="space-y-1 flex">
                  <h2 className="text-2xl font-black w-full text-center">Summary</h2>
                </div>

                {!existingFavourites && (
                  <div className="absolute top-6 right-5">
                    {toggleFavorite ? (
                      <button
                        onClick={() => setToggleFavorite(!toggleFavorite)}
                        className="bg-background flex items-center justify-center flex-none w-7 h-7 rounded-full text-sm "
                      >
                        <Star size={20} color="gold" fill="gold" />
                      </button>
                    ) : (
                      <button
                        onClick={() => setToggleFavorite(!toggleFavorite)}
                        className="bg-background flex items-center justify-center flex-none w-7 h-7 rounded-full text-sm "
                      >
                        <Star size={20} color="gold" />
                      </button>
                    )}
                  </div>
                )}

                <div className="w-full rounded-2xl p-6 space-y-4">
                  <div className="flex justify-between items-center w-full">
                    <div className="text-xl font-black w-full justify-start flex">Amount</div>
                    <Image
                      src={"/svg/leftRight.svg"}
                      alt="swap arrow"
                      width={60}
                      height={60}
                      className="justify-center flex"
                    />
                    <div className="text-xl font-black w-full justify-end flex">
                      {formatToNGN(Number(formData.amount))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <ReviewItem label="Product" value={type.toUpperCase()} />
                    <ReviewItem
                      label={type === "tv" ? "Provider" : "Network"}
                      value={selectedProvider?.name ?? ""}
                    />
                    {formData.variation && (
                      <ReviewItem label="Package" value={formData.variation.name} />
                    )}
                    {config?.recipient && (
                      <ReviewItem label={config.recipient} value={formData.customer_id} />
                    )}
                    {verifyData?.customer_name && (
                      <ReviewItem label="Customer Name" value={verifyData.customer_name} />
                    )}
                  </div>

                  {!existingBeneficiary && (
                    <div className="flex w-full items-center justify-between">
                      <h1 className="gradient-text-purple-to-blue">Add as a Benficiary</h1>
                      <div
                        className={`w-full p-1 rounded-full max-w-13 flex ${addBeneficiary ? "justify-end bg-white/20" : "justify-start bg-background"} items-center  `}
                      >
                        <button
                          onClick={() => setAddBeneficiary(!addBeneficiary)}
                          className={` rounded-full h-5 w-5 ${addBeneficiary ? "primary-purple-to-blue" : "bg-card"}  `}
                        ></button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-x-4 px-5">
                  <Button onclick={handlePrev} type="dark" text="Cancel" width="flex-1 py-4" />
                  <Button
                    onclick={handleNext}
                    type="secondary"
                    text="Confirm & Pay"
                    width="flex-1 py-4"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 3: PIN */}
        {step === 3 && (
          <EnterPin
            otp={otp}
            show={true}
            setOtp={setOtp}
            headerText={"Enter your 4-digit transaction pin"}
            buttonText={"Pay"}
            onConfirm={handleSubmit}
            onBack={handlePrev}
          />
        )}

        {/* Success Modal */}
        {success === true && transaction && (
          <ViewTransactionDetails onClose={handleReset} type={type} transaction={transaction} />
        )}

        {/* Error Modal */}
        {success === false && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <div className="bg-card rounded-3xl p-8 max-w-md mx-4 space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center">
                  <X className="w-10 h-10 text-red-500" />
                </div>
                <h3 className="text-2xl font-black text-center">Transaction Failed</h3>
                <p className="text-center text-zinc-400">
                  Your transaction could not be completed. Please try again.
                </p>
              </div>
              <Button onclick={handleReset} type="secondary" text="Try Again" width="w-full py-4" />
            </div>
          </motion.div>
        )}

        {(purchasing || verifying) && <LoadingOverlay />}
      </div>

    </div>
  );
}

/* Subcomponents */

interface ProviderSelectProps {
  providers: Provider[];
  value: string;
  onChange: (service_id: string) => void;
  loading?: boolean;
  getProviderImage: (p: Provider) => string;
}

const ProviderSelect = React.memo(function ProviderSelect({
  providers,
  value,
  onChange,
  loading,
  getProviderImage,
}: ProviderSelectProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="w-full overflow-x-auto flex flex-row items-stretch justify-start space-x-2">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="w-full max-w-[100px] min-w-[100px] rounded-2xl p-0.5 bg-card animate-pulse"
            >
              <div className="flex flex-col items-center w-full rounded-2xl overflow-hidden bg-card h-24"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="w-full overflow-x-auto flex flex-row items-stretch justify-start space-x-2">
        {providers.map((provider, i) => {
          const active = value === provider.service_id;
          return (
            <div
              key={i}
              className={`w-full max-w-[100px] min-w-[100px] rounded-2xl p-0.5 ${active ? "primary-purple-to-blue" : "bg-card"} ${value && !active ? "opacity-50" : "opacity-100"}`}
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onChange(provider.service_id)}
                className={`flex flex-col items-center w-full rounded-2xl overflow-hidden transition-all bg-card`}
              >
                <div className="w-full h-auto mb-2 flex items-center justify-center">
                  <div className="w-full h-20 relative">
                    <Image
                      src={getProviderImage(provider)}
                      alt={provider.name}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        try {
                          (e.target as HTMLImageElement).src = "/img/placeholder.png";
                        } catch { }
                      }}
                    />
                  </div>
                </div>
                <span className="text-sm font-medium py-1 text-center">{provider.name}</span>
              </motion.button>
            </div>
          );
        })}
      </div>
    </div>
  );
});

interface VariationSelectProps {
  variations: Variation[];
  value: Variation | null;
  onSelect: (variation: Variation) => void;
  type: PurchaseType;
  loading?: boolean;
}

const VariationSelect = React.memo(function VariationSelect({
  variations,
  value,
  onSelect,
  type,
  loading,
}: VariationSelectProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        <label className="text-sm font-semibold">
          Select {type !== "data" ? "Package" : "Data Plan"}
        </label>
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
          {type === "data"
            ? [...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl p-0.5 bg-card animate-pulse">
                <div className="w-full p-4 rounded-2xl bg-card h-24" />
              </div>
            ))
            : [...Array(3)].map((_, i) => (
              <div key={i} className="rounded-xl p-0.5 bg-card animate-pulse">
                <div className="w-full p-4 rounded-2xl bg-card h-12" />
              </div>
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 h-full">
      <label className="text-sm font-semibold">
        Select {type !== "data" ? "Package" : "Data Plan"}
      </label>
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-4 max-h-100 overflow-y-auto">
        {variations.map((variation, i) => {
          const active = value?.variation_code === variation.variation_code;
          return (
            <div
              key={i}
              className={`rounded-2xl p-0.5 border-2 bg-card ${active ? "border-purple-600/80" : "border-transparent"}`}
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelect(variation)}
                className={`w-full text-sm p-4 rounded-2xl text-left transition-all bg-card`}
              >
                <div className="flex flex-col justify-between items-center">
                  <div>
                    <h4 className="font-black text-center">{variation.name}</h4>
                  </div>
                </div>
              </motion.button>
            </div>
          );
        })}
      </div>
    </div>
  );
});

interface AmountGridProps {
  value: string;
  onChange: (value: string) => void;
  presetAmounts: number[];
  minAmount?: string;
  maxAmount?: string;
}

export function AmountGrid({
  value,
  onChange,
  presetAmounts,
  minAmount,
  maxAmount,
}: AmountGridProps) {
  return (
    <div className="space-y-1">
      <label className="text-sm placeholder-text font-semibold">Amount</label>
      <div className="flex flex-row items-center justify-start space-x-2 overflow-x-auto mb-4">
        {presetAmounts.map((amount, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onChange(amount.toString())}
            className={`w-[90px] sm:w-[120px] p-2.5 text-sm rounded-2xl transition-all bg-card border-2 ${value === amount.toString() ? "border-purple-600" : "border-transparent"}`}
          >
            {formatToNGN(Number(amount), false)}
          </motion.button>
        ))}
      </div>

      <TextInput
        value={value}
        onChange={onChange}
        placeholder="Custom amount"
        type="number"
        currency="₦"
      />

      {(minAmount || maxAmount) && (
        <p className="text-xs text-zinc-500">
          Amount range: {formatToNGN(Number(minAmount))} {" - "} {formatToNGN(Number(maxAmount))}
        </p>
      )}
    </div>
  );
}

interface AmountProps {
  value: string;
  onChange: (value: string) => void;
  minAmount?: string;
  maxAmount?: string;
}

export function Amount({ value, onChange, minAmount, maxAmount }: AmountProps) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-semibold">Amount</label>
      <TextInput
        value={value}
        onChange={onChange}
        placeholder="Enter amount"
        type="number"
        currency="₦"
      />
      {(minAmount || maxAmount) && (
        <p className="text-xs text-zinc-500">
          Amount range: {formatToNGN(Number(minAmount))} {" - "} {formatToNGN(Number(maxAmount))}
        </p>
      )}
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

interface BeneficiaryProps {
  beneficiaries: any[];
  onclose?: () => void;
  toggle: boolean;
  setSelected: Dispatch<SetStateAction<string | null>>;
}

export function Beneficiary({ beneficiaries, setSelected, onclose, toggle }: BeneficiaryProps) {
  const { deleteBeneficiary } = useBeneficiary();
  const safeBeneficiaries = Array.isArray(beneficiaries) ? beneficiaries : [];

  return (
    <div
      onClick={() => onclose?.()}
      className={`w-full h-full  absolute top-0 ${toggle ? "flex" : "hidden"} z-[99] items-end  left-0 bg-black/70  `}
    >
      <div className="w-full space-y-4 p-6 h-[50%] bg-card rounded-t-4xl">
        <div className="flex items-start justify-between pr-1">
          <h1 className="gradient-text-purple-to-blue">Beneficiaries</h1>
          <button className="p-2 rounded-full bg-background">
            <X size={16} />
          </button>
        </div>
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full grid  gap-2 relative z-20 items-center overflow-x-scroll"
        >
          {safeBeneficiaries?.map((b, i) => (
            <button
              onClick={() => {
                setSelected(b?.data?.phone ?? null);
              }}
              key={i}
              className="p-3 text-sm w-full gap-2 bg-background  justify-between flex hover:bg-hover items-center rounded-2xl mb-2"
            >
              {b.action === "intra" ? (
                <div className="flex flex-col gap-1 text-start">
                  <span className="truncate">{b.data.recipient}</span>{" "}
                  <span className="gradient-text-orange-to-purple">{b.data.phone}</span>
                </div>
              ) : b.action == "inter" ? (
                <div className="space-y-1">
                  <div>{b.data.account_number}</div> <div>{b.data.bank_name}</div>
                </div>
              ) : (
                <>
                  <Image
                    src={`/img/${b.data.servicer_id}.png` || "/img/placeholder.png"}
                    alt={b.data.service_id}
                    width={40}
                    height={40}
                    className="object-cover rounded-full"
                  />
                  <span className="w-full text-start pl-3">{b?.data?.phone ?? ""}</span>
                </>
              )}

              <button
                onClick={(e) => {
                  (deleteBeneficiary(b.reference), e.stopPropagation());
                }}
                className="bg-card p-3 rounded-3xl cursor-pointer"
              >
                <Trash2 color="red" size={16} />
              </button>
            </button>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
interface favouritesProps {
  favourites: any[];
  setSelected: Dispatch<SetStateAction<string | null>>;
}

export function Favourites({ favourites, setSelected }: favouritesProps) {
  const { deleteFavourite } = useFavourite();
  return (
    <div className="w-full rounded-2xl h-fit max-h-70 overflow-auto  text-sm p-2 space-y-4">
      <div className="w-full flex gap-4 items-center overflow-x-scroll">
        {favourites?.map((b, i) => (
          <button
            onClick={() => {
              setSelected(b?.data?.phone ?? null);
            }}
            key={i}
            className="p-3 text-sm w-fit gap-2 bg-card  flex-none justify-between flex hover:bg-hover items-center rounded-2xl mb-2"
          >
            {b.action === "intra" ? (
              <div className="flex flex-col gap-1 text-start">
                <span className="truncate">{b.data.recipient}</span>{" "}
                <span className="gradient-text-orange-to-purple">{b.data.phone}</span>
              </div>
            ) : b.action == "inter" ? (
              <div className="space-y-1">
                <div>{b.data.account_number}</div> <div>{b.data.bank_name}</div>
              </div>
            ) : (
              <>
                <Image
                  src={`/img/${b.data.service_id}.png` || "/img/placeholder.png"}
                  alt={b.data.service_id || ""}
                  width={40}
                  height={40}
                  className="object-cover rounded-full"
                />
                <span className="w-full text-start pl-3">{b?.data?.phone ?? ""}</span>
              </>
            )}

            <button
              onClick={async (e) => {
                e.stopPropagation();
                await deleteFavourite(b.reference);
              }}
              className="bg-background p-3 rounded-3xl cursor-pointer"
            >
              <Trash2 color="red" size={16} />
            </button>
          </button>
        ))}
      </div>
    </div>
  );
}
