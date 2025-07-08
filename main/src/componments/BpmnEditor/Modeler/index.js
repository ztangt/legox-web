import CustomContextPad from './CustomContextPadProvider';
import CustomPalette from './CustomPalette';
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
import 'bpmn-js-properties-panel/dist/assets/properties-panel.css'
import 'bpmn-js-color-picker/colors/color-picker.css';
import "diagram-js-minimap/assets/diagram-js-minimap.css";
import 'bpmn-js-bpmnlint/dist/assets/css/bpmn-js-bpmnlint.css';


// element-templates
import './index.css'
export default {
  __init__: [ 'customContextPad', 'customPalette' ],
  customContextPad: [ 'type', CustomContextPad ],
  customPalette: [ 'type', CustomPalette ],
};