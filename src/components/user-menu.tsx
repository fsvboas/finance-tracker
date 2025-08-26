"use client";

import { useMutation } from "@tanstack/react-query";
import { Loader2Icon, LogOut, Settings, Wallet } from "lucide-react";
import { useRouter } from "next/navigation";
import { doLogout } from "../app/entrar/services";
import { useAuth } from "../hooks/use-auth";
import { useUserSecrets } from "../providers/user-secrets-provider";

import { DropdownMenuGroup } from "@radix-ui/react-dropdown-menu";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Switch } from "./switch";
import UserAvatar from "./user-avatar";
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
        <UserAvatar />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel className="flex flex-col">
          <span className="text-base">{user?.user_metadata?.display_name}</span>
          <span className="text-sm text-gray-500">{user?.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => route.push("/dashboard")}>
            Minhas Transações
            <DropdownMenuShortcut className="space-x-1">
              <Wallet />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => route.push("/minha-conta")}>
            Minha Conta
            <DropdownMenuShortcut className="space-x-1">
              <Settings />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
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
