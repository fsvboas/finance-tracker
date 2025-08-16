"use client";

import { useMutation } from "@tanstack/react-query";
import { Loader2Icon, LogOut, UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { doLogout } from "../app/entrar/services";
import { useUserSecrets } from "../contexts/user-secrets-context";
import { useAuth } from "../hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import Show from "./utils/show";

const UserMenu = () => {
  const { user } = useAuth();
  const route = useRouter();
  const { clearCredentials } = useUserSecrets();

  const { mutate: logout, isPending: pendingLogout } = useMutation({
    mutationFn: doLogout,
    onSuccess: () => {
      clearCredentials();
      route.push("/entrar");
    },
    onError: (error) => {
      console.log(error);
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        <div className="bg-transparent border rounded-full w-8 h-8 flex items-center justify-center">
          <UserIcon size={20} />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>
          Olá, {user?.user_metadata?.display_name}!
        </DropdownMenuLabel>
        {/* <DropdownMenuGroup> */}
        {/* <DropdownMenuItem onClick={() => route.push("/perfil")}>
            Minha Conta
            <DropdownMenuShortcut>
              <User />
            </DropdownMenuShortcut>
          </DropdownMenuItem> */}
        {/* </DropdownMenuGroup> */}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="!text-red-600 hover:!bg-red-50 cursor-pointer"
          onClick={() => logout()}
        >
          Sair
          <DropdownMenuShortcut>
            <Show
              when={!pendingLogout}
              fallback={<Loader2Icon className="animate-spin text-red-600" />}
            >
              <LogOut className="text-red-600" />
            </Show>
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
