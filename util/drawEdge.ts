import { SEdge } from "sprotty-protocol";

export default function drawEdge(source, sourceNumb: number, targetNumb : number) {
  source.addElements([
    {
      parentId: "graph",
      element: <SEdge>{
        type: "edge:straight",
        id: `edge-between-node${sourceNumb}-to-node${targetNumb}`,
        sourceId: `node-${sourceNumb}`,
        targetId: `node-${targetNumb}`,
        routerKind: "manhattan",
        
      } as SEdge,
    },
  ]);
}
