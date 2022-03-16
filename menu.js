'use strict';

module.exports = function (electronApp, menuState) {
  return [{
    label: 'Toggle Token Simulation',
    accelerator: 't',
    enabled: () => menuState.bpmn && menuState.inactiveInput,
    action: function () {
      electronApp.emit('menu:action', 'toggleTokenSimulation');
    }
  }, {
    label: 'Play/Pause Simulation',
    accelerator: 'Space',
    enabled: () => menuState.bpmn && menuState.inactiveInput,
    action: function () {
      electronApp.emit('menu:action', 'togglePauseTokenSimulation');
    }
  }, {
    label: 'Reset Simulation',
    accelerator: 'r',
    enabled: () => menuState.bpmn && menuState.inactiveInput,
    action: function () {
      electronApp.emit('menu:action', 'resetTokenSimulation');
    }
  }];
};
