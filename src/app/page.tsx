import BreakingNews from "@/components/Home/BreakingNews/BreakingNews";
import MainNews from "@/components/Home/MainNews/MainNews";
import MostReadSection from "@/components/Home/MostReadSection/MostReadSection";
import OthersNews from "@/components/Home/OthersNews/OthersNews";

async function getNewsSections() {
  try {
    const res = await fetch("https://news-api-v2.vercel.app/api/news/sections", {
      next: { revalidate: 60 } // প্রতি ১ মিনিট পর ক্যাশ রিভ্যালিডেট হবে
    });

    if (!res.ok) {
      return { mainNews: [], othersNews: [] };
    }

    const json = await res.json();
    const data = Array.isArray(json?.data) ? json.data : [];

    const mainNews = Array.isArray(data[0]?.articles) ? data[0].articles : [];
    const othersNews = data.length > 1 ? data.slice(1) : [];

    return { mainNews, othersNews };
  } catch {
    return { mainNews: [], othersNews: [] };
  }
}

async function getMostReadNews() {
  try {
    const res = await fetch("https://news-api-v2.vercel.app/api/news/most-read", {
      next: { revalidate: 60 }
    });

    if (!res.ok) {
      return [];
    }

    const json = await res.json();
    return Array.isArray(json?.data) ? json.data : [];
  } catch {
    return [];
  }
}

export default async function Home() {  
  const [{ mainNews, othersNews }, mostReadNews] = await Promise.all([
    getNewsSections(),
    getMostReadNews()
  ]);

  return (
    <div>    
      <BreakingNews />  
      <div className="grid grid-cols-1 lg:grid-cols-3 container mx-auto p-5 gap-5 bg-gray-50">
        <div className="lg:col-span-2">
          <MainNews news={mainNews} />
          <OthersNews news={othersNews} />
        </div>
        <div>
          <MostReadSection news={mostReadNews} />
        </div>
      </div>
    </div>
  );
}