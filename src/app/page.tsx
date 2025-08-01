import Image from "next/image";
import { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";

type DailyDish = {
  name: string;
  url: string;
  weight: number;
};

// Fetch random dish from API
async function getRandomDish(): Promise<DailyDish> {
  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/api/random-dish`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch random dish");
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error fetching random dish:", error);
    // Fallback to a default dish
    return {
      name: "Cơm rang hoặc phở",
      url: "https://assets.unileversolutions.com/v1/1187779.jpg",
      weight: 3,
    };
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const dailyDish = await getRandomDish();

  return {
    title: `Hôm nay Ăn Gì? - ${dailyDish.name}`,
    description: `Món ăn của hôm nay: ${dailyDish.name}`,
    openGraph: {
      title: `Hôm nay Ăn Gì? - ${dailyDish.name}`,
      description: `Món ăn của hôm nay: ${dailyDish.name}`,
      images: [
        {
          url: dailyDish.url.trim(),
          width: 1200,
          height: 630,
          alt: dailyDish.name,
        },
      ],
    },
  };
}

function PredictedDishes() {
  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 bg-white rounded-2xl shadow-lg">
      <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        🎯 Món dự kiến
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { name: "Ngày mai", description: "Random từ API" },
          { name: "Ngày kia", description: "Random từ API" },
          { name: "Tuần sau", description: "Random từ API" },
          { name: "Tháng sau", description: "Random từ API" },
        ].map((day, index) => (
          <div
            key={index}
            className="text-center p-4 rounded-lg border-2 bg-blue-50 border-blue-200"
          >
            <p className="font-semibold text-gray-700 mb-2">{day.name}</p>
            <p className="text-sm text-gray-600">{day.description}</p>
          </div>
        ))}
      </div>
      <p className="text-center text-gray-500 text-sm mt-4">💡 Dự kiến</p>
    </div>
  );
}

export default async function Home() {
  const dailyDish = await getRandomDish();

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-pink-50 py-12 px-4">
      <h1 className="text-5xl font-extrabold text-center text-rose-600 drop-shadow mb-12">
        HÔM NAY ĂN GÌ?
      </h1>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden max-w-3xl mx-auto">
        <div className="relative h-72 sm:h-80 md:h-96">
          <Image
            src={dailyDish.url.trim()}
            alt={dailyDish.name}
            fill
            className="object-cover rounded-t-3xl"
          />
        </div>

        <div className="p-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4">
            {dailyDish.name}
          </h2>
          <p className="text-gray-700 text-lg sm:text-xl mb-2">
            Món ăn của hôm nay đã được chọn! 🍽️
          </p>
          <p className="text-gray-500 text-sm mb-4">
            Món này sẽ thay đổi vào lúc 10h sáng ngày mai hoặc khi admin random
            lại.
          </p>
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <p className="text-blue-700 text-sm">
              💡 <strong>Mẹo:</strong> Món ăn có thể được cập nhật bởi admin.
              Nếu bạn thấy món ăn thay đổi, đó là do admin đã random lại!
            </p>
          </div>
        </div>
      </div>

      <PredictedDishes />
      <Analytics />
    </div>
  );
}
