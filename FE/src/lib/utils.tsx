import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ClassValue } from "clsx";

/**
 * Merge Tailwind CSS classes conditionally.
 * @param inputs Accepts strings, arrays, conditionals.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(...inputs));
}
