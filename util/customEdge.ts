import { MouseListener, SEdgeImpl, SModelElementImpl, SRoutingHandleImpl } from "sprotty"
import { Action } from "sprotty-protocol"

export class CustomMouseListener extends MouseListener {
    mouseUp(target: SModelElementImpl, event: MouseEvent): (Action | Promise<Action>)[] {
        if (target instanceof SRoutingHandleImpl) {
            if (!(target.parent as SEdgeImpl).targetId.includes("dummy")) {

                document.getElementById("cancel").click()
            }
        }
        return [];
    }

}