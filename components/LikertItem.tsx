"use client";

import React from "react";

interface LikertItemProps {
  label: string;
  minLabel: string;
  maxLabel: string;
  value: number | undefined;
  onChange: (value: number) => void;
  scaleMin?: number;
  scaleMax?: number;
  required?: boolean;
}

export default function LikertItem({
  label,
  minLabel,
  maxLabel,
  value,
  onChange,
  scaleMin = 1,
  scaleMax = 5,
  required = false,
}: LikertItemProps) {
  const scaleValues = Array.from(
    { length: scaleMax - scaleMin + 1 },
    (_, i) => scaleMin + i
  );

  return (
    <div className="space-y-6">
      <label className="apple-label">
        {label}
        {required && <span className="text-apple-red ml-1.5 text-base">*</span>}
      </label>
      
      <div className="px-2">
        {/* Labels */}
        <div className="flex justify-between mb-6">
          <span className="apple-caption text-apple-gray-600 font-semibold text-center max-w-[100px]">
            {minLabel}
          </span>
          <span className="apple-caption text-apple-gray-600 font-semibold text-center max-w-[100px]">
            {maxLabel}
          </span>
        </div>
        
        {/* Scale Options */}
        <div className="flex justify-center">
          <div className="flex gap-4 sm:gap-6 md:gap-8 items-center">
            {scaleValues.map((val) => (
              <label
                key={val}
                className="flex flex-col items-center cursor-pointer group relative"
              >
                <input
                  type="radio"
                  name={`likert-${label}`}
                  value={val}
                  checked={value === val}
                  onChange={() => onChange(val)}
                  className="sr-only"
                  required={required}
                />
                
                {/* Circular Button */}
                <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center font-bold text-lg sm:text-xl transition-all duration-300 ease-out border-3 ${
                  value === val
                    ? 'bg-apple-blue border-apple-blue text-white shadow-apple-md scale-110 transform'
                    : 'bg-white border-apple-gray-300 text-apple-gray-700 hover:border-apple-blue hover:bg-apple-blue hover:bg-opacity-5 hover:scale-105 active:scale-95 shadow-apple-sm'
                }`}>
                  {val}
                </div>
                
                {/* Selection Indicator */}
                {value === val && (
                  <div className="absolute -bottom-3 w-2 h-2 bg-apple-blue rounded-full animate-scale-in" />
                )}
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
