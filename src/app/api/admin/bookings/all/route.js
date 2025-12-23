import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const db = await connectToDatabase();
    const bookings = await db.collection("bookings")
      .find()
      .sort({ bookedAt: -1 })
      .toArray();

    return NextResponse.json(bookings || [], { status: 200 });
  } catch (error) {
    console.error("Admin API Error:", error);
    return NextResponse.json([], { status: 500 });
  }
};