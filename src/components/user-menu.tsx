"use client";

import { useMutation } from "@tanstack/react-query";
import { Loader2Icon, LogOut, UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { doLogout } from "../app/entrar/services";
import { useAuth } from "../hooks/use-auth";
import { useUserSecrets } from "../providers/user-secrets-provider";

import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Switch } from "./switch";
import Show from "./utils/show";

const UserMenu = () => {
  const { user } = useAuth();
  const route = useRouter();
  const { clearCredentials } = useUserSecrets();
  const { theme, setTheme } = useTheme();

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

  const handleThemeToggle = (checked: boolean) => {
    setTheme(checked ? "dark" : "light");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        <div className="bg-transparent rounded-full w-8 h-8 flex items-center justify-center">
          <UserIcon size={20} />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>
          Olá, {user?.user_metadata?.display_name}!
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="hover:!bg-transparent">
            Tema (Beta)
            <DropdownMenuShortcut className="space-x-1">
              <Switch
                checked={theme === "dark"}
                onCheckedChange={handleThemeToggle}
              />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="!text-red-600  cursor-pointer"
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
