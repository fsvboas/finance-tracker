import { createClient } from "@/src/libs/supabase/client";

interface DoUpdateUserInfosProps {
  name: string;
  email: string;
}

export async function doUpdateUserInfos({
  name,
  email,
}: DoUpdateUserInfosProps) {
  const supabase = createClient();

  const { error: updateError } = await supabase.auth.updateUser({
    data: {
      display_name: name,
    },
    email,
  });

  if (updateError) throw updateError;

  return;
}
