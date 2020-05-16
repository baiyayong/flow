function tab(len) {
  return [...Array(len)].map(() => " ").join("");
}
export function exportXML(json, canvas) {
  console.log(json, canvas, "mnnmmm");
  const id = canvas.id || "flow";
  const name = canvas.name || "flow";
  let BPMNShape = "";
  let BPMNEdge = "";

  let processXML = `${tab(2)}<process id="${id}" name="${name}">\n`;
  json.nodes.forEach(node => {
    BPMNShape +=
      `${tab(6)}<bpmndi:BPMNShape bpmnElement="${node.id}" id="BPMNShape_${node.id}">\n` +
      `${tab(8)}<omgdc:Bounds width="${node.size[0]}" height="${node.size[1]}" x="${node.x}" y="${
        node.y
      }"></omgdc:Bounds>\n` +
      `${tab(6)}</bpmndi:BPMNShape>\n`;
    switch (node.clazz) {
      case "start":
        processXML += `${tab(4)}<startEvent id="${node.id}"></startEvent>\n`;
        break;
      case "end":
        processXML += `${tab(4)}<endEvent id="${node.id}"></endEvent>\n`;
        break;
      case "userTask": {
        let assignments = "";
        if (node.assignValue && node.assignValue.length > 0) {
          if (node.assignType === "person") {
            assignments += `flowable:candidateUsers="${node.assignValue.join(",")}"`;
          } else if (node.assignType === "persongroup") {
            assignments += `flowable:candidateGroups="${node.assignValue.join(",")}"`;
          }
        }
        processXML += `${tab(4)}<userTask id="${node.id}" name="${node.label}" ${assignments}>
         <extensionElements>
			     	<activiti:taskListener event="create" class="com.bp.manage.engine.bpm.listener.UserTaskCreateListenerAction"></activiti:taskListener>
				    <activiti:taskListener event="complete" class="com.bp.manage.engine.bpm.listener.UserTaskCompleteListenerAction"></activiti:taskListener>
         </extensionElements>
       </userTask>\n`;
        break;
      }
      case "javaTask": {
        let javaClass = "";
        if (node.javaClass) {
          javaClass = `flowable:class="${node.javaClass}"`;
        }
        processXML += `${tab(4)}<serviceTask id="${node.id}" name="${
          node.label
        }" ${javaClass}></serviceTask>\n`;
        break;
      }
      case "scriptTask": {
        let script = "";
        if (node.script) {
          script = `${tab(6)}<script><![CDATA[${node.script}]]></script>\n`;
        }
        processXML += `${tab(4)}<scriptTask id="${node.id}" name="${node.label}">\n${script}${tab(
          4
        )}</scriptTask>\n`;
        break;
      }
      case "receiveTask":
        processXML += `${tab(4)}<receiveTask id="${node.id}" name="${node.label}"></receiveTask>\n`;
        break;
      case "mailTask": {
        let to = `${tab(8)}<flowable:field name="to">\n`;
        to += `${tab(10)}<flowable:string><![CDATA[${node.to}]]></flowable:string>\n`;
        to += `${tab(8)}</flowable:field>\n`;
        let subject = `${tab(8)}<flowable:field name="subject">\n`;
        subject += `${tab(10)}<flowable:string><![CDATA[${node.subject}]]></flowable:string>\n`;
        subject += `${tab(8)}</flowable:field>\n`;
        let text = `${tab(8)}<flowable:field name="text">\n`;
        text += `${tab(10)}<flowable:string><![CDATA[${node.content}]]></flowable:string>\n`;
        text += `${tab(8)}</flowable:field>\n`;
        const extension = `${tab(6)}<extensionElements>\n${to}${subject}${text}${tab(
          6
        )}</extensionElements>\n`;
        processXML += `${tab(4)}<serviceTask id="${node.id}" name="${
          node.label
        }" flowable:type="mail">\n${extension}${tab(4)}</serviceTask>\n`;
        break;
      }
      case "timerStart": {
        const timer = `${tab(6)}<timerEventDefinition>\n${tab(8)}<timeCycle>${
          node.cycle
        }</timeCycle>\n${tab(6)}</timerEventDefinition>\n`;
        processXML += `${tab(4)}<startEvent id="${node.id}" isInterrupting="false">\n${timer}${tab(
          4
        )}</startEvent>\n`;
        break;
      }
      case "timerCatch": {
        const timer = `${tab(6)}<timerEventDefinition>\n${tab(8)}<timeCycle>${
          node.cycle
        }</timeCycle>\n${tab(6)}</timerEventDefinition>\n`;
        processXML += `${tab(4)}<intermediateCatchEvent id="${node.id}">\n${timer}${tab(
          4
        )}</intermediateCatchEvent>\n`;
        break;
      }
      case "signalStart": {
        const signal = `${tab(6)}<signalEventDefinition signalRef="${
          node.signal
        }"></signalEventDefinition>\n`;
        processXML += `${tab(4)}<startEvent id="${node.id}" isInterrupting="true">\n${signal}${tab(
          4
        )}</startEvent>\n`;
        break;
      }
      case "signalCatch": {
        const signal = `${tab(6)}<signalEventDefinition signalRef="${
          node.signal
        }"></signalEventDefinition>\n`;
        processXML += `${tab(4)}<intermediateCatchEvent id="${node.id}">\n${signal}${tab(
          4
        )}</intermediateCatchEvent>\n`;
        break;
      }
      case "messageStart": {
        const message = `${tab(6)}<messageEventDefinition messageRef="${
          node.message
        }"></messageEventDefinition>\n`;
        processXML += `${tab(4)}<startEvent id="${node.id}" isInterrupting="true">\n${message}${tab(
          4
        )}</startEvent>\n`;
        break;
      }
      case "messageCatch": {
        const message = `${tab(6)}<messageEventDefinition messageRef="${
          node.message
        }"></messageEventDefinition>\n`;
        processXML += `${tab(4)}<intermediateCatchEvent id="${node.id}">\n${message}${tab(
          4
        )}</intermediateCatchEvent>\n`;
        break;
      }
      case "gateway":
        processXML += `${tab(4)}<exclusiveGateway id="${node.id}" name="${
          node.label
        }"></exclusiveGateway>\n`;
        break;
      case "exclusiveGateway":
        processXML += `${tab(4)}<exclusiveGateway id="${node.id}" name="${
          node.label
        }"></exclusiveGateway>\n`;
        break;
      case "parallelGateway":
        processXML += `${tab(4)}<parallelGateway id="${node.id}" name="${
          node.label
        }"></parallelGateway>\n`;
        break;
      case "inclusiveGateway":
        processXML += `${tab(4)}<inclusiveGateway id="${node.id}" name="${
          node.label
        }"></inclusiveGateway>\n`;
        break;
      default:
        break;
    }
  });
  json.edges.forEach(edge => {
    BPMNEdge +=
      `${tab(6)}<bpmndi:BPMNEdge bpmnElement="${edge.source}_${edge.sourceAnchor}-${edge.target}_${
        edge.targetAnchor
      }" ` +
      `id="BPMNEdge_${edge.source}_${edge.sourceAnchor}-${edge.target}_${edge.targetAnchor}">\n` +
      `${tab(8)}<omgdi:waypoint x="${edge.startPoint.x}" y="${
        edge.startPoint.y
      }"></omgdi:waypoint>\n` +
      `${tab(8)}<omgdi:waypoint x="${edge.endPoint.x}" y="${edge.endPoint.y}"></omgdi:waypoint>\n` +
      `${tab(6)}</bpmndi:BPMNEdge>\n`;
    let condition = "";
    if (edge.label) {
      condition = `${tab(6)}<conditionExpression xsi:type="tFormalExpression"><![CDATA[${
        edge.rules
      }]]></conditionExpression>\n`;
    }
    processXML += `${tab(4)}<sequenceFlow name="${edge.label}" id="${edge.source}_${
      edge.sourceAnchor
    }-${edge.target}_${edge.targetAnchor}" sourceRef="${edge.source}" targetRef="${
      edge.target
    }">\n${condition}</sequenceFlow>\n`;
  });
  processXML += `${tab(2)}</process>\n`;

  let xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n';
  xml +=
    '<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:activiti="http://activiti.org/bpmn" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC" xmlns:omgdi="http://www.omg.org/spec/DD/20100524/DI" xmlns:tns="http://www.activiti.org/test" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" expressionLanguage="http://www.w3.org/1999/XPath" id="m1500972151491" name="" targetNamespace="http://www.activiti.org/test" typeLanguage="http://www.w3.org/2001/XMLSchema">\n';
  xml += processXML;
  xml += "</definitions>";
  return xml;
}
