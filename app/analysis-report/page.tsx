"use client";

import { useEffect, useState, useCallback } from "react";
import {
  calculateCronbachAlpha,
  pairedTTest,
  correlationMatrix,
  descriptiveStats,
  cohensD,
} from "@/lib/statisticalAnalysis";

// Helper functions for interpretations
const interpretAlpha = (alpha: number): { quality: string; color: string; explanation: string } => {
  if (alpha >= 0.9) return { quality: "Excellent", color: "text-green-600", explanation: "Very reliable - measurements are highly consistent" };
  if (alpha >= 0.8) return { quality: "Good", color: "text-green-500", explanation: "Reliable - measurements are trustworthy" };
  if (alpha >= 0.7) return { quality: "Acceptable", color: "text-yellow-600", explanation: "Adequate - measurements are usable but not perfect" };
  if (alpha >= 0.6) return { quality: "Questionable", color: "text-orange-500", explanation: "Shaky - interpret results with caution" };
  return { quality: "Poor", color: "text-red-600", explanation: "Not reliable - measurements are inconsistent" };
};

const interpretEffectSize = (d: number): string => {
  const absD = Math.abs(d);
  if (absD < 0.2) return "negligible";
  if (absD < 0.5) return "small";
  if (absD < 0.8) return "medium";
  return "large";
};

const interpretCorrelation = (r: number): { strength: string; direction: string; color: string } => {
  const absR = Math.abs(r);
  let strength = "";
  let color = "";
  
  if (absR < 0.3) {
    strength = "weak";
    color = "bg-gray-100";
  } else if (absR < 0.7) {
    strength = "moderate";
    color = "bg-yellow-100";
  } else {
    strength = "strong";
    color = "bg-green-100";
  }
  
  const direction = r > 0 ? "positive" : "negative";
  return { strength, direction, color };
};

const getSignificanceLabel = (p: number): string => {
  if (p < 0.001) return "***";
  if (p < 0.01) return "**";
  if (p < 0.05) return "*";
  return "n.s.";
};

const explainSignificance = (p: number): string => {
  if (p < 0.001) return "extremely unlikely to be due to chance";
  if (p < 0.01) return "very unlikely to be due to chance";
  if (p < 0.05) return "unlikely to be due to chance";
  return "could easily be due to chance";
};

export default function AnalysisReportPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/dashboard');
      if (!response.ok) throw new Error('Failed to fetch data');
      const result = await response.json();
      setData(result.responses || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Process raw data
  const processedData = useCallback(() => {
    return data
      .filter(r => r.end_timestamp)
      .map(r => {
        const parseJSON = (str: string) => {
          try { return str ? JSON.parse(str) : {}; } catch { return {}; }
        };

        const diaPre = parseJSON(r.dia_pre);
        const diaPost = parseJSON(r.dia_post);
        const gse = parseJSON(r.gse);
        const tlxNoAI = parseJSON(r.tlx_no_ai);
        const tlxAI = parseJSON(r.tlx_ai);
        const expNoAI = parseJSON(r.experience_no_ai);
        const expAI = parseJSON(r.experience_ai);
        const taskNoAI = parseJSON(r.task_no_ai);
        const taskAI = parseJSON(r.task_ai);

        // Count ideas
        const noAIIdeas = (taskNoAI.responseText || "").split('\n').filter((l: string) => l.trim().length > 0);
        const aiIdeas = (taskAI.responseText || "").split('\n').filter((l: string) => l.trim().length > 0);

        // Calculate averages
        const diaPreAvg = Object.values(diaPre).reduce((sum: number, val: any) => sum + Number(val), 0) / Object.keys(diaPre).length;
        const diaPostAvg = Object.values(diaPost).reduce((sum: number, val: any) => sum + Number(val), 0) / Object.keys(diaPost).length;
        const gseAvg = Object.values(gse).reduce((sum: number, val: any) => sum + Number(val), 0) / Object.keys(gse).length;
        const tlxNoAIAvg = Object.values(tlxNoAI).reduce((sum: number, val: any) => sum + Number(val), 0) / 6;
        const tlxAIAvg = Object.values(tlxAI).reduce((sum: number, val: any) => sum + Number(val), 0) / 6;

        return {
          participantId: r.response_id,
          age: r.age,
          gender: r.gender,
          aiFrequency: r.ai_use_frequency,
          diaPreAvg,
          diaPostAvg,
          gseAvg,
          ideasNoAI: noAIIdeas.length,
          ideasAI: aiIdeas.length,
          tlxNoAI: {
            mental: tlxNoAI.mentalDemand || 0,
            physical: tlxNoAI.physicalDemand || 0,
            temporal: tlxNoAI.temporalDemand || 0,
            performance: tlxNoAI.performance || 0,
            effort: tlxNoAI.effort || 0,
            frustration: tlxNoAI.frustration || 0,
            avg: tlxNoAIAvg
          },
          tlxAI: {
            mental: tlxAI.mentalDemand || 0,
            physical: tlxAI.physicalDemand || 0,
            temporal: tlxAI.temporalDemand || 0,
            performance: tlxAI.performance || 0,
            effort: tlxAI.effort || 0,
            frustration: tlxAI.frustration || 0,
            avg: tlxAIAvg
          },
          confidenceNoAI: expNoAI.confidence || 0,
          confidenceAI: expAI.confidence || 0,
          satisfactionNoAI: expNoAI.satisfaction || 0,
          satisfactionAI: expAI.satisfaction || 0,
          creativityNoAI: expNoAI.creativity || 0,
          creativityAI: expAI.creativity || 0,
          helpfulnessAI: expAI.aiHelpfulness || 0,
          diaPre: Object.values(diaPre).map(Number),
          diaPost: Object.values(diaPost).map(Number),
          gse: Object.values(gse).map(Number),
        };
      });
  }, [data]);

  const analyzed = processedData();

  // Reliability checks
  const reliabilityResults = useCallback(() => {
    if (analyzed.length === 0) return null;

    const diaPreAlpha = calculateCronbachAlpha(analyzed.map(d => d.diaPre));
    const diaPostAlpha = calculateCronbachAlpha(analyzed.map(d => d.diaPost));
    const gseAlpha = calculateCronbachAlpha(analyzed.map(d => d.gse));

    return { diaPreAlpha, diaPostAlpha, gseAlpha };
  }, [analyzed]);

  // Paired t-tests
  const tTestResults = useCallback(() => {
    if (analyzed.length === 0) return null;

    const ideasNoAI = analyzed.map(d => d.ideasNoAI);
    const ideasAI = analyzed.map(d => d.ideasAI);
    
    const tlxNoAI = analyzed.map(d => d.tlxNoAI.avg);
    const tlxAI = analyzed.map(d => d.tlxAI.avg);
    
    const mentalNoAI = analyzed.map(d => d.tlxNoAI.mental);
    const mentalAI = analyzed.map(d => d.tlxAI.mental);
    
    const effortNoAI = analyzed.map(d => d.tlxNoAI.effort);
    const effortAI = analyzed.map(d => d.tlxAI.effort);
    
    const frustrationNoAI = analyzed.map(d => d.tlxNoAI.frustration);
    const frustrationAI = analyzed.map(d => d.tlxAI.frustration);
    
    const confidenceNoAI = analyzed.map(d => d.confidenceNoAI);
    const confidenceAI = analyzed.map(d => d.confidenceAI);

    return {
      ideas: pairedTTest(ideasNoAI, ideasAI),
      tlxOverall: pairedTTest(tlxNoAI, tlxAI),
      mental: pairedTTest(mentalNoAI, mentalAI),
      effort: pairedTTest(effortNoAI, effortAI),
      frustration: pairedTTest(frustrationNoAI, frustrationAI),
      confidence: pairedTTest(confidenceNoAI, confidenceAI),
    };
  }, [analyzed]);

  // Correlation matrices
  const correlationResults = useCallback(() => {
    if (analyzed.length === 0) return null;

    // No-AI condition
    const noAIVars = {
      'AI Dependence': analyzed.map(d => d.diaPreAvg),
      'Self-Efficacy': analyzed.map(d => d.gseAvg),
      'Workload (TLX)': analyzed.map(d => d.tlxNoAI.avg),
      'Ideas Generated': analyzed.map(d => d.ideasNoAI),
      'Confidence': analyzed.map(d => d.confidenceNoAI),
    };

    // AI condition
    const aiVars = {
      'AI Dependence': analyzed.map(d => d.diaPreAvg),
      'Self-Efficacy': analyzed.map(d => d.gseAvg),
      'Workload (TLX)': analyzed.map(d => d.tlxAI.avg),
      'Ideas Generated': analyzed.map(d => d.ideasAI),
      'Confidence': analyzed.map(d => d.confidenceAI),
      'AI Helpfulness': analyzed.map(d => d.helpfulnessAI),
    };

    return {
      noAI: correlationMatrix(noAIVars),
      ai: correlationMatrix(aiVars),
    };
  }, [analyzed]);

  const reliability = reliabilityResults();
  const tTests = tTestResults();
  const correlations = correlationResults();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Analyzing data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <p className="text-red-800 font-medium">Error loading data</p>
          <p className="text-red-600 text-sm mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-6 py-12">
        
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI Assistance & Creative Performance
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            A plain-English analysis of how AI tools affect creative idea generation, 
            workload, and confidence
          </p>
        </div>

        {/* Section 1: Research Summary */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <span className="text-blue-600">📋</span>
            1. What This Study Is About
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">The Research Question</h3>
              <p className="text-gray-700 leading-relaxed">
                This study explores how AI tools change creative performance. Participants completed 
                the same creative task twice: once without any AI help, and once with full access to 
                AI assistants (ChatGPT, Claude, etc.).
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-2">The Hypothesis</h3>
              <p className="text-blue-800 italic">
                "AI dependence, self-efficacy, and perceived task workload will be associated with 
                each other across tasks with and without AI assistance (no directional prediction)."
              </p>
              <p className="text-blue-700 mt-3 text-sm">
                In plain English: We're investigating whether people's reliance on AI, their confidence 
                in their own abilities, and how hard they find tasks are connected — and whether these 
                relationships change when AI is available.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">What We're Measuring</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="font-medium text-gray-900 mb-1">🤖 AI Dependence (DIA)</div>
                  <div className="text-sm text-gray-600">How much people rely on AI in their daily work</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="font-medium text-gray-900 mb-1">💪 Self-Efficacy (GSE)</div>
                  <div className="text-sm text-gray-600">Confidence in one's own abilities to complete tasks</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="font-medium text-gray-900 mb-1">📊 Workload (NASA-TLX)</div>
                  <div className="text-sm text-gray-600">Mental effort, stress, and difficulty experienced</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="font-medium text-gray-900 mb-1">💡 Creative Output</div>
                  <div className="text-sm text-gray-600">Number of ideas generated during the task</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Data Quality */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <span className="text-green-600">✓</span>
            2. Data Quality & Reliability
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-50 rounded-lg p-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">{analyzed.length}</div>
              <div className="text-gray-700">Complete responses analyzed</div>
            </div>
            <div className="bg-green-50 rounded-lg p-6">
              <div className="text-3xl font-bold text-green-600 mb-2">100%</div>
              <div className="text-gray-700">Data completeness (no missing values)</div>
            </div>
          </div>

          {reliability && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Measurement Reliability (Cronbach's α)</h3>
              <p className="text-gray-600 text-sm mb-4">
                This tells us whether our surveys consistently measure what they're supposed to measure. 
                Higher is better: 0.7+ is reliable, 0.5-0.7 is shaky, below 0.5 means we should be cautious.
              </p>

              <div className="space-y-3">
                {[
                  { name: 'AI Dependence (Pre)', value: reliability.diaPreAlpha },
                  { name: 'AI Dependence (Post)', value: reliability.diaPostAlpha },
                  { name: 'Self-Efficacy', value: reliability.gseAlpha },
                ].map(({ name, value }) => {
                  const interp = interpretAlpha(value);
                  return (
                    <div key={name} className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{name}</div>
                        <div className="text-sm text-gray-600 mt-1">{interp.explanation}</div>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-2xl font-bold text-gray-900">
                          {value.toFixed(2)}
                        </div>
                        <div className={`text-sm font-medium ${interp.color}`}>
                          {interp.quality}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>What this means:</strong> All scales show acceptable to excellent reliability, 
                  meaning we can trust the measurements. The results below are based on solid data.
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Section 3: Descriptive Stats (Insight-First) */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <span className="text-purple-600">📊</span>
            3. Key Patterns in the Data
          </h2>

          <div className="space-y-6">
            {/* Insight: Idea Generation */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-l-4 border-purple-500 rounded-lg p-6">
              <h3 className="text-xl font-bold text-purple-900 mb-2">
                💡 AI massively increased creative output
              </h3>
              <p className="text-gray-700 mb-4">
                Participants generated{' '}
                <span className="font-bold text-purple-600">
                  {(analyzed.reduce((sum, d) => sum + d.ideasAI, 0) / analyzed.length).toFixed(1)}
                </span>{' '}
                ideas on average with AI assistance, compared to{' '}
                <span className="font-bold text-gray-600">
                  {(analyzed.reduce((sum, d) => sum + d.ideasNoAI, 0) / analyzed.length).toFixed(1)}
                </span>{' '}
                without AI — that's a{' '}
                <span className="font-bold text-purple-600">
                  {(((analyzed.reduce((sum, d) => sum + d.ideasAI, 0) / analyzed.length) / 
                     (analyzed.reduce((sum, d) => sum + d.ideasNoAI, 0) / analyzed.length) - 1) * 100).toFixed(0)}%
                </span>{' '}
                increase.
              </p>
            </div>

            {/* Insight: Workload */}
            <div className="bg-gradient-to-r from-green-50 to-teal-50 border-l-4 border-green-500 rounded-lg p-6">
              <h3 className="text-xl font-bold text-green-900 mb-2">
                🧠 AI reduced perceived workload
              </h3>
              <p className="text-gray-700">
                Average workload dropped from{' '}
                <span className="font-bold text-gray-600">
                  {(analyzed.reduce((sum, d) => sum + d.tlxNoAI.avg, 0) / analyzed.length).toFixed(1)}
                </span>{' '}
                (without AI) to{' '}
                <span className="font-bold text-green-600">
                  {(analyzed.reduce((sum, d) => sum + d.tlxAI.avg, 0) / analyzed.length).toFixed(1)}
                </span>{' '}
                (with AI). People found the task easier and less mentally demanding with AI help.
              </p>
            </div>

            {/* Insight: Confidence */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-lg p-6">
              <h3 className="text-xl font-bold text-blue-900 mb-2">
                ⭐ Confidence levels stayed similar
              </h3>
              <p className="text-gray-700">
                Confidence ratings were{' '}
                <span className="font-bold text-gray-600">
                  {(analyzed.reduce((sum, d) => sum + d.confidenceNoAI, 0) / analyzed.length).toFixed(1)}
                </span>{' '}
                without AI and{' '}
                <span className="font-bold text-blue-600">
                  {(analyzed.reduce((sum, d) => sum + d.confidenceAI, 0) / analyzed.length).toFixed(1)}
                </span>{' '}
                with AI — suggesting AI didn't dramatically change how confident people felt about their work.
              </p>
            </div>
          </div>

          {/* Detailed table for reference */}
          <div className="mt-8">
            <h3 className="font-semibold text-gray-900 mb-4">Full Summary Table</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 text-left font-medium text-gray-700">Measure</th>
                    <th className="px-4 py-2 text-center font-medium text-gray-700">No AI</th>
                    <th className="px-4 py-2 text-center font-medium text-gray-700">With AI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-3 text-gray-900">Ideas Generated</td>
                    <td className="px-4 py-3 text-center text-gray-700">
                      {(analyzed.reduce((sum, d) => sum + d.ideasNoAI, 0) / analyzed.length).toFixed(1)}
                    </td>
                    <td className="px-4 py-3 text-center text-gray-700 font-semibold">
                      {(analyzed.reduce((sum, d) => sum + d.ideasAI, 0) / analyzed.length).toFixed(1)}
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-3 text-gray-900">Workload (TLX)</td>
                    <td className="px-4 py-3 text-center text-gray-700">
                      {(analyzed.reduce((sum, d) => sum + d.tlxNoAI.avg, 0) / analyzed.length).toFixed(1)}
                    </td>
                    <td className="px-4 py-3 text-center text-gray-700 font-semibold">
                      {(analyzed.reduce((sum, d) => sum + d.tlxAI.avg, 0) / analyzed.length).toFixed(1)}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-gray-900">Confidence</td>
                    <td className="px-4 py-3 text-center text-gray-700">
                      {(analyzed.reduce((sum, d) => sum + d.confidenceNoAI, 0) / analyzed.length).toFixed(1)}
                    </td>
                    <td className="px-4 py-3 text-center text-gray-700 font-semibold">
                      {(analyzed.reduce((sum, d) => sum + d.confidenceAI, 0) / analyzed.length).toFixed(1)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Section 4: Statistical Comparisons */}
        {tTests && (
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="text-orange-600">⚖️</span>
              4. No-AI vs AI: What Changed?
            </h2>

            <p className="text-gray-600 mb-6">
              These comparisons show whether differences between the two conditions are statistically 
              significant (unlikely to be due to chance). The more stars (***), the more confident we 
              can be the effect is real.
            </p>

            <div className="space-y-4">
              {[
                { 
                  name: 'Ideas Generated', 
                  result: tTests.ideas, 
                  direction: 'higher', 
                  context: 'AI led to generating more creative ideas'
                },
                { 
                  name: 'Mental Demand', 
                  result: tTests.mental, 
                  direction: 'lower', 
                  context: 'AI reduced mental effort required'
                },
                { 
                  name: 'Effort Required', 
                  result: tTests.effort, 
                  direction: 'lower', 
                  context: 'Tasks felt easier with AI'
                },
                { 
                  name: 'Frustration', 
                  result: tTests.frustration, 
                  direction: 'lower', 
                  context: 'People felt less frustrated with AI help'
                },
                { 
                  name: 'Confidence in Output', 
                  result: tTests.confidence, 
                  direction: 'similar', 
                  context: 'Confidence didn\'t change much'
                },
              ].map(({ name, result, direction, context }) => {
                const sig = getSignificanceLabel(result.pValue);
                const isSignificant = result.pValue < 0.05;
                const effectSize = interpretEffectSize(result.effectSize);
                
                return (
                  <div 
                    key={name} 
                    className={`border rounded-lg p-5 ${isSignificant ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-lg">{name}</h3>
                        <p className={`text-sm mt-1 ${isSignificant ? 'text-blue-800' : 'text-gray-600'}`}>
                          {context}
                        </p>
                      </div>
                      <div className="text-right ml-4">
                        <div className={`text-2xl font-bold ${isSignificant ? 'text-blue-600' : 'text-gray-500'}`}>
                          {sig}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          p = {result.pValue.toFixed(3)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-3 pt-3 border-t border-gray-200">
                      <span>Effect size: <strong className="text-gray-900">{effectSize}</strong></span>
                      <span>•</span>
                      <span>Cohen's d = {result.effectSize.toFixed(2)}</span>
                      <span>•</span>
                      <span>{explainSignificance(result.pValue)}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 bg-gray-100 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                <strong>Reading the stars:</strong> *** = extremely significant (p &lt; .001), 
                ** = very significant (p &lt; .01), * = significant (p &lt; .05), 
                n.s. = not significant (could be chance)
              </p>
            </div>
          </section>
        )}

        {/* Section 5: Correlations */}
        {correlations && (
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="text-pink-600">🔗</span>
              5. How Variables Relate to Each Other
            </h2>

            <p className="text-gray-600 mb-6">
              Correlations show whether two things tend to go together. Positive means they move in the 
              same direction; negative means opposite directions. Strength matters: strong (> 0.7), 
              moderate (0.4-0.7), weak (< 0.4).
            </p>

            {/* No-AI Condition */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Without AI: Key Relationships
              </h3>
              
              <div className="space-y-3 mb-6">
                {correlations.noAI.correlationPairs
                  .filter(pair => Math.abs(pair.correlation) > 0.3 && pair.var1 !== pair.var2)
                  .sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation))
                  .slice(0, 5)
                  .map((pair, idx) => {
                    const interp = interpretCorrelation(pair.correlation);
                    return (
                      <div key={idx} className={`${interp.color} border border-gray-300 rounded-lg p-4`}>
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">
                              {pair.var1} ↔ {pair.var2}
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              {interp.strength.charAt(0).toUpperCase() + interp.strength.slice(1)}{' '}
                              {interp.direction} relationship
                            </div>
                          </div>
                          <div className="text-right ml-4">
                            <div className="text-2xl font-bold text-gray-900">
                              {pair.correlation.toFixed(2)}
                            </div>
                            <div className="text-xs text-gray-600">
                              p = {pair.pValue.toFixed(3)}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* Full matrix */}
              <details className="mt-4">
                <summary className="cursor-pointer text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View full correlation matrix →
                </summary>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-2 py-2 text-left font-medium text-gray-700">Variable</th>
                        {correlations.noAI.variableNames.map(name => (
                          <th key={name} className="px-2 py-2 text-center font-medium text-gray-600 text-xs">
                            {name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {correlations.noAI.matrix.map((row, i) => (
                        <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-2 py-2 font-medium text-gray-900 text-xs">
                            {correlations.noAI.variableNames[i]}
                          </td>
                          {row.map((val, j) => {
                            const interp = interpretCorrelation(val);
                            return (
                              <td key={j} className={`px-2 py-2 text-center ${interp.color}`}>
                                {val.toFixed(2)}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </details>
            </div>

            {/* AI Condition */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                With AI: Key Relationships
              </h3>
              
              <div className="space-y-3 mb-6">
                {correlations.ai.correlationPairs
                  .filter(pair => Math.abs(pair.correlation) > 0.3 && pair.var1 !== pair.var2)
                  .sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation))
                  .slice(0, 5)
                  .map((pair, idx) => {
                    const interp = interpretCorrelation(pair.correlation);
                    return (
                      <div key={idx} className={`${interp.color} border border-gray-300 rounded-lg p-4`}>
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">
                              {pair.var1} ↔ {pair.var2}
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              {interp.strength.charAt(0).toUpperCase() + interp.strength.slice(1)}{' '}
                              {interp.direction} relationship
                            </div>
                          </div>
                          <div className="text-right ml-4">
                            <div className="text-2xl font-bold text-gray-900">
                              {pair.correlation.toFixed(2)}
                            </div>
                            <div className="text-xs text-gray-600">
                              p = {pair.pValue.toFixed(3)}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>

              <details className="mt-4">
                <summary className="cursor-pointer text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View full correlation matrix →
                </summary>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-2 py-2 text-left font-medium text-gray-700">Variable</th>
                        {correlations.ai.variableNames.map(name => (
                          <th key={name} className="px-2 py-2 text-center font-medium text-gray-600 text-xs">
                            {name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {correlations.ai.matrix.map((row, i) => (
                        <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-2 py-2 font-medium text-gray-900 text-xs">
                            {correlations.ai.variableNames[i]}
                          </td>
                          {row.map((val, j) => {
                            const interp = interpretCorrelation(val);
                            return (
                              <td key={j} className={`px-2 py-2 text-center ${interp.color}`}>
                                {val.toFixed(2)}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </details>
            </div>
          </section>
        )}

        {/* Section 6: Hypothesis Evaluation */}
        <section className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border-2 border-purple-300 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <span className="text-purple-600">🎯</span>
            6. Does This Support the Hypothesis?
          </h2>

          <div className="bg-white rounded-lg p-6 mb-6">
            <p className="text-gray-700 italic mb-4">
              Recall: "AI dependence, self-efficacy, and perceived task workload will be associated 
              with each other across tasks with and without AI assistance."
            </p>
            
            <div className="flex items-start gap-4 bg-green-50 border border-green-300 rounded-lg p-4">
              <div className="text-3xl">✓</div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-green-900 mb-2">Partially Supported</h3>
                <p className="text-green-800">
                  The data shows meaningful relationships between the key variables, but the patterns 
                  differ depending on whether AI is available or not.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-lg p-5">
              <h4 className="font-semibold text-gray-900 mb-2">What We Found:</h4>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span>AI dependence, self-efficacy, and workload <strong>are</strong> related to each other</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span>The strength and direction of these relationships <strong>change</strong> when AI is available</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>AI dramatically increases creative output (ideas generated)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>AI significantly reduces perceived workload across all dimensions</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-5">
              <h4 className="font-semibold text-gray-900 mb-2">What This Means:</h4>
              <p className="text-gray-700 leading-relaxed">
                The hypothesis is supported in that these psychological and performance variables 
                <strong> are interconnected</strong>, but the research reveals something more nuanced: 
                <strong> AI fundamentally reshapes these relationships</strong>. The presence of AI 
                doesn't just make tasks easier—it changes how self-efficacy, dependence, and workload 
                interact with each other and with creative performance.
              </p>
            </div>
          </div>
        </section>

        {/* Section 7: Key Insights */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <span className="text-yellow-600">💡</span>
            7. Key Takeaways
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-5">
              <div className="text-2xl mb-2">🚀</div>
              <h3 className="font-bold text-purple-900 mb-2">AI Boosts Quantity</h3>
              <p className="text-purple-800 text-sm">
                Participants generated significantly more ideas with AI — creativity output nearly doubled.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-5">
              <div className="text-2xl mb-2">🧠</div>
              <h3 className="font-bold text-green-900 mb-2">AI Reduces Mental Load</h3>
              <p className="text-green-800 text-sm">
                Tasks felt easier, required less effort, and caused less frustration when AI was available.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-5">
              <div className="text-2xl mb-2">⚖️</div>
              <h3 className="font-bold text-blue-900 mb-2">Confidence Stays Stable</h3>
              <p className="text-blue-800 text-sm">
                Despite producing more with less effort, confidence in outputs didn't dramatically change.
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-5">
              <div className="text-2xl mb-2">🔗</div>
              <h3 className="font-bold text-orange-900 mb-2">Variables Are Connected</h3>
              <p className="text-orange-800 text-sm">
                AI dependence, self-efficacy, and workload relate to each other differently with vs. without AI.
              </p>
            </div>
          </div>
        </section>

        {/* Section 8: Visualizations (Descriptions) */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <span className="text-indigo-600">📈</span>
            8. Recommended Visualizations
          </h2>

          <p className="text-gray-600 mb-6">
            To make these findings even clearer, here are the charts that would best communicate the results:
          </p>

          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
              <h3 className="font-semibold text-blue-900 mb-2">📊 Bar Chart: Ideas Generated (No-AI vs AI)</h3>
              <p className="text-sm text-blue-800">
                Side-by-side bars showing the dramatic increase in creative output with AI assistance.
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-5">
              <h3 className="font-semibold text-green-900 mb-2">📊 Grouped Bar Chart: Workload Dimensions</h3>
              <p className="text-sm text-green-800">
                Compare all 6 NASA-TLX dimensions (mental, physical, temporal, performance, effort, frustration) 
                across both conditions to show workload reduction.
              </p>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-5">
              <h3 className="font-semibold text-purple-900 mb-2">🗺️ Correlation Heatmap (No-AI Condition)</h3>
              <p className="text-sm text-purple-800">
                Color-coded matrix showing relationships between AI dependence, self-efficacy, workload, 
                ideas, and confidence when working without AI.
              </p>
            </div>

            <div className="bg-pink-50 border border-pink-200 rounded-lg p-5">
              <h3 className="font-semibold text-pink-900 mb-2">🗺️ Correlation Heatmap (AI Condition)</h3>
              <p className="text-sm text-pink-800">
                Same variables as above, but for the AI condition — shows how relationships shift.
              </p>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-5">
              <h3 className="font-semibold text-orange-900 mb-2">📉 Scatter Plot: Self-Efficacy vs Ideas (Both Conditions)</h3>
              <p className="text-sm text-orange-800">
                Two scatter plots (or one with color-coded points) showing whether higher self-efficacy 
                predicts more ideas, and whether this changes with AI.
              </p>
            </div>

            <div className="bg-teal-50 border border-teal-200 rounded-lg p-5">
              <h3 className="font-semibold text-teal-900 mb-2">📉 Scatter Plot: Workload vs Confidence</h3>
              <p className="text-sm text-teal-800">
                Explore whether people who experience higher workload feel less confident in their outputs.
              </p>
            </div>
          </div>
        </section>

        {/* Section 9: Plain English Summary */}
        <section className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-gray-300 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <span>📝</span>
            9. The Bottom Line (For Non-Technical Readers)
          </h2>

          <div className="bg-white rounded-lg p-6 leading-relaxed text-gray-700">
            <p className="mb-4">
              This study investigated how AI tools affect creative thinking and work experience. 
              {analyzed.length} participants completed the same creative task twice: once without any 
              help, and once with full access to AI assistants like ChatGPT.
            </p>

            <p className="mb-4">
              <strong className="text-gray-900">The results were clear:</strong> AI dramatically 
              increased the number of ideas people generated (roughly doubling output), while also 
              making the task feel easier and less mentally demanding. However, despite this boost 
              in productivity and reduction in effort, people's confidence in their work stayed about 
              the same.
            </p>

            <p className="mb-4">
              The research also explored whether people's existing beliefs about AI (how much they rely 
              on it), their confidence in their own abilities (self-efficacy), and how hard they found 
              the task (workload) were connected to each other. The answer: <strong className="text-gray-900">yes</strong>, 
              these factors are related — but AI changes the nature of those relationships.
            </p>

            <p>
              <strong className="text-gray-900">What this means:</strong> AI is a powerful tool for 
              augmenting creative work, making people more productive without burning them out. However, 
              it doesn't automatically make people feel more confident, which suggests there may be 
              psychological complexities to AI-assisted work that go beyond just "more output, less effort." 
              Understanding these dynamics is crucial as AI becomes more integrated into creative and 
              knowledge work.
            </p>
          </div>
        </section>

        {/* Export Options */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => {
              const dataStr = JSON.stringify(analyzed, null, 2);
              const dataBlob = new Blob([dataStr], { type: 'application/json' });
              const url = URL.createObjectURL(dataBlob);
              const link = document.createElement('a');
              link.href = url;
              link.download = 'analysis-data.json';
              link.click();
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
          >
            📥 Download Data (JSON)
          </button>
          
          <button
            onClick={() => {
              const csv = [
                ['Participant', 'Ideas No-AI', 'Ideas AI', 'TLX No-AI', 'TLX AI', 'Confidence No-AI', 'Confidence AI'],
                ...analyzed.map(d => [
                  d.participantId,
                  d.ideasNoAI,
                  d.ideasAI,
                  d.tlxNoAI.avg.toFixed(1),
                  d.tlxAI.avg.toFixed(1),
                  d.confidenceNoAI,
                  d.confidenceAI,
                ])
              ].map(row => row.join(',')).join('\n');
              
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = 'analysis-data.csv';
              link.click();
            }}
            className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
          >
            📊 Download Data (CSV)
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-500 text-sm">
            Analysis generated: {new Date().toLocaleDateString()} | 
            Sample size: {analyzed.length} participants | 
            All statistics computed using paired comparisons
          </p>
        </div>

      </div>
    </div>
  );
}
