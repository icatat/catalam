import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { supabase } from '@/lib/supabase';

const ADMINS = [
  { first_name: 'Catalina', last_name: 'Ionescu' },
  { first_name: 'Lam', last_name: 'Nguyen' },
];

async function verifyAdmin(inviteId: string): Promise<boolean> {
  const { data } = await supabase
    .from('guests')
    .select('first_name, last_name')
    .eq('invite_id', inviteId.trim().toUpperCase())
    .single();
  if (!data) return false;
  return ADMINS.some(
    (a) =>
      a.first_name.toLowerCase() === data.first_name?.toLowerCase() &&
      a.last_name.toLowerCase() === data.last_name?.toLowerCase()
  );
}

function buildEmailHtml(message: string): string {
  const body = message.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>');
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:20px;font-family:Arial,sans-serif;background:#f8f9fa;">
  <div style="max-width:600px;margin:0 auto;background:white;border-radius:10px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.1);">
    <div style="background:linear-gradient(135deg,#c2e1ee,#a8d4e6);padding:24px;text-align:center;">
      <h1 style="margin:0;font-family:Georgia,serif;color:#2d5a6b;font-size:28px;font-weight:400;">Cata &amp; Lam 💒</h1>
    </div>
    <div style="padding:32px;color:#374151;line-height:1.7;font-size:15px;">
      ${body}
    </div>
    <div style="padding:20px 32px;border-top:1px solid #e5e7eb;text-align:center;color:#9ca3af;font-size:13px;">
      With love, Cata &amp; Lam
    </div>
  </div>
</body>
</html>`;
}

// POST /api/admin/email
export async function POST(request: Request) {
  try {
    const { admin_invite_id, invite_ids, subject, message } = await request.json();

    if (!admin_invite_id || !(await verifyAdmin(admin_invite_id))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!Array.isArray(invite_ids) || invite_ids.length === 0) {
      return NextResponse.json({ error: 'No recipients selected.' }, { status: 400 });
    }
    if (!subject?.trim()) {
      return NextResponse.json({ error: 'Subject is required.' }, { status: 400 });
    }
    if (!message?.trim()) {
      return NextResponse.json({ error: 'Message is required.' }, { status: 400 });
    }
    if (!process.env.EMAIL_USER) {
      return NextResponse.json({ error: 'Email service not configured.' }, { status: 500 });
    }

    const normalizedIds = (invite_ids as string[]).map((id) => id.trim().toUpperCase());

    // Resolve emails from RSVP tables
    const [{ data: vnRsvps }, { data: roRsvps }] = await Promise.all([
      supabase.from('rsvp_vietnam').select('invite_id, email').in('invite_id', normalizedIds),
      supabase.from('rsvp_romania').select('invite_id, email').in('invite_id', normalizedIds),
    ]);

    const emailMap = new Map<string, string>();
    for (const r of vnRsvps ?? []) {
      if (r.email) emailMap.set(r.invite_id, r.email);
    }
    for (const r of roRsvps ?? []) {
      if (r.email && !emailMap.has(r.invite_id)) emailMap.set(r.invite_id, r.email);
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER!,
        pass: process.env.EMAIL_PASS!,
      },
    });

    const htmlBody = buildEmailHtml(message);
    const sent: string[] = [];
    const skipped: string[] = [];
    const failed: string[] = [];

    for (const id of normalizedIds) {
      const email = emailMap.get(id);
      if (!email) { skipped.push(id); continue; }
      try {
        await transporter.sendMail({
          from: `"Cata & Lam 💒" <${process.env.EMAIL_USER!}>`,
          to: email,
          subject: subject.trim(),
          html: htmlBody,
        });
        sent.push(id);
      } catch (err) {
        console.error(`Failed to send to ${id} (${email}):`, err);
        failed.push(id);
      }
    }

    return NextResponse.json({ success: true, sent, skipped, failed });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
