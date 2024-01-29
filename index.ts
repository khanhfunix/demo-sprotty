import "reflect-metadata";
import { LocalModelSource, TYPES } from "sprotty";
import { createContainer } from "./di.config";
import { graph } from "./model-source";
import { SNode } from "sprotty-protocol";
import { TaskNode } from "./models";
import addNode from "./util/addNode";
import drawEdge from "./util/drawEdge";
export default function run() {
  const addNodeBtn = document.getElementById("add-node");
  const drawEdgeBtn = document.getElementById("draw-edge");
  const deleteEdgeBtn = document.getElementById("delete-edge");
  const cancelBtn = document.getElementById("cancel");
  const tipElement = document.querySelector(".tip-container")


  const container = createContainer("sprotty-container");
  const modelSource = container.get<LocalModelSource>(TYPES.ModelSource);
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
    const graphElement = document.getElementById('sprotty-container_graph');
    if (graphElement !== null && typeof graphElement.focus === 'function')
      graphElement.focus();
  }

  modelSource.setModel(graph);
  // add node
  addNodeBtn.addEventListener("click", () => {
    addNode(modelSource, nodeNumber);
    nodeNumber++;
    setTimeout(() => {
      document.querySelectorAll(".node")[nodeNumber - 2].addEventListener("click", (event) => {
        if (drawMode) {
          if (event.target instanceof Element) {
            (event.target as HTMLElement).style.fill = "green"
            drawModeSelectedArray[drawModeCounter] = Number(event.target.parentElement.id.slice(-1));
            drawModeCounter++;
          } else {
            return;
          }

          if (drawModeCounter > 1) {

            drawModeCounter = 0;
            drawEdge(modelSource, drawModeSelectedArray[0], drawModeSelectedArray[1])
            document.querySelectorAll(".sprotty-node").forEach(e => {
              console.log(e);
              (e as HTMLElement).removeAttribute("style")
            })
          }
        }
      })
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
      tipElement.classList.remove("hide")
    } else {
      cancelDrawMode();
    }
  });
  // delete mode
  deleteEdgeBtn.addEventListener("click", () => {
    const edgeElements = document.querySelectorAll(".sprotty-edge")
    if (deleteMode === false) {
      addNodeBtn.setAttribute("disabled", "");
      drawEdgeBtn.setAttribute("disabled", "");
      deleteEdgeBtn.classList.add("btn-active");
      cancelBtn.classList.remove("hide");
      deleteMode = true;
      edgeElements.forEach(element => {
        element.addEventListener("click", () => {


          if (deleteMode === true) {
            const elementId: string = (element as HTMLElement).id.replace("sprotty-container_", "")
            if (window.confirm("Are you sure ???")) {

              modelSource.removeElements([{
                elementId,
                parentId: "graph"
              }])
              element.remove();

            }
          }
        })
      })
      focusGraph()
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
