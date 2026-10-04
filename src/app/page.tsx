import BreakingNews from "@/components/Home/BreakingNews/BreakingNews";
import MainNews from "@/components/Home/MainNews/MainNews";

export default async function Home() {
  const res = await fetch("https://news-api-v2.vercel.app/api/news/sections");
    const data = await res.json();
    const newsData = data.data;
    const mainNews = newsData[0].articles;
    console.log(mainNews)
  return (
    <div>
      <BreakingNews />
      <div className='grid grid-cols-1 lg:grid-cols-3 container mx-auto p-5 gap-5 bg-gray-50'>
        
        <div className='lg:col-span-2'>
            <MainNews news={mainNews} />
        </div>
        <div className='bg-red-200'>
          b
        </div>
      </div>
    </div>
  );
}
