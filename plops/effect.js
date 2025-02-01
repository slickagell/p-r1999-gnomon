import { EFFECT_TYPE } from "../src/constants/effect.js";

export default {
  description: "Create a effect content mdx file",
  prompts: [
    {
      type: "input",
      name: "name",
      message: "Effect name:",
    },
    {
      type: "list",
      name: "type",
      message: "Effect type:",
      choices: Object.keys(EFFECT_TYPE),
    },
    {
      type: "list",
      name: "isSpecific",
      message: "Is specific to character, bullet, or mode?",
      choices: ["CHARACTER", "BULLET", "MODE", "NONE"],
    },
  ],
  actions: () => {
    let defaultFolderPath = "markdown/effects";
    return [
      {
        type: "add",
        path: `src/${defaultFolderPath}/{{dashCase name}}.mdx`,
        templateFile: `plop-templates/${defaultFolderPath}/index.mdx.hbs`,
        abortOnFail: true,
        skipIfExists: true,
      },
    ];
  },
};
