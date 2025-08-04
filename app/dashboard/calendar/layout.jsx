export const metadata = {
    title: "Calendar",
    description:
        "Plan your schedule and track important dates with our integrated calendar. Stay on top of deadlines and manage your time effectively.",
    keywords: [
        "calendar",
        "scheduling",
        "planning",
        "deadlines",
        "time management",
        "events",
        "appointments",
    ],
    openGraph: {
        title: "Calendar | Focus Mint",
        description:
            "Plan your schedule and track important dates with our integrated calendar. Stay on top of deadlines.",
        url: "https://focusmint.com/dashboard/calendar",
        siteName: "Focus Mint",
        images: [
            {
                url: "/img/optimized/logo_1200x630.webp",
                width: 1200,
                height: 630,
                alt: "Focus Mint - Smart Calendar Management and Scheduling",
                type: "image/webp",
            },
            {
                url: "/img/optimized/logo_1200x630.png",
                width: 1200,
                height: 630,
                alt: "Focus Mint - Smart Calendar Management and Scheduling",
                type: "image/png",
            },
        ],
        locale: "en_US",
        type: "website",
        section: "Productivity",
        tags: [
            "calendar",
            "scheduling",
            "planning",
            "deadlines",
            "time management",
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Calendar | Focus Mint",
        description:
            "Plan your schedule and track important dates with our integrated calendar. Stay on top of deadlines.",
        images: [
            {
                url: "/img/optimized/logo_1200x630.webp",
                alt: "Focus Mint - Smart Calendar Management and Scheduling",
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
                iphone: "focusmint://dashboard/calendar",
                ipad: "focusmint://dashboard/calendar",
                googleplay: "focusmint://dashboard/calendar",
            },
        },
    },
};

export default function CalendarLayout({ children }) {
    return children;
}
