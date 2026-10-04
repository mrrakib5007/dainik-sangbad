import BreakingNews from "@/components/Home/BreakingNews/BreakingNews";
import MainNews from "@/components/Home/MainNews/MainNews";
import OthersNews from "@/components/Home/OthersNews/OthersNews";

export default async function Home() {
  const newsRes = await fetch("https://news-api-v2.vercel.app/api/news/sections");
  const newsResData = await newsRes.json();
  const newsData = newsResData.data;
  const mainNews = newsData[0].articles;
  const othersNews = newsData.slice(1);

  const mostReadRes = await fetch("https://news-api-v2.vercel.app/api/news/most-read");
  const mostReadResJson = await mostReadRes.json();
  const mostReadResData = mostReadResJson.data;
  console.log(mostReadResData)

  return (
    <div>
      <BreakingNews />
      <div className="grid grid-cols-1 lg:grid-cols-3 container mx-auto p-5 gap-5 bg-gray-50">
        <div className="lg:col-span-2">
          <MainNews news={mainNews} />
          <OthersNews news={othersNews} />
        </div>
        <div className="bg-red-200">b</div>
      </div>
    </div>
  );
}
