import { NextResponse } from 'next/server';
import { createSheetsHeader } from '@/lib/googleSheets';

export async function GET() {
  try {
    if (!process.env.GSHEETS_SPREADSHEET_ID) {
      return NextResponse.json(
        { error: 'Google Sheets not configured. Please set GSHEETS_SPREADSHEET_ID environment variable.' },
        { status: 400 }
      );
    }

    const success = await createSheetsHeader();
    
    if (success) {
      return NextResponse.json({ 
        message: 'Google Sheets headers created successfully!',
        spreadsheetId: process.env.GSHEETS_SPREADSHEET_ID
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to create headers in Google Sheets' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Setup sheets error:', error);
    return NextResponse.json(
      { error: 'Failed to setup Google Sheets', details: String(error) },
      { status: 500 }
    );
  }
}