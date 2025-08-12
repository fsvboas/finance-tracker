"use client";

import { useMutation } from "@tanstack/react-query";
import { LogOut, UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { doLogout } from "../app/entrar/services";
import { useUser } from "../hooks/use-user";
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

const UserMenu = () => {
  const user = useUser();
  const route = useRouter();

  // TO-DO: PENDING AND ERROR STATE
  const { mutate: logout, isPending: pendingLogout } = useMutation({
    mutationFn: doLogout,
    onSuccess: () => route.push("/entrar"),
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
      <DropdownMenuContent className="w-56" align="start">
        {/* TO-DO: CHANGE TO USER NAME */}
        <DropdownMenuLabel>Olá, {user?.email}! </DropdownMenuLabel>
        <DropdownMenuGroup>
          {/* <DropdownMenuItem>
            Minha Conta
            <DropdownMenuShortcut>
              <Settings />
            </DropdownMenuShortcut>
          </DropdownMenuItem> */}
          <DropdownMenuSeparator />
        </DropdownMenuGroup>
        <DropdownMenuItem
          className="!text-red-600 hover:!bg-red-50 cursor-pointer"
          onClick={() => logout()}
        >
          Sair
          <DropdownMenuShortcut>
            <LogOut className="text-red-600" />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
