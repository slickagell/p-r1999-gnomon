import {
  Application,
  Assets,
  BitmapText,
  Circle,
  Container,
  FillGradient,
  Graphics,
  GraphicsPath,
  Sprite,
  Text,
} from "pixi.js";
import { extensions, CullerPlugin } from "pixi.js";
import { Viewport } from "pixi-viewport";
import dayjs from "dayjs";
import dayOfYear from "dayjs/plugin/dayOfYear"; // ES 2015

dayjs.extend(dayOfYear);
extensions.add(CullerPlugin);

const BACKGROUND_COLOR = 0x000000;
const PRIMARY_COLOR = 0xda6c35;
const PRIMARY_CONTENT_COLOR = 0xd0ac81;
const STORM_LINK_COLOR = 0xd3c47c;

const gradient = new FillGradient({
  end: { x: 1, y: 0 },
  colorStops: [
    { color: PRIMARY_CONTENT_COLOR, offset: 0 },
    { color: PRIMARY_COLOR, offset: 1 },
  ],
});

const gradientReverse = new FillGradient({
  end: { x: 1, y: 0 },
  colorStops: [
    { color: PRIMARY_COLOR, offset: 0 },
    { color: PRIMARY_CONTENT_COLOR, offset: 1 },
  ],
});

const STORM_NODE_TEXT_FONTSIZE = 12;
const STORM_INFO_FONTSIZE = 12;

const STORM_NODES = [
  {
    begin: "1999",
    destination: "1996",
    beginText: "1999",
    destinationText: "1996",
  },
  {
    begin: "1997",
    destination: "1985",
    beginText: "1997",
    destinationText: "1985",
  },
  {
    begin: "1987",
    destination: "1977",
    beginText: "1987",
    destinationText: "1977",
  },
  {
    begin: "1978",
    destination: "1930",
    beginText: "1978",
    destinationText: "193x",
  },
  {
    begin: "1939",
    destination: "1912",
    beginText: "193x",
    destinationText: "1912",
  },
  {
    begin: "1913",
    destination: "1966-01",
    beginText: "1913",
    destinationText: "1966-01",
  },
  {
    begin: "1966-06",
    destination: "1929",
    beginText: "1966-06",
    destinationText: "1929",
  },
  {
    begin: "1929",
    destination: "1913-08",
    beginText: "1929",
    destinationText: "1913-08",
  },
  {
    begin: "1914",
    destination: "1990",
    beginText: "1914",
    destinationText: "1990",
  },
];

const PERIODS = [
  { from: "1996", to: "1997" },
  { from: "1985", to: "1987" },
  { from: "1977", to: "1978" },
  { from: "1930", to: "1939" },
  { from: "1912", to: "1913" },
  { from: "1966-01", to: "1966-06" },
  { from: "1929", to: "1929" },
  { from: "1913-08", to: "1914" },
  { from: "1990", to: "1991" },
];

const TIMELINE_BEGIN_YEAR = 1900;
const TIMELINE_END_YEAR = 2000;

const TIMELINE_TICK = 24;

const WORLD_OFFSET_X = 20;
const WORLD_OFFSET_Y = 100;
const STORM_LINK_OFFSET_Y = 10;
const STORM_NODE_TEXT_OFFSET_X = 8;
const STORM_NODE_TEXT_OFFSET_Y = 42;

const WORLD_WIDTH =
  (TIMELINE_END_YEAR - TIMELINE_BEGIN_YEAR + 1) * TIMELINE_TICK +
  WORLD_OFFSET_X * 2;
const WORLD_HEIGHT =
  STORM_NODES.length * STORM_LINK_OFFSET_Y + WORLD_OFFSET_Y * 2;
const PERIOD_RECT_HEIGHT = 4;

const calcXPos = (time: string) => {
  const year = dayjs(time).get("year");
  const month = dayjs(time).get("month");

  return (year - TIMELINE_BEGIN_YEAR) * TIMELINE_TICK + month + WORLD_OFFSET_X;
};

export default () => ({
  async init() {
    const timelineElement = document.body.querySelector(
      "#timeline"
    ) as HTMLElement;

    if (!timelineElement) return;

    timelineElement.addEventListener(
      "wheel",
      (e) => {
        e.preventDefault();
      },
      { passive: false }
    );

    timelineElement.addEventListener("gesturestart", (e) => e.preventDefault());
    timelineElement.addEventListener("gesturechange", (e) =>
      e.preventDefault()
    );
    timelineElement.addEventListener("gestureend", (e) => e.preventDefault());

    // Create a new application
    const app = new Application();

    // Initialize the application
    await app.init({
      resizeTo: timelineElement,
      backgroundColor: BACKGROUND_COLOR,
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

    viewport.cullable = true;
    viewport.cullableChildren = true;

    // add the viewport to the stage
    app.stage.addChild(viewport);

    // activate plugins
    viewport.drag().pinch().wheel().decelerate();

    const heightCenter = WORLD_HEIGHT / 2;

    let line = new Graphics()
      .moveTo(WORLD_OFFSET_X, heightCenter)
      .lineTo(WORLD_WIDTH - WORLD_OFFSET_X, heightCenter)
      .stroke({ color: PRIMARY_COLOR, pixelLine: true });

    viewport.addChild(line);

    const stormInfo = new BitmapText({
      text: "",
      style: {
        fontSize: STORM_INFO_FONTSIZE,
        fill: "#ffffff",
        align: "center",
      },
    });

    const stormNodesData = STORM_NODES.reduce(
      (prev, node, nodeIdx) => {
        const evenOrOdd = nodeIdx % 2 === 0 ? 1 : -1;

        //* Begin storm node
        const beginPosX = calcXPos(node.begin);
        let beginCircle = new Graphics()
          .circle(beginPosX, heightCenter, 4)
          .fill({
            color: PRIMARY_COLOR,
          });

        const beginText = new BitmapText({
          text: node.beginText,
          style: {
            fontSize: STORM_NODE_TEXT_FONTSIZE,
            fill: "#ffffff",
            align: "center",
          },
          x: beginPosX + STORM_NODE_TEXT_OFFSET_X,
          y: heightCenter,
        });

        beginText.y +=
          evenOrOdd *
          (STORM_LINK_OFFSET_Y * (nodeIdx + 1) + STORM_NODE_TEXT_OFFSET_Y);
        beginText.alpha = 0;

        const beginTextLine = new Graphics()
          .moveTo(beginPosX, heightCenter)
          .lineTo(beginPosX, beginText.y)
          .stroke({ color: PRIMARY_COLOR, pixelLine: true });
        beginTextLine.alpha = 0;

        //* Destination storm node
        const destinationPosX = calcXPos(node.destination);

        let destinationCircle = new Graphics()
          .circle(destinationPosX, heightCenter, 4)
          .fill({
            color: PRIMARY_CONTENT_COLOR,
          });

        const destinationText = new BitmapText({
          text: node.destinationText,
          style: {
            fontSize: STORM_NODE_TEXT_FONTSIZE,
            fill: "#ffffff",
            align: "center",
          },

          x: destinationPosX,
          y: heightCenter,
        });

        const destinationTextSize = destinationText.getSize();

        destinationText.x -=
          destinationTextSize.width + STORM_NODE_TEXT_OFFSET_X;
        destinationText.y +=
          evenOrOdd *
          (STORM_LINK_OFFSET_Y * (nodeIdx + 1) + STORM_NODE_TEXT_OFFSET_Y);
        destinationText.alpha = 0;

        const destinationTextLine = new Graphics()
          .moveTo(destinationPosX, heightCenter)
          .lineTo(destinationPosX, destinationText.y)
          .stroke({ color: PRIMARY_CONTENT_COLOR, pixelLine: true });
        destinationTextLine.alpha = 0;

        //* Storm link
        const stormLink = new Graphics()
          .moveTo(beginPosX, heightCenter)
          .lineTo(
            beginPosX,
            heightCenter + evenOrOdd * STORM_LINK_OFFSET_Y * (nodeIdx + 1)
          )
          .lineTo(
            destinationPosX,
            heightCenter + evenOrOdd * STORM_LINK_OFFSET_Y * (nodeIdx + 1)
          )
          .lineTo(destinationPosX, heightCenter)
          .stroke({
            fill: beginPosX < destinationPosX ? gradientReverse : gradient,
            pixelLine: true,
          });

        //* Interactions
        const showNodesInfo = () => {
          beginText.alpha = 1;
          beginTextLine.alpha = 1;
          destinationText.alpha = 1;
          destinationTextLine.alpha = 1;
          const { x: viewportX, y: viewportY } = viewport.getVisibleBounds();
          stormInfo.style.fontSize =
            (stormInfo.style.fontSize * 1) / viewport.scaled;
          stormInfo.position = { x: viewportX + 10, y: viewportY + 10 };
          stormInfo.text = `Storm ${nodeIdx + 1}: ${node.beginText} >>> ${node.destinationText}`;
        };

        const hideNodesInfo = () => {
          beginText.alpha = 0;
          beginTextLine.alpha = 0;
          destinationText.alpha = 0;
          destinationTextLine.alpha = 0;
          stormInfo.style.fontSize = STORM_INFO_FONTSIZE;
          stormInfo.text = "";
        };

        beginCircle.eventMode = "static";
        destinationCircle.eventMode = "static";
        beginCircle.on("pointerover", showNodesInfo);
        beginCircle.on("pointerout", hideNodesInfo);

        destinationText.eventMode = "static";
        destinationCircle.on("pointerover", showNodesInfo);
        destinationCircle.on("pointerout", hideNodesInfo);

        stormLink.eventMode = "static";

        stormLink.on("pointerover", showNodesInfo);
        stormLink.on("pointerout", hideNodesInfo);

        return {
          beginCircles: [...prev.beginCircles, beginCircle],
          beginTexts: [...prev.beginTexts, beginText],
          beginTextLines: [...prev.beginTextLines, beginTextLine],
          destinationCircles: [...prev.destinationCircles, destinationCircle],
          destinationTexts: [...prev.destinationTexts, destinationText],
          destinationTextLines: [
            ...prev.destinationTextLines,
            destinationTextLine,
          ],
          stormLinks: [...prev.stormLinks, stormLink],
        };
      },
      {
        beginCircles: [],
        beginTexts: [],
        beginTextLines: [],
        destinationCircles: [],
        destinationTexts: [],
        destinationTextLines: [],
        stormLinks: [],
      }
    );

    const periodsData = PERIODS.reduce(
      (prev, period) => {
        const fromPosX = calcXPos(period.from);
        const toPosX = calcXPos(period.to);

        const periodData = new Graphics()
          .rect(
            fromPosX,
            heightCenter - PERIOD_RECT_HEIGHT / 2,
            toPosX - fromPosX,
            PERIOD_RECT_HEIGHT
          )
          .fill({ color: 0xebe0d5 });

        return {
          periods: [...prev.periods, periodData],
        };
      },
      {
        periods: [],
      }
    );

    //* Assigns
    const periodsGroup = new Container();
    periodsGroup.addChild(...periodsData.periods);
    viewport.addChild(periodsGroup);

    const stormLinksGroup = new Container();
    stormLinksGroup.addChild(...stormNodesData.stormLinks);
    viewport.addChild(stormLinksGroup);

    const stormNodeTextLines = new Container();
    stormNodeTextLines.addChild(...stormNodesData.beginTextLines);
    stormNodeTextLines.addChild(...stormNodesData.destinationTextLines);
    viewport.addChild(stormNodeTextLines);

    const stormNodeCircles = new Container();
    stormNodeCircles.addChild(...stormNodesData.destinationCircles);
    stormNodeCircles.addChild(...stormNodesData.beginCircles);
    viewport.addChild(stormNodeCircles);

    const stormNodeTexts = new Container();
    stormNodeTexts.addChild(...stormNodesData.beginTexts);
    stormNodeTexts.addChild(...stormNodesData.destinationTexts);
    viewport.addChild(stormNodeTexts);

    viewport.addChild(stormInfo);

    viewport.moveCenter(WORLD_WIDTH, heightCenter / 2);
  },
});
