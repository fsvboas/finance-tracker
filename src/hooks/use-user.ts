import { supabaseClient } from "@/src/libs/supabase/supabase-client";
import type { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export function useUser() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let isMounted = true;

    supabaseClient.auth.getUser().then(({ data }) => {
      if (isMounted) setUser(data.user);
    });

    const { data: authListener } = supabaseClient.auth.onAuthStateChange(
      (_event, session) => {
        if (isMounted) setUser(session?.user ?? null);
      }
    );

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  return user;
}
