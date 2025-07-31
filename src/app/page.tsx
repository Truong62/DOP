import Image from "next/image";
import { Metadata } from "next";

type DailyDish = {
  name: string;
  url: string;
};

function getDailyDish(): DailyDish {
  const now = new Date();
  const customStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    10
  );

  if (now < customStart) {
    customStart.setDate(customStart.getDate() - 1);
  }

  const dayNumber = Math.floor(
    (customStart.getTime() -
      new Date(customStart.getFullYear(), 0, 1).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  const randomIndex = dayNumber % arr.length;
  return arr[randomIndex];
}

const arr = [
  {
    name: "Bún 2 chị sinh đôi",
    url: "https://cdn.tgdd.vn/Files/2020/04/03/1246339/cach-nau-bun-ca-ha-noi-thom-ngon-chuan-vi-khong-ta-13.jpg",
  },
  {
    name: "Cơm ngon Bắc Giang",
    url: "https://bazantravel.com/cdn/medias/uploads/85/85768-an-toi-nha-trang-oc-chao-700x394.jpg",
  },
  {
    name: "Cơm sườn",
    url: "https://inhat.vn/wp-content/uploads/2022/03/com-van-phong-bac-ninh-7-min.jpg",
  },
  {
    name: "Cơm rang hoặc phở",
    url: "https://assets.unileversolutions.com/v1/1187779.jpg",
  },
  {
    name: "Bún đậu",
    url: "https://bizweb.dktcdn.net/100/514/078/products/chuyen-de-bun-dau-man-tom-rosa-bien-hoa-dong-nai-10-1714982875768-071b3ef1-f2ab-4f58-9725-6c92fc74a290-eb47202d-864b-400b-bffb-ae095ddcfbdd.jpg?v=1716988391733",
  },
  {
    name: "Cơm như ý ",
    url: "https://afamilycdn.com/2018/10/15/ava-ngang-1-1539616620729517899602.jpg",
  },
  {
    name: "bún bò huế",
    url: "https://vnaroma.com/wp-content/uploads/2020/10/bi-quyet-chuan-bi-gia-vi-nau-bun-bo-hue-chuan-vi-01.jpg",
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
    </div>
  );
}
