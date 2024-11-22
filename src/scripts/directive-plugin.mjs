import { visit, CONTINUE } from "unist-util-visit";
import { h } from "hastscript";
import { toc } from "mdast-util-toc";

let table;

const visitor = (node) => {
  if (node.type === "root") {
    table = toc(node, { minDepth: 2, maxDepth: 3 });
  }

  if (table) {
    if (node.type === "leafDirective" && node.name === "toc") {
      node.children = [...node.children, table.map];
    }
  }

  if (
    node.type === "containerDirective" ||
    node.type === "leafDirective" ||
    node.type === "textDirective"
  ) {
    if (Object.keys(node.attributes).includes("cAttr")) {
      const { cAttr, ...rest } = node.attributes;

      const nodeAttr = cAttr.split(" ").reduce((prev, cur) => {
        const [key, val] = cur.split("=");
        return {
          ...prev,
          [key]: val,
        };
      }, {});

      node.attributes = {
        ...rest,
        ...nodeAttr,
      };
    }
    const data = node.data || (node.data = {});
    const hast = h(node.name, node.attributes || {});

    data.hName = hast.tagName;
    data.hProperties = hast.properties;
  }

  return CONTINUE;
};

export const directivePlugin = () => (ast) => visit(ast, visitor);
