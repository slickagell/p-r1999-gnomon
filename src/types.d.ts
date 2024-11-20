interface ResonancePieceStatsGeneralType {
  [level: number]: {
    [statId: string]: Omit<ResonancePieceStatsType, "label">;
  };
}

interface ResonancePieceStatsType {
  [statId: string]: {
    label: string;
    value: number;
    unit?: string;
  };
}

interface ResonancePieceType {
  id: string;
  quantity: number;
  total: number;
  orientation: number;
  level: number;
  stats: ResonancePieceStatsGeneralType;
  currentStats: ResonancePieceStatsType;
}

interface ResonanceInitPiecesType {
  [resonateLevel: string]: {
    id: string;
    total: number;
    level: number;
  }[];
}

interface RecommendedResonanceDataType {
  blocks: string[];
  shape: number[][];
  orientation: number;
  pieceId: string;
}

interface ResonanceRecommendedListType {
  [resonateLevel: string]: {
    name: string;
    resonance: RecommendedResonanceDataType[];
  }[];
}

interface ResonanceBlockType {
  id: string;
  col: number;
  row: number;
  pos: {
    x: number;
    y: number;
  };
  size: number;
  isCollided?: boolean;
  isNotValid?: boolean;
}
