export const metadata = {
    title: "Tasks",
    description:
        "Manage your tasks with built-in timers and detailed tracking. Stay organized and boost your productivity with smart task management.",
    keywords: [
        "task management",
        "productivity",
        "time tracking",
        "task organization",
        "focus",
        "workflow",
    ],
    openGraph: {
        title: "Tasks | Focus Mint",
        description:
            "Manage your tasks with built-in timers and detailed tracking. Stay organized and boost your productivity.",
        url: "https://focusmint.com/dashboard/tasks",
        siteName: "Focus Mint",
        images: [
            {
                url: "/img/optimized/logo_1200x630.webp",
                width: 1200,
                height: 630,
                alt: "Focus Mint - Smart Task Management with Built-in Timers",
                type: "image/webp",
            },
            {
                url: "/img/optimized/logo_1200x630.png",
                width: 1200,
                height: 630,
                alt: "Focus Mint - Smart Task Management with Built-in Timers",
                type: "image/png",
            },
        ],
        locale: "en_US",
        type: "website",
        section: "Productivity",
        tags: [
            "task management",
            "productivity",
            "time tracking",
            "organization",
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Tasks | Focus Mint",
        description:
            "Manage your tasks with built-in timers and detailed tracking. Stay organized and boost your productivity.",
        images: [
            {
                url: "/img/optimized/logo_1200x630.webp",
                alt: "Focus Mint - Smart Task Management with Built-in Timers",
                width: 1200,
                height: 630,
            },
        ],
        creator: "@focusmint",
        site: "@focusmint",
        creatorId: "1234567890",
        siteId: "1234567890",
        app: {
            name: {
                iphone: "Focus Mint",
                ipad: "Focus Mint",
                googleplay: "Focus Mint",
            },
            id: {
                iphone: "your-iphone-app-id",
                ipad: "your-ipad-app-id",
                googleplay: "your-android-app-id",
            },
            url: {
                iphone: "focusmint://dashboard/tasks",
                ipad: "focusmint://dashboard/tasks",
                googleplay: "focusmint://dashboard/tasks",
            },
        },
    },
};

export default function TasksLayout({ children }) {
    return children;
}
