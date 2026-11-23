/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the API. Empty → built-in mock responses in dev. */
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
