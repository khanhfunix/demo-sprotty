import { SNode } from "sprotty-protocol";
import { TaskNode } from "../models";

export default function addNode(
  source: any,
  numb: any,
  width: number,
  height: number,
  x: number = 100 * (numb - 1),
  y: number = 100 * (numb - 1),
  name: string = `node-${numb}`,
  cssClasses = ["node"]
) {
  source.addElements([
    {
      parentId: "graph",
      element: <SNode & TaskNode>{
        type: "node",
        id: `node-${numb}`,
        name,
        cssClasses,
        position: { x, y },
        size: { width, height },
      },
    },
  ]);
}
