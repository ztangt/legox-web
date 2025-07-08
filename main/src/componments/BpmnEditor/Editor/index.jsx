import Modeler from 'bpmn-js/lib/Modeler';
import inherits from 'inherits';
import customModule from './../Modeler'
// 翻译
// import CustomTranslate from './ProcessManage/BpmnEditor/customTranslate';


function CustomModeler(options) {
    Modeler.call(this, options);
  
    this._customElements = [];
  }
  
  inherits(CustomModeler, Modeler);
  
  CustomModeler.prototype._modules = [].concat(CustomModeler.prototype._modules, [
    // CustomTranslate,
    customModule
  ]);


export {CustomModeler}
