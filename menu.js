'use strict';

module.exports = function (electronApp, menuState) {
  return [{
    label: 'Toggle Token Simulation',
    accelerator: 't',
    enabled: () => isEnabled(menuState),
    action: function () {
      electronApp.emit('menu:action', 'toggleTokenSimulation');
    }
  }, {
    label: 'Play/Pause Simulation',
    accelerator: 'Space',
    enabled: () => isEnabled(menuState),
    action: function () {
      electronApp.emit('menu:action', 'togglePauseTokenSimulation');
    }
  }, {
    label: 'Reset Simulation',
    accelerator: 'r',
    enabled: () => isEnabled(menuState),
    action: function () {
      electronApp.emit('menu:action', 'resetTokenSimulation');
    }
  }];
};

function isEnabled(menuState) {

  // backwards compatibility pre platform flag
  const isValidPlatform = !(menuState && menuState.platform === 'cloud');

  // only enabled for bpmn
  return menuState.bpmn && isValidPlatform && menuState.inactiveInput;
}