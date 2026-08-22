import type { Metadata } from "next";
import { IBM_Plex_Sans_Thai, Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import Navbar from "@/components/Navbar";

const ibmPlexSansThai = IBM_Plex_Sans_Thai({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["thai", "latin"],
  variable: "--font-ibm-plex-sans-thai",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "มหาวิทยาลัยสวนดุสิต | Student Portfolio & Professional Network",
  description: "ระบบหนังสือเดินทางทักษะดิจิทัลและเครือข่ายวิชาชีพนักศึกษา มหาวิทยาลัยสวนดุสิต",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      className={`${ibmPlexSansThai.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <AuthProvider>
          <Navbar />
          <main className="flex-grow flex flex-col">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
