import * as d3 from "d3";

const WIDTH = 400;
const HEIGHT = 300;

const ROOT_X = WIDTH / 2;
const ROOT_Y = HEIGHT - 40;
const OFFSET = 40;
const TRANSITION_DURATION_TIME = 250;
const DEFAULT_NODE_R = 5;
const NODE_COLOR = "#999";
const NODE_SELECTED_COLOR = "#fff";
const NODE_STROKE_SELECTED_COLOR = "#bba893";
const NODE_ACTIVE_COLOR = "#fff";
const NODE_STROKE_ACTIVE_COLOR = "#db6f39";
const LINK_COLOR = "#999";
const LINK_ACTIVE_COLOR = "#db6f39";

export default () => ({
  svg: null,
  links: null,
  nodes: null,
  selectedNode: null,
  hoveredNode: null,
  activeNodes: [],
  activeCodes: [],
  activeLinks: [],

  openTooltip: false,
  anchorTooltip: "",

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
        d3.forceLink(links).id((d) => d.id),
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

    // Add a line for each link, and a circle for each node.
    const link = svg
      .append("g")
      .selectAll()
      .data(links)
      .join("line")
      .attr("data-source", (d) => d.source.id)
      .attr("data-target", (d) => d.target.id)
      .attr("stroke", LINK_COLOR)
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 1);

    const node = svg
      .append("g")
      .selectAll()
      .data(nodes)
      .join("circle")
      .attr("class", "node")
      .attr("id", (d) => d.id)
      .attr("x-ref", (d) => `node-${d.id}`)
      .attr("r", (d) => d.r ?? DEFAULT_NODE_R)
      .attr("fill", (d) => (d.active ? NODE_ACTIVE_COLOR : NODE_COLOR))
      .attr("stroke-width", 2)
      .on("mouseover", (event, d, i) => {
        d3.select(event.target)
          .transition()
          .duration(TRANSITION_DURATION_TIME)
          .attr("fill", NODE_SELECTED_COLOR);

        if (d.code) {
          this.hoveredNode = {
            id: d.id,
            code: d.code,
          };

          this.anchorTooltip = `node-${d.id}`;
          this.openTooltip = true;
        }
      })
      .on("mouseout", (e, d) => {
        this.hoveredNode = null;

        this.openTooltip = false;
        this.anchorTooltip = "";

        if (this.selectedNode?.id === d.id) return;

        const isHoveredNodeActive = !!this.activeCodes.includes(d.code);
        if (isHoveredNodeActive) return;

        d3.select(e.target)
          .transition()
          .duration(TRANSITION_DURATION_TIME)
          .attr("fill", NODE_COLOR);
      })
      .on("click", async (e, d) => {
        const isSelectedNodeActive = !!this.activeCodes.includes(
          this.selectedNode?.code,
        );
        d3.select("circle[id='" + this.selectedNode?.id + "']")
          .attr("fill", () =>
            isSelectedNodeActive ? NODE_ACTIVE_COLOR : NODE_COLOR,
          )
          .attr("stroke", () =>
            isSelectedNodeActive ? NODE_STROKE_ACTIVE_COLOR : null,
          );

        this.selectedNode = {
          id: d.id,
          code: d.code,
        };

        d3.select(e.target)
          .attr("fill", NODE_SELECTED_COLOR)
          .attr("stroke", NODE_STROKE_SELECTED_COLOR);
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
    const isSelectedNodeActive = !!this.activeCodes.includes(
      this.selectedNode?.code,
    );
    d3.select("circle[id='" + this.selectedNode?.id + "']")
      .attr("fill", () =>
        isSelectedNodeActive ? NODE_ACTIVE_COLOR : NODE_COLOR,
      )
      .attr("stroke", () =>
        isSelectedNodeActive ? NODE_STROKE_ACTIVE_COLOR : null,
      );

    this.selectedNode = null;
  },

  clear() {
    this.activeNodes.forEach((node) => {
      d3.select('circle[id="' + node.id + '"]')
        .attr("fill", NODE_COLOR)
        .attr("stroke", null);
    });
    this.activeLinks.forEach((link) => {
      d3.select(
        'line[data-source="' +
          link.source +
          '"][data-target="' +
          link.target +
          '"]',
      ).attr("stroke", LINK_COLOR);
    });

    this.clearSelectedNode();
    this.hoveredNode = null;
    this.activeNodes = [];
    this.activeCodes = [];
    this.activeLinks = [];
  },

  setRecommended(name) {
    this.clear();
    const data = this.$store.mythManifest.mindmap;
    const recommended = data.recommended.find((ele) => ele.name === name);
    this.activeNodes = data.nodes.filter((ele) => {
      return recommended.activeNodes.includes(ele.id);
    });
    this.activeCodes = this.activeNodes.map((ele) => ele.code);
    this.activeNodes.forEach((node) => {
      d3.select('circle[id="' + node.id + '"]')
        .attr("fill", NODE_ACTIVE_COLOR)
        .attr("stroke", NODE_STROKE_ACTIVE_COLOR);
    });

    const activeLinks = data.links.filter((ele) => {
      return (
        this.activeNodes.some((node) => node.id === ele.source) &&
        this.activeNodes.some((node) => node.id === ele.target)
      );
    });
    this.activeLinks = activeLinks;
    activeLinks.forEach((link) => {
      d3.select(
        'line[data-source="' +
          link.source +
          '"][data-target="' +
          link.target +
          '"]',
      ).attr("stroke", LINK_ACTIVE_COLOR);
    });
  },
});
