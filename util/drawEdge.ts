import { SEdge } from "sprotty-protocol";

export default function drawEdge(
  source,
  sourceNumb,
  targetNumb,
  cssClasses = [],
  routerKind: string = "manhattan",
) {
  source.addElements([
    {
      parentId: "graph",
      element: (<SEdge>{
        type: "edge:straight",
        id: `edge-between-node${sourceNumb}-to-node${targetNumb}`,
        sourceId: `node-${sourceNumb}`,
        targetId: `node-${targetNumb}`,
        cssClasses,
      }) as SEdge,
    },
  ]);
}
