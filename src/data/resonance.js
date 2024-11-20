export const getResonanceBoardRowCol = (level) => {
  switch (level) {
    case 1:
    case 2: {
      return {
        row: 4,
        col: 4,
      };
    }
    case 3:
    case 4: {
      return {
        row: 4,
        col: 5,
      };
    }
    case 5:
    case 6: {
      return {
        row: 5,
        col: 5,
      };
    }
    case 7:
    case 8: {
      return {
        row: 5,
        col: 6,
      };
    }
    case 9: {
      return {
        row: 6,
        col: 6,
      };
    }
    case 10:
    case 11:
    case 12:
    case 13:
    case 14:
    case 15: {
      return {
        row: 7,
        col: 7,
      };
    }
    default:
      return {
        row: 7,
        col: 7,
      };
  }
};

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

export function changeImageOrientation(previousOrientation) {
  switch (previousOrientation) {
    case 1:
      return 6;
    case 3:
      return 8;
    case 6:
      return 3;
    case 8:
      return 1;
    default:
      return 1;
  }
}

export const RESONANCE_PIECES = {
  //* X pieces
  RP_X_5_01: {
    id: "RP_X_5_01",
    image: "rp-x-5-01.png",
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 1, 0],
    ],
    stats: {
      1: {
        HP: {
          value: 77,
        },
        ATTACK: {
          value: 14,
        },
        REALITY_DEFENSE: {
          value: 7,
        },
        MENTAL_DEFENSE: {
          value: 8,
        },
      },
      2: {
        HP: {
          value: 155,
        },
        ATTACK: {
          value: 27,
        },
        REALITY_DEFENSE: {
          value: 14,
        },
        MENTAL_DEFENSE: {
          value: 16,
        },
        CRITICAL_RATE: {
          value: 4,
          unit: "%",
        },
      },
      3: {
        HP: {
          value: 310,
        },
        ATTACK: {
          value: 55,
        },
        REALITY_DEFENSE: {
          value: 28,
        },
        MENTAL_DEFENSE: {
          value: 32,
        },
        CRITICAL_RATE: {
          value: 4,
          unit: "%",
        },
        CRITICAL_DMG: {
          value: 5,
          unit: "%",
        },
      },
      6: {
        HP: {
          value: 809,
        },
        ATTACK: {
          value: 143,
        },
        REALITY_DEFENSE: {
          value: 73,
        },
        MENTAL_DEFENSE: {
          value: 84,
        },
        CRITICAL_RATE: {
          value: 6,
          unit: "%",
        },
        CRITICAL_DMG: {
          value: 2,
          unit: "%",
        },
        CRITICAL_RESIST_RATE: {
          value: 8,
          unit: "%",
        },
      },
      7: {
        HP: {
          value: 992,
        },
        ATTACK: {
          value: 176,
        },
        REALITY_DEFENSE: {
          value: 90,
        },
        MENTAL_DEFENSE: {
          value: 104,
        },
        CRITICAL_RATE: {
          value: 6,
          unit: "%",
        },
        CRITICAL_DMG: {
          value: 3,
          unit: "%",
        },
        CRITICAL_RESIST_RATE: {
          value: 10,
          unit: "%",
        },
      },
    },
  },
  //* L pieces
  RP_L_3_01: {
    id: "RP_L_3_01",
    image: "rp-l-3-01.png",
    shape: [
      [1, 1],
      [1, 0],
    ],
    stats: {
      1: {
        ATTACK: {
          value: 1,
          unit: "%",
        },
        CRITICAL_RATE: {
          value: 1.5,
          unit: "%",
        },
      },
    },
  },
  RP_L_4_01: {
    id: "RP_L_4_01",
    image: "rp-l-4-01.png",
    shape: [
      [1, 0],
      [1, 0],
      [1, 1],
    ],
    stats: {
      1: {
        CRITICAL_RATE: {
          value: 2.5,
          unit: "%",
        },
        DMG_BONUS: {
          value: 1.5,
          unit: "%",
        },
        DMG_REDUCTION: {
          value: 1,
          unit: "%",
        },
      },
      3: {
        CRITICAL_RATE: {
          value: 3.5,
          unit: "%",
        },
        DMG_BONUS: {
          value: 2.5,
          unit: "%",
        },
        DMG_REDUCTION: {
          value: 2,
          unit: "%",
        },
      },
      4: {
        CRITICAL_RATE: {
          value: 4,
          unit: "%",
        },
        DMG_BONUS: {
          value: 3,
          unit: "%",
        },
        DMG_REDUCTION: {
          value: 2.5,
          unit: "%",
        },
      },
    },
  },
  RP_L_4_02: {
    id: "RP_L_4_02",
    image: "rp-l-4-02.png",
    shape: [
      [0, 1],
      [0, 1],
      [1, 1],
    ],
    stats: {
      1: {
        CRITICAL_RATE: {
          value: 4,
          unit: "%",
        },
        CRITICAL_RESIST_RATE: {
          value: 1,
          unit: "%",
        },
        CRITICAL_DMG: {
          value: 2.5,
          unit: "%",
        },
      },
      3: {
        CRITICAL_RATE: {
          value: 3.5,
          unit: "%",
        },
        DMG_BONUS: {
          value: 2.5,
          unit: "%",
        },
        DMG_REDUCTION: {
          value: 2,
          unit: "%",
        },
      },
      4: {
        CRITICAL_RATE: {
          value: 4,
          unit: "%",
        },
        DMG_BONUS: {
          value: 3,
          unit: "%",
        },
        DMG_REDUCTION: {
          value: 2.5,
          unit: "%",
        },
      },
    },
  },
  //* I pieces
  RP_I_2_01: {
    id: "RP_I_2_01",
    image: "rp-i-2-01.png",
    shape: [[1, 1]],
    stats: {
      1: {
        CRITICAL_DMG: {
          value: 3,
          unit: "%",
        },
        DMG_REDUCTION: {
          value: 1,
          unit: "%",
        },
      },
    },
  },
  RP_I_4_01: {
    id: "RP_I_4_01",
    image: "rp-i-4-01.png",
    shape: [[1], [1], [1], [1]],
    stats: {
      1: {
        HP: {
          value: 2,
          unit: "%",
        },
        ATTACK: {
          value: 1.5,
          unit: "%",
        },
        MENTAL_DEFENSE: {
          value: 1.5,
          unit: "%",
        },
      },
      2: {
        HP: {
          value: 2.5,
          unit: "%",
        },
        ATTACK: {
          value: 2.5,
          unit: "%",
        },
        MENTAL_DEFENSE: {
          value: 2.5,
          unit: "%",
        },
      },
      3: {
        HP: {
          value: 3,
          unit: "%",
        },
        ATTACK: {
          value: 3,
          unit: "%",
        },
        MENTAL_DEFENSE: {
          value: 3,
          unit: "%",
        },
      },
    },
  },
  //* Z pieces
  RP_Z_4_01: {
    id: "RP_Z_4_01",
    image: "rp-z-4-01.png",
    shape: [
      [1, 1, 0],
      [0, 1, 1],
    ],
    stats: {
      1: {
        CRITICAL_RATE: {
          value: 3,
          unit: "%",
        },
        CRITICAL_DEFENSE: {
          value: 3,
          unit: "%",
        },
        DMG_REDUCTION: {
          value: 3,
          unit: "%",
        },
      },
      3: {
        CRITICAL_RATE: {
          value: 5,
          unit: "%",
        },
        CRITICAL_DEFENSE: {
          value: 5,
          unit: "%",
        },
        DMG_REDUCTION: {
          value: 4.5,
          unit: "%",
        },
      },
    },
  },
  RP_Z_4_02: {
    id: "RP_Z_4_02",
    image: "rp-z-4-02.png",
    shape: [
      [0, 1, 1],
      [1, 1, 0],
    ],
    stats: {
      1: {
        CRITICAL_RATE: {
          value: 1.5,
          unit: "%",
        },
        CRITICAL_RESIST_RATE: {
          value: 1,
          unit: "%",
        },
        DMG_BONUS: {
          value: 2,
          unit: "%",
        },
      },
    },
  },
  //* T pieces
  RP_T_4_01: {
    id: "RP_T_4_01",
    image: "rp-t-4-01.png",
    shape: [
      [0, 1, 0],
      [1, 1, 1],
    ],
    stats: {
      1: {
        HP: {
          value: 2,
          unit: "%",
        },
        ATTACK: {
          value: 1.5,
          unit: "%",
        },
        REALITY_DEFENSE: {
          value: 1.5,
          unit: "%",
        },
      },
      2: {
        HP: {
          value: 2.5,
          unit: "%",
        },
        ATTACK: {
          value: 2.5,
          unit: "%",
        },
        REALITY_DEFENSE: {
          value: 2.5,
          unit: "%",
        },
      },
      3: {
        HP: {
          value: 3,
          unit: "%",
        },
        ATTACK: {
          value: 3,
          unit: "%",
        },
        REALITY_DEFENSE: {
          value: 3,
          unit: "%",
        },
      },
    },
  },
  //* O pieces
  RP_O_1_01: {
    id: "RP_O_1_01",
    image: "rp-o-1-01.png",
    shape: [[1]],
    stats: {
      1: {
        HP: {
          value: 1,
          unit: "%",
        },
        DMG_REDUCTION: {
          value: 0.5,
          unit: "%",
        },
      },
    },
  },
  RP_O_1_02: {
    id: "RP_O_1_02",
    image: "rp-o-1-02.png",
    shape: [[1]],
    stats: {
      1: {
        HP: {
          value: 1,
          unit: "%",
        },
        DMG_BONUS: {
          value: 0.5,
          unit: "%",
        },
      },
    },
  },
  RP_O_4_01: {
    id: "RP_O_4_01",
    image: "rp-o-4-01.png",
    shape: [
      [1, 1],
      [1, 1],
    ],
    stats: {
      1: {
        ATTACK: {
          value: 1.5,
          unit: "%",
        },
        REALITY_DEFENSE: {
          value: 1.5,
          unit: "%",
        },
        MENTAL_DEFENSE: {
          value: 1.5,
          unit: "%",
        },
      },
      2: {
        ATTACK: {
          value: 2.5,
          unit: "%",
        },
        REALITY_DEFENSE: {
          value: 2.5,
          unit: "%",
        },
        MENTAL_DEFENSE: {
          value: 2.5,
          unit: "%",
        },
      },
    },
  },
};
