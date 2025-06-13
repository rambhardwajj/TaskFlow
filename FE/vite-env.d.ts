interface ImportMetaEnv {
  readonly VITE_APP_URL: string;
  // add other env vars here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}