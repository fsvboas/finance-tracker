"use client";

import { supabaseClient } from "@/src/libs/supabase/supabase-client";
import type { Session } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export function AuthGuard({
  children,
  requireAuth = true,
  redirectTo = "/login",
}: AuthGuardProps) {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchSession() {
      const { data } = await supabaseClient.auth.getSession();
      if (isMounted) {
        setSession(data.session);
        setLoading(false);
      }
    }

    fetchSession();

    const { data: authListener } = supabaseClient.auth.onAuthStateChange(
      (_event, newSession) => {
        if (isMounted) {
          setSession(newSession);
        }
      }
    );

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (loading) return;

    if (requireAuth && !session) {
      router.push(redirectTo);
    } else if (!requireAuth && session) {
      router.push(redirectTo);
    }
  }, [loading, session, requireAuth, redirectTo, router]);

  if (loading) return <div>Carregando...</div>;

  const hasAccess = (requireAuth && session) || (!requireAuth && !session);

  return hasAccess ? <>{children}</> : null;
}
