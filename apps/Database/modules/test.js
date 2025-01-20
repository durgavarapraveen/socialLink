import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log("Supabase URL:", supabaseUrl);
console.log("Supabase Key:", supabaseAnonKey);

async function testSupabase() {
  try {
    const { data, error } = await supabase
      .from("test_table") // Replace with your actual table name
      .select("*");

    if (error) {
      throw error;
    }

    console.log("Supabase Data:", data);
  } catch (err) {
    console.error("Supabase Error:", err);
  }
}

testSupabase();
