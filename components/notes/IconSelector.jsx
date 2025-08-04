"use client";

import {
    FolderOpen,
    BookOpen,
    Edit,
    CheckSquare,
    Target,
    Clock,
    Play,
    Pause,
    Trash2,
    RotateCcw,
    Heart,
    Dumbbell,
    Coffee,
    Brain,
    Music,
    Camera,
    Palette,
    Code,
    Globe,
    Home,
    Car,
    Plane,
    Gamepad2,
    Utensils,
    ShoppingBag,
    Gift,
    Star,
    Zap,
    Moon,
    Sun,
    Cloud,
    Leaf,
} from "lucide-react";

const iconMap = {
    FolderOpen,
    BookOpen,
    Edit,
    CheckSquare,
    Target,
    Clock,
    Play,
    Pause,
    Trash2,
    RotateCcw,
    Heart,
    Dumbbell,
    Coffee,
    Brain,
    Music,
    Camera,
    Palette,
    Code,
    Globe,
    Home,
    Car,
    Plane,
    Gamepad2,
    Utensils,
    ShoppingBag,
    Gift,
    Star,
    Zap,
    Moon,
    Sun,
    Cloud,
    Leaf,
};

export default function IconSelector({ selectedIcon, onIconSelect }) {
    return (
        <div className='grid grid-cols-8 gap-2 max-h-60 overflow-y-auto border rounded-lg p-4'>
            {Object.entries(iconMap).map(([iconName, IconComponent]) => (
                <button
                    key={iconName}
                    onClick={() => onIconSelect(iconName)}
                    className={`p-2 rounded-lg border-2 transition-colors ${
                        selectedIcon === iconName
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                    }`}>
                    <IconComponent className='h-5 w-5' />
                </button>
            ))}
        </div>
    );
}
