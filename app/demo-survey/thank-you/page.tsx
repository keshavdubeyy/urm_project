"use client";

import { useEffect, useState } from "react";
import { useSurvey } from "@/context/SurveyContext";
import { useRouter } from "next/navigation";

export default function DemoThankYouPage() {
  const { survey } = useSurvey();
  const router = useRouter();
  const [aiDependenceScore, setAiDependenceScore] = useState<number | null>(null);
  const [creativity, setCreativity] = useState<{ noAI: number; withAI: number; improvement: number } | null>(null);

  useEffect(() => {
    // Calculate AI Dependence Score
    const preDIA = survey.preTask?.dia || {};
    const postDIA = survey.postTask?.dia || {};
    
    const preScore = (
      (preDIA.reliesAI || 3) +
      (preDIA.aiDecisions || 2) +
      (preDIA.aiGuidance || 3) +
      (preDIA.trustAI || 4) +
      (preDIA.aiSupport || 2) +
      (preDIA.confidenceAI || 4) +
      (preDIA.dependsAI || 2)
    ) / 7;

    const postScore = (
      (postDIA.reliesAI || 4) +
      (postDIA.aiDecisions || 3) +
      (postDIA.aiGuidance || 4) +
      (postDIA.trustAI || 4) +
      (postDIA.aiSupport || 3) +
      (postDIA.confidenceAI || 4) +
      (postDIA.dependsAI || 3)
    ) / 7;

    const dependenceChange = postScore - preScore;
    setAiDependenceScore(dependenceChange);

    // Calculate creativity improvement
    const noAIIdeas = (survey.taskNoAI?.responseText || "").split('\n').filter(line => line.trim()).length;
    const aiIdeas = (survey.taskAI?.responseText || "").split('\n').filter(line => line.trim()).length;
    const improvement = ((aiIdeas - noAIIdeas) / noAIIdeas) * 100;
    
    setCreativity({
      noAI: noAIIdeas,
      withAI: aiIdeas,
      improvement: improvement
    });
  }, [survey]);

  const handleNewDemo = () => {
    router.push('/demo-survey');
  };

  const handleMainSurvey = () => {
    router.push('/');
  };

  return (
    <>
      {/* Demo Banner */}
      <div className="bg-orange-500 text-white py-2 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="font-bold">🎭 Demo Version – For Presentation Only</span>
        </div>
      </div>

      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="apple-card p-12 text-center">
            {/* Success Header */}
            <div className="mb-8">
              <div className="text-8xl mb-4">🎉</div>
              <h1 className="apple-heading-1 mb-4">Demo Complete!</h1>
              <p className="apple-body text-apple-gray-600 max-w-2xl mx-auto">
                You've successfully walked through the complete survey experience. 
                Here are your demo results showing how AI impacts creativity and dependence.
              </p>
            </div>

            {/* Results Section */}
            <div className="space-y-8 mb-12">
              {/* AI Dependence Score */}
              <div className="apple-card p-8 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200">
                <h2 className="apple-heading-2 mb-4 text-purple-900">📊 AI Dependence Score</h2>
                <div className="text-center">
                  <div className="text-6xl font-bold text-purple-700 mb-2">
                    {aiDependenceScore ? (aiDependenceScore > 0 ? '+' : '') + aiDependenceScore.toFixed(3) : '...'}
                  </div>
                  <p className="text-lg text-purple-800 mb-4">
                    Change in AI Dependence (Post-task - Pre-task)
                  </p>
                  <div className="bg-white/50 rounded-lg p-4">
                    <p className="text-sm text-purple-700">
                      <strong>Interpretation:</strong> {aiDependenceScore && aiDependenceScore > 0 
                        ? "Increased dependence on AI after exposure" 
                        : "Decreased or unchanged AI dependence"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Creativity Improvement */}
              {creativity && (
                <div className="apple-card p-8 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
                  <h2 className="apple-heading-2 mb-6 text-green-900">🚀 Creativity Enhancement</h2>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-green-700 mb-2">{creativity.noAI}</div>
                      <p className="text-green-800">Ideas without AI</p>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-green-700 mb-2">{creativity.withAI}</div>
                      <p className="text-green-800">Ideas with AI</p>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-green-700 mb-2">+{creativity.improvement.toFixed(0)}%</div>
                      <p className="text-green-800">Improvement</p>
                    </div>
                  </div>
                  <div className="mt-6 bg-white/50 rounded-lg p-4">
                    <p className="text-sm text-green-700 text-center">
                      <strong>AI Impact:</strong> {creativity.improvement > 0 
                        ? `Participants generated ${creativity.improvement.toFixed(0)}% more creative ideas with AI assistance` 
                        : "No significant improvement observed"}
                    </p>
                  </div>
                </div>
              )}

              {/* Demo Summary */}
              <div className="apple-card p-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
                <h2 className="apple-heading-2 mb-4 text-blue-900">📋 Demo Summary</h2>
                <div className="grid md:grid-cols-2 gap-6 text-left">
                  <div>
                    <h3 className="font-bold text-blue-800 mb-3">What You Experienced:</h3>
                    <ul className="space-y-2 text-blue-700 text-sm">
                      <li>✅ Demographics collection</li>
                      <li>✅ Pre-task questionnaires (DIA, GSE, Mood)</li>
                      <li>✅ Creative writing without AI (3 min)</li>
                      <li>✅ NASA-TLX workload assessment</li>
                      <li>✅ Creative writing with AI assistance (3 min)</li>
                      <li>✅ AI usage evaluation</li>
                      <li>✅ Post-task questionnaires</li>
                      <li>✅ Results calculation and display</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold text-blue-800 mb-3">Key Research Insights:</h3>
                    <ul className="space-y-2 text-blue-700 text-sm">
                      <li>🎯 AI typically enhances creative output</li>
                      <li>🧠 Task load often decreases with AI</li>
                      <li>📈 Confidence and satisfaction improve</li>
                      <li>⚖️ Slight increase in AI dependence</li>
                      <li>📊 Comprehensive workload measurement</li>
                      <li>🔍 Individual difference tracking</li>
                      <li>⏱️ Real-time performance comparison</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleNewDemo}
                  className="apple-button-secondary px-8 py-3"
                >
                  🔄 Run Demo Again
                </button>
                <button
                  onClick={handleMainSurvey}
                  className="apple-button-primary px-8 py-3"
                >
                  📝 Take Real Survey
                </button>
              </div>
              
              <p className="text-sm text-apple-gray-500 mt-4">
                Thank you for exploring our research methodology! 
                The real survey collects valuable data on AI's impact on human creativity.
              </p>
            </div>
          </div>

          {/* Research Info */}
          <div className="apple-card p-6 mt-8 bg-gray-50">
            <div className="text-center">
              <h3 className="font-bold text-gray-700 mb-2">About This Research</h3>
              <p className="text-sm text-gray-600">
                This study investigates how AI assistance affects creative performance and psychological 
                dependence. Results help understand the balance between AI enhancement and human autonomy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}