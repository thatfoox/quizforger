import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ptawvigcjhhgoirqydzp.supabase.co";
const supabaseAnonKey = "sb_publishable_OWdC_T-_2TxW9bUSc2vHPg_4She-5EW";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);