import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ppqkhepkmyeiavefjqvd.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwcWtoZXBrbXllaWF2ZWZqcXZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1MjcwNzcsImV4cCI6MjA2MTEwMzA3N30.ORzS_-MSDHhjUiE43wmAWxs3YjGKyaUKX-_9pDZRypk'
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})