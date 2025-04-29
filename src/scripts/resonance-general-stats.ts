import STATS from "@data/common/character/stats.json";
import Alpine from "alpinejs";

const initStats = Object.entries(STATS).reduce((prev, stat) => {
  const [statId, statVal] = stat as [
    string,
    { label: string; unit?: string; keyVal: string },
  ];

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
  staticStats: {},
  percentStats: {},

  updateGeneralStats({
    updateStats,
    updateQuantity,
    isMainPiece,
  }: {
    updateStats: ResonancePieceStatsType;
    updateQuantity: number;
    isMainPiece: boolean;
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

      if (isMainPiece) {
        if (baseStats[statId]) {
          let value = statVal.value;
          if (baseStats[statId].unit !== "%") {
            value = Math.floor((statVal.value * baseStats[statId].value) / 100);
          }

          if (!this.staticStats[statId]) {
            this.staticStats[statId] = {
              label: statVal.label,
              value: value * -updateQuantity,
              unit: statVal.unit,
            };
            return;
          }
          const updated = {
            label: statVal.label,
            value: this.staticStats[statId].value + value * -updateQuantity,
            unit: statVal.unit,
          };
          this.staticStats[statId] = updated;
          return;
        }
      }

      if (statVal.unit === "%") {
        if (!this.percentStats[statId]) {
          this.percentStats[statId] = {
            label: statVal.label,
            value: statVal.value * -updateQuantity,
            unit: statVal.unit,
          };
          return;
        }
        const updated = {
          label: statVal.label,
          value:
            this.percentStats[statId].value + statVal.value * -updateQuantity,
          unit: statVal.unit,
        };
        this.percentStats[statId] = updated;
      } else {
        if (!this.staticStats[statId]) {
          this.staticStats[statId] = {
            label: statVal.label,
            value: statVal.value * -updateQuantity,
            unit: statVal.unit,
          };
          return;
        }
        const updated = {
          label: statVal.label,
          value:
            this.staticStats[statId].value + statVal.value * -updateQuantity,
          unit: statVal.unit,
        };
        this.staticStats[statId] = updated;
      }
    });
  },

  updateTotalStats() {
    const attributesEl = document.querySelector(
      "#attributes",
    ) as HTMLDivElement;
    if (!attributesEl) return;

    let attributesAlpineData: any = Alpine.$data(attributesEl);
    let baseStats = attributesAlpineData.baseStats;

    Object.entries(this.percentStats).forEach((stat) => {
      const [statId, statVal] = stat as [
        string,
        { label: string; value: number; unit?: string },
      ];

      if (!this.stats[statId].unit && statVal.unit === "%") {
        this.stats[statId].value = Math.floor(
          (statVal.value * baseStats[statId].value) / 100,
        );
        return;
      } else {
        this.stats[statId].value = statVal.value;
      }
    });

    Object.entries(this.staticStats).forEach((stat) => {
      const [statId, statVal] = stat as [
        string,
        { label: string; value: number; unit?: string },
      ];
      if (!this.stats[statId]) return;

      this.stats[statId].value += statVal.value;
    });
  },

  resetGeneralStats() {
    this.stats = JSON.parse(JSON.stringify(initStats));
    this.staticStats = {};
    this.percentStats = {};
  },
});
