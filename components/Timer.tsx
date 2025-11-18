"use client";

import React, { useState, useEffect } from "react";

interface TimerProps {
  duration: number; // in seconds
  onComplete: () => void;
  isActive: boolean;
}

export default function Timer({ duration, onComplete, isActive }: TimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(duration);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, onComplete]);

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  const isLowTime = timeRemaining <= 30;

  return (
    <div
      className={`apple-card text-center py-6 px-8 ${
        isLowTime
          ? "bg-red-50 border-red-400"
          : "bg-apple-blue bg-opacity-5 border-apple-blue"
      }`}
    >
      <div className="apple-label text-apple-gray-700 mb-2">
        Time Remaining
      </div>
      <div
        className={`text-5xl font-bold tabular-nums tracking-tight ${
          isLowTime ? "text-red-600" : "text-apple-blue"
        }`}
      >
        {minutes}:{seconds.toString().padStart(2, "0")}
      </div>
    </div>
  );
}
