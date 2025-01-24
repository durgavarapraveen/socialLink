import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL || "https://bnwjjfrjafcvacnmowja.supabase.co",
  process.env.SUPABASE_ANON_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJud2pqZnJqYWZjdmFjbm1vd2phIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcxOTUxNTQsImV4cCI6MjA1Mjc3MTE1NH0.7yPnpwsVCo-780HZzWJFekrkw5Z2rqw8lcOleuLA93A"
);

export default supabase;
