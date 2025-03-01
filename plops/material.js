import MATERIAL_RARITY from "../src/data/common/material/rarity.json" assert { type: "json" };

export default {
  description: "Create a material content mdx file",
  prompts: [
    {
      type: "input",
      name: "name",
      message: "Material name:",
    },
    {
      type: "list",
      name: "rarity",
      message: "Material rarity:",
      choices: Object.values(MATERIAL_RARITY).map((ele) => ele.value),
    },
  ],
  actions: () => {
    let defaultFolderPath = "markdown/materials";
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
