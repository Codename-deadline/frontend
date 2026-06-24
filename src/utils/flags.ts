import type { PopoverTrigger } from "naive-ui";

export const getPopoverTrigger = (): PopoverTrigger => {
  return window.screen.width < 768 && navigator.maxTouchPoints > 0 ? "click" : "hover";
};
