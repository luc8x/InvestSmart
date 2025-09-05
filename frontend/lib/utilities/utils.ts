import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date, pattern = "PPP") {
  return format(date, pattern, { locale: ptBR });
}

export const getInitials = (name: string) => {
  if (!name) return '';
  const words = name.trim().split(' ');

  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }

  const first = words[0].charAt(0).toUpperCase();
  const last = words[words.length - 1].charAt(0).toUpperCase();

  return `${first}${last}`;
};