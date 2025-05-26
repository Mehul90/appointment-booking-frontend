import clsx from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Generates a URL path for a given page name by converting it to lowercase
 * and replacing spaces with hyphens.
 *
 * @param {string} pageName - The name of the page to convert into a URL path.
 * @returns {string} The formatted URL path (e.g., "/my-page").
 */
export function createPageUrl(pageName) {
    return "/" + pageName.toLowerCase().replace(/ /g, "-");
}

/**
 * Logs out the current user by clearing all data from localStorage
 * and redirecting to the login page.
 */
export function userLogout() {
    localStorage.clear();
    window.location.href = "/login";
}

/**
 * Combines multiple class names into a single string, handling conditional and deduplicated classes.
 * Utilizes `clsx` for conditional className logic and `twMerge` for Tailwind CSS class deduplication.
 *
 * @param {...any} inputs - The class names, arrays, or objects to be merged.
 * @returns {string} The merged class name string.
 */
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}


/**
 * Checks if the user is authenticated by verifying the presence of a token in localStorage.
 *
 * @returns {boolean} Returns true if a token exists in localStorage, otherwise false.
 */
export function isAuthenticated() {
    // Replace with your authentication logic
    return localStorage.getItem("token") !== null;
};
