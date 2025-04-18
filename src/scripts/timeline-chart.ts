import * as d3 from "d3";

const MARGIN = { TOP: 16, RIGHT: 32, BOTTOM: 32, LEFT: 32 };
const CHART_WIDTH = 1366 - MARGIN.LEFT - MARGIN.RIGHT;
const CHART_HEIGHT = 768 / 1.5 - MARGIN.TOP - MARGIN.BOTTOM;

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
const STORM_EVENT_DATA = [
  {
    period: [1999],
    href: "#year-1999",
  },
  {
    period: [1996, 1997],
    href: "#period-1996---1997",
  },
  {
    period: [1985, 1987],
    href: "#period-1985---1987",
  },
  {
    period: [1977, 1978],
    href: "#period-1977---1978",
  },
  {
    period: [1939, 1941],
    href: "#period-193x---194x-assumed-to-be-1939---1941-ww2",
  },
  {
    period: [1912, 1913],
    href: "#period-1912---1913",
  },
  {
    period: [1966],
    href: "#year-1966",
  },
  {
    period: [1929],
    href: "#year-1929",
  },
  {
    period: [1913, 1914],
    href: "#period-1913---1914",
  },
  {
    period: [1990],
    href: "#year-1990",
  },
];

const STORM_EVENT_Y_COORDINATE = CHART_HEIGHT / 2;

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

  nodes: null,
  periods: null,
  arrows: null,

  svg: null,

  init() {
    const { oldestYear, newestYear } = STORM_EVENT_DATA.reduce(
      (prev, stormEventData) => {
        if (stormEventData.period[0] < prev.oldestYear) {
          prev.oldestYear = stormEventData.period[0];
        }
        if (
          stormEventData.period[stormEventData.period.length - 1] >
          prev.newestYear
        ) {
          prev.newestYear =
            stormEventData.period[stormEventData.period.length - 1];
        }
        return prev;
      },
      {
        oldestYear: 1999,
        newestYear: 1999,
      }
    );

    // Add X axis
    this.xLine = d3
      .scaleLinear()
      .domain([oldestYear - 3, newestYear + 3])
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
      .call(d3.axisBottom(this.xLine).tickFormat(d3.format(".0f")));

    // Set the zoom and Pan features: how much you can zoom, on which part, and what to do when there is a zoom
    let zoom = d3
      .zoom()
      .scaleExtent([1, 10]) // This control how much you can unzoom and zoom
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
      .call(zoom);

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

    let stormNodesY = STORM_EVENT_Y_COORDINATE;

    const stormNodes = STORM_EVENT_DATA.map((event, idx) => {
      if (!STORM_EVENT_DATA[idx - 1]) {
        return event.period.map((year) => {
          return {
            year,
            x: this.xLine(year),
            y: stormNodesY,
            r: CIRCLE_RADIUS,
            href: event.href,
          };
        });
      }

      return event.period.map((year) => {
        return {
          year,
          x: this.xLine(year),
          y: stormNodesY,
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

    let tooltip = body
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .attr("class", "absolute border p-2")
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
          .html(
            `<p class="whitespace-nowrap">Period: ${d[0].year} - ${d[d.length - 1].year}</p>`
          )
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

    this.nodes = this.svg
      .selectAll(".node")
      .data(stormNodes.flat())
      .enter()
      .append("circle")
      .attr("class", "node cursor-pointer");

    this.nodes
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
          .html(`<p class="whitespace-nowrap">Year: ${d.year}</p>`)
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
        // tooltip.style("left", 0).style("top", 0);
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
    this.xAxis.call(d3.axisBottom(newX).tickFormat(d3.format(".0f")));

    this.nodes.attr("cx", function (d) {
      d.x = newX(d.year);
      return d.x;
    });

    this.periods
      .attr("x", function (d) {
        d.x = newX(d[0].year);
        return d.x;
      })
      .attr("width", function (d) {
        return newX(d[d.length - 1].year) - newX(d[0].year);
      });

    this.arrows.attr("d", (d, i) => {
      d.source.x = newX(d.source.year);
      d.target.x = newX(d.target.year);
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
});
