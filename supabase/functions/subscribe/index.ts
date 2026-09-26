// Supabase Edge Function: subscribe
//
// Handles public signups from the website. Stores the email in Supabase
// (bypassing RLS with the service role) and then sends a welcome email via
// Resend. The DB write is the source of truth: if the Resend send fails
// (e.g. no verified domain yet, so only the account owner can receive mail),
// the subscriber is still saved and the request still succeeds.
//
// Request:  POST { email, type?: 'newsletter' | 'event', event_key?, source? }
// Response: { ok, stored, already_subscribed, email_sent }

import { createClient } from 'jsr:@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

// Until a domain is verified in Resend, this can only deliver to the Resend
// account owner's email. Swap in your own verified domain later, e.g.
// 'Laurier Analytics <hello@yourdomain.ca>'.
const FROM_ADDRESS = 'Laurier Analytics <onboarding@resend.dev>';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UNIQUE_VIOLATION = '23505';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

interface WelcomeCopy {
  subject: string;
  html: string;
}

function welcomeCopy(type: 'newsletter' | 'event', eventKey: string | null): WelcomeCopy {
  if (type === 'event') {
    return {
      subject: "You're on the list — we'll let you know",
      html: `
        <div style="font-family: -apple-system, Segoe UI, Roboto, sans-serif; max-width: 480px; margin: 0 auto; color: #0f172a;">
          <h1 style="font-size: 20px;">You're on the list.</h1>
          <p style="font-size: 15px; line-height: 1.6; color: #334155;">
            Thanks for your interest${eventKey ? ` in <strong>${eventKey}</strong>` : ''}.
            We'll email you the moment applications open — no spam in between.
          </p>
          <p style="font-size: 13px; color: #64748b;">— Laurier Analytics &amp; Statistics</p>
        </div>`,
    };
  }
  return {
    subject: "You're subscribed — the signal, minus the noise",
    html: `
      <div style="font-family: -apple-system, Segoe UI, Roboto, sans-serif; max-width: 480px; margin: 0 auto; color: #0f172a;">
        <h1 style="font-size: 20px;">You're on the list.</h1>
        <p style="font-size: 15px; line-height: 1.6; color: #334155;">
          Every two weeks we'll send upcoming events, application deadlines, internship
          postings, and one chart worth your attention. That's it.
        </p>
        <p style="font-size: 13px; color: #64748b;">— Laurier Analytics &amp; Statistics</p>
      </div>`,
  };
}

async function sendWelcomeEmail(
  to: string,
  copy: WelcomeCopy,
): Promise<{ sent: boolean; error?: string }> {
  if (!RESEND_API_KEY) return { sent: false, error: 'RESEND_API_KEY not configured' };
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from: FROM_ADDRESS, to: [to], subject: copy.subject, html: copy.html }),
    });
    if (res.ok) return { sent: true };
    return { sent: false, error: `Resend ${res.status}: ${await res.text()}` };
  } catch (err) {
    return { sent: false, error: String(err) };
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ ok: false, error: 'Method not allowed' }, 405);

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json({ ok: false, error: 'Invalid JSON body' }, 400);
  }

  const email = String(body.email ?? '').trim().toLowerCase();
  const type = body.type === 'event' ? 'event' : 'newsletter';
  const source = body.source ? String(body.source).slice(0, 100) : null;
  const eventKey = body.event_key ? String(body.event_key).slice(0, 100) : null;

  if (!email || email.length > 320 || !EMAIL_RE.test(email)) {
    return json({ ok: false, error: 'Please enter a valid email address.' }, 400);
  }
  if (type === 'event' && !eventKey) {
    return json({ ok: false, error: 'Missing event_key for event signup.' }, 400);
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });

  const insert =
    type === 'event'
      ? supabase.from('event_notifications').insert({ email, event_key: eventKey, source })
      : supabase.from('newsletter_subscribers').insert({ email, source });

  const { error } = await insert;

  const alreadySubscribed = error?.code === UNIQUE_VIOLATION;
  if (error && !alreadySubscribed) {
    console.error('DB insert error:', error);
    return json({ ok: false, error: 'Could not save your signup. Please try again.' }, 500);
  }

  // Only send a welcome email on a genuinely new signup.
  let emailSent = false;
  if (!alreadySubscribed) {
    const result = await sendWelcomeEmail(email, welcomeCopy(type, eventKey));
    emailSent = result.sent;
    if (!result.sent) console.warn('Welcome email not sent:', result.error);
  }

  return json({ ok: true, stored: true, already_subscribed: alreadySubscribed, email_sent: emailSent });
});
