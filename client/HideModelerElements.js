import {
  classes as domClasses,
  query as domQuery
} from 'min-dom';

import {
  TOGGLE_MODE_EVENT
} from 'bpmn-js-token-simulation/lib/util/EventHelper';


export default function HideModelerElements(eventBus, toggleMode) {
  var css = '.properties.hidden { display: none; } .tabs .tab.hidden { display: none; }',
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

    if (active) {
      domClasses(propertiesPanel).add('hidden');
    } else {
      domClasses(propertiesPanel).remove('hidden');
    }
  });
}

HideModelerElements.$inject = [
  'eventBus',
  'toggleMode'
];