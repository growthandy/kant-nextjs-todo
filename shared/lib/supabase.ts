import {
  createBrowserClient,
  createServerClient as createSSRServerClient,
} from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase 환경 변수가 없습니다. .env.local 을 확인하세요.');
}

export function createServerClient(): SupabaseClient {
  return createSSRServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      async getAll() {
        const { cookies } = await import('next/headers');
        const cookieStore = await cookies();
        return cookieStore.getAll();
      },
      async setAll(cookiesToSet) {
        try {
          const { cookies } = await import('next/headers');
          const cookieStore = await cookies();
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
        }
      },
    },
  });
}

export function createBrowserSupabase(): SupabaseClient {
  return createBrowserClient(supabaseUrl, supabaseKey);
}
