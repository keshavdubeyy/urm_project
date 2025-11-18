"use client";

import { useEffect } from "react";
import { useSurvey } from "@/context/SurveyContext";

export default function ThankYouPage() {
  const { survey, markStudyEnded } = useSurvey();

  useEffect(() => {
    // Mark the study as ended when this page loads
    markStudyEnded();
  }, [markStudyEnded]);

  return (
    <div className="min-h-screen bg-apple-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
        <div className="apple-card p-8 sm:p-10 lg:p-12 text-center space-y-8">
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="rounded-full bg-green-100 p-4">
                <svg
                  className="h-16 w-16 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            
            <h2 className="apple-heading-2">
              Thank You for Your Participation!
            </h2>
            <p className="apple-body text-lg max-w-2xl mx-auto">
              Your responses have been recorded successfully. We sincerely appreciate the time 
              and effort you put into completing this study.
            </p>
          </div>

          <div className="border-t border-apple-gray-200 pt-8">
            <div className="apple-success-banner text-left">
              <p className="apple-caption text-green-800 font-semibold mb-3">
                ✓ Study Completed Successfully
              </p>
              <p className="apple-body text-green-700">
                Your valuable insights will help advance our understanding of how people interact 
                with AI tools in academic settings. This research contributes to improving 
                educational technologies and learning experiences.
              </p>
            </div>
          </div>

          <div className="apple-caption text-apple-gray-600 space-y-2 pt-6 border-t border-apple-gray-200">
            <p className="apple-label text-apple-gray-900">Study Summary:</p>
            <div className="space-y-1">
              <p>Response ID: <span className="font-mono text-xs">{survey.responseId}</span></p>
              <p>Started: {survey.startTimestamp ? new Date(survey.startTimestamp).toLocaleString() : "N/A"}</p>
              <p>Completed: {survey.endTimestamp ? new Date(survey.endTimestamp).toLocaleString() : "N/A"}</p>
              <p>Duration: {survey.durationSeconds ? `${Math.floor(survey.durationSeconds / 60)} minutes ${survey.durationSeconds % 60} seconds` : "N/A"}</p>
            </div>
          </div>

          <div className="border-t border-apple-gray-200 pt-6">
            <p className="apple-caption">
              If you have any questions about this study or would like to know more about 
              the research findings, please contact the research team.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
