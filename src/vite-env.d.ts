/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the API (NestJS starter). Empty → built-in mock responses in dev. */
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
