export const metadata = {
    title: "Notes",
    description:
        "Capture and organize your thoughts with quick notes. Keep important information at your fingertips and never lose an idea again.",
    keywords: [
        "notes",
        "note-taking",
        "organization",
        "ideas",
        "capture",
        "memory",
        "productivity",
    ],
    openGraph: {
        title: "Notes | Focus Mint",
        description:
            "Capture and organize your thoughts with quick notes. Keep important information at your fingertips.",
        url: "https://focusmint.com/dashboard/notes",
        siteName: "Focus Mint",
        images: [
            {
                url: "/img/optimized/logo_1200x630.webp",
                width: 1200,
                height: 630,
                alt: "Focus Mint - Smart Note Taking and Organization",
                type: "image/webp",
            },
            {
                url: "/img/optimized/logo_1200x630.png",
                width: 1200,
                height: 630,
                alt: "Focus Mint - Smart Note Taking and Organization",
                type: "image/png",
            },
        ],
        locale: "en_US",
        type: "website",
        section: "Productivity",
        tags: ["notes", "note-taking", "organization", "ideas", "capture"],
    },
    twitter: {
        card: "summary_large_image",
        title: "Notes | Focus Mint",
        description:
            "Capture and organize your thoughts with quick notes. Keep important information at your fingertips.",
        images: [
            {
                url: "/img/optimized/logo_1200x630.webp",
                alt: "Focus Mint - Smart Note Taking and Organization",
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
                iphone: "focusmint://dashboard/notes",
                ipad: "focusmint://dashboard/notes",
                googleplay: "focusmint://dashboard/notes",
            },
        },
    },
};

export default function NotesLayout({ children }) {
    return children;
}
