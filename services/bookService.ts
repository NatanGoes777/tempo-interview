export type Book = {
  id: number;
  title: string;
  author: string;
};

const API_URL = '/api/books';

export const BookService = {
  getAll: async (): Promise<Book[]> => {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Failed to fetch books');
    return res.json();
  },

  create: async (title: string, author: string): Promise<Book> => {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, author }),
    });
    if (!res.ok) throw new Error('Failed to create book');
    return res.json();
  },

  update: async (id: number, title: string, author: string): Promise<Book> => {
    const res = await fetch(API_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, title, author }),
    });
    if (!res.ok) throw new Error('Failed to update book');
    return res.json();
  },

  delete: async (id: number): Promise<void> => {
    const res = await fetch(API_URL, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) throw new Error('Failed to delete book');
  }
};