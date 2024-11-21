// @ts-check
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import alpinejs from "@astrojs/alpinejs";
import mdx from "@astrojs/mdx";
import remarkDirective from "remark-directive";
import { hastPlugin } from "./src/scripts/hast-plugin.mjs";

import solidJs from "@astrojs/solid-js";

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind(),
    alpinejs(),
    mdx({
      remarkPlugins: [hastPlugin, remarkDirective],
    }),
    solidJs(),
  ],
  devToolbar: {
    enabled: false,
  },
});
