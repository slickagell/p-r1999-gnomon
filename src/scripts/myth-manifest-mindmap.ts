import * as d3 from "d3";

const WIDTH = 400;
const HEIGHT = 300;

const ROOT_X = WIDTH / 2;
const ROOT_Y = HEIGHT - 40;
const OFFSET = 40;

const DEFAULT_NODE_R = 5;
const TRANSITION_DURATION_TIME = 300;
const NODE_COLOR = "#999";
const NODE_COLOR_SELECTED = "#fff";
const NODE_COLOR_ACTIVE = "#db6f39";
const LINK_COLOR = "#999";

export default () => ({
  svg: null,
  links: null,
  nodes: null,
  selectedNode: null,
  hoveredNode: null,
  activeNodes: [],
  activeCodes: [],

  init() {
    const data = this.$store.mythManifest.mindmap;

    // The force simulation mutates links and nodes, so create a copy
    // so that re-evaluating this cell produces the same result.
    const links = data.links.map((d) => ({ ...d }));
    const nodes = data.nodes.map((d) => ({
      ...d,
      fx: ROOT_X + OFFSET * (d.offsetX ?? 0),
      fy: ROOT_Y + OFFSET * (d.offsetY ?? 0),
    }));

    this.links = links;
    this.nodes = nodes;

    // Create a simulation with several forces.
    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3.forceLink(links).id((d) => d.id)
      )
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(WIDTH / 2, HEIGHT / 2))
      .on("tick", ticked);

    // Create the SVG container.
    const svg = d3
      .select("#mindmap-graph")
      .append("svg")
      .attr("viewBox", [0, 0, WIDTH, HEIGHT])
      .attr("style", "max-width: 100%; height: auto;");

    let tooltip = d3.select("#mindmap-graph").select("#tooltip");

    // Add a line for each link, and a circle for each node.
    const link = svg
      .append("g")
      .attr("stroke", LINK_COLOR)
      .attr("stroke-opacity", 0.6)
      .selectAll()
      .data(links)
      .join("line")
      .attr("stroke-width", 1);

    const node = svg
      .append("g")
      .selectAll()
      .data(nodes)
      .join("circle")
      .attr("class", "node")
      .attr("id", (d) => d.id)
      .attr("r", (d) => d.r ?? DEFAULT_NODE_R)
      .attr("fill", (d) => (d.active ? NODE_COLOR_ACTIVE : NODE_COLOR))
      .on("mouseover", (event, d, i) => {
        // d3.select(event.target)
        //   .transition()
        //   .duration(TRANSITION_DURATION_TIME)
        //   .attr("r", (d) => (d.r ?? DEFAULT_NODE_R) * 1.5);

        if (d.code) {
          this.hoveredNode = {
            id: d.id,
            code: d.code,
          };
          const svgDim = svg.node().getBoundingClientRect();

          const tooltipX = (d.x * svgDim.width) / WIDTH;
          const tooltipY =
            ((d.y - (d.r ?? DEFAULT_NODE_R + 4)) * svgDim.height) / HEIGHT;

          tooltip
            .style("left", tooltipX + "px")
            .style("top", tooltipY + "px")
            .style("transform", `translate(-50%, -100%)`);

          tooltip
            .transition()
            .duration(TRANSITION_DURATION_TIME)
            .style("opacity", 1);
        }
      })
      .on("mouseout", (e, d) => {
        d3.select(e.target).attr("r", (d) => d.r ?? DEFAULT_NODE_R);

        this.hoveredNode = null;

        tooltip
          .transition()
          .duration(TRANSITION_DURATION_TIME)
          .style("opacity", 0);
      })
      .on("click", async (e, d) => {
        console.log(d);
        d3.select("circle[id='" + this.selectedNode?.id + "']").attr(
          "fill",
          () =>
            !!this.activeCodes.includes(this.selectedNode?.code)
              ? NODE_COLOR_ACTIVE
              : NODE_COLOR
        );

        this.selectedNode = {
          id: d.id,
          code: d.code,
        };

        d3.select(e.target).attr("fill", NODE_COLOR_SELECTED);
      });

    // Add a drag behavior.
    // node.call(
    //   d3
    //     .drag()
    //     .on("start", dragstarted)
    //     .on("drag", dragged)
    //     .on("end", dragended)
    // );

    // Set the position attributes of links and nodes each time the simulation ticks.
    function ticked() {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
    }

    // Reheat the simulation when drag starts, and fix the subject position.
    // function dragstarted(event) {
    //   if (!event.active) simulation.alphaTarget(0.3).restart();
    //   event.subject.fx = event.subject.x;
    //   event.subject.fy = event.subject.y;
    // }

    // Update the subject (dragged node) position during drag.
    // function dragged(event) {
    //   event.subject.fx = event.x;
    //   event.subject.fy = event.y;
    // }

    // Restore the target alpha so the simulation cools after dragging ends.
    // Unfix the subject position now that it’s no longer being dragged.
    // function dragended(event) {
    //   if (!event.active) simulation.alphaTarget(0);
    //   event.subject.fx = null;
    //   event.subject.fy = null;
    // }

    // When this cell is re-run, stop the previous simulation. (This doesn’t
    // really matter since the target alpha is zero and the simulation will
    // stop naturally, but it’s a good practice.)
    // invalidation.then(() => simulation.stop());
  },

  clearSelectedNode() {
    d3.select("circle[id='" + this.selectedNode?.id + "']").attr("fill", () =>
      !!this.activeCodes.includes(this.selectedNode?.code)
        ? NODE_COLOR_ACTIVE
        : NODE_COLOR
    );

    this.selectedNode = null;
  },

  clear() {
    this.activeNodes.forEach((node) => {
      d3.select('circle[id="' + node.id + '"]').attr("fill", NODE_COLOR);
    });

    this.selectedNode = null;
    this.hoveredNode = null;
    this.activeNodes = [];
    this.activeCodes = [];
  },

  setRecommended(name) {
    const data = this.$store.mythManifest.mindmap;
    const recommended = data.recommended.find((ele) => ele.name === name);
    this.activeNodes = data.nodes.filter((ele) => {
      return recommended.activeNodes.includes(ele.id);
    });
    this.activeCodes = this.activeNodes.map((ele) => ele.code);
    this.activeNodes.forEach((node) => {
      d3.select('circle[id="' + node.id + '"]').attr("fill", NODE_COLOR_ACTIVE);
    });
  },
});
