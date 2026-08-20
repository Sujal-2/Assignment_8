import type { Metadata } from "next";
import { DM_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
const dmSans=DM_Sans({variable:"--font-dm-sans",subsets:["latin"]});
const geistMono=Geist_Mono({variable:"--font-geist-mono",subsets:["latin"]});
export const metadata:Metadata={title:"MediStock Operations",description:"Medical sales, inventory, purchasing and reporting operations platform.",icons:{icon:"/favicon.svg",shortcut:"/favicon.svg"}};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en"><body className={`${dmSans.variable} ${geistMono.variable}`}>{children}</body></html>}
