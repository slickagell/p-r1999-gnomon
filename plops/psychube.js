import PSYCHUBE_RARITY from "../src/data/common/psychube/rarity.json" with { type: "json" };

export default {
  description: "Create a psychube content mdx file",
  prompts: [
    {
      type: "input",
      name: "name",
      message: "Psychube name:",
    },
    {
      type: "list",
      name: "rarity",
      message: "Psychube rarity:",
      choices: Object.values(PSYCHUBE_RARITY).map((ele) => ele.value),
    },
  ],
  actions: () => {
    let defaultFolderPath = "markdown/psychubes";
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
