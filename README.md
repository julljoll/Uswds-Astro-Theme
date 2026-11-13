# Uswds-Astro-Theme (IBM OpenRAG Edition)

Tema oficial para **Astro** basado en el **U.S. Web Design System (USWDS 3)** (`@uswds/uswds`), diseñado específicamente como interfaz moderna, accesible y agéntica para **IBM OpenRAG** (Langflow, Docling y OpenSearch) e **IBM watsonx**.

---

## 🚀 Características Principales

1. **Diseño Federal Accesible (USWDS 3.14)**:
   - Cumplimiento de estándares de accesibilidad **Section 508** y directrices **21st Century IDEA**.
   - Componentes oficiales: `usa-banner`, `usa-header`, `usa-footer`, `usa-alert`, `usa-card`, `usa-accordion`, `usa-search`, `usa-table` y `usa-file-input`.
   - Tipografía oficial (*Public Sans*) y tokens de color gubernamentales.

2. **Integración con IBM OpenRAG**:
   - SDK oficial de OpenRAG (`openrag-sdk`) integrado tanto en TypeScript/Node.js como en Python.
   - **Asistente Agéntico Conversacional**: Chat con citas y pasajes documentales extraídos y puntuados en tiempo real.
   - **Ingesta Documental con Docling**: Soporte para formatos PDF, DOCX, imágenes, tablas complejas y OCR.
   - **Búsqueda Híbrida en OpenSearch**: Búsqueda vectorial densa combinada con coincidencia léxica BM25 y ajuste de umbral de relevancia.
   - **Modo Fallback / Demo Inteligente**: Funciona de inmediato sin necesidad de tener el clúster de OpenSearch/watsonx levantado, pasando automáticamente a modo en vivo en cuanto se detecta la instancia de OpenRAG.

3. **Compatibilidad con Protocolo MCP (Model Context Protocol)**:
   - Servidor MCP de **Astro Docs** integrado (`https://mcp.docs.astro.build/mcp`).
   - Herramienta CLI `astro-docs <consulta>` para buscar documentación oficial desde la terminal.
   - Configuración lista en `.vscode/mcp.json`, `.cursor/mcp.json` y `mcp.json`.

---

## 📁 Estructura del Proyecto

```text
Uswds-Astro-Theme/
├── public/
│   ├── favicon.svg
│   └── uswds/             # Activos compilados de USWDS (css, js, img, fonts)
│       ├── css/uswds.min.css
│       ├── js/uswds.min.js
│       ├── img/
│       └── fonts/
├── src/
│   ├── components/
│   │   ├── uswds/         # Componentes atómicos de USWDS
│   │   │   ├── UsaBanner.astro
│   │   │   ├── UsaHeader.astro
│   │   │   ├── UsaFooter.astro
│   │   │   ├── UsaAlert.astro
│   │   │   ├── UsaCard.astro
│   │   │   └── UsaAccordion.astro
│   │   └── openrag/       # Componentes de interacción con OpenRAG
│   │       └── ChatInterface.astro
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── lib/
│   │   └── openrag.ts     # Cliente y adaptador OpenRAG SDK
│   └── pages/
│       ├── index.astro     # Chat RAG principal
│       ├── documents.astro # Gestión de documentos e ingesta Docling
│       ├── search.astro    # Búsqueda híbrida en OpenSearch
│       ├── settings.astro  # Configuración IBM watsonx / OpenRAG
│       └── api/
│           ├── chat.ts     # Endpoint POST /api/chat
│           ├── search.ts   # Endpoint /api/search
│           ├── documents.ts# Endpoint /api/documents
│           └── health.ts   # Endpoint /api/health
├── .env.example
├── astro.config.mjs
└── package.json
```

---

## 🛠️ Instalación y Uso

### 1. Requisitos
- Node.js 18+ (probado en Node 24)
- npm o pnpm

### 2. Instalar Dependencias
```bash
npm install
```

### 3. Variables de Entorno
Copia `.env.example` a `.env` y configura tus credenciales de IBM OpenRAG / watsonx:

```bash
cp .env.example .env
```

Variables disponibles:
```env
OPENRAG_URL=http://localhost:3000
OPENRAG_API_KEY=tu_clave_opcional
IBM_WATSONX_APIKEY=tu_api_key_de_ibm_cloud
IBM_WATSONX_PROJECT_ID=tu_project_id
IBM_WATSONX_URL=https://us-south.ml.cloud.ibm.com
DOCLING_ENABLED=true
OPENSEARCH_URL=http://localhost:9200
```

### 4. Modo Desarrollo
```bash
npm run dev
```

### 5. Compilación y Despliegue en Producción
```bash
npm run build
npm run preview
```

---

## 🤖 Consulta a la Documentación de Astro (MCP)

Puedes consultar la documentación oficial de Astro en cualquier momento usando el comando de terminal:

```bash
astro-docs "routing"
astro-docs "server endpoints"
astro-docs "openrag"
```

---

## 📄 Licencia

Distribuido bajo la licencia MIT. Consulta [LICENSE](LICENSE) para más información.
