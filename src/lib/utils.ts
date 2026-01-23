import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatCurrency = (number: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};

export const formatQueueNumber = (num: number | string | undefined | null) => {
  if (!num && num !== 0) return "-";
  return num.toString().padStart(3, "0");
};

export function getImageSrc(src: string | null | undefined): string {
  if (!src) return '/images/placeholder-article.jpg'; // Ensure this exists or use a generic online placeholder if preferred
  if (src.startsWith('http') || src.startsWith('data:')) return src;

  // Assume relative path from backend (e.g., /uploads/...)
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, '') || 'http://localhost:2000';

  // Ensure strict slash handling
  const cleanPath = src.startsWith('/') ? src : `/${src}`;

  return `${baseUrl}${cleanPath}`;
}
