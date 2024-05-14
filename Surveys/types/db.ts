import { Database } from "../types/supabase";
export type Survey = Database["public"]["Tables"]["surveys"]["Row"];
export type Vote = Database["public"]["Tables"]["votes"]["Row"];
