import { CardType } from "@/src/app/(private)/cartoes/types/card-type";
import { supabaseClient } from "@/src/libs/supabase/supabase-client";
import camelcaseKeys from "camelcase-keys";

export async function getCards(): Promise<CardType[]> {
  const { data, error } = await supabaseClient.from("cards").select("*");

  if (error) throw error;

  return camelcaseKeys(data || []);
}
