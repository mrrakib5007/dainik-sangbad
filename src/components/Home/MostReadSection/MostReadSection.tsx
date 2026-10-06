"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  WiDaySunny, 
  WiCloudy, 
  WiRain, 
  WiThunderstorm, 
  WiFog 
} from "react-icons/wi";
import { LuClock } from "react-icons/lu";

export interface MostReadItem {
  id: string;
  title: string;
}

interface MostReadSectionProps {
  news?: MostReadItem[] | null;
}

interface WeatherData {
  temperature: string;
  tempMax: string;
  tempMin: string;
  humidity: string;
  windSpeed: string;
  condition: string;
  weatherCode: number;
}

interface PrayerTimeItem {
  name: string;
  time: string;
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

const convertToBanglaTime = (time24: string): string => {
  if (!time24) return "";
  const [hoursStr, minutesStr] = time24.split(":");
  let hours = parseInt(hoursStr, 10);
  if (hours > 12) {
    hours -= 12;
  } else if (hours === 0) {
    hours = 12;
  }
  return `${toBanglaDigits(hours)}:${toBanglaDigits(minutesStr)}`;
};

const getWeatherCondition = (code: number): string => {
  if (code === 0) return "পরিষ্কার আকাশ";
  if (code >= 1 && code <= 3) return "আংশিক মেঘলা";
  if (code >= 45 && code <= 48) return "কুয়াশাচ্ছন্ন";
  if (code >= 51 && code <= 67) return "হালকা বৃষ্টি";
  if (code >= 80 && code <= 82) return "বৃষ্টিপাত";
  if (code >= 95) return "বজ্রবৃষ্টি";
  return "রৌদ্রোজ্জ্বল";
};

const renderWeatherIcon = (code: number) => {
  if (code === 0) return <WiDaySunny className="w-6 h-6 text-amber-500" />;
  if (code >= 1 && code <= 3) return <WiCloudy className="w-6 h-6 text-sky-500" />;
  if (code >= 51 && code <= 82) return <WiRain className="w-6 h-6 text-blue-500" />;
  if (code >= 95) return <WiThunderstorm className="w-6 h-6 text-indigo-500" />;
  if (code >= 45 && code <= 48) return <WiFog className="w-6 h-6 text-neutral-400" />;
  return <WiDaySunny className="w-6 h-6 text-amber-500" />;
};

const fallbackPrayers: PrayerTimeItem[] = [
  { name: "ফজর", time: "৪:৩৮" },
  { name: "যোহর", time: "১১:৪৬" },
  { name: "আসর", time: "৩:৫৮" },
  { name: "মাগরিব", time: "৫:৪৫" },
  { name: "এশা", time: "৬:৫৮" }
];

const MostReadSection: React.FC<MostReadSectionProps> = ({ news }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [prayers, setPrayers] = useState<PrayerTimeItem[]>(fallbackPrayers);
  const [isLoadingWeather, setIsLoadingWeather] = useState<boolean>(true);
  const [isLoadingPrayer, setIsLoadingPrayer] = useState<boolean>(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=23.8103&longitude=90.4125&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min&timezone=Asia%2FDhaka"
        );
        const data = await res.json();

        setWeather({
          temperature: toBanglaDigits(Math.round(data.current.temperature_2m)),
          tempMax: toBanglaDigits(Math.round(data.daily.temperature_2m_max[0])),
          tempMin: toBanglaDigits(Math.round(data.daily.temperature_2m_min[0])),
          humidity: toBanglaDigits(data.current.relative_humidity_2m),
          windSpeed: toBanglaDigits(Math.round(data.current.wind_speed_10m)),
          condition: getWeatherCondition(data.current.weather_code),
          weatherCode: data.current.weather_code
        });
      } catch {
        setWeather({
          temperature: "২৮",
          tempMax: "৩২",
          tempMin: "২৩",
          humidity: "৫৪",
          windSpeed: "৯",
          condition: "রৌদ্রোজ্জ্বল",
          weatherCode: 0
        });
      } finally {
        setIsLoadingWeather(false);
      }
    };

    const fetchPrayers = async () => {
      try {
        const res = await fetch(
          "https://api.aladhan.com/v1/timingsByCity?city=Dhaka&country=Bangladesh&method=16&school=1"
        );
        const data = await res.json();
        const timings = data?.data?.timings;

        if (timings) {
          setPrayers([
            { name: "ফজর", time: convertToBanglaTime(timings.Fajr) },
            { name: "যোহর", time: convertToBanglaTime(timings.Dhuhr) },
            { name: "আসর", time: convertToBanglaTime(timings.Asr) },
            { name: "মাগরিব", time: convertToBanglaTime(timings.Maghrib) },
            { name: "এশা", time: convertToBanglaTime(timings.Isha) }
          ]);
        }
      } catch {
        setPrayers(fallbackPrayers);
      } finally {
        setIsLoadingPrayer(false);
      }
    };

    fetchWeather();
    fetchPrayers();
  }, []);

  const validItems = (news || []).filter((item): item is MostReadItem =>
    Boolean(item && item.id && item.title)
  );

  return (
    <aside className="w-full flex flex-col gap-5">
      <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between pb-2 border-b border-neutral-100 mb-3">
          <h3 className="font-bold text-sm text-neutral-800 flex items-center gap-1.5">
            {weather ? renderWeatherIcon(weather.weatherCode) : <WiDaySunny className="w-5 h-5 text-amber-500" />}
            আজকের আবহাওয়া (ঢাকা)
          </h3>
          <span className="text-xs text-emerald-600 font-medium">
            {isLoadingWeather ? "লোড হচ্ছে..." : weather?.condition}
          </span>
        </div>

        {isLoadingWeather ? (
          <div className="animate-pulse h-12 bg-neutral-100 rounded-lg"></div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-extrabold text-neutral-800">
                {weather?.temperature}°সে
              </span>
              <div className="text-xs text-neutral-500 leading-tight">
                <p>সর্বোচ্চ: {weather?.tempMax}°সে</p>
                <p>সর্বনিম্ন: {weather?.tempMin}°সে</p>
              </div>
            </div>
            <div className="text-right text-xs text-neutral-500 leading-tight">
              <p>আর্দ্রতা: {weather?.humidity}%</p>
              <p>বাতাস: {weather?.windSpeed} কিমি/ঘণ্টা</p>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between pb-2 border-b border-neutral-100 mb-3">
          <h3 className="font-bold text-sm text-neutral-800 flex items-center gap-1.5">
            <LuClock className="w-4 h-4 text-emerald-600" />
            নামাজের সময়সূচি (ঢাকা)
          </h3>
          <span className="text-xs text-neutral-400">
            {isLoadingPrayer ? "আপডেট হচ্ছে..." : "আজকের ওয়াক্ত শুরু"}
          </span>
        </div>

        {isLoadingPrayer ? (
          <div className="animate-pulse h-10 bg-neutral-100 rounded-lg"></div>
        ) : (
          <div className="grid grid-cols-5 text-center text-xs divide-x divide-neutral-100">
            {prayers.map((item) => (
              <div key={item.name} className="px-1 first:pl-0 last:pr-0">
                <span className="block text-neutral-400 mb-1">{item.name}</span>
                <span className="font-bold text-neutral-800">{item.time}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {validItems.length > 0 && (
        <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center gap-2 pb-3 mb-4 border-b-2 border-(--primary)">
            <span className="w-2.5 h-2.5 bg-(--primary) rounded-full inline-block"></span>
            <h2 className="text-lg font-bold text-neutral-900">সর্বাধিক পঠিত</h2>
          </div>

          <div className="flex flex-col divide-y divide-neutral-100">
            {validItems.map((item, index) => (
              <Link
                key={item.id}
                href={`/article/${item.id}`}
                className="group py-3 first:pt-0 last:pb-0 flex items-start gap-4 transition-colors"
              >
                <span className="text-2xl font-black text-neutral-300 group-hover:text-(--primary) transition-colors leading-none w-6 shrink-0 text-center">
                  {toBanglaDigits(index + 1)}
                </span>

                <h3 className="text-sm font-semibold text-neutral-800 group-hover:text-(--primary) transition-colors leading-snug line-clamp-2">
                  {item.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
};

export default MostReadSection;