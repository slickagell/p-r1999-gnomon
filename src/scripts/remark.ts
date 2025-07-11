import remarkDirective from "remark-directive";
import { directivePlugin } from "./directive-plugin.mjs";
import { remark } from "remark";

export const markdownParse = async (content: string) =>
  await remark().use(remarkDirective).use(directivePlugin).process(content);

export const processor = remark().use(remarkDirective).use(directivePlugin);
export const markdownAST = (content: string) => processor.parse(content);
