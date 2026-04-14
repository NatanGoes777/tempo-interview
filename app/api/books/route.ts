import { getBooks, createBook } from '@/app/actions/bookActions';
import type { NextRequest } from 'next/server';

export async function GET() {
  try {
    const books = await getBooks();
    return Response.json(books);
  } catch (err) {
    return Response.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, author } = await request.json();
    if (!title || !author) {
      return Response.json({ error: 'title e author são obrigatórios' }, { status: 400 });
    }
    const book = await createBook(title, author);
    return Response.json(book, { status: 201 });
  } catch (err) {
    return Response.json({ error: (err as Error).message }, { status: 500 });
  }
}
