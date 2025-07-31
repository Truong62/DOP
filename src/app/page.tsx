import Image from "next/image";
import { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";

type DailyDish = {
  name: string;
  url: string;
  weight: number;
};

function getDailyDishForDate(testDate?: Date): DailyDish {
  const now = testDate || new Date();
  const customStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    10
  );

  if (now < customStart) customStart.setDate(customStart.getDate() - 1);
  const dateString = customStart.toISOString().split("T")[0];
  const seed = parseInt(dateString.replace(/-/g, ""), 10);

  const weightedArray: string[] = [];
  arr.forEach((dish) => {
    for (let i = 0; i < dish.weight; i++) {
      weightedArray.push(dish.name);
    }
  });

  const randomIndex = (seed * 9301 + 49297) % weightedArray.length;
  const selectedDishName = weightedArray[randomIndex];

  const selectedDish = arr.find((dish) => dish.name === selectedDishName);
  return selectedDish!;
}

function getDailyDish(): DailyDish {
  return getDailyDishForDate();
}

const arr: DailyDish[] = [
  {
    name: "Cơm rang hoặc phở",
    url: "https://assets.unileversolutions.com/v1/1187779.jpg",
    weight: 3,
  },
  {
    name: "Cơm ngon Bắc Giang",
    url: "https://bazantravel.com/cdn/medias/uploads/85/85768-an-toi-nha-trang-oc-chao-700x394.jpg",
    weight: 3,
  },
  {
    name: "Cơm sườn",
    url: "https://inhat.vn/wp-content/uploads/2022/03/com-van-phong-bac-ninh-7-min.jpg",
    weight: 3,
  },
  {
    name: "Cơm như ý ",
    url: "https://afamilycdn.com/2018/10/15/ava-ngang-1-1539616620729517899602.jpg",
    weight: 3,
  },
  {
    name: "bún bò huế",
    url: "https://vnaroma.com/wp-content/uploads/2020/10/bi-quyet-chuan-bi-gia-vi-nau-bun-bo-hue-chuan-vi-01.jpg",
    weight: 1,
  },
  {
    name: "Bún 2 chị sinh đôi",
    url: "https://cdn.tgdd.vn/Files/2020/04/03/1246339/cach-nau-bun-ca-ha-noi-thom-ngon-chuan-vi-khong-ta-13.jpg",
    weight: 1,
  },
  {
    name: "Bún đậu",
    url: "https://bizweb.dktcdn.net/100/514/078/products/chuyen-de-bun-dau-man-tom-rosa-bien-hoa-dong-nai-10-1714982875768-071b3ef1-f2ab-4f58-9725-6c92fc74a290-eb47202d-864b-400b-bffb-ae095ddcfbdd.jpg?v=1716988391733",
    weight: 1,
  },
];

export async function generateMetadata(): Promise<Metadata> {
  const dailyDish = getDailyDish();

  return {
    title: `Hôm nay ăn gì? - ${dailyDish.name}`,
    description: `Món ăn của hôm nay: ${dailyDish.name}`,
    openGraph: {
      title: `Hôm nay ăn gì? - ${dailyDish.name}`,
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
  const today = new Date();
  const predictedDays = [
    { name: "Ngày mai", date: new Date(today.getTime() + 24 * 60 * 60 * 1000) },
    {
      name: "Ngày kia",
      date: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000),
    },
    {
      name: "Tuần sau",
      date: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000),
    },
    {
      name: "Tháng sau",
      date: new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000),
    },
  ];

  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 bg-white rounded-2xl shadow-lg">
      <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        🎯 Món dự kiến
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {predictedDays.map((day, index) => {
          const dish = getDailyDishForDate(day.date);

          return (
            <div
              key={index}
              className="text-center p-4 rounded-lg border-2 bg-blue-50 border-blue-200"
            >
              <p className="font-semibold text-gray-700 mb-2">{day.name}</p>
              <p className="text-sm text-gray-600">{dish.name}</p>
            </div>
          );
        })}
      </div>
      <p className="text-center text-gray-500 text-sm mt-4">💡 Dự kiến</p>
    </div>
  );
}

export default function Home() {
  const dailyDish = getDailyDish();

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
          <p className="text-gray-500 text-sm">
            Món này sẽ thay đổi vào lúc 10h sáng ngày mai.
          </p>
        </div>
      </div>

      <PredictedDishes />
      <Analytics />
    </div>
  );
}
