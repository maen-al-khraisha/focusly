import { SignUp } from "@clerk/nextjs";

export const metadata = {
    title: "Sign Up",
    description:
        "Create your Focus Mint account and start your productivity journey. Join thousands of users managing tasks, habits, and goals.",
    keywords: [
        "sign up",
        "register",
        "create account",
        "productivity",
        "join",
        "new user",
    ],
    openGraph: {
        title: "Sign Up | Focus Mint",
        description:
            "Create your Focus Mint account and start your productivity journey.",
        url: "https://focusmint.com/sign-up",
        siteName: "Focus Mint",
        images: [
            {
                url: "/img/optimized/logo_1200x630.webp",
                width: 1200,
                height: 630,
                alt: "Focus Mint - Create Your Productivity Account",
                type: "image/webp",
            },
            {
                url: "/img/optimized/logo_1200x630.png",
                width: 1200,
                height: 630,
                alt: "Focus Mint - Create Your Productivity Account",
                type: "image/png",
            },
        ],
        locale: "en_US",
        type: "website",
        section: "Authentication",
        tags: ["sign up", "register", "create account", "join"],
    },
    twitter: {
        card: "summary_large_image",
        title: "Sign Up | Focus Mint",
        description:
            "Create your Focus Mint account and start your productivity journey.",
        images: [
            {
                url: "/img/optimized/logo_1200x630.webp",
                alt: "Focus Mint - Create Your Productivity Account",
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
                iphone: "focusmint://sign-up",
                ipad: "focusmint://sign-up",
                googleplay: "focusmint://sign-up",
            },
        },
    },
};

export default function SignUpPage() {
    return (
        <div className='flex min-h-screen items-center justify-center bg-gray-50'>
            <SignUp />
        </div>
    );
}
