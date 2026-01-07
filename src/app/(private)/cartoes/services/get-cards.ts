import { supabaseClient } from "@/src/libs/supabase/supabase-client";

export async function getCards() {
  const {
    data: { session },
  } = await supabaseClient.auth.getSession();
  if (!session) throw new Error("Usuário não autenticado");

  const { data, error } = await supabaseClient.from("cards").select("*");

  if (error) throw error;

  return data || [];
}
