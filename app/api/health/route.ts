import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Test database connection
    const { count, error: countError } = await supabase
      .from('survey_responses')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      throw new Error(`Database connection failed: ${countError.message}`);
    }
    
    // Test environment variables
    const envCheck = {
      database: !!process.env.DATABASE_URL,
      googleSheets: {
        clientEmail: !!process.env.GSHEETS_CLIENT_EMAIL,
        privateKey: !!process.env.GSHEETS_PRIVATE_KEY,
        spreadsheetId: !!process.env.GSHEETS_SPREADSHEET_ID,
      }
    };

    return NextResponse.json({
      status: 'healthy',
      database: {
        connected: true,
        responseCount: count || 0
      },
      environment: envCheck,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: String(error),
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}