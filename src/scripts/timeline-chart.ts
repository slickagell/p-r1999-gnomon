import * as d3 from "d3";
import dayjs from "dayjs";

const MARGIN = { TOP: 16, RIGHT: 32, BOTTOM: 32, LEFT: 32 };
const CHART_BOX_WIDTH = 1200;
const CHART_BOX_HEIGHT = 600;
const CHART_WIDTH = CHART_BOX_WIDTH - MARGIN.LEFT - MARGIN.RIGHT;
const CHART_HEIGHT = CHART_BOX_HEIGHT - MARGIN.TOP - MARGIN.BOTTOM;

const MARKER_BOX_WIDTH = 8;
const MARKER_BOX_HEIGHT = 8;
const REF_X = MARKER_BOX_WIDTH / 2;
const REF_Y = MARKER_BOX_HEIGHT / 2;
const MARKER_WIDTH = MARKER_BOX_WIDTH / 2;
const MARKER_HEIGHT = MARKER_BOX_HEIGHT / 2;
const ARROW_POINTS: [number, number][] = [
  [0, 0],
  [0, 8],
  [8, 4],
];

const CIRCLE_RADIUS = 2;
const MAX_CIRCLE_RADIUS = 8;
const PERIOD_HEIGHT = 2;
const MAX_PERIOD_HEIGHT = 8;

const TRANSITION_DURATION_TIME = 300;

const PERIOD_COLOR = "#EBE0D5";
const MAIN_STORY_EVENT_COLOR = "#873a4b";
const EVENT_EVENT_COLOR = "#d3c47c";
const CHARACTER_STORY_EVENT_COLOR = "#623583";
const ANECDOTE_EVENT_COLOR = "#617594";

const EVENTS_Y_GAP = 12;
const STORM_LINK_GAP = 10;

const STORM_TEXT_FONT_SIZE_REM = 1;

const STORM_NODE_DATA = [
  {
    id: "storm_1",
    jump: ["1999", "1996"],
    jumpText: ["1999", "1996"],
  },
  {
    id: "storm_2",
    jump: ["1997", "1985"],
    jumpText: ["1997", "1985"],
  },
  {
    id: "storm_3",
    jump: ["1987", "1977"],
    jumpText: ["1987", "1977"],
  },
  {
    id: "storm_4",
    jump: ["1978", "1933"],
    jumpText: ["1978", "193X"],
  },
  {
    id: "storm_5",
    jump: ["1937", "1912"],
    jumpText: ["193X", "1912"],
  },
  {
    id: "storm_6",
    jump: ["1913", "1966"],
    jumpText: ["1913", "1966"],
  },
  {
    id: "storm_7",
    jump: ["1966", "1929"],
    jumpText: ["1966", "1929"],
  },
  {
    id: "storm_8",
    jump: ["1929", "1913"],
    jumpText: ["1929", "1913"],
  },
  {
    id: "storm_9",
    jump: ["1914", "1990"],
    jumpText: ["1914", "1990"],
  },
];

const PERIOD_EVENT_DATA = [
  {
    period: [1996, 1997],
    periodText: ["1996", "1997"],
    href: "#period-1996---1997",
    events: [
      {
        year: [1996],
        label: "1.8 - Farewell Rayashki",
        type: "event-story",
      },
      {
        year: [1996],
        label: "Beginning of chapter 3",
        type: "main-story",
      },
    ],
  },
  {
    period: [1985, 1987],
    periodText: ["1985", "1987"],
    href: "#period-1985---1987",
    events: [
      {
        year: [1985],
        label: "Vila's character story: Dawn Arrives As Usual",
        type: "character-story",
      },
      {
        year: [1985],
        label: "Windsong's character story: Silver Knot (present time)",
        type: "character-story",
      },
      {
        year: [1986],
        label: "Zeno's anecdote",
        type: "anecdote",
      },
      {
        year: [1986],
        label: "Middle of chapter 5",
        type: "main-story",
      },
      {
        year: [1987],
        label: "2.7 - 1987 Cosmic Overtune",
        type: "event-story",
      },
      {
        year: [1987],
        label: "Chapter 3",
        type: "main-story",
      },
      {
        year: [1987],
        label: "6's character story",
        type: "character-story",
      },
    ],
  },
  {
    period: [1977, 1978],
    periodText: ["1977", "1978"],
    href: "#period-1977---1978",
    events: [
      {
        year: [1977],
        label: "Mesmer's anecdote",
        type: "anecdote",
      },
    ],
  },
  {
    period: [1933, 1937],
    periodText: ["193X", "193X"],
    href: "#period-193x---194x",
    events: [
      {
        year: [1935],
        label: "2.3 - Chronicles of Uluru: London Dawning",
        type: "event-story",
      },
    ],
  },
  {
    period: [1912, 1913],
    periodText: ["1912", "1913"],
    href: "#period-1912---1913",
    events: [
      {
        year: [1912],
        label: "Marcus's character story",
        type: "character-story",
      },
      {
        year: [1912],
        label: "Eagle's anecdote",
        type: "anecdote",
      },
    ],
  },
  {
    period: [1966],
    periodText: ["1966"],
    href: "#year-1966",
    events: [
      {
        year: [1966],
        label: "1.1 - The Theft of the Rimet Cup",
        type: "event-story",
      },
      {
        year: [1966],
        label: "1.3 - Journey to Mor Pankh",
        type: "event-story",
      },
    ],
  },
  {
    period: [1929],
    periodText: ["1929"],
    href: "#year-1929",
    events: [
      {
        year: [1929],
        label: "Chapter Prologue",
        type: "main-story",
      },
      {
        year: [1929],
        label: "Chapter 1",
        type: "main-story",
      },
      {
        year: [1929],
        label: "Chapter 2",
        type: "main-story",
      },
    ],
  },
  {
    period: [1913, 1914],
    periodText: ["1913", "1914"],
    href: "#period-1913---1914",
    events: [
      {
        year: [1913],
        label: "Chapter 3",
        type: "main-story",
      },
      {
        year: [1913],
        label: "Chapter 4",
        type: "main-story",
      },
      {
        year: [1914],
        label: "Beginning of chapter 5",
        type: "main-story",
      },
      {
        year: [1914],
        label: "Digger's anecdote",
        type: "anecdote",
      },
      {
        year: [1914],
        label: "Semmelweis: Echoes in the Mountain",
        type: "event-story",
      },
      {
        year: [1914],
        label: "Chapter 6",
        type: "main-story",
      },
      {
        year: [1914],
        label: "Chapter 7",
        type: "main-story",
      },
      {
        year: [1914],
        label: "Semmelweis: A Series of Dusks",
        type: "event-story",
      },
    ],
  },
  {
    period: [1990, "1991-03-22"],
    periodText: ["1990", "1991"],
    href: "#year-1990",
    events: [
      {
        year: ["1990-09"],
        label: "1.2 - A Nightmare at Green Lake",
        type: "event-story",
      },
      {
        year: ["1990-09"],
        label: "2.0 - Floor It! To the Golden City",
        type: "event-story",
      },
      {
        year: ["1990-10"],
        label: "2.1 - Route 77: The Haunted Highway",
        type: "event-story",
      },
      {
        year: ["1990-11"],
        label: "Chapter 8",
        type: "main-story",
      },
      {
        year: ["1991-01"],
        label: "1.5 - Revival! The Uluru Games",
        type: "event-story",
      },
      {
        year: ["1991-01"],
        label: "2.5 - Showdown in Chinatown",
        type: "event-story",
      },
      {
        year: ["1991-01"],
        label: "37's anecdote",
        type: "anecdote",
      },
      {
        year: ["1991-02"],
        label: "2.4 - Last Evenings on Earth",
        type: "event-story",
      },
      {
        year: ["1991-03"],
        label: "Blonney's anecdote",
        type: "anecdote",
      },
      {
        year: ["1991-03"],
        label: "Semmelweis's anecdote",
        type: "anecdote",
      },
      {
        year: ["1991-03-22"],
        label: "Chapter 9",
        type: "main-story",
      },
    ],
  },
];

const STORM_EVENT_Y_COORDINATE = CHART_HEIGHT / 3;
const EVENT_Y_COORDINATE = STORM_EVENT_Y_COORDINATE + 50;

const parseDayJsFromString = (date: string | number) => {
  const [year, month, day] = date.toString().split("-");
  if (!month) {
    if (!day) return dayjs(`${year}-01-01`);
    return dayjs(`${year}-01-${day}`);
  }
  if (!day) return dayjs(`${year}-${month}-01`);
  return dayjs(date);
};

const parseDate = (date: string | number) => {
  return parseDayJsFromString(date).toDate();
};

export default () => ({
  chartMargin: MARGIN,
  chartWidth: CHART_WIDTH,
  chartHeight: CHART_HEIGHT,

  markerBoxWidth: MARKER_BOX_WIDTH,
  markerBoxHeight: MARKER_BOX_HEIGHT,
  refX: REF_X,
  refY: REF_Y,
  markerWidth: MARKER_WIDTH,
  markerHeight: MARKER_HEIGHT,
  arrowPoints: ARROW_POINTS,
  circleRadius: CIRCLE_RADIUS,

  chart: null,

  scale: 1,

  xLine: null,
  yLine: null,
  xAxis: null,
  yAxis: null,

  stormNodes: null,
  periods: null,
  periodZone: null,
  arrows: null,
  eventNodes: null,

  svg: null,
  zoom: null,

  isShow: {
    stormLink: true,
    period: true,
    stormNode: true,
    mainStoryNode: true,
    eventStoryNode: true,
    characterStoryNode: true,
    anecdoteNode: true,
    eventNodeGap: true,
  },

  init() {
    document.querySelector("#timeline")?.addEventListener(
      "wheel",
      (e) => {
        e.preventDefault();
      },
      { passive: false }
    );

    const { oldestPeriodYear, latestPeriodYear } = PERIOD_EVENT_DATA.reduce(
      (prev, stormEventData) => {
        if (
          parseDayJsFromString(stormEventData.period[0]).diff(
            parseDayJsFromString(prev.oldestPeriodYear),
            "year"
          ) < 0
        ) {
          prev.oldestPeriodYear = stormEventData.period[0].toString();
        }
        if (
          parseDayJsFromString(
            stormEventData.period[stormEventData.period.length - 1]
          ).diff(parseDayJsFromString(prev.latestPeriodYear), "year") > 0
        ) {
          prev.latestPeriodYear =
            stormEventData.period[stormEventData.period.length - 1].toString();
        }
        return prev;
      },
      {
        oldestPeriodYear: "1999",
        latestPeriodYear: "1999",
      }
    );

    const { oldestYear, latestYear } = STORM_NODE_DATA.reduce(
      (prev, stormEventData) => {
        if (
          parseDayJsFromString(stormEventData.jump[0]).diff(
            parseDayJsFromString(prev.oldestYear),
            "year"
          ) < 0
        ) {
          prev.oldestYear = stormEventData.jump[0].toString();
        }
        if (
          parseDayJsFromString(
            stormEventData.jump[stormEventData.jump.length - 1]
          ).diff(parseDayJsFromString(prev.latestYear), "year") > 0
        ) {
          prev.latestYear =
            stormEventData.jump[stormEventData.jump.length - 1].toString();
        }
        return prev;
      },
      {
        oldestYear: oldestPeriodYear,
        latestYear: latestPeriodYear,
      }
    );

    // Add X axis
    this.xLine = d3
      .scaleTime()
      .domain([
        parseDayJsFromString(oldestYear).subtract(5, "year").toDate(),
        parseDayJsFromString(latestYear).add(5, "year").toDate(),
      ])
      .range([this.chartMargin.LEFT, CHART_BOX_WIDTH - this.chartMargin.RIGHT]);

    this.yLine = d3
      .scaleLinear()
      .domain([0, this.chartHeight])
      .range([
        this.chartMargin.TOP,
        CHART_BOX_HEIGHT - this.chartMargin.BOTTOM,
      ]);

    // create svg element

    // Create a scrolling div containing the area shape and the horizontal axis.
    const body = d3.select("#timeline").append("div").attr("class", "relative");

    this.svg = body
      .append("svg")
      .attr("viewBox", [0, 0, CHART_BOX_WIDTH, CHART_BOX_HEIGHT])
      .style("display", "block");

    this.xAxis = this.svg
      .append("g")
      .attr(
        "transform",
        "translate(" +
          0 +
          "," +
          (CHART_BOX_HEIGHT - this.chartMargin.BOTTOM) +
          ")"
      )
      .call(d3.axisBottom(this.xLine));

    // this.yAxis = this.svg
    //   .append("g")
    //   .attr("transform", "translate(" + this.chartMargin.LEFT + "," + 0 + ")")
    //   .call(d3.axisLeft(this.yLine));

    // Set the zoom and Pan features: how much you can zoom, on which part, and what to do when there is a zoom
    this.zoom = d3
      .zoom()
      .scaleExtent([1, 100]) // This control how much you can unzoom and zoom
      .extent([
        [this.chartMargin.LEFT, 0],
        [this.chartWidth - this.chartMargin.RIGHT, this.chartHeight],
      ])
      .translateExtent([
        [this.chartMargin.LEFT, -Infinity],
        [this.chartWidth - this.chartMargin.RIGHT, Infinity],
      ])
      .on("zoom", (event) => this.updateChart(event));

    // This add an invisible rect on top of the chart area. This rect can recover pointer events: necessary to understand when the user zoom
    this.chart = this.svg
      .append("rect")
      .attr("width", CHART_BOX_WIDTH)
      .attr("height", CHART_BOX_HEIGHT)
      .style("fill", "none")
      .style("pointer-events", "all")
      .call(this.zoom);

    this.svg
      .append("defs")
      .append("clipPath")
      .attr("id", "chart-clip")
      .append("rect")
      .attr("width", this.chartWidth)
      .attr("height", this.chartHeight)
      .attr("x", this.chartMargin.LEFT)
      .attr("y", this.chartMargin.TOP);

    this.svg
      .append("defs")
      .append("marker")
      .attr("id", "arrow")
      .attr("class", "storm-link-marker")
      .attr("viewBox", [0, 0, this.markerBoxWidth, this.markerBoxHeight])
      .attr("refX", REF_X)
      .attr("refY", REF_Y)
      .attr("markerWidth", this.markerBoxWidth)
      .attr("markerHeight", this.markerBoxHeight)
      .attr("orient", "auto-start-reverse")
      .append("path")
      .attr("d", d3.line()(ARROW_POINTS));

    const stormNodes = STORM_NODE_DATA.map((event, idx) => {
      return event.jump.map((year, jumpIdx) => {
        return {
          id: event.id + "-" + year,
          year,
          text: event.jumpText[jumpIdx],
          x: this.xLine(parseDate(year)),
          y: this.yLine(STORM_EVENT_Y_COORDINATE),
          originY: this.yLine(STORM_EVENT_Y_COORDINATE),
          r: CIRCLE_RADIUS,
        };
      });
    });

    const stormLinks = stormNodes.reduce((prev, time, idx) => {
      const sourceX = time[0].x;
      const sourceY = time[0].y;
      const targetX = time[1].x;
      const targetY = time[1].y;
      const xDelta = Math.abs(targetX - sourceX);
      const yDelta = Math.abs(targetY - sourceY);

      return [
        ...prev,
        {
          title: `Storm ` + (idx + 1),
          source: {
            id: time[0].id,
            year: time[0].year,
            x: sourceX,
            y: sourceY,
            originY: time[0].originY,
          },
          target: {
            id: time[1].id,
            year: time[1].year,
            x: targetX,
            y: targetY,
            originY: time[1].originY,
          },
          arrowDirection: yDelta >= xDelta ? "V" : "H",
        },
      ];
    }, []);

    const periodTimes = PERIOD_EVENT_DATA.map((event, idx) => {
      return event.period.map((year, yearIdx) => {
        return {
          year,
          text: event.periodText[yearIdx],
          x: this.xLine(parseDate(year)),
          y: this.yLine(STORM_EVENT_Y_COORDINATE),
          originY: this.yLine(STORM_EVENT_Y_COORDINATE),
          h: PERIOD_HEIGHT,
          href: event.href,
        };
      });
    });

    const eventNodes = PERIOD_EVENT_DATA.map((event, idx) => {
      return (
        event.events?.map((event, eventIdx) => {
          return {
            year: event.year[0],
            x: this.xLine(parseDate(event.year[0])),
            y: this.yLine(EVENT_Y_COORDINATE),
            originY: this.yLine(EVENT_Y_COORDINATE),
            r: CIRCLE_RADIUS,
            label: event.label,
            type: event.type,
            epi: eventIdx, // event index per period
          };
        }) ?? []
      );
    });

    let tooltip = body
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .attr("class", "absolute border p-2 bg-base-100")
      .style("left", 0)
      .style("top", 0);

    this.arrows = this.svg
      .append("g")
      .attr("id", "storm-link-group")
      .selectAll(".storm-link-line")
      .data(stormLinks)
      .enter()
      .append("path")
      .attr("class", "storm-link-line");

    this.arrows
      .attr("id", (d, i) => `storm-link-${i + 1}`)
      .style("stroke-dasharray", "4 4")
      .attr("d", (d, i) => {
        return this.drawLinkCurve(d.source, d.target, i);
      })
      .attr("marker-end", "url(#arrow)");

    const stormLinkLabel = this.svg
      .append("g")
      .attr("id", "storm-link-label-group");

    this.arrows.each((d, i, nodes) => {
      const bbox = d3.select(nodes[i]).node().getBBox();
      const centreX = bbox.x + bbox.width / 2; // <-- get x centre
      const centreY = i % 2 !== 0 ? bbox.y + 4 : bbox.y + bbox.height + 4; // <-- get y centre

      stormLinkLabel
        .append("text")
        .attr("class", "storm-link-label")
        .attr("id", `storm-link-label-${i + 1}`)
        .text(d.title)
        .attr("x", centreX)
        .attr("y", centreY)
        .attr("text-anchor", "middle")
        .style("font-size", STORM_TEXT_FONT_SIZE_REM + "rem");
    });

    this.periods = this.svg
      .append("g")
      .attr("id", "period-group")
      .selectAll(".period")
      .data(periodTimes)
      .enter()
      .append("a")
      .attr("href", (d) => d[0].href)
      .append("rect")
      .attr("class", "period");

    this.periods
      .attr("x", (d) => d[0].x)
      .attr("y", (d) => d[0].y - PERIOD_HEIGHT / 2)
      .attr("width", (d) => d[d.length - 1].x - d[0].x)
      .attr("height", PERIOD_HEIGHT)
      .style("fill", PERIOD_COLOR)
      .style("opacity", 1)
      .on("mouseover", function (event, d, i) {
        d3.select(this)
          .transition()
          .duration(TRANSITION_DURATION_TIME)
          .style("opacity", 0.75);
        tooltip
          .transition()
          .duration(TRANSITION_DURATION_TIME)
          .style("opacity", 1);
        tooltip
          .html(`<p>Period: ${d[0].text} - ${d[d.length - 1].text}</p>`)
          .style("left", event.offsetX + "px")
          .style("top", event.offsetY + "px")
          .style("transform", "translate(-50%, calc(-100% - 16px))");
      })
      .on("mouseout", function (d) {
        d3.select(this)
          .transition()
          .duration(TRANSITION_DURATION_TIME)
          .style("opacity", 1);
        tooltip
          .transition()
          .duration(TRANSITION_DURATION_TIME)
          .style("opacity", 0);
        // tooltip.style("left", 0).style("top", 0);
      });

    const yOfXAxis = parseFloat(
      this.xAxis.attr("transform").split(/[\s,()]+/)[2]
    );

    this.periodZone = this.svg
      .append("g")
      .attr("id", "period-zone-group")
      .selectAll(".period-zone")
      .data(periodTimes)
      .enter()
      .append("rect")
      .attr("class", "period-zone")
      .attr("x", (d) => d[0].x)
      .attr("y", (d) => d[0].y)
      .style("fill-opacity", 0.1)
      .attr("width", (d) => d[d.length - 1].x - d[0].x)
      .attr("height", (d) => yOfXAxis - d[0].y);

    this.stormNodes = this.svg
      .append("g")
      .attr("id", "storm-node-group")
      .selectAll(".storm-node")
      .data(stormNodes.flat())
      .enter()
      .append("circle")
      .attr("class", "storm-node");

    this.stormNodes
      .attr("cx", (d, i) => d.x)
      .attr("cy", (d, i) => d.y)
      .attr("r", (d) => d.r)
      .on("mouseover", function (event, d, i) {
        d3.select(this)
          .transition()
          .duration(TRANSITION_DURATION_TIME)
          .attr("r", d.r * 1.5);

        tooltip
          .transition()
          .duration(TRANSITION_DURATION_TIME)
          .style("opacity", 1);
        tooltip
          .html(`<p>Year: ${d.text}</p>`)
          .style("left", event.offsetX + "px")
          .style("top", event.offsetY + "px")
          .style("transform", "translate(-50%, calc(-100% - 16px))");
      })
      .on("mouseout", function (_, d) {
        d3.select(this)
          .transition()
          .duration(TRANSITION_DURATION_TIME)
          .attr("r", d.r);
        tooltip
          .transition()
          .duration(TRANSITION_DURATION_TIME)
          .style("opacity", 0);
      });

    this.eventNodes = this.svg
      .append("g")
      .attr("id", "story-node-group")
      .selectAll(".story-node")
      .data(eventNodes.flat())
      .enter()
      .append("circle")
      .attr("class", "story-node");

    this.eventNodes
      .attr("cx", (d, i) => d.x)
      .attr("cy", (d, i) => d.y + d.epi * EVENTS_Y_GAP - 4)
      .attr("r", (d) => d.r)
      .attr("data-type", (d) => d.type)
      .attr("data-epi", (d) => d.epi)
      .style("fill", (d) => {
        switch (d.type) {
          case "event-story":
            return EVENT_EVENT_COLOR;
          case "character-story":
            return CHARACTER_STORY_EVENT_COLOR;
          case "anecdote":
            return ANECDOTE_EVENT_COLOR;
          default:
            return MAIN_STORY_EVENT_COLOR;
        }
      })
      .on("mouseover", function (event, d, i) {
        d3.select(this)
          .transition()
          .duration(TRANSITION_DURATION_TIME)
          .attr("r", d.r * 1.5);

        tooltip
          .transition()
          .duration(TRANSITION_DURATION_TIME)
          .style("opacity", 1);
        tooltip
          .html(`<p>${d.label}</p>`)
          .style("left", event.offsetX + "px")
          .style("top", event.offsetY + "px")
          .style("transform", "translate(-50%, calc(-100% - 16px))");
      })
      .on("mouseout", function (_, d) {
        d3.select(this)
          .transition()
          .duration(TRANSITION_DURATION_TIME)
          .attr("r", d.r);
        tooltip
          .transition()
          .duration(TRANSITION_DURATION_TIME)
          .style("opacity", 0);
      });
  },

  drawLinkCurve(source: { x; y }, target: { x; y }, index = 0, scale = 1) {
    // const reversedX = d.source.x < d.target.x ? 1 : -1;
    // d.source.x += CIRCLE_RADIUS * reversedX;
    // d.target.x -= (CIRCLE_RADIUS + MARKER_WIDTH) * reversedX;
    const reversedY = source.y > target.y ? 1 : -1;
    const reversedIndex = index % 2 === 0 ? -1 : 1;
    source.y += CIRCLE_RADIUS * reversedY * reversedIndex;
    target.y += (CIRCLE_RADIUS + MARKER_WIDTH) * reversedY * reversedIndex;

    const context = d3.path();
    context.moveTo(source.x, source.y);
    context.lineTo(
      source.x,
      target.y +
        (index % 2 === 0 ? 1 : -1) * STORM_LINK_GAP * scale * (index + 1)
    );
    context.lineTo(
      target.x,
      target.y +
        (index % 2 === 0 ? 1 : -1) * STORM_LINK_GAP * scale * (index + 1)
    );
    context.lineTo(target.x, target.y);
    return context + "";
  },

  filterZoom(event) {
    return event.ctrlKey && event.type === "wheel" && !event.button;
  },

  updateChart(event) {
    // recover the new scale
    let newX = event.transform.rescaleX(this.xLine);
    let newY = event.transform.rescaleY(this.yLine);

    // update axes with these new boundaries
    this.xAxis.call(d3.axisBottom(newX));
    //this.yAxis.call(d3.axisLeft(newY));

    this.stormNodes
      .attr("cx", function (d) {
        return newX(parseDate(d.year));
      })
      .attr("cy", function (d) {
        return newY(d.originY);
      })
      .attr("r", function (d) {
        d.r = Math.min(CIRCLE_RADIUS * event.transform.k, MAX_CIRCLE_RADIUS);
        return d.r;
      });

    this.eventNodes
      .attr("r", function (d) {
        d.r = Math.min(CIRCLE_RADIUS * event.transform.k, MAX_CIRCLE_RADIUS);
        return d.r;
      })
      .attr("cx", function (d) {
        return newX(parseDate(d.year));
      })
      .attr("cy", function (d) {
        d.y = newY(d.originY) + d.epi * EVENTS_Y_GAP * event.transform.k;
        return d.y;
      });

    this.periods
      .attr("height", function (d) {
        d.h = Math.min(PERIOD_HEIGHT * event.transform.k, MAX_PERIOD_HEIGHT);
        return d.h;
      })
      .attr("x", function (d) {
        d.x = newX(parseDate(d[0].year));
        return d.x;
      })
      .attr("y", function (d) {
        d.y = newY(d[0].originY) - d.h / 2;
        return d.y;
      })
      .attr("width", function (d) {
        return (
          newX(parseDate(d[d.length - 1].year)) - newX(parseDate(d[0].year))
        );
      });

    this.periodZone
      .attr("x", function (d) {
        return newX(parseDate(d[0].year));
      })
      .attr("y", function (d) {
        d.y = newY(d[0].originY);
        return d.y;
      })
      .attr("width", function (d) {
        return (
          newX(parseDate(d[d.length - 1].year)) - newX(parseDate(d[0].year))
        );
      })
      .attr(
        "height",
        (d) =>
          parseFloat(this.xAxis.attr("transform").split(/[\s,()]+/)[2]) - d.y
      );

    this.arrows.attr("d", (d, i) => {
      d.source.x = newX(parseDate(d.source.year));
      d.target.x = newX(parseDate(d.target.year));
      d.source.y = newY(d.source.originY);
      d.target.y = newY(d.target.originY);
      return this.drawLinkCurve(d.source, d.target, i, event.transform.k);
    });

    this.arrows.each((d, i, nodes) => {
      const bbox = d3.select(nodes[i]).node().getBBox();
      const centreX = bbox.x + bbox.width / 2; // <-- get x centre
      const centreY = i % 2 !== 0 ? bbox.y + 4 : bbox.y + bbox.height + 4; // <-- get y centre

      this.svg
        .select(`#storm-link-label-${i + 1}`)
        .attr("x", centreX)
        .attr("y", centreY)
        .style(
          "font-size",
          Math.min(STORM_TEXT_FONT_SIZE_REM * event.transform.k, 1.5) + "rem"
        );
    });

    this.scale = event.transform.k;
  },

  toggleShowStormLink() {
    this.isShow.stormLink = !this.isShow.stormLink;

    if (this.isShow.stormLink) {
      this.arrows.style("opacity", 1);
      this.arrows.each((d, i, nodes) => {
        this.svg.select(`#storm-link-label-${i + 1}`).style("opacity", 1);
      });
    } else {
      this.arrows.style("opacity", 0);
      this.arrows.each((d, i, nodes) => {
        this.svg.select(`#storm-link-label-${i + 1}`).style("opacity", 0);
      });
    }
  },

  toggleShowStormNode() {
    this.isShow.stormNode = !this.isShow.stormNode;

    if (this.isShow.stormNode) {
      this.stormNodes.style("opacity", 1);
    } else {
      this.stormNodes.style("opacity", 0);
    }
  },

  toggleShowPeriod() {
    this.isShow.period = !this.isShow.period;

    if (this.isShow.period) {
      this.periods.style("opacity", 1);
      this.periodZone.style("opacity", 1);
    } else {
      this.periods.style("opacity", 0);
      this.periodZone.style("opacity", 0);
    }
  },

  toggleShowMainStoryNode() {
    this.isShow.mainStoryNode = !this.isShow.mainStoryNode;

    if (this.isShow.mainStoryNode) {
      this.svg.selectAll('[data-type="main-story"]').style("opacity", 1);
    } else {
      this.svg.selectAll('[data-type="main-story"]').style("opacity", 0);
    }
  },

  toggleShowEventStoryNode() {
    this.isShow.eventStoryNode = !this.isShow.eventStoryNode;

    if (this.isShow.eventStoryNode) {
      this.svg.selectAll('[data-type="event-story"]').style("opacity", 1);
    } else {
      this.svg.selectAll('[data-type="event-story"]').style("opacity", 0);
    }
  },

  toggleShowCharacterStoryNode() {
    this.isShow.characterStoryNode = !this.isShow.characterStoryNode;

    if (this.isShow.characterStoryNode) {
      this.svg.selectAll('[data-type="character-story"]').style("opacity", 1);
    } else {
      this.svg.selectAll('[data-type="character-story"]').style("opacity", 0);
    }
  },

  toggleShowAnecdoteNode() {
    this.isShow.anecdoteNode = !this.isShow.anecdoteNode;

    if (this.isShow.anecdoteNode) {
      this.svg.selectAll('[data-type="anecdote"]').style("opacity", 1);
    } else {
      this.svg.selectAll('[data-type="anecdote"]').style("opacity", 0);
    }
  },

  toggleShowEventNodeGap() {
    this.isShow.eventNodeGap = !this.isShow.eventNodeGap;

    if (this.isShow.eventNodeGap) {
      this.eventNodes.attr(
        "cy",
        (d) => d.y + d.epi * EVENTS_Y_GAP * this.scale
      );
    } else {
      this.eventNodes.attr("cy", (d) => d.y);
    }
  },
});
