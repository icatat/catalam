import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json();

    // Validate required fields
    if (!name || !email || !subject || !message) {
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

    // Email content to Cata & Lam
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'catalam@catalam.com',
      subject: `Contact Form: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #dc2626; border-bottom: 2px solid #dc2626; padding-bottom: 10px;">
            New Contact Form Message
          </h2>
          
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>From:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
          </div>
          
          <div style="background: white; padding: 20px; border-left: 4px solid #dc2626; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #374151;">Message:</h3>
            <p style="line-height: 1.6; color: #4b5563;">${message.replace(/\n/g, '<br>')}</p>
          </div>
          
          <div style="margin-top: 30px; padding: 15px; background: #f3f4f6; border-radius: 8px; text-align: center;">
            <p style="margin: 0; font-size: 14px; color: #6b7280;">
              Reply directly to this email to respond to ${name} at ${email}
            </p>
          </div>
          
          <div style="margin-top: 20px; text-align: center; font-size: 12px; color: #9ca3af;">
            <p>Sent from CataLam Wedding Website Contact Form</p>
          </div>
        </div>
      `,
      replyTo: email, // Allow direct reply to the sender
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Send auto-reply to sender
    const autoReplyOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thank you for contacting us - Cata & Lam Wedding',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #dc2626; font-family: Georgia, serif;">Cata & Lam</h1>
            <p style="color: #059669; font-style: italic;">Wedding Celebration 2026</p>
          </div>
          
          <h2 style="color: #374151; border-bottom: 2px solid #f3f4f6; padding-bottom: 10px;">
            Thank you for your message! 💕
          </h2>
          
          <p style="line-height: 1.6; color: #4b5563;">
            Dear ${name},
          </p>
          
          <p style="line-height: 1.6; color: #4b5563;">
            Thank you for reaching out to us! We've received your message about "<strong>${subject}</strong>" 
            and we'll get back to you as soon as possible.
          </p>
          
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #dc2626;">Your Message:</h3>
            <p style="line-height: 1.6; color: #4b5563; font-style: italic;">${message.replace(/\n/g, '<br>')}</p>
          </div>
          
          <p style="line-height: 1.6; color: #4b5563;">
            In the meantime, feel free to explore our wedding pages:
          </p>
          
          <div style="margin: 20px 0;">
            <p style="margin: 8px 0;">
              🇷🇴 <a href="https://catalam.com/romania" style="color: #dc2626; text-decoration: none;">
                Romania Wedding - September 11-12, 2026
              </a>
            </p>
            <p style="margin: 8px 0;">
              🇻🇳 <a href="https://catalam.com/vietnam" style="color: #059669; text-decoration: none;">
                Vietnam Wedding - September 26, 2026
              </a>
            </p>
          </div>
          
          <p style="line-height: 1.6; color: #4b5563;">
            We're so excited to celebrate with you! 
          </p>
          
          <div style="text-align: center; margin: 30px 0; padding: 20px; background: linear-gradient(135deg, #fdf2f8 0%, #f0fdf4 100%); border-radius: 8px;">
            <p style="margin: 0; font-style: italic; color: #6b7280;">
              "Love is not just looking at each other, it's looking in the same direction together."
            </p>
            <p style="margin: 10px 0 0 0; font-weight: bold; color: #374151;">
              With love,<br />
              Cata & Lam ❤️
            </p>
          </div>
          
          <div style="margin-top: 20px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #f3f4f6; padding-top: 15px;">
            <p>
              This is an automated response. Please don't reply to this email directly.<br />
              For urgent matters, contact us at catalam@catalam.com
            </p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(autoReplyOptions);

    return NextResponse.json({ 
      success: true, 
      message: 'Message sent successfully' 
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send message' },
      { status: 500 }
    );
  }
}