"use client";

import { supabaseClient } from "@/src/libs/supabase/supabase-client";
import type { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchSession() {
      try {
        const { data } = await supabaseClient.auth.getSession();
        if (isMounted) {
          setSession(data.session);
        }
      } catch (error) {
        console.error("Error fetching session:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
          setInitialized(true);
        }
      }
    }

    fetchSession();

    const { data: authListener } = supabaseClient.auth.onAuthStateChange(
      (_event, newSession) => {
        if (isMounted) {
          setSession(newSession);
          if (!initialized) {
            setLoading(false);
            setInitialized(true);
          }
        }
      }
    );

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [initialized]);

  return {
    session,
    loading,
    isAuthenticated: !!session,
    user: session?.user || null,
  };
}
