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
          User Research Methods Survey
        </h1>
        <p className="apple-body text-lg">
          Study on Task Approaches and Learning Experiences with Modern Generative Tools
        </p>
      </div>

      <div className="border-t border-apple-gray-200 pt-6 space-y-6">
        {/* Purpose */}
        <div className="space-y-3">
          <h3 className="apple-heading-4">Purpose of the Research</h3>
          <p className="apple-body">
            This study aims to understand how individuals approach problem-solving tasks with and 
            without the assistance of modern generative AI tools. We are interested in learning 
            about your thought processes, experiences, and perceptions when working on academic tasks.
          </p>
        </div>

        {/* What you will do */}
        <div className="space-y-3">
          <h3 className="apple-heading-4">What You Will Be Asked to Do</h3>
          <p className="apple-body">
            You will complete demographic questions, answer questionnaires about your attitudes 
            toward AI and your problem-solving confidence, complete two problem-solving tasks 
            (one without AI assistance and one with AI assistance), and reflect on your experience. 
            The entire study will take approximately 30-45 minutes.
          </p>
        </div>

        {/* Risks and benefits */}
        <div className="space-y-3">
          <h3 className="apple-heading-4">Risks and Benefits</h3>
          <p className="apple-body">
            There are no anticipated risks beyond those encountered in everyday life. Your participation 
            will contribute to research on human-AI interaction in academic contexts. You will not 
            receive direct benefits, but your insights will help improve our understanding of learning 
            experiences with AI tools.
          </p>
        </div>

        {/* Voluntary participation */}
        <div className="space-y-3">
          <h3 className="apple-heading-4">Voluntary Participation</h3>
          <p className="apple-body">
            Your participation is completely voluntary. You may withdraw at any time without penalty. 
            You may skip any questions you do not wish to answer.
          </p>
        </div>

        {/* Confidentiality */}
        <div className="space-y-3">
          <h3 className="apple-heading-4">Anonymity and Confidentiality</h3>
          <p className="apple-body">
            Your responses will be kept confidential and anonymous. No personally identifiable 
            information will be collected. All data will be stored securely and used only for 
            research purposes.
          </p>
        </div>
      </div>

      {/* Consent selection */}
      <div className="border-t border-apple-gray-200 pt-6 space-y-4">
        <div className="apple-card bg-apple-blue bg-opacity-5 border-apple-blue p-6 space-y-4">
          <p className="apple-label text-base">
            Please indicate your decision:
          </p>
          
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
                I Agree — I consent to participate in this research study
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
