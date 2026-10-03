"use client";

import React from "react";
import Link from "next/link";

interface BreakingNewsItem {
  id: number;
  title: string;
}

const BREAKING_NEWS_ITEMS: readonly BreakingNewsItem[] = [
  { id: 1, title: "পদ্মা সেতুতে নতুন রেকর্ড পরিমাণ রাজস্ব আদায়" },
  { id: 2, title: "তিস্তা মহাপরিকল্পনা বাস্তবায়নে নতুন অর্থায়ন চুক্তি চূড়ান্ত" },
  { id: 3, title: "ঢাকায় মেট্রোরেলের নতুন রুট চালু হচ্ছে আগামী মাসেই" },
  { id: 4, title: "টি-টোয়েন্টি সিরিজে বাংলাদেশের ঐতিহাসিক জয়" },
  { id: 5, title: "রূপপুর পারমাণবিক বিদ্যুৎ কেন্দ্রের দ্বিতীয় ইউনিটের চুল্লি স্থাপন সম্পন্ন" },
];

const BreakingNews: React.FC = () => {
  return (
    <div className="bg-red-50 dark:bg-zinc-900 border-b border-red-100 dark:border-zinc-800 text-sm overflow-hidden py-1 select-none">
      <div className="max-w-7xl mx-auto px-4 flex items-center">
        
        <div className="shrink-0 z-10 flex items-center gap-1.5 bg-primary text-white text-xs px-2.5 py-1 rounded-md font-bold shadow-xs mr-3">
          <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>          
          <span>জরুরি সংবাদ</span>
        </div>

        <div className="relative w-full overflow-hidden flex items-center">
          <div className="animate-marquee whitespace-nowrap text-zinc-800 dark:text-zinc-200 text-xs sm:text-sm font-medium cursor-pointer">
            {BREAKING_NEWS_ITEMS.map((item: BreakingNewsItem, index: number) => (
              <span key={item.id} className="inline-flex items-center">
                <Link
                  href={`/news/${item.id}`}
                  className="hover:text-primary hover:underline underline-offset-4 decoration-primary transition-colors mx-3"
                >
                  {item.title}
                </Link>
                {index !== BREAKING_NEWS_ITEMS.length - 1 && (
                  <span className="text-primary font-black mx-1">•</span>
                )}
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default BreakingNews;