

import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const db = await connectToDatabase();
    
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    const query = email ? { customerEmail: email } : {}; 


    if (!email) {
      return NextResponse.json([], { status: 200 });
    }

    const bookings = await db.collection("bookings")
      .find(query)
      .sort({ bookedAt: -1 })
      .toArray();

    return NextResponse.json(bookings);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


export async function POST(req) {
  try {
    const db = await connectToDatabase();
    const body = await req.json();
    
    const result = await db.collection("bookings").insertOne(body);

    return NextResponse.json({ 
      message: "Booking created", 
      insertedId: result.insertedId 
    }, { status: 201 });
    
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
