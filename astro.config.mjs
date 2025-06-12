// @ts-check
import alpinejs from "@astrojs/alpinejs";
import mdx from "@astrojs/mdx";
import solidJs from "@astrojs/solid-js";
import tailwind from "@astrojs/tailwind";
import pagefind from "astro-pagefind";
import { defineConfig } from "astro/config";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkDirective from "remark-directive";
import { directivePlugin } from "./src/scripts/directive-plugin.mjs";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://reverse1999-gnomon.pages.dev",
  build: {
    format: "file",
  },
  integrations: [
    tailwind(),
    alpinejs({ entrypoint: "/src/entrypoint" }),
    mdx({
      remarkPlugins: [remarkDirective, directivePlugin],
      rehypePlugins: [
        rehypeSlug,
        [rehypeAutolinkHeadings, { behavior: "wrap", test: ["h2", "h3"] }],
      ],
    }),
    pagefind(),
    solidJs(),
    sitemap({
      filter: (page) => !page.includes("/dev/"),
    }),
  ],
  devToolbar: {
    enabled: false,
  },
});
