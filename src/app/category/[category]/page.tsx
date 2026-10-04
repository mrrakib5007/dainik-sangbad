import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import PostCard, { PostItem } from "@/components/Cards/PostCard";

interface CategoryResponse {
  success: boolean;
  count: number;
  slug: string;
  topicId?: string;
  title: string;
  page: number;
  pageCount: number;
  data: PostItem[];
}

interface PageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string }>;
}

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

async function getCategoryNews(category: string, page: number): Promise<CategoryResponse | null> {
  try {
    const res = await fetch(
      `https://news-api-v2.vercel.app/api/category/${category}?page=${page}`,
      { next: { revalidate: 120 } }
    );
    if (!res.ok) return null;
    const json = await res.json();
    return json?.success ? json : null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const { page = "1" } = await searchParams;
  const currentPage = Math.max(1, parseInt(page, 10) || 1);
  const data = await getCategoryNews(category, currentPage);

  if (!data) {
    return {
      title: "বিভাগ পাওয়া যায়নি - দৈনিক সংবাদ"
    };
  }

  const title = `${data.title} সংবাদ - দৈনিক সংবাদ`;
  const description = `${data.title} বিভাগের সকল তাজা ও সর্বশেষ সংবাদ শিরোনাম, খবর ও বিশ্লেষণ পড়ুন দৈনিক সংবাদ-এ।`;

  return {
    title,
    description,
    alternates: {
      canonical: `/category/${category}`
    },
    openGraph: {
      title,
      description,
      url: `/category/${category}`,
      siteName: "দৈনিক সংবাদ",
      locale: "bn_BD",
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title,
      description
    }
  };
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { category } = await params;
  const { page = "1" } = await searchParams;
  const currentPage = Math.max(1, parseInt(page, 10) || 1);

  const categoryData = await getCategoryNews(category, currentPage);

  if (!categoryData) {
    notFound();
  }

  const { title, pageCount, data: articles } = categoryData;
  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < pageCount;

  return (
    <div className="bg-neutral-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-2 pb-3 mb-8 border-b-2 border-(--primary)">
          <span className="w-2.5 h-2.5 bg-(--primary) rounded-full inline-block"></span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900">
            {title}
          </h1>
        </div>

        <main className="flex flex-col justify-between">
          {articles && articles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {articles.map((item) => (
                <PostCard
                  key={item.id}
                  post={item}
                  fallbackCategory={title}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white border border-neutral-200 rounded-2xl p-12 text-center text-neutral-500">
              এই বিভাগে কোনো সংবাদ পাওয়া যায়নি।
            </div>
          )}

          {pageCount > 1 && (
            <div className="flex items-center justify-center gap-3 mt-10 pt-6 border-t border-neutral-200">
              {hasPrevious ? (
                <Link
                  href={`/category/${category}?page=${currentPage - 1}`}
                  className="flex items-center gap-1 px-4 py-2 text-xs font-semibold text-neutral-700 bg-white border border-neutral-200 rounded-xl hover:border-(--primary) hover:text-(--primary) transition-colors"
                >
                  <FiChevronLeft className="w-4 h-4" />
                  পূর্ববর্তী
                </Link>
              ) : (
                <span className="flex items-center gap-1 px-4 py-2 text-xs font-semibold text-neutral-300 bg-neutral-100 border border-neutral-200 rounded-xl cursor-not-allowed">
                  <FiChevronLeft className="w-4 h-4" />
                  পূর্ববর্তী
                </span>
              )}

              <span className="text-xs text-neutral-600 font-medium px-2">
                পৃষ্ঠা {toBanglaDigits(currentPage)} / {toBanglaDigits(pageCount)}
              </span>

              {hasNext ? (
                <Link
                  href={`/category/${category}?page=${currentPage + 1}`}
                  className="flex items-center gap-1 px-4 py-2 text-xs font-semibold text-neutral-700 bg-white border border-neutral-200 rounded-xl hover:border-(--primary) hover:text-(--primary) transition-colors"
                >
                  পরবর্তী
                  <FiChevronRight className="w-4 h-4" />
                </Link>
              ) : (
                <span className="flex items-center gap-1 px-4 py-2 text-xs font-semibold text-neutral-300 bg-neutral-100 border border-neutral-200 rounded-xl cursor-not-allowed">
                  <FiChevronRight className="w-4 h-4" />
                  পরবর্তী
                </span>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}