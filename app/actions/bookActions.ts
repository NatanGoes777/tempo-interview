'use server';

import { supabase } from '../../lib/supabase';

export type Book = {
  id: number;
  title: string;
  author: string;
};

export type BookWithReviews = {
  id: number;
  title: string;
  author: string;
  reviews: { id: number; comment: string; rating: number }[]; // Array de avaliações embutido!
};

// GET
export async function getBooks(): Promise<Book[]> {
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .order('id', { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

// POST
export async function createBook(title: string, author: string): Promise<Book> {
  const { data, error } = await supabase
    .from('books')
    .insert([{ title, author }])
    .select();

  if (error) throw new Error(error.message);
  return data[0];
}

// PUT
export async function updateBook(id: number, title: string, author: string): Promise<Book> {
  const { data, error } = await supabase
    .from('books')
    .update({ title, author })
    .eq('id', id)
    .select();

  if (error) throw new Error(error.message);
  return data[0];
}

// DELETE
export async function deleteBook(id: number): Promise<void> {
  const { error } = await supabase
    .from('books')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
}

export async function getBooksWithReviews(): Promise<BookWithReviews[]> {
  const { data, error } = await supabase
    .from('books')
    .select(`
      *,
      reviews ( id, comment, rating ) 
    `)
    .order('id', { ascending: false });

  if (error) throw new Error(error.message);
  return data as BookWithReviews[];
}