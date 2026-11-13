import type { APIRoute } from 'astro';
import { checkBackendHealth } from '../../lib/openrag';

export const GET: APIRoute = async () => {
  const health = await checkBackendHealth();
  return new Response(JSON.stringify(health), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
