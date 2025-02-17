import { STATS } from "@constants/character";
import Alpine from "alpinejs";

const initStats = Object.entries(STATS).reduce((prev, stat) => {
  const [statId, statVal] = stat;

  return {
    ...prev,
    [statId]: {
      label: statVal.label,
      code: statId,
      keyVal: statVal.keyVal,
      value: 0,
      unit: statVal.unit || "",
    },
  };
}, {});

export default () => ({
  stats: JSON.parse(JSON.stringify(initStats)),

  updateGeneralStats({
    updateStats,
    updateQuantity,
  }: {
    updateStats: ResonancePieceStatsType;
    updateQuantity: number;
  }) {
    const attributesEl = document.querySelector(
      "#attributes",
    ) as HTMLDivElement;
    if (!attributesEl) return;

    let attributesAlpineData: any = Alpine.$data(attributesEl);
    let baseStats = attributesAlpineData.baseStats;

    Object.entries(updateStats).forEach((stat) => {
      const [statId, statVal] = stat;
      if (!this.stats[statId]) return;

      if (!this.stats[statId].unit && statVal.unit === "%") {
        this.stats[statId].value +=
          -updateQuantity *
          Math.floor((statVal.value * baseStats[statId].value) / 100);
        return;
      } else {
        this.stats[statId].value += statVal.value * -updateQuantity;
      }
    });
  },

  resetGeneralStats() {
    this.stats = JSON.parse(JSON.stringify(initStats));
  },
});
