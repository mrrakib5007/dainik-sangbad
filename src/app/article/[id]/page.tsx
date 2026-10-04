import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FiClock, FiArrowLeft, FiTag } from "react-icons/fi";
import MostReadSection from "@/components/Home/MostReadSection/MostReadSection";

interface BodyItem {
  type: "text" | "image";
  text?: string;
  url?: string;
  width?: number;
  height?: number;
  caption?: string | null;
  altText?: string;
  copyrightHolder?: string;
}

interface ArticleData {
  id: string;
  title: string;
  link?: string;
  firstPublished?: string;
  lastPublished?: string;
  imageUrl?: string;
  topics?: { id: string; name: string }[];
  tags?: string[];
  body?: BodyItem[];
  source?: string;
  sourceUrl?: string;
  wordCount?: number;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

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

const BLOCKED_KEYWORDS = [
  "হোয়াটসঅ্যাপ",
  "whatsapp",
  "ইন্সটাগ্রাম",
  "instagram",
  "ফলো করতে এখানে ক্লিক"
];

async function getArticleDetails(id: string): Promise<ArticleData | null> {
  try {
    const res = await fetch(`https://news-api-v2.vercel.app/api/article/${id}`, {
      next: { revalidate: 120 }
    });

    if (!res.ok) return null;

    const json = await res.json();
    return json?.success && json?.data ? json.data : null;
  } catch {
    return null;
  }
}

async function getMostReadNews() {
  try {
    const res = await fetch("https://news-api-v2.vercel.app/api/news/most-read", {
      next: { revalidate: 60 }
    });
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json?.data) ? json.data : [];
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const article = await getArticleDetails(id);

  if (!article) {
    return {
      title: "সংবাদ পাওয়া যায়নি - দৈনিক সংবাদ"
    };
  }

  return {
    title: `${article.title} - দৈনিক সংবাদ`,
    description: article.title,
    openGraph: {
      title: article.title,
      images: article.imageUrl ? [article.imageUrl] : []
    }
  };
}

export default async function ArticleDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const [article, mostReadNews] = await Promise.all([
    getArticleDetails(id),
    getMostReadNews()
  ]);

  if (!article) {
    notFound();
  }

  const filteredBody = (article.body || []).filter((block) => {
    if (block.type === "text" && block.text) {
      const lower = block.text.toLowerCase();
      return !BLOCKED_KEYWORDS.some((kw) => lower.includes(kw));
    }
    return true;
  });

  const categoryName = article.topics?.[0]?.name || article.tags?.[0] || "প্রধান খবর";

  return (
    <div className="bg-neutral-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-600 hover:text-(--primary) transition-colors"
          >
            <FiArrowLeft className="w-4 h-4" />
            মূল পাতায় ফিরে যান
          </Link>
          <span className="text-xs bg-(--primary) text-white font-medium px-3 py-1 rounded-full">
            {categoryName}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <main className="lg:col-span-8 bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-neutral-900 leading-snug mb-5">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center justify-between border-y border-neutral-100 py-3 mb-6 gap-3 text-xs text-neutral-500">
              <div className="flex flex-wrap items-center gap-4">
                {article.source && (
                  <span className="font-semibold text-neutral-800">
                    সূত্র: {article.source}
                  </span>
                )}
                {article.firstPublished && (
                  <span className="flex items-center gap-1.5">
                    <FiClock className="w-3.5 h-3.5 text-neutral-400" />
                    প্রকাশ: {formatDateTime(article.firstPublished)}
                  </span>
                )}
              </div>

              {article.lastPublished && article.lastPublished !== article.firstPublished && (
                <span>আপডেট: {formatDateTime(article.lastPublished)}</span>
              )}
            </div>

            <div className="flex flex-col gap-6 text-neutral-800 text-base sm:text-lg leading-relaxed">
              {filteredBody.map((block, index) => {
                if (block.type === "image" && block.url) {
                  return (
                    <figure key={index} className="my-2">
                      <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200">
                        <Image
                          src={block.url}
                          alt={block.altText || article.title}
                          fill
                          sizes="(max-width: 1024px) 100vw, 66vw"
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                      {(block.altText || block.copyrightHolder) && (
                        <figcaption className="mt-2 text-xs text-neutral-500 flex justify-between px-1">
                          <span>{block.altText}</span>
                          {block.copyrightHolder && <span>ছবি: {block.copyrightHolder}</span>}
                        </figcaption>
                      )}
                    </figure>
                  );
                }

                if (block.type === "text" && block.text) {
                  const paragraphs = block.text.split("\n").filter((p) => p.trim() !== "");
                  return (
                    <div key={index} className="flex flex-col gap-4">
                      {paragraphs.map((para, pIdx) => {
                        const isSectionHeader =
                          para.includes("পত্রিকার খবর -") || para.includes("পত্রিকার শীর্ষ খবর -");

                        if (isSectionHeader) {
                          return (
                            <h2
                              key={pIdx}
                              className="text-lg sm:text-xl font-bold text-neutral-900 border-l-4 border-(--primary) pl-3 mt-4 pt-1"
                            >
                              {para}
                            </h2>
                          );
                        }

                        return (
                          <p key={pIdx} className="leading-relaxed text-neutral-700">
                            {para}
                          </p>
                        );
                      })}
                    </div>
                  );
                }

                return null;
              })}
            </div>

            {article.tags && article.tags.length > 0 && (
              <div className="mt-10 pt-6 border-t border-neutral-100">
                <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-neutral-500">
                  <FiTag className="w-3.5 h-3.5 text-(--primary)" /> সম্পর্কিত বিষয়:
                </div>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="text-xs bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-3 py-1 rounded-full transition-colors"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </main>

          <aside className="lg:col-span-4">
            <div className="sticky top-6">
              <MostReadSection news={mostReadNews} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}