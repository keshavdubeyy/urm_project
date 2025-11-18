import 'dotenv/config'

// Simple direct test of Google Sheets API
async function testGoogleSheets() {
  console.log('🧪 Testing Google Sheets integration...')
  
  // Test environment variables
  const hasClientEmail = !!process.env.GSHEETS_CLIENT_EMAIL
  const hasPrivateKey = !!process.env.GSHEETS_PRIVATE_KEY
  const hasSpreadsheetId = !!process.env.GSHEETS_SPREADSHEET_ID
  
  console.log('📋 Environment check:')
  console.log(`  Client Email: ${hasClientEmail ? '✅' : '❌'}`)
  console.log(`  Private Key: ${hasPrivateKey ? '✅' : '❌'}`)
  console.log(`  Spreadsheet ID: ${hasSpreadsheetId ? '✅' : '❌'}`)
  
  if (!hasClientEmail || !hasPrivateKey || !hasSpreadsheetId) {
    console.log('❌ Missing required environment variables')
    return
  }
  
  try {
    // Test basic Google Sheets API connection
    const { google } = await import('googleapis')
    
    const auth = new google.auth.JWT({
      email: process.env.GSHEETS_CLIENT_EMAIL,
      key: process.env.GSHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    })
    
    const sheets = google.sheets({ version: 'v4', auth })
    
    // Try to read the spreadsheet info
    const response = await sheets.spreadsheets.get({
      spreadsheetId: process.env.GSHEETS_SPREADSHEET_ID,
    })
    
    console.log('✅ Google Sheets API connection successful!')
    console.log(`📊 Spreadsheet title: "${response.data.properties?.title}"`)
    console.log(`📋 Number of sheets: ${response.data.sheets?.length || 0}`)
    
    // Try to append a simple test row
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GSHEETS_SPREADSHEET_ID,
      range: 'Sheet1!A:A',
      valueInputOption: 'RAW',
      requestBody: {
        values: [['TEST', 'Google Sheets Integration Test', new Date().toISOString()]],
      },
    })
    
    console.log('✅ Test data appended successfully!')
    console.log('📋 Check your Google Sheet - you should see a test row')
    
  } catch (error: any) {
    console.error('❌ Google Sheets test failed:', error.message)
    if (error.code === 403) {
      console.log('💡 Make sure you shared the spreadsheet with the service account email')
    }
  }

}

testGoogleSheets()