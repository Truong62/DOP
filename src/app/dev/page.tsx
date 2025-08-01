"use client";

import Image from "next/image";
import { useState } from "react";

type DailyDish = {
  name: string;
  url: string;
  weight: number;
};

type ApiResponse = {
  success: boolean;
  data: DailyDish;
  date: string;
  message?: string;
};

type StorageData = {
  [date: string]: DailyDish;
};

type StorageResponse = {
  success: boolean;
  data: StorageData;
  totalDates: number;
};

export default function DevPage() {
  const [currentDish, setCurrentDish] = useState<DailyDish | null>(null);
  const [currentDate, setCurrentDate] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [storageData, setStorageData] = useState<StorageData>({});
  const [totalDates, setTotalDates] = useState<number>(0);

  const handleGetTodayDish = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/random-dish");
      if (response.ok) {
        const result: ApiResponse = await response.json();
        setCurrentDish(result.data);
        setCurrentDate(result.date);
        setMessage("");
      } else {
        console.error("Failed to fetch today's dish");
      }
    } catch (error) {
      console.error("Error fetching today's dish:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleForceRandom = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/random-dish", {
        method: "POST",
      });
      if (response.ok) {
        const result: ApiResponse = await response.json();
        setCurrentDish(result.data);
        setCurrentDate(result.date);
        setMessage(result.message || "Đã random lại thành công!");
      } else {
        console.error("Failed to force random");
      }
    } catch (error) {
      console.error("Error forcing random:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewStorage = async () => {
    try {
      const response = await fetch("/api/storage");
      if (response.ok) {
        const result: StorageResponse = await response.json();
        setStorageData(result.data);
        setTotalDates(result.totalDates);
      } else {
        console.error("Failed to fetch storage data");
      }
    } catch (error) {
      console.error("Error fetching storage data:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-extrabold text-center text-purple-600 drop-shadow mb-8">
          🎲 DEV MODE - RANDOM MÓN ĂN
        </h1>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden max-w-3xl mx-auto mb-8">
          {currentDish ? (
            <>
              <div className="relative h-72 sm:h-80 md:h-96">
                <Image
                  src={currentDish.url.trim()}
                  alt={currentDish.name}
                  fill
                  className="object-cover rounded-t-3xl"
                />
              </div>

              <div className="p-8 text-center">
                <h2 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4">
                  {currentDish.name}
                </h2>
                <p className="text-gray-700 text-lg sm:text-xl mb-2">
                  Món ăn của hôm nay! 🍽️
                </p>
                <p className="text-gray-500 text-sm mb-2">
                  Ngày: {currentDate} - Mọi người sẽ thấy cùng kết quả
                </p>
                {message && (
                  <p className="text-green-600 text-sm font-semibold mb-2">
                    {message}
                  </p>
                )}
              </div>
            </>
          ) : (
            <div className="p-8 text-center">
              <p className="text-gray-600 text-lg mb-6">
                Nhấn nút bên dưới để lấy hoặc random lại món ăn
              </p>
            </div>
          )}

          <div className="p-8 text-center space-y-4">
            <button
              onClick={handleGetTodayDish}
              disabled={loading}
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3 px-6 rounded-full text-lg shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95 disabled:transform-none mr-4"
            >
              {loading ? "⏳ Đang tải..." : "📅 Lấy món hôm nay"}
            </button>

            <button
              onClick={handleForceRandom}
              disabled={loading}
              className="bg-gradient-to-r from-red-500 to-purple-500 hover:from-red-600 hover:to-purple-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3 px-6 rounded-full text-lg shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95 disabled:transform-none mr-4"
            >
              {loading ? "⏳ Đang tải..." : "🎲 Random lại cho hôm nay"}
            </button>

            <button
              onClick={handleViewStorage}
              className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-bold py-3 px-6 rounded-full text-lg shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95"
            >
              📊 Xem tất cả data đã lưu
            </button>
          </div>
        </div>

        {totalDates > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              📊 Data đã lưu ({totalDates} ngày)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
              {Object.entries(storageData)
                .sort(([a], [b]) => b.localeCompare(a)) // Sort by date descending
                .map(([date, dish]) => (
                  <div
                    key={date}
                    className="p-4 rounded-lg border-2 bg-gray-50 border-gray-200"
                  >
                    <p className="font-semibold text-gray-700 mb-2">{date}</p>
                    <p className="text-sm text-gray-600">{dish.name}</p>
                  </div>
                ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            📊 Thông tin hệ thống
          </h3>
          <div className="space-y-4">
            <div className="p-4 rounded-lg border-2 bg-green-50 border-green-200">
              <p className="font-semibold text-gray-700 mb-2">API Endpoints</p>
              <p className="text-sm text-gray-600">
                GET /api/random-dish - Lấy món hôm nay
                <br />
                POST /api/random-dish - Random lại món hôm nay
                <br />
                GET /api/storage - Xem tất cả data đã lưu
              </p>
            </div>
            <div className="p-4 rounded-lg border-2 bg-blue-50 border-blue-200">
              <p className="font-semibold text-gray-700 mb-2">
                Lưu trữ dữ liệu
              </p>
              <p className="text-sm text-gray-600">
                ✅ Lưu vào file JSON: data/daily-dishes.json
                <br />
                ✅ Dữ liệu được commit lên git
                <br />
                ✅ Hoạt động trên Vercel và local
                <br />
                ✅ Mọi người thấy cùng kết quả
                <br />✅ Có thể force random lại cho hôm nay
              </p>
            </div>
            <div className="p-4 rounded-lg border-2 bg-yellow-50 border-yellow-200">
              <p className="font-semibold text-gray-700 mb-2">
                Response Format
              </p>
              <p className="text-sm text-gray-600">
                {`{
  "success": true,
  "data": {
    "name": "Tên món ăn",
    "url": "URL hình ảnh", 
    "weight": 3
  },
  "date": "2024-01-15",
  "message": "Đã random lại món ăn cho hôm nay"
}`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
