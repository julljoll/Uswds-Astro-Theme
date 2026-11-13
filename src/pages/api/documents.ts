import type { APIRoute } from 'astro';
import { getMockDocuments, addMockDocument } from '../../lib/openrag';

export const GET: APIRoute = async () => {
  const docs = getMockDocuments();
  return new Response(JSON.stringify({ documents: docs }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const newDoc = addMockDocument({
      filename: data.filename,
      title: data.title,
      docType: data.docType || 'Documento',
      size: data.size || '500 KB',
      chunksCount: data.chunksCount || 35,
    });
    return new Response(JSON.stringify({ success: true, document: newDoc }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
