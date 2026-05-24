import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { Location } from '@/models/RSVP';

interface TemplateContext {
  name: string;
  location: Location;
  attending: boolean;
  heroImage: string;
  backgroundImage: string;
  nameHeaderImage: string;
}

const PALETTE = {
  bg: '#faf3f1',          // matches site bg.default — soft pink-cream
  paper: '#ffffff',       // clean white card
  paperWarm: '#eef2f4',   // pale slate inset for detail panels
  ink: '#20485b',
  inkSoft: '#4a6a78',
  text: '#1f2937',        // matches site text.primary
  textSoft: '#5a6b78',
  accent: '#b88880',
  accentSoft: '#d9b9b2',
  // Ink-slate accents — same family as the deep heading ink.
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

function getLocationDetails(location: Location, origin: string) {
  const isRomania = location === Location.ROMANIA;
  return {
    name: isRomania ? 'Romania' : 'Vietnam',
    city: isRomania ? 'Oradea' : 'Cam Ranh',
    country: isRomania ? 'Romania' : 'Vietnam',
    dateLine: isRomania ? '11 — 12 September 2026' : '24 — 25 September 2026',
    heroImage: `${origin}${isRomania ? '/photo_3.png' : '/photo_0.png'}`,
  };
}

function buildEmail({ name, location, attending, heroImage, backgroundImage, nameHeaderImage }: TemplateContext): string {
  const details = { ...getLocationDetails(location, ''), heroImage };
  const eyebrow = attending ? 'You\'re confirmed' : 'Your RSVP';
  const heading = attending
    ? `See you in ${details.city}`
    : 'We\'ll miss you';
  const lead = attending
    ? `Thank you — we&rsquo;ve received your RSVP for our ${details.name} celebration, and we couldn&rsquo;t be happier knowing you&rsquo;ll be with us.`
    : `Thank you for letting us know. We&rsquo;re sorry you can&rsquo;t join us in ${details.city}, but you&rsquo;ll be in our thoughts on the day.`;
  const tail = attending
    ? `We&rsquo;ll write again closer to the date with venue notes, where to stay, and anything else worth knowing. Until then — save the date, and bring a comfortable pair of dancing shoes.`
    : `We&rsquo;d love to celebrate with you in another way soon, and we&rsquo;ll share photos and stories after the day so you can be part of the memory.`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${attending ? 'Confirmed' : 'RSVP received'} — Cătălina &amp; Lam</title>
  ${FONT_LINK}
</head>
<body style="margin:0;padding:0;background-color:${PALETTE.bg};font-family:${FONT_SERIF};color:${PALETTE.text};-webkit-font-smoothing:antialiased;">
  <div style="display:none;max-height:0;overflow:hidden;">${attending ? `Your RSVP for ${details.city} is confirmed.` : `We have received your RSVP.`}</div>

  <!-- Outer wrapper with tiled background -->
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="${PALETTE.bg}" style="background-color:${PALETTE.bg};background-image:url('${backgroundImage}');background-repeat:repeat;background-size:480px;padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;width:100%;background-color:${PALETTE.paper};border-radius:6px;overflow:hidden;border:1px solid ${PALETTE.brassSoft};box-shadow:0 2px 4px rgba(32,72,91,0.06),0 24px 48px -20px rgba(32,72,91,0.22);">

          <!-- Brass top accent line -->
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

          <!-- Hero image (polaroid frame) -->
          <tr>
            <td style="padding:28px 28px 0 28px;text-align:center;background-color:${PALETTE.paper};">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="background-color:#ffffff;padding:10px 10px 14px 10px;border:1px solid ${PALETTE.hairline};box-shadow:0 8px 24px -16px rgba(32,72,91,0.22);">
                    <img src="${heroImage}" alt="${details.city}, ${details.country}" width="540" style="display:block;width:100%;height:auto;max-height:340px;object-fit:cover;border:0;outline:none;text-decoration:none;" />
                    <p style="margin:10px 0 0 0;font-family:${FONT_SCRIPT};font-size:22px;color:${PALETTE.ink};line-height:1;">${details.city}, ${details.country}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 44px 44px 44px;text-align:center;background-color:${PALETTE.paper};">

              <!-- Ornament -->
              <div style="font-family:${FONT_SERIF};font-style:italic;color:${PALETTE.brass};font-size:18px;letter-spacing:0.4em;margin:0 0 18px 0;line-height:1;">·&nbsp;&nbsp;&nbsp;❦&nbsp;&nbsp;&nbsp;·</div>

              <!-- Eyebrow -->
              <p style="margin:0 0 14px 0;font-family:${FONT_SANS};font-size:11px;font-weight:700;color:${PALETTE.accent};letter-spacing:0.34em;text-transform:uppercase;">${eyebrow}</p>

              <!-- Heading -->
              <h1 style="margin:0 0 10px 0;font-family:${FONT_SERIF};font-weight:500;font-size:40px;line-height:1.1;color:${PALETTE.ink};letter-spacing:-0.005em;">${heading}</h1>

              <!-- Date line -->
              <p style="margin:0 0 30px 0;font-family:${FONT_SERIF};font-style:italic;font-size:20px;color:${PALETTE.inkSoft};">${details.dateLine}</p>

              <!-- Decorative double-rule -->
              <table role="presentation" width="80" cellspacing="0" cellpadding="0" border="0" style="margin:0 auto 28px auto;">
                <tr>
                  <td style="height:1px;line-height:1px;background-color:${PALETTE.brass};font-size:0;">&nbsp;</td>
                </tr>
                <tr><td style="height:3px;line-height:3px;font-size:0;">&nbsp;</td></tr>
                <tr>
                  <td style="height:1px;line-height:1px;background-color:${PALETTE.brassSoft};font-size:0;">&nbsp;</td>
                </tr>
              </table>

              <!-- Salutation -->
              <p style="margin:0 auto 18px auto;max-width:440px;font-family:${FONT_SERIF};font-style:italic;font-size:22px;line-height:1.55;color:${PALETTE.ink};">
                Dear ${name},
              </p>

              <!-- Lead paragraph -->
              <p style="margin:0 auto 22px auto;max-width:440px;font-family:${FONT_SANS};font-size:17px;line-height:1.65;color:${PALETTE.text};">${lead}</p>

              <!-- Details panel (attending only) -->
              ${attending ? `
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:36px 0 30px 0;">
                <tr>
                  <td style="padding:0;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:${PALETTE.paperWarm};border:1px solid ${PALETTE.brassSoft};border-radius:4px;">
                      <tr>
                        <td style="padding:28px 24px 26px 24px;text-align:center;">
                          <p style="margin:0 0 6px 0;font-family:${FONT_SANS};font-size:10px;font-weight:700;color:${PALETTE.brass};letter-spacing:0.32em;text-transform:uppercase;">Where</p>
                          <p style="margin:0 0 18px 0;font-family:${FONT_SERIF};font-style:italic;font-size:22px;color:${PALETTE.ink};">${details.city}, ${details.country}</p>

                          <!-- mini brass divider -->
                          <table role="presentation" width="40" cellspacing="0" cellpadding="0" border="0" style="margin:0 auto 18px auto;">
                            <tr><td style="height:1px;line-height:1px;background-color:${PALETTE.brassSoft};font-size:0;">&nbsp;</td></tr>
                          </table>

                          <p style="margin:0 0 6px 0;font-family:${FONT_SANS};font-size:10px;font-weight:700;color:${PALETTE.brass};letter-spacing:0.32em;text-transform:uppercase;">When</p>
                          <p style="margin:0;font-family:${FONT_SERIF};font-style:italic;font-size:22px;color:${PALETTE.ink};">${details.dateLine}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              ` : ''}

              <!-- Tail paragraph -->
              <p style="margin:0 auto 36px auto;max-width:440px;font-family:${FONT_SANS};font-size:17px;line-height:1.65;color:${PALETTE.text};">${tail}</p>

              <!-- Sign-off divider -->
              <table role="presentation" width="60" cellspacing="0" cellpadding="0" border="0" style="margin:0 auto 24px auto;">
                <tr>
                  <td style="height:1px;line-height:1px;background-color:${PALETTE.brass};font-size:0;">&nbsp;</td>
                </tr>
              </table>

              <!-- Sign-off -->
              <p style="margin:0 0 8px 0;font-family:${FONT_SANS};font-size:14px;color:${PALETTE.inkSoft};letter-spacing:0.02em;">With all our love,</p>
              <p style="margin:0;font-family:${FONT_SCRIPT};font-size:48px;line-height:1.1;color:${PALETTE.ink};">Cătălina &amp; Lam</p>

            </td>
          </tr>

          <!-- Brass bottom accent line -->
          <tr>
            <td style="background-color:${PALETTE.brass};height:3px;line-height:3px;font-size:0;">&nbsp;</td>
          </tr>
        </table>

        <!-- Footer -->
        <p style="margin:22px 0 0 0;font-family:${FONT_SANS};font-size:11px;color:${PALETTE.textSoft};letter-spacing:0.05em;">
          You&rsquo;re receiving this because you RSVP&rsquo;d for our wedding.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
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

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return NextResponse.json(
        { error: 'An internal error occurred — missing email credentials.' },
        { status: 500 }
      );
    }

    const origin =
      process.env.NEXT_PUBLIC_SITE_URL ||
      request.headers.get('origin') ||
      `https://${request.headers.get('host') || 'catalam.com'}`;

    const details = getLocationDetails(location, origin);
    const backgroundImage = `${origin}/background-main.webp`;
    const nameHeaderImage = `${origin}/NameHeader.png`;

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

      const html = buildEmail({
        name,
        location,
        attending,
        heroImage: details.heroImage,
        backgroundImage,
        nameHeaderImage,
      });

      const subject = attending
        ? `See you in ${details.city} — Cătălina & Lam`
        : `Thank you for your RSVP — Cătălina & Lam`;

      // Email to guest
      await transporter.sendMail({
        from: `"Cătălina & Lam" <${process.env.EMAIL_USER!}>`,
        to: email,
        subject,
        html,
      });

      // Notification to couple
      await transporter.sendMail({
        from: `"Wedding RSVP" <${process.env.EMAIL_USER!}>`,
        to: process.env.EMAIL_USER!,
        subject: `RSVP from ${name} — ${details.name} (${attending ? 'attending' : 'not attending'})`,
        text: `${name} (${email}) is ${attending ? 'attending' : 'not attending'} the ${details.name} wedding.`,
      });

      return NextResponse.json(
        { success: 'RSVP confirmation sent' },
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
