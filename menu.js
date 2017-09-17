'use strict';

module.exports = function(electronApp, menuState) {
  return [{
    label: 'Toggle Token Simulation',
    accelerator: 't',
    enabled: function() {

      // only enabled for BPMN diagrams
      return menuState.bpmn;
    },
    action: function() {

      // will be forwarded to bpmn-js eventually
      electronApp.emit('menu:action', 'toggleTokenSimulation');
    }
  }];
};
