import { createClient } from '@supabase/supabase-js';


// // ⚠️ Reemplaza estos valores con los de tu proyecto en Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

