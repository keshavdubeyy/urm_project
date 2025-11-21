"use client";

import React, { useState, useEffect, useRef } from "react";

interface TimerProps {
  duration: number; // in seconds
  onComplete: () => void;
  isActive: boolean;
}

export default function Timer({ duration, onComplete, isActive }: TimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const startTimeRef = useRef<number | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const lastTickRef = useRef<number>(-1);

  // Create audio context for tick sounds
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Play tick sound
  const playTick = () => {
    if (!audioContextRef.current) return;
    
    const context = audioContextRef.current;
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    
    oscillator.frequency.value = 800; // Tick frequency
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.1);
    
    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + 0.1);
  };

  useEffect(() => {
    if (!isActive) {
      startTimeRef.current = null;
      lastTickRef.current = -1;
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      return;
    }

    // Record the exact start time
    if (startTimeRef.current === null) {
      startTimeRef.current = Date.now();
    }

    const animate = () => {
      if (!startTimeRef.current) return;

      const elapsed = (Date.now() - startTimeRef.current) / 1000; // seconds elapsed
      const remaining = Math.max(0, duration - elapsed);

      setTimeRemaining(Math.ceil(remaining));

      // Play tick sound when 20 seconds or less remain
      const currentSecond = Math.floor(remaining);
      if (currentSecond <= 20 && currentSecond > 0 && currentSecond !== lastTickRef.current) {
        playTick();
        lastTickRef.current = currentSecond;
      }

      if (remaining <= 0) {
        onComplete();
        if (rafIdRef.current) {
          cancelAnimationFrame(rafIdRef.current);
        }
      } else {
        rafIdRef.current = requestAnimationFrame(animate);
      }
    };

    rafIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [isActive, duration, onComplete]);

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
      {timeRemaining <= 20 && timeRemaining > 0 && (
        <div className="text-xs text-red-600 mt-2 font-medium animate-pulse">
          🔔 Tick sounds active
        </div>
      )}
    </div>
  );
}
