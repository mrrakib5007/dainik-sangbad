"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { authClient } from "@/lib/auth-client";

interface LoginFormErrors {
  email?: string;
  password?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState<LoginFormErrors>({});

  const validate = (): boolean => {
    const newErrors: LoginFormErrors = {};

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await authClient.signIn.email({
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe,
      });

      if (error) {
        Swal.fire({
          title: "লগইন ব্যর্থ হয়েছে",
          text: error.message || "ইমেইল বা পাসওয়ার্ড সঠিক নয়, আবার চেষ্টা করুন।",
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
          text: "আপনার লগইন সফল হয়েছে।",
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

  const handleChange = (field: "email" | "password", value: string) => {
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
          text: error.message || "গুগল লগইন সম্পন্ন করা সম্ভব হয়নি, আবার চেষ্টা করুন।",
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
          text: "আপনার লগইন সফল হয়েছে।",
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
          আপনার অ্যাকাউন্টে লগইন করুন
        </h2>
        <p className="mt-1 text-center text-xs text-neutral-500">
          নতুন পাঠক?{" "}
          <Link
            href="/register"
            className="font-semibold text-(--primary) hover:underline"
          >
            অ্যাকাউন্ট তৈরি করুন
          </Link>
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 border border-neutral-200 rounded-2xl shadow-xs sm:px-8">
          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
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
              <div className="flex items-center justify-between mb-1">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-neutral-700"
                >
                  পাসওয়ার্ড
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-(--primary) hover:underline"
                >
                  পাসওয়ার্ড ভুলে গেছেন?
                </Link>
              </div>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <FiLock className="w-4 h-4 text-neutral-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
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

            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={formData.rememberMe}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    rememberMe: e.target.checked,
                  }))
                }
                className="h-4 w-4 rounded border-neutral-300 text-(--primary) focus:ring-(--primary)"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-xs text-neutral-600"
              >
                আমাকে মনে রাখুন
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl text-sm font-bold text-white bg-(--primary) hover:opacity-90 transition-opacity cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "প্রবেশ করা হচ্ছে..." : "প্রবেশ করুন"}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white text-neutral-400">
                  অথবা গুগল দিয়ে চালিয়ে যান
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
                <span>Google দিয়ে লগইন করুন</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}