import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://zpfpgvdabrowspnwtwxq.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwZnBndmRhYnJvd3Nwbnd0d3hxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwOTYzMDksImV4cCI6MjA2NTY3MjMwOX0.NFmgiQFLHtLKqsHLhKpZEFc0zvQsfC9CeoTiQyKNxmg'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)