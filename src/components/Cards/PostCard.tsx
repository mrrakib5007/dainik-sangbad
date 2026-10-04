"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export interface PostItem {
  id: string;
  title: string;
  description?: string;
  link?: string;
  imageUrl?: string;
  imageAlt?: string;
  category?: string;
  firstPublished?: string;
  lastPublished?: string;
  isLive?: boolean;
  source?: string;
  type?: string;
}

interface PostCardProps {
  post: PostItem;
  fallbackCategory?: string;
  showDescription?: boolean;
  imageSizes?: string;
}

const FALLBACK_IMAGE =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='450' viewBox='0 0 800 450' fill='%23e5e7eb'><rect width='100%25' height='100%25' fill='%23f3f4f6'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='20' fill='%239ca3af'>ছবি পাওয়া যায়নি</text></svg>";

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

const PostCard: React.FC<PostCardProps> = ({
  post,
  fallbackCategory,
  showDescription = true,
  imageSizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
}) => {
  const [imgSrc, setImgSrc] = useState<string>(post.imageUrl || FALLBACK_IMAGE);

  const displayCategory = post.category || fallbackCategory;

  return (
    <Link
      href={`/article/${post.id}`}
      className="group bg-white border border-neutral-200 rounded-2xl overflow-hidden flex flex-col justify-between"
    >
      <div>
        <div className="relative aspect-video w-full bg-neutral-100 overflow-hidden">
          <Image
            src={imgSrc}
            alt={post.imageAlt || post.title}
            fill
            sizes={imageSizes}
            unoptimized
            onError={() => setImgSrc(FALLBACK_IMAGE)}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        <div className="p-4 pb-0">
          {displayCategory && (
            <span className="inline-block text-xs font-semibold text-(--primary) mb-2">
              {displayCategory}
            </span>
          )}

          <h3 className="text-base font-bold text-neutral-900 group-hover:text-(--primary) transition-colors leading-snug line-clamp-2 mb-2">
            {post.title}
          </h3>

          {showDescription && post.description && (
            <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
              {post.description}
            </p>
          )}
        </div>
      </div>

      {post.firstPublished && (
        <div className="p-4 pt-3">
          <span className="text-xs text-neutral-400 block">
            {formatDateTime(post.firstPublished)}
          </span>
        </div>
      )}
    </Link>
  );
};

export default PostCard;