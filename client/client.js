import {
  registerBpmnJSPlugin
} from 'camunda-modeler-plugin-helpers';

import TokenSimulationModule from 'bpmn-js-token-simulation';
import HideModelerElements from './HideModelerElements';
import BreakpointsMode from './BreakpointsMode';

const TokenSimulationPluginModule = {
  __init__: [ 'hideModelerElements', 'breakpointsMode' ],
  hideModelerElements: [ 'type', HideModelerElements ],
  breakpointsMode: ['type', BreakpointsMode ]
};


registerBpmnJSPlugin(TokenSimulationModule);
registerBpmnJSPlugin(TokenSimulationPluginModule);
