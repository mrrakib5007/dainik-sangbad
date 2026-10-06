"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import {
  FiUser,
  FiMail,
  FiCalendar,
  FiShield,
  FiLogOut,
  FiCheckCircle,
  FiAlertCircle,
  FiEdit3,
  FiX,
  FiCamera,
} from "react-icons/fi";
import { authClient } from "@/lib/auth-client";
import ProfileLoading from "./loading";

const banglaNumbers: Record<string, string> = {
  "0": "০", "1": "১", "2": "২", "3": "৩", "4": "৪",
  "5": "৫", "6": "৬", "7": "৭", "8": "৮", "9": "৯"
};

const toBanglaDigits = (str: string | number): string => {
  return str.toString().replace(/[0-9]/g, (match: string) => banglaNumbers[match] || match);
};

const FALLBACK_AVATAR =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='%239ca3af'><path d='M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z'/></svg>";
const DEFAULT_AVATAR = "https://i.ibb.co.com/0pYDjxCk/avater.jpg";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [imageError, setImageError] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");

  const displayImage = imageError
    ? FALLBACK_AVATAR
    : session?.user?.image || DEFAULT_AVATAR;

  const isEmailVerified = Boolean(session?.user?.emailVerified);

  const handleOpenEdit = () => {
    setName(session?.user?.name || "");
    setImage(session?.user?.image || "");
    setIsEditOpen(true);
  };

  const formatCreationDate = (dateString?: Date | string) => {
    if (!dateString) return "তথ্য পাওয়া যায়নি";
    const date = new Date(dateString);

    const banglaMonths = [
      "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
      "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"
    ];

    const day = toBanglaDigits(date.getDate());
    const month = banglaMonths[date.getMonth()];
    const year = toBanglaDigits(date.getFullYear());

    let hours = date.getHours();
    const minutes = toBanglaDigits(String(date.getMinutes()).padStart(2, "0"));
    const period = hours >= 12 ? "বিকাল / সন্ধ্যা" : hours >= 6 ? "সকাল" : "রাত";
    if (hours > 12) hours -= 12;
    if (hours === 0) hours = 12;

    const formattedTime = `${period} ${toBanglaDigits(hours)}:${minutes}`;
    return `${day} ${month}, ${year} (${formattedTime})`;
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      Swal.fire({
        title: "ত্রুটি!",
        text: "নাম ফাঁকা রাখা যাবে না।",
        icon: "warning",
        confirmButtonText: "ঠিক আছে",
        buttonsStyling: false,
        customClass: {
          confirmButton:
            "bg-(--primary) text-white font-semibold px-5 py-2.5 rounded-xl cursor-pointer hover:opacity-90 transition-opacity",
        },
      });
      return;
    }

    setUpdating(true);
    try {
      const { error } = await authClient.updateUser({
        name: name.trim(),
        image: image.trim() || undefined,
      });

      if (error) {
        Swal.fire({
          title: "আপডেট ব্যর্থ হয়েছে",
          text: error.message || "প্রোফাইল আপডেট করা সম্ভব হয়নি।",
          icon: "error",
          confirmButtonText: "ঠিক আছে",
          buttonsStyling: false,
          customClass: {
            confirmButton:
              "bg-(--primary) text-white font-semibold px-5 py-2.5 rounded-xl cursor-pointer hover:opacity-90 transition-opacity",
          },
        });
        return;
      }

      setIsEditOpen(false);
      setImageError(false);

      await Swal.fire({
        title: "সফল!",
        text: "আপনার প্রোফাইল সফলভাবে আপডেট করা হয়েছে।",
        icon: "success",
        confirmButtonText: "ঠিক আছে",
        buttonsStyling: false,
        customClass: {
          confirmButton:
            "bg-(--primary) text-white font-semibold px-5 py-2.5 rounded-xl cursor-pointer hover:opacity-90 transition-opacity",
        },
      });

      router.refresh();
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "সার্ভারের সাথে সংযোগ বিচ্ছিন্ন হয়েছে।";

      Swal.fire({
        title: "ত্রুটি!",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "ঠিক আছে",
        buttonsStyling: false,
        customClass: {
          confirmButton:
            "bg-(--primary) text-white font-semibold px-5 py-2.5 rounded-xl cursor-pointer hover:opacity-90 transition-opacity",
        },
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: "আপনি আপনার অ্যাকাউন্ট থেকে লগআউট করতে যাচ্ছেন।",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "হ্যাঁ, লগআউট করুন",
      cancelButtonText: "বাতিল",
      buttonsStyling: false,
      customClass: {
        confirmButton:
          "bg-red-600 text-white font-semibold px-5 py-2.5 rounded-xl cursor-pointer hover:bg-red-700 transition mr-3",
        cancelButton:
          "bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-semibold px-5 py-2.5 rounded-xl cursor-pointer hover:bg-zinc-300 dark:hover:bg-zinc-600 transition",
      },
    });

    if (result.isConfirmed) {
      await authClient.signOut();
      router.push("/login");
      router.refresh();
    }
  };

  if (isPending) {
    return <ProfileLoading />;
  }

  if (!session?.user) {
    return (
      <main className="min-h-[calc(100vh-250px)] flex items-center justify-center bg-neutral-50 dark:bg-zinc-950 px-4 py-12">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 max-w-md w-full text-center shadow-xs">
          <div className="w-14 h-14 bg-red-50 dark:bg-red-950/40 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiShield className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
            অ্যাক্সেস অনুমোদিত নয়
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
            আপনার প্রোফাইল দেখতে হলে অনুগ্রহ করে প্রথমে লগইন করুন।
          </p>
          <button
            onClick={() => router.push("/login")}
            className="w-full py-2.5 px-4 bg-(--primary) hover:opacity-90 text-white font-semibold rounded-xl transition cursor-pointer shadow-xs"
          >
            লগইন পেজে যান
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-250px)] bg-neutral-50 dark:bg-zinc-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xs overflow-hidden">
          <div className="h-28 sm:h-36 bg-linear-to-r from-primary to-primary-hover relative" />

          <div className="px-6 pb-6 relative">
            <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 -mt-14 sm:-mt-16 mb-6">
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white dark:border-zinc-900 shadow-md bg-zinc-100 dark:bg-zinc-800 shrink-0">
                <Image
                  src={displayImage}
                  alt={session.user.name || "ব্যবহারকারী"}
                  fill
                  unoptimized={displayImage.startsWith("data:")}
                  onError={() => setImageError(true)}
                  sizes="(max-width: 640px) 112px, 128px"
                  className="object-cover"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleOpenEdit}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-200 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-750 transition cursor-pointer shadow-2xs"
                >
                  <FiEdit3 className="w-4 h-4 text-primary" />
                  <span>প্রোফাইল এডিট</span>
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-red-200 dark:border-red-900/60 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50/50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-950/40 transition cursor-pointer"
                >
                  <FiLogOut className="w-4 h-4" />
                  <span>লগআউট</span>
                </button>
              </div>
            </div>

            <div className="text-center sm:text-left space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white">
                  {session.user.name}
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  <FiCheckCircle className="w-3 h-3" />
                  সক্রিয় পাঠক
                </span>
              </div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {session.user.email}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xs">
          <h2 className="text-base font-bold text-zinc-900 dark:text-white mb-4 pb-3 border-b border-zinc-100 dark:border-zinc-800">
            ব্যক্তিগত তথ্য
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
              <div className="p-2 rounded-lg bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 shadow-2xs">
                <FiUser className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                  পূর্ণ নাম
                </p>
                <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">
                  {session.user.name || "প্রদান করা হয়নি"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
              <div className="p-2 rounded-lg bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 shadow-2xs">
                <FiMail className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                  ইমেইল ঠিকানা
                </p>
                <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">
                  {session.user.email}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
              <div className="p-2 rounded-lg bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 shadow-2xs">
                <FiShield className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                  অ্যাকাউন্ট স্ট্যাটাস
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {isEmailVerified ? (
                    <>
                      <FiCheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                        ভেরিফাইড
                      </p>
                    </>
                  ) : (
                    <>
                      <FiAlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                      <p className="text-sm font-semibold text-amber-600 dark:text-amber-400">
                        আনভেরিফাইড
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
              <div className="p-2 rounded-lg bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 shadow-2xs">
                <FiCalendar className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                  যোগদানের তারিখ ও সময়
                </p>
                <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                  {formatCreationDate(session.user.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl p-6 relative">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800 mb-4">
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                প্রোফাইল সম্পাদনা করুন
              </h3>
              <button
                type="button"
                onClick={() => setIsEditOpen(false)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1 rounded-lg transition cursor-pointer"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  আপনার নাম
                </label>
                <div className="relative rounded-xl shadow-2xs">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                    <FiUser className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="আপনার নাম"
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  প্রোফাইল ছবির URL
                </label>
                <div className="relative rounded-xl shadow-2xs">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                    <FiCamera className="w-4 h-4" />
                  </div>
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-(--primary) hover:opacity-90 text-white transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
                >
                  {updating ? "আপডেট হচ্ছে..." : "সংরক্ষণ করুন"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}