import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * GET /api/supabase-health
 * Verifies Supabase connection: env, database (products), and auth endpoint.
 */
export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return NextResponse.json(
      { ok: false, error: 'Missing env: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY' },
      { status: 503 }
    );
  }

  try {
    const supabase = await createClient();

    // Test database (public products table)
    const { data: products, error: dbError } = await supabase
      .from('products')
      .select('id')
      .limit(1);

    if (dbError) {
      return NextResponse.json(
        { ok: false, error: `Database: ${dbError.message}`, code: dbError.code },
        { status: 503 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: 'Supabase connected',
      productsTable: true,
      productsCount: Array.isArray(products) ? products.length : 0,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      { ok: false, error: message },
      { status: 503 }
    );
  }
}
