import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const db = await connectToDatabase(); 
    const body = await req.json();

    const result = await db.collection("services").insertOne(body);

    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const db = await connectToDatabase();
    const services = await db.collection("services").find({}).toArray();
    return NextResponse.json(services);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}