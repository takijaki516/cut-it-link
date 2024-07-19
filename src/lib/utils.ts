import { customAlphabet } from "nanoid";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { type UseFormReturn } from "react-hook-form";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const slugRegex = /^[a-zA-Z0-9-_]*$/;

export function getBaseUrl() {
  if (process.env.DOMAIN_URL) return process.env.DOMAIN_URL;
  if (process.env.VERCEL_URL) return ``;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export const nanoid = customAlphabet(
  "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
  10,
);

// REVIEW:
export function formatNumber(
  number: number | string,
  options: {
    decimals?: number;
    style?: Intl.NumberFormatOptions["style"];
    notation?: Intl.NumberFormatOptions["notation"];
  } = {},
) {
  const { decimals = 1, notation = "standard", style = "decimal" } = options;

  return new Intl.NumberFormat("en-US", {
    style,
    notation,
    maximumFractionDigits: decimals,
  }).format(Number(number));
}

export function setFormErrors(
  form: UseFormReturn,
  errors: Record<string, string[]>,
) {
  for (const [field, messages] of Object.entries(errors)) {
    form.setError(field, { message: messages.join(" ") });
  }
}
