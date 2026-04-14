import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

// GET: Retorna todos os funcionários
export async function GET() {
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST: Cria um novo funcionário
export async function POST(request: Request) {
  const { title, author } = await request.json();

  if (!title || !author) {
    return NextResponse.json({ error: 'Name and author are required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('books')
    .insert([{ title, author }])
    .select(); 

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data[0], { status: 201 });
}

export async function DELETE(request: Request) {
    const { id } = await request.json();

    const { error } = await supabase
      .from('books')
      .delete()
      .eq('id', id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ status: 204 });
}

export async function PUT(request: Request) {
  const { id, title, author } = await request.json();

  if (!title || !author) {
    return NextResponse.json({ error: 'Name and author are required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('books')
    .update([{ title, author }])
    .eq('id', id)
    .select();
  
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data[0], { status: 200 });
}