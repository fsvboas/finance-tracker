import { createClient } from "@/src/libs/supabase/client";
import { hashPin } from "@/src/utils/crypto";
import CryptoJS from "crypto-js";

interface UserPinProps {
  userId: string;
  pin: string;
}

const supabase = createClient();

export async function createUserPin({ userId, pin }: UserPinProps) {
  const salt = CryptoJS.lib.WordArray.random(16).toString();
  const pinHash = hashPin(pin, salt);

  const { error } = await supabase
    .from("user_secrets")
    .upsert({ user_id: userId, pin_hash: pinHash, salt })
    .eq("user_id", userId);

  if (error) throw error;

  return salt;
}

export async function validateUserPin({ userId, pin }: UserPinProps) {
  const { data: userSecret, error } = await supabase
    .from("user_secrets")
    .select("pin_hash, salt")
    .eq("user_id", userId)
    .single();

  if (error || !userSecret) throw new Error("PIN não configurado.");

  const inputHash = hashPin(pin, userSecret.salt);
  if (inputHash !== userSecret.pin_hash) throw new Error("PIN incorreto.");

  return userSecret.salt;
}

export async function checkPinExists({ userId }: Partial<UserPinProps>) {
  const { data, error } = await supabase
    .from("user_secrets")
    .select("pin_hash")
    .eq("user_id", userId)
    .single();

  if (error) return false;

  return !!(data && data.pin_hash);
}
