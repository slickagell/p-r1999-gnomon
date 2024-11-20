export const CARD_TYPE = {
  ATTACK: "attack",
  DEBUFF: "debuff",
  HEAL: "heal",
  BUFF: "buff",
  CHANNEL: "channel",
  COUNTER: "counter",
};

export const AFFLATUS_TYPE = {
  MINERAL: {
    title: "Mineral",
    assetCode: "mineral",
    styleCode: "mineral",
  },
  STAR: {
    title: "Star",
    assetCode: "star",
    styleCode: "star",
  },
  PLANT: {
    title: "Plant",
    assetCode: "plant",
    styleCode: "plant",
  },
  BEAST: {
    title: "Beast",
    assetCode: "beast",
    styleCode: "beast",
  },
  SPIRIT: {
    title: "Spirit",
    assetCode: "spirit",
    styleCode: "spirit",
  },
  INTELLECT: {
    title: "Intellect",
    assetCode: "intellect",
    styleCode: "intellect",
  },
};

export const DMG_TYPE = {
  REALITY: {
    title: "Reality",
    assetCode: "reality",
  },
  MENTAL: {
    title: "Mental",
    assetCode: "mental",
  },
};

export const SPECIALTY = {
  DPS: {
    title: "DPS",
  },
  SUPPORT: {
    title: "Support",
  },
  FOLLOW_UP_ATTACK: {
    title: "Follow-up Attack",
  },
  CONTROL: {
    title: "Control",
  },
  BURN: {
    title: "Burn",
  },
  BURST_DMG: {
    title: "Burst DMG",
  },
  DEBUFF: {
    title: "Debuff",
  },
  EXTRA_ACTION: {
    title: "Extra Action",
  },
  SHIELD: {
    title: "Shield",
  },
};

export const RARITY = {
  SIX_STAR: {
    title: "6 star",
    value: 6,
  },
  FIVE_STAR: {
    title: "5 star",
    value: 5,
  },
  FOUR_STAR: {
    title: "4 star",
    value: 4,
  },
  THREE_STAR: {
    title: "3 star",
    value: 3,
  },
};

export const STATS = {
  HP: {
    label: "HP",
    keyVal: "hp",
  },
  ATTACK: {
    label: "ATK",
    keyVal: "attack",
  },
  REALITY_DEFENSE: {
    label: "Reality Defense",
    keyVal: "realityDefense",
  },
  MENTAL_DEFENSE: {
    label: "Mental Defense",
    keyVal: "mentalDefense",
  },
  CRITICAL_TECHNIQUE: {
    label: "Critical Technique",
    keyVal: "criticalTechnique",
  },
  CRITICAL_RATE: {
    label: "Critical Rate",
    keyVal: "criticalRate",
    unit: "%",
  },
  CRITICAL_DMG: {
    label: "Critical Damage",
    keyVal: "criticalDamage",
    unit: "%",
  },
  CRITICAL_DEFENSE: {
    label: "Critical Defense",
    keyVal: "criticalDefense",
    unit: "%",
  },
  CRITICAL_RESIST_RATE: {
    label: "Critical Resist Rate",
    keyVal: "criticalResistRate",
    unit: "%",
  },
  DMG_BONUS: {
    label: "Damage Bonus",
    keyVal: "dmgBonus",
    unit: "%",
  },
  DMG_REDUCTION: {
    label: "Damage Taken Reduction",
    keyVal: "dmgReduction",
    unit: "%",
  },
  DMG_HEAL: {
    label: "Damage Heal",
    keyVal: "dmgHeal",
    unit: "%",
  },
  LEECH_RATE: {
    label: "Leech Rate",
    keyVal: "leechRate",
    unit: "%",
  },

  HEALING_DONE: {
    label: "Healing Done",
    keyVal: "healingDone",
    unit: "%",
  },
  PENETRATION_RATE: {
    label: "Penetration Rate",
    keyVal: "penetrationRate",
    unit: "%",
  },
  INCANTATION_MIGHT: {
    label: "Incantation Might",
    keyVal: "incantationMight",
    unit: "%",
  },
  ULTIMATE_MIGHT: {
    label: "Ultimate Might",
    keyVal: "ultimateMight",
    unit: "%",
  },
};

export const CHARACTER_RESONANCE = [
  {
    blocks: ["0-0", "0-1", "0-2", "1-1"],
    shape: [
      [1, 1, 1],
      [0, 1, 0],
    ],
    orientation: 3,
    pieceId: "RP_T_4_01",
  },
  { blocks: ["0-3"], shape: [[1]], orientation: 1, pieceId: "RP_O_1_02" },
  { blocks: ["0-4"], shape: [[1]], orientation: 1, pieceId: "RP_O_1_02" },
  {
    blocks: ["1-3", "1-4", "2-4"],
    shape: [
      [1, 1],
      [0, 1],
    ],
    orientation: 6,
    pieceId: "RP_L_3_01",
  },
  {
    blocks: ["1-2", "2-1", "2-2", "2-3", "3-2"],
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 1, 0],
    ],
    orientation: 1,
    pieceId: "RP_X_5_01",
  },
  {
    blocks: ["1-0", "2-0", "3-0", "4-0"],
    shape: [[1], [1], [1], [1]],
    orientation: 1,
    pieceId: "RP_I_4_01",
  },
  {
    blocks: ["3-1", "4-1", "4-2"],
    shape: [
      [1, 0],
      [1, 1],
    ],
    orientation: 8,
    pieceId: "RP_L_3_01",
  },
  {
    blocks: ["3-3", "3-4", "4-3", "4-4"],
    shape: [
      [1, 1],
      [1, 1],
    ],
    orientation: 1,
    pieceId: "RP_O_4_01",
  },
];
