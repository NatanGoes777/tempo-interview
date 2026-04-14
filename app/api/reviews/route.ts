import { addReview } from '@/app/actions/reviewActions';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { bookId, comment, rating } = await request.json();
    if (!bookId || !comment || rating == null) {
      return Response.json({ error: 'bookId, comment e rating são obrigatórios' }, { status: 400 });
    }
    const review = await addReview(Number(bookId), comment, Number(rating));
    return Response.json(review, { status: 201 });
  } catch (err) {
    return Response.json({ error: (err as Error).message }, { status: 500 });
  }
}
