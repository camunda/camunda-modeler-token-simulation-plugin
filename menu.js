'use strict';

module.exports = function (electronApp, menuState) {

  function enabled() {
    return menuState.bpmn && (
      'canvasFocused' in menuState
        ? menuState.canvasFocused
        : menuState.inactiveInput
    );
  }

  return [{
    label: 'Toggle Token Simulation',
    accelerator: 't',
    enabled,
    action: function () {
      electronApp.emit('menu:action', 'toggleTokenSimulation');
    }
  }, {
    label: 'Play/Pause Simulation',
    accelerator: 'Space',
    enabled,
    action: function () {
      electronApp.emit('menu:action', 'togglePauseTokenSimulation');
    }
  }, {
    label: 'Reset Simulation',
    accelerator: 'r',
    enabled,
    action: function () {
      electronApp.emit('menu:action', 'resetTokenSimulation');
    }
  }];
};
