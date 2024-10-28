import { createMemo } from "solid-js";
import { VList } from "virtua/solid";

interface VirtualListProps {}

export const ArtefactVirtualList = ({
  artefacts,
  filters,
}: VirtualListProps) => {
  const frozenArtefacts = [...artefacts.children];
  const data = Array.from({ length: frozenArtefacts.length });
  const list = createMemo(() => {
    return frozenArtefacts;
  });

  return (
    <>
      {filters}
      <VList data={data} style={{ height: "50vh" }}>
        {(_, i) => <div data-index={i}>{list()[i]}</div>}
      </VList>
    </>
  );
};
