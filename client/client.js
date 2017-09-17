var registerBpmnJSPlugin = require('camunda-modeler-plugin-helpers').registerBpmnJSPlugin;

var tokenSimulation = require('bpmn-js-token-simulation'),
    HideModelerElements = require('./HideModelerElements');

tokenSimulation.__init__.push('hideModelerElements');
tokenSimulation.hideModelerElements = [ 'type', HideModelerElements ];

registerBpmnJSPlugin(tokenSimulation);
