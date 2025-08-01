import { NextResponse } from "next/server";
import {
  getDishForDate,
  setDishForDate,
  initializeServerlessStorage,
} from "@/lib/storage";

type DailyDish = {
  name: string;
  url: string;
  weight: number;
};

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

function generateRandomDish(seed: number): DailyDish {
  // Generate weighted array
  const weightedArray: string[] = [];
  arr.forEach((dish) => {
    for (let i = 0; i < dish.weight; i++) {
      weightedArray.push(dish.name);
    }
  });

  // Use seed for consistent random
  const randomIndex = (seed * 9301 + 49297) % weightedArray.length;
  const selectedDishName = weightedArray[randomIndex];

  const selectedDish = arr.find((dish) => dish.name === selectedDishName)!;
  return selectedDish;
}

async function getDailyDishForDate(date: Date): Promise<DailyDish> {
  try {
    // Initialize serverless storage if needed
    initializeServerlessStorage();

    // Check if we already have a dish for this date
    const existingDish = await getDishForDate(date);
    if (existingDish) {
      return existingDish;
    }

    // Generate new dish using date as seed
    const dateString = date.toISOString().split("T")[0];
    const seed = parseInt(dateString.replace(/-/g, ""), 10);
    const newDish = generateRandomDish(seed);

    // Save to storage
    await setDishForDate(date, newDish);

    return newDish;
  } catch (error) {
    console.error("Error in getDailyDishForDate:", error);
    // Fallback to generating dish without storage
    const dateString = date.toISOString().split("T")[0];
    const seed = parseInt(dateString.replace(/-/g, ""), 10);
    return generateRandomDish(seed);
  }
}

async function getCurrentDailyDish(): Promise<DailyDish> {
  const now = new Date();
  const customStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    10
  );

  // If it's before 10 AM, use yesterday's dish
  if (now < customStart) {
    customStart.setDate(customStart.getDate() - 1);
  }

  return await getDailyDishForDate(customStart);
}

async function forceRandomToday(): Promise<DailyDish> {
  try {
    const today = new Date();

    // Generate new dish using current timestamp as seed
    const seed = Date.now();
    const newDish = generateRandomDish(seed);

    // Save to storage
    await setDishForDate(today, newDish);

    return newDish;
  } catch (error) {
    console.error("Error in forceRandomToday:", error);
    // Fallback to generating dish without storage
    const seed = Date.now();
    return generateRandomDish(seed);
  }
}

export async function GET() {
  try {
    const dailyDish = await getCurrentDailyDish();

    return NextResponse.json({
      success: true,
      data: dailyDish,
      date: new Date().toISOString().split("T")[0],
    });
  } catch (error) {
    console.error("Error in GET /api/random-dish:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        data: arr[0], // Fallback to first dish
      },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const newDish = await forceRandomToday();

    return NextResponse.json({
      success: true,
      data: newDish,
      date: new Date().toISOString().split("T")[0],
      message: "Đã random lại món ăn cho hôm nay",
    });
  } catch (error) {
    console.error("Error in POST /api/random-dish:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        data: arr[0], // Fallback to first dish
      },
      { status: 500 }
    );
  }
}
