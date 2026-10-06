"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import {
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiImage,
} from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { authClient } from "@/lib/auth-client";

interface FormErrors {
  name?: string;
  photoUrl?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  agreeTerms?: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    photoUrl: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "আপনার পূর্ণ নাম অবশ্যই প্রদান করতে হবে";
    }

    if (formData.photoUrl.trim() && !isValidUrl(formData.photoUrl.trim())) {
      newErrors.photoUrl = "সঠিক ছবির ইউআরএল প্রদান করুন";
    }

    if (!formData.email.trim()) {
      newErrors.email = "ইমেইল ঠিকানা দেওয়া বাধ্যতামূলক";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "সঠিক ইমেইল ঠিকানা প্রদান করুন";
    }

    if (!formData.password) {
      newErrors.password = "পাসওয়ার্ড দেওয়া আবশ্যক";
    } else if (formData.password.length < 6) {
      newErrors.password = "পাসওয়ার্ড কমপক্ষে ৬টি অক্ষরের হতে হবে";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "পাসওয়ার্ড নিশ্চিত করুন";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "উভয় পাসওয়ার্ড একই হতে হবে";
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = "শর্তাবলী ও গোপনীয়তা নীতি মেনে নিতে হবে";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const defaultPhotoUrl = "https://i.ibb.co.com/0pYDjxCk/avater.jpg";
    const submissionData = {
      ...formData,
      photoUrl: formData.photoUrl.trim() || defaultPhotoUrl,
    };

    setLoading(true);

    try {
      const { data, error } = await authClient.signUp.email({
        email: submissionData.email,
        password: submissionData.password,
        name: submissionData.name,
        image: submissionData.photoUrl,
      });

      if (error) {
        Swal.fire({
          title: "নিবন্ধন ব্যর্থ হয়েছে",
          text:
            error.message ||
            "একটি সমস্যা হয়েছে, অনুগ্রহ করে আবার চেষ্টা করুন।",
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

      if (data) {
        await Swal.fire({
          title: "অভিনন্দন!",
          text: "আপনার নিবন্ধন সফলভাবে সম্পন্ন হয়েছে।",
          icon: "success",
          confirmButtonText: "ঠিক আছে",
          buttonsStyling: false,
          customClass: {
            confirmButton:
              "bg-(--primary) text-white font-semibold px-5 py-2.5 rounded-xl cursor-pointer hover:opacity-90 transition-opacity",
          },
        });

        router.push("/");
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "সার্ভারের সাথে সংযোগ স্থাপন করা সম্ভব হয়নি।";

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
      setLoading(false);
    }
  };

  const handleChange = (
    field: keyof typeof formData,
    value: string | boolean,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { data, error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });

      if (error) {
        Swal.fire({
          title: "লগইন ব্যর্থ হয়েছে",
          text:
            error.message ||
            "গুগল দিয়ে সাইন ইন করা সম্ভব হয়নি, আবার চেষ্টা করুন।",
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

      if (data) {
        await Swal.fire({
          title: "অভিনন্দন!",
          text: "আপনার সাইন ইন সফল হয়েছে।",
          icon: "success",
          confirmButtonText: "ঠিক আছে",
          buttonsStyling: false,
          customClass: {
            confirmButton:
              "bg-(--primary) text-white font-semibold px-5 py-2.5 rounded-xl cursor-pointer hover:opacity-90 transition-opacity",
          },
        });

        router.push("/");
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "সার্ভারের সাথে সংযোগ স্থাপন করা সম্ভব হয়নি।";

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
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] bg-neutral-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        <h2 className="text-center text-2xl font-bold text-neutral-900">
          নতুন পাঠক অ্যাকাউন্ট তৈরি করুন
        </h2>
        <p className="mt-1 text-center text-xs text-neutral-500">
          ইতিমধ্যে অ্যাকাউন্ট আছে?{" "}
          <Link
            className="font-semibold text-(--primary) hover:underline"
            href="/login"
          >
            লগইন করুন
          </Link>
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 border border-neutral-200 rounded-2xl shadow-xs sm:px-8">
          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            <div>
              <label
                htmlFor="name"
                className="block text-xs font-semibold text-neutral-700 mb-1"
              >
                আপনার পূর্ণ নাম
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <FiUser className="w-4 h-4 text-neutral-400" />
                </div>
                <input
                  id="name"
                  type="text"
                  placeholder="আপনার নাম লিখুন"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className={`block w-full pl-10 pr-3 py-2.5 text-sm border rounded-xl focus:outline-none transition-colors text-neutral-900 placeholder:text-neutral-400 ${
                    errors.name
                      ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                      : "border-neutral-200 focus:border-(--primary) focus:ring-1 focus:ring-(--primary)"
                  }`}
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-xs mt-1 font-medium">
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="photoUrl"
                className="block text-xs font-semibold text-neutral-700 mb-1"
              >
                প্রোফাইল ছবির URL (ঐচ্ছিক)
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <FiImage className="w-4 h-4 text-neutral-400" />
                </div>
                <input
                  id="photoUrl"
                  type="url"
                  placeholder="https://example.com/avatar.jpg"
                  value={formData.photoUrl}
                  onChange={(e) => handleChange("photoUrl", e.target.value)}
                  className={`block w-full pl-10 pr-3 py-2.5 text-sm border rounded-xl focus:outline-none transition-colors text-neutral-900 placeholder:text-neutral-400 ${
                    errors.photoUrl
                      ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                      : "border-neutral-200 focus:border-(--primary) focus:ring-1 focus:ring-(--primary)"
                  }`}
                />
              </div>
              {errors.photoUrl && (
                <p className="text-red-500 text-xs mt-1 font-medium">
                  {errors.photoUrl}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-neutral-700 mb-1"
              >
                ইমেইল ঠিকানা
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <FiMail className="w-4 h-4 text-neutral-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className={`block w-full pl-10 pr-3 py-2.5 text-sm border rounded-xl focus:outline-none transition-colors text-neutral-900 placeholder:text-neutral-400 ${
                    errors.email
                      ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                      : "border-neutral-200 focus:border-(--primary) focus:ring-1 focus:ring-(--primary)"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1 font-medium">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-neutral-700 mb-1"
              >
                পাসওয়ার্ড
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <FiLock className="w-4 h-4 text-neutral-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="কমপক্ষে ৬টি অক্ষর"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  className={`block w-full pl-10 pr-10 py-2.5 text-sm border rounded-xl focus:outline-none transition-colors text-neutral-900 placeholder:text-neutral-400 ${
                    errors.password
                      ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                      : "border-neutral-200 focus:border-(--primary) focus:ring-1 focus:ring-(--primary)"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-neutral-600 cursor-pointer"
                >
                  {showPassword ? (
                    <FiEyeOff className="w-4 h-4" />
                  ) : (
                    <FiEye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1 font-medium">
                  {errors.password}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-xs font-semibold text-neutral-700 mb-1"
              >
                পাসওয়ার্ড নিশ্চিত করুন
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <FiLock className="w-4 h-4 text-neutral-400" />
                </div>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="একই পাসওয়ার্ড পুনরায় লিখুন"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleChange("confirmPassword", e.target.value)
                  }
                  className={`block w-full pl-10 pr-10 py-2.5 text-sm border rounded-xl focus:outline-none transition-colors text-neutral-900 placeholder:text-neutral-400 ${
                    errors.confirmPassword
                      ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                      : "border-neutral-200 focus:border-(--primary) focus:ring-1 focus:ring-(--primary)"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-neutral-600 cursor-pointer"
                >
                  {showConfirmPassword ? (
                    <FiEyeOff className="w-4 h-4" />
                  ) : (
                    <FiEye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1 font-medium">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <div>
              <div className="flex items-start">
                <input
                  id="terms"
                  type="checkbox"
                  checked={formData.agreeTerms}
                  onChange={(e) => handleChange("agreeTerms", e.target.checked)}
                  className="h-4 w-4 mt-0.5 rounded border-neutral-300 text-(--primary) focus:ring-(--primary)"
                />
                <label
                  htmlFor="terms"
                  className="ml-2 block text-xs text-neutral-600 leading-tight"
                >
                  আমি প্ল্যাটফর্মের{" "}
                  <Link className="text-(--primary) underline" href="/terms">
                    শর্তাবলী
                  </Link>{" "}
                  ও{" "}
                  <Link
                    className="text-(--primary) underline"
                    href="/privacy-policy"
                  >
                    গোপনীয়তা নীতি
                  </Link>{" "}
                  মেনে নিচ্ছি
                </label>
              </div>
              {errors.agreeTerms && (
                <p className="text-red-500 text-xs mt-1 font-medium">
                  {errors.agreeTerms}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl text-sm font-bold text-white bg-(--primary) hover:opacity-90 transition-opacity cursor-pointer shadow-xs mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "অ্যাকাউন্ট তৈরি হচ্ছে..." : "নিবন্ধন সম্পন্ন করুন"}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white text-neutral-400">
                  অথবা গুগল দিয়ে নিবন্ধন করুন
                </span>
              </div>
            </div>

            <div className="mt-5">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-neutral-200 rounded-xl text-sm font-semibold text-neutral-700 bg-white hover:bg-neutral-50 transition-colors cursor-pointer"
              >
                <FcGoogle className="w-5 h-5" />
                <span>Google দিয়ে শুরু করুন</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}