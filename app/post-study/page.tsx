"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import StepLayout from "@/components/StepLayout";
import LikertItem from "@/components/LikertItem";
import TextArea from "@/components/TextArea";
import { useSurvey } from "@/context/SurveyContext";

export default function PostStudyPage() {
  const router = useRouter();
  const { survey, setSurvey, markStudyEnded } = useSurvey();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);

    // Mark study as ended (updates timestamps) and wait for state update
    markStudyEnded();
    
    // Wait a tick for state to update
    await new Promise(resolve => setTimeout(resolve, 0));

    try {
      // Create updated survey with timestamps
      const endTimestamp = new Date().toISOString();
      let durationSeconds: number | undefined;
      
      if (survey.startTimestamp) {
        const start = new Date(survey.startTimestamp);
        const end = new Date(endTimestamp);
        durationSeconds = Math.floor((end.getTime() - start.getTime()) / 1000);
      }
      
      const finalSurvey = {
        ...survey,
        endTimestamp,
        durationSeconds,
      };

      const response = await fetch('/api/survey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalSurvey),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save survey');
      }

      console.log("Survey saved successfully:", data);
      router.push("/thank-you");
    } catch (err) {
      console.error("Error submitting survey:", err);
      setError(err instanceof Error ? err.message : "Failed to submit survey");
      setSubmitting(false);
    }
  };

  return (
    <StepLayout
      currentStep={6}
      totalSteps={7}
      stepTitle="Post-Study Questionnaire"
      nextHref="/thank-you"
      backHref="/task-ai"
      onNext={handleSubmit}
      nextLabel={submitting ? "Submitting..." : "Submit & Finish"}
      nextDisabled={submitting}
    >
      <div className="space-y-8">
        {/* Section A: AI Dependence Scale - POST */}
        <div className="apple-card bg-apple-gray-50 p-8 space-y-6">
          <div>
            <h3 className="apple-heading-4 mb-3">
              Your Perceptions After Completing the Tasks
            </h3>
            <p className="apple-caption mb-6">
              Please rate how true each statement is for you now.
            </p>
          </div>

          <div className="space-y-6">
            <LikertItem
              label="I feel unprotected when I do not have access to AI."
              minLabel="Not at all true"
              maxLabel="Completely true"
              value={survey.diaPost.unprotected}
              onChange={(value) =>
                setSurvey((prev) => ({
                  ...prev,
                  diaPost: { ...prev.diaPost, unprotected: value },
                }))
              }
            />

            <LikertItem
              label="I'm concerned about being left behind if I do not use AI."
              minLabel="Not at all true"
              maxLabel="Completely true"
              value={survey.diaPost.leftBehind}
              onChange={(value) =>
                setSurvey((prev) => ({
                  ...prev,
                  diaPost: { ...prev.diaPost, leftBehind: value },
                }))
              }
            />

            <LikertItem
              label="I do everything possible to stay updated with AI to remain relevant in my field."
              minLabel="Not at all true"
              maxLabel="Completely true"
              value={survey.diaPost.stayUpdated}
              onChange={(value) =>
                setSurvey((prev) => ({
                  ...prev,
                  diaPost: { ...prev.diaPost, stayUpdated: value },
                }))
              }
            />

            <LikertItem
              label="I constantly need validation or feedback from AI systems to feel confident in my decisions."
              minLabel="Not at all true"
              maxLabel="Completely true"
              value={survey.diaPost.needValidation}
              onChange={(value) =>
                setSurvey((prev) => ({
                  ...prev,
                  diaPost: { ...prev.diaPost, needValidation: value },
                }))
              }
            />

            <LikertItem
              label="I fear that AI might replace my current skills or abilities."
              minLabel="Not at all true"
              maxLabel="Completely true"
              value={survey.diaPost.fearReplacement}
              onChange={(value) =>
                setSurvey((prev) => ({
                  ...prev,
                  diaPost: { ...prev.diaPost, fearReplacement: value },
                }))
              }
            />
          </div>
        </div>

        {/* Section B: Emotional State (Post-Study Mood) */}
        <div className="apple-card bg-apple-gray-50 p-8 space-y-6">
          <div>
            <h3 className="apple-heading-4 mb-3">
              How You Feel Now
            </h3>
            <p className="apple-caption mb-6">
              Please rate how you feel at this moment, after completing both tasks.
            </p>
          </div>

          <div className="space-y-6">
            <LikertItem
              label="How confident do you feel right now?"
              minLabel="Very low"
              maxLabel="Very high"
              value={survey.moodPost.confident}
              onChange={(value) =>
                setSurvey((prev) => ({
                  ...prev,
                  moodPost: { ...prev.moodPost, confident: value },
                }))
              }
            />

            <LikertItem
              label="How stressed do you feel right now?"
              minLabel="Very low"
              maxLabel="Very high"
              value={survey.moodPost.stressed}
              onChange={(value) =>
                setSurvey((prev) => ({
                  ...prev,
                  moodPost: { ...prev.moodPost, stressed: value },
                }))
              }
            />

            <LikertItem
              label="How satisfied do you feel with your overall performance across both tasks?"
              minLabel="Very low"
              maxLabel="Very high"
              value={survey.moodPost.satisfied}
              onChange={(value) =>
                setSurvey((prev) => ({
                  ...prev,
                  moodPost: { ...prev.moodPost, satisfied: value },
                }))
              }
            />

            <LikertItem
              label="How creative do you feel right now?"
              minLabel="Very low"
              maxLabel="Very high"
              value={survey.moodPost.creative}
              onChange={(value) =>
                setSurvey((prev) => ({
                  ...prev,
                  moodPost: { ...prev.moodPost, creative: value },
                }))
              }
            />
          </div>
        </div>

        {/* Section C: Final Reflections */}
        <div className="apple-card bg-apple-gray-50 p-8 space-y-6">
          <div>
            <h3 className="apple-heading-4 mb-3">
              Final Reflections
            </h3>
            <p className="apple-caption mb-6">
              Please share your thoughts about the experience.
            </p>
          </div>

          <div className="space-y-6">
            <TextArea
              label="Which task felt easier for you (AI or No-AI), and why?"
              name="easierTask"
              value={survey.reflections.easierTask}
              onChange={(value) =>
                setSurvey((prev) => ({
                  ...prev,
                  reflections: { ...prev.reflections, easierTask: value },
                }))
              }
              placeholder="Share your thoughts..."
              rows={4}
            />

            <TextArea
              label="How did using (or not using) AI affect your thought process during the tasks?"
              name="aiThoughtProcess"
              value={survey.reflections.aiThoughtProcess}
              onChange={(value) =>
                setSurvey((prev) => ({
                  ...prev,
                  reflections: { ...prev.reflections, aiThoughtProcess: value },
                }))
              }
              placeholder="Describe how AI influenced your approach..."
              rows={4}
            />

            <TextArea
              label="Do you have any final comments about your experience with AI in academic tasks? (Optional)"
              name="finalComments"
              value={survey.reflections.finalComments}
              onChange={(value) =>
                setSurvey((prev) => ({
                  ...prev,
                  reflections: { ...prev.reflections, finalComments: value },
                }))
              }
              placeholder="Any additional thoughts or feedback..."
              rows={4}
            />
          </div>
        </div>

        <div className="apple-card bg-apple-blue bg-opacity-5 border-apple-blue p-6">
          <p className="apple-body text-apple-blue">
            <strong>Note:</strong> When you click "Submit & Finish", your responses will be saved 
            to the database and you will be taken to a thank you page.
          </p>
          {error && (
            <div className="apple-error-banner mt-4">
              <p className="apple-body text-red-800">
                <strong>Error:</strong> {error}
              </p>
            </div>
          )}
        </div>
      </div>
    </StepLayout>
  );
}
