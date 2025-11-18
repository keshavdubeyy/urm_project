"use client";

import React from "react";

interface TextAreaProps {
  label: string;
  name: string;
  value: string | undefined;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  rows?: number;
}

export default function TextArea({
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  rows = 4,
}: TextAreaProps) {
  return (
    <div className="space-y-2.5">
      <label htmlFor={name} className="apple-label">
        {label}
        {required && <span className="text-apple-red ml-1.5 text-base">*</span>}
      </label>
      <textarea
        id={name}
        name={name}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        rows={rows}
        className="apple-textarea"
      />
    </div>
  );
}
