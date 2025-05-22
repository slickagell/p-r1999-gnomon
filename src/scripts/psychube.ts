import STATS from "@data/common/character/stats.json";
import PSYCHUBE_STATS_CONST from "@data/common/psychube/stats-const.json";

export default () => ({
  activeStatLevel: 1,
  baseStats: {
    HP: {
      label: STATS["HP"].label,
      value: 0,
    },
    ATTACK: {
      label: STATS["ATTACK"].label,
      value: 0,
    },
    REALITY_DEFENSE: {
      label: STATS["REALITY_DEFENSE"].label,
      value: 0,
    },
    MENTAL_DEFENSE: {
      label: STATS["MENTAL_DEFENSE"].label,
      value: 0,
    },
  },
  specialStat: {
    label: "",
    value: 0,
  },

  init() {
    this.calcBaseStats();
    this.calcSpecialStat();
  },

  calcBaseStats() {
    const stats = this.$store.psychube.stats;
    if (!stats) return;
    const multiplier =
      PSYCHUBE_STATS_CONST.find(
        (d) =>
          d.level === this.activeStatLevel &&
          d.rarity === this.$store.psychube.rarity
      )?.multiplier ?? 0;

    this.baseStats = {
      HP: {
        label: STATS["HP"].label,
        value: Math.floor(stats.HP * multiplier),
      },
      ATTACK: {
        label: STATS["ATTACK"].label,
        value: Math.floor(stats.ATTACK * multiplier),
      },
      REALITY_DEFENSE: {
        label: STATS["REALITY_DEFENSE"].label,
        value: Math.floor(stats.REALITY_DEFENSE * multiplier),
      },
      MENTAL_DEFENSE: {
        label: STATS["MENTAL_DEFENSE"].label,
        value: Math.floor(stats.MENTAL_DEFENSE * multiplier),
      },
    };
  },

  calcSpecialStat() {
    const specialStat = this.$store.psychube.specialStat;
    if (!specialStat) return;
    const enhances = Object.values(specialStat.enhances) as {
      upToLevel: number;
      value: number;
    }[];
    this.specialStat = {
      label: STATS[specialStat.code].label,
      value:
        (enhances.find((d, idx) => {
          if (idx === enhances.length - 1) return d;
          return this.activeStatLevel < d.upToLevel;
        })?.value ?? 0) + "%",
    };
  },

  handleChangeActiveStateLevel(level: number) {
    this.activeStatLevel = level;
    this.calcBaseStats();
    this.calcSpecialStat();
  },
});
