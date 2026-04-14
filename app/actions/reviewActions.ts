'use server';

import { createSupabaseServerClient } from '@/lib/supabase-server';

export async function addReview(bookId: number, comment: string, rating: number) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('reviews')
    .insert([{ book_id: bookId, comment, rating }])
    .select();

  if (error) throw new Error(error.message);
  return data[0];
}
