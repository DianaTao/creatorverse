import { createClient } from '@supabase/supabase-js';

const URL = 'https://czbtzojsikowbxhtutkz.supabase.co';
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6YnR6b2pzaWtvd2J4aHR1dGt6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyNzg0MzAsImV4cCI6MjA3MDg1NDQzMH0.WnDmc_cUEr0GllMUL0LgEKUzUoRDqxjMesbmZoUs2Ug';

export const supabase = createClient(URL, API_KEY);