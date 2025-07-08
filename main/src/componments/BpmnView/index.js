import inherits from "inherits";

// import Viewer from "bpmn-js/lib/Viewer";
import Viewer from 'bpmn-js/lib/Modeler'

import ZoomScrollModule from "diagram-js/lib/navigation/zoomscroll";
import MoveCanvasModule from "diagram-js/lib/navigation/movecanvas";
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import './index.less'
function CustomViewer(options) {
  Viewer.call(this, options);
}

inherits(CustomViewer, Viewer);

CustomViewer.prototype._modules = [].concat(Viewer.prototype._modules, [
  ZoomScrollModule,
  MoveCanvasModule
]);

export { CustomViewer };