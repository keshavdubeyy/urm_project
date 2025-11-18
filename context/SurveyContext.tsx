"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { SurveyResponse, getEmptySurveyResponse } from "@/types/survey";

interface SurveyContextType {
  survey: SurveyResponse;
  setSurvey: (updater: SurveyResponse | ((prev: SurveyResponse) => SurveyResponse)) => void;
  markStudyStarted: () => void;
  markStudyEnded: () => void;
}

const SurveyContext = createContext<SurveyContextType | undefined>(undefined);

export function SurveyProvider({ children }: { children: React.ReactNode }) {
  const [survey, setSurveyState] = useState<SurveyResponse>(() => getEmptySurveyResponse());

  const setSurvey = useCallback((updater: SurveyResponse | ((prev: SurveyResponse) => SurveyResponse)) => {
    if (typeof updater === "function") {
      setSurveyState(updater);
    } else {
      setSurveyState(updater);
    }
  }, []);

  const markStudyStarted = useCallback(() => {
    setSurveyState((prev) => {
      if (prev.startTimestamp) {
        return prev; // Already started
      }
      return {
        ...prev,
        startTimestamp: new Date().toISOString(),
      };
    });
  }, []);

  const markStudyEnded = useCallback(() => {
    setSurveyState((prev) => {
      const endTimestamp = new Date().toISOString();
      let durationSeconds: number | undefined;

      if (prev.startTimestamp) {
        const start = new Date(prev.startTimestamp);
        const end = new Date(endTimestamp);
        durationSeconds = Math.floor((end.getTime() - start.getTime()) / 1000);
      }

      return {
        ...prev,
        endTimestamp,
        durationSeconds,
      };
    });
  }, []);

  return (
    <SurveyContext.Provider value={{ survey, setSurvey, markStudyStarted, markStudyEnded }}>
      {children}
    </SurveyContext.Provider>
  );
}

export function useSurvey() {
  const context = useContext(SurveyContext);
  if (context === undefined) {
    throw new Error("useSurvey must be used within a SurveyProvider");
  }
  return context;
}
