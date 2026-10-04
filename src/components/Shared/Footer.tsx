"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  FaFacebookF, 
  FaXTwitter, 
  FaYoutube, 
  FaLinkedinIn 
} from "react-icons/fa6";
import { FiArrowUp } from "react-icons/fi";

const toBanglaDigits = (str: string | number): string => {
  const banglaDigits: { [key: string]: string } = {
    "0": "০",
    "1": "১",
    "2": "২",
    "3": "৩",
    "4": "৪",
    "5": "৫",
    "6": "৬",
    "7": "৭",
    "8": "৮",
    "9": "৯"
  };
  return str.toString().replace(/[0-9]/g, (digit) => banglaDigits[digit] || digit);
};

const Footer: React.FC = () => {
  const currentYear = toBanglaDigits(new Date().getFullYear());

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-zinc-900 text-zinc-300 border-t border-zinc-800 mt-12 text-sm">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5">
          <Link href="/" className="inline-flex items-center gap-3 mb-3 group">
            <Image
              src="/logo.png"
              alt="Logo"
              width={40}
              height={40}
              className="w-10 h-10 object-contain"
            />
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-(--primary) transition-colors">
                দৈনিক
              </span>
              <span className="text-2xl font-black text-white">সংবাদ</span>
            </div>
          </Link>
          <p className="text-xs text-zinc-400 leading-relaxed mb-4 max-w-md">
            নিরপেক্ষ, বস্তুনিষ্ঠ ও আপসহীন সাংবাদিকতার অঙ্গীকার নিয়ে প্রতিদিন আপনাদের পাশে। সত্য সংবাদ প্রকাশে আমরা অবিচল।
          </p>
          <p className="text-xs text-zinc-500 mb-1">
            <span>ডেভেলপার: </span>
            <a
              href="https://www.linkedin.com/in/mrrakib5007"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-(--primary) transition-colors inline-block"
            >
              মোঃ রাকিব হোসেন
            </a>
          </p>
          <p className="text-xs text-zinc-500">কার্যালয়: উত্তরা, ঢাকা-১২৩০</p>
        </div>

        <div className="lg:col-span-2">
          <h4 className="text-white font-bold mb-3 border-l-2 border-(--primary) pl-2">জনপ্রিয় বিভাগ</h4>
          <ul className="space-y-1.5 text-xs text-zinc-400">
            <li>
              <Link href="/category/national" className="hover:text-(--primary) transition-colors">
                জাতীয় সংবাদ
              </Link>
            </li>
            <li>
              <Link href="/category/politics" className="hover:text-(--primary) transition-colors">
                রাজনীতি পর্যালোচনা
              </Link>
            </li>
            <li>
              <Link href="/category/economy" className="hover:text-(--primary) transition-colors">
                অর্থনীতি ও শেয়ারবাজার
              </Link>
            </li>
            <li>
              <Link href="/category/sports" className="hover:text-(--primary) transition-colors">
                ক্রিকেট ও ফুটবল
              </Link>
            </li>
            <li>
              <Link href="/category/technology" className="hover:text-(--primary) transition-colors">
                প্রযুক্তি ও উদ্ভাবন
              </Link>
            </li>
          </ul>
        </div>

        <div className="lg:col-span-2">
          <h4 className="text-white font-bold mb-3 border-l-2 border-(--primary) pl-2">অন্যান্য সেবা</h4>
          <ul className="space-y-1.5 text-xs text-zinc-400">
            <li>
              <Link href="/epaper" className="hover:text-(--primary) transition-colors">
                অনলাইন ই-পেপার
              </Link>
            </li>
            <li>
              <Link href="/advertisement" className="hover:text-(--primary) transition-colors">
                বিজ্ঞাপন মূল্য তালিকা
              </Link>
            </li>
            <li>
              <Link href="/privacy-policy" className="hover:text-(--primary) transition-colors">
                গোপনীয়তা ও নীতিমালা
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-(--primary) transition-colors">
                যোগাযোগ ও বার্তা পাঠান
              </Link>
            </li>
            <li>
              <Link href="/archive" className="hover:text-(--primary) transition-colors">
                আর্কাইভ ও পুরোনো সংবাদ
              </Link>
            </li>
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h4 className="text-white font-bold mb-3 border-l-2 border-(--primary) pl-2">আমাদের সাথে যুক্ত থাকুন</h4>
          <p className="text-xs text-zinc-400 mb-3">সোশ্যাল মিডিয়ায় সর্বশেষ সংবাদের সাথে থাকুন সবসময়।</p>
          <div className="flex gap-2">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-(--primary) transition-colors text-white"
              aria-label="Facebook"
            >
              <FaFacebookF className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-(--primary) transition-colors text-white"
              aria-label="X (Twitter)"
            >
              <FaXTwitter className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-(--primary) transition-colors text-white"
              aria-label="YouTube"
            >
              <FaYoutube className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-(--primary) transition-colors text-white"
              aria-label="LinkedIn"
            >
              <FaLinkedinIn className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-zinc-800 py-4 px-4 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <p>© {currentYear} দৈনিক সংবাদ। সর্বস্বত্ব সংরক্ষিত।</p>
          <button
            onClick={scrollToTop}
            className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
          >
            শীর্ষে ফিরে যান <FiArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;