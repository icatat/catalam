import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const PALETTE = {
  bg: '#faf3f1',          // soft pink-cream, matches site bg.default
  paper: '#ffffff',
  paperWarm: '#eef2f4',
  ink: '#20485b',
  inkSoft: '#4a6a78',
  text: '#1f2937',
  textSoft: '#5a6b78',
  accent: '#b88880',
  brass: '#6a8593',
  brassSoft: '#c4d0d8',
  hairline: 'rgba(32, 72, 91, 0.10)',
} as const;

const FONT_SERIF =
  '"Cormorant Garamond", "EB Garamond", "Garamond", Georgia, "Times New Roman", serif';
const FONT_SCRIPT =
  '"Arizonia", "Allura", "Pinyon Script", "Brush Script MT", "Lucida Handwriting", cursive';
const FONT_SANS =
  '"Thasadith", -apple-system, BlinkMacSystemFont, "Helvetica Neue", "Segoe UI", Arial, sans-serif';

const FONT_LINK = `<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Arizonia&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Thasadith:wght@400;700&display=swap" rel="stylesheet" />`;

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function wrapperOpen(backgroundImage: string): string {
  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="${PALETTE.bg}" style="background-color:${PALETTE.bg};background-image:url('${backgroundImage}');background-repeat:repeat;background-size:480px;padding:40px 16px;">
    <tr>
      <td align="center">`;
}

const wrapperClose = `      </td>
    </tr>
  </table>`;

function buildInternalEmail(name: string, email: string, subject: string, message: string, backgroundImage: string): string {
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>New contact message — ${escapeHtml(subject)}</title>
  ${FONT_LINK}
</head>
<body style="margin:0;padding:0;background-color:${PALETTE.bg};font-family:${FONT_SERIF};color:${PALETTE.text};">
  ${wrapperOpen(backgroundImage)}
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;width:100%;background-color:${PALETTE.paper};border-radius:6px;border:1px solid ${PALETTE.brassSoft};box-shadow:0 2px 4px rgba(32,72,91,0.06),0 24px 48px -20px rgba(32,72,91,0.22);overflow:hidden;">
          <tr>
            <td style="background-color:${PALETTE.brass};height:6px;line-height:6px;font-size:0;">&nbsp;</td>
          </tr>
          <tr>
            <td style="padding:40px 40px 36px 40px;background-color:${PALETTE.paper};">
              <p style="margin:0 0 10px 0;font-family:${FONT_SANS};font-size:11px;font-weight:700;color:${PALETTE.accent};letter-spacing:0.32em;text-transform:uppercase;">New message</p>
              <h1 style="margin:0 0 28px 0;font-family:${FONT_SERIF};font-weight:500;font-size:28px;line-height:1.2;color:${PALETTE.ink};">${escapeHtml(subject)}</h1>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 28px 0;">
                <tr><td style="padding:10px 0;border-bottom:1px solid ${PALETTE.hairline};font-family:${FONT_SANS};font-size:10px;font-weight:700;color:${PALETTE.brass};letter-spacing:0.25em;text-transform:uppercase;width:80px;">From</td><td style="padding:10px 0;border-bottom:1px solid ${PALETTE.hairline};font-family:${FONT_SERIF};font-style:italic;font-size:17px;color:${PALETTE.ink};">${escapeHtml(name)}</td></tr>
                <tr><td style="padding:10px 0;border-bottom:1px solid ${PALETTE.hairline};font-family:${FONT_SANS};font-size:10px;font-weight:700;color:${PALETTE.brass};letter-spacing:0.25em;text-transform:uppercase;">Email</td><td style="padding:10px 0;border-bottom:1px solid ${PALETTE.hairline};font-family:${FONT_SERIF};font-style:italic;font-size:17px;color:${PALETTE.ink};"><a href="mailto:${escapeHtml(email)}" style="color:${PALETTE.accent};text-decoration:none;border-bottom:1px solid ${PALETTE.brassSoft};">${escapeHtml(email)}</a></td></tr>
              </table>

              <p style="margin:0 0 10px 0;font-family:${FONT_SANS};font-size:10px;font-weight:700;color:${PALETTE.brass};letter-spacing:0.25em;text-transform:uppercase;">Message</p>
              <div style="font-family:${FONT_SERIF};font-style:italic;font-size:18px;line-height:1.7;color:${PALETTE.text};border-left:2px solid ${PALETTE.accent};padding:4px 0 4px 20px;">${safeMessage}</div>

              <p style="margin:32px 0 0 0;font-family:${FONT_SANS};font-size:12px;color:${PALETTE.textSoft};">Reply directly to this email to respond.</p>
            </td>
          </tr>
        </table>
${wrapperClose}
</body>
</html>`;
}

function buildAutoReply(name: string, subject: string, message: string, backgroundImage: string, nameHeaderImage: string): string {
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Thank you — Cătălina &amp; Lam</title>
  ${FONT_LINK}
</head>
<body style="margin:0;padding:0;background-color:${PALETTE.bg};font-family:${FONT_SERIF};color:${PALETTE.text};">
  ${wrapperOpen(backgroundImage)}
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;width:100%;background-color:${PALETTE.paper};border-radius:6px;border:1px solid ${PALETTE.brassSoft};box-shadow:0 2px 4px rgba(32,72,91,0.06),0 24px 48px -20px rgba(32,72,91,0.22);overflow:hidden;">
          <tr>
            <td style="background-color:${PALETTE.brass};height:6px;line-height:6px;font-size:0;">&nbsp;</td>
          </tr>

          <!-- Name header band -->
          <tr>
            <td style="background-color:${PALETTE.paper};padding:28px 24px 18px 24px;text-align:center;border-bottom:1px solid ${PALETTE.brassSoft};">
              <img src="${nameHeaderImage}" alt="Cătălina &amp; Lam" width="260" style="display:inline-block;width:auto;max-width:260px;height:auto;border:0;outline:none;text-decoration:none;" />
              <p style="margin:10px 0 0 0;font-family:${FONT_SANS};font-size:9px;font-weight:700;color:${PALETTE.brass};letter-spacing:0.5em;text-transform:uppercase;">September 2026</p>
            </td>
          </tr>

          <tr>
            <td style="padding:48px 44px 44px 44px;text-align:center;background-color:${PALETTE.paper};">

              <div style="font-family:${FONT_SERIF};font-style:italic;color:${PALETTE.brass};font-size:18px;letter-spacing:0.4em;margin:0 0 18px 0;line-height:1;">·&nbsp;&nbsp;&nbsp;❦&nbsp;&nbsp;&nbsp;·</div>

              <p style="margin:0 0 14px 0;font-family:${FONT_SANS};font-size:11px;font-weight:700;color:${PALETTE.accent};letter-spacing:0.34em;text-transform:uppercase;">Thank you</p>

              <h1 style="margin:0 0 30px 0;font-family:${FONT_SERIF};font-weight:500;font-size:38px;line-height:1.1;color:${PALETTE.ink};letter-spacing:-0.005em;">We received your note</h1>

              <!-- Decorative double-rule -->
              <table role="presentation" width="80" cellspacing="0" cellpadding="0" border="0" style="margin:0 auto 28px auto;">
                <tr><td style="height:1px;line-height:1px;background-color:${PALETTE.brass};font-size:0;">&nbsp;</td></tr>
                <tr><td style="height:3px;line-height:3px;font-size:0;">&nbsp;</td></tr>
                <tr><td style="height:1px;line-height:1px;background-color:${PALETTE.brassSoft};font-size:0;">&nbsp;</td></tr>
              </table>

              <p style="margin:0 auto 18px auto;max-width:440px;font-family:${FONT_SERIF};font-style:italic;font-size:22px;line-height:1.55;color:${PALETTE.ink};">Dear ${escapeHtml(name)},</p>

              <p style="margin:0 auto 30px auto;max-width:440px;font-family:${FONT_SANS};font-size:17px;line-height:1.65;color:${PALETTE.text};">Thank you for reaching out — we&rsquo;ll reply as soon as we can.</p>

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:30px 0;">
                <tr>
                  <td style="padding:28px 24px;background-color:${PALETTE.paperWarm};border:1px solid ${PALETTE.brassSoft};border-radius:4px;text-align:left;">
                    <p style="margin:0 0 8px 0;font-family:${FONT_SANS};font-size:10px;font-weight:700;color:${PALETTE.brass};letter-spacing:0.3em;text-transform:uppercase;">Your message</p>
                    <p style="margin:0 0 14px 0;font-family:${FONT_SERIF};font-size:15px;color:${PALETTE.inkSoft};font-style:italic;">Re: ${escapeHtml(subject)}</p>
                    <div style="font-family:${FONT_SERIF};font-style:italic;font-size:17px;line-height:1.7;color:${PALETTE.text};">${safeMessage}</div>
                  </td>
                </tr>
              </table>

              <!-- Sign-off divider -->
              <table role="presentation" width="60" cellspacing="0" cellpadding="0" border="0" style="margin:30px auto 24px auto;">
                <tr><td style="height:1px;line-height:1px;background-color:${PALETTE.brass};font-size:0;">&nbsp;</td></tr>
              </table>

              <p style="margin:0 0 8px 0;font-family:${FONT_SANS};font-size:14px;color:${PALETTE.inkSoft};letter-spacing:0.02em;">With love,</p>
              <p style="margin:0;font-family:${FONT_SCRIPT};font-size:48px;line-height:1.1;color:${PALETTE.ink};">Cătălina &amp; Lam</p>
            </td>
          </tr>

          <tr>
            <td style="background-color:${PALETTE.brass};height:3px;line-height:3px;font-size:0;">&nbsp;</td>
          </tr>
        </table>

        <p style="margin:22px 0 0 0;font-family:${FONT_SANS};font-size:11px;color:${PALETTE.textSoft};letter-spacing:0.05em;">
          Automated reply — please don&rsquo;t reply to this address. For anything urgent, write to catalam@catalam.com.
        </p>
${wrapperClose}
</body>
</html>`;
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    const origin =
      process.env.NEXT_PUBLIC_SITE_URL ||
      request.headers.get('origin') ||
      `https://${request.headers.get('host') || 'catalam.com'}`;
    const backgroundImage = `${origin}/background-main.webp`;
    const nameHeaderImage = `${origin}/NameHeader.png`;

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const internalMail = {
      from: process.env.EMAIL_USER,
      to: 'catalam@catalam.com',
      subject: `Contact form — ${subject}`,
      html: buildInternalEmail(name, email, subject, message, backgroundImage),
      replyTo: email,
    };
    await transporter.sendMail(internalMail);

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thank you for your message — Cătălina & Lam',
      html: buildAutoReply(name, subject, message, backgroundImage, nameHeaderImage),
    });

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
