import { updateBook, deleteBook } from '@/app/actions/bookActions';
import type { NextRequest } from 'next/server';

export async function PUT(request: NextRequest, ctx: RouteContext<'/api/books/[id]'>) {
  try {
    const { id } = await ctx.params;
    const { title, author } = await request.json();
    if (!title || !author) {
      return Response.json({ error: 'title e author são obrigatórios' }, { status: 400 });
    }
    const book = await updateBook(Number(id), title, author);
    return Response.json(book);
  } catch (err) {
    return Response.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, ctx: RouteContext<'/api/books/[id]'>) {
  try {
    const { id } = await ctx.params;
    await deleteBook(Number(id));
    return new Response(null, { status: 204 });
  } catch (err) {
    return Response.json({ error: (err as Error).message }, { status: 500 });
  }
}
