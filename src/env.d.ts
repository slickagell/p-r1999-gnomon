/// <reference path="../.astro/types.d.ts" />
interface Window {
  Alpine: import("alpinejs").Alpine;
}

interface ImportMetaEnv {
  readonly PUBLIC_IMAGE_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
