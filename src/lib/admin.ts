import { supabase } from '@/lib/supabase';

export const ADMINS = [
  { first_name: 'Catalina', last_name: 'Ionescu' },
  { first_name: 'Lam', last_name: 'Nguyen' },
];

/** Name-based admin check. Usable on both client and server. */
export function isAdminName(
  firstName?: string | null,
  lastName?: string | null
): boolean {
  if (!firstName || !lastName) return false;
  return ADMINS.some(
    (a) =>
      a.first_name.toLowerCase() === firstName.toLowerCase() &&
      a.last_name.toLowerCase() === lastName.toLowerCase()
  );
}

/** Server-side admin check: resolves an invite id to a guest and matches names. */
export async function verifyAdmin(inviteId: string): Promise<boolean> {
  if (!inviteId) return false;
  const { data } = await supabase
    .from('guests')
    .select('first_name, last_name')
    .eq('invite_id', inviteId.trim().toUpperCase())
    .single();
  if (!data) return false;
  return isAdminName(data.first_name, data.last_name);
}
