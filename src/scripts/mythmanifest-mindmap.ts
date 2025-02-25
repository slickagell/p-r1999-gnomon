import * as d3 from "d3";
const width = 400;
const height = 300;

const rootX = width / 2;
const rootY = height - 40;
const offset = 40;

const data = {
  nodes: [
    { id: "1" },
    {
      id: "2",
      offsetX: -0.5,
      offsetY: -1,
    },
    {
      id: "3",
      offsetX: 0.5,
      offsetY: -1,
    },
    { id: "4", offsetX: -1.25, offsetY: 0 },
    {
      id: "5",
      offsetX: 1.25,
      offsetY: 0,
    },
    { id: "6", offsetX: -1, offsetY: -1.75 },
    { id: "7", offsetX: 1, offsetY: -1.75 },
    { id: "8", offsetX: -2, offsetY: -0.5 },
    { id: "9", offsetX: 2, offsetY: -0.5 },
    { id: "10", offsetX: -1.75, offsetY: -2 },
    { id: "11", offsetX: -0.75, offsetY: -2.5 },
    { id: "12", offsetX: 1.75, offsetY: -2 },
    { id: "13", offsetX: 0.75, offsetY: -2.5 },
    { id: "14", offsetX: -3, offsetY: -0.25 },
    { id: "15", offsetX: -2.5, offsetY: -1.25 },
    { id: "16", offsetX: 3, offsetY: -0.25 },
    { id: "17", offsetX: 2.5, offsetY: -1.25 },
    { id: "18", offsetX: -1.5, offsetY: -3 },
    { id: "19", offsetX: 1.5, offsetY: -3 },
    { id: "20", offsetX: -3.5, offsetY: -1.25 },
    { id: "21", offsetX: 3.5, offsetY: -1.25 },
    { id: "22", offsetX: -1.75, offsetY: -4 },
    { id: "23", offsetX: 1.75, offsetY: -4 },
    { id: "24", offsetX: -4.25, offsetY: -2 },
    { id: "25", offsetX: 4.25, offsetY: -2 },
  ],
  links: [
    { source: "2", target: "6", value: 1 },
    { source: "3", target: "7", value: 1 },
    { source: "4", target: "8", value: 1 },
    { source: "5", target: "9", value: 1 },
    { source: "6", target: "10", value: 1 },
    { source: "6", target: "11", value: 1 },
    { source: "7", target: "12", value: 1 },
    { source: "7", target: "13", value: 1 },
    { source: "8", target: "14", value: 1 },
    { source: "8", target: "15", value: 1 },
    { source: "9", target: "16", value: 1 },
    { source: "9", target: "17", value: 1 },
    { source: "10", target: "18", value: 1 },
    { source: "11", target: "18", value: 1 },
    { source: "12", target: "19", value: 1 },
    { source: "13", target: "19", value: 1 },
    { source: "14", target: "20", value: 1 },
    { source: "15", target: "20", value: 1 },
    { source: "16", target: "21", value: 1 },
    { source: "17", target: "21", value: 1 },
    { source: "18", target: "22", value: 1 },
    { source: "19", target: "23", value: 1 },
    { source: "20", target: "24", value: 1 },
    { source: "21", target: "25", value: 1 },
  ],
};

export default () => ({
  svg: null,
  links: null,
  nodes: null,

  init() {
    // The force simulation mutates links and nodes, so create a copy
    // so that re-evaluating this cell produces the same result.
    const links = data.links.map((d) => ({ ...d }));
    const nodes = data.nodes.map((d) => ({
      ...d,
      fx: rootX + offset * (d.offsetX ?? 0),
      fy: rootY + offset * (d.offsetY ?? 0),
    }));

    // Create a simulation with several forces.
    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3.forceLink(links).id((d) => d.id)
      )
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width / 2, height / 2))
      .on("tick", ticked);

    // Create the SVG container.
    const svg = d3
      .select("#mindmap-graph")
      .append("svg")
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;");

    // Add a line for each link, and a circle for each node.
    const link = svg
      .append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .selectAll()
      .data(links)
      .join("line")
      .attr("stroke-width", (d) => Math.sqrt(d.value));

    const node = svg
      .append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll()
      .data(nodes)
      .join("circle")
      .attr("id", (d) => d.id)
      .attr("r", 5)
      .attr("fill", "#fff");

    node.append("title").text((d) => d.id);

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
    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    // Update the subject (dragged node) position during drag.
    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    // Restore the target alpha so the simulation cools after dragging ends.
    // Unfix the subject position now that it’s no longer being dragged.
    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    // When this cell is re-run, stop the previous simulation. (This doesn’t
    // really matter since the target alpha is zero and the simulation will
    // stop naturally, but it’s a good practice.)
    // invalidation.then(() => simulation.stop());
  },
});
