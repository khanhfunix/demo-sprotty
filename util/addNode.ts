import { SNode } from "sprotty-protocol";
import { TaskNode } from "../models";

export default function addNode(source, numb: number) {
  source.addElements([
    {
      parentId: "graph",
      element: <SNode & TaskNode>{
        type: "node",
        id: `node-0`,
        name: `node-${numb}`,
        selected: false,
        cssClasses: ["node"],
        position: { x: 100 * (numb - 1), y: 100 * (numb - 1) },
        size: { width: 100, height: 100 },
      },
    },
  ]);
}
