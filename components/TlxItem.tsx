"use client";

import React, { useState } from "react";

interface TlxItemProps {
  label: string;
  value: number | undefined;
  onChange: (value: number) => void;
  required?: boolean;
}

export default function TlxItem({
  label,
  value,
  onChange,
  required = false,
}: TlxItemProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [showValue, setShowValue] = useState(false);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseInt(e.target.value));
  };

  const handleMouseDown = () => {
    setIsDragging(true);
    setShowValue(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setTimeout(() => setShowValue(false), 1000);
  };

  const handleFocus = () => setShowValue(true);
  const handleBlur = () => setTimeout(() => setShowValue(false), 500);

  const percentage = value ? ((value - 1) / 20) * 100 : 0;

  return (
    <div className="space-y-6">
      <label className="apple-label">
        {label}
        {required && <span className="text-apple-red ml-1.5 text-base">*</span>}
      </label>
      
      <div className="px-2">
        {/* Value Display */}
        <div className="flex justify-center mb-4 relative">
          <div 
            className={`transition-all duration-300 ease-out ${
              showValue || value 
                ? 'opacity-100 scale-100 transform translate-y-0' 
                : 'opacity-0 scale-90 transform translate-y-2'
            }`}
          >
            <div className="apple-card bg-apple-blue text-white px-6 py-3 inline-flex items-center justify-center min-w-[80px] shadow-apple-md">
              <span className="text-2xl font-bold tabular-nums">
                {value || '—'}
              </span>
            </div>
          </div>
        </div>

        {/* Slider Container */}
        <div className="relative">
          {/* Labels */}
          <div className="flex justify-between mb-3">
            <span className="apple-caption text-apple-gray-600 font-semibold">Low</span>
            <span className="apple-caption text-apple-gray-600 font-semibold">High</span>
          </div>

          {/* Custom Slider */}
          <div className="relative">
            {/* Track */}
            <div className="h-3 bg-apple-gray-200 rounded-full relative overflow-hidden">
              {/* Progress Fill */}
              <div 
                className="h-full bg-gradient-to-r from-apple-blue to-apple-blue-light rounded-full transition-all duration-300 ease-out"
                style={{ width: `${percentage}%` }}
              />
              
              {/* Tick Marks */}
              <div className="absolute inset-0 flex justify-between items-center px-1">
                {[...Array(5)].map((_, i) => (
                  <div 
                    key={i}
                    className="w-0.5 h-2 bg-white bg-opacity-60 rounded-full"
                  />
                ))}
              </div>
            </div>

            {/* Native Slider (invisible but functional) */}
            <input
              type="range"
              min={1}
              max={21}
              step={1}
              value={value || 1}
              onChange={handleSliderChange}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onFocus={handleFocus}
              onBlur={handleBlur}
              required={required}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />

            {/* Thumb */}
            <div 
              className={`absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-7 h-7 bg-white border-3 border-apple-blue rounded-full shadow-apple-md transition-all duration-200 pointer-events-none ${
                isDragging ? 'scale-125 shadow-apple-lg' : 'hover:scale-110'
              }`}
              style={{ left: `${percentage}%` }}
            >
              <div className="w-full h-full bg-apple-blue bg-opacity-20 rounded-full" />
            </div>
          </div>

          {/* Scale Numbers */}
          <div className="flex justify-between mt-3 px-1">
            <span className="apple-caption text-apple-gray-500 font-medium">1</span>
            <span className="apple-caption text-apple-gray-500 font-medium">5</span>
            <span className="apple-caption text-apple-gray-500 font-medium">10</span>
            <span className="apple-caption text-apple-gray-500 font-medium">15</span>
            <span className="apple-caption text-apple-gray-500 font-medium">21</span>
          </div>
        </div>
      </div>
    </div>
  );
}
