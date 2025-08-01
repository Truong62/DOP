import { NextResponse } from "next/server";
import { getAllStoredData } from "@/lib/storage";

export async function GET() {
  try {
    const data = await getAllStoredData();

    return NextResponse.json({
      success: true,
      data: data,
      totalDates: Object.keys(data).length,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to read storage data",
      },
      { status: 500 }
    );
  }
}
