import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const characters = defineCollection({
  loader: glob({
    pattern: "[^_]*.{md,mdx}",
    base: "./src/markdown/characters",
  }),
  schema: z.object({
    name: z.string(),
    id: z.string(),
    gameId: z.string(),
    code: z.string(),
    gender: z.string(),
    star: z.number(),
    afflatus: z.string(),
    dmgType: z.string(),
    race: z.string(),
    birthday: z.string(),
    version: z.string(),
    releaseDate: z.string(),
    specialties: z.array(z.string()),
    limited: z.number(),
    mainPiece: z.string(),
    euphorias: z.number(),
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

const reveriesInTheRain = defineCollection({
  loader: glob({
    pattern: "**/[^_]*.{md,mdx}",
    base: "./src/markdown/reveries-in-the-rain",
  }),
});

const psychubes = defineCollection({
  loader: glob({
    pattern: "**/[^_]*.{md,mdx}",
    base: "./src/markdown/psychubes",
  }),
});

const general = defineCollection({
  loader: glob({
    pattern: "[^_]*.{md,mdx}",
    base: "./src/markdown",
  }),
});

const archetypes = defineCollection({
  loader: glob({
    pattern: "[^_]*.json",
    base: "./src/data/archetype",
  }),
  schema: z.object({
    name: z.string(),
    description: z.string(),
    characters: z
      .array(
        z.object({
          id: z.string(),
          description: z.string().optional(),
          skills: z
            .array(
              z.object({
                name: z.string(),
                note: z.string().optional(),
              }),
            )
            .optional(),
        }),
      )
      .optional(),
    sub: z
      .array(
        z.object({
          name: z.string(),
          description: z.string(),
          characters: z.array(
            z.object({
              id: z.string(),
              description: z.string().optional(),
              skills: z
                .array(
                  z.object({
                    name: z.string(),
                    note: z.string().optional(),
                  }),
                )
                .optional(),
            }),
          ),
        }),
      )
      .optional(),
  }),
});

const timeline = defineCollection({
  loader: glob({
    pattern: "**/[^_]*.{md,mdx}",
    base: "./src/markdown/timeline",
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
  "reveries-in-the-rain": reveriesInTheRain,
  psychubes,
  general,
  archetypes,
  timeline,
};
