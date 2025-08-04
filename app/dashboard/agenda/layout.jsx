export const metadata = {
    title: "Agenda",
    description:
        "Organize your daily agenda and prioritize your most important tasks. Stay focused on what matters most with smart agenda management.",
    keywords: [
        "agenda",
        "prioritization",
        "daily planning",
        "focus",
        "important tasks",
        "productivity",
        "organization",
    ],
    openGraph: {
        title: "Agenda | Focus Mint",
        description:
            "Organize your daily agenda and prioritize your most important tasks. Stay focused on what matters most.",
        url: "https://focusmint.com/dashboard/agenda",
        siteName: "Focus Mint",
        images: [
            {
                url: "/img/optimized/logo_1200x630.webp",
                width: 1200,
                height: 630,
                alt: "Focus Mint - Daily Agenda Planning and Prioritization",
                type: "image/webp",
            },
            {
                url: "/img/optimized/logo_1200x630.png",
                width: 1200,
                height: 630,
                alt: "Focus Mint - Daily Agenda Planning and Prioritization",
                type: "image/png",
            },
        ],
        locale: "en_US",
        type: "website",
        section: "Productivity",
        tags: [
            "agenda",
            "prioritization",
            "daily planning",
            "focus",
            "important tasks",
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Agenda | Focus Mint",
        description:
            "Organize your daily agenda and prioritize your most important tasks. Stay focused on what matters most.",
        images: [
            {
                url: "/img/optimized/logo_1200x630.webp",
                alt: "Focus Mint - Daily Agenda Planning and Prioritization",
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
                iphone: "focusmint://dashboard/agenda",
                ipad: "focusmint://dashboard/agenda",
                googleplay: "focusmint://dashboard/agenda",
            },
        },
    },
};

export default function AgendaLayout({ children }) {
    return children;
}
