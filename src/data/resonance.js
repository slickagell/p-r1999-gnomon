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

export const RESONATE_PIECES = {
  RP_X_01: {
    id: "RP_X_01",
    image: "rp-x-01.png",
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 1, 0],
    ],
    stats: {
      1: {
        HP: {
          data: 1,
        },
      },
    },
  },
  RP_L_01: {
    id: "RP_L_01",
    image: "rp-l-01.png",
    shape: [
      [1, 0],
      [1, 0],
      [1, 1],
    ],
    stats: {
      1: {
        HP: {
          data: 1,
        },
      },
    },
  },
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
