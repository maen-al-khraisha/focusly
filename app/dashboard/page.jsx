import { auth } from "@clerk/nextjs/server";

export const metadata = {
    title: "Dashboard",
    description:
        "Your productivity dashboard - manage tasks, habits, notes, calendar, and agenda in one place. Stay organized and achieve your goals.",
    keywords: [
        "dashboard",
        "productivity",
        "overview",
        "management",
        "organization",
        "goals",
    ],
    openGraph: {
        title: "Dashboard | Focus Mint",
        description:
            "Your productivity dashboard - manage tasks, habits, notes, calendar, and agenda in one place.",
        url: "https://focusmint.com/dashboard",
        siteName: "Focus Mint",
        images: [
            {
                url: "/img/optimized/logo_1200x630.webp",
                width: 1200,
                height: 630,
                alt: "Focus Mint - Your Productivity Dashboard Hub",
                type: "image/webp",
            },
            {
                url: "/img/optimized/logo_1200x630.png",
                width: 1200,
                height: 630,
                alt: "Focus Mint - Your Productivity Dashboard Hub",
                type: "image/png",
            },
        ],
        locale: "en_US",
        type: "website",
        section: "Productivity",
        tags: ["dashboard", "productivity", "overview", "management"],
    },
    twitter: {
        card: "summary_large_image",
        title: "Dashboard | Focus Mint",
        description:
            "Your productivity dashboard - manage tasks, habits, notes, calendar, and agenda in one place.",
        images: [
            {
                url: "/img/optimized/logo_1200x630.webp",
                alt: "Focus Mint - Your Productivity Dashboard Hub",
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
                iphone: "focusmint://dashboard",
                ipad: "focusmint://dashboard",
                googleplay: "focusmint://dashboard",
            },
        },
    },
};

export default function Dashboard() {
    const { userId } = auth();
    if (!userId) return null;
    return (
        <div>
            <h1>Welcome to your Dashboard</h1>
        </div>
    );
}
