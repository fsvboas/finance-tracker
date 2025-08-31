"use client";

import { ChartNoAxesColumn, CreditCard, Wallet } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../hooks/use-auth";
import { Button } from "./button";
import Row from "./utils/row";
import Show from "./utils/show";

const NavigationMenu = () => {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const userIsLogged = Boolean(user);

  return (
    <Show when={userIsLogged}>
      <Row className="bg-white dark:bg-[#0a0a0a] fixed bottom-5 p-1 justify-self-center w-[80%] z-50 border h-12 rounded-full overflow-hidden max-w-sm">
        {navigationMenuButtons.map((button, index) => {
          const currentRoute = pathname === button?.link;

          return (
            <Button
              key={index}
              type="button"
              className={`h-full flex-1 rounded-full bg-transparent shadow-none relative hover:bg-green-300 cursor-pointer ${
                currentRoute && "bg-green-300"
              }`}
              onClick={() => router.push(button.link)}
              disabled={button.isEnabled === false}
            >
              <Show when={button.isEnabled === false}>
                <Row className="w-fit p-0.5 h-fit bg-red-600 rounded-full absolute top-0 right-4">
                  <span className="text-[8px] text-white">Soon</span>
                </Row>
              </Show>
              <i
                className={`${currentRoute && "!text-green-600"} text-primary`}
              >
                {button.icon}
              </i>
            </Button>
          );
        })}
      </Row>
    </Show>
  );
};

export default NavigationMenu;

const navigationMenuButtons = [
  {
    icon: <Wallet />,
    link: "/dashboard",
    isEnabled: true,
  },
  {
    icon: <CreditCard />,
    link: "/cartoes",
    isEnabled: false,
  },
  {
    icon: <ChartNoAxesColumn />,
    link: "/graficos",
    isEnabled: false,
  },
];
