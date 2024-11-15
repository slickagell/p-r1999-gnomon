import { STATS } from "@data/character";
import Alpine from "alpinejs";

export default () => ({
  stats: Object.entries(STATS).reduce((prev, stat) => {
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
  }, {}),

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
        this.stats[statId].value += Math.round(
          statVal.value * -((updateQuantity * baseStats[statId].value) / 100),
        );
        return;
      } else {
        this.stats[statId].value += statVal.value * -updateQuantity;
      }
    });
  },
});
