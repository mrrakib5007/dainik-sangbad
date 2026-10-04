import type { Metadata } from "next";
import { Anek_Bangla } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Shared/Navbar";
import NavLinks from "@/components/Shared/NavLinks";

const anekBangla = Anek_Bangla({
  variable: "--font-anek-bangla",
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "দৈনিক সংবাদ | সত্য ও নির্ভীক সংবাদ প্রতিদিন",
  description: "বাংলাদেশ ও আন্তর্জাতিক সর্বশেষ খবর, রাজনীতি, অর্থনীতি, খেলাধুলা, বিনোদন এবং প্রযুক্তির তাজা সংবাদ নিয়ে সত্য ও বস্তুনিষ্ঠ সাংবাদিকতার প্রতীক দৈনিক সংবাদ।",
  keywords: [
    "দৈনিক সংবাদ",
    "বাংলাদেশ সংবাদ",
    "তাজা খবর",
    "বাংলা নিউজ",
    "রাজনীতি",
    "খেলাধুলা",
    "অর্থনীতি",
    "আন্তর্জাতিক খবর"
  ],
  openGraph: {
    title: "দৈনিক সংবাদ | সত্য ও নির্ভীক সংবাদ প্রতিদিন",
    description: "বাংলাদেশ ও সারাবিশ্বের সর্বশেষ তাজা সংবাদ, বস্তুনিষ্ঠ বিশ্লেষণ ও বিশেষ প্রতিবেদন।",
    url: "https://dainiksangbad.com",
    siteName: "দৈনিক সংবাদ",
    locale: "bn_BD",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "দৈনিক সংবাদ",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "দৈনিক সংবাদ | সত্য ও নির্ভীক সংবাদ প্রতিদিন",
    description: "বাংলাদেশ ও আন্তর্জাতিক সর্বশেষ তাজা সংবাদ ও বস্তুনিষ্ঠ বিশ্লেষণ।",
    images: ["/logo.png"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${anekBangla.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Navbar
          navLinks={<NavLinks isMobile={false} />}
          mobileNavLinks={<NavLinks isMobile={true} />}
        />        
        {children}
      </body>
    </html>
  );
}
