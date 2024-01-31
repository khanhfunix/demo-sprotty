import "reflect-metadata";
import { LocalModelSource, TYPES } from "sprotty";
import { createContainer } from "./di.config";
import { graph } from "./model-source";

import addNode from "./util/addNode";
import drawEdge from "./util/drawEdge";
export default function run() {
  const addNodeBtn = document.getElementById("add-node");
  const drawEdgeBtn = document.getElementById("draw-edge");
  const deleteEdgeBtn = document.getElementById("delete-edge");
  const cancelBtn = document.getElementById("cancel");
  const tipElement = document.querySelector(".tip-container");

  const container = createContainer("sprotty-container");
  const modelSource = container.get<LocalModelSource>(TYPES.ModelSource);

  const defaultNodeWidth: number = 100;
  const defaultNodeHeight: number = 100;

  let dummyEdgeArray = [];
  let dummyNodeArray = [];

  let nodeNumber: number = 1;
  let drawMode: boolean = false;
  let deleteMode: boolean = false;

  let drawModeCounter: number = 0;
  let drawModeSelectedArray = [-1, -1];

  function cancelDrawMode() {
    addNodeBtn.removeAttribute("disabled");
    drawEdgeBtn.classList.remove("btn-active");
    deleteEdgeBtn.removeAttribute("disabled");
    cancelBtn.classList.add("hide");
    tipElement.classList.add("hide");
    document.querySelectorAll(".sprotty-node").forEach((e) => {
      (e as HTMLElement).removeAttribute("style");
    });
    modelSource.removeElements([
      {
        elementId: dummyNodeArray[0],
        parentId: "graph",
      },
    ]);
    modelSource.removeElements([
      {
        elementId: dummyEdgeArray[0],
        parentId: "graph",
      },
    ]);
    document
      .getElementsByClassName("ready-draw")[0]
      .classList.remove("ready-draw");
    dummyEdgeArray = [];
    drawMode = false;
  }

  function cancelDeleteMode() {
    addNodeBtn.removeAttribute("disabled");
    drawEdgeBtn.removeAttribute("disabled");
    deleteEdgeBtn.classList.remove("btn-active");
    cancelBtn.classList.add("hide");
    deleteMode = false;
  }
  function focusGraph(): void {
    const graphElement = document.getElementById("sprotty-container_graph");
    if (graphElement !== null && typeof graphElement.focus === "function")
      graphElement.focus();
  }

  modelSource.setModel(graph);
  // add node
  addNodeBtn.addEventListener("click", () => {
    addNode(modelSource, nodeNumber, defaultNodeWidth, defaultNodeHeight);
    nodeNumber++;
    setTimeout(() => {
      document
        .querySelectorAll(".node")
        [nodeNumber - 2].addEventListener("click", (event) => {
          if (drawMode) {
            if (event.target instanceof Element) {
              (event.target as HTMLElement).style.fill = "#0f0";
              drawModeSelectedArray[drawModeCounter] = Number(
                event.target.parentElement.id.slice(-1)
              );

              const transformAttribute =
                event.target.parentElement.getAttribute("transform");
              const coordinate = transformAttribute
                ? transformAttribute
                    .replace("translate(", "")
                    .replace(")", "")
                    .trim()
                    .split(",")
                : [0, 0];
              drawModeCounter++;
              addNode(
                modelSource,
                "dummy",
                10,
                10,
                Number(coordinate[0]) + defaultNodeWidth + 10,
                Number(coordinate[1]) + defaultNodeHeight / 2 - 5,
                "",
                ["nodes", "dummy"]
              );
              dummyNodeArray.push("node-dummy");
              drawEdge(modelSource, drawModeSelectedArray[0], "dummy", [
                "dummy-edge",
              ]);
              dummyEdgeArray.push(
                `edge-between-node${drawModeSelectedArray[0]}-to-nodedummy`
              );

              setTimeout(() => {
                const dummyElement = document.getElementById(
                  "sprotty-container_node-dummy"
                );

                dummyElement.addEventListener("mouseup", () => {
                  const dummyCoordinate = dummyElement
                    .getAttribute("transform")
                    .replace("translate(", "")
                    .replace(")", "")
                    .trim()
                    .split(",")
                    .map((e) => {
                      return Number(e);
                    });

                  const nodeElements = document.querySelectorAll(".node");
                  let nodeElementsArr = [];
                  nodeElements.forEach((node) => {
                    nodeElementsArr.push({
                      id: node.id,
                      coordinate: node.getAttribute("transform")
                        ? node
                            .getAttribute("transform")
                            .replace("translate(", "")
                            .replace(")", "")
                            .trim()
                            .split(",")
                            .map((e) => {
                              return Number(e);
                            })
                        : [0, 0],
                    });
                  });

                  const filteredNode = nodeElementsArr.filter((node) => {
                    return (
                      node.coordinate[0] <= dummyCoordinate[0] &&
                      dummyCoordinate[0] <=
                        node.coordinate[0] + defaultNodeWidth &&
                      node.coordinate[1] <= dummyCoordinate[1] &&
                      dummyCoordinate[1] <=
                        node.coordinate[1] + defaultNodeHeight
                    );
                  });
                  filteredNode.forEach((node) => {
                    (
                      document.getElementById(node.id) as HTMLElement
                    ).classList.add("ready-draw");
                    drawEdge(
                      modelSource,
                      drawModeSelectedArray[0],
                      node.id.slice(-1)
                    );
                    cancelDrawMode();
                    drawModeCounter = 0;
                  });
                });
              }, 100);
            } else {
              return;
            }
            // if (drawModeCounter > 1) {
            //   drawModeCounter = 0;
            //   drawEdge(
            //     modelSource,
            //     drawModeSelectedArray[0],
            //     drawModeSelectedArray[1]
            //   );
            //   document.querySelectorAll(".sprotty-node").forEach((e) => {
            //     (e as HTMLElement).removeAttribute("style");
            //   });
            // }
          }
        });
    }, 100);
  });
  // draw mode
  drawEdgeBtn.addEventListener("click", () => {
    if (drawMode === false) {
      addNodeBtn.setAttribute("disabled", "");
      drawEdgeBtn.classList.add("btn-active");
      deleteEdgeBtn.setAttribute("disabled", "");
      cancelBtn.classList.remove("hide");
      drawMode = true;
      tipElement.classList.remove("hide");
    } else {
      cancelDrawMode();
    }
  });
  // delete mode
  deleteEdgeBtn.addEventListener("click", () => {
    const edgeElements = document.querySelectorAll(".sprotty-edge");
    if (deleteMode === false) {
      addNodeBtn.setAttribute("disabled", "");
      drawEdgeBtn.setAttribute("disabled", "");
      deleteEdgeBtn.classList.add("btn-active");
      cancelBtn.classList.remove("hide");
      deleteMode = true;
      edgeElements.forEach((element) => {
        element.addEventListener("click", () => {
          if (deleteMode === true) {
            const elementId: string = (element as HTMLElement).id.replace(
              "sprotty-container_",
              ""
            );
            if (window.confirm("Are you sure ???")) {
              modelSource.removeElements([
                {
                  elementId,
                  parentId: "graph",
                },
              ]);
              element.remove();
            }
          }
        });
      });
      focusGraph();
    } else {
      cancelDeleteMode();
    }
  });
  // cancel btn
  cancelBtn.addEventListener("click", () => {
    if (drawMode === true) {
      cancelDrawMode();
    } else if (deleteMode === true) {
      cancelDeleteMode();
    }
  });
}

document.addEventListener("DOMContentLoaded", () => run());
