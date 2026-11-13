import type { APIRoute } from 'astro';
import { askOpenRAG } from '../../lib/openrag';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { message, chatId } = body;

    if (!message || typeof message !== 'string') {
      return new Response(
        JSON.stringify({ error: 'El parámetro "message" es requerido.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const result = await askOpenRAG(message, chatId);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || 'Error al procesar el mensaje con OpenRAG' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
