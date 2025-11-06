"use client";
import React, { memo } from "react";

interface ProviderSelectProps {
    providers: { id: string; name: string; logo?: string }[];
    selectedProvider?: string;
    onSelect: (id: string) => void;
}

const ProviderSelectComponent: React.FC<ProviderSelectProps> = ({
    providers,
    selectedProvider,
    onSelect,
}) => {
    return (
        <div className="grid grid-cols-3 gap-4">
            {providers.map((provider) => (
                <button
                    key={provider.id}
                    onClick={() => onSelect(provider.id)}
                    className={`p-3 flex flex-col items-center justify-center rounded-xl border transition-all ${selectedProvider === provider.id
                            ? "border-purple-500 bg-purple-50 dark:bg-purple-950"
                            : "border-transparent hover:border-purple-400"
                        }`}
                >
                    {provider.logo ? (
                        <img
                            src={provider.logo}
                            alt={provider.name}
                            className="w-8 h-8 object-contain mb-1"
                        />
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-indigo-500" />
                    )}
                    <span className="text-sm font-medium">{provider.name}</span>
                </button>
            ))}
        </div>
    );
};

export const ProviderSelect = memo(ProviderSelectComponent);
