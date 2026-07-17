import "./globals.css";
import type { Metadata } from "next";
import { Martian_Mono, Schibsted_Grotesk, Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import LightRays from "./componants/LightRays";
import { NavBar } from "./componants/NavBar";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const martianMono = Martian_Mono({
  subsets: ["latin"],
  variable: "--font-martian-mono",
});

const schibstedGrotesk = Schibsted_Grotesk({
  subsets: ["latin"],
  variable: "--font-schibsted-grotesk",
});

export const metadata: Metadata = {
  title: "DevEvent",
  description: "Hub for every development",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-theme="winter"
      className={cn("font-sans", geist.variable)}
    >
      <body
        className={`${martianMono.variable} ${schibstedGrotesk.variable} min-h-screen antialiased font-martian-mono`}
      >
        <NavBar/>
        <div className="pointer-events-none absolute inset-0 top-0 min-h-screen">
          <LightRays
            raysOrigin="top-center"
            raysColor="#5dfeca"
            raysSpeed={0.5}
            lightSpread={0.9}
            rayLength={3}
            followMouse={true}
            mouseInfluence={0.02}
            noiseAmount={0}
            distortion={0}
            className="custom-rays"
            pulsating={false}
            fadeDistance={1}
            saturation={1}
          />
        </div>
        <main>{children}</main>
      </body>
    </html>
  );
}
