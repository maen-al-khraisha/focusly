import { SignIn } from "@clerk/nextjs";

export const metadata = {
    title: "Sign In",
    description:
        "Sign in to your Focus Mint account to access your productivity dashboard. Manage tasks, habits, notes, and more.",
    keywords: [
        "sign in",
        "login",
        "authentication",
        "account",
        "productivity",
        "dashboard",
    ],
    openGraph: {
        title: "Sign In | Focus Mint",
        description:
            "Sign in to your Focus Mint account to access your productivity dashboard.",
        url: "https://focusmint.com/sign-in",
        siteName: "Focus Mint",
        images: [
            {
                url: "/img/optimized/logo_1200x630.webp",
                width: 1200,
                height: 630,
                alt: "Focus Mint - Sign In to Your Productivity Account",
                type: "image/webp",
            },
            {
                url: "/img/optimized/logo_1200x630.png",
                width: 1200,
                height: 630,
                alt: "Focus Mint - Sign In to Your Productivity Account",
                type: "image/png",
            },
        ],
        locale: "en_US",
        type: "website",
        section: "Authentication",
        tags: ["sign in", "login", "authentication", "account"],
    },
    twitter: {
        card: "summary_large_image",
        title: "Sign In | Focus Mint",
        description:
            "Sign in to your Focus Mint account to access your productivity dashboard.",
        images: [
            {
                url: "/img/optimized/logo_1200x630.webp",
                alt: "Focus Mint - Sign In to Your Productivity Account",
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
                iphone: "focusmint://sign-in",
                ipad: "focusmint://sign-in",
                googleplay: "focusmint://sign-in",
            },
        },
    },
};

export default function SignInPage() {
    return (
        <div className='flex min-h-screen items-center justify-center bg-gray-50'>
            <SignIn />
        </div>
    );
}
