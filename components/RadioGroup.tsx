"use client";

import React from "react";

interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupProps {
  label: string;
  name: string;
  options: RadioOption[];
  value: string | undefined;
  onChange: (value: string) => void;
  required?: boolean;
}

export default function RadioGroup({
  label,
  name,
  options,
  value,
  onChange,
  required = false,
}: RadioGroupProps) {
  return (
    <div className="space-y-3">
      <label className="apple-label">
        {label}
        {required && <span className="text-apple-red ml-1.5 text-base">*</span>}
      </label>
      
      <div className="space-y-3">
        {options.map((option) => (
          <label
            key={option.value}
            className={value === option.value ? "apple-radio-card-selected" : "apple-radio-card"}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              className="apple-radio"
              required={required}
            />
            <span className="text-base text-apple-gray-900 font-medium select-none">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
