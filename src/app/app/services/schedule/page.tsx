"use client";

import { AmountGrid } from "@/components/flows/service-flow";
import Button from "@/components/ui/Button";
import api from "@/lib/axios";
import { Variation, Provider, ApiResponse } from "@/types/api";
import { Plus, ChevronDown, X, Trash2 } from "lucide-react";
import Image from "next/image";
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Detail } from "@/components/modals/ViewTransactionModal";
import useSchedule from "@/hooks/useSchedule";
import {
  secondsInDay,
  secondsInHour,
  secondsInWeek,
  secondsInMinute,
  secondsInYear,
  secondsInMonth,
  secondsToSmartUnit,
} from "@/utils/date";
import { removeNum, removeString } from "@/utils/string";
import { AnimatePresence, motion } from "framer-motion";

interface ScheduleProps {
  type: string;
  close: Dispatch<SetStateAction<boolean>>;
}
export function Schedule({ type, close }: ScheduleProps) {
  const { schedules, fetchSchedules, updateSchedule, deleteSchedule } = useSchedule();
  const [toggleAdd, setToggleAdd] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<number | null>(null);
  const [reference, setReference] = useState<string | null>(null);

  useEffect(() => {
    fetchSchedules();
  }, [toggleAdd]);

  const fetchSingleSchedule = schedules?.find(
    (schedule) => schedule.reference === selectedSchedule
  );

  const handleDeleteSchedule = async (reference: string) => {
    await deleteSchedule(reference);
  };

  const handleToggleStatus = async (reference: string) => {
    if (!reference) {
      toast.error("Invalid schedule reference");
      return;
    }

    const schedule = schedules?.find((s) => s.reference === reference);

    if (!schedule) {
      toast.error("Schedule not found");
      return;
    }

    const currentStatus = schedule.data?.status;

    if (!currentStatus || (currentStatus !== "running" && currentStatus !== "pause")) {
      toast.error("Invalid schedule status");
      return;
    }

    const newStatus = currentStatus === "running" ? "pause" : "running";

    try {
      const updatePayload = {
        data: {
          ...schedule.data,
          status: newStatus,
        },
      };

      await updateSchedule(reference, updatePayload);
      toast.success(`Schedule ${newStatus === "running" ? "resumed" : "paused"}`);
    } catch (error) {
      toast.error("Failed to update schedule status");
    } finally {
      fetchSchedules();
    }
  };

  const isRunning = (reference: string) => {
    const schedule = schedules?.find((s) => s.reference === reference);
    const status = schedule?.data?.status || schedule?.status;
    return status === "running";
  };

  return (
    <div className="w-full min-h-screen p-4 absolute top-0 left-0 bg-background">
      <div className=" flex justify-between w-full items-center">
        <h1 className="text-center gradient-text-purple-to-blue text-3xl">Schedules</h1>
        <button onClick={() => setToggleAdd(!toggleAdd)} className="cursor-pointer">
          {toggleAdd ? <X size={30} color="red" /> : <Plus size={30} color="skyblue" />}
        </button>
      </div>

      <div className="flex justify-between flex-col w-full  min-h-150 ">
        {toggleAdd ? (
          <div className=" flex items-center justify-center">
            <AddSchedule types={type} close={setToggleAdd} />
          </div>
        ) : (
          <div className="w-full space-y-4 mt-4">
            {fetchSingleSchedule ? (
              <SingleSchedule close={setSelectedSchedule} schedule={fetchSingleSchedule} />
            ) : (
              <div className="space-y-4">
                {schedules?.map((schedule, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedSchedule(schedule?.reference)}
                    className="w-full rounded-2xl relative bg-card px-6 py-4"
                  >
                    <div className="relative space-y-1">
                      <div className="w-ful flex justify-between items-center">
                        <div className="text-xs absolute bottom-1 left-0 text-stone-400">
                          {schedule.data?.frequency}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setReference(schedule.reference);
                          }}
                          className="w-fit absolute top-1 right-1 "
                        >
                          <Trash2 color="red" size={16} />
                        </button>
                      </div>
                      <div className="flex w-full items-end justify-between">
                        <div className="flex w-full gap-6 ">
                          <div className="leading-4 min-w-13 ">
                            <h2 className="text-5xl gradient-text-orange-to-purple">
                              {removeString(secondsToSmartUnit(schedule.data?.interval || 0))}
                            </h2>
                            <h6 className="text-lg">
                              {removeNum(secondsToSmartUnit(schedule.data?.interval || 0))}
                            </h6>
                          </div>
                          <div className=" space-y-1 sm:pr-5 w-full">
                            <div className="flex items-center justify-between gap-3">
                              <div className="text-xs  text-stone-400">Title:</div>
                              <div className="text-sm">{schedule.data?.description}</div>
                            </div>

                            <div className="flex items-center justify-between gap-3">
                              <div className="text-xs  text-stone-400">Service:</div>
                              <div className="text-sm">{schedule.data?.service_name} </div>
                            </div>
                            <div className="flex items-center justify-between gap-3">
                              <div className="text-xs  text-stone-400">Variation:</div>
                              <div className="text-sm">{schedule.data?.variation_code} </div>
                            </div>

                            {schedule.data?.amount !== "" && (
                              <div className="flex items-center justify-between gap-3">
                                <div className="text-xs  text-stone-400">Amount</div>
                                <div className="text-sm">{schedule.data?.description}</div>
                              </div>
                            )}

                            <div className="flex  items-center w-full justify-between">
                              <h6 className="text-xs  text-stone-400">Recepiant:</h6>
                              <h3 className="text-sm">{schedule.data?.phone}</h3>
                            </div>

                            <div className="flex items-center justify-between gap-3">
                              <div className="text-xs text-stone-400">Status:</div>
                              <div
                                className={`text-sm ${
                                  schedule.status === "running"
                                    ? "text-green-500"
                                    : "text-yellow-500"
                                }`}
                              >
                                {schedule.data?.status}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div
                          onClick={(e) => e.stopPropagation()}
                          className={`w-full p-1 rounded-full max-w-13 flex ${
                            isRunning(schedule?.reference)
                              ? "justify-end bg-white/20"
                              : "justify-start bg-background"
                          } items-center`}
                        >
                          <button
                            onClick={() => handleToggleStatus(schedule?.reference)}
                            className={`rounded-full h-5 w-5 ${
                              isRunning(schedule?.reference) ? "primary-purple-to-blue" : "bg-card"
                            }`}
                          ></button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        <div className="w-full mt-5">
          <Button onclick={() => close(false)} type="secondary" text="close" />
        </div>
      </div>
      <AnimatePresence>
        {reference && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-screen fixed top-0 left-0 flex items-end sm:items-center justify-center bg-black/50 z-50"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full absolute top-0 left-0 backdrop-blur-xl"
              onClick={() => setReference(null)}
            />

            <motion.div
              initial={{ y: 300, opacity: 0, scale: 0.8 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 300, opacity: 0, scale: 0.8 }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 300,
              }}
              className="grid sm:max-w-md mx-auto gap-4 w-full p-6 rounded-t-2xl sm:rounded-2xl bg-card relative z-20 shadow-2xl"
            >
              <h1 className="text-center text-xl font-semibold">Are you sure?</h1>
              <p className="text-center text-stone-400 text-sm">
                This action cannot be undone. The schedule will be permanently deleted.
              </p>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setReference(null)}
                  className="flex-1 p-3 rounded-xl bg-stone-700 hover:bg-stone-600 transition-colors text-lg font-semibold text-white"
                >
                  Cancel
                </button>

                <button
                  onClick={() => {
                    handleDeleteSchedule(reference);
                    setReference(null);
                  }}
                  className="flex-1 p-3 rounded-xl bg-red-500 hover:bg-red-600 transition-colors text-lg font-semibold text-white"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface ScheduleData {
  data: {
    id: number;
    title: string;
    phone: string;
    label: string;
    interval: number;
    duraton: string;
    frequency: string;
    status: string;
    description: string;
    service_name: string;
  };
   reference: string;
}
interface SingleScheduleProps {
  close: Dispatch<SetStateAction<null | number>>;
 
  schedule: ScheduleData;
}

function SingleSchedule({ close, schedule }: SingleScheduleProps) {
  const { fetchScheduleHistory } = useSchedule();
  useEffect(() => {
    fetchScheduleHistory(schedule.reference);
  },[]);

  console.log("schedule history", schedule)
  return (
    <div className="w-full min-h-screen bg-background">
      <div className="w-full p-5 rounded-2xl bg-card ">
        <div className="w-full flex justify-end">
          <button
            onClick={() => close(null)}
            className="cursor-pointer hover:bg-background p-1 rounded-sm gradient-text-orange-to-purple"
          >
            close
          </button>
        </div>

        <div className="w-full space-y-2">
          <h1 className="text-2xl text-center gradient-text-purple-to-blue">
            {schedule.data?.description}
          </h1>

          {/* DETAILS */}
          <div className="w-full rounded-2xl p-2 space-y-2">
            <Detail label="Type" value={schedule.data?.title} />
            <Detail label="Service type" value={schedule.data?.service_name} />
            <Detail label="Recepiant" value={schedule.data?.phone} />
            <div className="flex items-center w-full justify-between  ">
              <Detail
                label="Duration"
                value={`${removeString(secondsToSmartUnit(schedule.data?.interval || 0))} ${removeNum(secondsToSmartUnit(schedule.data.interval || 0))}`}
              />
            </div>
            <Detail label="Interval" value={schedule.data?.frequency} />
            <Detail label="Description" value={schedule.data?.description} />
            <Detail label="Status" value={schedule.data?.status} />
          </div>
        </div>
      </div>
    </div>
  );
}

interface AddScheduleProps {
  types: string;
  close: Dispatch<SetStateAction<boolean>>;
}

export function AddSchedule({ types, close }: AddScheduleProps) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("Days");
  const [toggle, setToggle] = useState(false);
  const [toggleVariation, setToggleVariation] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<string | null | undefined>(null);
  const [selectedVaraition, setSelectedVariation] = useState<string | null>(null);
  const [selectedVariationName, setSelectedVariationName] = useState<string | null>(null);
  const [variation, setVariation] = useState<Variation[]>([]);
  const [provider, setProvider] = useState<Provider[]>([]);
  const [frequency, setFrequency] = useState<"once" | "repeat">("repeat");
  const [phone, setPhone] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [duration, setDuration] = useState<number | string>("");

  const names = ["data", "payment", "internet", "sme", "(", ")", "airtime", "vtu"];
  const presetAmounts = useMemo(() => [100, 200, 500, 1000, 2000, 5000], []);

  const calculateInterval = useCallback((duration: number, type: string) => {
    switch (type.toLowerCase()) {
      case "days":
        return secondsInDay(duration);
      case "week":
        return secondsInWeek(duration);
      case "hour":
        return secondsInHour(duration);
      case "minutes":
        return secondsInMinute(duration);
      case "months":
        return secondsInMonth(duration);
      default:
        return secondsInYear(duration);
    }
  }, []);

  console.log("seconds ", calculateInterval(Number(duration), type));

  const { addSchedule, loading } = useSchedule();

  const dataPayload = {
    phone: phone,
    service_id: selectedProvider,
    amount: amount,
    variation_code: selectedVaraition,
    title: selectedVaraition,
    action: types,
    interval: calculateInterval(Number(duration), type),
    frequency,
    status: "running",
    description,
    service_name: selectedProvider,
  };
  const payload = {
    title: selectedVaraition,
    action: types,
    interval: calculateInterval(Number(duration), type),
    frequency,
    data: dataPayload,
  };

  const validateField = (fieldName: string, value: string): string => {
    switch (fieldName) {
      case "phone":
        if (!value.trim()) {
          return types === "electricity"
            ? "Meter number is required"
            : types === "tv"
              ? "Smart card number is required"
              : "Phone number is required";
        }
        if (!/^\d+$/.test(value.replace(/\s/g, ""))) {
          return "Should contain only numbers";
        }
        if (value.replace(/\s/g, "").length < 6) {
          return types === "electricity"
            ? "Meter number too short"
            : types === "tv"
              ? "Smart card number too short"
              : "Phone number too short";
        }
        return "";

      case "duration":
        if (!value || value.trim() === "") {
          return "Duration is required";
        }
        if (isNaN(Number(value)) || Number(value) <= 0) {
          return "Duration must be a positive number";
        }
        if (Number(value) > 1000) {
          return "Duration cannot exceed 1000";
        }
        return "";

      case "amount":
        if ((types === "airtime" || types === "electricity") && (!value || value.trim() === "")) {
          return "Amount is required";
        }
        if (
          (types === "airtime" || types === "electricity") &&
          (isNaN(Number(value)) || Number(value) <= 0)
        ) {
          return "Amount must be greater than 0";
        }
        if ((types === "airtime" || types === "electricity") && Number(value) > 100000) {
          return "Amount cannot exceed ₦100,000";
        }
        return "";

      case "description":
        if (!value.trim()) {
          return "Description is required";
        }
        if (value.trim().length < 3) {
          return "Description must be at least 3 characters";
        }
        if (value.trim().length > 100) {
          return "Description cannot exceed 100 characters";
        }
        return "";

      default:
        return "";
    }
  };

  const validateForm = (): { isValid: boolean; errors: Record<string, string> } => {
    const errors: Record<string, string> = {};

    // Validate Provider
    if (!selectedProvider) {
      errors.provider = "Please select a service provider";
    }

    // Validate Phone Number
    const phoneError = validateField("phone", phone);
    if (phoneError) errors.phone = phoneError;

    // Validate Duration
    const durationError = validateField("duration", duration.toString());
    if (durationError) errors.duration = durationError;

    // Validate Type
    if (!type) {
      errors.type = "Please select a time unit";
    }

    // Validate Variation (not required for airtime)
    if (!selectedVaraition && types !== "airtime" && types !== "electricity") {
      errors.variation = "Please select a service variation";
    }

    // Validate Amount for airtime and electricity
    const amountError = validateField("amount", amount);
    if (amountError) errors.amount = amountError;

    // Validate Description
    const descriptionError = validateField("description", description);
    if (descriptionError) errors.description = descriptionError;

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  };

  const handleFieldValidation = (fieldName: string, value: string) => {
    const error = validateField(fieldName, value);
    setFieldErrors((prev) => ({
      ...prev,
      [fieldName]: error,
    }));
  };

  const handleSave = async () => {
    const validation = validateForm();

    if (!validation.isValid) {
      setFieldErrors(validation.errors);

      const firstError = Object.values(validation.errors)[0];
      toast.error(firstError);
      return;
    }

    setFieldErrors({});

    try {
      await addSchedule(payload);
    } catch (err) {
      console.log(err);
    } finally {
      close(false);
    }
  };
  const typeControl = () => {
    switch (types) {
      case "tv":
        return "tv-subscription";
      case "electricity":
        return "electricity-bill";
      default:
        return types;
    }
  };
  const fetchProvider = async () => {
    try {
      const res = await api.get<ApiResponse>(`/bill/service?service=${typeControl()}`);
      if (!res.data.error && res.data.data) {
        setProvider(res.data.data);
      } else {
        toast.error("failed to fetch provider");
      }
    } catch (err) {
      console.log("Error Fetching provider");
    }
  };

  const fetchVariation = async () => {
    try {
      const res = await api.get<ApiResponse>(
        `/bill/service-variations?service_id=${selectedProvider}`
      );
      if (!res.data.error && res.data.data) {
        setVariation(res.data.data.variations);
      } else {
        toast.error("failed to fetch provider");
      }
    } catch (err) {
      console.log("Error Fetching provider");
    }
  };

  useEffect(() => {
    fetchProvider();
    fetchVariation();
  }, [selectedProvider]);

  const fixName = (name: string) => {
    let result = name.toLowerCase();

    names.forEach((item) => {
      result = result.replace(item, "");
    });

    return result.trim();
  };

  return (
    <div className="space-y-4  bg-card mt-10 p-5 rounded-2xl w-full">
      <div className="space-y-2">
        <h1 className=" text-sm placeholder-text">Select Provider</h1>

        <div className="flex items-center p-1 gap-2 overflow-auto">
          {provider?.map((provider) => (
            <button
              onClick={() => {
                setSelectedProvider(provider.serviceID);
                setFieldErrors((prev) => ({ ...prev, provider: "" }));
              }}
              key={provider.serviceID}
              className={`w-25 h-30 relative  overflow-hidden flex-none rounded-xl flex flex-col ${selectedProvider === provider.serviceID ? "primary-purple-to-blue" : "opasity-20 "} ${fieldErrors.provider ? "border border-red-500" : ""}`}
            >
              <div
                className={` w-full h-full absolute top-0 right-0 ${selectedProvider === provider.serviceID ? "z-0" : "z-20  bg-black/50"} `}
              />
              <div className="w-25 h-25 rounded-xl overflow-hidden relative">
                <Image
                  src={
                    types === "electricity" || "tv"
                      ? `/img/${provider.serviceID}.png`
                      : `/img/${fixName(provider.name)}.png`
                  }
                  alt={provider.name}
                  fill
                  className="object-cover"
                />
              </div>
              <span>{fixName(provider.name)}</span>
            </button>
          ))}
        </div>
        {fieldErrors.provider && (
          <div className="text-red-500 text-xs mt-1">{fieldErrors.provider}</div>
        )}
        <div className="flex w-full my-6  items-center justify-between ">
          <h5 className="text-sm placeholder-text">Frequency</h5>
          <div className="w-fit gap-2 flex  p-1 rounded-sm bg-background">
            <button
              onClick={() => setFrequency("repeat")}
              className={`rounded-sm px-2 py-0.5 text-sm ${
                frequency === "repeat" ? "primary-purple-to-blue" : "bg-card"
              }`}
            >
              Repeat
            </button>
            <button
              onClick={() => setFrequency("once")}
              className={`rounded-sm px-2 py-0.5 text-sm ${
                frequency === "once" ? "primary-purple-to-blue" : "bg-card"
              }`}
            >
              Once
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <h5 className="text-sm placeholder-text">
            {types === "electricity"
              ? "Meter Number"
              : types === "tv"
                ? "Smart Card Number"
                : "Phone Number"}
          </h5>

          <div className="w-full rounded-2xl bg-background ">
            <input
              type="text"
              value={phone}
              placeholder={
                types === "electricity"
                  ? "Meter Number"
                  : types === "tv"
                    ? "Smart Card Number"
                    : "Phone Number"
              }
              onChange={(e) => {
                (setPhone(e.target.value), validateField("phone", e.target.value));
              }}
              className={`py-5 w-full outline-none border-none text-sm px-5 gradiant-text-purple-to-blue ${
                fieldErrors.phone ? "border-red-500" : ""
              }`}
            />
            {fieldErrors.phone && (
              <div className="text-red-500 text-xs mt-1">{fieldErrors.phone}</div>
            )}
          </div>
        </div>
      </div>
      <h1 className=" text-sm placeholder-text">Select Interval</h1>

      <div className="relative w-full gap-3 grid grid-cols-2">
        <div className="bg-background  rounded-2xl">
          <input
            value={duration}
            onChange={(e) => {
              setDuration(e.target.value);
              handleFieldValidation("duration", e.target.value);
            }}
            type="number"
            placeholder="min,hour,days,weeks,months, year"
            className={`w-full h-full text-sm sm:px-5 px-2 outline-none rounded-2xl ${
              fieldErrors.duration ? "border border-red-500" : ""
            }`}
          />
        </div>
        <div className=" w-full relative">
          <button
            onClick={() => setToggle(!toggle)}
            className={`bg-background justify-between w-full p-5 rounded-2xl flex gap-5 ${
              fieldErrors.type ? "border border-red-500" : ""
            }`}
          >
            <span className="text-sm gradient-text-purple-to-blue ">
              {type ? `${type}` : "Select type"}{" "}
            </span>
            <ChevronDown color="blue" size={20} />
          </button>
          {fieldErrors.type && <div className="text-red-500 text-xs mt-1">{fieldErrors.type}</div>}
        </div>
        {toggle && (
          <div className="grid w-1/2 z-10 max-h-70 bg-background absolute top-full right-0 p-3 rounded-lg overflow-auto">
            {["Minutes", "Hour", "Days", "Week", "Months", "Year"].map((timeUnit) => (
              <button
                onClick={() => {
                  {
                    setToggle(!toggle);
                    setType(timeUnit);
                    // Clear type error when selected
                    setFieldErrors((prev) => ({ ...prev, type: "" }));
                  }
                }}
                key={timeUnit}
                className="flex w-full gap-3 py-2   justify-between space-y-4 hover:text-stone-200 hover:bg-background"
              >
                <span>{timeUnit}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <h1 className="space-y-2 text-sm placeholder-text">Select Variation</h1>

      {types === "airtime" || types === "electricity" ? (
        <div className="space-y-2">
          {types === "electricity" && (
            <div className="relative w-full mb-3">
              <div className=" w-full relative">
                <button
                  onClick={() => setToggleVariation(!toggleVariation)}
                  className={`bg-background justify-between w-full p-5 rounded-2xl flex gap-5 ${
                    fieldErrors.variation ? "border border-red-500" : ""
                  }`}
                >
                  <span className="text-sm gradient-text-purple-to-blue ">
                    {selectedVariationName
                      ? ` ${selectedVariationName.toUpperCase()}`
                      : "Select variation"}{" "}
                  </span>
                  <ChevronDown color="blue" size={20} />
                </button>
              </div>
              {fieldErrors.variation && (
                <div className="text-red-500 text-xs mt-1">{fieldErrors.variation}</div>
              )}
              {toggleVariation && (
                <div className="grid w-full min-h-50 grid-cols-2 z-20 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-70 bg-background absolute top-full p-3 rounded-2xl overflow-auto">
                  {variation?.map((variation, i) => (
                    <button
                      onClick={() => {
                        (setToggleVariation(!toggleVariation),
                          setSelectedVariation(variation.variation_code),
                          setSelectedVariationName(variation.name));
                        setFieldErrors((prev) => ({ ...prev, variation: "" }));
                      }}
                      key={i}
                      className={`flex w-full h-fit gap-3 bg-card text-sm p-2 mx-auto rounded-lg justify-between space-y-4 hover:text-stone-200 hover:primary-purple-to-blue max-w-30 `}
                    >
                      <span>{variation.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          <div className="w-full bg-background  p-2 rounded-2xl">
            <AmountGrid
              presetAmounts={presetAmounts}
              value={amount}
              onChange={(val: number | string) => {
                setAmount(String(val));
                handleFieldValidation("amount", String(val));
              }}
            />
          </div>
          {fieldErrors.amount && (
            <div className="text-red-500 text-xs mt-1">{fieldErrors.amount}</div>
          )}
        </div>
      ) : (
        <div className="relative w-full">
          <div className=" w-full relative">
            <button
              onClick={() => setToggleVariation(!toggleVariation)}
              className="bg-background justify-between w-full p-5 rounded-2xl flex  gap-5"
            >
              <span className="text-sm gradient-text-purple-to-blue ">
                {selectedVariationName
                  ? ` ${selectedVariationName.toUpperCase()}`
                  : " Select variation"}{" "}
              </span>
              <ChevronDown color="blue" size={20} />
            </button>
          </div>
          {toggleVariation && (
            <div className="grid w-full z-20 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-70 bg-background absolute top-full p-3 rounded-2xl overflow-auto">
              {variation?.map((variation, i) => (
                <button
                  onClick={() => {
                    (setToggleVariation(!toggleVariation),
                      setSelectedVariation(variation.variation_code),
                      setSelectedVariationName(variation.name));
                  }}
                  key={i}
                  className={`flex w-full gap-3 bg-card text-sm p-2 mx-auto rounded-lg justify-between space-y-4 hover:text-stone-200 hover:primary-purple-to-blue max-w-30 `}
                >
                  <span>{variation.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="w-full rounded-2xl bg-background ">
        <input
          type="text"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            handleFieldValidation("description", e.target.value);
          }}
          className={`py-5 w-full outline-none border-none text-sm px-5 gradiant-text-purple-to-blue ${
            fieldErrors.description ? "border border-red-500 rounded-2xl" : ""
          }`}
          placeholder="Description"
        />

        {fieldErrors.description && (
          <div className="text-red-500 text-xs mt-1 px-2">{fieldErrors.description}</div>
        )}
      </div>

      <Button onclick={handleSave} loading={loading} variant="submit" type="primary" text="Save" />
    </div>
  );
}
