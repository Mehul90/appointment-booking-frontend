import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export function createPageUrl(pageName) {
    return '/' + pageName.toLowerCase().replace(/ /g, '-');
}

export function userLogout() {
    localStorage.clear();
    window.location.href = '/login';
}

export function cn(...inputs) {
  return twMerge(clsx(inputs))
} 