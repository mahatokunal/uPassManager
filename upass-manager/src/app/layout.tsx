/**
 * @file Root layout component for the UPass Manager application
 * @description Provides the foundation layout structure for all pages
 * @module app/layout
 */

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LoadingProvider } from "./context/LoadingContext";

/**
 * Geist Sans font configuration
 * @constant
 */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

/**
 * Geist Mono font configuration for monospace text
 * @constant
 */
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * Metadata for the application (title, description, etc.)
 * @type {Metadata}
 */
export const metadata: Metadata = {
  title: "UPass Manager",
  description: "Application for managing student UPass cards",
};

/**
 * Root layout component that wraps all pages in the application
 * Provides global fonts and context providers
 * 
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render
 * @returns {React.ReactElement} The root layout structure
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LoadingProvider>
          {children}
        </LoadingProvider>
      </body>
    </html>
  );
}
