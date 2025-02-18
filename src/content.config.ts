import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const characters = defineCollection({
  loader: glob({
    pattern: "**/[^_]*.{md,mdx}",
    base: "./src/markdown/characters",
  }),
  schema: z.object({
    title: z.string(),
    id: z.string(),
    gameId: z.string().optional(),
    code: z.string(),
    star: z.number(),
    afflatus: z.string(),
    dmgType: z.string(),
    race: z.string(),
    version: z.string(),
    releaseDate: z.string(),
    specialties: z.array(z.string()),
    isLimited: z.boolean(),
  }),
});

const effects = defineCollection({
  loader: glob({
    pattern: "**/[^_]*.{md,mdx}",
    base: "./src/markdown/effects",
  }),
  schema: z.object({
    title: z.string(),
    code: z.string(),
    type: z.string(),
    isSpecific: z.string().optional(),
  }),
});

const materials = defineCollection({
  loader: glob({
    pattern: "**/[^_]*.{md,mdx}",
    base: "./src/markdown/materials",
  }),
});

const aSeriesOfDusks = defineCollection({
  loader: glob({
    pattern: "**/[^_]*.{md,mdx}",
    base: "./src/markdown/a-series-of-dusks",
  }),
});

const artefacts = defineCollection({
  loader: glob({
    pattern: "**/[^_]*.{md,mdx}",
    base: "./src/markdown/artefacts",
  }),
  schema: z.object({
    name: z.string(),
    code: z.string(),
    type: z.string(),
    rarity: z.string(),
    image: z.string(),
    shape: z.array(z.array(z.number())),
    tags: z.array(z.string()),
    diskSlot: z.number().optional(),
    canExchange: z.boolean().optional(),
    combination: z.array(z.string()).optional(),
  }),
});

const catalysts = defineCollection({
  loader: glob({
    pattern: "**/[^_]*.{md,mdx}",
    base: "./src/markdown/catalysts",
  }),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    code: z.string(),
    description: z.string(),
    image: z.string(),
    displayOrder: z.number(),
  }),
});

const maneBulletin = defineCollection({
  loader: glob({
    pattern: "**/[^_]*.{md,mdx}",
    base: "./src/markdown/mane-bulletin",
  }),
});

export const collections = {
  characters,
  effects,
  materials,
  "a-series-of-dusks": aSeriesOfDusks,
  artefacts,
  catalysts,
  "mane-bulletin": maneBulletin,
};
