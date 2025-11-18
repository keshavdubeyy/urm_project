#!/usr/bin/env ts-node

/**
 * CSV Export Utility for Survey Data
 * 
 * This script exports all survey responses from the SQLite database to a CSV file.
 * 
 * Usage:
 *   npm run export-csv
 * 
 * Output:
 *   Creates survey-export-{timestamp}.csv in the project root
 */

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface FlattenedResponse {
  // Database fields
  id: string;
  responseId: string;
  createdAt: string;
  
  // Demographics
  consent: boolean | null;
  age: string;
  gender: string;
  genderSelfDescribe: string | null;
  educationLevel: string;
  educationOther: string | null;
  aiUseFrequency: string;
  aiToolMostUsed: string | null;
  
  // Timestamps
  startTimestamp: string | null;
  endTimestamp: string | null;
  durationSeconds: number | null;
  
  // DIA Pre (5 items)
  diaPre_unprotected: number | null;
  diaPre_leftBehind: number | null;
  diaPre_stayUpdated: number | null;
  diaPre_needValidation: number | null;
  diaPre_fearReplacement: number | null;
  
  // GSE (4 items)
  gse_solveDifficult: number | null;
  gse_dealUnexpected: number | null;
  gse_handleUnforeseen: number | null;
  gse_severalSolutions: number | null;
  
  // Mood Pre (5 items)
  moodPre_tense: number | null;
  moodPre_fatigued: number | null;
  moodPre_anxious: number | null;
  moodPre_vigorous: number | null;
  moodPre_confident: number | null;
  
  // Task No-AI
  taskNoAI_responseText: string;
  taskNoAI_tlx_mentalDemand: number | null;
  taskNoAI_tlx_physicalDemand: number | null;
  taskNoAI_tlx_temporalDemand: number | null;
  taskNoAI_tlx_performance: number | null;
  taskNoAI_tlx_effort: number | null;
  taskNoAI_tlx_frustration: number | null;
  taskNoAI_exp_confident: number | null;
  taskNoAI_exp_creative: number | null;
  taskNoAI_exp_satisfied: number | null;
  
  // Task AI
  taskAI_responseText: string;
  taskAI_tlx_mentalDemand: number | null;
  taskAI_tlx_physicalDemand: number | null;
  taskAI_tlx_temporalDemand: number | null;
  taskAI_tlx_performance: number | null;
  taskAI_tlx_effort: number | null;
  taskAI_tlx_frustration: number | null;
  taskAI_exp_confident: number | null;
  taskAI_exp_creative: number | null;
  taskAI_exp_satisfied: number | null;
  taskAI_exp_helpful: number | null;
  taskAI_exp_feltDependent: number | null;
  taskAI_ideasFromAI: number | null;
  
  // DIA Post (5 items)
  diaPost_unprotected: number | null;
  diaPost_leftBehind: number | null;
  diaPost_stayUpdated: number | null;
  diaPost_needValidation: number | null;
  diaPost_fearReplacement: number | null;
  
  // Mood Post (4 items)
  moodPost_confident: number | null;
  moodPost_stressed: number | null;
  moodPost_satisfied: number | null;
  moodPost_creative: number | null;
  
  // Reflections
  reflections_easierTask: string;
  reflections_aiThoughtProcess: string;
  reflections_finalComments: string;
}

function escapeCSV(value: any): string {
  if (value === null || value === undefined) {
    return '';
  }
  const str = String(value);
  // Escape quotes and wrap in quotes if contains comma, newline, or quote
  if (str.includes(',') || str.includes('\n') || str.includes('"')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function flattenResponse(response: any): FlattenedResponse {
  // Parse JSON strings
  const diaPre = JSON.parse(response.diaPre || '{}');
  const gse = JSON.parse(response.gse || '{}');
  const moodPre = JSON.parse(response.moodPre || '{}');
  const taskNoAI = JSON.parse(response.taskNoAI || '{}');
  const taskAI = JSON.parse(response.taskAI || '{}');
  const diaPost = JSON.parse(response.diaPost || '{}');
  const moodPost = JSON.parse(response.moodPost || '{}');
  const reflections = JSON.parse(response.reflections || '{}');
  
  return {
    id: response.id,
    responseId: response.responseId,
    createdAt: response.createdAt.toISOString(),
    
    consent: response.consent || null,
    age: response.age,
    gender: response.gender,
    genderSelfDescribe: response.genderSelfDescribe || null,
    educationLevel: response.educationLevel,
    educationOther: response.educationOther || null,
    aiUseFrequency: response.aiUseFrequency,
    aiToolMostUsed: response.aiToolMostUsed || null,
    
    startTimestamp: response.startTimestamp || null,
    endTimestamp: response.endTimestamp || null,
    durationSeconds: response.durationSeconds,
    
    diaPre_unprotected: diaPre.unprotected || null,
    diaPre_leftBehind: diaPre.leftBehind || null,
    diaPre_stayUpdated: diaPre.stayUpdated || null,
    diaPre_needValidation: diaPre.needValidation || null,
    diaPre_fearReplacement: diaPre.fearReplacement || null,
    
    gse_solveDifficult: gse.solveDifficult || null,
    gse_dealUnexpected: gse.dealUnexpected || null,
    gse_handleUnforeseen: gse.handleUnforeseen || null,
    gse_severalSolutions: gse.severalSolutions || null,
    
    moodPre_tense: moodPre.tense || null,
    moodPre_fatigued: moodPre.fatigued || null,
    moodPre_anxious: moodPre.anxious || null,
    moodPre_vigorous: moodPre.vigorous || null,
    moodPre_confident: moodPre.confident || null,
    
    taskNoAI_responseText: taskNoAI.responseText || '',
    taskNoAI_tlx_mentalDemand: taskNoAI.tlx?.mental || null,
    taskNoAI_tlx_physicalDemand: taskNoAI.tlx?.physical || null,
    taskNoAI_tlx_temporalDemand: taskNoAI.tlx?.temporal || null,
    taskNoAI_tlx_performance: taskNoAI.tlx?.performance || null,
    taskNoAI_tlx_effort: taskNoAI.tlx?.effort || null,
    taskNoAI_tlx_frustration: taskNoAI.tlx?.frustration || null,
    taskNoAI_exp_confident: taskNoAI.experience?.confident || null,
    taskNoAI_exp_creative: taskNoAI.experience?.creative || null,
    taskNoAI_exp_satisfied: taskNoAI.experience?.satisfied || null,
    
    taskAI_responseText: taskAI.responseText || '',
    taskAI_tlx_mentalDemand: taskAI.tlx?.mental || null,
    taskAI_tlx_physicalDemand: taskAI.tlx?.physical || null,
    taskAI_tlx_temporalDemand: taskAI.tlx?.temporal || null,
    taskAI_tlx_performance: taskAI.tlx?.performance || null,
    taskAI_tlx_effort: taskAI.tlx?.effort || null,
    taskAI_tlx_frustration: taskAI.tlx?.frustration || null,
    taskAI_exp_confident: taskAI.experience?.confident || null,
    taskAI_exp_creative: taskAI.experience?.creative || null,
    taskAI_exp_satisfied: taskAI.experience?.satisfied || null,
    taskAI_exp_helpful: taskAI.experience?.helpful || null,
    taskAI_exp_feltDependent: taskAI.experience?.feltDependent || null,
    taskAI_ideasFromAI: taskAI.ideasFromAI || null,
    
    diaPost_unprotected: diaPost.unprotected || null,
    diaPost_leftBehind: diaPost.leftBehind || null,
    diaPost_stayUpdated: diaPost.stayUpdated || null,
    diaPost_needValidation: diaPost.needValidation || null,
    diaPost_fearReplacement: diaPost.fearReplacement || null,
    
    moodPost_confident: moodPost.confident || null,
    moodPost_stressed: moodPost.stressed || null,
    moodPost_satisfied: moodPost.satisfied || null,
    moodPost_creative: moodPost.creative || null,
    
    reflections_easierTask: reflections.easierTask || '',
    reflections_aiThoughtProcess: reflections.aiThoughtProcess || '',
    reflections_finalComments: reflections.finalComments || '',
  };
}

async function exportToCSV() {
  try {
    console.log('🔍 Fetching survey responses from database...');
    
    const responses = await prisma.surveyResponse.findMany({
      orderBy: { createdAt: 'asc' }
    });
    
    console.log(`✅ Found ${responses.length} responses`);
    
    if (responses.length === 0) {
      console.log('⚠️  No survey responses found in the database');
      await prisma.$disconnect();
      return;
    }
    
    // Flatten all responses
    const flattenedData = responses.map(flattenResponse);
    
    // Get headers from the first flattened response
    const headers = Object.keys(flattenedData[0]);
    
    // Create CSV content
    const csvLines = [
      headers.join(','), // Header row
      ...flattenedData.map(row => 
        headers.map(header => escapeCSV(row[header as keyof FlattenedResponse])).join(',')
      )
    ];
    
    const csvContent = csvLines.join('\n');
    
    // Generate filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const filename = `survey-export-${timestamp}.csv`;
    const filepath = path.join(process.cwd(), filename);
    
    // Write to file
    fs.writeFileSync(filepath, csvContent, 'utf-8');
    
    console.log(`\n✅ CSV export successful!`);
    console.log(`📄 File: ${filename}`);
    console.log(`📊 Records: ${responses.length}`);
    console.log(`📁 Location: ${filepath}`);
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Error exporting CSV:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

exportToCSV();
