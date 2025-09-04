// Supabase client configuration
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not found. Real-time features will be disabled.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Realtime client
export const realtime = {
  subscribe: (channel: string, callback: (payload: any) => void) => {
    if (!supabase) return { unsubscribe: () => {} };

    const subscription = supabase
      .channel(channel)
      .on('broadcast', { event: '*' }, callback)
      .subscribe();

    return {
      unsubscribe: () => subscription.unsubscribe()
    };
  },

  publish: (channel: string, event: string, payload: any) => {
    if (!supabase) return Promise.resolve();

    return supabase.channel(channel).send({
      type: 'broadcast',
      event,
      payload
    });
  }
};
