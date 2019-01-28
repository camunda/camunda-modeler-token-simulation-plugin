'use strict';

var domClasses = require('min-dom').classes,
    domQuery = require('min-dom').query;

var TOGGLE_MODE_EVENT = require('bpmn-js-token-simulation/lib/util/EventHelper').TOGGLE_MODE_EVENT;

function HideModelerElements(eventBus) {
  var css = '.properties.hidden { display: none; } .tabs .tab.hidden { display: none; }',
      head = document.head,
      style = document.createElement('style');

  style.type = 'text/css';

  style.appendChild(document.createTextNode(css));

  head.appendChild(style);

  eventBus.on(TOGGLE_MODE_EVENT, function(context) {
    var simulationModeActive = context.simulationModeActive;

    var propertiesPanel = domQuery('.properties');
    var xmlTab = domQuery('[data-tab-id="xml"') || domQuery('.tabs a.tab:not(.active)');

    if (simulationModeActive) {
      domClasses(propertiesPanel).add('hidden');
      domClasses(xmlTab).add('hidden');
    } else {
      domClasses(propertiesPanel).remove('hidden');
      domClasses(xmlTab).remove('hidden');
    }
  });
}

HideModelerElements.$inject = [ 'eventBus' ];

module.exports = HideModelerElements;