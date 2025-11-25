import { google } from 'googleapis';
import { SurveyResponse } from '@/types/survey';

// Initialize Google Sheets API
const getGoogleSheetsClient = () => {
  const clientEmail = process.env.GSHEETS_CLIENT_EMAIL;
  const privateKey = process.env.GSHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n');
  
  if (!clientEmail || !privateKey) {
    throw new Error('Google Sheets credentials not configured');
  }

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  });

  return google.sheets({ version: 'v4', auth });
};

// Convert survey data to CSV row format
export const formatSurveyForSheets = (survey: SurveyResponse & { id?: string; createdAt?: Date }): (string | number | boolean)[] => {
  const createdAt = survey.createdAt ? survey.createdAt.toISOString() : new Date().toISOString();
  
  return [
    survey.id || '',
    survey.responseId || '',
    createdAt,
    survey.consent || false,
    survey.age || '',
    survey.gender || '',
    survey.genderSelfDescribe || '',
    survey.educationLevel || '',
    survey.educationOther || '',
    survey.aiUseFrequency || '',
    survey.aiToolMostUsed || '',
    // DIA Pre
    survey.diaPre?.unprotected || '',
    survey.diaPre?.leftBehind || '',
    survey.diaPre?.stayUpdated || '',
    survey.diaPre?.needValidation || '',
    survey.diaPre?.fearReplacement || '',
    // GSE
    survey.gse?.solveDifficult || '',
    survey.gse?.dealUnexpected || '',
    survey.gse?.handleUnforeseen || '',
    survey.gse?.severalSolutions || '',
    // Mood Pre
    survey.moodPre?.tense || '',
    survey.moodPre?.fatigued || '',
    survey.moodPre?.anxious || '',
    survey.moodPre?.vigorous || '',
    survey.moodPre?.confident || '',
    // Task No AI
    survey.taskNoAI?.startTimestamp || '',
    survey.taskNoAI?.endTimestamp || '',
    survey.taskNoAI?.responseText || '',
    // Task No AI TLX
    survey.taskNoAI?.tlx?.mental || '',
    survey.taskNoAI?.tlx?.physical || '',
    survey.taskNoAI?.tlx?.temporal || '',
    survey.taskNoAI?.tlx?.performance || '',
    survey.taskNoAI?.tlx?.effort || '',
    survey.taskNoAI?.tlx?.frustration || '',
    // Task No AI Experience
    survey.taskNoAI?.experience?.confident || '',
    survey.taskNoAI?.experience?.creative || '',
    survey.taskNoAI?.experience?.satisfied || '',
    // Task AI
    survey.taskAI?.startTimestamp || '',
    survey.taskAI?.endTimestamp || '',
    survey.taskAI?.responseText || '',
    survey.taskAI?.ideasFromAI || '',
    // Task AI TLX
    survey.taskAI?.tlx?.mental || '',
    survey.taskAI?.tlx?.physical || '',
    survey.taskAI?.tlx?.temporal || '',
    survey.taskAI?.tlx?.performance || '',
    survey.taskAI?.tlx?.effort || '',
    survey.taskAI?.tlx?.frustration || '',
    // Task AI Experience
    survey.taskAI?.experience?.confident || '',
    survey.taskAI?.experience?.creative || '',
    survey.taskAI?.experience?.satisfied || '',
    survey.taskAI?.experience?.helpful || '',
    survey.taskAI?.experience?.feltDependent || '',
    // DIA Post
    survey.diaPost?.unprotected || '',
    survey.diaPost?.leftBehind || '',
    survey.diaPost?.stayUpdated || '',
    survey.diaPost?.needValidation || '',
    survey.diaPost?.fearReplacement || '',
    // Mood Post
    survey.moodPost?.tense || '',
    survey.moodPost?.fatigued || '',
    survey.moodPost?.anxious || '',
    survey.moodPost?.vigorous || '',
    survey.moodPost?.confident || '',
    // Reflections
    survey.reflections?.easierTask || '',
    survey.reflections?.aiThoughtProcess || '',
    survey.reflections?.finalComments || '',
    // Metadata
    survey.startTimestamp || '',
    survey.endTimestamp || '',
    survey.durationSeconds || ''
  ];
};

// Write survey response to Google Sheets
export const appendToGoogleSheets = async (survey: SurveyResponse & { id?: string; createdAt?: Date }): Promise<boolean> => {
  try {
    if (!process.env.GSHEETS_SPREADSHEET_ID) {
      console.warn('Google Sheets not configured - skipping sheet append');
      return false;
    }

    const sheets = getGoogleSheetsClient();
    const spreadsheetId = process.env.GSHEETS_SPREADSHEET_ID;
    
    const values = [formatSurveyForSheets(survey)];
    
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Sheet1!A:A',
      valueInputOption: 'RAW',
      requestBody: {
        values,
      },
    });

    console.log('Successfully appended survey response to Google Sheets');
    return true;
  } catch (error) {
    console.error('Failed to append to Google Sheets:', error);
    return false;
  }
};

// Create headers row in Google Sheets (run once to set up the sheet)
export const createSheetsHeader = async (): Promise<boolean> => {
  try {
    const sheets = getGoogleSheetsClient();
    const spreadsheetId = process.env.GSHEETS_SPREADSHEET_ID;
    
    if (!spreadsheetId) {
      throw new Error('Spreadsheet ID not configured');
    }

    const headers = [
      'id', 'responseId', 'createdAt', 'consent', 'age', 'gender', 'genderSelfDescribe',
      'educationLevel', 'educationOther', 'aiUseFrequency', 'aiToolMostUsed',
      'diaPre_unprotected', 'diaPre_leftBehind', 'diaPre_stayUpdated', 'diaPre_needValidation', 'diaPre_fearReplacement',
      'gse_solveDifficult', 'gse_dealUnexpected', 'gse_handleUnforeseen', 'gse_severalSolutions',
      'moodPre_tense', 'moodPre_fatigued', 'moodPre_anxious', 'moodPre_vigorous', 'moodPre_confident',
      'taskNoAI_startTimestamp', 'taskNoAI_endTimestamp', 'taskNoAI_responseText',
      'taskNoAI_tlx_mental', 'taskNoAI_tlx_physical', 'taskNoAI_tlx_temporal', 'taskNoAI_tlx_performance', 'taskNoAI_tlx_effort', 'taskNoAI_tlx_frustration',
      'taskNoAI_experience_confident', 'taskNoAI_experience_creative', 'taskNoAI_experience_satisfied',
      'taskAI_startTimestamp', 'taskAI_endTimestamp', 'taskAI_responseText', 'taskAI_ideasFromAI',
      'taskAI_tlx_mental', 'taskAI_tlx_physical', 'taskAI_tlx_temporal', 'taskAI_tlx_performance', 'taskAI_tlx_effort', 'taskAI_tlx_frustration',
      'taskAI_experience_confident', 'taskAI_experience_creative', 'taskAI_experience_satisfied', 'taskAI_experience_helpful', 'taskAI_experience_feltDependent',
      'diaPost_unprotected', 'diaPost_leftBehind', 'diaPost_stayUpdated', 'diaPost_needValidation', 'diaPost_fearReplacement',
      'moodPost_tense', 'moodPost_fatigued', 'moodPost_anxious', 'moodPost_vigorous', 'moodPost_confident',
      'reflections_easierTask', 'reflections_aiThoughtProcess', 'reflections_finalComments',
      'startTimestamp', 'endTimestamp', 'durationSeconds'
    ];

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: 'Sheet1!A1:BL1',
      valueInputOption: 'RAW',
      requestBody: {
        values: [headers],
      },
    });

    console.log('Successfully created headers in Google Sheets');
    return true;
  } catch (error) {
    console.error('Failed to create headers in Google Sheets:', error);
    return false;
  }
};