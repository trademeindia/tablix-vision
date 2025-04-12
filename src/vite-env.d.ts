/// <reference types="vite/client" />

interface ImportMeta {
  readonly env: {
    readonly VITE_SUPABASE_URL: string;
    readonly VITE_SUPABASE_KEY: string;
    readonly [key: string]: string | undefined;
  };
}

declare var process: {
  env: {
    NODE_ENV: 'development' | 'production' | 'test';
    [key: string]: string | undefined;
  }
}
