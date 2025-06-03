import { supabase } from "../config/supabase";
import { Task } from "../types/database";

export const getTasks = async (userId: string) => {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", userId);

  if (error) throw error;
  return data as Task[];
};
