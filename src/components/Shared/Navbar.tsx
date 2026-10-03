"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { HiMenu, HiX } from "react-icons/hi";
import { FiUser, FiLogIn } from "react-icons/fi";
import { BsCalendar3, BsClock } from "react-icons/bs";

interface NavCategory {
  readonly id: string;
  readonly name: string;
  readonly path: string;
}

const NAV_CATEGORIES: readonly NavCategory[] = [
  { id: "all", name: "সর্বশেষ", path: "/" },
  { id: "national", name: "জাতীয়", path: "/category/national" },
  { id: "politics", name: "রাজনীতি", path: "/category/politics" },
  { id: "economy", name: "অর্থনীতি", path: "/category/economy" },
  { id: "international", name: "আন্তর্জাতিক", path: "/category/international" },
  { id: "sports", name: "খেলাধুলা", path: "/category/sports" },
  { id: "entertainment", name: "বিনোদন", path: "/category/entertainment" },
  { id: "tech", name: "প্রযুক্তি", path: "/category/tech" },
  { id: "opinion", name: "মতামত", path: "/category/opinion" },
];

const banglaNumbers: Record<string, string> = {
  "0": "০", "1": "১", "2": "২", "3": "৩", "4": "৪",
  "5": "৫", "6": "৬", "7": "৭", "8": "৮", "9": "৯"
};

const toBanglaDigits = (str: string | number): string => {
  return str.toString().replace(/[0-9]/g, (match: string) => banglaNumbers[match] || match);
};

const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [currentDate, setCurrentDate] = useState<string>("");
  const [currentTime, setCurrentTime] = useState<string>("");
  const pathname: string = usePathname();

  useEffect(() => {
    const updateTime = (): void => {
      const now = new Date();
      const banglaDays: readonly string[] = [
        "রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার", "শুক্রবার", "শনিবার"
      ];
      const banglaMonths: readonly string[] = [
        "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
        "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"
      ];

      const day: string = banglaDays[now.getDay()];
      const dateNum: string = toBanglaDigits(now.getDate());
      const month: string = banglaMonths[now.getMonth()];
      const year: string = toBanglaDigits(now.getFullYear());
      setCurrentDate(`ঢাকা, ${day}, ${dateNum} ${month} ${year}`);

      let hours: number = now.getHours();
      const minutes: string = toBanglaDigits(String(now.getMinutes()).padStart(2, "0"));
      const period: string = hours >= 12 ? "বিকাল / সন্ধ্যা" : hours >= 6 ? "সকাল" : "রাত";
      if (hours > 12) hours -= 12;
      if (hours === 0) hours = 12;
      setCurrentTime(`${period} ${toBanglaDigits(hours)}:${minutes}`);
    };

    updateTime();
    const interval: NodeJS.Timeout = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-40 w-full bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between gap-4">
        
        <Link href="/" className="group flex items-center gap-3 select-none">
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden shadow-md shrink-0">
            <Image
              src="/logo.png"
              alt="দৈনিক সংবাদ লোগো"
              fill
              priority
              sizes="(max-width: 640px) 40px, 44px"
              className="object-contain"
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5 leading-none">
              <span className="text-2xl sm:text-3xl font-black text-primary tracking-tight">দৈনিক</span>
              <span className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight">সংবাদ</span>
            </div>
            <span className="text-[10px] sm:text-[11px] text-zinc-500 font-medium tracking-wide">
              সত্য ও বস্তুনিষ্ঠ সাংবাদিকতার প্রতীক
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3 sm:gap-6">
          <div className="hidden lg:flex flex-col text-right font-medium text-xs text-zinc-600 dark:text-zinc-400 border-r border-zinc-200 dark:border-zinc-800 pr-5">
            <div className="flex items-center justify-end gap-1.5 text-zinc-800 dark:text-zinc-200">
              <BsCalendar3 className="w-3.5 h-3.5 text-primary" />
              <span>{currentDate || "তারিখ লোড হচ্ছে..."}</span>
            </div>
            <div className="flex items-center justify-end gap-1.5 text-[11px] text-zinc-500 mt-0.5">
              <BsClock className="w-3 h-3 text-zinc-400" />
              <span>{currentTime}</span>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-200 hover:text-primary dark:hover:text-primary transition"
            >
              <FiLogIn className="w-3.5 h-3.5" />
              লগইন
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-primary hover:bg-primary-hover rounded-lg transition shadow-xs"
            >
              <FiUser className="w-3.5 h-3.5" />
              নিবন্ধন
            </Link>
          </div>

          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            aria-label="Open Navigation Menu"
          >
            <HiMenu className="w-6 h-6" />
          </button>
        </div>
      </div>

      <nav className="hidden lg:block bg-primary-hover dark:bg-deep-primary text-white shadow-inner overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto px-4 flex items-center space-x-1 font-semibold text-sm whitespace-nowrap">
          {NAV_CATEGORIES.map((cat: NavCategory) => {
            const isActive: boolean = pathname === cat.path;
            return (
              <Link
                key={cat.id}
                href={cat.path}
                className={`py-2.5 px-3.5 border-b-2 transition ${
                  isActive
                    ? "bg-deep-primary border-white"
                    : "border-transparent hover:bg-primary"
                }`}
              >
                {cat.name}
              </Link>
            );
          })}
        </div>
      </nav>

      <div
        onClick={() => setMobileMenuOpen(false)}
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity duration-300 lg:hidden ${
          mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      <div
        className={`fixed top-0 right-0 z-50 h-full w-70 max-w-[85vw] bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col justify-between transition-transform duration-300 ease-in-out lg:hidden ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 select-none"
          >
            <div className="relative w-8 h-8 rounded-lg overflow-hidden shadow-xs shrink-0">
              <Image
                src="/logo.png"
                alt="দৈনিক সংবাদ লোগো"
                fill
                sizes="32px"
                className="object-contain"
              />
            </div>
            <div className="flex items-baseline gap-1 leading-none">
              <span className="text-lg font-black text-primary tracking-tight">দৈনিক</span>
              <span className="text-lg font-black text-zinc-900 dark:text-white tracking-tight">সংবাদ</span>
            </div>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-800 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            aria-label="Close Navigation Menu"
          >
            <HiX className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          {NAV_CATEGORIES.map((cat: NavCategory) => {
            const isActive: boolean = pathname === cat.path;
            return (
              <Link
                key={cat.id}
                href={cat.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-semibold transition ${
                  isActive
                    ? "bg-primary text-white shadow-xs"
                    : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
              >
                <span>{cat.name}</span>
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 space-y-3 bg-zinc-50/60 dark:bg-zinc-950/40">
          <div className="flex flex-col gap-1 text-[11px] text-zinc-500 dark:text-zinc-400">
            <div className="flex items-center gap-1.5">
              <BsCalendar3 className="w-3 h-3 text-primary" />
              <span>{currentDate}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <BsClock className="w-3 h-3 text-zinc-400" />
              <span>{currentTime}</span>
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 inline-flex items-center justify-center gap-1 py-2 text-xs font-semibold border border-zinc-300 dark:border-zinc-700 rounded-lg text-zinc-700 dark:text-zinc-200 hover:border-primary transition"
            >
              <FiLogIn className="w-3.5 h-3.5" />
              লগইন
            </Link>
            <Link
              href="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 inline-flex items-center justify-center gap-1 py-2 text-xs font-semibold bg-primary hover:bg-primary-hover text-white rounded-lg transition shadow-xs"
            >
              <FiUser className="w-3.5 h-3.5" />
              নিবন্ধন
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;