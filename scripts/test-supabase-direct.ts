import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

async function testSupabaseConnection() {
  console.log('🔌 Testing Supabase connection directly...')
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseKey) {
    console.log('❌ Missing Supabase environment variables')
    return
  }
  
  try {
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Try to fetch from any table or system table
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .limit(1)
    
    if (error) {
      console.log('❌ Supabase API error:', error.message)
    } else {
      console.log('✅ Supabase connection successful!')
      console.log('📊 Can access database tables')
    }
  } catch (error) {
    console.log('❌ Connection failed:', error)
  }
}

testSupabaseConnection()