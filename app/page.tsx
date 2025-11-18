"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSurvey } from "@/context/SurveyContext";

export default function Home() {
  const router = useRouter();
  const { survey, setSurvey, markStudyStarted } = useSurvey();
  const [consent, setConsent] = useState<boolean | null>(null);
  const [showDeclineMessage, setShowDeclineMessage] = useState(false);

  const handleContinue = () => {
    if (consent === true) {
      markStudyStarted();
      setSurvey((prev) => ({ ...prev, consent: true }));
      router.push("/demographics");
    } else if (consent === false) {
      setSurvey((prev) => ({ ...prev, consent: false }));
      setShowDeclineMessage(true);
    }
  };

  if (showDeclineMessage) {
    return (
      <div className="apple-card p-8 text-center space-y-6 animate-fade-in">
        <div className="space-y-4">
          <h2 className="apple-heading-3">
            Thank You for Your Time
          </h2>
          <p className="apple-body">
            You have chosen not to participate in this study. We appreciate your consideration.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="apple-card p-8 space-y-6 animate-fade-in">
      <div className="text-center space-y-3">
        <h1 className="apple-heading-2">
          Study on Task Approaches and Learning Experiences with Modern Generative Tools
        </h1>
      </div>

      <div className="border-t border-apple-gray-200 pt-6 space-y-6">
        {/* Header */}
        <div className="space-y-3">
          <h2 className="apple-heading-3">1. CONSENT FORM</h2>
          <div className="space-y-1">
            <p className="apple-body font-medium">Research Contact:</p>
            <p className="apple-body">Student Researcher: [Your Name, Institution, Email ID]</p>
            <p className="apple-body">Supervisor: [Supervisor Name, Email ID]</p>
          </div>
        </div>

        {/* Purpose */}
        <div className="space-y-3">
          <h3 className="apple-heading-4">Purpose of the Research</h3>
          <p className="apple-body">
            You are invited to participate in a research study about how students approach 
            problem-solving tasks. We are interested in understanding the relationship between 
            problem-solving strategies, feelings of confidence, and the use of modern technology.
          </p>
        </div>

        {/* What you will do */}
        <div className="space-y-3">
          <h3 className="apple-heading-4">What You Will Be Asked to Do</h3>
          <p className="apple-body">
            If you agree to participate, you will complete a four-part study lasting approximately 20–25 minutes:
          </p>
          <ul className="apple-body space-y-2 ml-4">
            <li className="flex items-start gap-2">
              <span className="font-medium">First Survey:</span>
              <span>Questions about study habits, technology feelings, current mood + a 1.5-minute creative warm-up task.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-medium">Main Task:</span>
              <span>A second 1.5-minute creative task—one with AI and one without AI.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-medium">Second Survey:</span>
              <span>Rate task difficulty, confidence, and mood immediately after each task.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-medium">Reflection:</span>
              <span>Optional open-ended questions about your experience.</span>
            </li>
          </ul>
        </div>

        {/* Risks and benefits */}
        <div className="space-y-3">
          <h3 className="apple-heading-4">Risks and Benefits</h3>
          <p className="apple-body">
            Risks are minimal and similar to daily academic activities. You may not receive 
            direct benefits, but your participation will advance research on learning and 
            technology use.
          </p>
        </div>

        {/* Voluntary participation */}
        <div className="space-y-3">
          <h3 className="apple-heading-4">Voluntary Participation</h3>
          <p className="apple-body">
            Participation is voluntary. You may withdraw or skip any question at any time without penalty.
          </p>
        </div>

        {/* Confidentiality */}
        <div className="space-y-3">
          <h3 className="apple-heading-4">Anonymity and Confidentiality</h3>
          <p className="apple-body">
            No identifying information will be collected. All responses will remain anonymous 
            and stored securely. Findings may be published, but never linked to individuals.
          </p>
        </div>
      </div>

      {/* Consent section */}
      <div className="border-t border-apple-gray-200 pt-6 space-y-4">
        <div className="space-y-3">
          <h3 className="apple-heading-4">Participant Consent</h3>
          <p className="apple-body">
            By clicking "I Agree," you confirm that:
          </p>
          <ul className="apple-body space-y-1 ml-6 list-disc">
            <li>You have read and understood the information above.</li>
            <li>You are 18 years of age or older.</li>
            <li>You voluntarily agree to participate.</li>
          </ul>
        </div>

        <div className="apple-card bg-apple-blue bg-opacity-5 border-apple-blue p-6 space-y-4">
          <div className="space-y-3">
            <label className={consent === true ? "apple-radio-card-selected" : "apple-radio-card"}>
              <input
                type="radio"
                name="consent"
                value="agree"
                checked={consent === true}
                onChange={() => setConsent(true)}
                className="apple-radio"
              />
              <span className="text-base text-apple-gray-900 font-medium select-none">
                I Agree — I consent to participate.
              </span>
            </label>

            <label className={consent === false ? "apple-radio-card-selected" : "apple-radio-card"}>
              <input
                type="radio"
                name="consent"
                value="disagree"
                checked={consent === false}
                onChange={() => setConsent(false)}
                className="apple-radio"
              />
              <span className="text-base text-apple-gray-900 font-medium select-none">
                I Do Not Agree
              </span>
            </label>
          </div>
        </div>

        <div className="flex justify-center pt-4">
          <button
            type="button"
            onClick={handleContinue}
            disabled={consent === null}
            className={consent === null ? "apple-button-secondary cursor-not-allowed opacity-50" : "apple-button-primary"}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
