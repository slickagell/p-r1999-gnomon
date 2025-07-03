import { extendTailwindMerge } from "tailwind-merge";
import fs from "fs";
import fsPromise from "fs/promises";

export const twMerge = extendTailwindMerge({
  override: {
    conflictingClassGroups: {
      "font-size": [],
    },
  },
});

export async function getFilesWithText(folderPath, matchText) {
  const files = await fsPromise.readdir(folderPath);
  const matchedFiles = files.filter((file) => file.includes(matchText));

  return matchedFiles;
}
