'use strict';

module.exports = function(electronApp, menuState) {
  return [{
    label: 'Toggle Token Simulation',
    accelerator: 't',
    enabled: function() {

      // only enabled for BPMN diagrams
      return menuState.bpmn && menuState.platform == 'platform' && menuState.inactiveInput;
    },
    action: function() {
      electronApp.emit('menu:action', 'toggleTokenSimulation');
    }
  }, {
    label: 'Play/Pause Simulation',
    accelerator: 'Space',
    enabled: function() {

      // only enabled for BPMN diagrams
      return menuState.bpmn && menuState.platform == 'platform' && menuState.inactiveInput;
    },
    action: function() {
      electronApp.emit('menu:action', 'togglePauseTokenSimulation');
    }
  }, {
    label: 'Reset Simulation',
    accelerator: 'r',
    enabled: function() {

      // only enabled for BPMN diagrams
      return menuState.bpmn && menuState.platform == 'platform' && menuState.inactiveInput;
    },
    action: function() {
      electronApp.emit('menu:action', 'resetTokenSimulation');
    }
  }];
};
