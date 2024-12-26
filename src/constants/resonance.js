export const IMAGE_DEGREE_ORIENTATIONS = {
  "0deg": 1,
  "180deg": 3,
  "90deg": 6,
  "270deg": 8,
};

export const IMAGE_ORIENTATION = {
  1: {
    deg: 0,
    style: "rotate-0",
  }, // "rotate(0deg)"
  3: {
    deg: 180,
    style: "rotate-180",
  }, // "rotate(180deg)",
  6: {
    deg: 90,
    style: "rotate-90",
  }, // "rotate(90deg)",
  8: {
    deg: 270,
    style: "-rotate-90",
  }, // "rotate(270deg)",
};

export const RESONANCE_PATTERN = {
  PLACIDITY: {
    pattern: "PLACIDITY",
    title: "Placidity",
    tags: ["DEFAULT"],
  },
  X_5_01_ASPIRATIONAL: {
    pattern: "ASPIRATIONAL",
    title: "Aspirational",
    tags: ["CRIT_DMG", "ATK"],
  },
  X_5_01_ELUCIDATION: {
    pattern: "ELUCIDATION",
    title: "Elucidation",
    tags: ["ULTIMATE_MIGHT", "CRITICAL_RATE"],
  },
  X_5_01_GENUINITY: {
    pattern: "GENUINITY",
    title: "Genuinity",
    tags: ["INCANTATION_MIGHT", "CRITICAL_RATE"],
  },
  X_5_01_HYPERPHRENIA: {
    pattern: "HYPERPHRENIA",
    title: "Hyperphrenia",
    tags: ["HP", "CRITICAL_RATE", "ATK"],
  },
  X_5_01_STUPEFACTION: {
    pattern: "STUPEFACTION",
    title: "Stupefaction",
    tags: ["GENERALIZED"],
  },
  Z_5_01_MERCY: {
    pattern: "MERCY",
    title: "Mercy",
    tags: ["DMG_HEAL", "DMG_REDUCTION"],
  },
  Z_5_01_EQUANIMITY: {
    pattern: "EQUANIMITY",
    title: "Equanimity",
    tags: ["HP", "MENTAL_DEFENSE", "REALITY_DEFENSE"],
  },
  Z_5_01_EQUIBALANCE: {
    pattern: "EQUIBALANCE",
    title: "Equilance",
    tags: ["GENERALIZED"],
  },
  Z_5_01_ELUCIDATION: {
    pattern: "ELUCIDATION",
    title: "Elucidation",
    tags: ["ULTIMATE_MIGHT", "CRITICAL_RATE"],
  },
  Z_5_01_GENUINITY: {
    pattern: "GENUINITY",
    title: "Genuinity",
    tags: ["INCANTATION_MIGHT", "CRITICAL_RATE"],
  },
  T_5_01_ELUCIDATION: {
    pattern: "ELUCIDATION",
    title: "Elucidation",
    tags: ["ULTIMATE_MIGHT", "PENETRATION_RATE", "ATTACK"],
  },
  T_5_01_GENUINITY: {
    pattern: "GENUINITY",
    title: "Genuinity",
    tags: ["INCANTATION_MIGHT", "PENETRATION_RATE", "ATTACK"],
  },
  T_5_01_HYPER: {
    pattern: "HYPER",
    title: "Hyper",
    tags: ["ATK"],
  },
  T_5_01_INSPIRE: {
    pattern: "INSPIRE",
    title: "Inspire",
    tags: ["DMG_BONUS"],
  },
  T_5_01_DELIRAMENT: {
    pattern: "DELIRAMENT",
    title: "Delirament",
    tags: ["GENERALIZED"],
  },
  U_5_01_HYPER: {
    pattern: "HYPER",
    title: "Hyper",
    tags: ["ATK"],
  },
  U_5_01_OVERINDULGENCE: {
    pattern: "OVERINDULGENCE",
    title: "Overindulgence",
    tags: ["HP"],
  },
  U_5_01_QUIESCENCE: {
    pattern: "QUIESCENCE",
    title: "Quiescence",
    tags: ["REALITY_DEF"],
  },
  U_5_01_PRUDENTIALITY: {
    pattern: "PRUDENTIALITY",
    title: "Prudentiality",
    tags: ["MENTAL_DEF"],
  },
  U_5_01_EQUANIMITY: {
    pattern: "EQUANIMITY",
    title: "Equanimity",
    tags: ["GENERALIZED"],
  },
};
