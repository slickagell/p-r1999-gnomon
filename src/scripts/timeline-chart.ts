import * as d3 from "d3";

const MARGIN = { TOP: 10, RIGHT: 30, BOTTOM: 30, LEFT: 30 };
const CHART_WIDTH = 992 - MARGIN.LEFT - MARGIN.RIGHT;
const CHART_HEIGHT = 600 - MARGIN.TOP - MARGIN.BOTTOM;
const TOTAL_WIDTH = CHART_WIDTH * 3;

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

const STORM_COLOR = "#db6f39";
const STORM_EVENT_DATA = [
  {
    period: [1999],
  },
  {
    period: [1996, 1997],
  },
  {
    period: [1985, 1987],
  },
  {
    period: [1977, 1978],
  },
  {
    period: [1939, 1941],
  },
  {
    period: [1912, 1913],
  },
  {
    period: [1966],
  },
  {
    period: [1929],
  },
];

const STORM_EVENT_Y_COORDINATE = 300;

export default () => ({
  scale: 1,

  xLine: null,
  xAxis: null,

  svg: null,

  init() {
    // Add X axis
    this.xLine = d3
      .scaleLinear()
      .domain([1900, 2010])
      .range([MARGIN.LEFT, TOTAL_WIDTH - MARGIN.RIGHT]);

    // create svg element
    d3.select("#timeline")
      .append("svg")
      .attr("width", CHART_WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
      .attr("height", CHART_HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)
      .style("position", "absolute")
      .style("pointer-events", "none")
      .style("z-index", 1)
      .append("g")
      .attr("transform", "translate(" + MARGIN.LEFT + "," + 0 + ")");

    // Create a scrolling div containing the area shape and the horizontal axis.
    const body = d3
      .select("#timeline")
      .append("div")
      .style("overflow-x", "scroll")
      .style("-webkit-overflow-scrolling", "touch");

    this.svg = body
      .append("svg")
      .attr("width", TOTAL_WIDTH)
      .attr("height", CHART_HEIGHT)
      .style("display", "block");

    this.xAxis = this.svg
      .append("g")
      .attr("transform", "translate(0," + (CHART_HEIGHT - MARGIN.BOTTOM) + ")")
      .call(d3.axisBottom(this.xLine));

    // Set the zoom and Pan features: how much you can zoom, on which part, and what to do when there is a zoom
    let zoom = d3
      .zoom()
      .scaleExtent([1, 10]) // This control how much you can unzoom (x0.5) and zoom (x20)
      .extent([
        [0, 0],
        [CHART_WIDTH, CHART_HEIGHT],
      ])
      .filter((event) => this.filterZoom(event))
      .on("zoom", (event) => this.updateChart(event));

    // This add an invisible rect on top of the chart area. This rect can recover pointer events: necessary to understand when the user zoom
    this.svg
      .append("rect")
      .attr("width", TOTAL_WIDTH)
      .attr("height", CHART_HEIGHT)
      .style("fill", "none")
      .style("pointer-events", "all")
      .attr("transform", "translate(" + 0 + "," + MARGIN.TOP + ")")
      .call(zoom);

    this.svg
      .append("defs")
      .append("marker")
      .attr("id", "arrow")
      .attr("viewBox", [0, 0, MARKER_BOX_WIDTH, MARKER_BOX_HEIGHT])
      .attr("refX", REF_X)
      .attr("refY", REF_Y)
      .attr("markerWidth", MARKER_BOX_WIDTH)
      .attr("markerHeight", MARKER_BOX_HEIGHT)
      .attr("orient", "auto-start-reverse")
      .append("path")
      .attr("d", d3.line()(ARROW_POINTS))
      .attr("stroke", STORM_COLOR)
      .attr("fill", STORM_COLOR);

    // horizontal link
    const linkH = d3
      .linkHorizontal()
      .x((d) => d.x)
      .y((d) => d.y);

    // vertical link
    const linkV = d3
      .linkVertical()
      .x((d) => d.x)
      .y((d) => d.y);

    const drawLinkCurve = (source: { x; y }, target: { x; y }) => {
      const context = d3.path();
      context.moveTo(source.x, source.y);
      context.quadraticCurveTo(
        (source.x + target.x) / 2,
        STORM_EVENT_Y_COORDINATE - Math.abs(source.x - target.x) / 4,
        target.x,
        target.y
      );
      //   context.bezierCurveTo(
      //     source.x - MARGIN.LEFT,
      //     source.y - MARGIN.BOTTOM,
      //     target.x + MARGIN.LEFT,
      //     target.y + MARGIN.BOTTOM,
      //     target.x,
      //     target.y
      //   );
      return context + "";
    };

    let stormNodesY = STORM_EVENT_Y_COORDINATE;

    const stormNodes = STORM_EVENT_DATA.map((event, idx) => {
      if (!STORM_EVENT_DATA[idx - 1]) {
        return event.period.map((year) => {
          return {
            year,
            x: this.xLine(year),
            y: stormNodesY,
            r: CIRCLE_RADIUS,
          };
        });
      }

      if (event.period.length === 1) {
        stormNodesY += 20;
      }

      return event.period.map((year) => {
        return {
          year,
          x: this.xLine(year),
          y: stormNodesY,
          r: CIRCLE_RADIUS,
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
          source: {
            x: sourceX,
            y: sourceY,
          },
          target: {
            x: targetX,
            y: targetY,
          },
          arrowDirection: yDelta >= xDelta ? "V" : "H",
        },
      ];
    }, []);

    const circles = this.svg
      .selectAll(".node")
      .data(stormNodes.flat())
      .enter()
      .append("circle")
      .attr("class", "node");

    circles
      .attr("cx", (d, i) => d.x)
      .attr("cy", (d, i) => d.y)
      .attr("r", (d) => d.r)
      .style("fill", STORM_COLOR);

    const arrows = this.svg
      .selectAll(".arrow")
      .data(stormLinks)
      .enter()
      .append("path")
      .attr("class", "arrow")
      .style("stroke", STORM_COLOR)
      .style("fill", "none");

    arrows
      .attr("d", (d, i) => {
        let reversed;
        // if (d.arrowDirection === "H") {
        //   reversed = d.source.x < d.target.x ? 1 : -1;
        //   d.source.x += CIRCLE_RADIUS * reversed;
        //   d.target.x -= (CIRCLE_RADIUS + MARKER_WIDTH) * reversed;
        //   //return linkH(d);
        //   return drawLinkCurve(d.source, d.target);
        // } else {
        //   reversed = d.source.y > d.target.y ? 1 : -1;
        //   d.source.y -= CIRCLE_RADIUS * reversed;
        //   d.target.y += (CIRCLE_RADIUS + MARKER_WIDTH) * reversed;
        //   //return linkV(d);
        //   return drawLinkCurve(d.source, d.target);
        // }

        const reversedX = d.source.x < d.target.x ? 1 : -1;
        d.source.x += CIRCLE_RADIUS * reversedX;
        d.target.x -= (CIRCLE_RADIUS + MARKER_WIDTH) * reversedX;
        const reversedY = d.source.y > d.target.y ? 1 : -1;
        d.source.y += CIRCLE_RADIUS * reversedY;
        d.target.y += (CIRCLE_RADIUS + MARKER_WIDTH) * reversedY;
        return drawLinkCurve(d.source, d.target);
      })
      .attr("marker-end", "url(#arrow)");
  },

  filterZoom(event) {
    return event.ctrlKey && event.type === "wheel" && !event.button;
  },

  updateChart(event) {
    // recover the new scale
    let newX = event.transform.rescaleX(this.xLine);

    // update axes with these new boundaries
    this.xAxis.call(d3.axisBottom(newX).ticks(5).tickFormat(d3.format(".0f")));

    this.scale = event.transform.k;
  },
});
