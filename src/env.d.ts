
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_API_REFRESH_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
