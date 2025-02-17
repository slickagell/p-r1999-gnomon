import { extendTailwindMerge } from "tailwind-merge";

export const twMerge = extendTailwindMerge({
  override: {
    conflictingClassGroups: {
      "font-size": [],
    },
  },
});
