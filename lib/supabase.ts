import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database interface to match our Prisma schema
export interface SurveyResponse {
  id?: string
  responseId: string
  consent?: boolean
  startTimestamp?: string
  endTimestamp?: string
  durationSeconds?: number
  
  // Demographics (flattened)
  age?: number
  gender?: string
  genderSelfDescribe?: string
  educationLevel?: string
  educationOther?: string
  aiUseFrequency?: number
  aiToolMostUsed?: string

  // Nested data as JSON strings
  diaPre?: string
  gse?: string
  moodPre?: string
  taskNoAI?: string
  taskAI?: string
  diaPost?: string
  moodPost?: string
  reflections?: string

  createdAt?: string
}

// Create the survey_responses table if it doesn't exist
export async function createTable() {
  const { error } = await supabase.rpc('create_survey_table', {})
  
  if (error && !error.message.includes('already exists')) {
    console.error('Error creating table:', error)
    return false
  }
  return true
}

// Insert a new survey response
export async function insertSurveyResponse(data: SurveyResponse) {
  const { data: result, error } = await supabase
    .from('survey_responses')
    .insert([data])
    .select()
  
  if (error) {
    console.error('Error inserting survey response:', error)
    throw error
  }
  
  return result[0]
}

// Get all survey responses
export async function getAllSurveyResponses() {
  const { data, error } = await supabase
    .from('survey_responses')
    .select('*')
    .order('createdAt', { ascending: false })
  
  if (error) {
    console.error('Error fetching survey responses:', error)
    throw error
  }
  
  return data
}

// Test connection
export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase
      .from('survey_responses')
      .select('count')
      .limit(1)
    
    if (error && error.code === 'PGRST116') {
      // Table doesn't exist, which is fine - we'll create it
      console.log('✅ Supabase connected! (Table needs to be created)')
      return true
    } else if (error) {
      console.error('❌ Supabase connection error:', error)
      return false
    } else {
      console.log('✅ Supabase connected and table exists!')
      return true
    }
  } catch (error) {
    console.error('❌ Supabase connection failed:', error)
    return false
  }
}