import { promises as fs } from "fs";
import path from "path";

type DailyDish = {
  name: string;
  url: string;
  weight: number;
};

type StorageData = {
  [date: string]: DailyDish;
};

const STORAGE_FILE = path.join(process.cwd(), "data", "daily-dishes.json");

// In-memory fallback for Vercel
let memoryStorage: StorageData = {};

// Check if we're in a serverless environment (Vercel)
const isServerless =
  process.env.VERCEL === "1" || process.env.NODE_ENV === "production";

// Ensure data directory exists
async function ensureDataDir() {
  if (isServerless) return; // Skip in serverless environment

  const dataDir = path.dirname(STORAGE_FILE);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// Read data from file
export async function readDailyDishes(): Promise<StorageData> {
  if (isServerless) {
    return memoryStorage;
  }

  try {
    await ensureDataDir();
    const data = await fs.readFile(STORAGE_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    console.log("Using memory storage fallback");
    return memoryStorage;
  }
}

// Write data to file
export async function writeDailyDishes(data: StorageData): Promise<void> {
  if (isServerless) {
    memoryStorage = data;
    return;
  }

  try {
    await ensureDataDir();
    await fs.writeFile(STORAGE_FILE, JSON.stringify(data, null, 2));
  } catch {
    console.log("Using memory storage fallback");
    memoryStorage = data;
  }
}

// Get dish for specific date
export async function getDishForDate(date: Date): Promise<DailyDish | null> {
  const dateString = date.toISOString().split("T")[0];
  const data = await readDailyDishes();
  return data[dateString] || null;
}

// Set dish for specific date
export async function setDishForDate(
  date: Date,
  dish: DailyDish
): Promise<void> {
  const dateString = date.toISOString().split("T")[0];
  const data = await readDailyDishes();
  data[dateString] = dish;
  await writeDailyDishes(data);
}

// Get all stored data
export async function getAllStoredData(): Promise<StorageData> {
  return await readDailyDishes();
}

// Initialize with some default data for serverless
export function initializeServerlessStorage() {
  if (isServerless && Object.keys(memoryStorage).length === 0) {
    console.log("Initializing serverless storage");
    // Add today's dish to memory storage
    const today = new Date();
    const dateString = today.toISOString().split("T")[0];
    const seed = parseInt(dateString.replace(/-/g, ""), 10);

    // Simple random dish generation
    const dishes = [
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
    ];

    const randomIndex = (seed * 9301 + 49297) % dishes.length;
    memoryStorage[dateString] = dishes[randomIndex];
  }
}
