"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useMounted } from "@/lib/hooks/use-mounted";

/** Light/dark toggle. Renders a stable placeholder until mounted. */
export function ThemeToggle() {
  const mounted = useMounted();
  const { resolvedTheme, setTheme } = useTheme();

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="تغییر پوسته روشن/تیره"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {mounted && !isDark ? <Moon /> : <Sun />}
    </Button>
  );
}
