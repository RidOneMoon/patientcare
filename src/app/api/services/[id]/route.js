import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {


    const { id } = await params;

    const db = await connectToDatabase();
    
    const service = await db.collection("services").findOne({ service_id: id });

    if(!service) {
      return NextResponse.json({ error: "Service Not Found" }, { status: 404 });
    }

    return NextResponse.json(service);

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}