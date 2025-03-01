import ARTEFACT_RARITY from "../src/data/common/artefact/rarity.json" assert { type: "json" };
import ARTEFACT_TAG from "../src/data/common/artefact/tag.json" assert { type: "json" };
import ARTEFACT_TYPE from "../src/data/common/artefact/type.json" assert { type: "json" };

export default {
  description: "Create a artefact content mdx file",
  prompts: [
    {
      type: "input",
      name: "name",
      message: "Artefact name:",
    },
    {
      type: "list",
      name: "type",
      message: "Artefact type:",
      choices: Object.keys(ARTEFACT_TYPE),
    },
    {
      type: "list",
      name: "rarity",
      message: "Artefact rarity:",
      choices: Object.keys(ARTEFACT_RARITY),
    },
    {
      type: "checkbox",
      name: "tags",
      message: "Artefact tags:",
      choices: Object.keys(ARTEFACT_TAG).map((item) => ({ name: item })),
    },
    {
      type: "number",
      name: "diskSlot",
      message: "Artefact disk slots:",
    },
    {
      type: "confirm",
      name: "canExchange",
      message: "Artefact can be crafted by exchange?",
    },
  ],
  actions: () => {
    let defaultFolderPath = "markdown/artefacts";
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
