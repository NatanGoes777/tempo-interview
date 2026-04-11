import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

// GET: Retorna todos os funcionários
export async function GET() {
  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST: Cria um novo funcionário
export async function POST(request: Request) {
  // Pega o Name e Role que o frontend enviou no formato JSON
  const { name, role } = await request.json();

  if (!name || !role) {
    return NextResponse.json({ error: 'Name and Role are required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('employees')
    .insert([{ name, role }])
    .select(); 

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data[0], { status: 201 });
}

export async function DELETE(request: Request) {
    const { id } = await request.json();

    await supabase
        .from('employees')
        .delete()
        .eq('id', id);
}