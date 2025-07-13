"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function DarkModeToggle({ className }) {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const storedTheme = localStorage.getItem("theme");
        if (storedTheme === "dark") {
            document.documentElement.classList.add("dark");
            setIsDark(true);
        }
    }, []);

    const toggleTheme = () => {
        const root = document.documentElement;
        const newTheme = isDark ? "light" : "dark";

        root.classList.toggle("dark", newTheme === "dark");
        localStorage.setItem("theme", newTheme);
        setIsDark(!isDark);
    };

    return (
        <button
            onClick={toggleTheme}
            className={`${className} relative inline-flex h-6 w-12 items-center rounded-full transition-colors duration-300 ${
                isDark ? "bg-cyan-500" : "bg-gray-300"
            }`}>
            <span
                className={`absolute left-0 top-0 h-6 w-12 rounded-full border border-border transition ${
                    isDark ? "bg-cyan-500" : "bg-gray-300"
                }`}
            />
            <span
                className={`z-10 inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-1 ring-gray-300 transition-transform duration-300 ${
                    isDark ? "translate-x-6" : "translate-x-1"
                }`}>
                {isDark ? (
                    <Moon className='h-4 w-4 text-cyan-800 mx-auto mt-0.5' />
                ) : (
                    <Sun className='h-4 w-4 text-yellow-500 mx-auto mt-0.5' />
                )}
            </span>
        </button>
    );
}
