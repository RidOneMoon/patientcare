

import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, name, serviceTitle, totalCost, date, shift } = body;

    const { data, error } = await resend.emails.send({
      from: 'Care XYZ <onboarding@resend.dev>',
      to: email,
      subject: `Invoice: ${serviceTitle} Booking`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333; border: 1px solid #eee; border-radius: 12px;">
          <h1 style="color: #2563eb;">Care XYZ Invoice</h1>
          <p>Hello <strong>${name}</strong>,</p>
          <p>Your booking for <strong>${serviceTitle}</strong> has been received.</p>
          <hr style="border: none; border-top: 1px solid #eee;" />
          <div style="background: #f8fafc; padding: 15px; border-radius: 8px;">
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Shift:</strong> ${shift}</p>
            <p><strong>Total Amount:</strong> ৳${totalCost}</p>
          </div>
          <hr style="border: none; border-top: 1px solid #eee;" />
          <p>Our team will contact you shortly to confirm the details.</p>
        </div>
      `,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}    