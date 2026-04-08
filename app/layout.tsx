import type { Metadata } from "next";
import "./globals.css";

function getSiteUrl() {
  const explicitUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicitUrl) {
    return explicitUrl.startsWith("http") ? explicitUrl : `https://${explicitUrl}`;
  }

  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl) {
    return `https://${vercelUrl}`;
  }

  return "http://localhost:3000";
}

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  icons: {
    icon: "/images/logo.png",
    shortcut: "/images/logo.png",
    apple: "/images/logo.png"
  },
  title: {
    default: "जीत अपडेट न्यूज़",
    template: "%s | जीत अपडेट न्यूज़"
  },
  description:
    "जीत अपडेट न्यूज़ पर पढ़ें ताज़ा हिंदी खबरें, ब्रेकिंग न्यूज़, राजनीति, खेल, दुनिया, व्यापार और प्रमुख सुर्खियां।",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "जीत अपडेट न्यूज़",
    description:
      "ताज़ा हिंदी खबरें, ब्रेकिंग न्यूज़, प्रमुख सुर्खियां और श्रेणीवार समाचार एक जगह।",
    type: "website",
    locale: "hi_IN",
    siteName: "जीत अपडेट न्यूज़"
  },
  twitter: {
    card: "summary_large_image",
    title: "जीत अपडेट न्यूज़",
    description:
      "ताज़ा हिंदी खबरें, ब्रेकिंग न्यूज़, प्रमुख सुर्खियां और श्रेणीवार समाचार एक जगह।"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hi">
      <body>{children}</body>
    </html>
  );
}
