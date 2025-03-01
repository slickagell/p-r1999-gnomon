import STATS from "@data/common/character/stats.json";
import { IMAGE_ORIENTATION } from "@constants/resonance";
import RESONANCE_PIECES from "@data/resonance/common/pieces.json";
import Alpine from "alpinejs";
import matrix from "matrix-js";
import { changeImageOrientation } from "./common";

export default ({
  id,
  total = 1,
  orientation = 1,
  level = 1,
  stats,
  isMainPiece = false,
}: {
  id: string;
  total?: number;
  orientation?: number;
  level: number;
  stats: ResonancePieceStatsGeneralType;
  isMainPiece?: boolean;
}) => ({
  id: id,
  quantity: total,
  total: total,
  orientation: orientation,
  level: level,
  stats,
  currentStats: null,
  maxPieceWidth: "auto",
  maxPieceHeight: "auto",
  isMainPiece: isMainPiece,

  init() {
    if (window.innerWidth >= 768) {
      this.maxPieceWidth = `${this.maxPieceSize * this.blockSize}px`;
      this.maxPieceHeight = `auto`;
    } else {
      this.maxPieceHeight = `${this.maxPieceSize * this.blockSize}px`;
      this.maxPieceWidth = `auto`;
    }
  },

  initCurrentStats() {
    this.currentStats = Object.entries(stats[this.level]).reduce(
      (prev, stat) => {
        const [statId, statVal] = stat;
        const statData = STATS[statId];

        return {
          ...prev,
          [statId]: {
            label: statData.label || "",
            ...statVal,
            unit: statVal.unit || "",
          },
        };
      },
      {}
    );
  },

  setQuantity(quantity: number) {
    this.quantity = quantity;
  },

  updateQuantity(updateQuantity: number) {
    const newQuantity = parseInt(this.quantity) + updateQuantity;
    this.quantity = newQuantity;

    const generalStatsEl = document.querySelector(
      "#generalStats"
    ) as HTMLDivElement;
    if (!generalStatsEl) return;
    let generalStatsAlpineData: any = Alpine.$data(generalStatsEl);
    generalStatsAlpineData.updateGeneralStats({
      updateStats: this.currentStats,
      updateQuantity: updateQuantity,
    });
  },

  resetQuantity() {
    this.quantity = this.total;
  },

  selectPieceRotation() {
    const container = this.$el;
    const wrapper = container.querySelector("div[data-piece-id=" + id + "]");
    const image = container.querySelector(
      "img[data-piece-img-id=" + id + "]"
    ) as HTMLImageElement;

    if (!image || !wrapper) return;
    const piece = RESONANCE_PIECES[id];
    const dimension = matrix(piece.shape).size();
    let newDimension = dimension;

    const currentOrientation = +(this.orientation || 1);

    const newOrientation = changeImageOrientation(currentOrientation);

    const currentOrientationStyle = IMAGE_ORIENTATION[currentOrientation].style;
    const newOrientationStyle = IMAGE_ORIENTATION[newOrientation].style;

    if (newOrientation === 6 || newOrientation === 8) {
      //* [row, col]
      newDimension = [dimension[1], dimension[0]];
      image.style.left = `${((dimension[0] - newDimension[0]) * this.blockSize) / 2}px`;
      image.style.top = `${((dimension[1] - newDimension[1]) * this.blockSize) / 2}px`;
    } else {
      image.style.left = `0px`;
      image.style.top = `0px`;
    }

    image.classList.remove(currentOrientationStyle);
    image.classList.add(newOrientationStyle);

    this.orientation = newOrientation;

    wrapper.style.width = `${newDimension[1] * this.blockSize}px`;
    wrapper.style.height = `${newDimension[0] * this.blockSize}px`;
  },

  updateCurrentStats(level: number) {
    this.level = level;
    this.initCurrentStats();
  },

  pieceOnResizeWindow() {
    if (window.innerWidth >= 768) {
      this.maxPieceWidth = `${this.maxPieceSize * this.blockSize}px`;
      this.maxPieceHeight = `auto`;
    } else {
      this.maxPieceHeight = `${this.maxPieceSize * this.blockSize}px`;
      this.maxPieceWidth = `auto`;
    }
  },

  showPieceStat(statKey: string, stats) {
    if (this.isMainPiece) {
      const attributesEl = document.querySelector(
        "#attributes"
      ) as HTMLDivElement;
      if (!attributesEl) return;

      let attributesAlpineData: any = Alpine.$data(attributesEl);
      let baseStats = attributesAlpineData.baseStats;

      if (!baseStats[statKey]) {
        return "+" + stats.value + stats.unit;
      }

      if (statKey === "CRITICAL_RATE" || statKey === "CRITICAL_DMG") {
        return "+" + stats.value + stats.unit;
      }

      return "+" + Math.floor((baseStats[statKey].value * stats.value) / 100);
    }

    return "+" + stats.value + stats.unit;
  },
});
