import { Moon, Sun } from "lucide-react";
import {
  useModeAnimation,
  ThemeAnimationType,
} from "react-theme-switch-animation";

import { Button } from "@/components/ui/button";
import { useTheme } from "./theme-context";

const ANIMATION_DURATION_MS = 750;
const ANIMATION_BLUR_PX = 3;

/** Light/dark switch that reveals the new theme with a blurred circular wipe. */
export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  const { ref, toggleSwitchTheme } = useModeAnimation({
    isDarkMode: theme === "dark",
    onDarkModeChange: (isDark) => setTheme(isDark ? "dark" : "light"),
    animationType: ThemeAnimationType.BLUR_CIRCLE,
    duration: ANIMATION_DURATION_MS,
    blurAmount: ANIMATION_BLUR_PX,
    globalClassName: "dark",
    pseudoElement: "::view-transition-new(root)",
  });

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      onClick={toggleSwitchTheme}
      className="border border-border"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-transform duration-base dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-transform duration-base dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
