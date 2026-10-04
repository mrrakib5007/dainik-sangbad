"use client";

import Link from "next/link";
import MarqueeText from "react-marquee-text";
import "react-marquee-text/dist/styles.css";

interface BreakingNewsItem {
  id: string;
  title: string;
}

interface MarqueeSliderProps {
  news: BreakingNewsItem[];
}

const MarqueeSlider = ({ news }: MarqueeSliderProps) => {
  return (
    <MarqueeText direction="right" duration={10} pauseOnHover={true}>
      {news.map((item, index) => (
        <span key={item.id} className="inline-flex items-center">
          <Link
            href={`/news/${item.id}`}
            className="hover:text-primary hover:underline underline-offset-4 decoration-primary transition-colors mx-3"
          >
            {item.title}
          </Link>
          {index !== news.length - 1 && (
            <span className="text-primary font-black mx-1">•</span>
          )}
        </span>
      ))}
    </MarqueeText>
  );
};

export default MarqueeSlider;