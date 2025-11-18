"use client";

import React from "react";

interface TextInputProps {
  label: string;
  name: string;
  value: string | number | undefined;
  onChange: (value: string) => void;
  type?: "text" | "number" | "email";
  placeholder?: string;
  required?: boolean;
  min?: number;
  max?: number;
}

export default function TextInput({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
  min,
  max,
}: TextInputProps) {
  return (
    <div className="space-y-2.5">
      <label htmlFor={name} className="apple-label">
        {label}
        {required && <span className="text-apple-red ml-1.5 text-base">*</span>}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        min={min}
        max={max}
        className="apple-input"
      />
    </div>
  );
}
