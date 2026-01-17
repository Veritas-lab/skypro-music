import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ReduxProvider from "../Store/ReduxProvider";
import FetchingTracks from "@/components/FetchingTracks/FetchingTracks";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Music App",
  description: "Music streaming application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Оборачиваем все приложение в ReduxProvider */}
        <ReduxProvider>
          <FetchingTracks />
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
