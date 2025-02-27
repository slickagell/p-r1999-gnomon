//x-node based on https://jacksleight.dev/posts/alpine-x-node-directive

import type { Alpine } from "alpinejs";

export default (Alpine: Alpine) => {
  Alpine.directive("node", (el, { modifiers, expression }) => {
    let evaluate = Alpine.evaluateLater(el, expression);
    Alpine.effect(() => {
      evaluate((value) => {
        Alpine.mutateDom(() => {
          if (value) {
            const node = modifiers.includes("clone")
              ? (value as any).cloneNode(true)
              : value;
            el.replaceChildren(node);
          } else {
            el.replaceChildren();
          }
        });
      });
    });
  });
};
