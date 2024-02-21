
import "reflect-metadata";
import { LocalModelSource, TYPES } from "sprotty";
import { createContainer } from "./di.config";
import { graph } from "./model-source";

import addNode from "./util/addNode";
import drawEdge from "./util/drawEdge";






// export class CustomMouseListener extends MouseListener {
//   mouseUp(target: SModelElementImpl, event: MouseEvent): (Action | Promise<Action>)[] {
//     if (target instanceof SRoutingHandleImpl) {
//       if (!(target.parent as SEdgeImpl).targetId.includes("dummy")) {

//         setTimeout(() => {
//           cancelDrawMode()
//         }, 100)
//       }
//     }
//     return [];
//   }

// }

let addNode1Btn
let addNode2Btn
let addNode3Btn
let addNode4Btn
let drawEdgeBtn
let deleteBtn
let cancelBtn

const container = createContainer("sprotty-container");
const modelSource = container.get<LocalModelSource>(TYPES.ModelSource);

const defaultNodeWidth: number = 100;
const defaultNodeHeight: number = 100;
const defaultPortWidth: number = 20;
const defaultPortHeight: number = 20;
const defaultDummyWidth: number = 1;
const defaultDummyHeight: number = 1;

let edgeIdArray = [];
let dummyNodeArray = [];

let sourceId: any;

let edgeNumber: any = 1;

let node1Number: any = 1;
let node2Number: any = 1;
let node3Number: any = 1;
let node4Number: any = 1;

let label1Id: any = 1;
let label2Id: any = 1;
let label3Id: any = 1;
let label4Id: any = 1;


let drawMode: boolean = false
let dummyMode: boolean = false;



function cancelDrawMode() {


  addNode1Btn.removeAttribute("disabled");
  addNode2Btn.removeAttribute("disabled");
  addNode3Btn.removeAttribute("disabled");
  addNode4Btn.removeAttribute("disabled");
  drawEdgeBtn.classList.remove("btn-active");
  deleteBtn.removeAttribute("disabled");
  cancelBtn.classList.add("hide");

  document.querySelectorAll(".sprotty-node").forEach((e) => {
    (e as HTMLElement).removeAttribute("style");
  });

  document.querySelectorAll(".sprotty-edge").forEach((e) => {
    (e as HTMLElement).classList.remove("selected");
  })

  modelSource.removeElements([
    {
      elementId: dummyNodeArray[0],
      parentId: "graph",
    },
  ]);
 
  const coordinateCircleArr = []
  const cirlceEl = document.querySelectorAll(".sprotty-routing-handle");
  cirlceEl.forEach(e => {
    coordinateCircleArr.push({
      x: e.getAttribute("cx"),
      y: e.getAttribute("cy")
    })
  });


  const dummyNodeEl = document.getElementById("sprotty-container_node-dummy");
  const dummyCoordinate = dummyNodeEl.getAttribute("transform")
    .replace("translate(", "")
    .replace(")", "")
    .trim()
    .split(",")
    .map((e) => {
      return Number(e);
    });
 

  if (Math.sqrt(Math.pow(Number(dummyCoordinate[0] - Number(coordinateCircleArr[coordinateCircleArr.length - 1].x)), 2) + Math.pow(Number(dummyCoordinate[1] - Number(coordinateCircleArr[coordinateCircleArr.length - 1].y)), 2)) < 7) {
    console.log(edgeIdArray[edgeIdArray.length-1])
    modelSource.removeElements([{
      elementId: edgeIdArray[ edgeIdArray.length-1],
      parentId : "graph"
    }])
    edgeIdArray.pop();
   }else{
    console.log(false)
   }

  Array.from(document.getElementsByClassName("ready-draw")).forEach((e) => {
    e.classList.remove("ready-draw");
  });

  dummyNodeArray = [];

  sourceId = "";
  drawMode = false;
  dummyMode = false;
}




export default function run() {
  modelSource.setModel(graph);

  addNode1Btn = document.getElementById("add-node-1");
  addNode2Btn = document.getElementById("add-node-2");
  addNode3Btn = document.getElementById("add-node-3");
  addNode4Btn = document.getElementById("add-node-4");
  drawEdgeBtn = document.getElementById("draw-edge");
  deleteBtn = document.getElementById("delete");
  cancelBtn = document.getElementById("cancel");
  

  cancelBtn.addEventListener("click", () => {
    if (drawMode === true) {
      // drawMode = false;

      cancelDrawMode();
    }
  });

  const drawLogic = () => {
    setTimeout(() => {
      document.querySelectorAll(".port").forEach((port) => {
        port.addEventListener("click", () => {
          if (drawMode && !dummyMode) {
            // TAO DUMMY

            dummyMode = true;
            port.classList.add("ready-draw");
            sourceId = port.id.replace("sprotty-container_port-", "");
            const transformAttribute =
              port.parentElement.getAttribute("transform");
            const coordinate = transformAttribute
              ? transformAttribute
                .replace("translate(", "")
                .replace(")", "")
                .trim()
                .split(",")
              : [0, 0];
            if (dummyNodeArray.length === 0) {
              addNode(
                modelSource,
                "dummy",
                defaultDummyWidth,
                defaultDummyHeight,
                "dummy",
                1,
                2,
                2,
                ["nodes", "dummy"],
                "",
                Number(coordinate[0]) + 2 * defaultNodeWidth,
                Number(coordinate[1])
              );

              dummyNodeArray.push("node-dummy");
              drawEdge(modelSource, edgeNumber, sourceId, "dummy-1", [
                "dummy-edge",
              ]);
              edgeIdArray.push(`edge-${edgeNumber}`)
              edgeNumber++;
              dummyMode = false;
            }
          }
        });
      });
    }, 100);
  };

  // add node
  addNode1Btn.addEventListener("click", () => {
    addNode(
      modelSource,

      `type-1-${node1Number}`,
      defaultNodeWidth,
      defaultNodeHeight,
      label1Id,
      1,
      defaultPortWidth,
      defaultPortHeight
    );
    node1Number++;
    label1Id++;
    drawLogic();
  });

  addNode2Btn.addEventListener("click", () => {
    addNode(
      modelSource,

      `type-2-${node2Number}`,
      defaultNodeWidth,
      defaultNodeHeight,
      label2Id,
      2,
      defaultPortWidth,
      defaultPortHeight
    );
    node2Number++;
    label2Id++;
    drawLogic();
  });
  addNode3Btn.addEventListener("click", () => {
    console.log(graph.children);
    addNode(
      modelSource,

      `type-3-${node3Number}`,
      defaultNodeWidth,
      defaultNodeHeight,
      label3Id,
      3,
      defaultPortWidth,
      defaultPortHeight
    );
    node3Number++;
    label3Id++;
    drawLogic();
  });
  addNode4Btn.addEventListener("click", () => {
    addNode(
      modelSource,

      `type-4-${node4Number}`,
      defaultNodeWidth,
      defaultNodeHeight,
      label4Id,
      4,
      defaultPortWidth,
      defaultPortHeight
    );
    node4Number++;
    label4Id++;
    drawLogic();
  });
  // draw mode
  drawEdgeBtn.addEventListener("click", () => {
    if (drawMode === false) {
      addNode1Btn.setAttribute("disabled", "");
      addNode2Btn.setAttribute("disabled", "");
      addNode3Btn.setAttribute("disabled", "");
      addNode4Btn.setAttribute("disabled", "");
      drawEdgeBtn.classList.add("btn-active");
      deleteBtn.setAttribute("disabled", "");
      cancelBtn.classList.remove("hide");
      drawMode = true;

    } else {
      cancelDrawMode();
    }
  });
  // delete mode
  deleteBtn.addEventListener("click", () => {

    const selectedElements = document.querySelectorAll(".selected")
    selectedElements.forEach((element) => {
      modelSource.removeElements([
        {
          parentId: "graph",
          elementId: element.id.replace("sprotty-container_", ""),
        },
      ]);
    });
  });
  // cancel btn
}
document.addEventListener("DOMContentLoaded", () => run());
