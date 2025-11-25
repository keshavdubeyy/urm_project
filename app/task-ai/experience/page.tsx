"use client";

import { useState } from "react";
import StepLayout from "@/components/StepLayout";
import TlxItem from "@/components/TlxItem";
import LikertItem from "@/components/LikertItem";
import TextInput from "@/components/TextInput";
import { useSurvey } from "@/context/SurveyContext";
import { getTaskNavigation, getTaskDetails } from "@/lib/experimentalDesign";

export default function TaskAIExperiencePage() {
  const { survey, setSurvey } = useSurvey();
  const [ideasError, setIdeasError] = useState<string | null>(null);

  // Task 2 is always AI (fixed order)
  const condition = survey.experimentalCondition;
  const taskNumber = "2";
  const currentStep = 6;

  // After Task 2 (AI), always go to post-study
  const getNextHref = () => {
    return "/post-study";
  };

  const handleNext = () => {
    // Validate all TLX items are filled
    if (
      !survey.taskAI.tlx?.mental ||
      !survey.taskAI.tlx?.physical ||
      !survey.taskAI.tlx?.temporal ||
      !survey.taskAI.tlx?.performance ||
      !survey.taskAI.tlx?.effort ||
      !survey.taskAI.tlx?.frustration
    ) {
      alert('Please complete all workload assessment ratings before continuing.');
      return false;
    }
    
    // Validate all experience items are filled
    if (
      !survey.taskAI.experience?.confident ||
      !survey.taskAI.experience?.creative ||
      !survey.taskAI.experience?.satisfied ||
      !survey.taskAI.experience?.helpful ||
      !survey.taskAI.experience?.feltDependent
    ) {
      alert('Please complete all experience ratings before continuing.');
      return false;
    }
    
    // Validate ideasFromAI is filled and in range
    if (survey.taskAI.ideasFromAI === undefined || survey.taskAI.ideasFromAI === null) {
      alert('Please enter the number of ideas you took from AI.');
      return false;
    }
    
    if (survey.taskAI.ideasFromAI < 0 || survey.taskAI.ideasFromAI > 50) {
      alert('Number of ideas must be between 0 and 50.');
      return false;
    }
    
    return true;
  };

  return (
    <StepLayout
      currentStep={currentStep}
      totalSteps={7}
      stepTitle={`Task ${taskNumber} — Evaluation`}
      nextHref={getNextHref()}
      backHref="/task-ai/activity"
      onNext={handleNext}
    >
      <div className="space-y-8">
        {/* Ideas from AI Section */}
        <div className="apple-card bg-apple-gray-50 p-8 space-y-6">
          <div>
            <h3 className="apple-heading-4 mb-3">
              Ideas from AI
            </h3>
            <p className="apple-caption mb-6">
              How many of the ideas you submitted were taken directly from the AI suggestions?
            </p>
          </div>

          <TextInput
            label="Number of ideas from AI (0-50)"
            type="number"
            min={0}
            max={50}
            placeholder="Enter a number between 0 and 50"
            value={survey.taskAI.ideasFromAI?.toString() || ""}
            onChange={(value) => {
              const numValue = value === "" ? undefined : parseInt(value, 10);
              if (numValue !== undefined && (isNaN(numValue) || numValue < 0 || numValue > 50)) {
                setIdeasError("Please enter a number between 0 and 50");
              } else {
                setIdeasError(null);
                setSurvey((prev) => ({
                  ...prev,
                  taskAI: { ...prev.taskAI, ideasFromAI: numValue },
                }));
              }
            }}
            error={ideasError}
            required
          />
        </div>

        {/* Workload Assessment Section */}
        <div className="apple-card bg-apple-gray-50 p-8 space-y-6">
          <div>
            <h3 className="apple-heading-4 mb-3">
              Workload Assessment
            </h3>
            <p className="apple-caption mb-6">
              Please rate the following aspects of the task you just completed.
            </p>
          </div>

          <div className="space-y-6">
            <TlxItem
              label="How mentally demanding was the task?"
              value={survey.taskAI.tlx?.mental}
              onChange={(value) =>
                setSurvey((prev) => ({
                  ...prev,
                  taskAI: {
                    ...prev.taskAI,
                    tlx: { ...prev.taskAI.tlx, mental: value },
                  },
                }))
              }
              required
            />

            <TlxItem
              label="How physically demanding was the task?"
              value={survey.taskAI.tlx?.physical}
              onChange={(value) =>
                setSurvey((prev) => ({
                  ...prev,
                  taskAI: {
                    ...prev.taskAI,
                    tlx: { ...prev.taskAI.tlx, physical: value },
                  },
                }))
              }
              required
            />

            <TlxItem
              label="How hurried or rushed was the pace of the task?"
              value={survey.taskAI.tlx?.temporal}
              onChange={(value) =>
                setSurvey((prev) => ({
                  ...prev,
                  taskAI: {
                    ...prev.taskAI,
                    tlx: { ...prev.taskAI.tlx, temporal: value },
                  },
                }))
              }
              required
            />

            <TlxItem
              label="How successful were you in accomplishing what you were asked to do?"
              value={survey.taskAI.tlx?.performance}
              onChange={(value) =>
                setSurvey((prev) => ({
                  ...prev,
                  taskAI: {
                    ...prev.taskAI,
                    tlx: { ...prev.taskAI.tlx, performance: value },
                  },
                }))
              }
              required
            />

            <TlxItem
              label="How hard did you have to work to accomplish your level of performance?"
              value={survey.taskAI.tlx?.effort}
              onChange={(value) =>
                setSurvey((prev) => ({
                  ...prev,
                  taskAI: {
                    ...prev.taskAI,
                    tlx: { ...prev.taskAI.tlx, effort: value },
                  },
                }))
              }
              required
            />

            <TlxItem
              label="How insecure, discouraged, irritated, stressed, and annoyed were you?"
              value={survey.taskAI.tlx?.frustration}
              onChange={(value) =>
                setSurvey((prev) => ({
                  ...prev,
                  taskAI: {
                    ...prev.taskAI,
                    tlx: { ...prev.taskAI.tlx, frustration: value },
                  },
                }))
              }
              required
            />
          </div>
        </div>

        {/* Task Experience Section */}
        <div className="apple-card bg-apple-gray-50 p-8 space-y-6">
          <div>
            <h3 className="apple-heading-4 mb-3">
              Your Experience During the Task
            </h3>
            <p className="apple-caption mb-6">
              Please rate how you felt during this task.
            </p>
          </div>

          <div className="space-y-6">
            <LikertItem
              label="I felt confident in my problem-solving ability."
              minLabel="Strongly Disagree"
              maxLabel="Strongly Agree"
              value={survey.taskAI.experience?.confident}
              onChange={(value) =>
                setSurvey((prev) => ({
                  ...prev,
                  taskAI: {
                    ...prev.taskAI,
                    experience: { ...prev.taskAI.experience, confident: value },
                  },
                }))
              }
              required
            />

            <LikertItem
              label="I felt creative during the task."
              minLabel="Strongly Disagree"
              maxLabel="Strongly Agree"
              value={survey.taskAI.experience?.creative}
              onChange={(value) =>
                setSurvey((prev) => ({
                  ...prev,
                  taskAI: {
                    ...prev.taskAI,
                    experience: { ...prev.taskAI.experience, creative: value },
                  },
                }))
              }
              required
            />

            <LikertItem
              label="I was satisfied with my performance on the task."
              minLabel="Strongly Disagree"
              maxLabel="Strongly Agree"
              value={survey.taskAI.experience?.satisfied}
              onChange={(value) =>
                setSurvey((prev) => ({
                  ...prev,
                  taskAI: {
                    ...prev.taskAI,
                    experience: { ...prev.taskAI.experience, satisfied: value },
                  },
                }))
              }
              required
            />

            <LikertItem
              label="The AI tool was helpful in generating ideas."
              minLabel="Strongly Disagree"
              maxLabel="Strongly Agree"
              value={survey.taskAI.experience?.helpful}
              onChange={(value) =>
                setSurvey((prev) => ({
                  ...prev,
                  taskAI: {
                    ...prev.taskAI,
                    experience: { ...prev.taskAI.experience, helpful: value },
                  },
                }))
              }
              required
            />

            <LikertItem
              label="I felt dependent on the AI while completing the task."
              minLabel="Strongly Disagree"
              maxLabel="Strongly Agree"
              value={survey.taskAI.experience?.feltDependent}
              onChange={(value) =>
                setSurvey((prev) => ({
                  ...prev,
                  taskAI: {
                    ...prev.taskAI,
                    experience: { ...prev.taskAI.experience, feltDependent: value },
                  },
                }))
              }
              required
            />
          </div>
        </div>
      </div>
    </StepLayout>
  );
}