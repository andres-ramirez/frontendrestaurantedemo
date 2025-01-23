import { createClient } from '@supabase/supabase-js';

// // ⚠️ Reemplaza estos valores con los de tu proyecto en Supabase
const supabaseUrl = 'https://czmuzwyyqrmugdoynrbu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6bXV6d3l5cXJtdWdkb3lucmJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYzODQyMjMsImV4cCI6MjA1MTk2MDIyM30.rDAPgRbRcLWfFBnJq-xMp9XRZ6v3iTLhKEgMxmc7HEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

