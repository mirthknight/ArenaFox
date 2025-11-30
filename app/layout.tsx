import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });

export const metadata: Metadata = {
  title: "ArenaFox Smart Kingshot Player Tracker and Event Manager",
  description:
    "ArenaFox is a simple and smart tool for Kingshot alliances. Detect player names from screenshots, store profiles, track events, and maintain participation history.",
  applicationName: "ArenaFox",
  keywords: [
    "ArenaFox",
    "Kingshot",
    "alliance manager",
    "player tracker",
    "event history",
    "screenshot detection",
  ],
  openGraph: {
    title: "ArenaFox Smart Kingshot Player Tracker and Event Manager",
    description:
      "ArenaFox is built to help Kingshot alliances manage their members and events in a clear and organized way. You can detect player names and profiles from screenshots, copy or upload images, and store player information manually. The app allows you to add or remove players, track their power, update details, and maintain a full history of who joined which event.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ArenaFox Smart Kingshot Player Tracker and Event Manager",
    description:
      "ArenaFox is a simple and smart tool for Kingshot alliances. Detect player names from screenshots, store profiles, track events, and maintain participation history.",
  },
  other: {
    tagline: "Track players manage events and organize your alliance easily",
    longDescription:
      "ArenaFox is built to help Kingshot alliances manage their members and events in a clear and organized way. You can detect player names and profiles from screenshots, copy or upload images, and store player information manually. The app allows you to add or remove players, track their power, update details, and maintain a full history of who joined which event. The event calendar makes it easy to plan activities while the history tracker keeps records of every event a player participated in. ArenaFox gives alliance leaders a simple place to manage player data, participation logs, and performance insights without needing any external linking or automated connections.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable}`}>
      <body className="theme-dark">{children}</body>
    </html>
  );
}
