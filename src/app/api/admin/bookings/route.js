import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";

// GET: Fetch all bookings for the Admin Dashboard
export async function GET() {
  try {
    const db = await connectToDatabase();
    
    // Fetch all bookings, sorted by the most recent first
    const allBookings = await db.collection("bookings")
      .find({})
      .sort({ bookedAt: -1 })
      .toArray();

    return NextResponse.json(allBookings);
  } catch (error) {
    console.error("Admin Fetch Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin bookings" },
      { status: 500 }
    );
  }
}

// PATCH: Update booking status 
export async function PATCH(req) {
  try {
    const db = await connectToDatabase();
    const { bookingId, newStatus } = await req.json();

    if (!bookingId || !newStatus) {
      return NextResponse.json(
        { error: "Missing bookingId or newStatus" },
        { status: 400 }
      );
    }

    const { ObjectId } = require("mongodb");
    const result = await db.collection("bookings").updateOne(
      { _id: new ObjectId(bookingId) },
      { $set: { status: newStatus } }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: "No booking found or status unchanged" },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: `Booking status updated to ${newStatus}` 
    });
  } catch (error) {
    console.error("Admin Update Error:", error);
    return NextResponse.json(
      { error: "Failed to update booking status" },
      { status: 500 }
    );
  }
}