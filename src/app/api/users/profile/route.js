import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req) {
  const db = await connectToDatabase();
  const body = await req.json();
  // Update or Insert user profile
  await db.collection("users").updateOne(
    { email: body.email },
    { $set: body },
    { upsert: true }
  );
  return NextResponse.json({ success: true });
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  const db = await connectToDatabase();
  const user = await db.collection("users").findOne({ email });
  return NextResponse.json(user);
}