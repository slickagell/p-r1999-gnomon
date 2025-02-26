export default {
  description: "Create a myth manifest mindmap node mdx file",
  prompts: [
    {
      type: "list",
      name: "mythManifest",
      message: "Myth manifest:",
      choices: ["Mountain Ghost", "Star of Misfortune", "Operatic Reflection"],
    },
    {
      type: "input",
      name: "name",
      message: "Mindmap node name:",
    },
  ],
  actions: () => {
    const defaultFolderPath =
      "markdown/reveries-in-the-rain/myth-manifest/mind-map";
    return [
      {
        type: "add",
        path: `src/${defaultFolderPath}/{{dashCase mythManifest}}/{{dashCase name}}.mdx`,
        templateFile: `plop-templates/${defaultFolderPath}/index.mdx.hbs`,
        abortOnFail: true,
        skipIfExists: true,
      },
    ];
  },
};
