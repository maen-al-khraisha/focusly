import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import ImagePerformanceMonitor from "@/components/ImagePerformanceMonitor";
import { PerformanceMonitor } from "@/components/PerformanceMonitor";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Focus Mint - Your All-in-One Productivity Companion",
    description:
        "Transform your productivity with Focus Mint. Manage tasks, track time, and achieve your goals with our comprehensive productivity suite.",
    keywords:
        "productivity, task management, time tracking, focus, goals, organization",
    authors: [{ name: "Focus Mint Team" }],
    creator: "Focus Mint",
    publisher: "Focus Mint",
    robots: "index, follow",
    openGraph: {
        title: "Focus Mint - Your All-in-One Productivity Companion",
        description:
            "Transform your productivity with Focus Mint. Manage tasks, track time, and achieve your goals with our comprehensive productivity suite.",
        url: "https://focusmint.com",
        siteName: "Focus Mint",
        images: [
            {
                url: "/img/optimized/logo_1200x630.png",
                width: 1200,
                height: 630,
                alt: "Focus Mint - Productivity App",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Focus Mint - Your All-in-One Productivity Companion",
        description:
            "Transform your productivity with Focus Mint. Manage tasks, track time, and achieve your goals with our comprehensive productivity suite.",
        images: ["/img/optimized/logo_1200x630.png"],
    },
    viewport: "width=device-width, initial-scale=1",
    themeColor: "#000000",
    manifest: "/manifest.json",
};

export default function RootLayout({ children }) {
    return (
        <html lang='en'>
            <head>
                <link rel='icon' href='/favicon.ico' />
                <link rel='apple-touch-icon' href='/apple-touch-icon.png' />
                <link rel='manifest' href='/manifest.json' />
                <meta name='theme-color' content='#000000' />
                <meta name='apple-mobile-web-app-capable' content='yes' />
                <meta
                    name='apple-mobile-web-app-status-bar-style'
                    content='default'
                />
                <meta name='apple-mobile-web-app-title' content='Focus Mint' />
                <meta name='msapplication-TileColor' content='#000000' />
                <meta
                    name='msapplication-config'
                    content='/browserconfig.xml'
                />
                <link rel='preconnect' href='https://fonts.googleapis.com' />
                <link
                    rel='preconnect'
                    href='https://fonts.gstatic.com'
                    crossOrigin='anonymous'
                />
                <link rel='preconnect' href='https://clerk.com' />
            </head>
            <body className={inter.className}>
                <PerformanceMonitor>
                    <ClerkProvider>{children}</ClerkProvider>
                </PerformanceMonitor>
                {process.env.NODE_ENV === "development" && (
                    <ImagePerformanceMonitor />
                )}
            </body>
        </html>
    );
}
