import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PRIVATE_ROUTES = [
  "/transacoes",
  "/cartoes",
  "/conta",
  "/proximos-passos",
];

export async function updateSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const hasErrorParam = request.nextUrl.searchParams.has("error");
  // const isRecoveryFlow =
  //   request.nextUrl.searchParams.get("type") === "recovery";
  // const cookieRecovery = request.cookies.get("recovery_mode")?.value === "true";

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isPrivateRoute = PRIVATE_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  // if (isRecoveryFlow) {
  //   supabaseResponse.cookies.set("recovery_mode", "true", {
  //     sameSite: "lax",
  //     path: "/",
  //   });
  // }

  // if (
  //   user &&
  //   (isRecoveryFlow || cookieRecovery) &&
  //   pathname !== "/criar-senha"
  // ) {
  //   const url = request.nextUrl.clone();
  //   url.pathname = "/criar-senha";
  //   url.search = "";
  //   return NextResponse.redirect(url);
  // }

  if (pathname === "/") {
    return supabaseResponse;
  }

  if (user && (pathname === "/entrar" || pathname === "/redefinir-senha")) {
    if (hasErrorParam) {
      return supabaseResponse;
    }
    const url = request.nextUrl.clone();
    url.pathname = "/transacoes";
    url.search = "";

    const response = NextResponse.redirect(url);
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      response.cookies.set(cookie.name, cookie.value);
    });
    return response;
  }

  if (!user && isPrivateRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/entrar";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
