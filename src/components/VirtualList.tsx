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
        {(d, i) => (
          <>
            {!!i() && (
              <div class="divider before:bg-primary-content/30 after:bg-primary-content/30" />
            )}
            <div>{d}</div>
          </>
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
    <WindowVirtualizer data={list()}>{(d, i) => <>{d}</>}</WindowVirtualizer>
  );
};

export const ArchetypeVirtualList = ({
  archetypes,
  sections,
  tocFloating,
}: any) => {
  if (!archetypes) {
    return null;
  }

  let virtualizerRef;
  let tocRef;

  let sectionIdx = -1;
  const sectionData = sections.map((section, idx) => {
    let newSectionIdx = sectionIdx + (sections[idx - 1]?.sub?.length || 0) + 1;
    sectionIdx = newSectionIdx;
    return {
      ...section,
      idx: newSectionIdx,
      sub: section.sub?.map((sub, subIdx) => ({
        ...sub,
        idx: newSectionIdx + subIdx + 1,
      })),
    };
  });
  const header = document.getElementById("header");
  const headerHeight = header?.offsetHeight || 0;

  const [frozenArchetypes] = createSignal([...archetypes.children]);
  const [frozenTocFloating] = createSignal([...tocFloating.children]);

  createEffect(() => {
    const exWindow = window as any;
    exWindow.sectionScroll = function (ele) {
      const sectionIdx = ele.getAttribute("data-index");

      virtualizerRef.scrollToIndex(sectionIdx, {
        offset: -headerHeight,
      });
    };
    tocRef.querySelectorAll("[data-section]").forEach((ele) => {
      ele.addEventListener("click", () => {
        exWindow.sectionScroll(ele);
      });
    });
  });

  return (
    <>
      <h2>Table of Contents</h2>
      <div id="toc" ref={tocRef}>
        <ul class="menu">
          {sectionData.map((section) => {
            if (!section.sub) {
              return (
                <li>
                  <span
                    data-section
                    class="font-bold cursor-pointer hover:underline hover:text-primary"
                    data-index={section.idx}
                  >
                    {section.name}
                  </span>
                </li>
              );
            }

            return (
              <li>
                <details>
                  <summary>
                    <span
                      data-section
                      data-index={section.idx}
                      class="font-bold cursor-pointer hover:underline hover:text-primary"
                    >
                      {section.name}
                    </span>
                  </summary>
                  <ul>
                    {section.sub.map((sub) => (
                      <li>
                        <span
                          data-section
                          class="font-bold cursor-pointer hover:underline hover:text-primary"
                          data-index={sub.idx}
                        >
                          {sub.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </details>
              </li>
            );
          })}
        </ul>
      </div>
      {frozenTocFloating()}
      <WindowVirtualizer ref={virtualizerRef} data={frozenArchetypes()}>
        {(d, i) => <>{d}</>}
      </WindowVirtualizer>
    </>
  );
};
