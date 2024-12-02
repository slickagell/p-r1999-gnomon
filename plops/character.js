import { AFFLATUS_TYPE, DMG_TYPE, RARITY } from "../src/constants/character.js";

export default {
  description: "Create a character content mdx file",
  prompts: [
    {
      type: "input",
      name: "name",
      message: "Character name:",
    },
    {
      type: "list",
      name: "star",
      message: "Character star:",
      choices: Object.values(RARITY).map((ele) => ele.value),
    },
    {
      type: "list",
      name: "afflatus",
      message: "Character afflatus:",
      choices: Object.keys(AFFLATUS_TYPE),
    },
    {
      type: "list",
      name: "dmgType",
      message: "Character damage type:",
      choices: Object.keys(DMG_TYPE),
    },
    {
      type: "input",
      name: "version",
      message: "Character in version:",
    },
    {
      type: "confirm",
      name: "isLimited",
      message: "Is character limited?",
    },
  ],
  actions: () => {
    const defaultFolderPath = "content/characters";
    const resonanceFolderPath = "data/resonance/characters";
    return [
      {
        type: "add",
        path: `src/${defaultFolderPath}/{{dashCase name}}.mdx`,
        templateFile: `plop-templates/${defaultFolderPath}/index.mdx.hbs`,
        abortOnFail: true,
        skipIfExists: true,
      },
      {
        type: "add",
        path: `src/${resonanceFolderPath}/{{dashCase name}}.mdx`,
        templateFile: `plop-templates/${resonanceFolderPath}/index.mdx.hbs`,
        abortOnFail: true,
        skipIfExists: true,
      },
    ];
  },
};
