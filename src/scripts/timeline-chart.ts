import * as d3 from "d3";
import dayjs from "dayjs";

const MARGIN = { TOP: 16, RIGHT: 32, BOTTOM: 32, LEFT: 32 };
const CHART_WIDTH = 1200 - MARGIN.LEFT - MARGIN.RIGHT;
const CHART_HEIGHT = 800 / 1.5 - MARGIN.TOP - MARGIN.BOTTOM;

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
const CIRCLE_RADIUS = 4;
const TRANSITION_DURATION_TIME = 300;

const STORM_COLOR = "#db6f39";

const MAIN_STORY_EVENT_COLOR = "#873a4b";
const EVENT_EVENT_COLOR = "#d3c47c";
const CHARACTER_STORY_EVENT_COLOR = "#623583";
const ANECDOTE_EVENT_COLOR = "#617594";

const EVENTS_Y_GAP = 12;

const STORM_EVENT_DATA = [
  {
    period: [1999],
    href: "#year-1999",
  },
  {
    period: [1996, 1997],
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
  xAxis: null,

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
    const { oldestYear, newestYear } = STORM_EVENT_DATA.reduce(
      (prev, stormEventData) => {
        if (
          parseDayJsFromString(stormEventData.period[0]).diff(
            parseDayJsFromString(prev.oldestYear),
            "year"
          ) < 0
        ) {
          prev.oldestYear = stormEventData.period[0].toString();
        }
        if (
          parseDayJsFromString(
            stormEventData.period[stormEventData.period.length - 1]
          ).diff(parseDayJsFromString(prev.newestYear), "year") > 0
        ) {
          prev.newestYear =
            stormEventData.period[stormEventData.period.length - 1].toString();
        }
        return prev;
      },
      {
        oldestYear: "1999",
        newestYear: "1999",
      }
    );

    // Add X axis
    this.xLine = d3
      .scaleTime()
      .domain([
        parseDayJsFromString(oldestYear).subtract(3, "year").toDate(),
        parseDayJsFromString(newestYear).add(3, "year").toDate(),
      ])
      .range([this.chartMargin.LEFT, this.chartWidth - this.chartMargin.RIGHT]);

    // create svg element

    // Create a scrolling div containing the area shape and the horizontal axis.
    const body = d3.select("#timeline").append("div").attr("class", "relative");

    this.svg = body
      .append("svg")
      .attr("viewBox", [0, 0, this.chartWidth, this.chartHeight])
      .style("display", "block");

    this.xAxis = this.svg
      .append("g")
      .attr(
        "transform",
        "translate(0," + (this.chartHeight - this.chartMargin.BOTTOM) + ")"
      )
      .call(d3.axisBottom(this.xLine));

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
      .attr("width", this.chartWidth)
      .attr("height", this.chartHeight)
      .style("fill", "none")
      .style("pointer-events", "all")
      .attr("transform", "translate(" + 0 + "," + this.chartMargin.TOP + ")")
      .call(this.zoom);

    this.svg
      .append("defs")
      .append("marker")
      .attr("id", "arrow")
      .attr("viewBox", [0, 0, this.markerBoxWidth, this.markerBoxHeight])
      .attr("refX", REF_X)
      .attr("refY", REF_Y)
      .attr("markerWidth", this.markerBoxWidth)
      .attr("markerHeight", this.markerBoxHeight)
      .attr("orient", "auto-start-reverse")
      .append("path")
      .attr("d", d3.line()(ARROW_POINTS))
      .attr("stroke", STORM_COLOR)
      .attr("fill", STORM_COLOR);

    const stormNodes = STORM_EVENT_DATA.map((event, idx) => {
      if (!STORM_EVENT_DATA[idx - 1]) {
        return event.period.map((year) => {
          return {
            year,
            x: this.xLine(parseDate(year)),
            y: STORM_EVENT_Y_COORDINATE,
            r: CIRCLE_RADIUS,
            href: event.href,
          };
        });
      }

      return event.period.map((year) => {
        return {
          year,
          x: this.xLine(parseDate(year)),
          y: STORM_EVENT_Y_COORDINATE,
          r: CIRCLE_RADIUS,
          href: event.href,
        };
      });
    });

    const stormLinks = stormNodes.reduce((prev, time, idx) => {
      if (idx === stormNodes.length - 1) {
        return prev;
      }
      const sourceX = time[time.length - 1].x;
      const sourceY = time[time.length - 1].y;
      const targetX = stormNodes[idx + 1][0].x;
      const targetY = stormNodes[idx + 1][0].y;
      const xDelta = Math.abs(targetX - time[0].x);
      const yDelta = Math.abs(targetY - time[0].y);

      return [
        ...prev,
        {
          title: `Storm ` + (idx + 1),
          source: {
            year: time[time.length - 1].year,
            x: sourceX,
            y: sourceY,
          },
          target: {
            year: stormNodes[idx + 1][0].year,
            x: targetX,
            y: targetY,
          },
          arrowDirection: yDelta >= xDelta ? "V" : "H",
        },
      ];
    }, []);

    const eventNodes = STORM_EVENT_DATA.map((event, idx) => {
      return (
        event.events?.map((event, eventIdx) => {
          return {
            year: event.year[0],
            x: this.xLine(parseDate(event.year[0])),
            y: EVENT_Y_COORDINATE,
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

    this.periods = this.svg
      .selectAll(".period")
      .data(stormNodes.filter((d) => d.length > 1))
      .enter()
      .append("a")
      .attr("href", (d) => d[0].href)
      .append("rect")
      .attr("class", "period cursor-pointer");

    this.periods
      .attr("x", (d) => d[0].x)
      .attr("y", (d) => d[0].y - CIRCLE_RADIUS / 2)
      .attr("width", (d) => d[d.length - 1].x - d[0].x)
      .attr("height", CIRCLE_RADIUS)
      .style("fill", "#bba893")
      .on("mouseover", function (event, d, i) {
        d3.select(this)
          .transition()
          .duration(TRANSITION_DURATION_TIME)
          .attr("height", CIRCLE_RADIUS * 1.5);
        tooltip
          .transition()
          .duration(TRANSITION_DURATION_TIME)
          .style("opacity", 1);
        tooltip
          .html(`<p>Period: ${d[0].year} - ${d[d.length - 1].year}</p>`)
          .style("left", event.offsetX + "px")
          .style("top", event.offsetY + "px")
          .style("transform", "translate(-50%, calc(-100% - 16px))");
      })
      .on("mouseout", function (d) {
        d3.select(this)
          .transition()
          .duration(TRANSITION_DURATION_TIME)
          .attr("height", CIRCLE_RADIUS);
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
      .selectAll(".period-zone")
      .data(stormNodes.filter((d) => d.length > 1))
      .enter()
      .append("rect")
      .attr("class", "period-zone")
      .attr("x", (d) => d[0].x)
      .attr("y", (d) => d[0].y)
      .style("fill", STORM_COLOR)
      .style("fill-opacity", 0.1)
      .attr("width", (d) => d[d.length - 1].x - d[0].x)
      .attr("height", (d) => yOfXAxis - d[0].y);

    this.stormNodes = this.svg
      .selectAll(".node")
      .data(stormNodes.flat())
      .enter()
      .append("circle")
      .attr("class", "node cursor-pointer");

    this.stormNodes
      .attr("cx", (d, i) => d.x)
      .attr("cy", (d, i) => d.y)
      .attr("r", (d) => d.r)
      .style("fill", STORM_COLOR)
      .on("mouseover", function (event, d, i) {
        d3.select(this)
          .transition()
          .duration(TRANSITION_DURATION_TIME)
          .attr("r", CIRCLE_RADIUS * 1.5);

        tooltip
          .transition()
          .duration(TRANSITION_DURATION_TIME)
          .style("opacity", 1);
        tooltip
          .html(`<p>Year: ${d.year}</p>`)
          .style("left", event.offsetX + "px")
          .style("top", event.offsetY + "px")
          .style("transform", "translate(-50%, calc(-100% - 16px))");
      })
      .on("mouseout", function (d) {
        d3.select(this)
          .transition()
          .duration(TRANSITION_DURATION_TIME)
          .attr("r", CIRCLE_RADIUS);
        tooltip
          .transition()
          .duration(TRANSITION_DURATION_TIME)
          .style("opacity", 0);
      });

    this.eventNodes = this.svg
      .selectAll(".event-node")
      .data(eventNodes.flat())
      .enter()
      .append("circle")
      .attr("class", "node cursor-pointer");

    this.eventNodes
      .attr("cx", (d, i) => d.x)
      .attr("cy", (d, i) => d.y + d.epi * EVENTS_Y_GAP)
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
          .attr("r", CIRCLE_RADIUS * 1.5);

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
      .on("mouseout", function (d) {
        d3.select(this)
          .transition()
          .duration(TRANSITION_DURATION_TIME)
          .attr("r", CIRCLE_RADIUS);
        tooltip
          .transition()
          .duration(TRANSITION_DURATION_TIME)
          .style("opacity", 0);
      });

    this.arrows = this.svg
      .selectAll(".arrow")
      .data(stormLinks)
      .enter()
      .append("path")
      .attr("class", "arrow");

    this.arrows
      .attr("id", (d, i) => `storm-link-${i + 1}`)
      .style("stroke", STORM_COLOR)
      .style("fill", "none")
      .style("stroke-dasharray", "4 4")
      .attr("d", (d, i) => {
        // const reversedX = d.source.x < d.target.x ? 1 : -1;
        // d.source.x += CIRCLE_RADIUS * reversedX;
        // d.target.x -= (CIRCLE_RADIUS + MARKER_WIDTH) * reversedX;
        const reversedY = d.source.y > d.target.y ? 1 : -1;
        const reversedIndex = i % 2 === 0 ? -1 : 1;
        d.source.y += CIRCLE_RADIUS * reversedY * reversedIndex;
        d.target.y +=
          (CIRCLE_RADIUS + MARKER_WIDTH) * reversedY * reversedIndex;
        return this.drawLinkCurve(d.source, d.target, i);
      })
      .attr("marker-end", "url(#arrow)");

    this.arrows.each((d, i, nodes) => {
      const bbox = d3.select(nodes[i]).node().getBBox();
      const centreX = bbox.x + bbox.width / 2; // <-- get x centre
      const centreY = i % 2 !== 0 ? bbox.y + 4 : bbox.y + bbox.height + 4; // <-- get y centre
      this.svg
        .append("text")
        .attr("class", "arrow-label")
        .attr("id", `arrow-label-${i + 1}`)
        .text(d.title)
        .attr("x", centreX)
        .attr("y", centreY)
        .attr("text-anchor", "middle")
        .attr("fill", STORM_COLOR)
        .style("font-size", "12px")
        .style("font-weight", "bold");
    });
  },

  drawLinkCurve(source: { x; y }, target: { x; y }, index = 0) {
    const context = d3.path();
    context.moveTo(source.x, source.y);
    context.lineTo(
      source.x,
      target.y + (index % 2 === 0 ? 1 : -1) * 10 * (index + 1)
    );
    context.lineTo(
      target.x,
      target.y + (index % 2 === 0 ? 1 : -1) * 10 * (index + 1)
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

    // update axes with these new boundaries
    this.xAxis.call(d3.axisBottom(newX));

    this.stormNodes.attr("cx", function (d) {
      d.x = newX(parseDate(d.year));
      return d.x;
    });

    this.eventNodes.attr("cx", function (d) {
      d.x = newX(parseDate(d.year));
      return d.x;
    });

    this.periods
      .attr("x", function (d) {
        d.x = newX(parseDate(d[0].year));
        return d.x;
      })
      .attr("width", function (d) {
        return (
          newX(parseDate(d[d.length - 1].year)) - newX(parseDate(d[0].year))
        );
      });

    this.periodZone
      .attr("x", function (d) {
        d.x = newX(parseDate(d[0].year));
        return d.x;
      })
      .attr("width", function (d) {
        return (
          newX(parseDate(d[d.length - 1].year)) - newX(parseDate(d[0].year))
        );
      });

    this.arrows.attr("d", (d, i) => {
      d.source.x = newX(parseDate(d.source.year));
      d.target.x = newX(parseDate(d.target.year));
      return this.drawLinkCurve(d.source, d.target, i);
    });

    this.arrows.each((d, i, nodes) => {
      const bbox = d3.select(nodes[i]).node().getBBox();
      const centreX = bbox.x + bbox.width / 2; // <-- get x centre
      const centreY = i % 2 !== 0 ? bbox.y + 4 : bbox.y + bbox.height + 4; // <-- get y centre
      this.svg
        .select(`#arrow-label-${i + 1}`)
        .attr("x", centreX)
        .attr("y", centreY);
    });

    this.scale = event.transform.k;
  },

  toggleShowStormLink() {
    this.isShow.stormLink = !this.isShow.stormLink;

    if (this.isShow.stormLink) {
      this.arrows.style("opacity", 1);
      this.arrows.each((d, i, nodes) => {
        this.svg.select(`#arrow-label-${i + 1}`).style("opacity", 1);
      });
    } else {
      this.arrows.style("opacity", 0);
      this.arrows.each((d, i, nodes) => {
        this.svg.select(`#arrow-label-${i + 1}`).style("opacity", 0);
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
      this.eventNodes.attr("cy", (d) => d.y + d.epi * EVENTS_Y_GAP);
    } else {
      this.eventNodes.attr("cy", (d) => d.y);
    }
  },
});
