import { testSupabaseConnection } from '../lib/supabase.js'
import 'dotenv/config'

async function main() {
  console.log('🔌 Testing Supabase client connection...')
  
  const isConnected = await testSupabaseConnection()
  
  if (isConnected) {
    console.log('🎉 Ready to proceed with Supabase setup!')
  } else {
    console.log('❌ Please check your Supabase configuration')
  }
}

main().catch(console.error)