import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { Location } from '@/models/RSVP';

export async function POST(request: NextRequest) {
  try {
    const { name, email, attending, location } = await request.json();

    // Validate required fields
    if (!name || !email || typeof attending !== 'boolean' || !location) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Determine location details
    const locationDetails = location === Location.ROMANIA
      ? { name: 'Romania', flag: '🇷🇴', date: 'September 11-12, 2026', city: 'Oradea' }
      : { name: 'Vietnam', flag: '🇻🇳', date: 'September 22-24, 2026', city: 'Cam Ranh' };

    const otherLocationDetails = location === Location.ROMANIA
      ? { name: 'Vietnam', flag: '🇻🇳', date: 'September 22-24, 2026', url: 'https://catalam.com/vietnam' }
      : { name: 'Romania', flag: '🇷🇴', date: 'September 11-12, 2026', url: 'https://catalam.com/romania' };

    // Email template for guest
    const guestEmailHtml = attending
      ? `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #efd9df; font-family: Georgia, serif;">Cata & Lam</h1>
            <p style="color: #059669; font-style: italic;">Wedding Celebration 2026</p>
          </div>

          <h2 style="color: #374151; border-bottom: 2px solid #f3f4f6; padding-bottom: 10px;">
            Thank you for your RSVP! 🎉
          </h2>

          <p style="line-height: 1.6; color: #4b5563;">
            Dear ${name},
          </p>

          <p style="line-height: 1.6; color: #4b5563;">
            We're thrilled to confirm your attendance at our ${locationDetails.name} wedding celebration!
          </p>

          <div style="background: linear-gradient(135deg, #fdf2f8 0%, #f0fdf4 100%); padding: 25px; border-radius: 12px; margin: 30px 0; border-left: 4px solid #efd9df;">
            <h3 style="margin-top: 0; color: #374151; font-size: 18px;">
              ${locationDetails.flag} ${locationDetails.name} Wedding
            </h3>
            <p style="margin: 10px 0; color: #4b5563; font-size: 16px;">
              <strong>Date:</strong> ${locationDetails.date}
            </p>
            <p style="margin: 10px 0; color: #4b5563; font-size: 16px;">
              <strong>Location:</strong> ${locationDetails.city}, ${locationDetails.name}
            </p>
            <p style="margin: 15px 0 0 0; color: #6b7280; font-size: 14px; font-style: italic;">
              More details about the venue and schedule will be sent closer to the date.
            </p>
          </div>

          <p style="line-height: 1.6; color: #4b5563;">
            We're also celebrating in ${otherLocationDetails.name}! If you'd like to join us there as well,
            <a href="${otherLocationDetails.url}" style="color: #efd9df; text-decoration: none;">click here to RSVP</a>.
          </p>

          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h3 style="margin-top: 0; color: #374151;">What's Next?</h3>
            <ul style="line-height: 1.8; color: #4b5563;">
              <li>Keep an eye on your inbox for updates and detailed information</li>
              <li>Visit our website for the latest information about both celebrations</li>
              <li>Feel free to reach out to us at catalam@catalam.com if you have any questions</li>
            </ul>
          </div>

          <p style="line-height: 1.6; color: #4b5563;">
            We can't wait to celebrate with you!
          </p>

          <div style="text-align: center; margin: 30px 0; padding: 20px; background: linear-gradient(135deg, #fdf2f8 0%, #f0fdf4 100%); border-radius: 8px;">
            <p style="margin: 10px 0 0 0; font-weight: bold; color: #374151;">
              With love and excitement,<br />
              Cata & Lam ❤️
            </p>
          </div>

          <div style="margin-top: 20px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #f3f4f6; padding-top: 15px;">
            <p>
              This is an automated confirmation. For questions, contact us at catalam@catalam.com
            </p>
          </div>
        </div>
      `
      : `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #efd9df; font-family: Georgia, serif;">Cata & Lam</h1>
            <p style="color: #059669; font-style: italic;">Wedding Celebration 2026</p>
          </div>

          <h2 style="color: #374151; border-bottom: 2px solid #f3f4f6; padding-bottom: 10px;">
            Thank you for letting us know
          </h2>

          <p style="line-height: 1.6; color: #4b5563;">
            Dear ${name},
          </p>

          <p style="line-height: 1.6; color: #4b5563;">
            Thank you for letting us know you won't be able to join us for our ${locationDetails.name} wedding celebration.
            We'll miss you, but we completely understand!
          </p>

          <div style="background: #f9f9f9; padding: 25px; border-radius: 12px; margin: 30px 0; border-left: 4px solid #efd9df;">
            <p style="margin: 0; color: #4b5563; line-height: 1.6;">
              ${locationDetails.flag} ${locationDetails.name} Wedding - ${locationDetails.date}
            </p>
          </div>

          <p style="line-height: 1.6; color: #4b5563;">
            We're also celebrating in ${otherLocationDetails.name} on ${otherLocationDetails.date}.
            If you'd like to join us there,
            <a href="${otherLocationDetails.url}" style="color: #efd9df; text-decoration: none;">click here to RSVP</a>.
          </p>

          <p style="line-height: 1.6; color: #4b5563; margin-top: 25px;">
            Even though you can't make it to ${locationDetails.name}, you're still in our thoughts.
            We hope to celebrate with you another time!
          </p>

          <div style="text-align: center; margin: 30px 0; padding: 20px; background: linear-gradient(135deg, #fdf2f8 0%, #f0fdf4 100%); border-radius: 8px;">
            <p style="margin: 10px 0 0 0; font-weight: bold; color: #374151;">
              With love,<br />
              Cata & Lam ❤️
            </p>
          </div>

          <div style="margin-top: 20px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #f3f4f6; padding-top: 15px;">
            <p>
              This is an automated confirmation. For questions, contact us at catalam@catalam.com
            </p>
          </div>
        </div>
      `;

    // Send confirmation email to guest
    const guestMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: attending
        ? `RSVP Confirmed: ${locationDetails.name} Wedding - Cata & Lam`
        : `RSVP Received - Cata & Lam Wedding`,
      html: guestEmailHtml,
    };

    await transporter.sendMail(guestMailOptions);

    // Send notification to Cata & Lam
    const notificationMailOptions = {
      from: process.env.EMAIL_USER,
      to: 'catalam@catalam.com',
      subject: `RSVP ${attending ? 'Confirmed' : 'Declined'}: ${name} - ${locationDetails.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: ${attending ? '#059669' : '#ef4444'}; border-bottom: 2px solid #f3f4f6; padding-bottom: 10px;">
            ${attending ? '✅' : '❌'} RSVP ${attending ? 'Confirmed' : 'Declined'}
          </h2>

          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Guest:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Event:</strong> ${locationDetails.flag} ${locationDetails.name} Wedding</p>
            <p><strong>Status:</strong> ${attending ? 'ATTENDING' : 'NOT ATTENDING'}</p>
          </div>

          <p style="margin-top: 20px; font-size: 12px; color: #9ca3af;">
            Sent from CataLam Wedding Website
          </p>
        </div>
      `,
    };

    await transporter.sendMail(notificationMailOptions);

    return NextResponse.json({
      success: true,
      message: 'RSVP confirmation email sent successfully'
    });

  } catch (error) {
    console.error('RSVP confirmation email error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send RSVP confirmation email' },
      { status: 500 }
    );
  }
}
