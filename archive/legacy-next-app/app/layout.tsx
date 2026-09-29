import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteLayout } from "@/components/layout";
import { getCurrentUser } from "@/lib/auth/session.server";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nextvacancy.com";

export const viewport: Viewport = {
  themeColor: "#850A42",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "NEXTVACANCY — Latest Government Jobs, Private Jobs, Results & Admit Cards 2026",
    template: "%s | NEXTVACANCY",
  },
  description:
    "Fast, reliable, and verified recruitment alerts, government jobs (Sarkari Naukri), private vacancies, admit cards, exam dates, answer keys, and results across India.",
  applicationName: "NEXTVACANCY",
  authors: [
    {
      name: "NEXTVACANCY Editorial & Verification Team",
      url: siteUrl,
    },
  ],
  creator: "NEXTVACANCY",
  publisher: "NEXTVACANCY",
  referrer: "strict-origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  category: "Recruitment & Education",
  keywords: [
    "Government Jobs 2026",
    "Sarkari Naukri",
    "SSC CGL 2026",
    "UPSC Civil Services",
    "Railway RRB NTPC",
    "Bank PO Jobs",
    "Private IT Careers",
    "Admit Cards Download",
    "Exam Results 2026",
    "Scholarships in India",
    "PM Internship Scheme",
    "Answer Keys",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "./",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  openGraph: {
    title: "NEXTVACANCY — Latest Government Jobs, Private Jobs, Results & Admit Cards 2026",
    description:
      "Fast, reliable, and verified recruitment alerts, government jobs (Sarkari Naukri), private vacancies, admit cards, exam dates, answer keys, and results across India.",
    url: siteUrl,
    siteName: "NEXTVACANCY",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/favicon.ico",
        width: 1200,
        height: 630,
        alt: "NEXTVACANCY — Recruitment & Job Portal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NEXTVACANCY — Latest Government Jobs & Career Alerts",
    description:
      "Direct official links to apply for latest government jobs, admit cards, and exam results in India.",
    creator: "@nextvacancy",
    images: ["/favicon.ico"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentUser = await getCurrentUser();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SiteLayout currentUser={currentUser}>{children}</SiteLayout>
      </body>
    </html>
  );
}
