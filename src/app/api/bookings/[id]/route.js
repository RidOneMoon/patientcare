


import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  console.log("booking details get api running");

  try {
    const { id } = await params;
    const db = await connectToDatabase();

    const booking = await db.collection("bookings").findOne({
      _id: new ObjectId(id),
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json(booking);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    const { status } = await req.json(); 
    const db = await connectToDatabase();

    const result = await db.collection("bookings").updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: status } }
    );

    if (result.modifiedCount === 1) {
      return NextResponse.json({ message: "Status updated successfully" });
    } else {
      return NextResponse.json(
        { error: "Booking not found or no changes made" },
        { status: 404 }
      );
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    const db = await connectToDatabase();

    const result = await db.collection("bookings").deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 1) {
      return NextResponse.json({
        message: "Booking cancelled successfully",
      });
    } else {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

