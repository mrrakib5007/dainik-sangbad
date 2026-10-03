import React from "react";
import Link from "next/link";
import { HiHome, HiArrowLeft } from "react-icons/hi";
import { BiErrorCircle } from "react-icons/bi";

export default function NotFound(): React.JSX.Element {
  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-white dark:bg-zinc-950">
      <div className="max-w-md w-full text-center flex flex-col items-center">
        <div className="w-20 h-20 rounded-2xl bg-red-50 dark:bg-zinc-900 border border-red-100 dark:border-zinc-800 flex items-center justify-center text-primary mb-6 shadow-xs">
          <BiErrorCircle className="w-10 h-10" />
        </div>

        <h1 className="mt-2 text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight sm:text-4xl">
          পৃষ্ঠাটি খুঁজে পাওয়া যায়নি
        </h1>

        <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          আপনি যে সংবাদ বা পাতাটি খুঁজছেন তা মুছে ফেলা হয়েছে, নাম পরিবর্তন করা হয়েছে অথবা সাময়িকভাবে অনুপলব্ধ রয়েছে।
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-sm font-semibold transition shadow-xs"
          >
            <HiHome className="w-4 h-4" />
            <span>প্রচ্ছদে ফিরে যান</span>
          </Link>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-200 text-sm font-semibold transition"
          >
            <HiArrowLeft className="w-4 h-4" />
            <span>পূর্ববর্তী পৃষ্ঠা</span>
          </Link>
        </div>
      </div>
    </main>
  );
}