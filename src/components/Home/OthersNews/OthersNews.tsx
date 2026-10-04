"use client";

import React from "react";
import PostCard, { PostItem } from "@/components/Cards/PostCard";

export interface NewsSection {
  title: string;
  curationId?: string;
  curationType?: string;
  link?: string | null;
  count?: number;
  articles?: PostItem[];
}

interface OthersNewsProps {
  news?: NewsSection[] | null;
}

const BLOCKED_KEYWORDS = [
  "হোয়াটসঅ্যাপ",
  "whatsapp",
  "ইন্সটাগ্রাম",
  "instagram",
  "সামাজিক মাধ্যম",
  "social media",
  "ফলো করুন",
  "চ্যানেল"
];

const OthersNews: React.FC<OthersNewsProps> = ({ news }) => {
  if (!news || !Array.isArray(news) || news.length === 0) {
    return null;
  }

  const sectionsWithArticles = news.filter((section) => {
    if (!section || !section.articles || !Array.isArray(section.articles)) {
      return false;
    }

    const titleLower = (section.title || "").toLowerCase();
    const isBlocked = BLOCKED_KEYWORDS.some((kw) => titleLower.includes(kw));
    if (isBlocked) {
      return false;
    }

    const validItems = section.articles.filter((item) => {
      if (!item || !item.id || !item.title) return false;
      const itemTitle = item.title.toLowerCase();
      return !BLOCKED_KEYWORDS.some((kw) => itemTitle.includes(kw));
    });

    return validItems.length > 0;
  });

  if (sectionsWithArticles.length === 0) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-14 py-8">
      {sectionsWithArticles.map((section, sectionIdx) => {
        const validArticles = (section.articles || []).filter((item): item is PostItem => {
          if (!item || !item.id || !item.title) return false;
          const itemTitle = item.title.toLowerCase();
          return !BLOCKED_KEYWORDS.some((kw) => itemTitle.includes(kw));
        });

        if (validArticles.length === 0) return null;

        return (
          <section key={section.curationId || `${section.title}-${sectionIdx}`}>
            <div className="flex items-center pb-3 mb-6 border-b-2 border-(--primary)">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-(--primary) rounded-full inline-block"></span>
                <h2 className="text-xl sm:text-2xl font-bold text-neutral-900">
                  {section.title}
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {validArticles.map((item) => (
                <PostCard
                  key={item.id}
                  post={item}
                  fallbackCategory={section.title}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default OthersNews;