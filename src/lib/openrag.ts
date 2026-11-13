import { OpenRAGClient, type Source, type SearchResult } from 'openrag-sdk';

export interface OpenRAGMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  sources?: Source[];
  timestamp?: string;
}

export interface OpenRAGDoc {
  id: string;
  filename: string;
  title: string;
  docType: string;
  size: string;
  status: 'indexed' | 'processing' | 'failed';
  chunksCount: number;
  lastUpdated: string;
}

// In-memory mock knowledge base for demo / fallback mode
const MOCK_DOCUMENTS: OpenRAGDoc[] = [
  {
    id: 'doc-1',
    filename: 'ibm_watsonx_openrag_architecture.pdf',
    title: 'IBM OpenRAG: Architecture & Agentic Retrieval Specification',
    docType: 'PDF / Docling',
    size: '2.4 MB',
    status: 'indexed',
    chunksCount: 148,
    lastUpdated: '2026-11-10T14:20:00Z',
  },
  {
    id: 'doc-2',
    filename: 'uswds_federal_design_principles.md',
    title: 'U.S. Web Design System Guidelines & Accessibility Standards',
    docType: 'Markdown',
    size: '480 KB',
    status: 'indexed',
    chunksCount: 62,
    lastUpdated: '2026-11-11T09:15:00Z',
  },
  {
    id: 'doc-3',
    filename: 'opensearch_hybrid_vector_index.json',
    title: 'OpenSearch k-NN Vector & Lexical Hybrid Search Configuration',
    docType: 'JSON / Schema',
    size: '120 KB',
    status: 'indexed',
    chunksCount: 24,
    lastUpdated: '2026-11-12T16:40:00Z',
  },
];

let clientInstance: OpenRAGClient | null = null;

export function getOpenRAGClient(): OpenRAGClient {
  if (!clientInstance) {
    const baseUrl = process.env.OPENRAG_URL || 'http://localhost:3000';
    const apiKey = process.env.OPENRAG_API_KEY;
    const extraHeaders: Record<string, string> = {};

    if (process.env.IBM_AUTH_USERNAME && process.env.IBM_AUTH_API_KEY) {
      extraHeaders['X-Username'] = process.env.IBM_AUTH_USERNAME;
      extraHeaders['X-Api-Key'] = process.env.IBM_AUTH_API_KEY;
    }

    clientInstance = new OpenRAGClient({
      baseUrl,
      apiKey: apiKey || undefined,
      extraHeaders: Object.keys(extraHeaders).length > 0 ? extraHeaders : undefined,
    });
  }
  return clientInstance;
}

export async function checkBackendHealth(): Promise<{ connected: boolean; url: string; mode: 'live' | 'mock-fallback'; error?: string }> {
  const url = process.env.OPENRAG_URL || 'http://localhost:3000';
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);
    const resp = await fetch(`${url}/health`, { signal: controller.signal });
    clearTimeout(timeout);
    if (resp.ok) {
      return { connected: true, url, mode: 'live' };
    }
  } catch (err: any) {
    // Falls back to mock mode
  }
  return {
    connected: false,
    url,
    mode: 'mock-fallback',
    error: 'OpenRAG backend service is running in fallback/demo mode. Connect live IBM watsonx / OpenRAG instance in Settings.',
  };
}

export async function askOpenRAG(message: string, chatId?: string): Promise<{
  text: string;
  sources: Source[];
  chatId: string;
  mode: 'live' | 'mock-fallback';
}> {
  const health = await checkBackendHealth();

  if (health.connected) {
    try {
      const client = getOpenRAGClient();
      const response = await client.chat.create({
        message,
        chatId,
        stream: false,
      });
      return {
        text: response.response,
        sources: response.sources || [],
        chatId: response.chatId || chatId || `chat-${Date.now()}`,
        mode: 'live',
      };
    } catch (e: any) {
      console.warn('Live OpenRAG request failed, using mock generator:', e.message);
    }
  }

  // Fallback intelligent agentic mock generator for development & demonstration
  const queryLower = message.toLowerCase();
  let generatedText = '';
  let mockSources: Source[] = [];

  if (queryLower.includes('uswds') || queryLower.includes('diseño') || queryLower.includes('design') || queryLower.includes('estilo')) {
    generatedText = `El **U.S. Web Design System (USWDS)** es una biblioteca de diseño y componentes accesibles (WCAG 2.1 AA) desarrollada por GSA y Technology Transformation Services.

En este theme de Astro para IBM OpenRAG:
- Se integran los tokens oficiales de color, tipografía (*Public Sans*) y espaciado de USWDS v3.
- Incluye componentes clave como **USA Banner**, **USA Header/Nav**, **USA Search**, **USA Alert**, **USA Cards** y **USA Accordion**.
- El asistente visual de OpenRAG permite desplegar fuentes y evidencias en formato de citas auditables del estándar federal.`;

    mockSources = [
      {
        filename: 'uswds_federal_design_principles.md',
        text: 'USWDS 3.0 provides design tokens, utilities, and components compliant with federal Section 508 and 21st Century IDEA requirements.',
        score: 0.94,
        page: 2,
        mimetype: 'text/markdown',
      },
      {
        filename: 'ibm_watsonx_openrag_architecture.pdf',
        text: 'Frontends integrating OpenRAG can adopt enterprise and public design frameworks such as USWDS with seamless token mappings.',
        score: 0.88,
        page: 11,
        mimetype: 'application/pdf',
      },
    ];
  } else if (queryLower.includes('openrag') || queryLower.includes('ibm') || queryLower.includes('watsonx') || queryLower.includes('rag')) {
    generatedText = `**IBM OpenRAG** es una plataforma unificada y de código abierto para sistemas RAG agénticos de nivel empresarial, diseñada en colaboración con **Langflow**, **Docling** y **OpenSearch**.

**Capacidades integradas en este Theme**:
1. **Ingesta con Docling**: Análisis profundo de formatos PDF, DOCX, imágenes con tablas estructuradas y OCR.
2. **Búsqueda Híbrida en OpenSearch**: Combinación de embeddings vectoriales densos con búsqueda léxica BM25.
3. **Orquestación con Langflow & watsonx**: Flujos de recuperación agéntica, re-ranking y razonamiento con modelos como Granite y Llama 3.
4. **Soporte nativo de MCP**: Acceso directo a herramientas y contextos para agentes de IA.`;

    mockSources = [
      {
        filename: 'ibm_watsonx_openrag_architecture.pdf',
        text: 'OpenRAG combines Docling for document understanding, OpenSearch for hybrid vector-lexical indexing, and Langflow for agent orchestration.',
        score: 0.98,
        page: 4,
        mimetype: 'application/pdf',
      },
      {
        filename: 'opensearch_hybrid_vector_index.json',
        text: 'Hybrid retrieval combines cosine similarity on normalized embeddings with BM25 keyword matching for optimal recall and precision.',
        score: 0.91,
        page: 1,
        mimetype: 'application/json',
      },
    ];
  } else {
    generatedText = `He analizado tu consulta en la base de conocimientos de OpenRAG: "${message}".

Los documentos indexados procesados por **Docling** y recuperados a través de **OpenSearch** muestran que el sistema está listo para vincularse con tus despliegues de IBM watsonx.data o servicios locales OpenRAG.`;

    mockSources = [
      {
        filename: 'ibm_watsonx_openrag_architecture.pdf',
        text: 'OpenRAG agentic workflows perform multi-hop reasoning over chunked evidence and return citations alongside verified claims.',
        score: 0.85,
        page: 7,
        mimetype: 'application/pdf',
      },
    ];
  }

  return {
    text: generatedText,
    sources: mockSources,
    chatId: chatId || `chat-${Date.now()}`,
    mode: health.mode,
  };
}

export async function searchOpenRAG(query: string): Promise<SearchResult[]> {
  const health = await checkBackendHealth();
  if (health.connected) {
    try {
      const client = getOpenRAGClient();
      const res = await client.search.query(query);
      return res.results || [];
    } catch (err: any) {
      console.warn('Live search error:', err.message);
    }
  }

  // Fallback search results
  return [
    {
      filename: 'ibm_watsonx_openrag_architecture.pdf',
      text: `Document extraction through Docling preserves tables, formulas, and visual document structures into clean AI-ready text chunks matching: "${query}".`,
      score: 0.96,
      page: 3,
      mimetype: 'application/pdf',
    },
    {
      filename: 'uswds_federal_design_principles.md',
      text: `USWDS components adhere to federal accessibility and responsive guidelines for enterprise government applications. Matching query: "${query}".`,
      score: 0.89,
      page: 5,
      mimetype: 'text/markdown',
    },
    {
      filename: 'opensearch_hybrid_vector_index.json',
      text: `Vector index schema configured with k-NN HNSW indices and multi-field lexical tokenizers for "${query}".`,
      score: 0.82,
      page: 1,
      mimetype: 'application/json',
    },
  ];
}

export function getMockDocuments(): OpenRAGDoc[] {
  return [...MOCK_DOCUMENTS];
}

export function addMockDocument(doc: Partial<OpenRAGDoc>): OpenRAGDoc {
  const newDoc: OpenRAGDoc = {
    id: `doc-${Date.now()}`,
    filename: doc.filename || 'uploaded_document.pdf',
    title: doc.title || doc.filename || 'Uploaded Document',
    docType: doc.docType || 'PDF / Docling',
    size: doc.size || '1.1 MB',
    status: 'indexed',
    chunksCount: doc.chunksCount || Math.floor(Math.random() * 80) + 20,
    lastUpdated: new Date().toISOString(),
  };
  MOCK_DOCUMENTS.unshift(newDoc);
  return newDoc;
}
