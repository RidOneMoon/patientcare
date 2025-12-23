import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const { email, name, serviceTitle, totalCost, date, shift } = await req.json();

    await resend.emails.send({
      from: 'Care XYZ <onboarding@resend.dev>', // Use your verified domain in production
      to: email,
      subject: `Invoice: ${serviceTitle} Booking`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h1 style="color: #2563eb;">Care XYZ Invoice</h1>
          <p>Hello <strong>${name}</strong>,</p>
          <p>Your booking for <strong>${serviceTitle}</strong> has been received.</p>
          <hr />
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Shift:</strong> ${shift}</p>
          <p><strong>Total Amount:</strong> ৳${totalCost}</p>
          <hr />
          <p>Our team will contact you shortly to confirm the details.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}