import { supabase } from "@/integrations/supabase/client";

export interface Cake {
  id: string;
  title: string;
  description: string | null;
  price: number;
  category: string;
  image_url: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export const fetchPublishedCakes = async (): Promise<Cake[]> => {
  const { data, error } = await supabase
    .from('cakes')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const fetchAllCakes = async (): Promise<Cake[]> => {
  const { data, error } = await supabase
    .from('cakes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const createCake = async (cake: Omit<Cake, 'id' | 'created_at' | 'updated_at'>): Promise<Cake> => {
  const { data, error } = await supabase
    .from('cakes')
    .insert(cake)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateCake = async (id: string, updates: Partial<Cake>): Promise<Cake> => {
  const { data, error } = await supabase
    .from('cakes')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteCake = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('cakes')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const uploadCakeImage = async (file: File): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  
  const { error: uploadError } = await supabase.storage
    .from('cakes')
    .upload(fileName, file);

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from('cakes')
    .getPublicUrl(fileName);

  return data.publicUrl;
};

export const deleteCakeImage = async (imageUrl: string): Promise<void> => {
  const fileName = imageUrl.split('/').pop();
  if (!fileName) return;

  const { error } = await supabase.storage
    .from('cakes')
    .remove([fileName]);

  if (error) throw error;
};

export const validateAdminPin = async (pin: string): Promise<{ success: boolean; error?: string; locked?: boolean }> => {
  const clientId = localStorage.getItem('client_id') || `client_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  localStorage.setItem('client_id', clientId);

  const { data, error } = await supabase.functions.invoke('validate-pin', {
    body: { pin, clientId },
  });

  if (error) {
    return { success: false, error: 'Connection error. Please try again.' };
  }

  return data;
};