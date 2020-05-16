import registerAnchor from './anchor';
import registerControlPoint from './controlPoint';
import registerNode from './node';
import registerBpmFlowNode from './bpmNode';
import registerWorkFlowNode from './workNode';
import registerEdge from './edge';
import registerSubProcess from './subProcess';
import registerPool from './pool';

export default function (G6) {
  registerAnchor(G6);
  registerControlPoint(G6);
  registerNode(G6);
  registerBpmFlowNode(G6);
  registerWorkFlowNode(G6);
  registerEdge(G6);
  registerSubProcess(G6);
  registerPool(G6);
}
