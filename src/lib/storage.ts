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

// Ensure data directory exists
async function ensureDataDir() {
  const dataDir = path.dirname(STORAGE_FILE);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// Read data from file
export async function readDailyDishes(): Promise<StorageData> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(STORAGE_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist or is invalid, return empty object
    return {};
  }
}

// Write data to file
export async function writeDailyDishes(data: StorageData): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(STORAGE_FILE, JSON.stringify(data, null, 2));
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
