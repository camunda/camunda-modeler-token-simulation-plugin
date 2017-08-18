'use strict';

module.exports = function(electronApp, menuState) {
  return [{
    label: 'Toggle Darlene',
    accelerator: 'CommandOrControl+d',
    enabled: function() {

      // only enabled for BPMN diagrams
      return menuState.bpmn;
    },
    action: function() {

      // will be forwarded to bpmn-js eventually
      electronApp.emit('menu:action', 'toggleDarlene');
    }
  }, {
    label: 'Say "Hello"',
    accelerator: 'CommandOrControl+t',
    enabled: function() {

      // only enabled for BPMN diagrams
      return menuState.bpmn;
    },
    action: function() {

      // will be forwarded to bpmn-js eventually
      electronApp.emit('menu:action', 'sayHello');
    }
  }, {
    label: 'Say "Bye"',
    accelerator: 'CommandOrControl+r',
    enabled: function() {

      // only enabled for BPMN diagrams
      return menuState.bpmn;
    },
    action: function() {

      // will be forwarded to bpmn-js eventually
      electronApp.emit('menu:action', 'sayThankYou');
    }
  }];
};
