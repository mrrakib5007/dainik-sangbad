import React from "react";
import Link from "next/link";

interface ApiCategory {
  slug: string;
  title: string;
  topicId: string | null;
  url: string;
  scrapable: boolean;
}

interface ApiResponse {
  success: boolean;
  count: number;
  cachedAt: string;
  data: ApiCategory[];
}

interface NavCategory {
  id: string;
  name: string;
  path: string;
}

interface NavLinksProps {
  isMobile?: boolean;
}

const defaultCategories: NavCategory[] = [
  {
    id: "home",
    name: "মূলপাতা",
    path: "/",
  },
];

const resolveCategoryPath = (slug: string): string => {
  if (slug === "/bengali" || slug === "all") return "/";
  if (slug.startsWith("/")) return `/category${slug}`;
  return `/category/${slug}`;
};

const NavLinks = async ({ isMobile = false }: NavLinksProps) => {
  let categories: NavCategory[] = [...defaultCategories];

  try {
    const categoriesRes = await fetch("https://news-api-v2.vercel.app/api/categories", {
      next: { revalidate: 3600 },
    });

    if (categoriesRes.ok) {
      const categoriesResData: ApiResponse = await categoriesRes.json();

      if (Array.isArray(categoriesResData?.data) && categoriesResData.data.length > 0) {
        const dynamicCategories = categoriesResData.data
          .filter((cat) => cat.scrapable)
          .map((cat, index) => ({
            id: cat.topicId || cat.slug || String(index),
            name: cat.title,
            path: resolveCategoryPath(cat.slug),
          }));

        categories = [...defaultCategories, ...dynamicCategories];
      }
    }
  } catch (error) {
    console.error("Failed to load categories:", error);
  }

  return (
    <>
      {categories.map((cat: NavCategory) => {
        if (isMobile) {
          return (
            <Link
              key={cat.id}
              href={cat.path}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-semibold transition text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <span>{cat.name}</span>
            </Link>
          );
        }

        return (
          <Link
            key={cat.id}
            href={cat.path}
            className="py-2.5 px-3.5 border-b-2 border-transparent transition hover:bg-primary"
          >
            {cat.name}
          </Link>
        );
      })}
    </>
  );
};

export default NavLinks;