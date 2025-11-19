"use client";

import { useEffect, useMemo } from "react";
import { useSurvey } from "@/context/SurveyContext";

export default function ThankYouPage() {
  const { survey, markStudyEnded } = useSurvey();

  useEffect(() => {
    // Mark the study as ended when this page loads
    markStudyEnded();
  }, [markStudyEnded]);

  // Calculate AI Dependency Score from diaPost
  const aiDependencyScore = useMemo(() => {
    const { diaPost } = survey;
    if (!diaPost) return null;

    const scores = [
      diaPost.unprotected,
      diaPost.leftBehind,
      diaPost.stayUpdated,
      diaPost.needValidation,
      diaPost.fearReplacement
    ];

    // Check if all scores are available
    if (scores.some(score => score === undefined || score === null)) {
      return null;
    }

    const rawScore = scores.reduce((sum: number, score) => sum + (score || 0), 0);
    const normalizedScore = ((rawScore - 5) / 20) * 100;

    let category = '';
    let message = '';

    if (rawScore >= 5 && rawScore <= 12) {
      category = 'Low';
      message = 'You rely lightly on AI, you work independently.';
    } else if (rawScore >= 13 && rawScore <= 18) {
      category = 'Moderate';
      message = 'You use AI as support, but still keep control.';
    } else if (rawScore >= 19 && rawScore <= 25) {
      category = 'High';
      message = 'AI strongly influences your workflow—useful but worth balancing.';
    }

    return { rawScore, normalizedScore, category, message };
  }, [survey]);

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

          {/* AI Dependency Score */}
          {aiDependencyScore && (
            <div className="border-t border-apple-gray-200 pt-8">
              <div className="apple-card bg-apple-blue bg-opacity-5 p-6 space-y-4 text-left">
                <h3 className="apple-heading-4 text-apple-blue text-center">
                  Your AI Dependency Score
                </h3>
                
                <div className="flex justify-center items-center gap-6 flex-wrap">
                  <div className="text-center">
                    <p className="apple-caption text-apple-gray-600 mb-1">Raw Score</p>
                    <p className="text-4xl font-bold text-apple-blue">{aiDependencyScore.rawScore}/25</p>
                  </div>
                  <div className="text-center">
                    <p className="apple-caption text-apple-gray-600 mb-1">Normalized Score</p>
                    <p className="text-4xl font-bold text-apple-blue">{Math.round(aiDependencyScore.normalizedScore)}/100</p>
                  </div>
                </div>

                <div className="apple-card bg-white p-4 text-center">
                  <p className="apple-label text-apple-blue mb-2">
                    {aiDependencyScore.category} Dependency
                  </p>
                  <p className="apple-body text-apple-gray-700">
                    {aiDependencyScore.message}
                  </p>
                </div>

                <div className="mt-4">
                  <div className="flex justify-between mb-2 text-xs text-apple-gray-600">
                    <span>Low (5-12)</span>
                    <span>Moderate (13-18)</span>
                    <span>High (19-25)</span>
                  </div>
                  <div className="h-3 bg-apple-gray-200 rounded-full relative overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-full transition-all duration-500"
                      style={{ width: `${aiDependencyScore.normalizedScore}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

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
