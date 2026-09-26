import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

if (!url || !publishableKey) {
  // Surfaced in the console during dev if the .env vars are missing.
  console.warn(
    '[supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY. ' +
      'Signup forms will fail until these are set in .env.',
  );
}

// Only construct a client when both values exist. An empty URL throws inside
// supabase-js and would take down the whole page on a build without env vars.
export const supabase =
  url && publishableKey
    ? createClient(url, publishableKey, { auth: { persistSession: false } })
    : null;

export type SignupType = 'newsletter' | 'event';

export interface SubscribeResult {
  ok: boolean;
  stored?: boolean;
  already_subscribed?: boolean;
  email_sent?: boolean;
  error?: string;
}

/**
 * Calls the `subscribe` edge function to store an email and (for new signups)
 * send a welcome email. Throws on network/function failure so callers can
 * show an error state.
 */
export async function subscribe(params: {
  email: string;
  type?: SignupType;
  eventKey?: string;
  source?: string;
}): Promise<SubscribeResult> {
  if (!supabase) {
    return {
      ok: false,
      error: 'Signups are not available right now. Please try again later.',
    };
  }

  const { data, error } = await supabase.functions.invoke<SubscribeResult>('subscribe', {
    body: {
      email: params.email,
      type: params.type ?? 'newsletter',
      event_key: params.eventKey,
      source: params.source,
    },
  });

  if (error) {
    // functions.invoke surfaces non-2xx as FunctionsHttpError; try to read the body.
    let message = 'Something went wrong. Please try again.';
    const ctx = (error as { context?: Response }).context;
    if (ctx && typeof ctx.json === 'function') {
      try {
        const payload = (await ctx.json()) as SubscribeResult;
        if (payload?.error) message = payload.error;
      } catch {
        // ignore parse errors, keep default message
      }
    }
    return { ok: false, error: message };
  }

  return data ?? { ok: false, error: 'Empty response from server.' };
}
