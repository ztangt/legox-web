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
<process id="lcDLCBM5" name="lc的流程编码5" isExecutable="true">
    <startEvent id="Event_1vcf1l8" name="开始">
    </startEvent>
    <endEvent id="Event_0y2tfbo" name="结束">
    </endEvent>
    <exclusiveGateway id="Gateway_1e5u110">
    </exclusiveGateway>
    <sequenceFlow id="Flow_0foz8p2" sourceRef="Event_1vcf1l8" targetRef="Gateway_1e5u110" />
    <sequenceFlow id="Flow_1nxo6kp" sourceRef="Gateway_1e5u110" targetRef="Event_0y2tfbo">
    </sequenceFlow>
  </process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_lcDLCBM5">
    <bpmndi:BPMNPlane id="BpmnPlane_lcDLCBM5" bpmnElement="lcDLCBM5">
      <bpmndi:BPMNShape id="Event_1vcf1l8_di" bpmnElement="Event_1vcf1l8">
        <omgdc:Bounds x="182" y="232" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <omgdc:Bounds x="190" y="275" width="23" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Gateway_1e5u110_di" bpmnElement="Gateway_1e5u110" isMarkerVisible="true">
        <omgdc:Bounds x="265" y="225" width="50" height="50" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_0y2tfbo_di" bpmnElement="Event_0y2tfbo">
        <omgdc:Bounds x="382" y="232" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <omgdc:Bounds x="390" y="275" width="23" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</definitions>`
};
