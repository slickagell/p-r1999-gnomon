import { createMemo, type JSXElement } from "solid-js";
import { VList } from "virtua/solid";
import { useStore } from "@nanostores/solid";
import {
  rarityFilter,
  typeFilter,
  tagFilter,
  nameFilter,
} from "@stores/artefactFilterStore";

export const ArtefactVirtualList = ({ artefacts }: any) => {
  if (!artefacts) {
    return null;
  }

  const frozenArtefacts = [...artefacts.children];

  const $rarityFilter = useStore(rarityFilter);
  const $typeFilter = useStore(typeFilter);
  const $tagFilter = useStore(tagFilter);
  const $nameFilter = useStore(nameFilter);

  const list = createMemo(() => {
    const rarityFilter = $rarityFilter();
    const typeFilter = $typeFilter();
    const tagFilter = $tagFilter();
    const nameFilter = $nameFilter();

    const filteredArtefacts = frozenArtefacts.filter((ele) => {
      const rarity = ele.getAttribute("data-artefact-rarity");
      const type = ele.getAttribute("data-artefact-type");
      const tags = ele.getAttribute("data-artefact-tags");
      const name = ele.getAttribute("data-artefact-name");

      const filters =
        (rarityFilter === "ALL" || rarity === rarityFilter) &&
        (typeFilter === "ALL" || type === typeFilter) &&
        (tagFilter === "ALL" || tags.includes(tagFilter));

      return !nameFilter
        ? filters
        : filters && name.toLowerCase().includes(nameFilter.toLowerCase());
    });

    return filteredArtefacts;
  });

  return (
    <>
      <VList data={list()} style={{ height: "50vh" }}>
        {(_, i) => <div data-index={i}>{list()[i]}</div>}
      </VList>
    </>
  );
};
