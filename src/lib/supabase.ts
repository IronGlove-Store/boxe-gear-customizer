
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

const supabaseUrl = 'https://rjtrytcayvbwdnjixwbe.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqdHJ5dGNheXZid2Ruaml4d2JlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA1ODExMzEsImV4cCI6MjA1NjE1NzEzMX0.jdKWjQMa2aG18aYmHgCeM-stjKGrCpKhTZZzsghw83w';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
