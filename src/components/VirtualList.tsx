import { useStore } from "@nanostores/solid";
import {
  nameFilter,
  rarityFilter,
  tagFilter,
  typeFilter,
} from "@stores/artefactFilterStore";
import {
  nameFilter as effectNameFilter,
  typeFilter as effectTypeFilter,
} from "@stores/effectFilterStore";
import { createMemo, createSignal } from "solid-js";
import { WindowVirtualizer } from "virtua/solid";

export const ArtefactVirtualList = ({ effects }: any) => {
  if (!effects) {
    return null;
  }

  const [frozenEffects] = createSignal([...effects.children]);

  const $rarityFilter = useStore(rarityFilter);
  const $typeFilter = useStore(typeFilter);
  const $tagFilter = useStore(tagFilter);
  const $nameFilter = useStore(nameFilter);

  const list = createMemo(() => {
    const rarityFilter = $rarityFilter();
    const typeFilter = $typeFilter();
    const tagFilter = $tagFilter();
    const nameFilter = $nameFilter();

    const filteredEffects = frozenEffects().filter((ele) => {
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

    return filteredEffects;
  });

  return (
    <WindowVirtualizer data={list()}>
      {(_, i) => <div data-index={i}>{list()[i]}</div>}
    </WindowVirtualizer>
  );
};

export const EffectVirtualList = ({ effects }: any) => {
  if (!effects) {
    return null;
  }

  const [frozenEffects] = createSignal([...effects.children]);

  const $typeFilter = useStore(effectTypeFilter);
  const $nameFilter = useStore(effectNameFilter);

  const list = createMemo(() => {
    const typeFilter = $typeFilter();
    const nameFilter = $nameFilter();

    const filteredEffects = frozenEffects().filter((ele) => {
      const type = ele.getAttribute("data-effect-type");
      const name = ele.getAttribute("data-effect-name");

      const filters = typeFilter === "ALL" || type === typeFilter;

      return !nameFilter
        ? filters
        : filters && name.toLowerCase().includes(nameFilter.toLowerCase());
    });

    return filteredEffects;
  });

  return (
    <WindowVirtualizer data={list()}>
      {(_, i) => <div data-index={i}>{list()[i]}</div>}
    </WindowVirtualizer>
  );
};
