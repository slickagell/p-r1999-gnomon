import { useStore } from "@nanostores/solid";
import {
  nameFilter as artefactNameFilter,
  rarityFilter as artefactRarityFilter,
  tagFilter as artefactTagFilter,
  typeFilter as artefactTypeFilter,
} from "@stores/artefactFilterStore";
import {
  nameFilter as effectNameFilter,
  typeFilter as effectTypeFilter,
} from "@stores/effectFilterStore";
import { createEffect, createMemo, createSignal } from "solid-js";
import { WindowVirtualizer, type WindowVirtualizerHandle } from "virtua/solid";

export const ArtefactVirtualList = ({ artefacts }: any) => {
  if (!artefacts) {
    return null;
  }

  const artefactSlug = window.location.hash?.substring(1);

  const [frozenArtefacts] = createSignal([...artefacts.children]);
  const [virtualListElement, setVirtualListElement] = createSignal<
    WindowVirtualizerHandle | undefined
  >();

  const $rarityFilter = useStore(artefactRarityFilter);
  const $typeFilter = useStore(artefactTypeFilter);
  const $tagFilter = useStore(artefactTagFilter);
  const $nameFilter = useStore(artefactNameFilter);

  const list = createMemo(() => {
    const rarityFilter = $rarityFilter();
    const typeFilter = $typeFilter();
    const tagFilter = $tagFilter();
    const nameFilter = $nameFilter();

    const filteredArtefacts = frozenArtefacts().filter((ele) => {
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

  createEffect(() => {
    const virtualEl = virtualListElement();
    if (virtualEl && artefactSlug) {
      const searchArtefactIdx = frozenArtefacts().findIndex(
        (ele) => ele.getAttribute("data-artefact-slug") === artefactSlug,
      );

      const header = document.getElementById("header");
      const headerHeight = header?.offsetHeight || 0;

      if (searchArtefactIdx > -1) {
        virtualEl.scrollToIndex(searchArtefactIdx, {
          offset: -headerHeight,
        });
      }
    }
  });

  return (
    <>
      <p class="my-4 text-right">
        <strong class="text-xl">{list().length}</strong>{" "}
        {list().length > 1 ? "artefacts" : "artefact"}
      </p>
      <WindowVirtualizer ref={setVirtualListElement} data={list()}>
        {(_, i) => (
          <div data-index={i}>
            {!!i && (
              <div class="divider before:bg-primary-content/30 after:bg-primary-content/30" />
            )}
            <div>{list()[i]}</div>
          </div>
        )}
      </WindowVirtualizer>
    </>
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
