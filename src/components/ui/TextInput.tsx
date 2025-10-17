"use client";

import React from "react";

interface TextInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    type?: string;
    className?: string;
}

const TextInput: React.FC<TextInputProps> = ({
    value,
    onChange,
    placeholder = "",
    type = "text",
    className = "",
}) => {
    return (
        <div
            className={`w-full flex bg-card rounded-3xl p-4`}>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={`placeholder:placeholder-text bg-card rounded-3xl text-md font-medium px-2 select-none appearance-none outline-none border-none w-full ${className}`}
            />
        </div>
    );
};

export default TextInput;
