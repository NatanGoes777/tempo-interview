'use server';

import { supabase } from '@/lib/supabase';

export async function addReview(bookId: number, comment: string, rating: number) {
  const { data, error } = await supabase
    .from('reviews')
    .insert([{ book_id: bookId, comment, rating }])
    .select();

  if (error) throw new Error(error.message);
  return data[0];
}