import * as d3 from "d3";

const WIDTH = 400;
const HEIGHT = 300;

const ROOT_X = WIDTH / 2;
const ROOT_Y = HEIGHT - 40;
const OFFSET = 40;

const DEFAULT_NODE_R = 5;
const TRANSITION_DURATION_TIME = 300;
const NODE_COLOR = "#fff";
const LINK_COLOR = "#999";

export default () => ({
  svg: null,
  links: null,
  nodes: null,
  selectedNode: null,
  hoveredNode: null,

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
      .attr("fill", NODE_COLOR)
      .on("mouseover", (event, d, i) => {
        d3.select(event.target)
          .transition()
          .duration(TRANSITION_DURATION_TIME)
          .attr("r", (d) => (d.r ?? DEFAULT_NODE_R) * 1.5);

        if (d.code) {
          this.hoveredNode = {
            id: d.id,
            code: d.code,
          };
          const svgDim = svg.node().getBoundingClientRect();

          const tooltipX = (d.x * svgDim.width) / WIDTH;
          const tooltipY = (d.y * svgDim.height) / HEIGHT;

          tooltip
            .style("left", tooltipX + "px")
            .style("top", tooltipY + "px")
            .style("transform", `translate(-50%, calc(-100% - 1rem))`);

          tooltip
            .transition()
            .duration(TRANSITION_DURATION_TIME)
            .style("opacity", 1);
        }
      })
      .on("mouseout", (e, d) => {
        d3.select(e.target)
          .transition()
          .duration(TRANSITION_DURATION_TIME)
          .attr("r", (d) => d.r ?? DEFAULT_NODE_R);

        this.hoveredNode = null;

        tooltip
          .transition()
          .duration(TRANSITION_DURATION_TIME)
          .style("opacity", 0);
      })
      .on("click", async (e, d) => {
        this.selectedNode = {
          id: d.id,
          code: d.code,
        };
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
});
