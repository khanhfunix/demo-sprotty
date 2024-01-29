import { Container, ContainerModule } from "inversify";
import {
  configureModelElement,
  configureViewerOptions,
  creatingOnDragFeature,
  deletableFeature,
  JumpingPolylineEdgeView,
  loadDefaultModules,
  LocalModelSource,
  moveFeature,
  PolylineEdgeView,
  SEdgeImpl,
  SGraphImpl,
  SGraphView,
  SNodeImpl,
  TYPES,
  viewportFeature,
  SRoutingHandleImpl,
  SRoutingHandleView,
} from "sprotty";
import { TaskNodeView } from "./views";
import { CreatingOnDrag } from "sprotty";

export const createContainer = (containerId: string) => {
  const myModule = new ContainerModule((bind, unbind, isBound, rebind) => {
    bind(TYPES.ModelSource).to(LocalModelSource).inSingletonScope();

    const context = { bind, unbind, isBound, rebind };
    configureModelElement(context, "graph", SGraphImpl, SGraphView,);
    // configureModelElement(context, "task", SNodeImpl, TaskNodeView);
    configureModelElement(context, "node", SNodeImpl, TaskNodeView);
    configureModelElement(context, "edge:straight", SEdgeImpl, JumpingPolylineEdgeView,);
    configureModelElement(context, 'routing-point', SRoutingHandleImpl, SRoutingHandleView);
    configureModelElement(context, 'volatile-routing-point', SRoutingHandleImpl, SRoutingHandleView);

    configureViewerOptions(context, {
      needsClientLayout: false,
      baseDiv: containerId,
    });
  });

  const container = new Container();
  loadDefaultModules(container);
  container.load(myModule);
  return container;
};
