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
