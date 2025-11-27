"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSurvey } from "@/context/SurveyContext";

const DEMO_DATA = {
  age: 28,
  gender: "non-binary",
  education_level: "masters",
  ai_use_frequency: 4,
  diaPre: {
    unprotected: 3,
    leftBehind: 2,
    stayUpdated: 4,
    needValidation: 3,
    fearReplacement: 2,
  },
  gse: {
    solveDifficult: 3,
    dealUnexpected: 4,
    handleUnforeseen: 3,
    severalSolutions: 4,
  },
  moodPre: {
    tense: 2,
    fatigued: 3,
    anxious: 2,
    vigorous: 4,
    confident: 4,
  },
  taskNoAI: {
    responseText: "1. Create a community garden where neighbors can grow vegetables together\n2. Start a neighborhood tool-sharing library\n3. Organize monthly block parties with potluck dinners\n4. Set up a local skills exchange program\n5. Create a neighborhood walking group for fitness and socializing\n6. Establish a community bulletin board for announcements\n7. Start a neighborhood book club that meets in different homes\n8. Organize seasonal decoration contests\n9. Create a local childcare co-op for working parents\n10. Set up outdoor movie nights in a common area",
    tlx: {
      mental: 12,
      physical: 4,
      temporal: 8,
      performance: 6,
      effort: 10,
      frustration: 7,
    },
    experience: {
      confident: 4,
      creative: 5,
      satisfied: 4,
    },
  },
  taskAI: {
    responseText: "1. Implement a neighborhood app for real-time communication and event coordination\n2. Create shared electric vehicle charging stations for residents\n3. Establish a community composting program with rotating maintenance duties\n4. Design intergenerational mentorship programs pairing seniors with young families\n5. Set up neighborhood emergency response teams with trained volunteers\n6. Create flexible co-working spaces in community centers for remote workers\n7. Organize skill-sharing workshops like cooking, repair, and digital literacy\n8. Develop community-supported agriculture partnerships with local farms\n9. Establish neighborhood mediation services for conflict resolution\n10. Create seasonal festivals celebrating local culture and traditions\n11. Set up community tool libraries with online reservation systems\n12. Organize regular cleanup days with environmental education components\n13. Create neighborhood time banks for service exchanges\n14. Establish community gardens with educational programming for children\n15. Set up regular social hours at local businesses to support the local economy",
    ideasFromAI: 8,
    tlx: {
      mental: 6,
      physical: 3,
      temporal: 5,
      performance: 15,
      effort: 4,
      frustration: 2,
    },
    experience: {
      confident: 6,
      creative: 6,
      satisfied: 6,
      helpful: 6,
      feltDependent: 3,
    },
  },
  diaPost: {
    unprotected: 2,
    leftBehind: 2,
    stayUpdated: 5,
    needValidation: 2,
    fearReplacement: 1,
  },
  moodPost: {
    tense: 1,
    fatigued: 2,
    anxious: 1,
    vigorous: 5,
    confident: 5,
  },
};

export default function DemoSurveyPage() {
  const router = useRouter();
  const { survey, setSurvey } = useSurvey();

  // Initialize survey with demo data
  useState(() => {
    setSurvey(DEMO_DATA);
  });

  const handleStart = () => {
    // Pre-fill the survey context with demo data
    setSurvey(DEMO_DATA);
    router.push("/demo-survey/demographics");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Demo Banner */}
      <div className="bg-orange-500 text-white py-2 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="font-bold text-lg">🎭 Demo Version – For Presentation Only</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="apple-card p-12 text-center space-y-8">
          <div className="space-y-4">
            <h1 className="apple-heading-1">Survey Demo</h1>
            <p className="apple-body text-apple-gray-600 max-w-2xl mx-auto">
              This is a demonstration version of the AI & Creative Performance research survey. 
              All fields are pre-filled with sample data for presentation purposes.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h2 className="apple-heading-4 text-blue-900 mb-3">Demo Features</h2>
            <div className="text-left space-y-2 text-blue-800">
              <p>✓ All forms pre-filled with realistic sample data</p>
              <p>✓ No validation or required fields</p>
              <p>✓ Quick navigation through all survey sections</p>
              <p>✓ Complete walkthrough of the research experience</p>
              <p>✓ Final results showing AI Dependence scoring</p>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleStart}
              className="apple-button-primary text-lg px-8 py-4"
            >
              Start Demo Survey →
            </button>
            <div>
              <a
                href="/"
                className="apple-button-secondary"
              >
                ← Back to Real Survey
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}