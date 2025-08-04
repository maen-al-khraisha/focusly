export const metadata = {
    title: "Habits",
    description:
        "Build consistent habits and track your progress with weekly monitoring. Transform your daily routines into lasting positive behaviors.",
    keywords: [
        "habits",
        "habit tracking",
        "routine",
        "consistency",
        "progress",
        "behavior change",
        "productivity",
    ],
    openGraph: {
        title: "Habits | Focus Mint",
        description:
            "Build consistent habits and track your progress with weekly monitoring. Transform your daily routines.",
        url: "https://focusmint.com/dashboard/habits",
        siteName: "Focus Mint",
        images: [
            {
                url: "/img/optimized/logo_1200x630.webp",
                width: 1200,
                height: 630,
                alt: "Focus Mint - Habit Tracking and Progress Monitoring",
                type: "image/webp",
            },
            {
                url: "/img/optimized/logo_1200x630.png",
                width: 1200,
                height: 630,
                alt: "Focus Mint - Habit Tracking and Progress Monitoring",
                type: "image/png",
            },
        ],
        locale: "en_US",
        type: "website",
        section: "Productivity",
        tags: [
            "habits",
            "habit tracking",
            "routine",
            "consistency",
            "progress",
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Habits | Focus Mint",
        description:
            "Build consistent habits and track your progress with weekly monitoring. Transform your daily routines.",
        images: [
            {
                url: "/img/optimized/logo_1200x630.webp",
                alt: "Focus Mint - Habit Tracking and Progress Monitoring",
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
                iphone: "focusmint://dashboard/habits",
                ipad: "focusmint://dashboard/habits",
                googleplay: "focusmint://dashboard/habits",
            },
        },
    },
};

export default function HabitsLayout({ children }) {
    return children;
}
