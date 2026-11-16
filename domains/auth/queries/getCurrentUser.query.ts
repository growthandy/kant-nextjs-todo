import { createServerClient } from '@/shared/lib/supabase';
import { cache } from 'react';
import type { UserProfile } from '../types/auth.types';

export const getCurrentUser = cache(async (): Promise<UserProfile | null> => {
  const supabase = createServerClient();

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, name')
    .eq('id', authUser.id)
    .is('deleted_at', null)
    .maybeSingle();

  if (!profile) return null;
  return { id: profile.id, name: profile.name, email: authUser.email };
});
