import type { Alpine } from "alpinejs";

export default (Alpine: Alpine) => {
  Alpine.directive(
    "node",
    (el, { modifiers, expression }, { evaluateLater, effect }) => {
      let evaluate = evaluateLater(expression);
      effect(() => {
        evaluate((value) => {
          Alpine.mutateDom(() => {
            if (value) {
              if (modifiers.includes("clone-children")) {
                const node = (value as any).cloneNode(true);

                let childNodes = Array.from(node.childNodes);
                childNodes.forEach((child: Node) => {
                  el.appendChild(child);
                });
                return;
              }

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
    }
  );
};
