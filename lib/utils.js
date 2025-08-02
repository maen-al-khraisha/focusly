import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

/**
 * Get color classes for task status
 * @param {string} status - The task status
 * @returns {object} Object with text and background color classes
 */
export function getStatusColors(status) {
    switch (status) {
        case "active":
            return {
                text: "text-blue-700",
                textbg: "bg-blue-600",
                bg: "bg-blue-100",
                border: "border-blue-200",
            };
        case "completed":
            return {
                text: "text-green-700",
                textbg: "bg-green-600",
                bg: "bg-green-100",
                border: "border-green-200",
            };
        default:
            return {
                text: "text-blue-700",
                textbg: "bg-blue-600",
                bg: "bg-blue-100",
                border: "border-blue-200",
            };
    }
}

/**
 * Get status display text
 * @param {string} status - The task status
 * @returns {string} Human readable status text
 */
export function getStatusText(status) {
    switch (status) {
        case "active":
            return "Active";
        case "completed":
            return "Completed";
        default:
            return "Active";
    }
}
