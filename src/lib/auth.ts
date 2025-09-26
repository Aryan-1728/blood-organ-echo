import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

export const signUp = async (email: string, password: string, userData: {
  full_name: string;
  role: 'donor' | 'hospital' | 'blood_bank' | 'admin';
  phone?: string;
  organization_name?: string;
  license_number?: string;
}) => {
  const redirectUrl = `${window.location.origin}/`;
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: redirectUrl,
      data: userData
    }
  });

  if (!error && data.user) {
    // Create profile record
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        user_id: data.user.id,
        ...userData
      });

    if (profileError) {
      console.error('Profile creation error:', profileError);
    }
  }

  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = () => {
  return supabase.auth.getUser();
};

export const getCurrentSession = () => {
  return supabase.auth.getSession();
};