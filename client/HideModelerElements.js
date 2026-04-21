import {
  classes as domClasses,
  query as domQuery
} from 'min-dom';

import {
  TOGGLE_MODE_EVENT
} from 'bpmn-js-token-simulation/lib/util/EventHelper';


export default function HideModelerElements(eventBus, toggleMode) {

  // use visibility + pointer-events for toggle buttons to prevent layout shift
  var css = '.properties.hidden, .side-panel.hidden, .variables-side-panel.hidden { display: none !important; } .tabs-container + div.hidden { visibility: hidden; pointer-events: none; }',
      head = document.head,
      style = document.createElement('style');

  style.type = 'text/css';

  style.appendChild(document.createTextNode(css));

  head.appendChild(style);

  eventBus.on('saveXML.start', 5000, function() {

    // disable simulation before saving
    if (toggleMode.active) {
      toggleMode.toggleMode();
    }
  });

  eventBus.on(TOGGLE_MODE_EVENT, function(context) {
    var active = context.active;

    var propertiesPanel = domQuery('.properties');
    var sidePanel = domQuery('.side-panel');
    var variablesSidePanel = domQuery('.variables-side-panel');
    var panelToggleButtons = domQuery('.tabs-container + div');

    var elements = [ propertiesPanel, sidePanel, variablesSidePanel, panelToggleButtons ].filter(Boolean);

    elements.forEach(function(el) {
      if (active) {
        domClasses(el).add('hidden');
      } else {
        domClasses(el).remove('hidden');
      }
    });
  });
}

HideModelerElements.$inject = [
  'eventBus',
  'toggleMode'
];
