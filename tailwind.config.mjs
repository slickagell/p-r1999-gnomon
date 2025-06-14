/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");
const defaultTheme = require("tailwindcss/defaultTheme");

export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        black: "#1b1b1b",

        mineral: "#8D6838",
        star: "#4D719A",
        plant: "#418D51",
        beast: "#B25859",
        spirit: "#814886",
        intellect: "#9E8D4D",

        paper: "#F6EEE3",
        ["line-paper"]: "#d9bda5",

        attack: "#B25859",
        buff: "#4D719A",
        effect: "#3E73B0",

        highlight: "#db6f39",
        gray: "#808080",

        common: "#617594",
        rare: "#623583",
        epic: "#d3c47c",
        legendary: "#d67c0f",

        syntony: "#597463",
        abundance: "#9f844d",
        craft: "#8680aa",
        ritual: "#873a4b",
        ["extra-action"]: "#95745d",
        resonance: "#5f7281",
        voltaic: "#838554",
        support: "#848887",
        stress: "#7c8e0c",
        guide: "#fdf2e5",

        vigilance: "#5f7281",
        disorder: "#95745d",
        focus: "#597463",
        meltdown: "#873a4b",
        enhance: "#9f844d",

        all: "#9f844d",
        ally: "#5f7281",
        enemy: "#873a4b",

        ["euphotic-zone"]: "#96c9e0",
        ["mesophotic-zone"]: "#7ebdd9",
        ["bathyal-zone"]: "#66b1d2",
        ["abyssal-zone"]: "#4ea5cb",
        ["hadal-zone"]: "#3998c2",
      },
      gridTemplateColumns: {
        filter: "auto 1fr",
      },
      textShadow: {
        sm: "0 1px 2px var(--tw-shadow-color)",
        DEFAULT: "0 2px 4px var(--tw-shadow-color)",
        lg: "0 8px 16px var(--tw-shadow-color)",
      },
      fontFamily: {
        sans: ['"Noto Sans"', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  daisyui: {
    themes: [
      {
        r1999: {
          primary: "#DA6C35",
          secondary: "#e9dccd",
          tertiary: "#E9A319",
          accent: "#1fb2a6",
          neutral: "#294949",
          "base-100": "#121212",
          info: "#3abff8",
          success: "#36d399",
          warning: "#fbbd23",
          error: "#f87272",

          "--rounded-btn": "0",
          "--rounded-badge": "0",
          "--rounded-box": "0",
          "primary-content": "#d0ac81",
          "base-content": "#EBE0D5",
        },
      },
    ],
  },
  plugins: [
    require("daisyui"),
    plugin(function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          "text-shadow": (value) => ({
            textShadow: value,
          }),
        },
        { values: theme("textShadow") }
      );
    }),
  ],
};
