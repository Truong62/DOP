import { NextResponse } from "next/server";
import { getAllStoredData } from "@/lib/storage";

export async function GET() {
  try {
    const data = await getAllStoredData();
    const today = new Date().toISOString().split("T")[0];
    const todayDish = data[today];

    return NextResponse.json({
      success: true,
      hasTodayDish: !!todayDish,
      lastUpdated: todayDish ? new Date().toISOString() : null,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to check update",
      },
      { status: 500 }
    );
  }
}
