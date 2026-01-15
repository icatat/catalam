import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { Location } from '@/models/RSVP';

// Email template functions
function getPositiveEmailTemplate(name: string, location: Location): string {
  const isRomania = location === Location.ROMANIA;
  const locationName = isRomania ? 'Romania' : 'Vietnam';
  const headerImage = isRomania ? "https://6khz2sa0mggxbsdm.public.blob.vercel-storage.com/photo_3.png" : "https://6khz2sa0mggxbsdm.public.blob.vercel-storage.com/photo_0.png"
  const date = isRomania ? 'September 11-12, 2026' : 'September 26, 2026';
  const city = isRomania ? 'Oradea, Romania' : 'Hanoi, Vietnam';

  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Wedding Confirmation - Cata & Lam</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f8f9fa;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <!-- Header Image -->
            <div style="height: 250px; position: relative; overflow: hidden;">
                <img src="${headerImage}" alt="${locationName} Wedding" style="width: 100%; height: 100%; object-fit: cover; display: block;" />
                <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(45deg, rgba(0,0,0,0.5), rgba(0,0,0,0.3));"></div>
                <div style="position: absolute; bottom: 20px; left: 20px; color: white; text-shadow: 2px 2px 4px rgba(0,0,0,0.8);">
                    <h1 style="margin: 0; font-size: 28px; font-weight: bold;">✨ You're Coming! ✨</h1>
                    <p style="margin: 5px 0 0 0; font-size: 16px;">${locationName} Wedding Celebration</p>
                </div>
            </div>
            
            <!-- Content -->
            <div style="padding: 30px; text-align: center;">
                <h2 style="color: ${isRomania ? '#dc2626' : '#059669'}; margin-bottom: 20px; font-size: 24px;">
                    🎉 We're So Excited! 💃🕺
                </h2>
                
                <p style="font-size: 18px; color: #374151; line-height: 1.6; margin-bottom: 20px;">
                    Hi <strong>${name}</strong>! 
                </p>
                
                <div style="background-color: #f0fdf4; border: 2px solid #; border-radius: 10px; padding: 20px; margin: 20px 0;">
                    <p style="font-size: 16px; color: #166534; margin: 0; line-height: 1.6;">
                        <strong>🎊 CONFIRMED:</strong> You're attending our ${locationName} wedding! 
                        We can't wait to celebrate with you!
                    </p>
                </div>
                
                <div style="background-color: #fef9e7; border-radius: 10px; padding: 20px; margin: 20px 0; text-align: left;">
                    <h3 style="color: ${isRomania ? '#dc2626' : '#059669'}; margin-top: 0; display: flex; align-items: center;">
                        📅 Wedding Details
                    </h3>
                    <p style="margin: 8px 0; color: #374151;"><strong>📍 Location:</strong> ${city}</p>
                    <p style="margin: 8px 0; color: #374151;"><strong>🗓️ Date:</strong> ${date}</p>
                </div>
                
                <p style="font-size: 16px; color: #6b7280; line-height: 1.6; margin: 20px 0;">
                    We'll send you more details as the date approaches, including venue information, 
                    accommodation suggestions, and what to expect! 📬
                </p>
                
                <div style="border-top: 2px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
                    <p style="font-size: 16px; color: #374151; font-style: italic; margin-bottom: 10px;">
                        With all our love and excitement, 💕
                    </p>
                    <p style="font-size: 18px; color: ${isRomania ? '#dc2626' : '#059669'}; font-weight: bold; margin: 0;">
                      <img src="/NameHeader.png" style="width: 25%; object-fit: cover; display: block;" />
                    </p>
                </div>
            </div>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
            <p>This email was sent because you RSVP'd for our wedding. 💌</p>
        </div>
    </body>
    </html>
  `;
}

function getNegativeEmailTemplate(name: string, location: Location): string {
  const isRomania = location === Location.ROMANIA;
  const headerImage = isRomania ? "https://6khz2sa0mggxbsdm.public.blob.vercel-storage.com/photo_3.png" : "https://6khz2sa0mggxbsdm.public.blob.vercel-storage.com/photo_0.png"
  const locationName = isRomania ? 'Romania' : 'Vietnam';

  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Wedding RSVP - Cata & Lam</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f8f9fa;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <!-- Header Image -->
            <div style="height: 250px; position: relative; overflow: hidden;">
                <img src=${headerImage} alt="${locationName} Wedding" style="width: 100%; height: 100%; object-fit: cover; display: block;" />
                <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(45deg, rgba(0,0,0,0.6), rgba(0,0,0,0.4));"></div>
                <div style="position: absolute; bottom: 20px; left: 20px; color: white; text-shadow: 2px 2px 4px rgba(0,0,0,0.8);">
                    <h1 style="margin: 0; font-size: 28px; font-weight: bold;">💝 We'll Miss You 💝</h1>
                    <p style="margin: 5px 0 0 0; font-size: 16px;">${locationName} Wedding Celebration</p>
                </div>
            </div>
            
            <!-- Content -->
            <div style="padding: 30px; text-align: center;">
                <h2 style="color: ${isRomania ? '#dc2626' : '#059669'}; margin-bottom: 20px; font-size: 24px;">
                    😢 We Understand 🤗
                </h2>
                
                <p style="font-size: 18px; color: #374151; line-height: 1.6; margin-bottom: 20px;">
                    Hi <strong>${name}</strong>! 👋
                </p>
                
                <div style="background-color: #fef2f2; border: 2px solid #f87171; border-radius: 10px; padding: 20px; margin: 20px 0;">
                    <p style="font-size: 16px; color: #7f1d1d; margin: 0; line-height: 1.6;">
                        We received your RSVP and understand you won't be able to join us in ${locationName}. 
                        While we're sad you can't be there, we completely understand! 💙
                    </p>
                </div>
                
                <div style="background-color: #f0f9ff; border-radius: 10px; padding: 20px; margin: 20px 0;">
                    <p style="font-size: 16px; color: #374151; line-height: 1.6; margin: 0;">
                        Even though you can't be with us physically, you'll be in our hearts on our special day! 💕 
                        We hope to celebrate with you in another way soon! 🥂
                    </p>
                </div>
                
                <p style="font-size: 16px; color: #6b7280; line-height: 1.6; margin: 20px 0;">
                    Thank you for letting us know, and we look forward to sharing photos and stories 
                    with you after our celebration! 📸✨
                </p>
                
                <div style="border-top: 2px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
                    <p style="font-size: 16px; color: #374151; font-style: italic; margin-bottom: 10px;">
                        Sending you love and hugs, 🤗💕
                    </p>
                    <p style="font-size: 18px; color: ${isRomania ? '#dc2626' : '#059669'}; font-weight: bold; margin: 0;">
                      <img src="/NameHeader.png" style="width: 25%; object-fit: cover; display: block;" />
                    </p>
                </div>
            </div>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
            <p>This email was sent because you RSVP'd for our wedding.</p>
        </div>
    </body>
    </html>
  `;
}

export async function POST(request: Request) {
  try {
    const { name, email, attending, location } = await request.json();
    if (!name || !email || !location) {
      return NextResponse.json(
        { error: 'Name, email, and location are required' },
        { status: 400 }
      );
    }

    if (!process.env.EMAIL_USER) {
        return NextResponse.json(
        { error: "An internal error occurred - missing EMAIL_USER variable." },
        { status: 500 }
      );
    }
    if (!process.env.EMAIL_PASS) {
        return NextResponse.json(
        { error: "An internal error occurred - missing EMAIL_USER variable." },
        { status: 500 }
      );
    }
    try {
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER!,
          pass: process.env.EMAIL_PASS!,
        },
      });

      const locationName = location === Location.ROMANIA ? 'Romania' : 'Vietnam';
      const emailTemplate = attending 
        ? getPositiveEmailTemplate(name, location)
        : getNegativeEmailTemplate(name, location);

      // Email to guest
      await transporter.sendMail({
        from: `"Cata & Lam - ${locationName} Wedding 💒" <${process.env.EMAIL_USER!}>`,
        to: email,
        subject: attending 
          ? `🎉 See you in ${locationName}! Wedding Confirmation 💒`
          : `💝 Thank you for your RSVP - We'll miss you! 🤗`,
        html: emailTemplate,
      });

      // CC notification to couple
      await transporter.sendMail({
        from: `"Wedding RSVP Bot 🤖" <${process.env.EMAIL_USER!}>`,
        to: process.env.EMAIL_USER!,
        subject: `${attending ? '🎉' : '😢'} New RSVP from ${name}`,
        text: `${name} (${email}) is ${attending ? 'attending 🎉' : 'not attending 😢'} the ${locationName} wedding.`,
      });
      
      return NextResponse.json(
        { success: 'Successfully sent the RSVP confirmation!' },
        { status: 200 }
      );
    } catch (emailError) {
      console.error('Email error:', emailError);
      return NextResponse.json(
        { error: 'Failed to send confirmation email' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in send-rsvp-confirmation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}