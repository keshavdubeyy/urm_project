"use client";

import StepLayout from "@/components/StepLayout";
import TlxItem from "@/components/TlxItem";
import LikertItem from "@/components/LikertItem";
import { useSurvey } from "@/context/SurveyContext";
import { getTaskNavigation, getTaskDetails } from "@/lib/experimentalDesign";

export default function TaskNoAIExperiencePage() {
  const { survey, setSurvey } = useSurvey();

  // Task 1 is always No-AI (fixed order)
  const condition = survey.experimentalCondition;
  const taskNumber = "1";
  const currentStep = 4;

  // After Task 1 (No-AI), always go to Task 2 (AI)
  const getNextHref = () => {
    return "/task-ai";
  };

  const handleNext = () => {
    // Validate all TLX items are filled
    if (
      !survey.taskNoAI.tlx?.mental ||
      !survey.taskNoAI.tlx?.physical ||
      !survey.taskNoAI.tlx?.temporal ||
      !survey.taskNoAI.tlx?.performance ||
      !survey.taskNoAI.tlx?.effort ||
      !survey.taskNoAI.tlx?.frustration
    ) {
      alert('Please complete all workload assessment ratings before continuing.');
      return false;
    }
    
    // Validate all experience items are filled
    if (
      !survey.taskNoAI.experience?.confident ||
      !survey.taskNoAI.experience?.creative ||
      !survey.taskNoAI.experience?.satisfied
    ) {
      alert('Please complete all experience ratings before continuing.');
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
      backHref="/task-no-ai/activity"
      onNext={handleNext}
    >
      <div className="space-y-8">
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
              value={survey.taskNoAI.tlx?.mental}
              onChange={(value) =>
                setSurvey((prev) => ({
                  ...prev,
                  taskNoAI: {
                    ...prev.taskNoAI,
                    tlx: { ...prev.taskNoAI.tlx, mental: value },
                  },
                }))
              }
              required
            />

            <TlxItem
              label="How physically demanding was the task?"
              value={survey.taskNoAI.tlx?.physical}
              onChange={(value) =>
                setSurvey((prev) => ({
                  ...prev,
                  taskNoAI: {
                    ...prev.taskNoAI,
                    tlx: { ...prev.taskNoAI.tlx, physical: value },
                  },
                }))
              }
              required
            />

            <TlxItem
              label="How hurried or rushed was the pace of the task?"
              value={survey.taskNoAI.tlx?.temporal}
              onChange={(value) =>
                setSurvey((prev) => ({
                  ...prev,
                  taskNoAI: {
                    ...prev.taskNoAI,
                    tlx: { ...prev.taskNoAI.tlx, temporal: value },
                  },
                }))
              }
              required
            />

            <TlxItem
              label="How successful were you in accomplishing what you were asked to do?"
              value={survey.taskNoAI.tlx?.performance}
              onChange={(value) =>
                setSurvey((prev) => ({
                  ...prev,
                  taskNoAI: {
                    ...prev.taskNoAI,
                    tlx: { ...prev.taskNoAI.tlx, performance: value },
                  },
                }))
              }
              required
            />

            <TlxItem
              label="How hard did you have to work to accomplish your level of performance?"
              value={survey.taskNoAI.tlx?.effort}
              onChange={(value) =>
                setSurvey((prev) => ({
                  ...prev,
                  taskNoAI: {
                    ...prev.taskNoAI,
                    tlx: { ...prev.taskNoAI.tlx, effort: value },
                  },
                }))
              }
              required
            />

            <TlxItem
              label="How insecure, discouraged, irritated, stressed, and annoyed were you?"
              value={survey.taskNoAI.tlx?.frustration}
              onChange={(value) =>
                setSurvey((prev) => ({
                  ...prev,
                  taskNoAI: {
                    ...prev.taskNoAI,
                    tlx: { ...prev.taskNoAI.tlx, frustration: value },
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
              value={survey.taskNoAI.experience?.confident}
              onChange={(value) =>
                setSurvey((prev) => ({
                  ...prev,
                  taskNoAI: {
                    ...prev.taskNoAI,
                    experience: { ...prev.taskNoAI.experience, confident: value },
                  },
                }))
              }
              required
            />

            <LikertItem
              label="I felt creative during the task."
              minLabel="Strongly Disagree"
              maxLabel="Strongly Agree"
              value={survey.taskNoAI.experience?.creative}
              onChange={(value) =>
                setSurvey((prev) => ({
                  ...prev,
                  taskNoAI: {
                    ...prev.taskNoAI,
                    experience: { ...prev.taskNoAI.experience, creative: value },
                  },
                }))
              }
              required
            />

            <LikertItem
              label="I was satisfied with my performance on the task."
              minLabel="Strongly Disagree"
              maxLabel="Strongly Agree"
              value={survey.taskNoAI.experience?.satisfied}
              onChange={(value) =>
                setSurvey((prev) => ({
                  ...prev,
                  taskNoAI: {
                    ...prev.taskNoAI,
                    experience: { ...prev.taskNoAI.experience, satisfied: value },
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