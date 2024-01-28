import "reflect-metadata";
import { LocalModelSource, TYPES } from "sprotty";
import { createContainer } from "./di.config";
import { graph } from "./model-source";
import { SNode } from "sprotty-protocol";
import { TaskNode } from "./models";
import addNode from "./util/addNode";
export default function run() {
  const addNodeBtn = document.getElementById("add-node");
  const drawEdgeBtn = document.getElementById("draw-edge");
  const deleteEdgeBtn = document.getElementById("delete-edge");
  const cancelBtn = document.getElementById("cancel");
  const nodeElement = document.getElementsByClassName("sprotty-node");

  const container = createContainer("sprotty-container");
  const modelSource = container.get<LocalModelSource>(TYPES.ModelSource);
  let nodeNumber: number = 1;
  let drawMode: boolean = false;
  let deleteMode: boolean = false;

  function cancelDrawMode() {
    addNodeBtn.removeAttribute("disabled");
    drawEdgeBtn.classList.remove("btn-active");
    deleteEdgeBtn.removeAttribute("disabled");
    cancelBtn.classList.add("hide");
    drawMode = false;
  }

  function cancelDeleteMode() {
    addNodeBtn.removeAttribute("disabled");
    drawEdgeBtn.removeAttribute("disabled");
    deleteEdgeBtn.classList.remove("btn-active");
    cancelBtn.classList.add("hide");
    deleteMode = false;
  }

  modelSource.setModel(graph);
  // add node
  addNodeBtn.addEventListener("click", () => {
    console.log(nodeElement);
    addNode(modelSource, nodeNumber);
    nodeNumber++;
  });
  // draw mode
  drawEdgeBtn.addEventListener("click", () => {
    if (drawMode === false) {
      addNodeBtn.setAttribute("disabled", "");
      drawEdgeBtn.classList.add("btn-active");
      deleteEdgeBtn.setAttribute("disabled", "");
      cancelBtn.classList.remove("hide");
      drawMode = true;
    } else {
      cancelDrawMode();
    }
  });
  // delete mode
  deleteEdgeBtn.addEventListener("click", () => {
    if (deleteMode === false) {
      addNodeBtn.setAttribute("disabled", "");
      drawEdgeBtn.setAttribute("disabled", "");
      deleteEdgeBtn.classList.add("btn-active");
      cancelBtn.classList.remove("hide");
      deleteMode = true;
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
  // Logic draw
  // nodeElement[0].addEventListener("click", (event) => {
  //   console.log("clicked");
  //   console.log(event.target);
  // });
}

document.addEventListener("DOMContentLoaded", () => run());
