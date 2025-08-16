"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "./button";
import Show from "./utils/show";

const SwitchThemeButton = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="absolute right-6 top-6 w-10 h-10 opacity-0" />;
  }

  return (
    <Button
      aria-label="switch-theme"
      className="shadow-none border border-gray-300 dark:border-gray-600 rounded-[8px] hover:bg-black duration-300 hover:text-white dark:hover:bg-white dark:hover:text-black active:bg-none focus:bg-none"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <Show
        when={theme === "light"}
        fallback={<Sun className="text-yellow-500" />}
      >
        <Moon />
      </Show>
    </Button>
  );
};

export default SwitchThemeButton;
