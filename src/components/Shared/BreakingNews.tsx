import MarqueeSlider from "./MarqueeSlider";

interface BreakingNewsItem {
  id: string;
  title: string;
}

const BreakingNews = async () => {
  let finalData: BreakingNewsItem[] = [];

  try {
    const res = await fetch("https://news-api-v2.vercel.app/api/news?limit=10", {
      next: { revalidate: 60 },
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data?.data)) {
        finalData = data.data;
      }
    }
  } catch (error) {
    console.error("Failed to load breaking news:", error);
  }

  if (finalData.length === 0) {
    return null;
  }

  return (
    <div className="bg-red-50 dark:bg-zinc-900 border-b border-red-100 dark:border-zinc-800 text-sm overflow-hidden py-1 select-none">
      <div className="max-w-7xl mx-auto px-4 flex items-center">
        <div className="shrink-0 z-10 flex items-center gap-1.5 bg-primary text-white text-xs px-2.5 py-1 rounded-md font-bold shadow-xs mr-3">
          <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
          <span>জরুরি সংবাদ</span>
        </div>

        <div className="relative w-full overflow-hidden flex items-center min-w-0">
          <div className="w-full whitespace-nowrap text-zinc-800 dark:text-zinc-200 text-xs sm:text-sm font-medium">
            <MarqueeSlider news={finalData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreakingNews;