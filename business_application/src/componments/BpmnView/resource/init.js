import { PROCESS_TYPE, TYPE_TARGET } from '../constant/constants';

/**
 * 新建空流程
 * @param key 流程id
 * @param name 流程名称
 * @param type 流程类型
 */
export default (key, name, type) => {
  let type_target;
  if (type === PROCESS_TYPE.activiti) {
    type_target = TYPE_TARGET.activiti;
  } else if (type === PROCESS_TYPE.flowable) {
    type_target = TYPE_TARGET.flowable;
  } else {
    type_target = TYPE_TARGET.camunda;
  }
  return `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:omgdi="http://www.omg.org/spec/DD/20100524/DI" xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" id=diagram_${key} targetNamespace="http://flowable.org/bpmn" >
<process id="${key}" name="${name}" isExecutable="true">
</process>
<bpmndi:BPMNDiagram id="BPMNDiagram_${key}">
    <bpmndi:BPMNPlane id="BpmnPlane_${key}" bpmnElement="${key}">
    </bpmndi:BPMNPlane>
</bpmndi:BPMNDiagram>
</definitions>`
};
