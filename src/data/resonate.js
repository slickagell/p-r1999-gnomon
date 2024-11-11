export const getResonateBoardRowCol = (level) => {
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
  RB_1: {
    id: "RB-1",
    image: "rb-1",
    shape: [[1]],
    stats: {
      1: {
        HP: {
          data: 1,
        },
      },
    },
  },
};
