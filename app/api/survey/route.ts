import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { SurveyResponse } from '@/types/survey';
import { appendToGoogleSheets } from '@/lib/googleSheets';

export async function POST(request: NextRequest) {
  try {
    const survey: SurveyResponse = await request.json();

    console.log('Received survey data:', {
      responseId: survey.responseId,
      age: survey.age,
      hasAge: !!survey.age,
    });

    // Validate required fields with detailed error message
    if (!survey.age) {
      console.error('Validation failed: Missing age data', survey.age);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required demographics data. Please ensure you filled out the demographics page.',
          details: { age: survey.age }
        },
        { status: 400 }
      );
    }

    // Create database entry using Supabase
    const { data: saved, error: dbError } = await supabase
      .from('survey_responses')
      .insert([{
        response_id: survey.responseId,
        consent: survey.consent || null,
        // Demographics (flat fields on survey object)
        age: survey.age,
        gender: survey.gender || null,
        gender_self_describe: survey.genderSelfDescribe || null,
        education_level: survey.educationLevel || null,
        education_other: survey.educationOther || null,
        ai_use_frequency: survey.aiUseFrequency || null,
        ai_tool_most_used: survey.aiToolMostUsed || null,
        // Timestamps (stored as strings in schema)
        start_timestamp: survey.startTimestamp || null,
        end_timestamp: survey.endTimestamp || null,
        duration_seconds: survey.durationSeconds || null,
        // JSON strings for nested objects
        dia_pre: JSON.stringify(survey.diaPre),
        gse: JSON.stringify(survey.gse),
        mood_pre: JSON.stringify(survey.moodPre),
        task_no_ai: JSON.stringify(survey.taskNoAI),
        task_ai: JSON.stringify(survey.taskAI),
        dia_post: JSON.stringify(survey.diaPost),
        mood_post: JSON.stringify(survey.moodPost),
        reflections: JSON.stringify(survey.reflections),
      }])
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error(`Database error: ${dbError.message}`);
    }

    console.log('Survey saved successfully:', saved.id);

    // Attempt to append to Google Sheets (non-blocking)
    try {
      const sheetsSuccess = await appendToGoogleSheets({
        ...survey,
        id: saved.id,
        createdAt: saved.created_at,
      });
      
      if (sheetsSuccess) {
        console.log('Survey response successfully saved to both database and Google Sheets');
      } else {
        console.warn('Survey response saved to database but Google Sheets sync skipped (not configured)');
      }
    } catch (sheetsError) {
      console.error('Google Sheets sync error (non-blocking):', sheetsError);
      // Continue execution - don't fail the request if Sheets fails
    }

    return NextResponse.json({ 
      success: true, 
      responseId: saved.response_id,
      id: saved.id 
    }, { status: 201 });
  } catch (error) {
    console.error('Error saving survey:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save survey response', details: String(error) },
      { status: 500 }
    );
  }
}
