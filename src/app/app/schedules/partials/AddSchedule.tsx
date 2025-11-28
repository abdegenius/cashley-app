import { AmountGrid } from "@/components/flows/service-flow";
import Button from "@/components/ui/Button";
import useSchedule from "@/hooks/useSchedule";
import api from "@/lib/axios";
import { PRESET_AMOUNTS, SERVICE_CONFIG, TIME_UNITS } from "@/types";
import { ApiResponse, Provider, Variation } from "@/types/api";
import { calculateInterval } from "@/utils/date";
import { cleanServiceName } from "@/utils/string";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

interface AddScheduleProps {
    type: string;
    close: Dispatch<SetStateAction<boolean>>;
}
const useScheduleForm = (type: string, close: Dispatch<SetStateAction<boolean>>) => {
    const [formState, setFormState] = useState({
        amount: "",
        title: "",
        type: "Days" as string,
        phone: "",
        duration: "",
        frequency: "repeat" as "once" | "repeat",
        selectedProvider: null as string | null,
        selectedVariation: null as string | null,
        selectedVariationName: null as string | null,
    });

    const [uiState, setUiState] = useState({
        toggle: false,
        toggleVariation: false,
    });

    const [data, setData] = useState({
        variation: [] as Variation[],
        provider: [] as Provider[],
    });

    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    const updateFormState = (updates: Partial<typeof formState>) => {
        setFormState(prev => ({ ...prev, ...updates }));
    };

    const updateUiState = (updates: Partial<typeof uiState>) => {
        setUiState(prev => ({ ...prev, ...updates }));
    };

    return {
        formState,
        uiState,
        data,
        fieldErrors,
        updateFormState,
        updateUiState,
        setData: (updates: Partial<typeof data>) => setData(prev => ({ ...prev, ...updates })),
        setFieldErrors,
    };
};

const validateField = (fieldName: string, value: string, type: string): string => {
    switch (fieldName) {
        case "phone":
            if (!value.trim()) {
                return type === "electricity"
                    ? "Meter number is required"
                    : type === "tv"
                        ? "Smart card number is required"
                        : "Phone number is required";
            }
            if (!/^\d+$/.test(value.replace(/\s/g, ""))) {
                return "Should contain only numbers";
            }
            if (value.replace(/\s/g, "").length < 6) {
                return type === "electricity"
                    ? "Meter number too short"
                    : type === "tv"
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
            if ((type === "airtime" || type === "electricity") && (!value || value.trim() === "")) {
                return "Amount is required";
            }
            if (
                (type === "airtime" || type === "electricity") &&
                (isNaN(Number(value)) || Number(value) <= 0)
            ) {
                return "Amount must be greater than 0";
            }
            if ((type === "airtime" || type === "electricity") && Number(value) > 100000) {
                return "Amount cannot exceed ₦100,000";
            }
            return "";

        case "title":
            if (!value.trim()) {
                return "Title is required";
            }
            if (value.trim().length < 3) {
                return "Title must be at least 3 characters";
            }
            if (value.trim().length > 100) {
                return "Title cannot exceed 100 characters";
            }
            return "";

        default:
            return "";
    }
};

const handleFieldValidation = (
    fieldName: string,
    value: string,
    type: string,
    setFieldErrors: Dispatch<SetStateAction<Record<string, string>>>
) => {
    const error = validateField(fieldName, value, type);
    setFieldErrors(prev => ({
        ...prev,
        [fieldName]: error,
    }));
};

export const validateForm = (formState: any, type: string): { isValid: boolean; errors: Record<string, string> } => {
    const errors: Record<string, string> = {};

    if (!formState.selectedProvider) {
        errors.provider = "Please select a service provider";
    }

    const phoneError = validateField("phone", formState.phone, type);
    if (phoneError) errors.phone = phoneError;

    const durationError = validateField("duration", formState.duration.toString(), type);
    if (durationError) errors.duration = durationError;

    if (!formState.type) {
        errors.type = "Please select a time unit";
    }

    if (!formState.selectedVariation && type !== "airtime" && type !== "electricity") {
        errors.variation = "Please select a service variation";
    }

    const amountError = validateField("amount", formState.amount, type);
    if (amountError) errors.amount = amountError;

    const titleError = validateField("title", formState.title, type);
    if (titleError) errors.title = titleError;

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
};

export function AddSchedule({ type, close }: AddScheduleProps) {
    const form = useScheduleForm(type, close);
    const { addSchedule, loading } = useSchedule();
    const { fieldErrors, setFieldErrors } = form;

    const serviceConfig = SERVICE_CONFIG[type as keyof typeof SERVICE_CONFIG] || SERVICE_CONFIG.default;

    const payload = useMemo(() => {
        const dataPayload = {
            phone: form.formState.phone,
            service_id: form.formState.selectedProvider,
            amount: form.formState.amount,
            variation_code: form.formState.selectedVariation,
            title: form.formState.title,
        };

        return {
            title: form.formState.title,
            action: type,
            interval: calculateInterval(Number(form.formState.duration), form.formState.type),
            frequency: form.formState.frequency,
            status: "running" as const,
            data: dataPayload,
        };
    }, [form.formState, type]);

    const handleSave = useCallback(async () => {
        const validation = validateForm(form.formState, type);

        if (!validation.isValid) {
            setFieldErrors(validation.errors);
            toast.error(Object.values(validation.errors)[0]);
            return;
        }

        setFieldErrors({});

        try {
            await addSchedule(payload);
            close(false);
        } catch (err) {
            console.error('Failed to add schedule:', err);
            toast.error('Failed to create schedule');
        }
    }, [form.formState, type, payload, addSchedule, close, setFieldErrors]);

    return (
        <div className="space-y-4 bg-card mt-10 p-5 rounded-2xl w-full max-w-2xl mx-auto">

            <TitleInput
                label="Title of schedule"
                value={form.formState.title}
                onChange={(value) => form.updateFormState({ title: value })}
                error={fieldErrors.title}
                onValidate={(value) => handleFieldValidation('title', value, type, setFieldErrors)}
            />

            <ProviderSelection
                type={type}
                form={form}
            />

            <FrequencySelector
                frequency={form.formState.frequency}
                onChange={(freq) => form.updateFormState({ frequency: freq })}
            />

            <PhoneInput
                label={serviceConfig.inputLabel}
                placeholder={serviceConfig.inputPlaceholder}
                value={form.formState.phone}
                onChange={(value) => form.updateFormState({ phone: value })}
                error={fieldErrors.phone}
                onValidate={(value) => handleFieldValidation('phone', value, type, setFieldErrors)}
            />

            <IntervalSelector
                form={form}
                fieldErrors={fieldErrors}
            />

            <VariationSelector
                type={type}
                form={form}
                fieldErrors={fieldErrors}
            />

            <Button
                onclick={handleSave}
                loading={loading}
                variant="submit"
                type="primary"
                text="Save"
            />
        </div>
    );
}

const ProviderSelection = ({ type, form }: { type: string; form: any }) => {
    useEffect(() => {
        const fetchProvider = async () => {
            try {
                const serviceType = getServiceType(type);
                const res = await api.get<ApiResponse>(`/bill/service?service=${serviceType}`);
                if (!res.data.error && res.data.data) {
                    form.setData({ provider: res.data.data });
                }
            } catch (err) {
                toast.error("Failed to fetch providers");
            }
        };

        fetchProvider();
    }, [type]);

    return (
        <div className="space-y-2">
            <h1 className="text-sm placeholder-text">Select Provider</h1>
            <div className="flex items-center p-1 gap-2 overflow-auto">
                {form.data.provider?.map((provider: Provider) => (
                    <ProviderCard
                        key={provider.serviceID}
                        provider={provider}
                        isSelected={form.formState.selectedProvider === provider.serviceID}
                        onSelect={() => {
                            form.updateFormState({ selectedProvider: provider.serviceID });
                            form.setFieldErrors((prev: any) => ({ ...prev, provider: "" }));
                        }}
                        type={type.toUpperCase()}
                        hasError={!!form.fieldErrors.provider}
                    />
                ))}
            </div>
            {form.fieldErrors.provider && (
                <div className="text-red-500 text-xs mt-1">{form.fieldErrors.provider}</div>
            )}
        </div>
    );
};

const ProviderCard = ({
    provider,
    isSelected,
    onSelect,
    type,
    hasError
}: {
    provider: Provider;
    isSelected: boolean;
    onSelect: () => void;
    type: string;
    hasError: boolean;
}) => {
    console.log(type)
    const imagePath = ["electricity", "tv"].includes(type.toLowerCase().trim()) ? `/img/${provider.serviceID?.toLowerCase().trim()}.png`
        : `/img/${fixName(provider.name?.toLowerCase().trim())}.png`;

    return (
        <button
            onClick={onSelect}
            className={`w-25 h-30 relative overflow-hidden flex-none rounded-xl flex flex-col transition-all ${isSelected ? "primary-purple-to-blue ring-2 ring-blue-500" : "opacity-60 hover:opacity-100"
                } ${hasError ? "border border-red-500" : ""}`}
        >
            <div className={`w-full h-full absolute top-0 right-0 ${isSelected ? "z-0" : "z-20 bg-black/50"}`} />
            <div className="w-25 h-25 rounded-xl overflow-hidden relative">
                <Image
                    src={imagePath}
                    alt={provider.name}
                    fill
                    className="object-cover"
                    sizes="100px"
                />
            </div>
            <span className="text-xs mt-1 text-center p-2 uppercase truncate">{cleanServiceName(provider.name)}</span>
        </button>
    );
};

const getServiceType = (type: string): string => {
    switch (type) {
        case "tv": return "tv-subscription";
        case "electricity": return "electricity-bill";
        default: return type;
    }
};

const fixName = (name: string): string => {
    const names = ["data", "payment", "internet", "sme", "(", ")", "airtime", "vtu"];
    let result = name.toLowerCase();
    names.forEach(item => {
        result = result.replace(item, "");
    });
    return result.trim();
};

const FrequencySelector = ({
    frequency,
    onChange
}: {
    frequency: string;
    onChange: (freq: "once" | "repeat") => void;
}) => (
    <div className="flex w-full my-6 items-center justify-between">
        <h5 className="text-sm placeholder-text">Frequency</h5>
        <div className="w-fit gap-2 flex p-1 rounded-sm bg-background">
            {(["repeat", "once"] as const).map((freq) => (
                <button
                    key={freq}
                    onClick={() => onChange(freq)}
                    className={`rounded-sm px-2 py-0.5 text-sm transition-colors ${frequency === freq ? "primary-purple-to-blue" : "bg-card hover:bg-card/80"
                        }`}
                >
                    {freq.charAt(0).toUpperCase() + freq.slice(1)}
                </button>
            ))}
        </div>
    </div>
);

const PhoneInput = ({
    label,
    placeholder,
    value,
    onChange,
    error,
    onValidate
}: {
    label: string;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    onValidate: (value: string) => void;
}) => (
    <div className="space-y-2">
        <h5 className="text-sm placeholder-text">{label}</h5>
        <div className="w-full rounded-2xl bg-background">
            <input
                type="text"
                value={value}
                placeholder={placeholder}
                onChange={(e) => {
                    onChange(e.target.value);
                    onValidate(e.target.value);
                }}
                className={`py-4 w-full outline-none border-none text-sm px-4 gradiant-text-purple-to-blue bg-transparent ${error ? "border border-red-500 rounded-2xl" : ""
                    }`}
            />
        </div>
        {error && <div className="text-red-500 text-xs mt-1 px-2">{error}</div>}
    </div>
);

const IntervalSelector = ({ form, fieldErrors }: { form: any; fieldErrors: any }) => (
    <>
        <h1 className="text-sm placeholder-text">Select Interval</h1>
        <div className="relative w-full gap-3 grid grid-cols-2">
            <div className="bg-background rounded-2xl">
                <input
                    value={form.formState.duration}
                    onChange={(e) => {
                        form.updateFormState({ duration: e.target.value });
                        handleFieldValidation('duration', e.target.value, form.type, form.setFieldErrors);
                    }}
                    type="number"
                    placeholder="Enter duration"
                    className={`w-full h-full text-sm px-4 outline-none rounded-2xl bg-transparent ${fieldErrors.duration ? "border border-red-500" : ""
                        }`}
                />
            </div>
            <Dropdown
                value={form.formState.type}
                options={TIME_UNITS}
                isOpen={form.uiState.toggle}
                onToggle={() => form.updateUiState({ toggle: !form.uiState.toggle })}
                onSelect={(value) => {
                    form.updateFormState({ type: value });
                    form.updateUiState({ toggle: false });
                    form.setFieldErrors((prev: any) => ({ ...prev, type: "" }));
                }}
                error={fieldErrors.type}
            />
        </div>
    </>
);

const VariationSelector = ({ type, form, fieldErrors }: { type: string; form: any; fieldErrors: any }) => {
    useEffect(() => {
        if (!form.formState.selectedProvider) return;

        const fetchVariation = async () => {
            try {
                const res = await api.get<ApiResponse>(
                    `/bill/service-variations?service_id=${form.formState.selectedProvider}`
                );
                if (!res.data.error && res.data.data) {
                    form.setData({ variation: res.data.data.variations });
                }
            } catch (err) {
                toast.error("Failed to fetch variations");
            }
        };

        fetchVariation();
    }, [form.formState.selectedProvider]);

    if (type === "airtime" || type === "electricity") {
        return (
            <div className="space-y-2">
                {type === "electricity" && (
                    <Dropdown
                        value={form.formState.selectedVariationName || ""}
                        options={form.data.variation.map((v: Variation) => v.name)}
                        isOpen={form.uiState.toggleVariation}
                        onToggle={() => form.updateUiState({ toggleVariation: !form.uiState.toggleVariation })}
                        onSelect={(value, index) => {
                            const variation = form.data.variation[index];
                            form.updateFormState({
                                selectedVariation: variation.variation_code,
                                selectedVariationName: variation.name
                            });
                            form.updateUiState({ toggleVariation: false });
                            form.setFieldErrors((prev: any) => ({ ...prev, variation: "" }));
                        }}
                        error={fieldErrors.variation}
                        placeholder="Select variation"
                    />
                )}
                <AmountInput
                    value={form.formState.amount}
                    onChange={(value) => {
                        form.updateFormState({ amount: value });
                        handleFieldValidation('amount', value, type, form.setFieldErrors);
                    }}
                    error={fieldErrors.amount}
                />
            </div>
        );
    }

    return (
        <Dropdown
            value={form.formState.selectedVariationName || ""}
            options={form.data.variation.map((v: Variation) => v.name)}
            isOpen={form.uiState.toggleVariation}
            onToggle={() => form.updateUiState({ toggleVariation: !form.uiState.toggleVariation })}
            onSelect={(value, index) => {
                const variation = form.data.variation[index];
                form.updateFormState({
                    selectedVariation: variation.variation_code,
                    selectedVariationName: variation.name
                });
                form.updateUiState({ toggleVariation: false });
            }}
            placeholder="Select variation"
        />
    );
};

const Dropdown = ({
    value,
    options,
    isOpen,
    onToggle,
    onSelect,
    error,
    placeholder = "Select"
}: {
    value: string;
    options: readonly string[] | string[];
    isOpen: boolean;
    onToggle: () => void;
    onSelect: (value: string, index: number) => void;
    error?: string;
    placeholder?: string;
}) => (
    <div className="w-full relative">
        <button
            onClick={onToggle}
            className={`bg-background justify-between w-full p-5 rounded-2xl flex gap-5 transition-colors ${error ? "border border-red-500" : "hover:bg-background/80"
                }`}
        >
            <span className="text-sm gradient-text-purple-to-blue truncate">
                {value || placeholder}
            </span>
            <ChevronDown
                color="blue"
                size={20}
                className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
            />
        </button>
        {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
        {isOpen && (
            <div className="grid w-full z-20 max-h-70 bg-background absolute top-full mt-1 p-3 rounded-2xl overflow-auto shadow-lg border border-gray-700">
                {options.map((option, index) => (
                    <button
                        key={option}
                        onClick={() => onSelect(option, index)}
                        className="flex w-full gap-3 py-2 px-3 justify-between items-center hover:bg-card rounded-lg transition-colors text-sm"
                    >
                        <span>{option}</span>
                    </button>
                ))}
            </div>
        )}
    </div>
);

const AmountInput = ({ value, onChange, error }: {
    value: string;
    onChange: (value: string) => void;
    error?: string;
}) => (
    <div className="w-full bg-background p-2 rounded-2xl">
        <AmountGrid
            presetAmounts={PRESET_AMOUNTS}
            value={value}
            onChange={(val: number | string) => onChange(String(val))}
        />
        {error && <div className="text-red-500 text-xs mt-1 px-2">{error}</div>}
    </div>
);

const TitleInput = ({ label, value, onChange, error, onValidate }: {
    label?: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    onValidate: (value: string) => void;
}) => (
    <div className="w-full flex flex-col space-y-1">
        <h5 className="text-sm placeholder-text">{label}</h5>
        <div className="w-full rounded-2xl bg-background">
            <input
                type="text"
                value={value}
                onChange={(e) => {
                    onChange(e.target.value);
                    onValidate(e.target.value);
                }}
                className={`py-5 w-full outline-none border-none text-sm px-5 gradiant-text-purple-to-blue bg-transparent ${error ? "border border-red-500 rounded-2xl" : ""
                    }`}
                placeholder="Title"
            />
        </div>
        {error && <div className="text-red-500 text-xs mt-1 px-2">{error}</div>}
    </div>
);