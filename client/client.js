var registerBpmnJSPlugin = require('camunda-modeler-plugin-helpers').registerBpmnJSPlugin;

var tokenSimulation = require('bpmn-js-token-simulation'),
    HidePropertiesPanel = require('./HidePropertiesPanel');

tokenSimulation.__init__.push('hidePropertiesPanel');
tokenSimulation.hidePropertiesPanel = [ 'type', HidePropertiesPanel ];

registerBpmnJSPlugin(tokenSimulation);
