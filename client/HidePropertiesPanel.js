'use strict';

var domClasses = require('min-dom/lib/classes'),
    domQuery = require('min-dom/lib/query');

var TOGGLE_MODE_EVENT = require('bpmn-js-token-simulation/lib/util/EventHelper').TOGGLE_MODE_EVENT;

function HidePropertiesPanel(eventBus) {
  var css = '.properties.hidden { display: none; }',
      head = document.head,
      style = document.createElement('style');

  style.type = 'text/css';

  style.appendChild(document.createTextNode(css));

  head.appendChild(style);

  eventBus.on(TOGGLE_MODE_EVENT, function(context) {
    var simulationModeActive = context.simulationModeActive;

    var propertiesPanel = domQuery('.properties');

    if (simulationModeActive) {
      domClasses(propertiesPanel).add('hidden');
    } else {
      domClasses(propertiesPanel).remove('hidden');
    }
  });
}

HidePropertiesPanel.$inject = [ 'eventBus' ];

module.exports = HidePropertiesPanel;