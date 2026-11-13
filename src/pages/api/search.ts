import type { APIRoute } from 'astro';
import { searchOpenRAG } from '../../lib/openrag';

export const GET: APIRoute = async ({ url }) => {
  const query = url.searchParams.get('q') || '';
  if (!query) {
    return new Response(JSON.stringify({ results: [] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  const results = await searchOpenRAG(query);
  return new Response(JSON.stringify({ query, results }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const query = body.query || '';
    const results = await searchOpenRAG(query);
    return new Response(JSON.stringify({ query, results }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
