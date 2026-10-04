"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import PostCard, { PostItem } from "@/components/Cards/PostCard";

export type NewsItem = PostItem;

interface MainNewsProps {
  news?: NewsItem[] | null;
}

const FALLBACK_IMAGE =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='450' viewBox='0 0 800 450' fill='%23e5e7eb'><rect width='100%25' height='100%25' fill='%23f3f4f6'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='20' fill='%239ca3af'>ছবি পাওয়া যায়নি</text></svg>";

interface SafeImageProps {
  src?: string;
  alt: string;
  className?: string;
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
}

const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  className = "",
  fill = false,
  priority = false,
  sizes
}) => {
  const [imgSrc, setImgSrc] = useState<string>(src || FALLBACK_IMAGE);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill={fill}
      priority={priority}
      sizes={sizes}
      unoptimized
      onError={() => setImgSrc(FALLBACK_IMAGE)}
      className={className}
    />
  );
};

const formatDateTime = (dateString?: string): string => {
  if (!dateString) return "";
  try {
    return new Date(dateString).toLocaleString("bn-BD", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    });
  } catch {
    return "";
  }
};

const formatDateShort = (dateString?: string): string => {
  if (!dateString) return "";
  try {
    return new Date(dateString).toLocaleDateString("bn-BD", {
      day: "numeric",
      month: "short"
    });
  } catch {
    return "";
  }
};

const MainNews: React.FC<MainNewsProps> = ({ news }) => {
  if (!news || !Array.isArray(news) || news.length === 0) {
    return null;
  }

  const validNews = news.filter((item): item is NewsItem => Boolean(item && item.id));

  if (validNews.length === 0) {
    return null;
  }

  const topNews = validNews[0];
  const secondaryNews = validNews.slice(1, 5);
  const remainingNews = validNews.slice(5);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-12">
        <div className="lg:col-span-8 bg-white border border-neutral-200 rounded-2xl p-5">
          <Link
            href={`/article/${topNews.id}`}
            className="group block"
          >
            <div className="relative aspect-video overflow-hidden rounded-xl bg-neutral-100 mb-5">
              <SafeImage
                src={topNews.imageUrl}
                alt={topNews.imageAlt || topNews.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute top-4 left-4 bg-(--primary) text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm z-10">
                {topNews.category || "প্রধান খবর"}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 group-hover:text-(--primary) transition-colors leading-tight mb-3">
              {topNews.title}
            </h1>

            {topNews.description && (
              <p className="text-neutral-600 text-base leading-relaxed line-clamp-3 mb-3">
                {topNews.description}
              </p>
            )}

            {topNews.firstPublished && (
              <span className="text-xs text-neutral-400 block">
                {formatDateTime(topNews.firstPublished)}
              </span>
            )}
          </Link>
        </div>

        <div className="lg:col-span-4 bg-white border border-neutral-200 rounded-2xl p-5 flex flex-col gap-5 divide-y divide-neutral-200">
          {secondaryNews.map((item) => (
            <Link
              key={item.id}
              href={`/article/${item.id}`}
              className="group pt-5 first:pt-0 flex flex-col"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-block text-xs font-semibold text-(--primary)">
                  {item.category || "খবর"}
                </span>
                {item.firstPublished && (
                  <>
                    <span className="text-neutral-300 text-xs">•</span>
                    <span className="text-xs text-neutral-400">
                      {formatDateShort(item.firstPublished)}
                    </span>
                  </>
                )}
              </div>

              <h2 className="text-lg font-bold text-neutral-900 group-hover:text-(--primary) transition-colors leading-snug line-clamp-3">
                {item.title}
              </h2>
            </Link>
          ))}
        </div>
      </div>

      {remainingNews.length > 0 && (
        <div className="border-t border-neutral-200 pt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {remainingNews.map((item) => (
              <PostCard
                key={item.id}
                post={item}
                fallbackCategory="প্রধান খবর"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MainNews;