import {
  Application,
  Assets,
  Circle,
  Container,
  FillGradient,
  Graphics,
  GraphicsPath,
  Sprite,
} from "pixi.js";
import { extensions, CullerPlugin } from "pixi.js";
import { Viewport } from "pixi-viewport";
import dayjs from "dayjs";
import dayOfYear from "dayjs/plugin/dayOfYear"; // ES 2015

dayjs.extend(dayOfYear);
extensions.add(CullerPlugin);

// Graphics.prototype.drawDashLine = function (toX, toY, dash = 16, gap = 8) {
//   console.log(this);
//   const lastPosition = this.currentPath.shape.points;

//   const currentPosition = {
//     x: lastPosition[lastPosition.length - 2] || 0,
//     y: lastPosition[lastPosition.length - 1] || 0,
//   };

//   const absValues = {
//     toX: Math.abs(toX),
//     toY: Math.abs(toY),
//   };

//   for (
//     ;
//     Math.abs(currentPosition.x) < absValues.toX ||
//     Math.abs(currentPosition.y) < absValues.toY;

//   ) {
//     currentPosition.x =
//       Math.abs(currentPosition.x + dash) < absValues.toX
//         ? currentPosition.x + dash
//         : toX;
//     currentPosition.y =
//       Math.abs(currentPosition.y + dash) < absValues.toY
//         ? currentPosition.y + dash
//         : toY;

//     this.lineTo(currentPosition.x, currentPosition.y);

//     currentPosition.x =
//       Math.abs(currentPosition.x + gap) < absValues.toX
//         ? currentPosition.x + gap
//         : toX;
//     currentPosition.y =
//       Math.abs(currentPosition.y + gap) < absValues.toY
//         ? currentPosition.y + gap
//         : toY;

//     this.moveTo(currentPosition.x, currentPosition.y);
//   }
// };

const PRIMARY_COLOR = 0xda6c35;
const STORM_LINK_COLOR = 0xd3c47c;

const gradient = new FillGradient({
  end: { x: 1, y: 0 },
  colorStops: [
    { color: STORM_LINK_COLOR, offset: 0 }, // Red at start
    { color: PRIMARY_COLOR, offset: 1 }, // Blue at end
  ],
});

const STORM_NODES = [
  { begin: "1999", destination: "1996" },
  { begin: "1997", destination: "1985" },
  { begin: "1987", destination: "1977" },
  { begin: "1978", destination: "1930" },
  { begin: "1940", destination: "1912" },
  { begin: "1913", destination: "1966" },
  { begin: "1966", destination: "1929" },
];

const PERIODS = [
  { from: "1996", to: "1997" },
  { from: "1985", to: "1987" },
  { from: "1977", to: "1978" },
  { from: "1930", to: "1940" },
  { from: "1912", to: "1913" },
  { from: "1966", to: "1966" },
];

const TIMELINE_BEGIN_YEAR = 1900;
const TIMELINE_END_YEAR = 2000;

const TIMELINE_TICK = 12;

const WORLD_OFFSET = 20;
const STORM_LINK_OFFSET_Y = 10;

const WORLD_WIDTH =
  (TIMELINE_END_YEAR - TIMELINE_BEGIN_YEAR + 1) * TIMELINE_TICK +
  WORLD_OFFSET * 2;
const WORLD_HEIGHT = 2000;

const calcXPos = (year: number) => {
  return (year - TIMELINE_BEGIN_YEAR) * TIMELINE_TICK + WORLD_OFFSET;
};

export default () => ({
  async init() {
    const timelineElement = document.body.querySelector(
      "#timeline"
    ) as HTMLElement;

    if (!timelineElement) return;

    // Create a new application
    const app = new Application();

    // Initialize the application
    await app.init({
      resizeTo: timelineElement,
      backgroundColor: 0x000000,
    });

    // Append the application canvas to the document body
    timelineElement.appendChild(app.canvas);

    // create viewport
    const viewport = new Viewport({
      screenHeight: app.screen.height,
      screenWidth: app.screen.width,
      worldWidth: WORLD_WIDTH,
      worldHeight: WORLD_HEIGHT,
      events: app.renderer.events, // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
    });

    // add the viewport to the stage
    app.stage.addChild(viewport);

    // activate plugins
    viewport.drag().pinch().wheel().decelerate();

    const heightCenter = app.screen.height / 2;

    let line = new Graphics()
      .moveTo(WORLD_OFFSET, heightCenter)
      .lineTo(WORLD_WIDTH - WORLD_OFFSET, heightCenter)
      .stroke({ color: PRIMARY_COLOR, pixelLine: true });

    viewport.addChild(line);

    STORM_NODES.forEach((node, nodeIdx) => {
      const nodeBeginMonth = dayjs(node.begin).get("month");
      const beginPosX = calcXPos(dayjs(node.begin).get("year"));
      let circle = new Graphics().circle(beginPosX, heightCenter, 4).fill({
        color: PRIMARY_COLOR,
      });

      viewport.addChild(circle);

      const destinationPosX = calcXPos(dayjs(node.destination).get("year"));

      const stormLink = new Graphics()
        .moveTo(beginPosX, heightCenter)
        .lineTo(
          beginPosX,
          heightCenter +
            (nodeIdx % 2 === 0 ? 1 : -1) * STORM_LINK_OFFSET_Y * (nodeIdx + 1)
        )
        .lineTo(
          destinationPosX,
          heightCenter +
            (nodeIdx % 2 === 0 ? 1 : -1) * STORM_LINK_OFFSET_Y * (nodeIdx + 1)
        )
        .lineTo(destinationPosX, heightCenter)
        .stroke({ fill: gradient, pixelLine: true });

      viewport.addChild(stormLink);
    });

    //viewport.moveCenter(WORLD_WIDTH / 2, heightCenter / 2);
  },
});
