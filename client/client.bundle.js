/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./client/client.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./client/HideModelerElements.js":
/*!***************************************!*\
  !*** ./client/HideModelerElements.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var domClasses = __webpack_require__(/*! min-dom */ "./node_modules/min-dom/dist/index.esm.js").classes,
    domQuery = __webpack_require__(/*! min-dom */ "./node_modules/min-dom/dist/index.esm.js").query;

var TOGGLE_MODE_EVENT = __webpack_require__(/*! bpmn-js-token-simulation/lib/util/EventHelper */ "./node_modules/bpmn-js-token-simulation/lib/util/EventHelper.js").TOGGLE_MODE_EVENT;

function HideModelerElements(eventBus) {
  var css = '.properties.hidden { display: none; } .tabs .tab.hidden { display: none; }',
      head = document.head,
      style = document.createElement('style');

  style.type = 'text/css';

  style.appendChild(document.createTextNode(css));

  head.appendChild(style);

  eventBus.on(TOGGLE_MODE_EVENT, function (context) {
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

HideModelerElements.$inject = ['eventBus'];

module.exports = HideModelerElements;

/***/ }),

/***/ "./client/client.js":
/*!**************************!*\
  !*** ./client/client.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var registerBpmnJSPlugin = __webpack_require__(/*! camunda-modeler-plugin-helpers */ "./node_modules/camunda-modeler-plugin-helpers/index.js").registerBpmnJSPlugin;

var tokenSimulation = __webpack_require__(/*! bpmn-js-token-simulation */ "./node_modules/bpmn-js-token-simulation/index.js"),
    HideModelerElements = __webpack_require__(/*! ./HideModelerElements */ "./client/HideModelerElements.js");

tokenSimulation.__init__.push('hideModelerElements');
tokenSimulation.hideModelerElements = ['type', HideModelerElements];

registerBpmnJSPlugin(tokenSimulation);

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/index.js":
/*!********************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/index.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./lib/modeler */ "./node_modules/bpmn-js-token-simulation/lib/modeler.js");

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/animation/Animation.js":
/*!**************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/animation/Animation.js ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var SVG = __webpack_require__(/*! svg.js */ "./node_modules/svg.js/dist/svg.js");

var domQuery = __webpack_require__(/*! min-dom/lib/query */ "./node_modules/bpmn-js-token-simulation/node_modules/min-dom/lib/query.js");

var events = __webpack_require__(/*! ../util/EventHelper */ "./node_modules/bpmn-js-token-simulation/lib/util/EventHelper.js"),
    RESET_SIMULATION_EVENT = events.RESET_SIMULATION_EVENT,
    PLAY_SIMULATION_EVENT = events.PLAY_SIMULATION_EVENT,
    PAUSE_SIMULATION_EVENT = events.PAUSE_SIMULATION_EVENT,
    TERMINATE_EVENT = events.TERMINATE_EVENT,
    PROCESS_INSTANCE_FINISHED_EVENT = events.PROCESS_INSTANCE_FINISHED_EVENT,
    ANIMATION_CREATED_EVENT = events.ANIMATION_CREATED_EVENT;

var isAncestor = __webpack_require__(/*! ../util/ElementHelper */ "./node_modules/bpmn-js-token-simulation/lib/util/ElementHelper.js").isAncestor;

var geometryUtil = __webpack_require__(/*! ../util/GeometryUtil */ "./node_modules/bpmn-js-token-simulation/lib/util/GeometryUtil.js"),
    distance = geometryUtil.distance;

function isFirstSegment(index) {
  return index === 1;
}

function isSingleSegment(waypoints) {
  return waypoints.length == 2;
}

var DELAY = 0;

var EASE_LINEAR = '-',
    EASE_IN = '<',
    EASE_IN_OUT = '<>';

var TOKEN_SIZE = 20;

function Animation(canvas, eventBus) {
  var self = window.animation = this;

  this._eventBus = eventBus;
  this.animations = [];
  this.hiddenAnimations = [];

  this.animationSpeed = 1;

  eventBus.on('import.done', function () {
    var draw = SVG(canvas._svg);

    var viewport = domQuery('.viewport', canvas._svg);

    var groupParent = SVG.adopt(viewport);

    self.group = draw.group().attr('id', 'token-simulation');

    groupParent.put(self.group);
  });

  eventBus.on(TERMINATE_EVENT, function (context) {
    var element = context.element,
        parent = element.parent;

    self.animations.forEach(function (animation) {
      if (isAncestor(parent, animation.element)) {

        // remove token
        animation.animation.stop();

        self.animations = self.animations.filter(function (a) {
          return a !== animation;
        });
      }
    });
  });

  eventBus.on(PROCESS_INSTANCE_FINISHED_EVENT, function (context) {
    var parent = context.parent;

    self.animations.forEach(function (animation) {
      if (context.processInstanceId === animation.processInstanceId || isAncestor(parent, animation.element)) {

        // remove token
        animation.animation.stop();

        self.animations = self.animations.filter(function (a) {
          return a !== animation;
        });
      }
    });
  });

  eventBus.on(RESET_SIMULATION_EVENT, function () {
    self.animations.forEach(function (animation) {
      animation.animation.stop();
    });

    self.animations = [];
    self.hiddenAnimations = [];
  });

  eventBus.on(PAUSE_SIMULATION_EVENT, function () {
    self.animations.forEach(function (animation) {
      animation.animation.pause();
    });
  });

  eventBus.on(PLAY_SIMULATION_EVENT, function () {
    self.animations.forEach(function (animation) {
      animation.animation.play();
    });
  });
}

Animation.prototype.createAnimation = function (connection, processInstanceId, done) {
  var self = this;

  if (!this.group) {
    return;
  }

  var tokenGfx = this._createTokenGfx(processInstanceId);

  var animation;

  animation = new _Animation(tokenGfx, connection.waypoints, function () {
    self.animations = self.animations.filter(function (a) {
      return a.animation !== animation;
    });

    if (done) {
      done();
    }
  });

  if (this.hiddenAnimations.includes(processInstanceId)) {
    tokenGfx.hide();
  }

  tokenGfx.fx._speed = this.animationSpeed;

  this.animations.push({
    tokenGfx: tokenGfx,
    animation: animation,
    element: connection,
    processInstanceId: processInstanceId
  });

  this._eventBus.fire(ANIMATION_CREATED_EVENT, {
    tokenGfx: tokenGfx,
    animation: animation,
    element: connection,
    processInstanceId: processInstanceId
  });

  return animation;
};

Animation.prototype.setAnimationSpeed = function (speed) {
  this.animations.forEach(function (animation) {
    animation.tokenGfx.fx._speed = speed;
  });

  this.animationSpeed = speed;
};

Animation.prototype._createTokenGfx = function (processInstanceId) {
  var parent = this.group.group().attr('class', 'token').hide();

  parent.circle(TOKEN_SIZE, TOKEN_SIZE).attr('fill', '#52b415').attr('class', 'circle');

  parent.text(processInstanceId.toString()).attr('transform', 'translate(10, -7)').attr('text-anchor', 'middle').attr('class', 'text');

  return parent;
};

Animation.prototype.showProcessInstanceAnimations = function (processInstanceId) {
  this.animations.forEach(function (animation) {
    if (animation.processInstanceId === processInstanceId) {
      animation.tokenGfx.show();
    }
  });

  this.hiddenAnimations = this.hiddenAnimations.filter(function (id) {
    return id !== processInstanceId;
  });
};

Animation.prototype.hideProcessInstanceAnimations = function (processInstanceId) {
  this.animations.forEach(function (animation) {
    if (animation.processInstanceId === processInstanceId) {
      animation.tokenGfx.hide();
    }
  });

  this.hiddenAnimations.push(processInstanceId);
};

Animation.$inject = ['canvas', 'eventBus'];

module.exports = Animation;

function _Animation(gfx, waypoints, done) {
  this.gfx = this.fx = gfx;
  this.waypoints = waypoints;
  this.done = done;

  this.create();
}

_Animation.prototype.create = function () {
  var gfx = this.gfx,
      waypoints = this.waypoints,
      done = this.done,
      fx = this.fx;

  gfx.show().move(waypoints[0].x - TOKEN_SIZE / 2, waypoints[0].y - TOKEN_SIZE / 2);

  waypoints.forEach(function (waypoint, index) {
    if (index > 0) {
      var x = waypoint.x - TOKEN_SIZE / 2,
          y = waypoint.y - TOKEN_SIZE / 2;

      var ease = isFirstSegment(index) ? EASE_IN : EASE_LINEAR;

      if (isSingleSegment(waypoints)) {
        ease = EASE_IN_OUT;
      }

      var duration = distance(waypoints[index - 1], waypoint) * 20;

      fx = fx.animate(duration, ease, DELAY).move(x, y);
    }
  });

  fx.after(function () {
    gfx.remove();

    done();
  });
};

_Animation.prototype.play = function () {
  this.gfx.play();
};

_Animation.prototype.pause = function () {
  this.gfx.pause();
};

_Animation.prototype.stop = function () {
  this.fx.stop();
  this.gfx.remove();
};

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/context-pads/ContextPads.js":
/*!****************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/context-pads/ContextPads.js ***!
  \****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var elementHelper = __webpack_require__(/*! ../../util/ElementHelper */ "./node_modules/bpmn-js-token-simulation/lib/util/ElementHelper.js"),
    isAncestor = elementHelper.isAncestor;

var events = __webpack_require__(/*! ../../util/EventHelper */ "./node_modules/bpmn-js-token-simulation/lib/util/EventHelper.js"),
    TOGGLE_MODE_EVENT = events.TOGGLE_MODE_EVENT,
    RESET_SIMULATION_EVENT = events.RESET_SIMULATION_EVENT,
    TERMINATE_EVENT = events.TERMINATE_EVENT,
    UPDATE_ELEMENTS_EVENT = events.UPDATE_ELEMENTS_EVENT,
    UPDATE_ELEMENT_EVENT = events.UPDATE_ELEMENT_EVENT,
    PROCESS_INSTANCE_SHOWN_EVENT = events.PROCESS_INSTANCE_SHOWN_EVENT;

var BoundaryEventHandler = __webpack_require__(/*! ./handler/BoundaryEventHandler */ "./node_modules/bpmn-js-token-simulation/lib/features/context-pads/handler/BoundaryEventHandler.js"),
    ExclusiveGatewayHandler = __webpack_require__(/*! ./handler/ExclusiveGatewayHandler */ "./node_modules/bpmn-js-token-simulation/lib/features/context-pads/handler/ExclusiveGatewayHandler.js"),
    IntermediateCatchEventHandler = __webpack_require__(/*! ./handler/IntermediateCatchEventHandler */ "./node_modules/bpmn-js-token-simulation/lib/features/context-pads/handler/IntermediateCatchEventHandler.js"),
    ProcessHandler = __webpack_require__(/*! ./handler/ProcessHandler */ "./node_modules/bpmn-js-token-simulation/lib/features/context-pads/handler/ProcessHandler.js"),
    StartEventHandler = __webpack_require__(/*! ./handler/StartEventHandler */ "./node_modules/bpmn-js-token-simulation/lib/features/context-pads/handler/StartEventHandler.js");

var LOW_PRIORITY = 500;

var OFFSET_TOP = -15,
    OFFSET_LEFT = -15;

function ContextPads(eventBus, elementRegistry, overlays, injector, canvas, processInstances) {
  var self = this;

  this._elementRegistry = elementRegistry;
  this._overlays = overlays;
  this._injector = injector;
  this._canvas = canvas;
  this._processInstances = processInstances;

  this.overlayIds = {};

  this.handlers = {};

  this.registerHandler('bpmn:ExclusiveGateway', ExclusiveGatewayHandler);
  this.registerHandler('bpmn:IntermediateCatchEvent', IntermediateCatchEventHandler);
  this.registerHandler('bpmn:SubProcess', ProcessHandler);
  this.registerHandler('bpmn:SubProcess', BoundaryEventHandler);
  this.registerHandler('bpmn:StartEvent', StartEventHandler);

  eventBus.on(TOGGLE_MODE_EVENT, LOW_PRIORITY, function (context) {
    var simulationModeActive = context.simulationModeActive;

    if (simulationModeActive) {
      self.openContextPads();
    } else {
      self.closeContextPads();
    }
  });

  eventBus.on(RESET_SIMULATION_EVENT, LOW_PRIORITY, function () {
    self.closeContextPads();
    self.openContextPads();
  });

  eventBus.on(TERMINATE_EVENT, LOW_PRIORITY, function (context) {
    var element = context.element,
        parent = element.parent;

    self.closeContextPads(parent);
  });

  eventBus.on(UPDATE_ELEMENTS_EVENT, LOW_PRIORITY, function (context) {
    var elements = context.elements;

    elements.forEach(function (element) {
      self.closeElementContextPads(element);
      self.openElementContextPads(element);
    });
  });

  eventBus.on(UPDATE_ELEMENT_EVENT, LOW_PRIORITY, function (context) {
    var element = context.element;

    self.closeElementContextPads(element);
    self.openElementContextPads(element);
  });

  eventBus.on(PROCESS_INSTANCE_SHOWN_EVENT, function (context) {
    var processInstanceId = context.processInstanceId;

    var processInstance = processInstances.getProcessInstance(processInstanceId),
        parent = processInstance.parent;

    self.closeContextPads(parent);
    self.openContextPads(parent);
  });
}

/**
 * Register a handler for an element type.
 * An element type can have multiple handlers.
 *
 * @param {String} type
 * @param {Object} handlerCls
 */
ContextPads.prototype.registerHandler = function (type, handlerCls) {
  var handler = this._injector.instantiate(handlerCls);

  if (!this.handlers[type]) {
    this.handlers[type] = [];
  }

  this.handlers[type].push(handler);
};

ContextPads.prototype.openContextPads = function (parent) {
  var self = this;

  if (!parent) {
    parent = this._canvas.getRootElement();
  }

  this._elementRegistry.forEach(function (element) {
    if (self.handlers[element.type] && isAncestor(parent, element)) {
      self.openElementContextPads(element);
    }
  });
};

ContextPads.prototype.openElementContextPads = function (element) {
  if (!this.handlers[element.type]) {
    return;
  }

  var elementContextPads = [];

  this.handlers[element.type].forEach(function (handler) {
    var contextPads = handler.createContextPads(element);

    if (contextPads) {
      contextPads.forEach(function (contextPad) {
        if (contextPad) {
          elementContextPads.push(contextPad);
        }
      });
    }
  });

  var self = this;

  elementContextPads.forEach(function (contextPad) {
    var position = { top: OFFSET_TOP, left: OFFSET_LEFT };

    var overlayId = self._overlays.add(contextPad.element, 'context-menu', {
      position: position,
      html: contextPad.html,
      show: {
        minZoom: 0.5
      }
    });

    self.overlayIds[contextPad.element.id] = overlayId;
  });
};

ContextPads.prototype.closeContextPads = function (parent) {
  var self = this;

  if (!parent) {
    parent = this._canvas.getRootElement();
  }

  this._elementRegistry.forEach(function (element) {
    if (isAncestor(parent, element)) {
      self.closeElementContextPads(element);
    }
  });
};

ContextPads.prototype.closeElementContextPads = function (element) {
  var self = this;

  if (element.attachers && element.attachers.length > 0) {
    element.attachers.forEach(function (attachedElement) {
      self.closeElementContextPads(attachedElement);
    });
  }
  if (element.children && element.children.length > 0) {
    element.children.forEach(function (child) {
      self.closeElementContextPads(child);
    });
  }

  var overlayId = this.overlayIds[element.id];

  if (!overlayId) {
    return;
  }

  this._overlays.remove(overlayId);

  delete this.overlayIds[element.id];
};

ContextPads.$inject = ['eventBus', 'elementRegistry', 'overlays', 'injector', 'canvas', 'processInstances'];

module.exports = ContextPads;

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/context-pads/handler/BoundaryEventHandler.js":
/*!*********************************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/context-pads/handler/BoundaryEventHandler.js ***!
  \*********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var domify = __webpack_require__(/*! min-dom/lib/domify */ "./node_modules/bpmn-js-token-simulation/node_modules/min-dom/lib/domify.js"),
    domEvent = __webpack_require__(/*! min-dom/lib/event */ "./node_modules/bpmn-js-token-simulation/node_modules/min-dom/lib/event.js");

var is = __webpack_require__(/*! ../../../util/ElementHelper */ "./node_modules/bpmn-js-token-simulation/lib/util/ElementHelper.js").is;

var events = __webpack_require__(/*! ../../../util/EventHelper */ "./node_modules/bpmn-js-token-simulation/lib/util/EventHelper.js"),
    GENERATE_TOKEN_EVENT = events.GENERATE_TOKEN_EVENT,
    UPDATE_ELEMENT_EVENT = events.UPDATE_ELEMENT_EVENT;

function BoundaryEventHandler(eventBus, processInstances, processInstanceSettings) {
  this._eventBus = eventBus;
  this._processInstances = processInstances;
  this._processInstanceSettings = processInstanceSettings;
}

BoundaryEventHandler.prototype.createContextPads = function (element) {
  if (!element.attachers.length) {
    return;
  }

  if (!this._processInstances.getProcessInstances(element).length) {
    return;
  }

  var incomingSequenceFlows = element.incoming.filter(function (incoming) {
    return is(incoming, 'bpmn:SequenceFlow');
  });

  var self = this;

  var contextPads = [];

  element.attachers.forEach(function (attachedElement) {
    var outgoingSequenceFlows = attachedElement.outgoing.filter(function (outgoing) {
      return is(outgoing, 'bpmn:SequenceFlow');
    });

    if (!incomingSequenceFlows.length || !outgoingSequenceFlows.length) {
      return;
    }

    var contextPad = domify('<div class="context-pad" title="Trigger Event"><i class="fa fa-play"></i></div>');

    contextPads.push({
      element: attachedElement,
      html: contextPad
    });

    domEvent.bind(contextPad, 'click', function () {

      self._processInstances.getProcessInstances(element).forEach(function (processInstance) {
        var parentProcessInstanceId = processInstance.parentProcessInstanceId;

        // interrupting
        if (attachedElement.businessObject.cancelActivity) {
          element.children.forEach(function (child) {
            if (child.tokenCount && child.tokenCount[processInstance.processInstanceId]) {
              child.tokenCount[processInstance.processInstanceId]--;
            }
          });

          // finish but do NOT remove
          self._processInstances.finish(processInstance.processInstanceId);

          self._eventBus.fire(UPDATE_ELEMENT_EVENT, {
            element: element
          });
        }

        self._eventBus.fire(GENERATE_TOKEN_EVENT, {
          element: attachedElement,
          processInstanceId: parentProcessInstanceId
        });
      });
    });
  });

  return contextPads;
};

BoundaryEventHandler.$inject = ['eventBus', 'processInstances', 'processInstanceSettings'];

module.exports = BoundaryEventHandler;

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/context-pads/handler/ExclusiveGatewayHandler.js":
/*!************************************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/context-pads/handler/ExclusiveGatewayHandler.js ***!
  \************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var is = __webpack_require__(/*! ../../../util/ElementHelper */ "./node_modules/bpmn-js-token-simulation/lib/util/ElementHelper.js").is;

var domify = __webpack_require__(/*! min-dom/lib/domify */ "./node_modules/bpmn-js-token-simulation/node_modules/min-dom/lib/domify.js"),
    domEvent = __webpack_require__(/*! min-dom/lib/event */ "./node_modules/bpmn-js-token-simulation/node_modules/min-dom/lib/event.js");

function ExclusiveGatewayHandler(exluciveGatewaySettings) {
  this._exclusiveGatewaySettings = exluciveGatewaySettings;
}

ExclusiveGatewayHandler.prototype.createContextPads = function (element) {
  var self = this;

  var outgoingSequenceFlows = element.outgoing.filter(function (outgoing) {
    return is(outgoing, 'bpmn:SequenceFlow');
  });

  if (outgoingSequenceFlows.length < 2) {
    return;
  }

  var contextPad = domify('<div class="context-pad" title="Set Sequence Flow"><i class="fa fa-code-fork"></i></div>');

  domEvent.bind(contextPad, 'click', function () {
    self._exclusiveGatewaySettings.setSequenceFlow(element);
  });

  return [{
    element: element,
    html: contextPad
  }];
};

ExclusiveGatewayHandler.$inject = ['exclusiveGatewaySettings'];

module.exports = ExclusiveGatewayHandler;

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/context-pads/handler/IntermediateCatchEventHandler.js":
/*!******************************************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/context-pads/handler/IntermediateCatchEventHandler.js ***!
  \******************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var domify = __webpack_require__(/*! min-dom/lib/domify */ "./node_modules/bpmn-js-token-simulation/node_modules/min-dom/lib/domify.js"),
    domEvent = __webpack_require__(/*! min-dom/lib/event */ "./node_modules/bpmn-js-token-simulation/node_modules/min-dom/lib/event.js");

var is = __webpack_require__(/*! ../../../util/ElementHelper */ "./node_modules/bpmn-js-token-simulation/lib/util/ElementHelper.js").is;

var events = __webpack_require__(/*! ../../../util/EventHelper */ "./node_modules/bpmn-js-token-simulation/lib/util/EventHelper.js"),
    GENERATE_TOKEN_EVENT = events.GENERATE_TOKEN_EVENT;

function IntermeditateCatchEventHandler(eventBus) {
  this._eventBus = eventBus;
}

IntermeditateCatchEventHandler.prototype.createContextPads = function (element) {
  var processInstanceId = element.parent.shownProcessInstance;

  var incomingSequenceFlows = element.incoming.filter(function (incoming) {
    return is(incoming, 'bpmn:SequenceFlow');
  });

  var eventBasedGatewaysHaveTokens = [];

  incomingSequenceFlows.forEach(function (incoming) {
    var source = incoming.source;

    if (is(source, 'bpmn:EventBasedGateway') && source.tokenCount && source.tokenCount[processInstanceId]) {
      eventBasedGatewaysHaveTokens.push(source);
    }
  });

  var outgoingSequenceFlows = element.outgoing.filter(function (outgoing) {
    return is(outgoing, 'bpmn:SequenceFlow');
  });

  if (!incomingSequenceFlows.length || !outgoingSequenceFlows.length) {
    return;
  }

  var self = this;

  var contextPad;

  if (element.tokenCount && element.tokenCount[processInstanceId]) {
    contextPad = domify('<div class="context-pad" title="Trigger Event"><i class="fa fa-play"></i></div>');

    domEvent.bind(contextPad, 'click', function () {
      element.tokenCount[processInstanceId]--;

      self._eventBus.fire(GENERATE_TOKEN_EVENT, {
        element: element,
        processInstanceId: processInstanceId
      });
    });
  } else if (eventBasedGatewaysHaveTokens.length) {
    contextPad = domify('<div class="context-pad" title="Trigger Event"><i class="fa fa-play"></i></div>');

    domEvent.bind(contextPad, 'click', function () {
      eventBasedGatewaysHaveTokens.forEach(function (eventBasedGateway) {
        eventBasedGateway.tokenCount[processInstanceId]--;
      });

      self._eventBus.fire(GENERATE_TOKEN_EVENT, {
        element: element,
        processInstanceId: processInstanceId
      });
    });
  } else {
    return;
  }

  return [{
    element: element,
    html: contextPad
  }];
};

IntermeditateCatchEventHandler.$inject = ['eventBus'];

module.exports = IntermeditateCatchEventHandler;

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/context-pads/handler/ProcessHandler.js":
/*!***************************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/context-pads/handler/ProcessHandler.js ***!
  \***************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var domify = __webpack_require__(/*! min-dom/lib/domify */ "./node_modules/bpmn-js-token-simulation/node_modules/min-dom/lib/domify.js"),
    domEvent = __webpack_require__(/*! min-dom/lib/event */ "./node_modules/bpmn-js-token-simulation/node_modules/min-dom/lib/event.js");

/**
 * Is used for subprocesses and participants.
 */
function ProcessHandler(processInstances, processInstanceSettings) {
  this._processInstances = processInstances;
  this._processInstanceSettings = processInstanceSettings;
}

ProcessHandler.prototype.createContextPads = function (element) {
  var self = this;

  var processInstances = this._processInstances.getProcessInstances(element).filter(function (processInstance) {
    return !processInstance.isFinished;
  });

  if (processInstances.length < 2) {
    return;
  }

  var contextPad = domify('<div class="context-pad" title="View Process Instances"><i class="fa fa-list-ol"></i></div>');

  domEvent.bind(contextPad, 'click', function () {
    self._processInstanceSettings.showNext(element);
  });

  return [{
    element: element,
    html: contextPad
  }];
};

ProcessHandler.$inject = ['processInstances', 'processInstanceSettings'];

module.exports = ProcessHandler;

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/context-pads/handler/StartEventHandler.js":
/*!******************************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/context-pads/handler/StartEventHandler.js ***!
  \******************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var domify = __webpack_require__(/*! min-dom/lib/domify */ "./node_modules/bpmn-js-token-simulation/node_modules/min-dom/lib/domify.js"),
    domEvent = __webpack_require__(/*! min-dom/lib/event */ "./node_modules/bpmn-js-token-simulation/node_modules/min-dom/lib/event.js");

var is = __webpack_require__(/*! ../../../util/ElementHelper */ "./node_modules/bpmn-js-token-simulation/lib/util/ElementHelper.js").is;

var events = __webpack_require__(/*! ../../../util/EventHelper */ "./node_modules/bpmn-js-token-simulation/lib/util/EventHelper.js"),
    GENERATE_TOKEN_EVENT = events.GENERATE_TOKEN_EVENT;

function StartEventHandler(eventBus, elementRegistry, animation) {
  this._eventBus = eventBus;
  this._elementRegistry = elementRegistry;
  this._animation = animation;
}

StartEventHandler.prototype.createContextPads = function (element) {
  var tokens = false;

  this._elementRegistry.forEach(function (element) {
    if (element.tokenCount) {
      Object.values(element.tokenCount).forEach(function (tokenCount) {
        if (tokenCount) {
          tokens = true;
        }
      });
    }
  });

  if (is(element.parent, 'bpmn:SubProcess') || tokens || this._animation.animations.length) {
    return;
  }

  var self = this;

  var contextPad = domify('<div class="context-pad"><i class="fa fa-play"></i></div>');

  domEvent.bind(contextPad, 'click', function () {
    self._eventBus.fire(GENERATE_TOKEN_EVENT, {
      element: element
    });
  });

  return [{
    element: element,
    html: contextPad
  }];
};

StartEventHandler.$inject = ['eventBus', 'elementRegistry', 'animation'];

module.exports = StartEventHandler;

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/context-pads/index.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/context-pads/index.js ***!
  \**********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./ContextPads */ "./node_modules/bpmn-js-token-simulation/lib/features/context-pads/ContextPads.js");

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/disable-modeling/DisableModeling.js":
/*!************************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/disable-modeling/DisableModeling.js ***!
  \************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var events = __webpack_require__(/*! ../../util/EventHelper */ "./node_modules/bpmn-js-token-simulation/lib/util/EventHelper.js"),
    TOGGLE_MODE_EVENT = events.TOGGLE_MODE_EVENT;

var HIGH_PRIORITY = 10001;

function DisableModeling(eventBus, contextPad, dragging, directEditing, editorActions, modeling, palette, paletteProvider) {
  var self = this;

  this._eventBus = eventBus;

  this.modelingDisabled = false;

  eventBus.on(TOGGLE_MODE_EVENT, HIGH_PRIORITY, function (context) {
    var simulationModeActive = context.simulationModeActive;

    self.modelingDisabled = simulationModeActive;

    if (self.modelingDisabled) {
      directEditing.cancel();
      contextPad.close();
      dragging.cancel();
    }

    palette._update();
  });

  function intercept(obj, fnName, cb) {
    var fn = obj[fnName];
    obj[fnName] = function () {
      return cb.call(this, fn, arguments);
    };
  }

  function ignoreIfModelingDisabled(obj, fnName) {
    intercept(obj, fnName, function (fn, args) {
      if (self.modelingDisabled) {
        return;
      }

      return fn.apply(this, args);
    });
  }

  function throwIfModelingDisabled(obj, fnName) {
    intercept(obj, fnName, function (fn, args) {
      if (self.modelingDisabled) {
        throw new Error('model is read-only');
      }

      return fn.apply(this, args);
    });
  }

  ignoreIfModelingDisabled(contextPad, 'open');

  ignoreIfModelingDisabled(dragging, 'init');

  ignoreIfModelingDisabled(directEditing, 'activate');

  ignoreIfModelingDisabled(dragging, 'init');

  ignoreIfModelingDisabled(directEditing, 'activate');

  throwIfModelingDisabled(modeling, 'moveShape');
  throwIfModelingDisabled(modeling, 'updateAttachment');
  throwIfModelingDisabled(modeling, 'moveElements');
  throwIfModelingDisabled(modeling, 'moveConnection');
  throwIfModelingDisabled(modeling, 'layoutConnection');
  throwIfModelingDisabled(modeling, 'createConnection');
  throwIfModelingDisabled(modeling, 'createShape');
  throwIfModelingDisabled(modeling, 'createLabel');
  throwIfModelingDisabled(modeling, 'appendShape');
  throwIfModelingDisabled(modeling, 'removeElements');
  throwIfModelingDisabled(modeling, 'distributeElements');
  throwIfModelingDisabled(modeling, 'removeShape');
  throwIfModelingDisabled(modeling, 'removeConnection');
  throwIfModelingDisabled(modeling, 'replaceShape');
  throwIfModelingDisabled(modeling, 'pasteElements');
  throwIfModelingDisabled(modeling, 'alignElements');
  throwIfModelingDisabled(modeling, 'resizeShape');
  throwIfModelingDisabled(modeling, 'createSpace');
  throwIfModelingDisabled(modeling, 'updateWaypoints');
  throwIfModelingDisabled(modeling, 'reconnectStart');
  throwIfModelingDisabled(modeling, 'reconnectEnd');

  intercept(editorActions, 'trigger', function (fn, args) {
    var action = args[0];

    if (self.modelingDisabled && isAnyAction(['undo', 'redo', 'copy', 'paste', 'removeSelection', 'spaceTool', 'lassoTool', 'globalConnectTool', 'distributeElements', 'alignElements', 'directEditing'], action)) {
      return;
    }

    return fn.apply(this, args);
  });
}

DisableModeling.$inject = ['eventBus', 'contextPad', 'dragging', 'directEditing', 'editorActions', 'modeling', 'palette', 'paletteProvider'];

module.exports = DisableModeling;

// helpers //////////

function isAnyAction(actions, action) {
  return actions.indexOf(action) > -1;
}

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/disable-modeling/index.js":
/*!**************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/disable-modeling/index.js ***!
  \**************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./DisableModeling */ "./node_modules/bpmn-js-token-simulation/lib/features/disable-modeling/DisableModeling.js");

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/editor-actions/EditorActions.js":
/*!********************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/editor-actions/EditorActions.js ***!
  \********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function EditorActions(eventBus, toggleMode, pauseSimulation, log, resetSimulation, editorActions) {
  editorActions.register({
    toggleTokenSimulation: function () {
      toggleMode.toggleMode();
    }
  });

  editorActions.register({
    togglePauseTokenSimulation: function () {
      pauseSimulation.toggle();
    }
  });

  editorActions.register({
    resetTokenSimulation: function () {
      resetSimulation.resetSimulation();
    }
  });

  editorActions.register({
    toggleTokenSimulationLog: function () {
      log.toggle();
    }
  });
}

EditorActions.$inject = ['eventBus', 'toggleMode', 'pauseSimulation', 'log', 'resetSimulation', 'editorActions'];

module.exports = EditorActions;

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/editor-actions/index.js":
/*!************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/editor-actions/index.js ***!
  \************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./EditorActions */ "./node_modules/bpmn-js-token-simulation/lib/features/editor-actions/EditorActions.js");

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/element-notifications/ElementNotifications.js":
/*!**********************************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/element-notifications/ElementNotifications.js ***!
  \**********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var domify = __webpack_require__(/*! min-dom/lib/domify */ "./node_modules/bpmn-js-token-simulation/node_modules/min-dom/lib/domify.js");

var events = __webpack_require__(/*! ../../util/EventHelper */ "./node_modules/bpmn-js-token-simulation/lib/util/EventHelper.js"),
    TOGGLE_MODE_EVENT = events.TOGGLE_MODE_EVENT,
    RESET_SIMULATION_EVENT = events.RESET_SIMULATION_EVENT,
    GENERATE_TOKEN_EVENT = events.GENERATE_TOKEN_EVENT;

var OFFSET_TOP = -15,
    OFFSET_RIGHT = 15;

function ElementNotifications(overlays, eventBus) {
  var self = this;

  this._overlays = overlays;

  eventBus.on(TOGGLE_MODE_EVENT, function (context) {
    var simulationModeActive = context.simulationModeActive;

    if (!simulationModeActive) {
      self.removeElementNotifications();
    }
  });

  eventBus.on([RESET_SIMULATION_EVENT, GENERATE_TOKEN_EVENT], function () {
    self.removeElementNotifications();
  });
}

ElementNotifications.prototype.addElementNotifications = function (elements, options) {
  var self = this;

  elements.forEach(function (element) {
    self.addElementNotification(element, options);
  });
};

ElementNotifications.prototype.addElementNotification = function (element, options) {
  var position = {
    top: OFFSET_TOP,
    right: OFFSET_RIGHT
  };

  var markup = '<div class="element-notification ' + (options.type || '') + '">' + (options.icon ? '<i class="fa ' + options.icon + '"></i>' : '') + ('<span class="text">' + options.text + '</span>' || false) + '</div>';

  var html = domify(markup);

  this._overlays.add(element, 'element-notification', {
    position: position,
    html: html,
    show: {
      minZoom: 0.5
    }
  });
};

ElementNotifications.prototype.removeElementNotifications = function (elements) {
  var self = this;

  if (!elements) {
    this._overlays.remove({ type: 'element-notification' });
  } else {
    elements.forEach(function (element) {
      self.removeElementNotification(element);
    });
  }
};

ElementNotifications.prototype.removeElementNotification = function (element) {
  this._overlays.remove({ element: element });
};

ElementNotifications.$inject = ['overlays', 'eventBus'];

module.exports = ElementNotifications;

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/element-notifications/index.js":
/*!*******************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/element-notifications/index.js ***!
  \*******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./ElementNotifications */ "./node_modules/bpmn-js-token-simulation/lib/features/element-notifications/ElementNotifications.js");

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/element-support/ElementSupport.js":
/*!**********************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/element-support/ElementSupport.js ***!
  \**********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var domClasses = __webpack_require__(/*! min-dom/lib/classes */ "./node_modules/bpmn-js-token-simulation/node_modules/min-dom/lib/classes.js");

var elementHelper = __webpack_require__(/*! ../../util/ElementHelper */ "./node_modules/bpmn-js-token-simulation/lib/util/ElementHelper.js"),
    is = elementHelper.is,
    SUPPORTED_ELEMENTS = elementHelper.supportedElements;

var events = __webpack_require__(/*! ../../util/EventHelper */ "./node_modules/bpmn-js-token-simulation/lib/util/EventHelper.js"),
    TOGGLE_MODE_EVENT = events.TOGGLE_MODE_EVENT,
    GENERATE_TOKEN_EVENT = events.GENERATE_TOKEN_EVENT;

var IGNORED_ELEMENTS = ['bpmn:Process', 'bpmn:Collaboration', 'bpmn:Participant', 'bpmn:Lane', 'bpmn:TextAnnotation'];

function isLabel(element) {
  return element.labelTarget;
}

function ElementSupport(eventBus, elementRegistry, canvas, notifications, elementNotifications) {
  var self = this;

  this._eventBus = eventBus;
  this._elementRegistry = elementRegistry;
  this._elementNotifications = elementNotifications;
  this._notifications = notifications;

  this.canvasParent = canvas.getContainer().parentNode;

  eventBus.on(GENERATE_TOKEN_EVENT, 20000, function (context) {
    var element = context.element;

    if (!is(element, 'bpmn:StartEvent')) {
      return;
    }

    if (!self.allElementsSupported()) {
      self.showWarnings();

      domClasses(self.canvasParent).add('warning');

      // cancel event
      return true;
    }
  });

  eventBus.on(TOGGLE_MODE_EVENT, function (context) {
    var simulationModeActive = context.simulationModeActive;

    if (!simulationModeActive) {
      domClasses(self.canvasParent).remove('warning');
    }
  });
}

ElementSupport.prototype.allElementsSupported = function () {
  var allElementsSupported = true;

  this._elementRegistry.forEach(function (element) {
    if (!is(element, IGNORED_ELEMENTS) && !is(element, SUPPORTED_ELEMENTS) && !isLabel(element)) {
      allElementsSupported = false;
    }
  });

  return allElementsSupported;
};

ElementSupport.prototype.showWarnings = function (elements) {
  var self = this;

  var warnings = [];

  this._elementRegistry.forEach(function (element) {
    if (!is(element, IGNORED_ELEMENTS) && !is(element, SUPPORTED_ELEMENTS) && !isLabel(element)) {
      self.showWarning(element);

      if (warnings.indexOf(element.type)) {
        self._notifications.showNotification(element.type + ' not supported', 'warning');

        warnings.push(element.type);
      }
    }
  });
};

ElementSupport.prototype.showWarning = function (element) {
  this._elementNotifications.addElementNotification(element, {
    type: 'warning',
    icon: 'fa-exclamation-triangle',
    text: 'Not supported'
  });
};

ElementSupport.$inject = ['eventBus', 'elementRegistry', 'canvas', 'notifications', 'elementNotifications'];

module.exports = ElementSupport;

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/element-support/index.js":
/*!*************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/element-support/index.js ***!
  \*************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./ElementSupport */ "./node_modules/bpmn-js-token-simulation/lib/features/element-support/ElementSupport.js");

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/exclusive-gateway-settings/ExclusiveGatewaySettings.js":
/*!*******************************************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/exclusive-gateway-settings/ExclusiveGatewaySettings.js ***!
  \*******************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var is = __webpack_require__(/*! ../../util/ElementHelper */ "./node_modules/bpmn-js-token-simulation/lib/util/ElementHelper.js").is;

var events = __webpack_require__(/*! ../../util/EventHelper */ "./node_modules/bpmn-js-token-simulation/lib/util/EventHelper.js"),
    TOGGLE_MODE_EVENT = events.TOGGLE_MODE_EVENT;

var NO_CONFIGURATION_COLOR = '#999';

function getNext(gateway) {
  var outgoing = gateway.outgoing.filter(isSequenceFlow);

  var index = outgoing.indexOf(gateway.sequenceFlow);

  if (outgoing[index + 1]) {
    return outgoing[index + 1];
  } else {
    return outgoing[0];
  }
}

function isSequenceFlow(connection) {
  return is(connection, 'bpmn:SequenceFlow');
}

function ExclusiveGatewaySettings(eventBus, elementRegistry, graphicsFactory) {
  var self = this;

  this._elementRegistry = elementRegistry;
  this._graphicsFactory = graphicsFactory;

  eventBus.on(TOGGLE_MODE_EVENT, function (context) {
    var simulationModeActive = context.simulationModeActive;

    if (!simulationModeActive) {
      self.resetSequenceFlows();
    } else {
      self.setSequenceFlowsDefault();
    }
  });
}

ExclusiveGatewaySettings.prototype.setSequenceFlowsDefault = function () {
  var self = this;

  var exclusiveGateways = this._elementRegistry.filter(function (element) {
    return is(element, 'bpmn:ExclusiveGateway');
  });

  exclusiveGateways.forEach(function (exclusiveGateway) {
    if (exclusiveGateway.outgoing.filter(isSequenceFlow).length) {
      self.setSequenceFlow(exclusiveGateway, exclusiveGateway.outgoing.filter(isSequenceFlow)[0]);
    }
  });
};

ExclusiveGatewaySettings.prototype.resetSequenceFlows = function () {
  var self = this;

  var exclusiveGateways = this._elementRegistry.filter(function (element) {
    return is(element, 'bpmn:ExclusiveGateway');
  });

  exclusiveGateways.forEach(function (exclusiveGateway) {
    if (exclusiveGateway.outgoing.filter(isSequenceFlow).length) {
      self.resetSequenceFlow(exclusiveGateway);
    }
  });
};

ExclusiveGatewaySettings.prototype.resetSequenceFlow = function (gateway) {
  if (gateway.sequenceFlow) {
    delete gateway.sequenceFlow;
  }
};

ExclusiveGatewaySettings.prototype.setSequenceFlow = function (gateway) {
  var self = this;

  var outgoing = gateway.outgoing.filter(isSequenceFlow);

  if (!outgoing.length) {
    return;
  }

  var sequenceFlow = gateway.sequenceFlow;

  if (sequenceFlow) {

    // set next sequence flow
    gateway.sequenceFlow = getNext(gateway);
  } else {

    // set first sequence flow
    gateway.sequenceFlow = outgoing[0];
  }

  // set colors
  gateway.outgoing.forEach(function (outgoing) {
    if (outgoing === gateway.sequenceFlow) {
      self.setColor(outgoing, '#000');
    } else {
      self.setColor(outgoing, NO_CONFIGURATION_COLOR);
    }
  });
};

ExclusiveGatewaySettings.prototype.setColor = function (sequenceFlow, color) {
  var businessObject = sequenceFlow.businessObject;

  businessObject.di.set('stroke', color);

  var gfx = this._elementRegistry.getGraphics(sequenceFlow);

  this._graphicsFactory.update('connection', sequenceFlow, gfx);
};

ExclusiveGatewaySettings.$inject = ['eventBus', 'elementRegistry', 'graphicsFactory'];

module.exports = ExclusiveGatewaySettings;

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/exclusive-gateway-settings/index.js":
/*!************************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/exclusive-gateway-settings/index.js ***!
  \************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./ExclusiveGatewaySettings */ "./node_modules/bpmn-js-token-simulation/lib/features/exclusive-gateway-settings/ExclusiveGatewaySettings.js");

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/keyboard-bindings/KeyboardBindings.js":
/*!**************************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/keyboard-bindings/KeyboardBindings.js ***!
  \**************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var events = __webpack_require__(/*! ../../util/EventHelper */ "./node_modules/bpmn-js-token-simulation/lib/util/EventHelper.js"),
    TOGGLE_MODE_EVENT = events.TOGGLE_MODE_EVENT,
    VERY_HIGH_PRIORITY = 10000;

function KeyboardBindings(eventBus, injector) {

  var editorActions = injector.get('editorActions', false),
      keyboard = injector.get('keyboard', false);

  if (!keyboard || !editorActions) {
    return;
  }

  var isActive = false;

  function handleKeyEvent(keyEvent) {
    if (isKey(['t', 'T'], keyEvent)) {
      editorActions.trigger('toggleTokenSimulation');

      return true;
    }

    if (!isActive) {
      return;
    }

    if (isKey(['l', 'L'], keyEvent)) {
      editorActions.trigger('toggleTokenSimulationLog');

      return true;
    }

    // see https://developer.mozilla.org/de/docs/Web/API/KeyboardEvent/key/Key_Values#Whitespace_keys
    if (isKey([' ', 'Spacebar'], keyEvent)) {
      editorActions.trigger('togglePauseTokenSimulation');

      return true;
    }

    if (isKey(['r', 'R'], keyEvent)) {
      editorActions.trigger('resetTokenSimulation');

      return true;
    }
  }

  eventBus.on('keyboard.init', function () {

    keyboard.addListener(VERY_HIGH_PRIORITY, function (event) {
      var keyEvent = event.keyEvent;

      handleKeyEvent(keyEvent);
    });
  });

  eventBus.on(TOGGLE_MODE_EVENT, function (context) {
    var simulationModeActive = context.simulationModeActive;

    if (simulationModeActive) {
      isActive = true;
    } else {
      isActive = false;
    }
  });
}

KeyboardBindings.$inject = ['eventBus', 'injector'];

module.exports = KeyboardBindings;

// helpers //////////

function isKey(keys, event) {
  return keys.indexOf(event.key) > -1;
}

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/keyboard-bindings/index.js":
/*!***************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/keyboard-bindings/index.js ***!
  \***************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./KeyboardBindings */ "./node_modules/bpmn-js-token-simulation/lib/features/keyboard-bindings/KeyboardBindings.js");

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/log/Log.js":
/*!***********************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/log/Log.js ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var domify = __webpack_require__(/*! min-dom/lib/domify */ "./node_modules/bpmn-js-token-simulation/node_modules/min-dom/lib/domify.js"),
    domClasses = __webpack_require__(/*! min-dom/lib/classes */ "./node_modules/bpmn-js-token-simulation/node_modules/min-dom/lib/classes.js"),
    domEvent = __webpack_require__(/*! min-dom/lib/event */ "./node_modules/bpmn-js-token-simulation/node_modules/min-dom/lib/event.js"),
    domQuery = __webpack_require__(/*! min-dom/lib/query */ "./node_modules/bpmn-js-token-simulation/node_modules/min-dom/lib/query.js");

var elementHelper = __webpack_require__(/*! ../../util/ElementHelper */ "./node_modules/bpmn-js-token-simulation/lib/util/ElementHelper.js"),
    getBusinessObject = elementHelper.getBusinessObject,
    is = elementHelper.is,
    isTypedEvent = elementHelper.isTypedEvent;

var events = __webpack_require__(/*! ../../util/EventHelper */ "./node_modules/bpmn-js-token-simulation/lib/util/EventHelper.js"),
    GENERATE_TOKEN_EVENT = events.GENERATE_TOKEN_EVENT,
    CONSUME_TOKEN_EVENT = events.CONSUME_TOKEN_EVENT,
    TOGGLE_MODE_EVENT = events.TOGGLE_MODE_EVENT,
    RESET_SIMULATION_EVENT = events.RESET_SIMULATION_EVENT,
    PROCESS_INSTANCE_CREATED_EVENT = events.PROCESS_INSTANCE_CREATED_EVENT;

function getElementName(element) {
  return element && element.businessObject.name;
}

function Log(eventBus, notifications, tokenSimulationPalette, canvas) {
  var self = this;

  this._notifications = notifications;
  this._tokenSimulationPalette = tokenSimulationPalette;
  this._canvas = canvas;

  this._init();

  eventBus.on(GENERATE_TOKEN_EVENT, function (context) {
    var element = context.element,
        elementName = getElementName(element);

    if (is(element, 'bpmn:StartEvent')) {
      self.log(elementName || 'Start Event', 'info', 'bpmn-icon-start-event-none');
    } else if (is(element, 'bpmn:Task')) {
      self.log(elementName || 'Task', 'info', 'bpmn-icon-task');
    } else if (is(element, 'bpmn:BusinessRuleTask')) {
      self.log(elementName || 'Business Rule Task', 'info', 'bpmn-icon-business-rule');
    } else if (is(element, 'bpmn:ManualTask')) {
      self.log(elementName || 'Manual Task', 'info', 'bpmn-icon-manual');
    } else if (is(element, 'bpmn:ScriptTask')) {
      self.log(elementName || 'Script Task', 'info', 'bpmn-icon-script');
    } else if (is(element, 'bpmn:ServiceTask')) {
      self.log(elementName || 'Service Task', 'info', 'bpmn-icon-service');
    } else if (is(element, 'bpmn:UserTask')) {
      self.log(elementName || 'User Task', 'info', 'bpmn-icon-user');
    } else if (is(element, 'bpmn:ExclusiveGateway')) {
      if (element.outgoing.length < 2) {
        return;
      }

      var sequenceFlowName = getElementName(element.sequenceFlow);

      var text = elementName || 'Gateway';

      if (sequenceFlowName) {
        text = text.concat(' <i class="fa fa-angle-right" aria-hidden="true"></i> ' + sequenceFlowName);
      }

      self.log(text, 'info', 'bpmn-icon-gateway-xor');
    } else if (is(element, ['bpmn:IntermediateCatchEvent', 'bpmn:IntermediateThrowEvent'])) {
      self.log(elementName || 'Intermediate Event', 'info', 'bpmn-icon-intermediate-event-none');
    }
  });

  eventBus.on(CONSUME_TOKEN_EVENT, function (context) {
    var element = context.element,
        elementName = getElementName(element);

    if (is(element, 'bpmn:EndEvent')) {

      if (isTypedEvent(getBusinessObject(element), 'bpmn:TerminateEventDefinition')) {
        self.log(elementName || 'Terminate End Event', 'info', 'bpmn-icon-end-event-terminate');
      } else {
        self.log(elementName || 'End Event', 'info', 'bpmn-icon-end-event-none');
      }
    }
  });

  eventBus.on(PROCESS_INSTANCE_CREATED_EVENT, function (context) {
    var processInstanceId = context.processInstanceId,
        parent = context.parent;

    if (is(parent, 'bpmn:Process')) {
      self.log('Process ' + processInstanceId + ' started', 'success', 'fa-check');
    } else {
      self.log('Subprocess ' + processInstanceId + ' started', 'info', 'fa-check');
    }
  });

  eventBus.on(TOGGLE_MODE_EVENT, function (context) {
    var simulationModeActive = context.simulationModeActive;

    if (!simulationModeActive) {
      self.emptyLog();

      domClasses(self.container).add('hidden');
    }
  });

  eventBus.on(RESET_SIMULATION_EVENT, function (context) {
    self.emptyLog();

    domClasses(self.container).add('hidden');
  });
}

Log.prototype._init = function () {
  var self = this;

  this.container = domify('<div class="token-simulation-log hidden">' + '<div class="header">' + '<i class="fa fa-align-left"></i>' + '<button class="close">' + '<i class="fa fa-times" aria-hidden="true"></i>' + '</button>' + '</div>' + '<div class="content">' + '<p class="entry placeholder">No Entries</p>' + '</div>' + '</div>');

  this.placeholder = domQuery('.placeholder', this.container);

  this.content = domQuery('.content', this.container);

  domEvent.bind(this.content, 'wheel', function (e) {
    e.stopPropagation();
  });

  domEvent.bind(this.content, 'mousedown', function (e) {
    e.stopPropagation();
  });

  this.close = domQuery('.close', this.container);

  domEvent.bind(this.close, 'click', function () {
    domClasses(self.container).add('hidden');
  });

  this.icon = domQuery('.fa-align-left', this.container);

  domEvent.bind(this.icon, 'click', function () {
    domClasses(self.container).add('hidden');
  });

  this._canvas.getContainer().appendChild(this.container);

  this.paletteEntry = domify('<div class="entry" title="Show Simulation Log"><i class="fa fa-align-left"></i></div>');

  domEvent.bind(this.paletteEntry, 'click', function () {
    domClasses(self.container).remove('hidden');
  });

  this._tokenSimulationPalette.addEntry(this.paletteEntry, 3);
};

Log.prototype.toggle = function () {
  var container = this.container;

  if (domClasses(container).has('hidden')) {
    domClasses(container).remove('hidden');
  } else {
    domClasses(container).add('hidden');
  }
};

Log.prototype.log = function (text, type, icon) {
  domClasses(this.placeholder).add('hidden');

  var date = new Date();

  var dateString = date.toLocaleTimeString() + ':' + date.getUTCMilliseconds();

  this._notifications.showNotification(text, type, icon);

  var iconMarkup;

  if (!icon) {
    icon = 'fa-info';
  }

  if (icon.includes('bpmn')) {
    iconMarkup = '<span class="icon ' + icon + '">';
  } else {
    iconMarkup = '<i class="icon fa ' + icon + '"></i>';
  }

  var logEntry = domify('<p class="entry ' + type + '"><span class="date">' + dateString + '</span>' + iconMarkup + '</span>' + text + '</p>');

  this.content.appendChild(logEntry);

  this.content.scrollTop = this.content.scrollHeight;
};

Log.prototype.emptyLog = function () {
  while (this.content.firstChild) {
    this.content.removeChild(this.content.firstChild);
  }

  this.placeholder = domify('<p class="entry placeholder">No Entries</p>');

  this.content.appendChild(this.placeholder);
};

Log.$inject = ['eventBus', 'notifications', 'tokenSimulationPalette', 'canvas'];

module.exports = Log;

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/log/index.js":
/*!*************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/log/index.js ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./Log */ "./node_modules/bpmn-js-token-simulation/lib/features/log/Log.js");

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/notifications/Notifications.js":
/*!*******************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/notifications/Notifications.js ***!
  \*******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var domify = __webpack_require__(/*! min-dom/lib/domify */ "./node_modules/bpmn-js-token-simulation/node_modules/min-dom/lib/domify.js");

var events = __webpack_require__(/*! ../../util/EventHelper */ "./node_modules/bpmn-js-token-simulation/lib/util/EventHelper.js"),
    TOGGLE_MODE_EVENT = events.TOGGLE_MODE_EVENT;

var NOTIFICATION_TIME_TO_LIVE = 2000; // ms

function Notifications(eventBus, canvas) {
  var self = this;

  this._eventBus = eventBus;
  this._canvas = canvas;

  this._init();

  eventBus.on(TOGGLE_MODE_EVENT, function (context) {
    var simulationModeActive = context.simulationModeActive;

    if (!simulationModeActive) {
      self.removeAll();
    }
  });
}

Notifications.prototype._init = function () {
  this.container = domify('<div class="notifications"></div>');

  this._canvas.getContainer().appendChild(this.container);
};

Notifications.prototype.showNotification = function (text, type, icon) {
  var iconMarkup;

  if (!icon) {
    icon = 'fa-info';
  }

  if (icon.includes('bpmn')) {
    iconMarkup = '<i class="' + icon + '"></i>';
  } else {
    iconMarkup = '<i class="fa ' + icon + '"></i>';
  }

  var notification = domify('<div class="notification ' + type + '">' + '<span class="icon">' + iconMarkup + '</span>' + text + '</div>');

  this.container.appendChild(notification);

  // prevent more than 5 notifications at once
  while (this.container.children.length > 5) {
    this.container.children[0].remove();
  }

  setTimeout(function () {
    notification.remove();
  }, NOTIFICATION_TIME_TO_LIVE);
};

Notifications.prototype.removeAll = function () {
  while (this.container.children.length) {
    this.container.children[0].remove();
  }
};

Notifications.$inject = ['eventBus', 'canvas'];

module.exports = Notifications;

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/notifications/index.js":
/*!***********************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/notifications/index.js ***!
  \***********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./Notifications */ "./node_modules/bpmn-js-token-simulation/lib/features/notifications/Notifications.js");

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/palette/Palette.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/palette/Palette.js ***!
  \*******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var domify = __webpack_require__(/*! min-dom/lib/domify */ "./node_modules/bpmn-js-token-simulation/node_modules/min-dom/lib/domify.js"),
    domClasses = __webpack_require__(/*! min-dom/lib/classes */ "./node_modules/bpmn-js-token-simulation/node_modules/min-dom/lib/classes.js");

var events = __webpack_require__(/*! ../../util/EventHelper */ "./node_modules/bpmn-js-token-simulation/lib/util/EventHelper.js"),
    TOGGLE_MODE_EVENT = events.TOGGLE_MODE_EVENT;

function Palette(eventBus, canvas) {
  var self = this;

  this._canvas = canvas;

  this.entries = [];

  this._init();

  eventBus.on(TOGGLE_MODE_EVENT, function (context) {
    var simulationModeActive = context.simulationModeActive;

    if (simulationModeActive) {
      domClasses(self.container).remove('hidden');
    } else {
      domClasses(self.container).add('hidden');
    }
  });
}

Palette.prototype._init = function () {
  this.container = domify('<div class="token-simulation-palette hidden"></div>');

  this._canvas.getContainer().appendChild(this.container);
};

Palette.prototype.addEntry = function (entry, index) {
  var childIndex = 0;

  this.entries.forEach(function (entry) {
    if (index >= entry.index) {
      childIndex++;
    }
  });

  this.container.insertBefore(entry, this.container.childNodes[childIndex]);

  this.entries.push({
    entry: entry,
    index: index
  });
};

Palette.$inject = ['eventBus', 'canvas'];

module.exports = Palette;

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/palette/index.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/palette/index.js ***!
  \*****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./Palette */ "./node_modules/bpmn-js-token-simulation/lib/features/palette/Palette.js");

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/pause-simulation/PauseSimulation.js":
/*!************************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/pause-simulation/PauseSimulation.js ***!
  \************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var domify = __webpack_require__(/*! min-dom/lib/domify */ "./node_modules/bpmn-js-token-simulation/node_modules/min-dom/lib/domify.js"),
    domClasses = __webpack_require__(/*! min-dom/lib/classes */ "./node_modules/bpmn-js-token-simulation/node_modules/min-dom/lib/classes.js"),
    domEvent = __webpack_require__(/*! min-dom/lib/event */ "./node_modules/bpmn-js-token-simulation/node_modules/min-dom/lib/event.js");

var events = __webpack_require__(/*! ../../util/EventHelper */ "./node_modules/bpmn-js-token-simulation/lib/util/EventHelper.js"),
    TOGGLE_MODE_EVENT = events.TOGGLE_MODE_EVENT,
    PLAY_SIMULATION_EVENT = events.PLAY_SIMULATION_EVENT,
    PAUSE_SIMULATION_EVENT = events.PAUSE_SIMULATION_EVENT,
    RESET_SIMULATION_EVENT = events.RESET_SIMULATION_EVENT,
    ANIMATION_CREATED_EVENT = events.ANIMATION_CREATED_EVENT,
    PROCESS_INSTANCE_CREATED_EVENT = events.PROCESS_INSTANCE_CREATED_EVENT;

var PLAY_MARKUP = '<i class="fa fa-play"></i>',
    PAUSE_MARKUP = '<i class="fa fa-pause"></i>';

function PauseSimulation(eventBus, tokenSimulationPalette, notifications, canvas) {
  var self = this;

  this._eventBus = eventBus;
  this._tokenSimulationPalette = tokenSimulationPalette;
  this._notifications = notifications;

  this.canvasParent = canvas.getContainer().parentNode;

  this.isActive = false;
  this.isPaused = false;

  this._init();

  // unpause on simulation start
  eventBus.on(PROCESS_INSTANCE_CREATED_EVENT, function (context) {
    var parent = context.parent;

    if (!parent.parent) {
      self.activate();
      self.unpause();

      notifications.showNotification('Start Simulation', 'info');
    }
  });

  eventBus.on([RESET_SIMULATION_EVENT, TOGGLE_MODE_EVENT], function () {
    self.deactivate();
    self.unpause();
  });

  eventBus.on(ANIMATION_CREATED_EVENT, function (context) {
    var animation = context.animation;

    if (self.isPaused) {
      animation.pause();
    }
  });
}

PauseSimulation.prototype._init = function () {
  this.paletteEntry = domify('<div class="entry disabled" title="Play/Pause Simulation">' + PLAY_MARKUP + '</div>');

  domEvent.bind(this.paletteEntry, 'click', this.toggle.bind(this));

  this._tokenSimulationPalette.addEntry(this.paletteEntry, 1);
};

PauseSimulation.prototype.toggle = function () {
  if (!this.isActive) {
    return;
  }

  if (this.isPaused) {
    this.unpause();
  } else {
    this.pause();
  }
};

PauseSimulation.prototype.pause = function () {
  if (!this.isActive) {
    return;
  }

  domClasses(this.paletteEntry).remove('active');
  domClasses(this.canvasParent).add('paused');

  this.paletteEntry.innerHTML = PLAY_MARKUP;

  this._eventBus.fire(PAUSE_SIMULATION_EVENT);

  this._notifications.showNotification('Pause Simulation', 'info');

  this.isPaused = true;
};

PauseSimulation.prototype.unpause = function () {
  if (!this.isActive) {
    return;
  }

  domClasses(this.paletteEntry).add('active');
  domClasses(this.canvasParent).remove('paused');

  this.paletteEntry.innerHTML = PAUSE_MARKUP;

  this._eventBus.fire(PLAY_SIMULATION_EVENT);

  this._notifications.showNotification('Play Simulation', 'info');

  this.isPaused = false;
};

PauseSimulation.prototype.activate = function () {
  this.isActive = true;

  domClasses(this.paletteEntry).remove('disabled');
};

PauseSimulation.prototype.deactivate = function () {
  this.isActive = false;

  domClasses(this.paletteEntry).remove('active');
  domClasses(this.paletteEntry).add('disabled');
};

PauseSimulation.$inject = ['eventBus', 'tokenSimulationPalette', 'notifications', 'canvas'];

module.exports = PauseSimulation;

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/pause-simulation/index.js":
/*!**************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/pause-simulation/index.js ***!
  \**************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./PauseSimulation */ "./node_modules/bpmn-js-token-simulation/lib/features/pause-simulation/PauseSimulation.js");

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/preserve-element-colors/PreserveElementColors.js":
/*!*************************************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/preserve-element-colors/PreserveElementColors.js ***!
  \*************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var events = __webpack_require__(/*! ../../util/EventHelper */ "./node_modules/bpmn-js-token-simulation/lib/util/EventHelper.js"),
    TOGGLE_MODE_EVENT = events.TOGGLE_MODE_EVENT;

var VERY_HIGH_PRIORITY = 50000;

function PreserveElementColors(eventBus, elementRegistry, graphicsFactory) {
  var self = this;

  this._elementRegistry = elementRegistry;
  this._graphicsFactory = graphicsFactory;

  this.elementColors = {};

  eventBus.on(TOGGLE_MODE_EVENT, VERY_HIGH_PRIORITY, function (context) {
    var simulationModeActive = context.simulationModeActive;

    if (!simulationModeActive) {
      self.resetColors();
    } else {
      self.preserveColors();
    }
  });
}

PreserveElementColors.prototype.preserveColors = function () {
  var self = this;

  this._elementRegistry.forEach(function (element) {
    self.elementColors[element.id] = {
      stroke: element.businessObject.di.get('stroke'),
      fill: element.businessObject.di.get('fill')
    };

    self.setColor(element, '#000', '#fff');
  });
};

PreserveElementColors.prototype.resetColors = function () {
  var self = this;

  this._elementRegistry.forEach(function (element) {
    if (self.elementColors[element.id]) {
      self.setColor(element, self.elementColors[element.id].stroke, self.elementColors[element.id].fill);
    }
  });

  this.elementColors = {};
};

PreserveElementColors.prototype.setColor = function (element, stroke, fill) {
  var businessObject = element.businessObject;

  businessObject.di.set('stroke', stroke);
  businessObject.di.set('fill', fill);

  var gfx = this._elementRegistry.getGraphics(element);

  var type = element.waypoints ? 'connection' : 'shape';

  this._graphicsFactory.update(type, element, gfx);
};

PreserveElementColors.$inject = ['eventBus', 'elementRegistry', 'graphicsFactory'];

module.exports = PreserveElementColors;

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/preserve-element-colors/index.js":
/*!*********************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/preserve-element-colors/index.js ***!
  \*********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./PreserveElementColors */ "./node_modules/bpmn-js-token-simulation/lib/features/preserve-element-colors/PreserveElementColors.js");

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/process-instance-ids/ProcessInstanceIds.js":
/*!*******************************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/process-instance-ids/ProcessInstanceIds.js ***!
  \*******************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var events = __webpack_require__(/*! ../../util/EventHelper */ "./node_modules/bpmn-js-token-simulation/lib/util/EventHelper.js"),
    TOGGLE_MODE_EVENT = events.TOGGLE_MODE_EVENT,
    RESET_SIMULATION_EVENT = events.RESET_SIMULATION_EVENT;

function ProcessInstanceIds(eventBus) {
  this.nextProcessInstanceId = 1;

  eventBus.on(TOGGLE_MODE_EVENT, this.reset.bind(this));

  eventBus.on(RESET_SIMULATION_EVENT, this.reset.bind(this));
}

ProcessInstanceIds.prototype.getNext = function () {
  var processInstanceId = this.nextProcessInstanceId;

  this.nextProcessInstanceId++;

  return processInstanceId;
};

ProcessInstanceIds.prototype.reset = function () {
  this.nextProcessInstanceId = 1;
};

ProcessInstanceIds.$inject = ['eventBus'];

module.exports = ProcessInstanceIds;

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/process-instance-ids/index.js":
/*!******************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/process-instance-ids/index.js ***!
  \******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./ProcessInstanceIds */ "./node_modules/bpmn-js-token-simulation/lib/features/process-instance-ids/ProcessInstanceIds.js");

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/process-instance-settings/ProcessInstanceSettings.js":
/*!*****************************************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/process-instance-settings/ProcessInstanceSettings.js ***!
  \*****************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var events = __webpack_require__(/*! ../../util/EventHelper */ "./node_modules/bpmn-js-token-simulation/lib/util/EventHelper.js"),
    TOGGLE_MODE_EVENT = events.TOGGLE_MODE_EVENT,
    PROCESS_INSTANCE_CREATED_EVENT = events.PROCESS_INSTANCE_CREATED_EVENT,
    PROCESS_INSTANCE_FINISHED_EVENT = events.PROCESS_INSTANCE_FINISHED_EVENT,
    PROCESS_INSTANCE_SHOWN_EVENT = events.PROCESS_INSTANCE_SHOWN_EVENT,
    PROCESS_INSTANCE_HIDDEN_EVENT = events.PROCESS_INSTANCE_HIDDEN_EVENT;

var LOW_PRIORITY = 500;

function ProcessInstanceSettings(animation, eventBus, processInstances, elementRegistry) {
  var self = this;

  this._animation = animation;
  this._eventBus = eventBus;
  this._processInstances = processInstances;
  this._elementRegistry = elementRegistry;

  this._eventBus.on(PROCESS_INSTANCE_CREATED_EVENT, LOW_PRIORITY, function (context) {
    var parent = context.parent,
        processInstanceId = context.processInstanceId;

    var processInstancesWithParent = processInstances.getProcessInstances(parent).filter(function (processInstance) {
      return !processInstance.isFinished;
    });

    if (processInstancesWithParent.length === 1) {
      self.showProcessInstance(processInstanceId, parent);
    } else if (processInstancesWithParent.length > 1) {
      self.hideProcessInstance(processInstanceId);
    }
  });

  this._eventBus.on(PROCESS_INSTANCE_FINISHED_EVENT, LOW_PRIORITY, function (context) {
    var parent = context.parent,
        processInstanceId = context.processInstanceId;

    var processInstancesWithParent = processInstances.getProcessInstances(parent).filter(function (processInstance) {
      return processInstanceId !== processInstance.processInstanceId && !processInstance.isFinished;
    });

    // show remaining process instance
    if (processInstancesWithParent.length && processInstanceId === parent.shownProcessInstance) {

      self.showProcessInstance(processInstancesWithParent[0].processInstanceId, parent);
    } else {
      delete parent.shownProcessInstance;
    }

    // outer process is finished
    if (!parent.parent) {
      elementRegistry.forEach(function (element) {
        delete element.shownProcessInstance;
      });
    }
  });

  eventBus.on(TOGGLE_MODE_EVENT, function () {
    elementRegistry.forEach(function (element) {
      delete element.shownProcessInstance;
    });
  });
}

ProcessInstanceSettings.prototype.showProcessInstance = function (processInstanceId, parent) {
  this._animation.showProcessInstanceAnimations(processInstanceId);

  parent.shownProcessInstance = processInstanceId;

  this._eventBus.fire(PROCESS_INSTANCE_SHOWN_EVENT, {
    processInstanceId: processInstanceId
  });
};

ProcessInstanceSettings.prototype.hideProcessInstance = function (processInstanceId) {
  this._animation.hideProcessInstanceAnimations(processInstanceId);

  this._eventBus.fire(PROCESS_INSTANCE_HIDDEN_EVENT, {
    processInstanceId: processInstanceId
  });
};

ProcessInstanceSettings.prototype.showNext = function (parent) {
  var self = this;

  var processInstancesWithParent = this._processInstances.getProcessInstances(parent);

  var shownProcessInstance = parent.shownProcessInstance;

  var indexOfShownProcessInstance = 0;

  for (let i = 0; i < processInstancesWithParent.length; i++) {
    if (processInstancesWithParent[i].processInstanceId === shownProcessInstance) {
      break;
    } else {
      indexOfShownProcessInstance++;
    }
  }

  processInstancesWithParent.forEach(function (processInstance) {
    self.hideProcessInstance(processInstance.processInstanceId);
  });

  if (indexOfShownProcessInstance === processInstancesWithParent.length - 1) {

    // last index
    this.showProcessInstance(processInstancesWithParent[0].processInstanceId, parent);
  } else {

    // not last index
    this.showProcessInstance(processInstancesWithParent[indexOfShownProcessInstance + 1].processInstanceId, parent);
  }
};

ProcessInstanceSettings.$inject = ['animation', 'eventBus', 'processInstances', 'elementRegistry'];

module.exports = ProcessInstanceSettings;

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/process-instance-settings/index.js":
/*!***********************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/process-instance-settings/index.js ***!
  \***********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./ProcessInstanceSettings */ "./node_modules/bpmn-js-token-simulation/lib/features/process-instance-settings/ProcessInstanceSettings.js");

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/process-instances/ProcessInstances.js":
/*!**************************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/process-instances/ProcessInstances.js ***!
  \**************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var events = __webpack_require__(/*! ../../util/EventHelper */ "./node_modules/bpmn-js-token-simulation/lib/util/EventHelper.js"),
    TOGGLE_MODE_EVENT = events.TOGGLE_MODE_EVENT,
    RESET_SIMULATION_EVENT = events.RESET_SIMULATION_EVENT,
    PROCESS_INSTANCE_CREATED_EVENT = events.PROCESS_INSTANCE_CREATED_EVENT,
    PROCESS_INSTANCE_FINISHED_EVENT = events.PROCESS_INSTANCE_FINISHED_EVENT;

function ProcessInstances(eventBus, processInstanceIds) {
  var self = this;

  this._eventBus = eventBus;
  this._processInstanceIds = processInstanceIds;

  this.processInstances = [];

  // clear instances
  eventBus.on([TOGGLE_MODE_EVENT, RESET_SIMULATION_EVENT], function () {
    self.processInstances = [];
  });
}

/**
 * Create a new process instance.
 *
 * @param {Object} parent - Parent element which contains all child elements of process definition.
 * @param {string} [parentProcessInstanceId] - Optional ID of parent process instance.
 */
ProcessInstances.prototype.create = function (parent, parentProcessInstanceId) {
  var processInstanceId = this._processInstanceIds.getNext();

  var processInstance = {
    parent: parent,
    processInstanceId: processInstanceId,
    parentProcessInstanceId: parentProcessInstanceId
  };

  this.processInstances.push(processInstance);

  this._eventBus.fire(PROCESS_INSTANCE_CREATED_EVENT, processInstance);

  return processInstanceId;
};

ProcessInstances.prototype.remove = function (processInstanceId) {
  this.processInstances = this.processInstances.filter(function (processInstance) {
    return processInstance.processInstanceId !== processInstanceId;
  });
};

/**
 * Finish a process instance.
 *
 * @param {string} processInstanceId - ID of process instance.
 */
ProcessInstances.prototype.finish = function (processInstanceId) {
  var processInstance = this.processInstances.find(function (processInstance) {
    return processInstance.processInstanceId === processInstanceId;
  });

  this._eventBus.fire(PROCESS_INSTANCE_FINISHED_EVENT, processInstance);

  processInstance.isFinished = true;
};

/**
 * @param {Object} [parent] - Optional parent.
 * @param {Object} [options] - Optional options.
 * @param {boolean} [options.includeFinished] - Wether to include finished process instance.
 */
ProcessInstances.prototype.getProcessInstances = function (parent, options) {
  if (!parent) {
    return this.processInstances;
  }

  var processInstances = this.processInstances.filter(function (processInstance) {
    return processInstance.parent === parent;
  });

  if (options && options.includeFinished !== true) {
    processInstances = processInstances.filter(function (processInstance) {
      return !processInstance.isFinished;
    });
  }

  return processInstances;
};

ProcessInstances.prototype.getProcessInstance = function (processInstanceId) {
  return this.processInstances.find(function (processInstance) {
    return processInstance.processInstanceId === processInstanceId;
  });
};

ProcessInstances.$inject = ['eventBus', 'processInstanceIds'];

module.exports = ProcessInstances;

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/process-instances/index.js":
/*!***************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/process-instances/index.js ***!
  \***************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./ProcessInstances */ "./node_modules/bpmn-js-token-simulation/lib/features/process-instances/ProcessInstances.js");

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/reset-simulation/ResetSimulation.js":
/*!************************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/reset-simulation/ResetSimulation.js ***!
  \************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var domify = __webpack_require__(/*! min-dom/lib/domify */ "./node_modules/bpmn-js-token-simulation/node_modules/min-dom/lib/domify.js"),
    domClasses = __webpack_require__(/*! min-dom/lib/classes */ "./node_modules/bpmn-js-token-simulation/node_modules/min-dom/lib/classes.js"),
    domEvent = __webpack_require__(/*! min-dom/lib/event */ "./node_modules/bpmn-js-token-simulation/node_modules/min-dom/lib/event.js");

var is = __webpack_require__(/*! ../../util/ElementHelper */ "./node_modules/bpmn-js-token-simulation/lib/util/ElementHelper.js").is;

var events = __webpack_require__(/*! ../../util/EventHelper */ "./node_modules/bpmn-js-token-simulation/lib/util/EventHelper.js"),
    TOGGLE_MODE_EVENT = events.TOGGLE_MODE_EVENT,
    GENERATE_TOKEN_EVENT = events.GENERATE_TOKEN_EVENT,
    RESET_SIMULATION_EVENT = events.RESET_SIMULATION_EVENT;

function ResetSimulation(eventBus, tokenSimulationPalette, notifications, elementRegistry) {
  var self = this;

  this._eventBus = eventBus;
  this._tokenSimulationPalette = tokenSimulationPalette;
  this._notifications = notifications;
  this._elementRegistry = elementRegistry;

  this._init();

  eventBus.on(GENERATE_TOKEN_EVENT, function (context) {
    if (!is(context.element, 'bpmn:StartEvent')) {
      return;
    }

    domClasses(self.paletteEntry).remove('disabled');
  });

  eventBus.on(TOGGLE_MODE_EVENT, function (context) {
    var simulationModeActive = context.simulationModeActive;

    if (!simulationModeActive) {
      self.resetSimulation();
    }
  });
}

ResetSimulation.prototype._init = function () {
  var self = this;

  this.paletteEntry = domify('<div class="entry disabled" title="Reset Simulation"><i class="fa fa-refresh"></i></div>');

  domEvent.bind(this.paletteEntry, 'click', function () {
    self.resetSimulation();

    self._notifications.showNotification('Reset Simulation', 'info');
  });

  this._tokenSimulationPalette.addEntry(this.paletteEntry, 2);
};

ResetSimulation.prototype.resetSimulation = function () {
  domClasses(this.paletteEntry).add('disabled');

  this._elementRegistry.forEach(function (element) {
    if (element.tokenCount !== undefined) {
      delete element.tokenCount;
    }
  });

  this._eventBus.fire(RESET_SIMULATION_EVENT);
};

ResetSimulation.$inject = ['eventBus', 'tokenSimulationPalette', 'notifications', 'elementRegistry'];

module.exports = ResetSimulation;

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/reset-simulation/index.js":
/*!**************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/reset-simulation/index.js ***!
  \**************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./ResetSimulation */ "./node_modules/bpmn-js-token-simulation/lib/features/reset-simulation/ResetSimulation.js");

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/set-animation-speed/SetAnimationSpeed.js":
/*!*****************************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/set-animation-speed/SetAnimationSpeed.js ***!
  \*****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var domify = __webpack_require__(/*! min-dom/lib/domify */ "./node_modules/bpmn-js-token-simulation/node_modules/min-dom/lib/domify.js"),
    domClasses = __webpack_require__(/*! min-dom/lib/classes */ "./node_modules/bpmn-js-token-simulation/node_modules/min-dom/lib/classes.js"),
    domEvent = __webpack_require__(/*! min-dom/lib/event */ "./node_modules/bpmn-js-token-simulation/node_modules/min-dom/lib/event.js"),
    domQuery = __webpack_require__(/*! min-dom/lib/query */ "./node_modules/bpmn-js-token-simulation/node_modules/min-dom/lib/query.js");

var events = __webpack_require__(/*! ../../util/EventHelper */ "./node_modules/bpmn-js-token-simulation/lib/util/EventHelper.js"),
    TOGGLE_MODE_EVENT = events.TOGGLE_MODE_EVENT;

function SetAnimationSpeed(canvas, animation, eventBus) {
  var self = this;

  this._canvas = canvas;
  this._animation = animation;
  this._eventBus = eventBus;

  this._init();

  eventBus.on(TOGGLE_MODE_EVENT, function (context) {
    var simulationModeActive = context.simulationModeActive;

    if (!simulationModeActive) {
      domClasses(self.container).add('hidden');
    } else {
      domClasses(self.container).remove('hidden');
    }
  });
}

SetAnimationSpeed.prototype._init = function () {
  var self = this;

  this.container = domify('<div class="set-animation-speed hidden">' + '<i title="Set Animation Speed" class="fa fa-tachometer" aria-hidden="true"></i>' + '<div class="animation-speed-buttons">' + '<div title="Slow" id="animation-speed-1" class="animation-speed-button"><i class="fa fa-angle-right" aria-hidden="true"></i></div>' + '<div title="Normal" id="animation-speed-2" class="animation-speed-button active"><i class="fa fa-angle-right" aria-hidden="true"></i><i class="fa fa-angle-right" aria-hidden="true"></i></div>' + '<div title="Fast" id="animation-speed-3" class="animation-speed-button"><i class="fa fa-angle-right" aria-hidden="true"></i><i class="fa fa-angle-right" aria-hidden="true"></i><i class="fa fa-angle-right" aria-hidden="true"></i></div>' + '</div>' + '</div>');

  var speed1 = domQuery('#animation-speed-1', this.container),
      speed2 = domQuery('#animation-speed-2', this.container),
      speed3 = domQuery('#animation-speed-3', this.container);

  domEvent.bind(speed1, 'click', function () {
    self.setActive(speed1);

    self._animation.setAnimationSpeed(0.5);
  });

  domEvent.bind(speed2, 'click', function () {
    self.setActive(speed2);

    self._animation.setAnimationSpeed(1);
  });

  domEvent.bind(speed3, 'click', function () {
    self.setActive(speed3);

    self._animation.setAnimationSpeed(1.5);
  });

  this._canvas.getContainer().appendChild(this.container);
};

SetAnimationSpeed.prototype.setActive = function (element) {
  domQuery.all('.animation-speed-button', this.container).forEach(function (button) {
    domClasses(button).remove('active');
  });

  domClasses(element).add('active');
};

SetAnimationSpeed.$inject = ['canvas', 'animation', 'eventBus'];

module.exports = SetAnimationSpeed;

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/set-animation-speed/index.js":
/*!*****************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/set-animation-speed/index.js ***!
  \*****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./SetAnimationSpeed */ "./node_modules/bpmn-js-token-simulation/lib/features/set-animation-speed/SetAnimationSpeed.js");

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/show-process-instance/ShowProcessInstance.js":
/*!*********************************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/show-process-instance/ShowProcessInstance.js ***!
  \*********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var domify = __webpack_require__(/*! min-dom/lib/domify */ "./node_modules/bpmn-js-token-simulation/node_modules/min-dom/lib/domify.js"),
    domClasses = __webpack_require__(/*! min-dom/lib/classes */ "./node_modules/bpmn-js-token-simulation/node_modules/min-dom/lib/classes.js"),
    domEvent = __webpack_require__(/*! min-dom/lib/event */ "./node_modules/bpmn-js-token-simulation/node_modules/min-dom/lib/event.js"),
    domQuery = __webpack_require__(/*! min-dom/lib/query */ "./node_modules/bpmn-js-token-simulation/node_modules/min-dom/lib/query.js"),
    domClear = __webpack_require__(/*! min-dom/lib/clear */ "./node_modules/bpmn-js-token-simulation/node_modules/min-dom/lib/clear.js");

var events = __webpack_require__(/*! ../../util/EventHelper */ "./node_modules/bpmn-js-token-simulation/lib/util/EventHelper.js"),
    TOGGLE_MODE_EVENT = events.TOGGLE_MODE_EVENT,
    PROCESS_INSTANCE_CREATED_EVENT = events.PROCESS_INSTANCE_CREATED_EVENT,
    PROCESS_INSTANCE_FINISHED_EVENT = events.PROCESS_INSTANCE_FINISHED_EVENT,
    PROCESS_INSTANCE_SHOWN_EVENT = events.PROCESS_INSTANCE_SHOWN_EVENT,
    PROCESS_INSTANCE_HIDDEN_EVENT = events.PROCESS_INSTANCE_HIDDEN_EVENT,
    RESET_SIMULATION_EVENT = events.RESET_SIMULATION_EVENT;

function isNull(value) {
  return value === null;
}

function ShowProcessInstance(eventBus, canvas, processInstanceSettings, processInstances, graphicsFactory, elementRegistry) {
  var self = this;

  this._eventBus = eventBus;
  this._canvas = canvas;
  this._processInstanceSettings = processInstanceSettings;
  this._processInstances = processInstances;
  this._graphicsFactory = graphicsFactory;
  this._elementRegistry = elementRegistry;

  this.highlightedElement = null;

  this._init();

  eventBus.on(TOGGLE_MODE_EVENT, function (context) {
    var simulationModeActive = context.simulationModeActive;

    if (!simulationModeActive) {
      domClasses(self.container).add('hidden');
      domClear(self.container);

      if (!isNull(self.highlightedElement)) {
        self.removeHighlightFromProcess(self.highlightedElement.element);

        self.highlightedElement = null;
      }
    } else {
      domClasses(self.container).remove('hidden');
    }
  });

  eventBus.on(PROCESS_INSTANCE_CREATED_EVENT, function (context) {
    self.addInstance(context);
  });

  eventBus.on(PROCESS_INSTANCE_FINISHED_EVENT, function (context) {
    self.removeInstance(context);
  });

  eventBus.on(PROCESS_INSTANCE_SHOWN_EVENT, function (context) {
    self.setInstanceShown(context.processInstanceId);
  });

  eventBus.on(PROCESS_INSTANCE_HIDDEN_EVENT, function (context) {
    self.setInstanceHidden(context.processInstanceId);
  });

  eventBus.on(RESET_SIMULATION_EVENT, function () {
    self.removeAllInstances();
  });
}

ShowProcessInstance.prototype._init = function () {
  this.container = domify('<div class="process-instances hidden"></div>');

  this._canvas.getContainer().appendChild(this.container);
};

ShowProcessInstance.prototype.addInstance = function (context) {
  var self = this;

  var processInstanceId = context.processInstanceId,
      parent = context.parent;

  var element = domify('<div id="instance-' + processInstanceId + '" class="process-instance" title="View Process Instance ' + processInstanceId + '">' + processInstanceId + '</div>');

  domEvent.bind(element, 'click', function () {
    var processInstancesWithParent = self._processInstances.getProcessInstances(parent);

    processInstancesWithParent.forEach(function (processInstance) {
      self._processInstanceSettings.hideProcessInstance(processInstance.processInstanceId);
    });

    self._processInstanceSettings.showProcessInstance(processInstanceId, parent);
  });

  domEvent.bind(element, 'mouseenter', function () {
    self.highlightedElement = {
      element: parent,
      stroke: parent.businessObject.di.get('stroke'),
      fill: parent.businessObject.di.get('fill')
    };

    self.addHighlightToProcess(parent);
  });

  domEvent.bind(element, 'mouseleave', function () {
    self.removeHighlightFromProcess(parent);

    self.highlightedElement = null;
  });

  this.container.appendChild(element);
};

ShowProcessInstance.prototype.removeInstance = function (context) {
  var processInstanceId = context.processInstanceId;

  var element = domQuery('#instance-' + processInstanceId, this.container);

  if (element) {
    element.remove();
  }
};

ShowProcessInstance.prototype.removeAllInstances = function () {
  this.container.innerHTML = '';
};

ShowProcessInstance.prototype.setInstanceShown = function (processInstanceId) {
  var element = domQuery('#instance-' + processInstanceId, this.container);

  if (element) {
    domClasses(element).add('active');
  }
};

ShowProcessInstance.prototype.setInstanceHidden = function (processInstanceId) {
  var element = domQuery('#instance-' + processInstanceId, this.container);

  if (element) {
    domClasses(element).remove('active');
  }
};

ShowProcessInstance.prototype.addHighlightToProcess = function (element) {
  this.setColor(element, '#52b415', '#ecfbe3');

  if (!element.parent) {
    domClasses(this._canvas.getContainer()).add('highlight');
  }
};

ShowProcessInstance.prototype.removeHighlightFromProcess = function (element) {
  if (isNull(this.highlightedElement)) {
    return;
  }

  this.setColor(element, this.highlightedElement.stroke, this.highlightedElement.fill);

  if (!element.parent) {
    domClasses(this._canvas.getContainer()).remove('highlight');
  }
};

ShowProcessInstance.prototype.setColor = function (element, stroke, fill) {
  var businessObject = element.businessObject;

  businessObject.di.set('stroke', stroke);
  businessObject.di.set('fill', fill);

  var gfx = this._elementRegistry.getGraphics(element);

  this._graphicsFactory.update('connection', element, gfx);
};

ShowProcessInstance.$inject = ['eventBus', 'canvas', 'processInstanceSettings', 'processInstances', 'graphicsFactory', 'elementRegistry'];

module.exports = ShowProcessInstance;

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/show-process-instance/index.js":
/*!*******************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/show-process-instance/index.js ***!
  \*******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./ShowProcessInstance */ "./node_modules/bpmn-js-token-simulation/lib/features/show-process-instance/ShowProcessInstance.js");

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/simulation-state/SimulationState.js":
/*!************************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/simulation-state/SimulationState.js ***!
  \************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var elementHelper = __webpack_require__(/*! ../../util/ElementHelper */ "./node_modules/bpmn-js-token-simulation/lib/util/ElementHelper.js"),
    getBusinessObject = elementHelper.getBusinessObject,
    is = elementHelper.is,
    isAncestor = elementHelper.isAncestor,
    isTypedEvent = elementHelper.isTypedEvent;

var events = __webpack_require__(/*! ../../util/EventHelper */ "./node_modules/bpmn-js-token-simulation/lib/util/EventHelper.js"),
    CONSUME_TOKEN_EVENT = events.CONSUME_TOKEN_EVENT;

var VERY_LOW_PRIORITY = 250;

function SimulationState(eventBus, animation, elementRegistry, log, elementNotifications, canvas, processInstances) {
  // var self = this;

  this._animation = animation;
  this._elementRegistry = elementRegistry;
  this._log = log;
  this._elementNotifications = elementNotifications;
  this._canvas = canvas;
  this._processInstances = processInstances;

  eventBus.on(CONSUME_TOKEN_EVENT, VERY_LOW_PRIORITY, function () {
    // self.isDeadlock();
  });
}

// TODO: refactor
SimulationState.prototype.isDeadlock = function () {
  var self = this;

  var hasTokens = [];

  this._elementRegistry.forEach(function (element) {
    if (element.tokenCount) {
      hasTokens.push(element);
    }
  });

  var cannotContinue = [];
  var hasTerminate = [];

  hasTokens.forEach(function (element) {
    var outgoingSequenceFlows = element.outgoing.filter(function (outgoing) {
      return is(outgoing, 'bpmn:SequenceFlow');
    });

    // has tokens but no outgoing sequence flows
    if (!outgoingSequenceFlows.length) {
      cannotContinue.push(element);
    }

    // parallel gateway after exclusive gateway
    if (is(element, 'bpmn:ParallelGateway')) {
      var incomingSequenceFlows = element.incoming.filter(function (incoming) {
        return is(incoming, 'bpmn:SequenceFlow');
      });

      if (incomingSequenceFlows.length > element.tokenCount) {
        cannotContinue.push(element);
      }
    }

    var visited = [];

    // has terminate event
    function checkIfHasTerminate(element) {
      element.outgoing.forEach(function (outgoing) {
        if (visited.indexOf(outgoing.target) !== -1) {
          return;
        }

        visited.push(outgoing.target);

        var isTerminate = isTypedEvent(getBusinessObject(outgoing.target), 'bpmn:TerminateEventDefinition');

        if (isTerminate) {
          hasTerminate.push(element);
        }

        checkIfHasTerminate(outgoing.target);
      });
    }

    checkIfHasTerminate(element);
  });

  if (hasTokens.length && !hasTerminate.length && cannotContinue.length && !this._animation.animations.length) {
    self._log.log('Deadlock', 'warning', 'fa-exclamation-triangle');

    cannotContinue.forEach(function (element) {
      self._elementNotifications.addElementNotification(element, {
        type: 'warning',
        icon: 'fa-exclamation-triangle',
        text: 'Deadlock'
      });
    });
  }
};

/**
 * Check if process instance finished.
 * Element is necessary to display element notification if finished.
 */
SimulationState.prototype.isFinished = function (element, processInstanceId) {
  var processInstance = this._processInstances.getProcessInstance(processInstanceId);
  var parent = processInstance.parent;

  var hasTokens = false;

  if (!parent) {
    parent = this._canvas.getRootElement();
  }

  parent.children.forEach(function (element) {
    if (element.tokenCount && element.tokenCount[processInstanceId] && element.tokenCount[processInstanceId].length) {
      hasTokens = true;
    }
  });

  var hasAnimations = false;

  this._animation.animations.forEach(function (animation) {
    if (isAncestor(animation.element, parent) && animation.processInstanceId === processInstanceId) {
      hasAnimations = true;
    }
  });

  if (!hasTokens && !hasAnimations) {
    if (is(parent, 'bpmn:SubProcess')) {
      this._log.log('Subprocess ' + processInstanceId + ' finished', 'info', 'fa-check-circle');
    } else {
      this._log.log('Process ' + processInstanceId + ' finished', 'success', 'fa-check-circle');

      this._elementNotifications.addElementNotification(element, {
        type: 'success',
        icon: 'fa-check-circle',
        text: 'Finished'
      });
    }

    return true;
  }
};

SimulationState.$inject = ['eventBus', 'animation', 'elementRegistry', 'log', 'elementNotifications', 'canvas', 'processInstances'];

module.exports = SimulationState;

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/simulation-state/index.js":
/*!**************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/simulation-state/index.js ***!
  \**************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./SimulationState */ "./node_modules/bpmn-js-token-simulation/lib/features/simulation-state/SimulationState.js");

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/toggle-mode/modeler/ToggleMode.js":
/*!**********************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/toggle-mode/modeler/ToggleMode.js ***!
  \**********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var domify = __webpack_require__(/*! min-dom/lib/domify */ "./node_modules/bpmn-js-token-simulation/node_modules/min-dom/lib/domify.js"),
    domClasses = __webpack_require__(/*! min-dom/lib/classes */ "./node_modules/bpmn-js-token-simulation/node_modules/min-dom/lib/classes.js"),
    domEvent = __webpack_require__(/*! min-dom/lib/event */ "./node_modules/bpmn-js-token-simulation/node_modules/min-dom/lib/event.js"),
    domQuery = __webpack_require__(/*! min-dom/lib/query */ "./node_modules/bpmn-js-token-simulation/node_modules/min-dom/lib/query.js");

var events = __webpack_require__(/*! ../../../util/EventHelper */ "./node_modules/bpmn-js-token-simulation/lib/util/EventHelper.js"),
    TOGGLE_MODE_EVENT = events.TOGGLE_MODE_EVENT;

function ToggleMode(eventBus, canvas, selection, contextPad) {
  var self = this;

  this._eventBus = eventBus;
  this._canvas = canvas;
  this._selection = selection;
  this._contextPad = contextPad;

  this.simulationModeActive = false;

  eventBus.on('import.done', function () {
    self.canvasParent = self._canvas.getContainer().parentNode;
    self.palette = domQuery('.djs-palette', self._canvas.getContainer());

    self._init();
  });
}

ToggleMode.prototype._init = function () {
  this.container = domify(`
    <div class="toggle-mode">
      Token Simulation <span class="toggle"><i class="fa fa-toggle-off"></i></span>
    </div>
  `);

  domEvent.bind(this.container, 'click', this.toggleMode.bind(this));

  this._canvas.getContainer().appendChild(this.container);
};

ToggleMode.prototype.toggleMode = function () {
  if (this.simulationModeActive) {
    this.container.innerHTML = 'Token Simulation <span class="toggle"><i class="fa fa-toggle-off"></i></span>';

    domClasses(this.canvasParent).remove('simulation');
    domClasses(this.palette).remove('hidden');

    this._eventBus.fire(TOGGLE_MODE_EVENT, {
      simulationModeActive: false
    });

    var elements = this._selection.get();

    if (elements.length === 1) {
      this._contextPad.open(elements[0]);
    }
  } else {
    this.container.innerHTML = 'Token Simulation <span class="toggle"><i class="fa fa-toggle-on"></i></span>';

    domClasses(this.canvasParent).add('simulation');
    domClasses(this.palette).add('hidden');

    this._eventBus.fire(TOGGLE_MODE_EVENT, {
      simulationModeActive: true
    });
  }

  this.simulationModeActive = !this.simulationModeActive;
};

ToggleMode.$inject = ['eventBus', 'canvas', 'selection', 'contextPad'];

module.exports = ToggleMode;

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/toggle-mode/modeler/index.js":
/*!*****************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/toggle-mode/modeler/index.js ***!
  \*****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./ToggleMode.js */ "./node_modules/bpmn-js-token-simulation/lib/features/toggle-mode/modeler/ToggleMode.js");

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/token-count/TokenCount.js":
/*!**************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/token-count/TokenCount.js ***!
  \**************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var domify = __webpack_require__(/*! min-dom/lib/domify */ "./node_modules/bpmn-js-token-simulation/node_modules/min-dom/lib/domify.js");

var elementHelper = __webpack_require__(/*! ../../util/ElementHelper */ "./node_modules/bpmn-js-token-simulation/lib/util/ElementHelper.js"),
    isAncestor = elementHelper.isAncestor;

var events = __webpack_require__(/*! ../../util/EventHelper */ "./node_modules/bpmn-js-token-simulation/lib/util/EventHelper.js"),
    TOGGLE_MODE_EVENT = events.TOGGLE_MODE_EVENT,
    GENERATE_TOKEN_EVENT = events.GENERATE_TOKEN_EVENT,
    CONSUME_TOKEN_EVENT = events.CONSUME_TOKEN_EVENT,
    RESET_SIMULATION_EVENT = events.RESET_SIMULATION_EVENT,
    TERMINATE_EVENT = events.TERMINATE_EVENT,
    PROCESS_INSTANCE_SHOWN_EVENT = events.PROCESS_INSTANCE_SHOWN_EVENT;

var OFFSET_BOTTOM = 10,
    OFFSET_LEFT = -15;

var LOW_PRIORITY = 500;

function TokenCount(eventBus, overlays, elementRegistry, canvas, processInstances) {
  var self = this;

  this._overlays = overlays;
  this._elementRegistry = elementRegistry;
  this._canvas = canvas;
  this._processInstances = processInstances;

  this.overlayIds = {};

  eventBus.on(TOGGLE_MODE_EVENT, function (context) {
    var simulationModeActive = context.simulationModeActive;

    if (!simulationModeActive) {
      self.removeTokenCounts();
    }
  });

  eventBus.on(RESET_SIMULATION_EVENT, function () {
    self.removeTokenCounts();
  });

  eventBus.on(TERMINATE_EVENT, function (context) {
    var element = context.element,
        parent = element.parent;

    self.removeTokenCounts(parent);
  });

  eventBus.on([GENERATE_TOKEN_EVENT, CONSUME_TOKEN_EVENT], LOW_PRIORITY, function (context) {
    var element = context.element,
        parent = element.parent;

    self.removeTokenCounts(parent);
    self.addTokenCounts(parent);
  });

  eventBus.on(PROCESS_INSTANCE_SHOWN_EVENT, function (context) {
    var processInstanceId = context.processInstanceId;

    var processInstance = processInstances.getProcessInstance(processInstanceId),
        parent = processInstance.parent;

    self.removeTokenCounts(parent);
    self.addTokenCounts(parent);
  });
}

TokenCount.prototype.addTokenCounts = function (parent) {
  var self = this;

  if (!parent) {
    parent = this._canvas.getRootElement();
  }

  var shownProcessInstance = parent.shownProcessInstance;

  // choose default
  if (!shownProcessInstance) {
    var processInstancesWithParent = this._processInstances.getProcessInstances(parent);

    // no instance
    if (!processInstancesWithParent.length) {
      return;
    }

    shownProcessInstance = processInstancesWithParent[0].processInstanceId;
  }

  this._elementRegistry.forEach(function (element) {
    if (isAncestor(parent, element)) {
      self.addTokenCount(element, shownProcessInstance);
    }
  });
};

TokenCount.prototype.addTokenCount = function (element, shownProcessInstance) {
  var tokenCount = element.tokenCount && element.tokenCount[shownProcessInstance];

  if (!tokenCount) {
    return;
  }

  var html = this.createTokenCount(tokenCount);

  var position = { bottom: OFFSET_BOTTOM, left: OFFSET_LEFT };

  var overlayId = this._overlays.add(element, 'token-count', {
    position: position,
    html: html,
    show: {
      minZoom: 0.5
    }
  });

  this.overlayIds[element.id] = overlayId;
};

TokenCount.prototype.createTokenCount = function (tokenCount) {
  return domify('<div class="token-count waiting">' + tokenCount + '</div>');
};

TokenCount.prototype.removeTokenCounts = function (parent) {
  var self = this;

  if (!parent) {
    parent = this._canvas.getRootElement();
  }

  this._elementRegistry.forEach(function (element) {
    if (isAncestor(parent, element)) {
      self.removeTokenCount(element);
    }
  });
};

TokenCount.prototype.removeTokenCount = function (element) {
  var overlayId = this.overlayIds[element.id];

  if (!overlayId) {
    return;
  }

  this._overlays.remove(overlayId);

  delete this.overlayIds[element.id];
};

TokenCount.$inject = ['eventBus', 'overlays', 'elementRegistry', 'canvas', 'processInstances'];

module.exports = TokenCount;

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/token-count/index.js":
/*!*********************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/token-count/index.js ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./TokenCount */ "./node_modules/bpmn-js-token-simulation/lib/features/token-count/TokenCount.js");

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/token-simulation-behavior/TokenSimulationBehavior.js":
/*!*****************************************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/token-simulation-behavior/TokenSimulationBehavior.js ***!
  \*****************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var EndEventHandler = __webpack_require__(/*! ./handler/EndEventHandler */ "./node_modules/bpmn-js-token-simulation/lib/features/token-simulation-behavior/handler/EndEventHandler.js"),
    EventBasedGatewayHandler = __webpack_require__(/*! ./handler/EventBasedGatewayHandler */ "./node_modules/bpmn-js-token-simulation/lib/features/token-simulation-behavior/handler/EventBasedGatewayHandler.js"),
    ExclusiveGatewayHandler = __webpack_require__(/*! ./handler/ExclusiveGatewayHandler */ "./node_modules/bpmn-js-token-simulation/lib/features/token-simulation-behavior/handler/ExclusiveGatewayHandler.js"),
    IntermediateCatchEventHandler = __webpack_require__(/*! ./handler/IntermediateCatchEventHandler */ "./node_modules/bpmn-js-token-simulation/lib/features/token-simulation-behavior/handler/IntermediateCatchEventHandler.js"),
    IntermediateThrowEventHandler = __webpack_require__(/*! ./handler/IntermediateThrowEventHandler */ "./node_modules/bpmn-js-token-simulation/lib/features/token-simulation-behavior/handler/IntermediateThrowEventHandler.js"),
    ParallelGatewayHandler = __webpack_require__(/*! ./handler/ParallelGatewayHandler */ "./node_modules/bpmn-js-token-simulation/lib/features/token-simulation-behavior/handler/ParallelGatewayHandler.js"),
    StartEventHandler = __webpack_require__(/*! ./handler/StartEventHandler */ "./node_modules/bpmn-js-token-simulation/lib/features/token-simulation-behavior/handler/StartEventHandler.js"),
    SubProcessHandler = __webpack_require__(/*! ./handler/SubProcessHandler */ "./node_modules/bpmn-js-token-simulation/lib/features/token-simulation-behavior/handler/SubProcessHandler.js"),
    BoundaryEventHandler = __webpack_require__(/*! ./handler/BoundaryEventHandler */ "./node_modules/bpmn-js-token-simulation/lib/features/token-simulation-behavior/handler/BoundaryEventHandler.js"),
    TaskHandler = __webpack_require__(/*! ./handler/TaskHandler */ "./node_modules/bpmn-js-token-simulation/lib/features/token-simulation-behavior/handler/TaskHandler.js");

var events = __webpack_require__(/*! ../../util/EventHelper */ "./node_modules/bpmn-js-token-simulation/lib/util/EventHelper.js"),
    GENERATE_TOKEN_EVENT = events.GENERATE_TOKEN_EVENT,
    CONSUME_TOKEN_EVENT = events.CONSUME_TOKEN_EVENT;

function TokenSimulationBehavior(eventBus, animation, injector) {
  var self = this;

  this._injector = injector;

  this.handlers = {};

  this.registerHandler('bpmn:EndEvent', EndEventHandler);
  this.registerHandler('bpmn:EventBasedGateway', EventBasedGatewayHandler);
  this.registerHandler('bpmn:ExclusiveGateway', ExclusiveGatewayHandler);
  this.registerHandler('bpmn:IntermediateCatchEvent', IntermediateCatchEventHandler);
  this.registerHandler('bpmn:IntermediateThrowEvent', IntermediateThrowEventHandler);
  this.registerHandler('bpmn:ParallelGateway', ParallelGatewayHandler);
  this.registerHandler('bpmn:StartEvent', StartEventHandler);
  this.registerHandler('bpmn:SubProcess', SubProcessHandler);
  this.registerHandler('bpmn:BoundaryEvent', BoundaryEventHandler);
  this.registerHandler(['bpmn:BusinessRuleTask', 'bpmn:Task', 'bpmn:ManualTask', 'bpmn:ScriptTask', 'bpmn:ServiceTask', 'bpmn:UserTask'], TaskHandler);

  // create animations on generate token
  eventBus.on(GENERATE_TOKEN_EVENT, function (context) {
    var element = context.element;

    if (!self.handlers[element.type]) {
      throw new Error('no handler for type ' + element.type);
    }

    self.handlers[element.type].generate(context);
  });

  // call handler on consume token
  eventBus.on(CONSUME_TOKEN_EVENT, function (context) {
    var element = context.element;

    if (!self.handlers[element.type]) {
      throw new Error('no handler for type ' + element.type);
    }

    self.handlers[element.type].consume(context);
  });
}

TokenSimulationBehavior.prototype.registerHandler = function (types, handlerCls) {
  var self = this;

  var handler = this._injector.instantiate(handlerCls);

  if (!Array.isArray(types)) {
    types = [types];
  }

  types.forEach(function (type) {
    self.handlers[type] = handler;
  });
};

TokenSimulationBehavior.$inject = ['eventBus', 'animation', 'injector'];

module.exports = TokenSimulationBehavior;

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/token-simulation-behavior/handler/BoundaryEventHandler.js":
/*!**********************************************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/token-simulation-behavior/handler/BoundaryEventHandler.js ***!
  \**********************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var elementHelper = __webpack_require__(/*! ../../../util/ElementHelper */ "./node_modules/bpmn-js-token-simulation/lib/util/ElementHelper.js"),
    is = elementHelper.is;

var events = __webpack_require__(/*! ../../../util/EventHelper */ "./node_modules/bpmn-js-token-simulation/lib/util/EventHelper.js"),
    CONSUME_TOKEN_EVENT = events.CONSUME_TOKEN_EVENT,
    UPDATE_ELEMENT_EVENT = events.UPDATE_ELEMENT_EVENT;

function BoundaryEventHandler(animation, eventBus, elementRegistry) {
  this._animation = animation;
  this._eventBus = eventBus;
  this._elementRegistry = elementRegistry;
}

BoundaryEventHandler.prototype.consume = function (context) {
  var element = context.element,
      processInstanceId = context.processInstanceId;

  if (!element.tokenCount) {
    element.tokenCount = {};
  }

  if (!element.tokenCount[processInstanceId]) {
    element.tokenCount[processInstanceId] = 0;
  }

  element.tokenCount[processInstanceId]++;

  this._eventBus.fire(UPDATE_ELEMENT_EVENT, {
    element: element
  });
};

BoundaryEventHandler.prototype.generate = function (context) {
  var self = this;

  var element = context.element,
      processInstanceId = context.processInstanceId;

  var outgoingSequenceFlows = element.outgoing.filter(function (outgoing) {
    return is(outgoing, 'bpmn:SequenceFlow');
  });

  outgoingSequenceFlows.forEach(function (connection) {
    self._animation.createAnimation(connection, processInstanceId, function () {
      self._eventBus.fire(CONSUME_TOKEN_EVENT, {
        element: connection.target,
        processInstanceId: processInstanceId
      });
    });
  });
};

BoundaryEventHandler.$inject = ['animation', 'eventBus', 'elementRegistry'];

module.exports = BoundaryEventHandler;

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/token-simulation-behavior/handler/EndEventHandler.js":
/*!*****************************************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/token-simulation-behavior/handler/EndEventHandler.js ***!
  \*****************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var elementHelper = __webpack_require__(/*! ../../../util/ElementHelper */ "./node_modules/bpmn-js-token-simulation/lib/util/ElementHelper.js"),
    getBusinessObject = elementHelper.getBusinessObject,
    is = elementHelper.is,
    isAncestor = elementHelper.isAncestor,
    getDescendants = elementHelper.getDescendants,
    isTypedEvent = elementHelper.isTypedEvent;

var events = __webpack_require__(/*! ../../../util/EventHelper */ "./node_modules/bpmn-js-token-simulation/lib/util/EventHelper.js"),
    GENERATE_TOKEN_EVENT = events.GENERATE_TOKEN_EVENT,
    TERMINATE_EVENT = events.TERMINATE_EVENT,
    UPDATE_ELEMENTS_EVENT = events.UPDATE_ELEMENTS_EVENT;

function EndEventHandler(animation, eventBus, log, simulationState, elementRegistry, processInstances) {
  this._animation = animation;
  this._eventBus = eventBus;
  this._log = log;
  this._simulationState = simulationState;
  this._elementRegistry = elementRegistry;
  this._processInstances = processInstances;
}

EndEventHandler.prototype.consume = function (context) {
  var element = context.element,
      processInstanceId = context.processInstanceId;

  var isTerminate = isTypedEvent(getBusinessObject(element), 'bpmn:TerminateEventDefinition'),
      isSubProcessChild = is(element.parent, 'bpmn:SubProcess');

  if (isTerminate) {
    this._eventBus.fire(TERMINATE_EVENT, context);

    this._elementRegistry.forEach(function (e) {
      if (isAncestor(element.parent, e) && e.tokenCount && e.tokenCount[processInstanceId]) {
        delete e.tokenCount[processInstanceId];
      }
    });

    // finish but do NOT remove
    this._processInstances.finish(processInstanceId);
  }

  var isFinished = this._simulationState.isFinished(element, processInstanceId);

  if (isFinished) {

    // finish but do NOT remove
    this._processInstances.finish(processInstanceId);
  }

  if ((isFinished || isTerminate) && isSubProcessChild) {
    var processInstance = this._processInstances.getProcessInstance(processInstanceId);

    // generate token on parent
    this._eventBus.fire(GENERATE_TOKEN_EVENT, {
      element: element.parent,
      processInstanceId: processInstance.parentProcessInstanceId
    });
  }

  this._eventBus.fire(UPDATE_ELEMENTS_EVENT, {
    elements: getDescendants(this._elementRegistry.getAll(), element.parent)
  });
};

/**
 * End event never generates.
 */
EndEventHandler.prototype.generate = function (context) {};

EndEventHandler.$inject = ['animation', 'eventBus', 'log', 'simulationState', 'elementRegistry', 'processInstances'];

module.exports = EndEventHandler;

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/token-simulation-behavior/handler/EventBasedGatewayHandler.js":
/*!**************************************************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/token-simulation-behavior/handler/EventBasedGatewayHandler.js ***!
  \**************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var is = __webpack_require__(/*! ../../../util/ElementHelper */ "./node_modules/bpmn-js-token-simulation/lib/util/ElementHelper.js").is;

var events = __webpack_require__(/*! ../../../util/EventHelper */ "./node_modules/bpmn-js-token-simulation/lib/util/EventHelper.js"),
    UPDATE_ELEMENTS_EVENT = events.UPDATE_ELEMENTS_EVENT;

function ExclusiveGatewayHandler(eventBus, animation) {
  this._eventBus = eventBus;
  this._animation = animation;
}

ExclusiveGatewayHandler.prototype.consume = function (context) {
  var element = context.element,
      processInstanceId = context.processInstanceId;

  if (!element.tokenCount) {
    element.tokenCount = {};
  }

  if (!element.tokenCount[processInstanceId]) {
    element.tokenCount[processInstanceId] = 0;
  }

  element.tokenCount[processInstanceId]++;

  var outgoing = element.outgoing,
      events = [];

  outgoing.forEach(function (outgoing) {
    var target = outgoing.target;

    if (is(target, 'bpmn:IntermediateCatchEvent')) {
      events.push(target);
    }
  });

  this._eventBus.fire(UPDATE_ELEMENTS_EVENT, {
    elements: events
  });
};

ExclusiveGatewayHandler.prototype.generate = function () {};

ExclusiveGatewayHandler.$inject = ['eventBus', 'animation'];

module.exports = ExclusiveGatewayHandler;

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/token-simulation-behavior/handler/ExclusiveGatewayHandler.js":
/*!*************************************************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/token-simulation-behavior/handler/ExclusiveGatewayHandler.js ***!
  \*************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var events = __webpack_require__(/*! ../../../util/EventHelper */ "./node_modules/bpmn-js-token-simulation/lib/util/EventHelper.js"),
    CONSUME_TOKEN_EVENT = events.CONSUME_TOKEN_EVENT,
    GENERATE_TOKEN_EVENT = events.GENERATE_TOKEN_EVENT;

function ExclusiveGatewayHandler(eventBus, animation, elementRegistry) {
  this._eventBus = eventBus;
  this._animation = animation;
  this._elementRegistry = elementRegistry;
}

ExclusiveGatewayHandler.prototype.consume = function (context) {
  var element = context.element;

  if (!element.sequenceFlow) {
    throw new Error('no sequence flow configured for element ' + element.id);
  }

  this._eventBus.fire(GENERATE_TOKEN_EVENT, context);
};

ExclusiveGatewayHandler.prototype.generate = function (context) {
  var element = context.element,
      processInstanceId = context.processInstanceId;

  if (!element.sequenceFlow) {
    throw new Error('no sequence flow configured for element ' + element.id);
  }

  var self = this;

  // property could be changed during animation
  // therefore element.sequenceFlow can't be used
  var sequenceFlow = this._elementRegistry.get(element.sequenceFlow.id);

  this._animation.createAnimation(sequenceFlow, processInstanceId, function () {
    self._eventBus.fire(CONSUME_TOKEN_EVENT, {
      element: sequenceFlow.target,
      processInstanceId: processInstanceId
    });
  });
};

ExclusiveGatewayHandler.$inject = ['eventBus', 'animation', 'elementRegistry'];

module.exports = ExclusiveGatewayHandler;

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/token-simulation-behavior/handler/IntermediateCatchEventHandler.js":
/*!*******************************************************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/token-simulation-behavior/handler/IntermediateCatchEventHandler.js ***!
  \*******************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var elementHelper = __webpack_require__(/*! ../../../util/ElementHelper */ "./node_modules/bpmn-js-token-simulation/lib/util/ElementHelper.js"),
    is = elementHelper.is;

var events = __webpack_require__(/*! ../../../util/EventHelper */ "./node_modules/bpmn-js-token-simulation/lib/util/EventHelper.js"),
    CONSUME_TOKEN_EVENT = events.CONSUME_TOKEN_EVENT,
    UPDATE_ELEMENT_EVENT = events.UPDATE_ELEMENT_EVENT,
    UPDATE_ELEMENTS_EVENT = events.UPDATE_ELEMENTS_EVENT;

function IntermediateCatchEventHandler(animation, eventBus, elementRegistry) {
  this._animation = animation;
  this._eventBus = eventBus;
  this._elementRegistry = elementRegistry;
}

IntermediateCatchEventHandler.prototype.consume = function (context) {
  var element = context.element,
      processInstanceId = context.processInstanceId;

  if (!element.tokenCount) {
    element.tokenCount = {};
  }

  if (!element.tokenCount[processInstanceId]) {
    element.tokenCount[processInstanceId] = 0;
  }

  element.tokenCount[processInstanceId]++;

  this._eventBus.fire(UPDATE_ELEMENT_EVENT, {
    element: element
  });
};

IntermediateCatchEventHandler.prototype.generate = function (context) {
  var self = this;

  var element = context.element,
      processInstanceId = context.processInstanceId;

  var outgoingSequenceFlows = element.outgoing.filter(function (outgoing) {
    return is(outgoing, 'bpmn:SequenceFlow');
  });

  outgoingSequenceFlows.forEach(function (connection) {
    self._animation.createAnimation(connection, processInstanceId, function () {
      self._eventBus.fire(CONSUME_TOKEN_EVENT, {
        element: connection.target,
        processInstanceId: processInstanceId
      });
    });
  });

  var parent = element.parent;

  var events = this._elementRegistry.filter(function (element) {
    return is(element, 'bpmn:IntermediateCatchEvent') && element.parent === parent;
  });

  this._eventBus.fire(UPDATE_ELEMENTS_EVENT, {
    elements: events
  });
};

IntermediateCatchEventHandler.$inject = ['animation', 'eventBus', 'elementRegistry'];

module.exports = IntermediateCatchEventHandler;

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/token-simulation-behavior/handler/IntermediateThrowEventHandler.js":
/*!*******************************************************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/token-simulation-behavior/handler/IntermediateThrowEventHandler.js ***!
  \*******************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var is = __webpack_require__(/*! ../../../util/ElementHelper */ "./node_modules/bpmn-js-token-simulation/lib/util/ElementHelper.js").is;

var events = __webpack_require__(/*! ../../../util/EventHelper */ "./node_modules/bpmn-js-token-simulation/lib/util/EventHelper.js"),
    CONSUME_TOKEN_EVENT = events.CONSUME_TOKEN_EVENT,
    GENERATE_TOKEN_EVENT = events.GENERATE_TOKEN_EVENT;

function IntermediateThrowEventHandler(animation, eventBus) {
  this._animation = animation;
  this._eventBus = eventBus;
}

IntermediateThrowEventHandler.prototype.consume = function (element) {
  this._eventBus.fire(GENERATE_TOKEN_EVENT, {
    element: element
  });
};

IntermediateThrowEventHandler.prototype.generate = function (element) {
  var self = this;

  var outgoingSequenceFlows = element.outgoing.filter(function (outgoing) {
    return is(outgoing, 'bpmn:SequenceFlow');
  });

  outgoingSequenceFlows.forEach(function (connection) {
    self._animation.createAnimation(connection, function () {
      self._eventBus.fire(CONSUME_TOKEN_EVENT, {
        element: connection.target
      });
    });
  });
};

IntermediateThrowEventHandler.$inject = ['animation', 'eventBus'];

module.exports = IntermediateThrowEventHandler;

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/token-simulation-behavior/handler/ParallelGatewayHandler.js":
/*!************************************************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/token-simulation-behavior/handler/ParallelGatewayHandler.js ***!
  \************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var is = __webpack_require__(/*! ../../../util/ElementHelper */ "./node_modules/bpmn-js-token-simulation/lib/util/ElementHelper.js").is;

var events = __webpack_require__(/*! ../../../util/EventHelper */ "./node_modules/bpmn-js-token-simulation/lib/util/EventHelper.js"),
    CONSUME_TOKEN_EVENT = events.CONSUME_TOKEN_EVENT,
    GENERATE_TOKEN_EVENT = events.GENERATE_TOKEN_EVENT;

function ParallelGatewayHandler(animation, eventBus) {
  this._animation = animation;
  this._eventBus = eventBus;
}

ParallelGatewayHandler.prototype.consume = function (context) {
  var element = context.element,
      processInstanceId = context.processInstanceId;

  if (!element.tokenCount) {
    element.tokenCount = {};
  }

  if (!element.tokenCount[processInstanceId]) {
    element.tokenCount[processInstanceId] = 0;
  }

  element.tokenCount[processInstanceId]++;

  var incoming = element.incoming;

  if (incoming.length === element.tokenCount[processInstanceId]) {
    this._eventBus.fire(GENERATE_TOKEN_EVENT, context);

    element.tokenCount[processInstanceId] = 0;
  }
};

ParallelGatewayHandler.prototype.generate = function (context) {
  var self = this;

  var element = context.element,
      processInstanceId = context.processInstanceId;

  var outgoingSequenceFlows = element.outgoing.filter(function (outgoing) {
    return is(outgoing, 'bpmn:SequenceFlow');
  });

  outgoingSequenceFlows.forEach(function (outgoing) {
    self._animation.createAnimation(outgoing, processInstanceId, function () {
      self._eventBus.fire(CONSUME_TOKEN_EVENT, {
        element: outgoing.target,
        processInstanceId: processInstanceId
      });
    });
  });
};

ParallelGatewayHandler.$inject = ['animation', 'eventBus'];

module.exports = ParallelGatewayHandler;

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/token-simulation-behavior/handler/StartEventHandler.js":
/*!*******************************************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/token-simulation-behavior/handler/StartEventHandler.js ***!
  \*******************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var is = __webpack_require__(/*! ../../../util/ElementHelper */ "./node_modules/bpmn-js-token-simulation/lib/util/ElementHelper.js").is;

var events = __webpack_require__(/*! ../../../util/EventHelper */ "./node_modules/bpmn-js-token-simulation/lib/util/EventHelper.js"),
    CONSUME_TOKEN_EVENT = events.CONSUME_TOKEN_EVENT,
    UPDATE_ELEMENTS_EVENT = events.UPDATE_ELEMENTS_EVENT;

function StartEventHandler(animation, eventBus, elementRegistry, processInstances) {
  this._animation = animation;
  this._eventBus = eventBus;
  this._elementRegistry = elementRegistry;
  this._processInstances = processInstances;
}

/**
 * Start event has no incoming sequence flows.
 * Therefore it can never consume.
 */
StartEventHandler.prototype.consume = function () {};

/**
 * Generate tokens for start event that was either
 * invoked by user or a parent process.
 *
 * @param {Object} context - The context.
 * @param {Object} context.element - The element.
 * @param {string} [context.parentProcessInstanceId] - Optional ID of parent process when invoked by parent process.
 *
 */
StartEventHandler.prototype.generate = function (context) {
  var self = this;

  var element = context.element,
      parentProcessInstanceId = context.parentProcessInstanceId;

  var outgoingSequenceFlows = element.outgoing.filter(function (outgoing) {
    return is(outgoing, 'bpmn:SequenceFlow');
  });

  // create new process instance
  var parent = element.parent,
      processInstanceId = this._processInstances.create(parent, parentProcessInstanceId);

  outgoingSequenceFlows.forEach(function (connection) {
    self._animation.createAnimation(connection, processInstanceId, function () {
      self._eventBus.fire(CONSUME_TOKEN_EVENT, {
        element: connection.target,
        processInstanceId: processInstanceId
      });
    });
  });

  if (is(element.parent, 'bpmn:SubProcess')) {
    return;
  }

  var startEvents = this._elementRegistry.filter(function (element) {
    return is(element, 'bpmn:StartEvent');
  });

  this._eventBus.fire(UPDATE_ELEMENTS_EVENT, {
    elements: startEvents
  });
};

StartEventHandler.$inject = ['animation', 'eventBus', 'elementRegistry', 'processInstances'];

module.exports = StartEventHandler;

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/token-simulation-behavior/handler/SubProcessHandler.js":
/*!*******************************************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/token-simulation-behavior/handler/SubProcessHandler.js ***!
  \*******************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var is = __webpack_require__(/*! ../../../util/ElementHelper */ "./node_modules/bpmn-js-token-simulation/lib/util/ElementHelper.js").is;

var events = __webpack_require__(/*! ../../../util/EventHelper */ "./node_modules/bpmn-js-token-simulation/lib/util/EventHelper.js"),
    CONSUME_TOKEN_EVENT = events.CONSUME_TOKEN_EVENT,
    GENERATE_TOKEN_EVENT = events.GENERATE_TOKEN_EVENT,
    UPDATE_ELEMENT_EVENT = events.UPDATE_ELEMENT_EVENT;

function SubProcessHandler(animation, eventBus, log) {
  this._animation = animation;
  this._eventBus = eventBus;
  this._log = log;
}

SubProcessHandler.prototype.consume = function (context) {
  var element = context.element,
      processInstanceId = context.processInstanceId;

  var startEvent = element.children.filter(function (child) {
    return is(child, 'bpmn:StartEvent');
  })[0];

  if (!startEvent) {
    this._log.log('Skipping Subprocess', 'info', 'fa-angle-double-right');

    // skip subprocess
    this._eventBus.fire(GENERATE_TOKEN_EVENT, context);
  } else {
    this._log.log('Starting Subprocess', 'info', 'fa-sign-in');

    // start subprocess with process instance ID as parent process instance ID
    this._eventBus.fire(GENERATE_TOKEN_EVENT, {
      element: startEvent,
      parentProcessInstanceId: processInstanceId
    });
  }

  this._eventBus.fire(UPDATE_ELEMENT_EVENT, {
    element: element
  });
};

SubProcessHandler.prototype.generate = function (context) {
  var self = this;

  var element = context.element,
      processInstanceId = context.processInstanceId;

  var outgoingSequenceFlows = element.outgoing.filter(function (outgoing) {
    return is(outgoing, 'bpmn:SequenceFlow');
  });

  outgoingSequenceFlows.forEach(function (outgoing) {
    self._animation.createAnimation(outgoing, processInstanceId, function () {
      self._eventBus.fire(CONSUME_TOKEN_EVENT, {
        element: outgoing.target,
        processInstanceId: processInstanceId
      });
    });
  });

  this._eventBus.fire(UPDATE_ELEMENT_EVENT, {
    element: element
  });
};

SubProcessHandler.$inject = ['animation', 'eventBus', 'log'];

module.exports = SubProcessHandler;

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/token-simulation-behavior/handler/TaskHandler.js":
/*!*************************************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/token-simulation-behavior/handler/TaskHandler.js ***!
  \*************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var is = __webpack_require__(/*! ../../../util/ElementHelper */ "./node_modules/bpmn-js-token-simulation/lib/util/ElementHelper.js").is;

var events = __webpack_require__(/*! ../../../util/EventHelper */ "./node_modules/bpmn-js-token-simulation/lib/util/EventHelper.js"),
    CONSUME_TOKEN_EVENT = events.CONSUME_TOKEN_EVENT,
    GENERATE_TOKEN_EVENT = events.GENERATE_TOKEN_EVENT;

function TaskHandler(animation, eventBus) {
  this._animation = animation;
  this._eventBus = eventBus;
}

TaskHandler.prototype.consume = function (context) {

  // fire to generate token on self
  this._eventBus.fire(GENERATE_TOKEN_EVENT, context);
};

TaskHandler.prototype.generate = function (context) {
  var self = this;

  var element = context.element,
      processInstanceId = context.processInstanceId;

  var outgoingSequenceFlows = element.outgoing.filter(function (outgoing) {
    return is(outgoing, 'bpmn:SequenceFlow');
  });

  outgoingSequenceFlows.forEach(function (outgoing) {
    self._animation.createAnimation(outgoing, processInstanceId, function () {
      self._eventBus.fire(CONSUME_TOKEN_EVENT, {
        element: outgoing.target,
        processInstanceId: processInstanceId
      });
    });
  });
};

TaskHandler.$inject = ['animation', 'eventBus'];

module.exports = TaskHandler;

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/token-simulation-behavior/index.js":
/*!***********************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/token-simulation-behavior/index.js ***!
  \***********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./TokenSimulationBehavior */ "./node_modules/bpmn-js-token-simulation/lib/features/token-simulation-behavior/TokenSimulationBehavior.js");

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/modeler.js":
/*!**************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/modeler.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  __init__: ['animation', 'contextPads', 'disableModeling', 'elementNotifications', 'elementSupport', 'exclusiveGatewaySettings', 'log', 'notifications', 'pauseSimulation', 'preserveElementColors', 'processInstanceIds', 'processInstanceSettings', 'processInstances', 'resetSimulation', 'setAnimationSpeed', 'showProcessInstance', 'simulationState', 'toggleMode', 'tokenCount', 'tokenSimulationBehavior', 'tokenSimulationEditorActions', 'tokenSimulationKeyboardBindings', 'tokenSimulationPalette'],
  'animation': ['type', __webpack_require__(/*! ./animation/Animation */ "./node_modules/bpmn-js-token-simulation/lib/animation/Animation.js")],
  'contextPads': ['type', __webpack_require__(/*! ./features/context-pads */ "./node_modules/bpmn-js-token-simulation/lib/features/context-pads/index.js")],
  'disableModeling': ['type', __webpack_require__(/*! ./features/disable-modeling */ "./node_modules/bpmn-js-token-simulation/lib/features/disable-modeling/index.js")],
  'elementNotifications': ['type', __webpack_require__(/*! ./features/element-notifications */ "./node_modules/bpmn-js-token-simulation/lib/features/element-notifications/index.js")],
  'elementSupport': ['type', __webpack_require__(/*! ./features/element-support */ "./node_modules/bpmn-js-token-simulation/lib/features/element-support/index.js")],
  'exclusiveGatewaySettings': ['type', __webpack_require__(/*! ./features/exclusive-gateway-settings */ "./node_modules/bpmn-js-token-simulation/lib/features/exclusive-gateway-settings/index.js")],
  'log': ['type', __webpack_require__(/*! ./features/log */ "./node_modules/bpmn-js-token-simulation/lib/features/log/index.js")],
  'notifications': ['type', __webpack_require__(/*! ./features/notifications */ "./node_modules/bpmn-js-token-simulation/lib/features/notifications/index.js")],
  'pauseSimulation': ['type', __webpack_require__(/*! ./features/pause-simulation */ "./node_modules/bpmn-js-token-simulation/lib/features/pause-simulation/index.js")],
  'preserveElementColors': ['type', __webpack_require__(/*! ./features/preserve-element-colors */ "./node_modules/bpmn-js-token-simulation/lib/features/preserve-element-colors/index.js")],
  'processInstanceIds': ['type', __webpack_require__(/*! ./features/process-instance-ids */ "./node_modules/bpmn-js-token-simulation/lib/features/process-instance-ids/index.js")],
  'processInstanceSettings': ['type', __webpack_require__(/*! ./features/process-instance-settings */ "./node_modules/bpmn-js-token-simulation/lib/features/process-instance-settings/index.js")],
  'processInstances': ['type', __webpack_require__(/*! ./features/process-instances */ "./node_modules/bpmn-js-token-simulation/lib/features/process-instances/index.js")],
  'resetSimulation': ['type', __webpack_require__(/*! ./features/reset-simulation */ "./node_modules/bpmn-js-token-simulation/lib/features/reset-simulation/index.js")],
  'setAnimationSpeed': ['type', __webpack_require__(/*! ./features/set-animation-speed */ "./node_modules/bpmn-js-token-simulation/lib/features/set-animation-speed/index.js")],
  'showProcessInstance': ['type', __webpack_require__(/*! ./features/show-process-instance */ "./node_modules/bpmn-js-token-simulation/lib/features/show-process-instance/index.js")],
  'simulationState': ['type', __webpack_require__(/*! ./features/simulation-state */ "./node_modules/bpmn-js-token-simulation/lib/features/simulation-state/index.js")],
  'toggleMode': ['type', __webpack_require__(/*! ./features/toggle-mode/modeler */ "./node_modules/bpmn-js-token-simulation/lib/features/toggle-mode/modeler/index.js")],
  'tokenCount': ['type', __webpack_require__(/*! ./features/token-count */ "./node_modules/bpmn-js-token-simulation/lib/features/token-count/index.js")],
  'tokenSimulationBehavior': ['type', __webpack_require__(/*! ./features/token-simulation-behavior */ "./node_modules/bpmn-js-token-simulation/lib/features/token-simulation-behavior/index.js")],
  'tokenSimulationEditorActions': ['type', __webpack_require__(/*! ./features/editor-actions */ "./node_modules/bpmn-js-token-simulation/lib/features/editor-actions/index.js")],
  'tokenSimulationKeyboardBindings': ['type', __webpack_require__(/*! ./features/keyboard-bindings */ "./node_modules/bpmn-js-token-simulation/lib/features/keyboard-bindings/index.js")],
  'tokenSimulationPalette': ['type', __webpack_require__(/*! ./features/palette */ "./node_modules/bpmn-js-token-simulation/lib/features/palette/index.js")]
};

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/util/ElementHelper.js":
/*!*************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/util/ElementHelper.js ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var every = __webpack_require__(/*! min-dash */ "./node_modules/min-dash/dist/index.esm.js").every,
    some = __webpack_require__(/*! min-dash */ "./node_modules/min-dash/dist/index.esm.js").some;

module.exports.is = function (element, types) {
  if (element.type === 'label') {
    return;
  }

  if (!Array.isArray(types)) {
    types = [types];
  }

  var isType = false;

  types.forEach(function (type) {
    if (type === element.type) {
      isType = true;
    }
  });

  return isType;
};

module.exports.isTypedEvent = function (event, eventDefinitionType, filter) {

  function matches(definition, filter) {
    return every(filter, function (val, key) {

      // we want a == conversion here, to be able to catch
      // undefined == false and friends
      return definition[key] == val;
    });
  }

  return some(event.eventDefinitions, function (definition) {
    return definition.$type === eventDefinitionType && matches(event, filter);
  });
};

module.exports.getBusinessObject = function (element) {
  return element && element.businessObject || element;
};

function isAncestor(ancestor, descendant) {
  var childParent = descendant.parent;

  while (childParent) {
    if (childParent === ancestor) {
      return true;
    }

    childParent = childParent.parent;
  }

  return false;
}

module.exports.isAncestor = isAncestor;

module.exports.getDescendants = function (elements, ancestor) {
  return elements.filter(function (element) {
    return isAncestor(ancestor, element);
  });
};

module.exports.supportedElements = ['bpmn:Association', 'bpmn:BusinessRuleTask', 'bpmn:DataInputAssociation', 'bpmn:DataOutputAssociation', 'bpmn:DataObjectReference', 'bpmn:DataStoreReference', 'bpmn:EndEvent', 'bpmn:EventBasedGateway', 'bpmn:ExclusiveGateway', 'bpmn:IntermediateCatchEvent', 'bpmn:ManualTask', 'bpmn:ParallelGateway', 'bpmn:Process', 'bpmn:ScriptTask', 'bpmn:SequenceFlow', 'bpmn:ServiceTask', 'bpmn:StartEvent', 'bpmn:SubProcess', 'bpmn:Task', 'bpmn:TextAnnotation', 'bpmn:UserTask', 'bpmn:BoundaryEvent'];

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/util/EventHelper.js":
/*!***********************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/util/EventHelper.js ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var prefix = 'tokenSimulation';

module.exports = {
  TOGGLE_MODE_EVENT: prefix + '.toggleMode',
  GENERATE_TOKEN_EVENT: prefix + '.generateToken',
  CONSUME_TOKEN_EVENT: prefix + '.consumeToken',
  PLAY_SIMULATION_EVENT: prefix + '.playSimulation',
  PAUSE_SIMULATION_EVENT: prefix + '.pauseSimulation',
  RESET_SIMULATION_EVENT: prefix + '.resetSimulation',
  TERMINATE_EVENT: prefix + '.terminateEvent',
  UPDATE_ELEMENTS_EVENT: prefix + '.updateElements',
  UPDATE_ELEMENT_EVENT: prefix + '.updateElement',
  PROCESS_INSTANCE_CREATED_EVENT: prefix + '.processInstanceCreated',
  PROCESS_INSTANCE_FINISHED_EVENT: prefix + '.processInstanceFinished',
  PROCESS_INSTANCE_SHOWN_EVENT: prefix + '.processInstanceShown',
  PROCESS_INSTANCE_HIDDEN_EVENT: prefix + '.processInstanceHidden',
  ANIMATION_CREATED_EVENT: prefix + '.animationCreated'
};

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/util/GeometryUtil.js":
/*!************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/util/GeometryUtil.js ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports.getMid = function (element) {
  var bbox = element.bbox();

  return {
    x: bbox.x + bbox.width / 2,
    y: bbox.y + bbox.height / 2
  };
};

module.exports.distance = function (a, b) {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
};

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/node_modules/min-dom/lib/classes.js":
/*!***********************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/node_modules/min-dom/lib/classes.js ***!
  \***********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! component-classes */ "./node_modules/component-classes/index.js");

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/node_modules/min-dom/lib/clear.js":
/*!*********************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/node_modules/min-dom/lib/clear.js ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function (el) {

  var c;

  while (el.childNodes.length) {
    c = el.childNodes[0];
    el.removeChild(c);
  }

  return el;
};

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/node_modules/min-dom/lib/domify.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/node_modules/min-dom/lib/domify.js ***!
  \**********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! domify */ "./node_modules/domify/index.js");

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/node_modules/min-dom/lib/event.js":
/*!*********************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/node_modules/min-dom/lib/event.js ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! component-event */ "./node_modules/component-event/index.js");

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/node_modules/min-dom/lib/query.js":
/*!*********************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/node_modules/min-dom/lib/query.js ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! component-query */ "./node_modules/component-query/index.js");

/***/ }),

/***/ "./node_modules/camunda-modeler-plugin-helpers/index.js":
/*!**************************************************************!*\
  !*** ./node_modules/camunda-modeler-plugin-helpers/index.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Validate and register a client plugin.
 *
 * @param {Object} plugin
 * @param {String} type
 */
function registerClientPlugin(plugin, type) {
  var plugins = window.plugins || [];
  window.plugins = plugins;

  if (!plugin) {
    throw new Error('plugin not specified');
  }

  if (!type) {
    throw new Error('type not specified');
  }

  plugins.push({
    plugin: plugin,
    type: type
  });
}

/**
 * Validate and register a bpmn-js plugin.
 *
 * Example use:
 *
 *    var registerBpmnJSPlugin = require('./camundaModelerPluginHelpers').registerBpmnJSPlugin;
 *    var module = require('./index');
 *
 *    registerBpmnJSPlugin(module);
 *
 * @param {Object} plugin
 */
function registerBpmnJSPlugin(plugin) {
  registerClientPlugin(plugin, 'bpmn.modeler.additionalModules');
}

module.exports.registerBpmnJSPlugin = registerBpmnJSPlugin;

/**
 * Validate and register a bpmn-moddle extension plugin.
 *
 * Example use:
 *
 *    var registerBpmnJSModdleExtension = require('./camundaModelerPluginHelpers').registerBpmnJSModdleExtension;
 *    var module = require('./index');
 *
 *    registerBpmnJSModdleExtension(module);
 *
 * @param {Object} plugin
 */
function registerBpmnJSModdleExtension(plugin) {
  registerClientPlugin(plugin, 'bpmn.modeler.moddleExtension');
}

module.exports.registerBpmnJSModdleExtension = registerBpmnJSModdleExtension;

/***/ }),

/***/ "./node_modules/component-classes/index.js":
/*!*************************************************!*\
  !*** ./node_modules/component-classes/index.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Module dependencies.
 */

try {
  var index = __webpack_require__(/*! indexof */ "./node_modules/component-indexof/index.js");
} catch (err) {
  var index = __webpack_require__(/*! component-indexof */ "./node_modules/component-indexof/index.js");
}

/**
 * Whitespace regexp.
 */

var re = /\s+/;

/**
 * toString reference.
 */

var toString = Object.prototype.toString;

/**
 * Wrap `el` in a `ClassList`.
 *
 * @param {Element} el
 * @return {ClassList}
 * @api public
 */

module.exports = function (el) {
  return new ClassList(el);
};

/**
 * Initialize a new ClassList for `el`.
 *
 * @param {Element} el
 * @api private
 */

function ClassList(el) {
  if (!el || !el.nodeType) {
    throw new Error('A DOM element reference is required');
  }
  this.el = el;
  this.list = el.classList;
}

/**
 * Add class `name` if not already present.
 *
 * @param {String} name
 * @return {ClassList}
 * @api public
 */

ClassList.prototype.add = function (name) {
  // classList
  if (this.list) {
    this.list.add(name);
    return this;
  }

  // fallback
  var arr = this.array();
  var i = index(arr, name);
  if (!~i) arr.push(name);
  this.el.className = arr.join(' ');
  return this;
};

/**
 * Remove class `name` when present, or
 * pass a regular expression to remove
 * any which match.
 *
 * @param {String|RegExp} name
 * @return {ClassList}
 * @api public
 */

ClassList.prototype.remove = function (name) {
  if ('[object RegExp]' == toString.call(name)) {
    return this.removeMatching(name);
  }

  // classList
  if (this.list) {
    this.list.remove(name);
    return this;
  }

  // fallback
  var arr = this.array();
  var i = index(arr, name);
  if (~i) arr.splice(i, 1);
  this.el.className = arr.join(' ');
  return this;
};

/**
 * Remove all classes matching `re`.
 *
 * @param {RegExp} re
 * @return {ClassList}
 * @api private
 */

ClassList.prototype.removeMatching = function (re) {
  var arr = this.array();
  for (var i = 0; i < arr.length; i++) {
    if (re.test(arr[i])) {
      this.remove(arr[i]);
    }
  }
  return this;
};

/**
 * Toggle class `name`, can force state via `force`.
 *
 * For browsers that support classList, but do not support `force` yet,
 * the mistake will be detected and corrected.
 *
 * @param {String} name
 * @param {Boolean} force
 * @return {ClassList}
 * @api public
 */

ClassList.prototype.toggle = function (name, force) {
  // classList
  if (this.list) {
    if ("undefined" !== typeof force) {
      if (force !== this.list.toggle(name, force)) {
        this.list.toggle(name); // toggle again to correct
      }
    } else {
      this.list.toggle(name);
    }
    return this;
  }

  // fallback
  if ("undefined" !== typeof force) {
    if (!force) {
      this.remove(name);
    } else {
      this.add(name);
    }
  } else {
    if (this.has(name)) {
      this.remove(name);
    } else {
      this.add(name);
    }
  }

  return this;
};

/**
 * Return an array of classes.
 *
 * @return {Array}
 * @api public
 */

ClassList.prototype.array = function () {
  var className = this.el.getAttribute('class') || '';
  var str = className.replace(/^\s+|\s+$/g, '');
  var arr = str.split(re);
  if ('' === arr[0]) arr.shift();
  return arr;
};

/**
 * Check if class `name` is present.
 *
 * @param {String} name
 * @return {ClassList}
 * @api public
 */

ClassList.prototype.has = ClassList.prototype.contains = function (name) {
  return this.list ? this.list.contains(name) : !!~index(this.array(), name);
};

/***/ }),

/***/ "./node_modules/component-event/index.js":
/*!***********************************************!*\
  !*** ./node_modules/component-event/index.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var bind = window.addEventListener ? 'addEventListener' : 'attachEvent',
    unbind = window.removeEventListener ? 'removeEventListener' : 'detachEvent',
    prefix = bind !== 'addEventListener' ? 'on' : '';

/**
 * Bind `el` event `type` to `fn`.
 *
 * @param {Element} el
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @return {Function}
 * @api public
 */

exports.bind = function (el, type, fn, capture) {
  el[bind](prefix + type, fn, capture || false);
  return fn;
};

/**
 * Unbind `el` event `type`'s callback `fn`.
 *
 * @param {Element} el
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @return {Function}
 * @api public
 */

exports.unbind = function (el, type, fn, capture) {
  el[unbind](prefix + type, fn, capture || false);
  return fn;
};

/***/ }),

/***/ "./node_modules/component-indexof/index.js":
/*!*************************************************!*\
  !*** ./node_modules/component-indexof/index.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function (arr, obj) {
  if (arr.indexOf) return arr.indexOf(obj);
  for (var i = 0; i < arr.length; ++i) {
    if (arr[i] === obj) return i;
  }
  return -1;
};

/***/ }),

/***/ "./node_modules/component-query/index.js":
/*!***********************************************!*\
  !*** ./node_modules/component-query/index.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function one(selector, el) {
  return el.querySelector(selector);
}

exports = module.exports = function (selector, el) {
  el = el || document;
  return one(selector, el);
};

exports.all = function (selector, el) {
  el = el || document;
  return el.querySelectorAll(selector);
};

exports.engine = function (obj) {
  if (!obj.one) throw new Error('.one callback required');
  if (!obj.all) throw new Error('.all callback required');
  one = obj.one;
  exports.all = obj.all;
  return exports;
};

/***/ }),

/***/ "./node_modules/domify/index.js":
/*!**************************************!*\
  !*** ./node_modules/domify/index.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports) {


/**
 * Expose `parse`.
 */

module.exports = parse;

/**
 * Tests for browser support.
 */

var innerHTMLBug = false;
var bugTestDiv;
if (typeof document !== 'undefined') {
  bugTestDiv = document.createElement('div');
  // Setup
  bugTestDiv.innerHTML = '  <link/><table></table><a href="/a">a</a><input type="checkbox"/>';
  // Make sure that link elements get serialized correctly by innerHTML
  // This requires a wrapper element in IE
  innerHTMLBug = !bugTestDiv.getElementsByTagName('link').length;
  bugTestDiv = undefined;
}

/**
 * Wrap map from jquery.
 */

var map = {
  legend: [1, '<fieldset>', '</fieldset>'],
  tr: [2, '<table><tbody>', '</tbody></table>'],
  col: [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],
  // for script/link/style tags to work in IE6-8, you have to wrap
  // in a div with a non-whitespace character in front, ha!
  _default: innerHTMLBug ? [1, 'X<div>', '</div>'] : [0, '', '']
};

map.td = map.th = [3, '<table><tbody><tr>', '</tr></tbody></table>'];

map.option = map.optgroup = [1, '<select multiple="multiple">', '</select>'];

map.thead = map.tbody = map.colgroup = map.caption = map.tfoot = [1, '<table>', '</table>'];

map.polyline = map.ellipse = map.polygon = map.circle = map.text = map.line = map.path = map.rect = map.g = [1, '<svg xmlns="http://www.w3.org/2000/svg" version="1.1">', '</svg>'];

/**
 * Parse `html` and return a DOM Node instance, which could be a TextNode,
 * HTML DOM Node of some kind (<div> for example), or a DocumentFragment
 * instance, depending on the contents of the `html` string.
 *
 * @param {String} html - HTML string to "domify"
 * @param {Document} doc - The `document` instance to create the Node for
 * @return {DOMNode} the TextNode, DOM Node, or DocumentFragment instance
 * @api private
 */

function parse(html, doc) {
  if ('string' != typeof html) throw new TypeError('String expected');

  // default to the global `document` object
  if (!doc) doc = document;

  // tag name
  var m = /<([\w:]+)/.exec(html);
  if (!m) return doc.createTextNode(html);

  html = html.replace(/^\s+|\s+$/g, ''); // Remove leading/trailing whitespace

  var tag = m[1];

  // body support
  if (tag == 'body') {
    var el = doc.createElement('html');
    el.innerHTML = html;
    return el.removeChild(el.lastChild);
  }

  // wrap map
  var wrap = map[tag] || map._default;
  var depth = wrap[0];
  var prefix = wrap[1];
  var suffix = wrap[2];
  var el = doc.createElement('div');
  el.innerHTML = prefix + html + suffix;
  while (depth--) el = el.lastChild;

  // one element
  if (el.firstChild == el.lastChild) {
    return el.removeChild(el.firstChild);
  }

  // several elements
  var fragment = doc.createDocumentFragment();
  while (el.firstChild) {
    fragment.appendChild(el.removeChild(el.firstChild));
  }

  return fragment;
}

/***/ }),

/***/ "./node_modules/min-dash/dist/index.esm.js":
/*!*************************************************!*\
  !*** ./node_modules/min-dash/dist/index.esm.js ***!
  \*************************************************/
/*! exports provided: flatten, find, findIndex, filter, forEach, without, reduce, every, some, map, keys, size, values, groupBy, uniqueBy, unionBy, sortBy, matchPattern, debounce, throttle, bind, isUndefined, isDefined, isNil, isArray, isObject, isNumber, isFunction, isString, ensureArray, has, assign, pick, omit, merge */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "flatten", function() { return flatten; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "find", function() { return find; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "findIndex", function() { return findIndex; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "filter", function() { return filter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "forEach", function() { return forEach; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "without", function() { return without; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "reduce", function() { return reduce; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "every", function() { return every; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "some", function() { return some; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "map", function() { return map; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "keys", function() { return keys; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "size", function() { return size; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "values", function() { return values; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "groupBy", function() { return groupBy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "uniqueBy", function() { return uniqueBy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "unionBy", function() { return unionBy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sortBy", function() { return sortBy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "matchPattern", function() { return matchPattern; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "debounce", function() { return debounce; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "throttle", function() { return throttle; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "bind", function() { return bind; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isUndefined", function() { return isUndefined; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isDefined", function() { return isDefined; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isNil", function() { return isNil; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isArray", function() { return isArray; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isObject", function() { return isObject; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isNumber", function() { return isNumber; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isFunction", function() { return isFunction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isString", function() { return isString; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ensureArray", function() { return ensureArray; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "has", function() { return has; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "assign", function() { return assign; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "pick", function() { return pick; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "omit", function() { return omit; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "merge", function() { return merge; });
/**
 * Flatten array, one level deep.
 *
 * @param {Array<?>} arr
 *
 * @return {Array<?>}
 */
function flatten(arr) {
  return Array.prototype.concat.apply([], arr);
}

var nativeToString = Object.prototype.toString;
var nativeHasOwnProperty = Object.prototype.hasOwnProperty;

function isUndefined(obj) {
  return obj === undefined;
}

function isDefined(obj) {
  return obj !== undefined;
}

function isNil(obj) {
  return obj == null;
}

function isArray(obj) {
  return nativeToString.call(obj) === '[object Array]';
}

function isObject(obj) {
  return nativeToString.call(obj) === '[object Object]';
}

function isNumber(obj) {
  return nativeToString.call(obj) === '[object Number]';
}

function isFunction(obj) {
  return nativeToString.call(obj) === '[object Function]';
}

function isString(obj) {
  return nativeToString.call(obj) === '[object String]';
}

/**
 * Ensure collection is an array.
 *
 * @param {Object} obj
 */
function ensureArray(obj) {

  if (isArray(obj)) {
    return;
  }

  throw new Error('must supply array');
}

/**
 * Return true, if target owns a property with the given key.
 *
 * @param {Object} target
 * @param {String} key
 *
 * @return {Boolean}
 */
function has(target, key) {
  return nativeHasOwnProperty.call(target, key);
}

/**
 * Find element in collection.
 *
 * @param  {Array|Object} collection
 * @param  {Function|Object} matcher
 *
 * @return {Object}
 */
function find(collection, matcher) {

  matcher = toMatcher(matcher);

  var match;

  forEach(collection, function (val, key) {
    if (matcher(val, key)) {
      match = val;

      return false;
    }
  });

  return match;
}

/**
 * Find element index in collection.
 *
 * @param  {Array|Object} collection
 * @param  {Function} matcher
 *
 * @return {Object}
 */
function findIndex(collection, matcher) {

  matcher = toMatcher(matcher);

  var idx = isArray(collection) ? -1 : undefined;

  forEach(collection, function (val, key) {
    if (matcher(val, key)) {
      idx = key;

      return false;
    }
  });

  return idx;
}

/**
 * Find element in collection.
 *
 * @param  {Array|Object} collection
 * @param  {Function} matcher
 *
 * @return {Array} result
 */
function filter(collection, matcher) {

  var result = [];

  forEach(collection, function (val, key) {
    if (matcher(val, key)) {
      result.push(val);
    }
  });

  return result;
}

/**
 * Iterate over collection; returning something
 * (non-undefined) will stop iteration.
 *
 * @param  {Array|Object} collection
 * @param  {Function} iterator
 *
 * @return {Object} return result that stopped the iteration
 */
function forEach(collection, iterator) {

  if (isUndefined(collection)) {
    return;
  }

  var convertKey = isArray(collection) ? toNum : identity;

  for (var key in collection) {

    if (has(collection, key)) {
      var val = collection[key];

      var result = iterator(val, convertKey(key));

      if (result === false) {
        return;
      }
    }
  }
}

/**
 * Return collection without element.
 *
 * @param  {Array} arr
 * @param  {Function} matcher
 *
 * @return {Array}
 */
function without(arr, matcher) {

  if (isUndefined(arr)) {
    return [];
  }

  ensureArray(arr);

  matcher = toMatcher(matcher);

  return arr.filter(function (el, idx) {
    return !matcher(el, idx);
  });
}

/**
 * Reduce collection, returning a single result.
 *
 * @param  {Object|Array} collection
 * @param  {Function} iterator
 * @param  {Any} result
 *
 * @return {Any} result returned from last iterator
 */
function reduce(collection, iterator, result) {

  forEach(collection, function (value, idx) {
    result = iterator(result, value, idx);
  });

  return result;
}

/**
 * Return true if every element in the collection
 * matches the criteria.
 *
 * @param  {Object|Array} collection
 * @param  {Function} matcher
 *
 * @return {Boolean}
 */
function every(collection, matcher) {

  return reduce(collection, function (matches, val, key) {
    return matches && matcher(val, key);
  }, true);
}

/**
 * Return true if some elements in the collection
 * match the criteria.
 *
 * @param  {Object|Array} collection
 * @param  {Function} matcher
 *
 * @return {Boolean}
 */
function some(collection, matcher) {

  return !!find(collection, matcher);
}

/**
 * Transform a collection into another collection
 * by piping each member through the given fn.
 *
 * @param  {Object|Array}   collection
 * @param  {Function} fn
 *
 * @return {Array} transformed collection
 */
function map(collection, fn) {

  var result = [];

  forEach(collection, function (val, key) {
    result.push(fn(val, key));
  });

  return result;
}

/**
 * Get the collections keys.
 *
 * @param  {Object|Array} collection
 *
 * @return {Array}
 */
function keys(collection) {
  return collection && Object.keys(collection) || [];
}

/**
 * Shorthand for `keys(o).length`.
 *
 * @param  {Object|Array} collection
 *
 * @return {Number}
 */
function size(collection) {
  return keys(collection).length;
}

/**
 * Get the values in the collection.
 *
 * @param  {Object|Array} collection
 *
 * @return {Array}
 */
function values(collection) {
  return map(collection, function (val) {
    return val;
  });
}

/**
 * Group collection members by attribute.
 *
 * @param  {Object|Array} collection
 * @param  {Function} extractor
 *
 * @return {Object} map with { attrValue => [ a, b, c ] }
 */
function groupBy(collection, extractor) {
  var grouped = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  extractor = toExtractor(extractor);

  forEach(collection, function (val) {
    var discriminator = extractor(val) || '_';

    var group = grouped[discriminator];

    if (!group) {
      group = grouped[discriminator] = [];
    }

    group.push(val);
  });

  return grouped;
}

function uniqueBy(extractor) {

  extractor = toExtractor(extractor);

  var grouped = {};

  for (var _len = arguments.length, collections = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    collections[_key - 1] = arguments[_key];
  }

  forEach(collections, function (c) {
    return groupBy(c, extractor, grouped);
  });

  var result = map(grouped, function (val, key) {
    return val[0];
  });

  return result;
}

var unionBy = uniqueBy;

/**
 * Sort collection by criteria.
 *
 * @param  {Object|Array} collection
 * @param  {String|Function} extractor
 *
 * @return {Array}
 */
function sortBy(collection, extractor) {

  extractor = toExtractor(extractor);

  var sorted = [];

  forEach(collection, function (value, key) {
    var disc = extractor(value, key);

    var entry = {
      d: disc,
      v: value
    };

    for (var idx = 0; idx < sorted.length; idx++) {
      var d = sorted[idx].d;

      if (disc < d) {
        sorted.splice(idx, 0, entry);
        return;
      }
    }

    // not inserted, append (!)
    sorted.push(entry);
  });

  return map(sorted, function (e) {
    return e.v;
  });
}

/**
 * Create an object pattern matcher.
 *
 * @example
 *
 * const matcher = matchPattern({ id: 1 });
 *
 * var element = find(elements, matcher);
 *
 * @param  {Object} pattern
 *
 * @return {Function} matcherFn
 */
function matchPattern(pattern) {

  return function (el) {

    return every(pattern, function (val, key) {
      return el[key] === val;
    });
  };
}

function toExtractor(extractor) {
  return isFunction(extractor) ? extractor : function (e) {
    return e[extractor];
  };
}

function toMatcher(matcher) {
  return isFunction(matcher) ? matcher : function (e) {
    return e === matcher;
  };
}

function identity(arg) {
  return arg;
}

function toNum(arg) {
  return Number(arg);
}

/**
 * Debounce fn, calling it only once if
 * the given time elapsed between calls.
 *
 * @param  {Function} fn
 * @param  {Number} timeout
 *
 * @return {Function} debounced function
 */
function debounce(fn, timeout) {

  var timer;

  var lastArgs;
  var lastThis;

  var lastNow;

  function fire() {

    var now = Date.now();

    var scheduledDiff = lastNow + timeout - now;

    if (scheduledDiff > 0) {
      return schedule(scheduledDiff);
    }

    fn.apply(lastThis, lastArgs);

    timer = lastNow = lastArgs = lastThis = undefined;
  }

  function schedule(timeout) {
    timer = setTimeout(fire, timeout);
  }

  return function () {

    lastNow = Date.now();

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    lastArgs = args;
    lastThis = this;

    // ensure an execution is scheduled
    if (!timer) {
      schedule(timeout);
    }
  };
}

/**
 * Throttle fn, calling at most once
 * in the given interval.
 *
 * @param  {Function} fn
 * @param  {Number} interval
 *
 * @return {Function} throttled function
 */
function throttle(fn, interval) {

  var throttling = false;

  return function () {

    if (throttling) {
      return;
    }

    fn.apply(undefined, arguments);
    throttling = true;

    setTimeout(function () {
      throttling = false;
    }, interval);
  };
}

/**
 * Bind function against target <this>.
 *
 * @param  {Function} fn
 * @param  {Object}   target
 *
 * @return {Function} bound function
 */
function bind(fn, target) {
  return fn.bind(target);
}

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }return target;
};

/**
 * Convenience wrapper for `Object.assign`.
 *
 * @param {Object} target
 * @param {...Object} others
 *
 * @return {Object} the target
 */
function assign(target) {
  for (var _len = arguments.length, others = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    others[_key - 1] = arguments[_key];
  }

  return _extends.apply(undefined, [target].concat(others));
}

/**
 * Pick given properties from the target object.
 *
 * @param {Object} target
 * @param {Array} properties
 *
 * @return {Object} target
 */
function pick(target, properties) {

  var result = {};

  var obj = Object(target);

  forEach(properties, function (prop) {

    if (prop in obj) {
      result[prop] = target[prop];
    }
  });

  return result;
}

/**
 * Pick all target properties, excluding the given ones.
 *
 * @param {Object} target
 * @param {Array} properties
 *
 * @return {Object} target
 */
function omit(target, properties) {

  var result = {};

  var obj = Object(target);

  forEach(obj, function (prop, key) {

    if (properties.indexOf(key) === -1) {
      result[key] = prop;
    }
  });

  return result;
}

/**
 * Recursively merge `...sources` into given target.
 *
 * Does support merging objects; does not support merging arrays.
 *
 * @param {Object} target
 * @param {...Object} sources
 *
 * @return {Object} the target
 */
function merge(target) {
  for (var _len2 = arguments.length, sources = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    sources[_key2 - 1] = arguments[_key2];
  }

  if (!sources.length) {
    return target;
  }

  forEach(sources, function (source) {

    // skip non-obj sources, i.e. null
    if (!source || !isObject(source)) {
      return;
    }

    forEach(source, function (sourceVal, key) {

      var targetVal = target[key];

      if (isObject(sourceVal)) {

        if (!isObject(targetVal)) {
          // override target[key] with object
          targetVal = {};
        }

        target[key] = merge(targetVal, sourceVal);
      } else {
        target[key] = sourceVal;
      }
    });
  });

  return target;
}



/***/ }),

/***/ "./node_modules/min-dom/dist/index.esm.js":
/*!************************************************!*\
  !*** ./node_modules/min-dom/dist/index.esm.js ***!
  \************************************************/
/*! exports provided: attr, classes, clear, closest, delegate, domify, event, matches, query, queryAll, remove */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "attr", function() { return attr; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "classes", function() { return classes; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "clear", function() { return clear; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "closest", function() { return closest; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "delegate", function() { return delegateEvents; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "domify", function() { return domify; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "event", function() { return componentEvent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "matches", function() { return matchesSelector$1; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "query", function() { return query; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "queryAll", function() { return all; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "remove", function() { return remove; });
/**
 * Set attribute `name` to `val`, or get attr `name`.
 *
 * @param {Element} el
 * @param {String} name
 * @param {String} [val]
 * @api public
 */
function attr(el, name, val) {
  // get
  if (arguments.length == 2) {
    return el.getAttribute(name);
  }

  // remove
  if (val === null) {
    return el.removeAttribute(name);
  }

  // set
  el.setAttribute(name, val);

  return el;
}

var indexOf = [].indexOf;

var indexof = function (arr, obj) {
  if (indexOf) return arr.indexOf(obj);
  for (var i = 0; i < arr.length; ++i) {
    if (arr[i] === obj) return i;
  }
  return -1;
};

/**
 * Taken from https://github.com/component/classes
 *
 * Without the component bits.
 */

/**
 * Whitespace regexp.
 */

var re = /\s+/;

/**
 * toString reference.
 */

var toString = Object.prototype.toString;

/**
 * Wrap `el` in a `ClassList`.
 *
 * @param {Element} el
 * @return {ClassList}
 * @api public
 */

function classes(el) {
  return new ClassList(el);
}

/**
 * Initialize a new ClassList for `el`.
 *
 * @param {Element} el
 * @api private
 */

function ClassList(el) {
  if (!el || !el.nodeType) {
    throw new Error('A DOM element reference is required');
  }
  this.el = el;
  this.list = el.classList;
}

/**
 * Add class `name` if not already present.
 *
 * @param {String} name
 * @return {ClassList}
 * @api public
 */

ClassList.prototype.add = function (name) {
  // classList
  if (this.list) {
    this.list.add(name);
    return this;
  }

  // fallback
  var arr = this.array();
  var i = indexof(arr, name);
  if (!~i) arr.push(name);
  this.el.className = arr.join(' ');
  return this;
};

/**
 * Remove class `name` when present, or
 * pass a regular expression to remove
 * any which match.
 *
 * @param {String|RegExp} name
 * @return {ClassList}
 * @api public
 */

ClassList.prototype.remove = function (name) {
  if ('[object RegExp]' == toString.call(name)) {
    return this.removeMatching(name);
  }

  // classList
  if (this.list) {
    this.list.remove(name);
    return this;
  }

  // fallback
  var arr = this.array();
  var i = indexof(arr, name);
  if (~i) arr.splice(i, 1);
  this.el.className = arr.join(' ');
  return this;
};

/**
 * Remove all classes matching `re`.
 *
 * @param {RegExp} re
 * @return {ClassList}
 * @api private
 */

ClassList.prototype.removeMatching = function (re) {
  var arr = this.array();
  for (var i = 0; i < arr.length; i++) {
    if (re.test(arr[i])) {
      this.remove(arr[i]);
    }
  }
  return this;
};

/**
 * Toggle class `name`, can force state via `force`.
 *
 * For browsers that support classList, but do not support `force` yet,
 * the mistake will be detected and corrected.
 *
 * @param {String} name
 * @param {Boolean} force
 * @return {ClassList}
 * @api public
 */

ClassList.prototype.toggle = function (name, force) {
  // classList
  if (this.list) {
    if ('undefined' !== typeof force) {
      if (force !== this.list.toggle(name, force)) {
        this.list.toggle(name); // toggle again to correct
      }
    } else {
      this.list.toggle(name);
    }
    return this;
  }

  // fallback
  if ('undefined' !== typeof force) {
    if (!force) {
      this.remove(name);
    } else {
      this.add(name);
    }
  } else {
    if (this.has(name)) {
      this.remove(name);
    } else {
      this.add(name);
    }
  }

  return this;
};

/**
 * Return an array of classes.
 *
 * @return {Array}
 * @api public
 */

ClassList.prototype.array = function () {
  var className = this.el.getAttribute('class') || '';
  var str = className.replace(/^\s+|\s+$/g, '');
  var arr = str.split(re);
  if ('' === arr[0]) arr.shift();
  return arr;
};

/**
 * Check if class `name` is present.
 *
 * @param {String} name
 * @return {ClassList}
 * @api public
 */

ClassList.prototype.has = ClassList.prototype.contains = function (name) {
  return this.list ? this.list.contains(name) : !!~indexof(this.array(), name);
};

/**
 * Remove all children from the given element.
 */
function clear(el) {

  var c;

  while (el.childNodes.length) {
    c = el.childNodes[0];
    el.removeChild(c);
  }

  return el;
}

/**
 * Element prototype.
 */

var proto = Element.prototype;

/**
 * Vendor function.
 */

var vendor = proto.matchesSelector || proto.webkitMatchesSelector || proto.mozMatchesSelector || proto.msMatchesSelector || proto.oMatchesSelector;

/**
 * Expose `match()`.
 */

var matchesSelector = match;

/**
 * Match `el` to `selector`.
 *
 * @param {Element} el
 * @param {String} selector
 * @return {Boolean}
 * @api public
 */

function match(el, selector) {
  if (vendor) return vendor.call(el, selector);
  var nodes = el.parentNode.querySelectorAll(selector);
  for (var i = 0; i < nodes.length; ++i) {
    if (nodes[i] == el) return true;
  }
  return false;
}

var closest = function (element, selector, checkYoSelf) {
  var parent = checkYoSelf ? element : element.parentNode;

  while (parent && parent !== document) {
    if (matchesSelector(parent, selector)) return parent;
    parent = parent.parentNode;
  }
};

var bind = window.addEventListener ? 'addEventListener' : 'attachEvent',
    unbind = window.removeEventListener ? 'removeEventListener' : 'detachEvent',
    prefix = bind !== 'addEventListener' ? 'on' : '';

/**
 * Bind `el` event `type` to `fn`.
 *
 * @param {Element} el
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @return {Function}
 * @api public
 */

var bind_1 = function (el, type, fn, capture) {
  el[bind](prefix + type, fn, capture || false);
  return fn;
};

/**
 * Unbind `el` event `type`'s callback `fn`.
 *
 * @param {Element} el
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @return {Function}
 * @api public
 */

var unbind_1 = function (el, type, fn, capture) {
  el[unbind](prefix + type, fn, capture || false);
  return fn;
};

var componentEvent = {
  bind: bind_1,
  unbind: unbind_1
};

/**
 * Module dependencies.
 */

/**
 * Delegate event `type` to `selector`
 * and invoke `fn(e)`. A callback function
 * is returned which may be passed to `.unbind()`.
 *
 * @param {Element} el
 * @param {String} selector
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @return {Function}
 * @api public
 */

// Some events don't bubble, so we want to bind to the capture phase instead
// when delegating.
var forceCaptureEvents = ['focus', 'blur'];

var bind$1 = function (el, selector, type, fn, capture) {
  if (forceCaptureEvents.indexOf(type) !== -1) capture = true;

  return componentEvent.bind(el, type, function (e) {
    var target = e.target || e.srcElement;
    e.delegateTarget = closest(target, selector, true, el);
    if (e.delegateTarget) fn.call(el, e);
  }, capture);
};

/**
 * Unbind event `type`'s callback `fn`.
 *
 * @param {Element} el
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @api public
 */

var unbind$1 = function (el, type, fn, capture) {
  if (forceCaptureEvents.indexOf(type) !== -1) capture = true;

  componentEvent.unbind(el, type, fn, capture);
};

var delegateEvents = {
  bind: bind$1,
  unbind: unbind$1
};

/**
 * Expose `parse`.
 */

var domify = parse;

/**
 * Tests for browser support.
 */

var innerHTMLBug = false;
var bugTestDiv;
if (typeof document !== 'undefined') {
  bugTestDiv = document.createElement('div');
  // Setup
  bugTestDiv.innerHTML = '  <link/><table></table><a href="/a">a</a><input type="checkbox"/>';
  // Make sure that link elements get serialized correctly by innerHTML
  // This requires a wrapper element in IE
  innerHTMLBug = !bugTestDiv.getElementsByTagName('link').length;
  bugTestDiv = undefined;
}

/**
 * Wrap map from jquery.
 */

var map = {
  legend: [1, '<fieldset>', '</fieldset>'],
  tr: [2, '<table><tbody>', '</tbody></table>'],
  col: [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],
  // for script/link/style tags to work in IE6-8, you have to wrap
  // in a div with a non-whitespace character in front, ha!
  _default: innerHTMLBug ? [1, 'X<div>', '</div>'] : [0, '', '']
};

map.td = map.th = [3, '<table><tbody><tr>', '</tr></tbody></table>'];

map.option = map.optgroup = [1, '<select multiple="multiple">', '</select>'];

map.thead = map.tbody = map.colgroup = map.caption = map.tfoot = [1, '<table>', '</table>'];

map.polyline = map.ellipse = map.polygon = map.circle = map.text = map.line = map.path = map.rect = map.g = [1, '<svg xmlns="http://www.w3.org/2000/svg" version="1.1">', '</svg>'];

/**
 * Parse `html` and return a DOM Node instance, which could be a TextNode,
 * HTML DOM Node of some kind (<div> for example), or a DocumentFragment
 * instance, depending on the contents of the `html` string.
 *
 * @param {String} html - HTML string to "domify"
 * @param {Document} doc - The `document` instance to create the Node for
 * @return {DOMNode} the TextNode, DOM Node, or DocumentFragment instance
 * @api private
 */

function parse(html, doc) {
  if ('string' != typeof html) throw new TypeError('String expected');

  // default to the global `document` object
  if (!doc) doc = document;

  // tag name
  var m = /<([\w:]+)/.exec(html);
  if (!m) return doc.createTextNode(html);

  html = html.replace(/^\s+|\s+$/g, ''); // Remove leading/trailing whitespace

  var tag = m[1];

  // body support
  if (tag == 'body') {
    var el = doc.createElement('html');
    el.innerHTML = html;
    return el.removeChild(el.lastChild);
  }

  // wrap map
  var wrap = map[tag] || map._default;
  var depth = wrap[0];
  var prefix = wrap[1];
  var suffix = wrap[2];
  var el = doc.createElement('div');
  el.innerHTML = prefix + html + suffix;
  while (depth--) el = el.lastChild;

  // one element
  if (el.firstChild == el.lastChild) {
    return el.removeChild(el.firstChild);
  }

  // several elements
  var fragment = doc.createDocumentFragment();
  while (el.firstChild) {
    fragment.appendChild(el.removeChild(el.firstChild));
  }

  return fragment;
}

var proto$1 = typeof Element !== 'undefined' ? Element.prototype : {};
var vendor$1 = proto$1.matches || proto$1.matchesSelector || proto$1.webkitMatchesSelector || proto$1.mozMatchesSelector || proto$1.msMatchesSelector || proto$1.oMatchesSelector;

var matchesSelector$1 = match$1;

/**
 * Match `el` to `selector`.
 *
 * @param {Element} el
 * @param {String} selector
 * @return {Boolean}
 * @api public
 */

function match$1(el, selector) {
  if (!el || el.nodeType !== 1) return false;
  if (vendor$1) return vendor$1.call(el, selector);
  var nodes = el.parentNode.querySelectorAll(selector);
  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i] == el) return true;
  }
  return false;
}

function query(selector, el) {
  el = el || document;

  return el.querySelector(selector);
}

function all(selector, el) {
  el = el || document;

  return el.querySelectorAll(selector);
}

function remove(el) {
  el.parentNode && el.parentNode.removeChild(el);
}



/***/ }),

/***/ "./node_modules/svg.js/dist/svg.js":
/*!*****************************************!*\
  !*** ./node_modules/svg.js/dist/svg.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;/*!
* svg.js - A lightweight library for manipulating and animating SVG.
* @version 2.7.1
* https://svgdotjs.github.io/
*
* @copyright Wout Fierens <wout@mick-wout.com>
* @license MIT
*
* BUILT: Fri Nov 30 2018 10:01:55 GMT+0100 (GMT+01:00)
*/;
(function (root, factory) {
  /* istanbul ignore next */
  if (true) {
    !(__WEBPACK_AMD_DEFINE_RESULT__ = (function () {
      return factory(root, root.document);
    }).call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}
})(typeof window !== "undefined" ? window : this, function (window, document) {

  // Find global reference - uses 'this' by default when available,
  // falls back to 'window' otherwise (for bundlers like Webpack)
  var globalRef = typeof this !== "undefined" ? this : window;

  // The main wrapping element
  var SVG = globalRef.SVG = function (element) {
    if (SVG.supported) {
      element = new SVG.Doc(element);

      if (!SVG.parser.draw) SVG.prepare();

      return element;
    }
  };

  // Default namespaces
  SVG.ns = 'http://www.w3.org/2000/svg';
  SVG.xmlns = 'http://www.w3.org/2000/xmlns/';
  SVG.xlink = 'http://www.w3.org/1999/xlink';
  SVG.svgjs = 'http://svgjs.com/svgjs';

  // Svg support test
  SVG.supported = function () {
    return !!document.createElementNS && !!document.createElementNS(SVG.ns, 'svg').createSVGRect;
  }();

  // Don't bother to continue if SVG is not supported
  if (!SVG.supported) return false;

  // Element id sequence
  SVG.did = 1000;

  // Get next named element id
  SVG.eid = function (name) {
    return 'Svgjs' + capitalize(name) + SVG.did++;
  };

  // Method for element creation
  SVG.create = function (name) {
    // create element
    var element = document.createElementNS(this.ns, name);

    // apply unique id
    element.setAttribute('id', this.eid(name));

    return element;
  };

  // Method for extending objects
  SVG.extend = function () {
    var modules, methods, key, i;

    // Get list of modules
    modules = [].slice.call(arguments);

    // Get object with extensions
    methods = modules.pop();

    for (i = modules.length - 1; i >= 0; i--) if (modules[i]) for (key in methods) modules[i].prototype[key] = methods[key];

    // Make sure SVG.Set inherits any newly added methods
    if (SVG.Set && SVG.Set.inherit) SVG.Set.inherit();
  };

  // Invent new element
  SVG.invent = function (config) {
    // Create element initializer
    var initializer = typeof config.create == 'function' ? config.create : function () {
      this.constructor.call(this, SVG.create(config.create));
    };

    // Inherit prototype
    if (config.inherit) initializer.prototype = new config.inherit();

    // Extend with methods
    if (config.extend) SVG.extend(initializer, config.extend);

    // Attach construct method to parent
    if (config.construct) SVG.extend(config.parent || SVG.Container, config.construct);

    return initializer;
  };

  // Adopt existing svg elements
  SVG.adopt = function (node) {
    // check for presence of node
    if (!node) return null;

    // make sure a node isn't already adopted
    if (node.instance) return node.instance;

    // initialize variables
    var element;

    // adopt with element-specific settings
    if (node.nodeName == 'svg') element = node.parentNode instanceof window.SVGElement ? new SVG.Nested() : new SVG.Doc();else if (node.nodeName == 'linearGradient') element = new SVG.Gradient('linear');else if (node.nodeName == 'radialGradient') element = new SVG.Gradient('radial');else if (SVG[capitalize(node.nodeName)]) element = new SVG[capitalize(node.nodeName)]();else element = new SVG.Element(node);

    // ensure references
    element.type = node.nodeName;
    element.node = node;
    node.instance = element;

    // SVG.Class specific preparations
    if (element instanceof SVG.Doc) element.namespace().defs();

    // pull svgjs data from the dom (getAttributeNS doesn't work in html5)
    element.setData(JSON.parse(node.getAttribute('svgjs:data')) || {});

    return element;
  };

  // Initialize parsing element
  SVG.prepare = function () {
    // Select document body and create invisible svg element
    var body = document.getElementsByTagName('body')[0],
        draw = (body ? new SVG.Doc(body) : SVG.adopt(document.documentElement).nested()).size(2, 0);

    // Create parser object
    SVG.parser = {
      body: body || document.documentElement,
      draw: draw.style('opacity:0;position:absolute;left:-100%;top:-100%;overflow:hidden').attr('focusable', 'false').node,
      poly: draw.polyline().node,
      path: draw.path().node,
      native: SVG.create('svg')
    };
  };

  SVG.parser = {
    native: SVG.create('svg')
  };

  document.addEventListener('DOMContentLoaded', function () {
    if (!SVG.parser.draw) SVG.prepare();
  }, false);

  // Storage for regular expressions
  SVG.regex = {
    // Parse unit value
    numberAndUnit: /^([+-]?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?)([a-z%]*)$/i

    // Parse hex value
    , hex: /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i

    // Parse rgb value
    , rgb: /rgb\((\d+),(\d+),(\d+)\)/

    // Parse reference id
    , reference: /#([a-z0-9\-_]+)/i

    // splits a transformation chain
    , transforms: /\)\s*,?\s*/

    // Whitespace
    , whitespace: /\s/g

    // Test hex value
    , isHex: /^#[a-f0-9]{3,6}$/i

    // Test rgb value
    , isRgb: /^rgb\(/

    // Test css declaration
    , isCss: /[^:]+:[^;]+;?/

    // Test for blank string
    , isBlank: /^(\s+)?$/

    // Test for numeric string
    , isNumber: /^[+-]?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i

    // Test for percent value
    , isPercent: /^-?[\d\.]+%$/

    // Test for image url
    , isImage: /\.(jpg|jpeg|png|gif|svg)(\?[^=]+.*)?/i

    // split at whitespace and comma
    , delimiter: /[\s,]+/

    // The following regex are used to parse the d attribute of a path

    // Matches all hyphens which are not after an exponent
    , hyphen: /([^e])\-/gi

    // Replaces and tests for all path letters
    , pathLetters: /[MLHVCSQTAZ]/gi

    // yes we need this one, too
    , isPathLetter: /[MLHVCSQTAZ]/i

    // matches 0.154.23.45
    , numbersWithDots: /((\d?\.\d+(?:e[+-]?\d+)?)((?:\.\d+(?:e[+-]?\d+)?)+))+/gi

    // matches .
    , dots: /\./g
  };

  SVG.utils = {
    // Map function
    map: function (array, block) {
      var i,
          il = array.length,
          result = [];

      for (i = 0; i < il; i++) result.push(block(array[i]));

      return result;
    }

    // Filter function
    , filter: function (array, block) {
      var i,
          il = array.length,
          result = [];

      for (i = 0; i < il; i++) if (block(array[i])) result.push(array[i]);

      return result;
    }

    // Degrees to radians
    , radians: function (d) {
      return d % 360 * Math.PI / 180;
    }

    // Radians to degrees
    , degrees: function (r) {
      return r * 180 / Math.PI % 360;
    },

    filterSVGElements: function (nodes) {
      return this.filter(nodes, function (el) {
        return el instanceof window.SVGElement;
      });
    }

  };

  SVG.defaults = {
    // Default attribute values
    attrs: {
      // fill and stroke
      'fill-opacity': 1,
      'stroke-opacity': 1,
      'stroke-width': 0,
      'stroke-linejoin': 'miter',
      'stroke-linecap': 'butt',
      fill: '#000000',
      stroke: '#000000',
      opacity: 1
      // position
      , x: 0,
      y: 0,
      cx: 0,
      cy: 0
      // size
      , width: 0,
      height: 0
      // radius
      , r: 0,
      rx: 0,
      ry: 0
      // gradient
      , offset: 0,
      'stop-opacity': 1,
      'stop-color': '#000000'
      // text
      , 'font-size': 16,
      'font-family': 'Helvetica, Arial, sans-serif',
      'text-anchor': 'start'
    }
    // Module for color convertions
  };SVG.Color = function (color) {
    var match;

    // initialize defaults
    this.r = 0;
    this.g = 0;
    this.b = 0;

    if (!color) return;

    // parse color
    if (typeof color === 'string') {
      if (SVG.regex.isRgb.test(color)) {
        // get rgb values
        match = SVG.regex.rgb.exec(color.replace(SVG.regex.whitespace, ''));

        // parse numeric values
        this.r = parseInt(match[1]);
        this.g = parseInt(match[2]);
        this.b = parseInt(match[3]);
      } else if (SVG.regex.isHex.test(color)) {
        // get hex values
        match = SVG.regex.hex.exec(fullHex(color));

        // parse numeric values
        this.r = parseInt(match[1], 16);
        this.g = parseInt(match[2], 16);
        this.b = parseInt(match[3], 16);
      }
    } else if (typeof color === 'object') {
      this.r = color.r;
      this.g = color.g;
      this.b = color.b;
    }
  };

  SVG.extend(SVG.Color, {
    // Default to hex conversion
    toString: function () {
      return this.toHex();
    }
    // Build hex value
    , toHex: function () {
      return '#' + compToHex(this.r) + compToHex(this.g) + compToHex(this.b);
    }
    // Build rgb value
    , toRgb: function () {
      return 'rgb(' + [this.r, this.g, this.b].join() + ')';
    }
    // Calculate true brightness
    , brightness: function () {
      return this.r / 255 * 0.30 + this.g / 255 * 0.59 + this.b / 255 * 0.11;
    }
    // Make color morphable
    , morph: function (color) {
      this.destination = new SVG.Color(color);

      return this;
    }
    // Get morphed color at given position
    , at: function (pos) {
      // make sure a destination is defined
      if (!this.destination) return this;

      // normalise pos
      pos = pos < 0 ? 0 : pos > 1 ? 1 : pos;

      // generate morphed color
      return new SVG.Color({
        r: ~~(this.r + (this.destination.r - this.r) * pos),
        g: ~~(this.g + (this.destination.g - this.g) * pos),
        b: ~~(this.b + (this.destination.b - this.b) * pos)
      });
    }

  });

  // Testers

  // Test if given value is a color string
  SVG.Color.test = function (color) {
    color += '';
    return SVG.regex.isHex.test(color) || SVG.regex.isRgb.test(color);
  };

  // Test if given value is a rgb object
  SVG.Color.isRgb = function (color) {
    return color && typeof color.r == 'number' && typeof color.g == 'number' && typeof color.b == 'number';
  };

  // Test if given value is a color
  SVG.Color.isColor = function (color) {
    return SVG.Color.isRgb(color) || SVG.Color.test(color);
  };
  // Module for array conversion
  SVG.Array = function (array, fallback) {
    array = (array || []).valueOf();

    // if array is empty and fallback is provided, use fallback
    if (array.length == 0 && fallback) array = fallback.valueOf();

    // parse array
    this.value = this.parse(array);
  };

  SVG.extend(SVG.Array, {
    // Make array morphable
    morph: function (array) {
      this.destination = this.parse(array);

      // normalize length of arrays
      if (this.value.length != this.destination.length) {
        var lastValue = this.value[this.value.length - 1],
            lastDestination = this.destination[this.destination.length - 1];

        while (this.value.length > this.destination.length) this.destination.push(lastDestination);
        while (this.value.length < this.destination.length) this.value.push(lastValue);
      }

      return this;
    }
    // Clean up any duplicate points
    , settle: function () {
      // find all unique values
      for (var i = 0, il = this.value.length, seen = []; i < il; i++) if (seen.indexOf(this.value[i]) == -1) seen.push(this.value[i]);

      // set new value
      return this.value = seen;
    }
    // Get morphed array at given position
    , at: function (pos) {
      // make sure a destination is defined
      if (!this.destination) return this;

      // generate morphed array
      for (var i = 0, il = this.value.length, array = []; i < il; i++) array.push(this.value[i] + (this.destination[i] - this.value[i]) * pos);

      return new SVG.Array(array);
    }
    // Convert array to string
    , toString: function () {
      return this.value.join(' ');
    }
    // Real value
    , valueOf: function () {
      return this.value;
    }
    // Parse whitespace separated string
    , parse: function (array) {
      array = array.valueOf();

      // if already is an array, no need to parse it
      if (Array.isArray(array)) return array;

      return this.split(array);
    }
    // Strip unnecessary whitespace
    , split: function (string) {
      return string.trim().split(SVG.regex.delimiter).map(parseFloat);
    }
    // Reverse array
    , reverse: function () {
      this.value.reverse();

      return this;
    },
    clone: function () {
      var clone = new this.constructor();
      clone.value = array_clone(this.value);
      return clone;
    }
  });
  // Poly points array
  SVG.PointArray = function (array, fallback) {
    SVG.Array.call(this, array, fallback || [[0, 0]]);
  };

  // Inherit from SVG.Array
  SVG.PointArray.prototype = new SVG.Array();
  SVG.PointArray.prototype.constructor = SVG.PointArray;

  SVG.extend(SVG.PointArray, {
    // Convert array to string
    toString: function () {
      // convert to a poly point string
      for (var i = 0, il = this.value.length, array = []; i < il; i++) array.push(this.value[i].join(','));

      return array.join(' ');
    }
    // Convert array to line object
    , toLine: function () {
      return {
        x1: this.value[0][0],
        y1: this.value[0][1],
        x2: this.value[1][0],
        y2: this.value[1][1]
      };
    }
    // Get morphed array at given position
    , at: function (pos) {
      // make sure a destination is defined
      if (!this.destination) return this;

      // generate morphed point string
      for (var i = 0, il = this.value.length, array = []; i < il; i++) array.push([this.value[i][0] + (this.destination[i][0] - this.value[i][0]) * pos, this.value[i][1] + (this.destination[i][1] - this.value[i][1]) * pos]);

      return new SVG.PointArray(array);
    }
    // Parse point string and flat array
    , parse: function (array) {
      var points = [];

      array = array.valueOf();

      // if it is an array
      if (Array.isArray(array)) {
        // and it is not flat, there is no need to parse it
        if (Array.isArray(array[0])) {
          // make sure to use a clone
          return array.map(function (el) {
            return el.slice();
          });
        } else if (array[0].x != null) {
          // allow point objects to be passed
          return array.map(function (el) {
            return [el.x, el.y];
          });
        }
      } else {
        // Else, it is considered as a string
        // parse points
        array = array.trim().split(SVG.regex.delimiter).map(parseFloat);
      }

      // validate points - https://svgwg.org/svg2-draft/shapes.html#DataTypePoints
      // Odd number of coordinates is an error. In such cases, drop the last odd coordinate.
      if (array.length % 2 !== 0) array.pop();

      // wrap points in two-tuples and parse points as floats
      for (var i = 0, len = array.length; i < len; i = i + 2) points.push([array[i], array[i + 1]]);

      return points;
    }
    // Move point string
    , move: function (x, y) {
      var box = this.bbox();

      // get relative offset
      x -= box.x;
      y -= box.y;

      // move every point
      if (!isNaN(x) && !isNaN(y)) for (var i = this.value.length - 1; i >= 0; i--) this.value[i] = [this.value[i][0] + x, this.value[i][1] + y];

      return this;
    }
    // Resize poly string
    , size: function (width, height) {
      var i,
          box = this.bbox();

      // recalculate position of all points according to new size
      for (i = this.value.length - 1; i >= 0; i--) {
        if (box.width) this.value[i][0] = (this.value[i][0] - box.x) * width / box.width + box.x;
        if (box.height) this.value[i][1] = (this.value[i][1] - box.y) * height / box.height + box.y;
      }

      return this;
    }
    // Get bounding box of points
    , bbox: function () {
      SVG.parser.poly.setAttribute('points', this.toString());

      return SVG.parser.poly.getBBox();
    }
  });

  var pathHandlers = {
    M: function (c, p, p0) {
      p.x = p0.x = c[0];
      p.y = p0.y = c[1];

      return ['M', p.x, p.y];
    },
    L: function (c, p) {
      p.x = c[0];
      p.y = c[1];
      return ['L', c[0], c[1]];
    },
    H: function (c, p) {
      p.x = c[0];
      return ['H', c[0]];
    },
    V: function (c, p) {
      p.y = c[0];
      return ['V', c[0]];
    },
    C: function (c, p) {
      p.x = c[4];
      p.y = c[5];
      return ['C', c[0], c[1], c[2], c[3], c[4], c[5]];
    },
    S: function (c, p) {
      p.x = c[2];
      p.y = c[3];
      return ['S', c[0], c[1], c[2], c[3]];
    },
    Q: function (c, p) {
      p.x = c[2];
      p.y = c[3];
      return ['Q', c[0], c[1], c[2], c[3]];
    },
    T: function (c, p) {
      p.x = c[0];
      p.y = c[1];
      return ['T', c[0], c[1]];
    },
    Z: function (c, p, p0) {
      p.x = p0.x;
      p.y = p0.y;
      return ['Z'];
    },
    A: function (c, p) {
      p.x = c[5];
      p.y = c[6];
      return ['A', c[0], c[1], c[2], c[3], c[4], c[5], c[6]];
    }
  };

  var mlhvqtcsa = 'mlhvqtcsaz'.split('');

  for (var i = 0, il = mlhvqtcsa.length; i < il; ++i) {
    pathHandlers[mlhvqtcsa[i]] = function (i) {
      return function (c, p, p0) {
        if (i == 'H') c[0] = c[0] + p.x;else if (i == 'V') c[0] = c[0] + p.y;else if (i == 'A') {
          c[5] = c[5] + p.x, c[6] = c[6] + p.y;
        } else for (var j = 0, jl = c.length; j < jl; ++j) {
          c[j] = c[j] + (j % 2 ? p.y : p.x);
        }

        return pathHandlers[i](c, p, p0);
      };
    }(mlhvqtcsa[i].toUpperCase());
  }

  // Path points array
  SVG.PathArray = function (array, fallback) {
    SVG.Array.call(this, array, fallback || [['M', 0, 0]]);
  };

  // Inherit from SVG.Array
  SVG.PathArray.prototype = new SVG.Array();
  SVG.PathArray.prototype.constructor = SVG.PathArray;

  SVG.extend(SVG.PathArray, {
    // Convert array to string
    toString: function () {
      return arrayToString(this.value);
    }
    // Move path string
    , move: function (x, y) {
      // get bounding box of current situation
      var box = this.bbox();

      // get relative offset
      x -= box.x;
      y -= box.y;

      if (!isNaN(x) && !isNaN(y)) {
        // move every point
        for (var l, i = this.value.length - 1; i >= 0; i--) {
          l = this.value[i][0];

          if (l == 'M' || l == 'L' || l == 'T') {
            this.value[i][1] += x;
            this.value[i][2] += y;
          } else if (l == 'H') {
            this.value[i][1] += x;
          } else if (l == 'V') {
            this.value[i][1] += y;
          } else if (l == 'C' || l == 'S' || l == 'Q') {
            this.value[i][1] += x;
            this.value[i][2] += y;
            this.value[i][3] += x;
            this.value[i][4] += y;

            if (l == 'C') {
              this.value[i][5] += x;
              this.value[i][6] += y;
            }
          } else if (l == 'A') {
            this.value[i][6] += x;
            this.value[i][7] += y;
          }
        }
      }

      return this;
    }
    // Resize path string
    , size: function (width, height) {
      // get bounding box of current situation
      var i,
          l,
          box = this.bbox();

      // recalculate position of all points according to new size
      for (i = this.value.length - 1; i >= 0; i--) {
        l = this.value[i][0];

        if (l == 'M' || l == 'L' || l == 'T') {
          this.value[i][1] = (this.value[i][1] - box.x) * width / box.width + box.x;
          this.value[i][2] = (this.value[i][2] - box.y) * height / box.height + box.y;
        } else if (l == 'H') {
          this.value[i][1] = (this.value[i][1] - box.x) * width / box.width + box.x;
        } else if (l == 'V') {
          this.value[i][1] = (this.value[i][1] - box.y) * height / box.height + box.y;
        } else if (l == 'C' || l == 'S' || l == 'Q') {
          this.value[i][1] = (this.value[i][1] - box.x) * width / box.width + box.x;
          this.value[i][2] = (this.value[i][2] - box.y) * height / box.height + box.y;
          this.value[i][3] = (this.value[i][3] - box.x) * width / box.width + box.x;
          this.value[i][4] = (this.value[i][4] - box.y) * height / box.height + box.y;

          if (l == 'C') {
            this.value[i][5] = (this.value[i][5] - box.x) * width / box.width + box.x;
            this.value[i][6] = (this.value[i][6] - box.y) * height / box.height + box.y;
          }
        } else if (l == 'A') {
          // resize radii
          this.value[i][1] = this.value[i][1] * width / box.width;
          this.value[i][2] = this.value[i][2] * height / box.height;

          // move position values
          this.value[i][6] = (this.value[i][6] - box.x) * width / box.width + box.x;
          this.value[i][7] = (this.value[i][7] - box.y) * height / box.height + box.y;
        }
      }

      return this;
    }
    // Test if the passed path array use the same path data commands as this path array
    , equalCommands: function (pathArray) {
      var i, il, equalCommands;

      pathArray = new SVG.PathArray(pathArray);

      equalCommands = this.value.length === pathArray.value.length;
      for (i = 0, il = this.value.length; equalCommands && i < il; i++) {
        equalCommands = this.value[i][0] === pathArray.value[i][0];
      }

      return equalCommands;
    }
    // Make path array morphable
    , morph: function (pathArray) {
      pathArray = new SVG.PathArray(pathArray);

      if (this.equalCommands(pathArray)) {
        this.destination = pathArray;
      } else {
        this.destination = null;
      }

      return this;
    }
    // Get morphed path array at given position
    , at: function (pos) {
      // make sure a destination is defined
      if (!this.destination) return this;

      var sourceArray = this.value,
          destinationArray = this.destination.value,
          array = [],
          pathArray = new SVG.PathArray(),
          i,
          il,
          j,
          jl;

      // Animate has specified in the SVG spec
      // See: https://www.w3.org/TR/SVG11/paths.html#PathElement
      for (i = 0, il = sourceArray.length; i < il; i++) {
        array[i] = [sourceArray[i][0]];
        for (j = 1, jl = sourceArray[i].length; j < jl; j++) {
          array[i][j] = sourceArray[i][j] + (destinationArray[i][j] - sourceArray[i][j]) * pos;
        }
        // For the two flags of the elliptical arc command, the SVG spec say:
        // Flags and booleans are interpolated as fractions between zero and one, with any non-zero value considered to be a value of one/true
        // Elliptical arc command as an array followed by corresponding indexes:
        // ['A', rx, ry, x-axis-rotation, large-arc-flag, sweep-flag, x, y]
        //   0    1   2        3                 4             5      6  7
        if (array[i][0] === 'A') {
          array[i][4] = +(array[i][4] != 0);
          array[i][5] = +(array[i][5] != 0);
        }
      }

      // Directly modify the value of a path array, this is done this way for performance
      pathArray.value = array;
      return pathArray;
    }
    // Absolutize and parse path to array
    , parse: function (array) {
      // if it's already a patharray, no need to parse it
      if (array instanceof SVG.PathArray) return array.valueOf();

      // prepare for parsing
      var i,
          x0,
          y0,
          s,
          seg,
          arr,
          x = 0,
          y = 0,
          paramCnt = { 'M': 2, 'L': 2, 'H': 1, 'V': 1, 'C': 6, 'S': 4, 'Q': 4, 'T': 2, 'A': 7, 'Z': 0 };

      if (typeof array == 'string') {

        array = array.replace(SVG.regex.numbersWithDots, pathRegReplace) // convert 45.123.123 to 45.123 .123
        .replace(SVG.regex.pathLetters, ' $& ') // put some room between letters and numbers
        .replace(SVG.regex.hyphen, '$1 -') // add space before hyphen
        .trim() // trim
        .split(SVG.regex.delimiter); // split into array
      } else {
        array = array.reduce(function (prev, curr) {
          return [].concat.call(prev, curr);
        }, []);
      }

      // array now is an array containing all parts of a path e.g. ['M', '0', '0', 'L', '30', '30' ...]
      var arr = [],
          p = new SVG.Point(),
          p0 = new SVG.Point(),
          index = 0,
          len = array.length;

      do {
        // Test if we have a path letter
        if (SVG.regex.isPathLetter.test(array[index])) {
          s = array[index];
          ++index;
          // If last letter was a move command and we got no new, it defaults to [L]ine
        } else if (s == 'M') {
          s = 'L';
        } else if (s == 'm') {
          s = 'l';
        }

        arr.push(pathHandlers[s].call(null, array.slice(index, index = index + paramCnt[s.toUpperCase()]).map(parseFloat), p, p0));
      } while (len > index);

      return arr;
    }
    // Get bounding box of path
    , bbox: function () {
      SVG.parser.path.setAttribute('d', this.toString());

      return SVG.parser.path.getBBox();
    }

  });

  // Module for unit convertions
  SVG.Number = SVG.invent({
    // Initialize
    create: function (value, unit) {
      // initialize defaults
      this.value = 0;
      this.unit = unit || '';

      // parse value
      if (typeof value === 'number') {
        // ensure a valid numeric value
        this.value = isNaN(value) ? 0 : !isFinite(value) ? value < 0 ? -3.4e+38 : +3.4e+38 : value;
      } else if (typeof value === 'string') {
        unit = value.match(SVG.regex.numberAndUnit);

        if (unit) {
          // make value numeric
          this.value = parseFloat(unit[1]);

          // normalize
          if (unit[5] == '%') this.value /= 100;else if (unit[5] == 's') this.value *= 1000;

          // store unit
          this.unit = unit[5];
        }
      } else {
        if (value instanceof SVG.Number) {
          this.value = value.valueOf();
          this.unit = value.unit;
        }
      }
    }
    // Add methods
    , extend: {
      // Stringalize
      toString: function () {
        return (this.unit == '%' ? ~~(this.value * 1e8) / 1e6 : this.unit == 's' ? this.value / 1e3 : this.value) + this.unit;
      },
      toJSON: function () {
        return this.toString();
      },
      // Convert to primitive
      valueOf: function () {
        return this.value;
      }
      // Add number
      , plus: function (number) {
        number = new SVG.Number(number);
        return new SVG.Number(this + number, this.unit || number.unit);
      }
      // Subtract number
      , minus: function (number) {
        number = new SVG.Number(number);
        return new SVG.Number(this - number, this.unit || number.unit);
      }
      // Multiply number
      , times: function (number) {
        number = new SVG.Number(number);
        return new SVG.Number(this * number, this.unit || number.unit);
      }
      // Divide number
      , divide: function (number) {
        number = new SVG.Number(number);
        return new SVG.Number(this / number, this.unit || number.unit);
      }
      // Convert to different unit
      , to: function (unit) {
        var number = new SVG.Number(this);

        if (typeof unit === 'string') number.unit = unit;

        return number;
      }
      // Make number morphable
      , morph: function (number) {
        this.destination = new SVG.Number(number);

        if (number.relative) {
          this.destination.value += this.value;
        }

        return this;
      }
      // Get morphed number at given position
      , at: function (pos) {
        // Make sure a destination is defined
        if (!this.destination) return this;

        // Generate new morphed number
        return new SVG.Number(this.destination).minus(this).times(pos).plus(this);
      }

    }
  });

  SVG.Element = SVG.invent({
    // Initialize node
    create: function (node) {
      // make stroke value accessible dynamically
      this._stroke = SVG.defaults.attrs.stroke;
      this._event = null;
      this._events = {};

      // initialize data object
      this.dom = {};

      // create circular reference
      if (this.node = node) {
        this.type = node.nodeName;
        this.node.instance = this;
        this._events = node._events || {};

        // store current attribute value
        this._stroke = node.getAttribute('stroke') || this._stroke;
      }
    }

    // Add class methods
    , extend: {
      // Move over x-axis
      x: function (x) {
        return this.attr('x', x);
      }
      // Move over y-axis
      , y: function (y) {
        return this.attr('y', y);
      }
      // Move by center over x-axis
      , cx: function (x) {
        return x == null ? this.x() + this.width() / 2 : this.x(x - this.width() / 2);
      }
      // Move by center over y-axis
      , cy: function (y) {
        return y == null ? this.y() + this.height() / 2 : this.y(y - this.height() / 2);
      }
      // Move element to given x and y values
      , move: function (x, y) {
        return this.x(x).y(y);
      }
      // Move element by its center
      , center: function (x, y) {
        return this.cx(x).cy(y);
      }
      // Set width of element
      , width: function (width) {
        return this.attr('width', width);
      }
      // Set height of element
      , height: function (height) {
        return this.attr('height', height);
      }
      // Set element size to given width and height
      , size: function (width, height) {
        var p = proportionalSize(this, width, height);

        return this.width(new SVG.Number(p.width)).height(new SVG.Number(p.height));
      }
      // Clone element
      , clone: function (parent) {
        // write dom data to the dom so the clone can pickup the data
        this.writeDataToDom();

        // clone element and assign new id
        var clone = assignNewId(this.node.cloneNode(true));

        // insert the clone in the given parent or after myself
        if (parent) parent.add(clone);else this.after(clone);

        return clone;
      }
      // Remove element
      , remove: function () {
        if (this.parent()) this.parent().removeElement(this);

        return this;
      }
      // Replace element
      , replace: function (element) {
        this.after(element).remove();

        return element;
      }
      // Add element to given container and return self
      , addTo: function (parent) {
        return parent.put(this);
      }
      // Add element to given container and return container
      , putIn: function (parent) {
        return parent.add(this);
      }
      // Get / set id
      , id: function (id) {
        return this.attr('id', id);
      }
      // Checks whether the given point inside the bounding box of the element
      , inside: function (x, y) {
        var box = this.bbox();

        return x > box.x && y > box.y && x < box.x + box.width && y < box.y + box.height;
      }
      // Show element
      , show: function () {
        return this.style('display', '');
      }
      // Hide element
      , hide: function () {
        return this.style('display', 'none');
      }
      // Is element visible?
      , visible: function () {
        return this.style('display') != 'none';
      }
      // Return id on string conversion
      , toString: function () {
        return this.attr('id');
      }
      // Return array of classes on the node
      , classes: function () {
        var attr = this.attr('class');

        return attr == null ? [] : attr.trim().split(SVG.regex.delimiter);
      }
      // Return true if class exists on the node, false otherwise
      , hasClass: function (name) {
        return this.classes().indexOf(name) != -1;
      }
      // Add class to the node
      , addClass: function (name) {
        if (!this.hasClass(name)) {
          var array = this.classes();
          array.push(name);
          this.attr('class', array.join(' '));
        }

        return this;
      }
      // Remove class from the node
      , removeClass: function (name) {
        if (this.hasClass(name)) {
          this.attr('class', this.classes().filter(function (c) {
            return c != name;
          }).join(' '));
        }

        return this;
      }
      // Toggle the presence of a class on the node
      , toggleClass: function (name) {
        return this.hasClass(name) ? this.removeClass(name) : this.addClass(name);
      }
      // Get referenced element form attribute value
      , reference: function (attr) {
        return SVG.get(this.attr(attr));
      }
      // Returns the parent element instance
      , parent: function (type) {
        var parent = this;

        // check for parent
        if (!parent.node.parentNode) return null;

        // get parent element
        parent = SVG.adopt(parent.node.parentNode);

        if (!type) return parent;

        // loop trough ancestors if type is given
        while (parent && parent.node instanceof window.SVGElement) {
          if (typeof type === 'string' ? parent.matches(type) : parent instanceof type) return parent;
          if (!parent.node.parentNode || parent.node.parentNode.nodeName == '#document' || parent.node.parentNode.nodeName == '#document-fragment') return null; // #759, #720
          parent = SVG.adopt(parent.node.parentNode);
        }
      }
      // Get parent document
      , doc: function () {
        return this instanceof SVG.Doc ? this : this.parent(SVG.Doc);
      }
      // return array of all ancestors of given type up to the root svg
      , parents: function (type) {
        var parents = [],
            parent = this;

        do {
          parent = parent.parent(type);
          if (!parent || !parent.node) break;

          parents.push(parent);
        } while (parent.parent);

        return parents;
      }
      // matches the element vs a css selector
      , matches: function (selector) {
        return matches(this.node, selector);
      }
      // Returns the svg node to call native svg methods on it
      , native: function () {
        return this.node;
      }
      // Import raw svg
      , svg: function (svg) {
        // create temporary holder
        var well = document.createElement('svg');

        // act as a setter if svg is given
        if (svg && this instanceof SVG.Parent) {
          // dump raw svg
          well.innerHTML = '<svg>' + svg.replace(/\n/, '').replace(/<([\w:-]+)([^<]+?)\/>/g, '<$1$2></$1>') + '</svg>';

          // transplant nodes
          for (var i = 0, il = well.firstChild.childNodes.length; i < il; i++) this.node.appendChild(well.firstChild.firstChild);

          // otherwise act as a getter
        } else {
          // create a wrapping svg element in case of partial content
          well.appendChild(svg = document.createElement('svg'));

          // write svgjs data to the dom
          this.writeDataToDom();

          // insert a copy of this node
          svg.appendChild(this.node.cloneNode(true));

          // return target element
          return well.innerHTML.replace(/^<svg>/, '').replace(/<\/svg>$/, '');
        }

        return this;
      }
      // write svgjs data to the dom
      , writeDataToDom: function () {

        // dump variables recursively
        if (this.each || this.lines) {
          var fn = this.each ? this : this.lines();
          fn.each(function () {
            this.writeDataToDom();
          });
        }

        // remove previously set data
        this.node.removeAttribute('svgjs:data');

        if (Object.keys(this.dom).length) this.node.setAttribute('svgjs:data', JSON.stringify(this.dom)); // see #428

        return this;
      }
      // set given data to the elements data property
      , setData: function (o) {
        this.dom = o;
        return this;
      },
      is: function (obj) {
        return is(this, obj);
      }
    }
  });

  SVG.easing = {
    '-': function (pos) {
      return pos;
    },
    '<>': function (pos) {
      return -Math.cos(pos * Math.PI) / 2 + 0.5;
    },
    '>': function (pos) {
      return Math.sin(pos * Math.PI / 2);
    },
    '<': function (pos) {
      return -Math.cos(pos * Math.PI / 2) + 1;
    }
  };

  SVG.morph = function (pos) {
    return function (from, to) {
      return new SVG.MorphObj(from, to).at(pos);
    };
  };

  SVG.Situation = SVG.invent({

    create: function (o) {
      this.init = false;
      this.reversed = false;
      this.reversing = false;

      this.duration = new SVG.Number(o.duration).valueOf();
      this.delay = new SVG.Number(o.delay).valueOf();

      this.start = +new Date() + this.delay;
      this.finish = this.start + this.duration;
      this.ease = o.ease;

      // this.loop is incremented from 0 to this.loops
      // it is also incremented when in an infinite loop (when this.loops is true)
      this.loop = 0;
      this.loops = false;

      this.animations = {
        // functionToCall: [list of morphable objects]
        // e.g. move: [SVG.Number, SVG.Number]
      };

      this.attrs = {
        // holds all attributes which are not represented from a function svg.js provides
        // e.g. someAttr: SVG.Number
      };

      this.styles = {
        // holds all styles which should be animated
        // e.g. fill-color: SVG.Color
      };

      this.transforms = [
        // holds all transformations as transformation objects
        // e.g. [SVG.Rotate, SVG.Translate, SVG.Matrix]
      ];

      this.once = {
        // functions to fire at a specific position
        // e.g. "0.5": function foo(){}
      };
    }

  });

  SVG.FX = SVG.invent({

    create: function (element) {
      this._target = element;
      this.situations = [];
      this.active = false;
      this.situation = null;
      this.paused = false;
      this.lastPos = 0;
      this.pos = 0;
      // The absolute position of an animation is its position in the context of its complete duration (including delay and loops)
      // When performing a delay, absPos is below 0 and when performing a loop, its value is above 1
      this.absPos = 0;
      this._speed = 1;
    },

    extend: {

      /**
       * sets or returns the target of this animation
       * @param o object || number In case of Object it holds all parameters. In case of number its the duration of the animation
       * @param ease function || string Function which should be used for easing or easing keyword
       * @param delay Number indicating the delay before the animation starts
       * @return target || this
       */
      animate: function (o, ease, delay) {

        if (typeof o == 'object') {
          ease = o.ease;
          delay = o.delay;
          o = o.duration;
        }

        var situation = new SVG.Situation({
          duration: o || 1000,
          delay: delay || 0,
          ease: SVG.easing[ease || '-'] || ease
        });

        this.queue(situation);

        return this;
      }

      /**
       * sets a delay before the next element of the queue is called
       * @param delay Duration of delay in milliseconds
       * @return this.target()
       */
      , delay: function (delay) {
        // The delay is performed by an empty situation with its duration
        // attribute set to the duration of the delay
        var situation = new SVG.Situation({
          duration: delay,
          delay: 0,
          ease: SVG.easing['-']
        });

        return this.queue(situation);
      }

      /**
       * sets or returns the target of this animation
       * @param null || target SVG.Element which should be set as new target
       * @return target || this
       */
      , target: function (target) {
        if (target && target instanceof SVG.Element) {
          this._target = target;
          return this;
        }

        return this._target;
      }

      // returns the absolute position at a given time
      , timeToAbsPos: function (timestamp) {
        return (timestamp - this.situation.start) / (this.situation.duration / this._speed);
      }

      // returns the timestamp from a given absolute positon
      , absPosToTime: function (absPos) {
        return this.situation.duration / this._speed * absPos + this.situation.start;
      }

      // starts the animationloop
      , startAnimFrame: function () {
        this.stopAnimFrame();
        this.animationFrame = window.requestAnimationFrame(function () {
          this.step();
        }.bind(this));
      }

      // cancels the animationframe
      , stopAnimFrame: function () {
        window.cancelAnimationFrame(this.animationFrame);
      }

      // kicks off the animation - only does something when the queue is currently not active and at least one situation is set
      , start: function () {
        // dont start if already started
        if (!this.active && this.situation) {
          this.active = true;
          this.startCurrent();
        }

        return this;
      }

      // start the current situation
      , startCurrent: function () {
        this.situation.start = +new Date() + this.situation.delay / this._speed;
        this.situation.finish = this.situation.start + this.situation.duration / this._speed;
        return this.initAnimations().step();
      }

      /**
       * adds a function / Situation to the animation queue
       * @param fn function / situation to add
       * @return this
       */
      , queue: function (fn) {
        if (typeof fn == 'function' || fn instanceof SVG.Situation) this.situations.push(fn);

        if (!this.situation) this.situation = this.situations.shift();

        return this;
      }

      /**
       * pulls next element from the queue and execute it
       * @return this
       */
      , dequeue: function () {
        // stop current animation
        this.stop();

        // get next animation from queue
        this.situation = this.situations.shift();

        if (this.situation) {
          if (this.situation instanceof SVG.Situation) {
            this.start();
          } else {
            // If it is not a SVG.Situation, then it is a function, we execute it
            this.situation.call(this);
          }
        }

        return this;
      }

      // updates all animations to the current state of the element
      // this is important when one property could be changed from another property
      , initAnimations: function () {
        var i, j, source;
        var s = this.situation;

        if (s.init) return this;

        for (i in s.animations) {
          source = this.target()[i]();

          if (!Array.isArray(source)) {
            source = [source];
          }

          if (!Array.isArray(s.animations[i])) {
            s.animations[i] = [s.animations[i]];
          }

          //if(s.animations[i].length > source.length) {
          //  source.concat = source.concat(s.animations[i].slice(source.length, s.animations[i].length))
          //}

          for (j = source.length; j--;) {
            // The condition is because some methods return a normal number instead
            // of a SVG.Number
            if (s.animations[i][j] instanceof SVG.Number) source[j] = new SVG.Number(source[j]);

            s.animations[i][j] = source[j].morph(s.animations[i][j]);
          }
        }

        for (i in s.attrs) {
          s.attrs[i] = new SVG.MorphObj(this.target().attr(i), s.attrs[i]);
        }

        for (i in s.styles) {
          s.styles[i] = new SVG.MorphObj(this.target().style(i), s.styles[i]);
        }

        s.initialTransformation = this.target().matrixify();

        s.init = true;
        return this;
      },
      clearQueue: function () {
        this.situations = [];
        return this;
      },
      clearCurrent: function () {
        this.situation = null;
        return this;
      }
      /** stops the animation immediately
       * @param jumpToEnd A Boolean indicating whether to complete the current animation immediately.
       * @param clearQueue A Boolean indicating whether to remove queued animation as well.
       * @return this
       */
      , stop: function (jumpToEnd, clearQueue) {
        var active = this.active;
        this.active = false;

        if (clearQueue) {
          this.clearQueue();
        }

        if (jumpToEnd && this.situation) {
          // initialize the situation if it was not
          !active && this.startCurrent();
          this.atEnd();
        }

        this.stopAnimFrame();

        return this.clearCurrent();
      }

      /** resets the element to the state where the current element has started
       * @return this
       */
      , reset: function () {
        if (this.situation) {
          var temp = this.situation;
          this.stop();
          this.situation = temp;
          this.atStart();
        }
        return this;
      }

      // Stop the currently-running animation, remove all queued animations, and complete all animations for the element.
      , finish: function () {

        this.stop(true, false);

        while (this.dequeue().situation && this.stop(true, false));

        this.clearQueue().clearCurrent();

        return this;
      }

      // set the internal animation pointer at the start position, before any loops, and updates the visualisation
      , atStart: function () {
        return this.at(0, true);
      }

      // set the internal animation pointer at the end position, after all the loops, and updates the visualisation
      , atEnd: function () {
        if (this.situation.loops === true) {
          // If in a infinite loop, we end the current iteration
          this.situation.loops = this.situation.loop + 1;
        }

        if (typeof this.situation.loops == 'number') {
          // If performing a finite number of loops, we go after all the loops
          return this.at(this.situation.loops, true);
        } else {
          // If no loops, we just go at the end
          return this.at(1, true);
        }
      }

      // set the internal animation pointer to the specified position and updates the visualisation
      // if isAbsPos is true, pos is treated as an absolute position
      , at: function (pos, isAbsPos) {
        var durDivSpd = this.situation.duration / this._speed;

        this.absPos = pos;
        // If pos is not an absolute position, we convert it into one
        if (!isAbsPos) {
          if (this.situation.reversed) this.absPos = 1 - this.absPos;
          this.absPos += this.situation.loop;
        }

        this.situation.start = +new Date() - this.absPos * durDivSpd;
        this.situation.finish = this.situation.start + durDivSpd;

        return this.step(true);
      }

      /**
       * sets or returns the speed of the animations
       * @param speed null || Number The new speed of the animations
       * @return Number || this
       */
      , speed: function (speed) {
        if (speed === 0) return this.pause();

        if (speed) {
          this._speed = speed;
          // We use an absolute position here so that speed can affect the delay before the animation
          return this.at(this.absPos, true);
        } else return this._speed;
      }

      // Make loopable
      , loop: function (times, reverse) {
        var c = this.last();

        // store total loops
        c.loops = times != null ? times : true;
        c.loop = 0;

        if (reverse) c.reversing = true;
        return this;
      }

      // pauses the animation
      , pause: function () {
        this.paused = true;
        this.stopAnimFrame();

        return this;
      }

      // unpause the animation
      , play: function () {
        if (!this.paused) return this;
        this.paused = false;
        // We use an absolute position here so that the delay before the animation can be paused
        return this.at(this.absPos, true);
      }

      /**
       * toggle or set the direction of the animation
       * true sets direction to backwards while false sets it to forwards
       * @param reversed Boolean indicating whether to reverse the animation or not (default: toggle the reverse status)
       * @return this
       */
      , reverse: function (reversed) {
        var c = this.last();

        if (typeof reversed == 'undefined') c.reversed = !c.reversed;else c.reversed = reversed;

        return this;
      }

      /**
       * returns a float from 0-1 indicating the progress of the current animation
       * @param eased Boolean indicating whether the returned position should be eased or not
       * @return number
       */
      , progress: function (easeIt) {
        return easeIt ? this.situation.ease(this.pos) : this.pos;
      }

      /**
       * adds a callback function which is called when the current animation is finished
       * @param fn Function which should be executed as callback
       * @return number
       */
      , after: function (fn) {
        var c = this.last(),
            wrapper = function wrapper(e) {
          if (e.detail.situation == c) {
            fn.call(this, c);
            this.off('finished.fx', wrapper); // prevent memory leak
          }
        };

        this.target().on('finished.fx', wrapper);

        return this._callStart();
      }

      // adds a callback which is called whenever one animation step is performed
      , during: function (fn) {
        var c = this.last(),
            wrapper = function (e) {
          if (e.detail.situation == c) {
            fn.call(this, e.detail.pos, SVG.morph(e.detail.pos), e.detail.eased, c);
          }
        };

        // see above
        this.target().off('during.fx', wrapper).on('during.fx', wrapper);

        this.after(function () {
          this.off('during.fx', wrapper);
        });

        return this._callStart();
      }

      // calls after ALL animations in the queue are finished
      , afterAll: function (fn) {
        var wrapper = function wrapper(e) {
          fn.call(this);
          this.off('allfinished.fx', wrapper);
        };

        // see above
        this.target().off('allfinished.fx', wrapper).on('allfinished.fx', wrapper);

        return this._callStart();
      }

      // calls on every animation step for all animations
      , duringAll: function (fn) {
        var wrapper = function (e) {
          fn.call(this, e.detail.pos, SVG.morph(e.detail.pos), e.detail.eased, e.detail.situation);
        };

        this.target().off('during.fx', wrapper).on('during.fx', wrapper);

        this.afterAll(function () {
          this.off('during.fx', wrapper);
        });

        return this._callStart();
      },

      last: function () {
        return this.situations.length ? this.situations[this.situations.length - 1] : this.situation;
      }

      // adds one property to the animations
      , add: function (method, args, type) {
        this.last()[type || 'animations'][method] = args;
        return this._callStart();
      }

      /** perform one step of the animation
       *  @param ignoreTime Boolean indicating whether to ignore time and use position directly or recalculate position based on time
       *  @return this
       */
      , step: function (ignoreTime) {

        // convert current time to an absolute position
        if (!ignoreTime) this.absPos = this.timeToAbsPos(+new Date());

        // This part convert an absolute position to a position
        if (this.situation.loops !== false) {
          var absPos, absPosInt, lastLoop;

          // If the absolute position is below 0, we just treat it as if it was 0
          absPos = Math.max(this.absPos, 0);
          absPosInt = Math.floor(absPos);

          if (this.situation.loops === true || absPosInt < this.situation.loops) {
            this.pos = absPos - absPosInt;
            lastLoop = this.situation.loop;
            this.situation.loop = absPosInt;
          } else {
            this.absPos = this.situation.loops;
            this.pos = 1;
            // The -1 here is because we don't want to toggle reversed when all the loops have been completed
            lastLoop = this.situation.loop - 1;
            this.situation.loop = this.situation.loops;
          }

          if (this.situation.reversing) {
            // Toggle reversed if an odd number of loops as occured since the last call of step
            this.situation.reversed = this.situation.reversed != Boolean((this.situation.loop - lastLoop) % 2);
          }
        } else {
          // If there are no loop, the absolute position must not be above 1
          this.absPos = Math.min(this.absPos, 1);
          this.pos = this.absPos;
        }

        // while the absolute position can be below 0, the position must not be below 0
        if (this.pos < 0) this.pos = 0;

        if (this.situation.reversed) this.pos = 1 - this.pos;

        // apply easing
        var eased = this.situation.ease(this.pos);

        // call once-callbacks
        for (var i in this.situation.once) {
          if (i > this.lastPos && i <= eased) {
            this.situation.once[i].call(this.target(), this.pos, eased);
            delete this.situation.once[i];
          }
        }

        // fire during callback with position, eased position and current situation as parameter
        if (this.active) this.target().fire('during', { pos: this.pos, eased: eased, fx: this, situation: this.situation });

        // the user may call stop or finish in the during callback
        // so make sure that we still have a valid situation
        if (!this.situation) {
          return this;
        }

        // apply the actual animation to every property
        this.eachAt();

        // do final code when situation is finished
        if (this.pos == 1 && !this.situation.reversed || this.situation.reversed && this.pos == 0) {

          // stop animation callback
          this.stopAnimFrame();

          // fire finished callback with current situation as parameter
          this.target().fire('finished', { fx: this, situation: this.situation });

          if (!this.situations.length) {
            this.target().fire('allfinished');

            // Recheck the length since the user may call animate in the afterAll callback
            if (!this.situations.length) {
              this.target().off('.fx'); // there shouldnt be any binding left, but to make sure...
              this.active = false;
            }
          }

          // start next animation
          if (this.active) this.dequeue();else this.clearCurrent();
        } else if (!this.paused && this.active) {
          // we continue animating when we are not at the end
          this.startAnimFrame();
        }

        // save last eased position for once callback triggering
        this.lastPos = eased;
        return this;
      }

      // calculates the step for every property and calls block with it
      , eachAt: function () {
        var i,
            len,
            at,
            self = this,
            target = this.target(),
            s = this.situation;

        // apply animations which can be called trough a method
        for (i in s.animations) {

          at = [].concat(s.animations[i]).map(function (el) {
            return typeof el !== 'string' && el.at ? el.at(s.ease(self.pos), self.pos) : el;
          });

          target[i].apply(target, at);
        }

        // apply animation which has to be applied with attr()
        for (i in s.attrs) {

          at = [i].concat(s.attrs[i]).map(function (el) {
            return typeof el !== 'string' && el.at ? el.at(s.ease(self.pos), self.pos) : el;
          });

          target.attr.apply(target, at);
        }

        // apply animation which has to be applied with style()
        for (i in s.styles) {

          at = [i].concat(s.styles[i]).map(function (el) {
            return typeof el !== 'string' && el.at ? el.at(s.ease(self.pos), self.pos) : el;
          });

          target.style.apply(target, at);
        }

        // animate initialTransformation which has to be chained
        if (s.transforms.length) {

          // get initial initialTransformation
          at = s.initialTransformation;
          for (i = 0, len = s.transforms.length; i < len; i++) {

            // get next transformation in chain
            var a = s.transforms[i];

            // multiply matrix directly
            if (a instanceof SVG.Matrix) {

              if (a.relative) {
                at = at.multiply(new SVG.Matrix().morph(a).at(s.ease(this.pos)));
              } else {
                at = at.morph(a).at(s.ease(this.pos));
              }
              continue;
            }

            // when transformation is absolute we have to reset the needed transformation first
            if (!a.relative) a.undo(at.extract());

            // and reapply it after
            at = at.multiply(a.at(s.ease(this.pos)));
          }

          // set new matrix on element
          target.matrix(at);
        }

        return this;
      }

      // adds an once-callback which is called at a specific position and never again
      , once: function (pos, fn, isEased) {
        var c = this.last();
        if (!isEased) pos = c.ease(pos);

        c.once[pos] = fn;

        return this;
      },

      _callStart: function () {
        setTimeout(function () {
          this.start();
        }.bind(this), 0);
        return this;
      }

    },

    parent: SVG.Element

    // Add method to parent elements
    , construct: {
      // Get fx module or create a new one, then animate with given duration and ease
      animate: function (o, ease, delay) {
        return (this.fx || (this.fx = new SVG.FX(this))).animate(o, ease, delay);
      },
      delay: function (delay) {
        return (this.fx || (this.fx = new SVG.FX(this))).delay(delay);
      },
      stop: function (jumpToEnd, clearQueue) {
        if (this.fx) this.fx.stop(jumpToEnd, clearQueue);

        return this;
      },
      finish: function () {
        if (this.fx) this.fx.finish();

        return this;
      }
      // Pause current animation
      , pause: function () {
        if (this.fx) this.fx.pause();

        return this;
      }
      // Play paused current animation
      , play: function () {
        if (this.fx) this.fx.play();

        return this;
      }
      // Set/Get the speed of the animations
      , speed: function (speed) {
        if (this.fx) if (speed == null) return this.fx.speed();else this.fx.speed(speed);

        return this;
      }
    }

  });

  // MorphObj is used whenever no morphable object is given
  SVG.MorphObj = SVG.invent({

    create: function (from, to) {
      // prepare color for morphing
      if (SVG.Color.isColor(to)) return new SVG.Color(from).morph(to);
      // check if we have a list of values
      if (SVG.regex.delimiter.test(from)) {
        // prepare path for morphing
        if (SVG.regex.pathLetters.test(from)) return new SVG.PathArray(from).morph(to);
        // prepare value list for morphing
        else return new SVG.Array(from).morph(to);
      }
      // prepare number for morphing
      if (SVG.regex.numberAndUnit.test(to)) return new SVG.Number(from).morph(to);

      // prepare for plain morphing
      this.value = from;
      this.destination = to;
    },

    extend: {
      at: function (pos, real) {
        return real < 1 ? this.value : this.destination;
      },

      valueOf: function () {
        return this.value;
      }
    }

  });

  SVG.extend(SVG.FX, {
    // Add animatable attributes
    attr: function (a, v, relative) {
      // apply attributes individually
      if (typeof a == 'object') {
        for (var key in a) this.attr(key, a[key]);
      } else {
        this.add(a, v, 'attrs');
      }

      return this;
    }
    // Add animatable styles
    , style: function (s, v) {
      if (typeof s == 'object') for (var key in s) this.style(key, s[key]);else this.add(s, v, 'styles');

      return this;
    }
    // Animatable x-axis
    , x: function (x, relative) {
      if (this.target() instanceof SVG.G) {
        this.transform({ x: x }, relative);
        return this;
      }

      var num = new SVG.Number(x);
      num.relative = relative;
      return this.add('x', num);
    }
    // Animatable y-axis
    , y: function (y, relative) {
      if (this.target() instanceof SVG.G) {
        this.transform({ y: y }, relative);
        return this;
      }

      var num = new SVG.Number(y);
      num.relative = relative;
      return this.add('y', num);
    }
    // Animatable center x-axis
    , cx: function (x) {
      return this.add('cx', new SVG.Number(x));
    }
    // Animatable center y-axis
    , cy: function (y) {
      return this.add('cy', new SVG.Number(y));
    }
    // Add animatable move
    , move: function (x, y) {
      return this.x(x).y(y);
    }
    // Add animatable center
    , center: function (x, y) {
      return this.cx(x).cy(y);
    }
    // Add animatable size
    , size: function (width, height) {
      if (this.target() instanceof SVG.Text) {
        // animate font size for Text elements
        this.attr('font-size', width);
      } else {
        // animate bbox based size for all other elements
        var box;

        if (!width || !height) {
          box = this.target().bbox();
        }

        if (!width) {
          width = box.width / box.height * height;
        }

        if (!height) {
          height = box.height / box.width * width;
        }

        this.add('width', new SVG.Number(width)).add('height', new SVG.Number(height));
      }

      return this;
    }
    // Add animatable width
    , width: function (width) {
      return this.add('width', new SVG.Number(width));
    }
    // Add animatable height
    , height: function (height) {
      return this.add('height', new SVG.Number(height));
    }
    // Add animatable plot
    , plot: function (a, b, c, d) {
      // Lines can be plotted with 4 arguments
      if (arguments.length == 4) {
        return this.plot([a, b, c, d]);
      }

      return this.add('plot', new (this.target().morphArray)(a));
    }
    // Add leading method
    , leading: function (value) {
      return this.target().leading ? this.add('leading', new SVG.Number(value)) : this;
    }
    // Add animatable viewbox
    , viewbox: function (x, y, width, height) {
      if (this.target() instanceof SVG.Container) {
        this.add('viewbox', new SVG.ViewBox(x, y, width, height));
      }

      return this;
    },
    update: function (o) {
      if (this.target() instanceof SVG.Stop) {
        if (typeof o == 'number' || o instanceof SVG.Number) {
          return this.update({
            offset: arguments[0],
            color: arguments[1],
            opacity: arguments[2]
          });
        }

        if (o.opacity != null) this.attr('stop-opacity', o.opacity);
        if (o.color != null) this.attr('stop-color', o.color);
        if (o.offset != null) this.attr('offset', o.offset);
      }

      return this;
    }
  });

  SVG.Box = SVG.invent({
    create: function (x, y, width, height) {
      if (typeof x == 'object' && !(x instanceof SVG.Element)) {
        // chromes getBoundingClientRect has no x and y property
        return SVG.Box.call(this, x.left != null ? x.left : x.x, x.top != null ? x.top : x.y, x.width, x.height);
      } else if (arguments.length == 4) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
      }

      // add center, right, bottom...
      fullBox(this);
    },
    extend: {
      // Merge rect box with another, return a new instance
      merge: function (box) {
        var b = new this.constructor();

        // merge boxes
        b.x = Math.min(this.x, box.x);
        b.y = Math.min(this.y, box.y);
        b.width = Math.max(this.x + this.width, box.x + box.width) - b.x;
        b.height = Math.max(this.y + this.height, box.y + box.height) - b.y;

        return fullBox(b);
      },

      transform: function (m) {
        var xMin = Infinity,
            xMax = -Infinity,
            yMin = Infinity,
            yMax = -Infinity,
            p,
            bbox;

        var pts = [new SVG.Point(this.x, this.y), new SVG.Point(this.x2, this.y), new SVG.Point(this.x, this.y2), new SVG.Point(this.x2, this.y2)];

        pts.forEach(function (p) {
          p = p.transform(m);
          xMin = Math.min(xMin, p.x);
          xMax = Math.max(xMax, p.x);
          yMin = Math.min(yMin, p.y);
          yMax = Math.max(yMax, p.y);
        });

        bbox = new this.constructor();
        bbox.x = xMin;
        bbox.width = xMax - xMin;
        bbox.y = yMin;
        bbox.height = yMax - yMin;

        fullBox(bbox);

        return bbox;
      }
    }
  });

  SVG.BBox = SVG.invent({
    // Initialize
    create: function (element) {
      SVG.Box.apply(this, [].slice.call(arguments));

      // get values if element is given
      if (element instanceof SVG.Element) {
        var box;

        // yes this is ugly, but Firefox can be a pain when it comes to elements that are not yet rendered
        try {

          if (!document.documentElement.contains) {
            // This is IE - it does not support contains() for top-level SVGs
            var topParent = element.node;
            while (topParent.parentNode) {
              topParent = topParent.parentNode;
            }
            if (topParent != document) throw new Exception('Element not in the dom');
          } else {
            // the element is NOT in the dom, throw error
            if (!document.documentElement.contains(element.node)) throw new Exception('Element not in the dom');
          }

          // find native bbox
          box = element.node.getBBox();
        } catch (e) {
          if (element instanceof SVG.Shape) {
            var clone = element.clone(SVG.parser.draw.instance).show();
            box = clone.node.getBBox();
            clone.remove();
          } else {
            box = {
              x: element.node.clientLeft,
              y: element.node.clientTop,
              width: element.node.clientWidth,
              height: element.node.clientHeight
            };
          }
        }

        SVG.Box.call(this, box);
      }
    }

    // Define ancestor
    , inherit: SVG.Box

    // Define Parent
    , parent: SVG.Element

    // Constructor
    , construct: {
      // Get bounding box
      bbox: function () {
        return new SVG.BBox(this);
      }
    }

  });

  SVG.BBox.prototype.constructor = SVG.BBox;

  SVG.extend(SVG.Element, {
    tbox: function () {
      console.warn('Use of TBox is deprecated and mapped to RBox. Use .rbox() instead.');
      return this.rbox(this.doc());
    }
  });

  SVG.RBox = SVG.invent({
    // Initialize
    create: function (element) {
      SVG.Box.apply(this, [].slice.call(arguments));

      if (element instanceof SVG.Element) {
        SVG.Box.call(this, element.node.getBoundingClientRect());
      }
    },

    inherit: SVG.Box

    // define Parent
    , parent: SVG.Element,

    extend: {
      addOffset: function () {
        // offset by window scroll position, because getBoundingClientRect changes when window is scrolled
        this.x += window.pageXOffset;
        this.y += window.pageYOffset;
        return this;
      }

      // Constructor
    }, construct: {
      // Get rect box
      rbox: function (el) {
        if (el) return new SVG.RBox(this).transform(el.screenCTM().inverse());
        return new SVG.RBox(this).addOffset();
      }
    }

  });

  SVG.RBox.prototype.constructor = SVG.RBox;

  SVG.Matrix = SVG.invent({
    // Initialize
    create: function (source) {
      var i,
          base = arrayToMatrix([1, 0, 0, 1, 0, 0]);

      // ensure source as object
      source = source instanceof SVG.Element ? source.matrixify() : typeof source === 'string' ? arrayToMatrix(source.split(SVG.regex.delimiter).map(parseFloat)) : arguments.length == 6 ? arrayToMatrix([].slice.call(arguments)) : Array.isArray(source) ? arrayToMatrix(source) : typeof source === 'object' ? source : base;

      // merge source
      for (i = abcdef.length - 1; i >= 0; --i) this[abcdef[i]] = source[abcdef[i]] != null ? source[abcdef[i]] : base[abcdef[i]];
    }

    // Add methods
    , extend: {
      // Extract individual transformations
      extract: function () {
        // find delta transform points
        var px = deltaTransformPoint(this, 0, 1),
            py = deltaTransformPoint(this, 1, 0),
            skewX = 180 / Math.PI * Math.atan2(px.y, px.x) - 90;

        return {
          // translation
          x: this.e,
          y: this.f,
          transformedX: (this.e * Math.cos(skewX * Math.PI / 180) + this.f * Math.sin(skewX * Math.PI / 180)) / Math.sqrt(this.a * this.a + this.b * this.b),
          transformedY: (this.f * Math.cos(skewX * Math.PI / 180) + this.e * Math.sin(-skewX * Math.PI / 180)) / Math.sqrt(this.c * this.c + this.d * this.d)
          // skew
          , skewX: -skewX,
          skewY: 180 / Math.PI * Math.atan2(py.y, py.x)
          // scale
          , scaleX: Math.sqrt(this.a * this.a + this.b * this.b),
          scaleY: Math.sqrt(this.c * this.c + this.d * this.d)
          // rotation
          , rotation: skewX,
          a: this.a,
          b: this.b,
          c: this.c,
          d: this.d,
          e: this.e,
          f: this.f,
          matrix: new SVG.Matrix(this)
        };
      }
      // Clone matrix
      , clone: function () {
        return new SVG.Matrix(this);
      }
      // Morph one matrix into another
      , morph: function (matrix) {
        // store new destination
        this.destination = new SVG.Matrix(matrix);

        return this;
      }
      // Get morphed matrix at a given position
      , at: function (pos) {
        // make sure a destination is defined
        if (!this.destination) return this;

        // calculate morphed matrix at a given position
        var matrix = new SVG.Matrix({
          a: this.a + (this.destination.a - this.a) * pos,
          b: this.b + (this.destination.b - this.b) * pos,
          c: this.c + (this.destination.c - this.c) * pos,
          d: this.d + (this.destination.d - this.d) * pos,
          e: this.e + (this.destination.e - this.e) * pos,
          f: this.f + (this.destination.f - this.f) * pos
        });

        return matrix;
      }
      // Multiplies by given matrix
      , multiply: function (matrix) {
        return new SVG.Matrix(this.native().multiply(parseMatrix(matrix).native()));
      }
      // Inverses matrix
      , inverse: function () {
        return new SVG.Matrix(this.native().inverse());
      }
      // Translate matrix
      , translate: function (x, y) {
        return new SVG.Matrix(this.native().translate(x || 0, y || 0));
      }
      // Scale matrix
      , scale: function (x, y, cx, cy) {
        // support uniformal scale
        if (arguments.length == 1) {
          y = x;
        } else if (arguments.length == 3) {
          cy = cx;
          cx = y;
          y = x;
        }

        return this.around(cx, cy, new SVG.Matrix(x, 0, 0, y, 0, 0));
      }
      // Rotate matrix
      , rotate: function (r, cx, cy) {
        // convert degrees to radians
        r = SVG.utils.radians(r);

        return this.around(cx, cy, new SVG.Matrix(Math.cos(r), Math.sin(r), -Math.sin(r), Math.cos(r), 0, 0));
      }
      // Flip matrix on x or y, at a given offset
      , flip: function (a, o) {
        return a == 'x' ? this.scale(-1, 1, o, 0) : a == 'y' ? this.scale(1, -1, 0, o) : this.scale(-1, -1, a, o != null ? o : a);
      }
      // Skew
      , skew: function (x, y, cx, cy) {
        // support uniformal skew
        if (arguments.length == 1) {
          y = x;
        } else if (arguments.length == 3) {
          cy = cx;
          cx = y;
          y = x;
        }

        // convert degrees to radians
        x = SVG.utils.radians(x);
        y = SVG.utils.radians(y);

        return this.around(cx, cy, new SVG.Matrix(1, Math.tan(y), Math.tan(x), 1, 0, 0));
      }
      // SkewX
      , skewX: function (x, cx, cy) {
        return this.skew(x, 0, cx, cy);
      }
      // SkewY
      , skewY: function (y, cx, cy) {
        return this.skew(0, y, cx, cy);
      }
      // Transform around a center point
      , around: function (cx, cy, matrix) {
        return this.multiply(new SVG.Matrix(1, 0, 0, 1, cx || 0, cy || 0)).multiply(matrix).multiply(new SVG.Matrix(1, 0, 0, 1, -cx || 0, -cy || 0));
      }
      // Convert to native SVGMatrix
      , native: function () {
        // create new matrix
        var matrix = SVG.parser.native.createSVGMatrix();

        // update with current values
        for (var i = abcdef.length - 1; i >= 0; i--) matrix[abcdef[i]] = this[abcdef[i]];

        return matrix;
      }
      // Convert matrix to string
      , toString: function () {
        // Construct the matrix directly, avoid values that are too small
        return 'matrix(' + float32String(this.a) + ',' + float32String(this.b) + ',' + float32String(this.c) + ',' + float32String(this.d) + ',' + float32String(this.e) + ',' + float32String(this.f) + ')';
      }

      // Define parent
    }, parent: SVG.Element

    // Add parent method
    , construct: {
      // Get current matrix
      ctm: function () {
        return new SVG.Matrix(this.node.getCTM());
      },
      // Get current screen matrix
      screenCTM: function () {
        /* https://bugzilla.mozilla.org/show_bug.cgi?id=1344537
           This is needed because FF does not return the transformation matrix
           for the inner coordinate system when getScreenCTM() is called on nested svgs.
           However all other Browsers do that */
        if (this instanceof SVG.Nested) {
          var rect = this.rect(1, 1);
          var m = rect.node.getScreenCTM();
          rect.remove();
          return new SVG.Matrix(m);
        }
        return new SVG.Matrix(this.node.getScreenCTM());
      }

    }

  });

  SVG.Point = SVG.invent({
    // Initialize
    create: function (x, y) {
      var i,
          source,
          base = { x: 0, y: 0

        // ensure source as object
      };source = Array.isArray(x) ? { x: x[0], y: x[1] } : typeof x === 'object' ? { x: x.x, y: x.y } : x != null ? { x: x, y: y != null ? y : x } : base; // If y has no value, then x is used has its value

      // merge source
      this.x = source.x;
      this.y = source.y;
    }

    // Add methods
    , extend: {
      // Clone point
      clone: function () {
        return new SVG.Point(this);
      }
      // Morph one point into another
      , morph: function (x, y) {
        // store new destination
        this.destination = new SVG.Point(x, y);

        return this;
      }
      // Get morphed point at a given position
      , at: function (pos) {
        // make sure a destination is defined
        if (!this.destination) return this;

        // calculate morphed matrix at a given position
        var point = new SVG.Point({
          x: this.x + (this.destination.x - this.x) * pos,
          y: this.y + (this.destination.y - this.y) * pos
        });

        return point;
      }
      // Convert to native SVGPoint
      , native: function () {
        // create new point
        var point = SVG.parser.native.createSVGPoint();

        // update with current values
        point.x = this.x;
        point.y = this.y;

        return point;
      }
      // transform point with matrix
      , transform: function (matrix) {
        return new SVG.Point(this.native().matrixTransform(matrix.native()));
      }

    }

  });

  SVG.extend(SVG.Element, {

    // Get point
    point: function (x, y) {
      return new SVG.Point(x, y).transform(this.screenCTM().inverse());
    }

  });

  SVG.extend(SVG.Element, {
    // Set svg element attribute
    attr: function (a, v, n) {
      // act as full getter
      if (a == null) {
        // get an object of attributes
        a = {};
        v = this.node.attributes;
        for (n = v.length - 1; n >= 0; n--) a[v[n].nodeName] = SVG.regex.isNumber.test(v[n].nodeValue) ? parseFloat(v[n].nodeValue) : v[n].nodeValue;

        return a;
      } else if (typeof a == 'object') {
        // apply every attribute individually if an object is passed
        for (v in a) this.attr(v, a[v]);
      } else if (v === null) {
        // remove value
        this.node.removeAttribute(a);
      } else if (v == null) {
        // act as a getter if the first and only argument is not an object
        v = this.node.getAttribute(a);
        return v == null ? SVG.defaults.attrs[a] : SVG.regex.isNumber.test(v) ? parseFloat(v) : v;
      } else {
        // BUG FIX: some browsers will render a stroke if a color is given even though stroke width is 0
        if (a == 'stroke-width') this.attr('stroke', parseFloat(v) > 0 ? this._stroke : null);else if (a == 'stroke') this._stroke = v;

        // convert image fill and stroke to patterns
        if (a == 'fill' || a == 'stroke') {
          if (SVG.regex.isImage.test(v)) v = this.doc().defs().image(v, 0, 0);

          if (v instanceof SVG.Image) v = this.doc().defs().pattern(0, 0, function () {
            this.add(v);
          });
        }

        // ensure correct numeric values (also accepts NaN and Infinity)
        if (typeof v === 'number') v = new SVG.Number(v);

        // ensure full hex color
        else if (SVG.Color.isColor(v)) v = new SVG.Color(v);

          // parse array values
          else if (Array.isArray(v)) v = new SVG.Array(v);

        // if the passed attribute is leading...
        if (a == 'leading') {
          // ... call the leading method instead
          if (this.leading) this.leading(v);
        } else {
          // set given attribute on node
          typeof n === 'string' ? this.node.setAttributeNS(n, a, v.toString()) : this.node.setAttribute(a, v.toString());
        }

        // rebuild if required
        if (this.rebuild && (a == 'font-size' || a == 'x')) this.rebuild(a, v);
      }

      return this;
    }
  });
  SVG.extend(SVG.Element, {
    // Add transformations
    transform: function (o, relative) {
      // get target in case of the fx module, otherwise reference this
      var target = this,
          matrix,
          bbox;

      // act as a getter
      if (typeof o !== 'object') {
        // get current matrix
        matrix = new SVG.Matrix(target).extract();

        return typeof o === 'string' ? matrix[o] : matrix;
      }

      // get current matrix
      matrix = new SVG.Matrix(target);

      // ensure relative flag
      relative = !!relative || !!o.relative;

      // act on matrix
      if (o.a != null) {
        matrix = relative ?
        // relative
        matrix.multiply(new SVG.Matrix(o)) :
        // absolute
        new SVG.Matrix(o);

        // act on rotation
      } else if (o.rotation != null) {
        // ensure centre point
        ensureCentre(o, target);

        // apply transformation
        matrix = relative ?
        // relative
        matrix.rotate(o.rotation, o.cx, o.cy) :
        // absolute
        matrix.rotate(o.rotation - matrix.extract().rotation, o.cx, o.cy);

        // act on scale
      } else if (o.scale != null || o.scaleX != null || o.scaleY != null) {
        // ensure centre point
        ensureCentre(o, target);

        // ensure scale values on both axes
        o.scaleX = o.scale != null ? o.scale : o.scaleX != null ? o.scaleX : 1;
        o.scaleY = o.scale != null ? o.scale : o.scaleY != null ? o.scaleY : 1;

        if (!relative) {
          // absolute; multiply inversed values
          var e = matrix.extract();
          o.scaleX = o.scaleX * 1 / e.scaleX;
          o.scaleY = o.scaleY * 1 / e.scaleY;
        }

        matrix = matrix.scale(o.scaleX, o.scaleY, o.cx, o.cy);

        // act on skew
      } else if (o.skew != null || o.skewX != null || o.skewY != null) {
        // ensure centre point
        ensureCentre(o, target);

        // ensure skew values on both axes
        o.skewX = o.skew != null ? o.skew : o.skewX != null ? o.skewX : 0;
        o.skewY = o.skew != null ? o.skew : o.skewY != null ? o.skewY : 0;

        if (!relative) {
          // absolute; reset skew values
          var e = matrix.extract();
          matrix = matrix.multiply(new SVG.Matrix().skew(e.skewX, e.skewY, o.cx, o.cy).inverse());
        }

        matrix = matrix.skew(o.skewX, o.skewY, o.cx, o.cy);

        // act on flip
      } else if (o.flip) {
        if (o.flip == 'x' || o.flip == 'y') {
          o.offset = o.offset == null ? target.bbox()['c' + o.flip] : o.offset;
        } else {
          if (o.offset == null) {
            bbox = target.bbox();
            o.flip = bbox.cx;
            o.offset = bbox.cy;
          } else {
            o.flip = o.offset;
          }
        }

        matrix = new SVG.Matrix().flip(o.flip, o.offset);

        // act on translate
      } else if (o.x != null || o.y != null) {
        if (relative) {
          // relative
          matrix = matrix.translate(o.x, o.y);
        } else {
          // absolute
          if (o.x != null) matrix.e = o.x;
          if (o.y != null) matrix.f = o.y;
        }
      }

      return this.attr('transform', matrix);
    }
  });

  SVG.extend(SVG.FX, {
    transform: function (o, relative) {
      // get target in case of the fx module, otherwise reference this
      var target = this.target(),
          matrix,
          bbox;

      // act as a getter
      if (typeof o !== 'object') {
        // get current matrix
        matrix = new SVG.Matrix(target).extract();

        return typeof o === 'string' ? matrix[o] : matrix;
      }

      // ensure relative flag
      relative = !!relative || !!o.relative;

      // act on matrix
      if (o.a != null) {
        matrix = new SVG.Matrix(o);

        // act on rotation
      } else if (o.rotation != null) {
        // ensure centre point
        ensureCentre(o, target);

        // apply transformation
        matrix = new SVG.Rotate(o.rotation, o.cx, o.cy);

        // act on scale
      } else if (o.scale != null || o.scaleX != null || o.scaleY != null) {
        // ensure centre point
        ensureCentre(o, target);

        // ensure scale values on both axes
        o.scaleX = o.scale != null ? o.scale : o.scaleX != null ? o.scaleX : 1;
        o.scaleY = o.scale != null ? o.scale : o.scaleY != null ? o.scaleY : 1;

        matrix = new SVG.Scale(o.scaleX, o.scaleY, o.cx, o.cy);

        // act on skew
      } else if (o.skewX != null || o.skewY != null) {
        // ensure centre point
        ensureCentre(o, target);

        // ensure skew values on both axes
        o.skewX = o.skewX != null ? o.skewX : 0;
        o.skewY = o.skewY != null ? o.skewY : 0;

        matrix = new SVG.Skew(o.skewX, o.skewY, o.cx, o.cy);

        // act on flip
      } else if (o.flip) {
        if (o.flip == 'x' || o.flip == 'y') {
          o.offset = o.offset == null ? target.bbox()['c' + o.flip] : o.offset;
        } else {
          if (o.offset == null) {
            bbox = target.bbox();
            o.flip = bbox.cx;
            o.offset = bbox.cy;
          } else {
            o.flip = o.offset;
          }
        }

        matrix = new SVG.Matrix().flip(o.flip, o.offset);

        // act on translate
      } else if (o.x != null || o.y != null) {
        matrix = new SVG.Translate(o.x, o.y);
      }

      if (!matrix) return this;

      matrix.relative = relative;

      this.last().transforms.push(matrix);

      return this._callStart();
    }
  });

  SVG.extend(SVG.Element, {
    // Reset all transformations
    untransform: function () {
      return this.attr('transform', null);
    },
    // merge the whole transformation chain into one matrix and returns it
    matrixify: function () {

      var matrix = (this.attr('transform') || '').
      // split transformations
      split(SVG.regex.transforms).slice(0, -1).map(function (str) {
        // generate key => value pairs
        var kv = str.trim().split('(');
        return [kv[0], kv[1].split(SVG.regex.delimiter).map(function (str) {
          return parseFloat(str);
        })];
      })
      // merge every transformation into one matrix
      .reduce(function (matrix, transform) {

        if (transform[0] == 'matrix') return matrix.multiply(arrayToMatrix(transform[1]));
        return matrix[transform[0]].apply(matrix, transform[1]);
      }, new SVG.Matrix());

      return matrix;
    },
    // add an element to another parent without changing the visual representation on the screen
    toParent: function (parent) {
      if (this == parent) return this;
      var ctm = this.screenCTM();
      var pCtm = parent.screenCTM().inverse();

      this.addTo(parent).untransform().transform(pCtm.multiply(ctm));

      return this;
    },
    // same as above with parent equals root-svg
    toDoc: function () {
      return this.toParent(this.doc());
    }

  });

  SVG.Transformation = SVG.invent({

    create: function (source, inversed) {

      if (arguments.length > 1 && typeof inversed != 'boolean') {
        return this.constructor.call(this, [].slice.call(arguments));
      }

      if (Array.isArray(source)) {
        for (var i = 0, len = this.arguments.length; i < len; ++i) {
          this[this.arguments[i]] = source[i];
        }
      } else if (typeof source == 'object') {
        for (var i = 0, len = this.arguments.length; i < len; ++i) {
          this[this.arguments[i]] = source[this.arguments[i]];
        }
      }

      this.inversed = false;

      if (inversed === true) {
        this.inversed = true;
      }
    },

    extend: {

      arguments: [],
      method: '',

      at: function (pos) {

        var params = [];

        for (var i = 0, len = this.arguments.length; i < len; ++i) {
          params.push(this[this.arguments[i]]);
        }

        var m = this._undo || new SVG.Matrix();

        m = new SVG.Matrix().morph(SVG.Matrix.prototype[this.method].apply(m, params)).at(pos);

        return this.inversed ? m.inverse() : m;
      },

      undo: function (o) {
        for (var i = 0, len = this.arguments.length; i < len; ++i) {
          o[this.arguments[i]] = typeof this[this.arguments[i]] == 'undefined' ? 0 : o[this.arguments[i]];
        }

        // The method SVG.Matrix.extract which was used before calling this
        // method to obtain a value for the parameter o doesn't return a cx and
        // a cy so we use the ones that were provided to this object at its creation
        o.cx = this.cx;
        o.cy = this.cy;

        this._undo = new SVG[capitalize(this.method)](o, true).at(1);

        return this;
      }

    }

  });

  SVG.Translate = SVG.invent({

    parent: SVG.Matrix,
    inherit: SVG.Transformation,

    create: function (source, inversed) {
      this.constructor.apply(this, [].slice.call(arguments));
    },

    extend: {
      arguments: ['transformedX', 'transformedY'],
      method: 'translate'
    }

  });

  SVG.Rotate = SVG.invent({

    parent: SVG.Matrix,
    inherit: SVG.Transformation,

    create: function (source, inversed) {
      this.constructor.apply(this, [].slice.call(arguments));
    },

    extend: {
      arguments: ['rotation', 'cx', 'cy'],
      method: 'rotate',
      at: function (pos) {
        var m = new SVG.Matrix().rotate(new SVG.Number().morph(this.rotation - (this._undo ? this._undo.rotation : 0)).at(pos), this.cx, this.cy);
        return this.inversed ? m.inverse() : m;
      },
      undo: function (o) {
        this._undo = o;
        return this;
      }
    }

  });

  SVG.Scale = SVG.invent({

    parent: SVG.Matrix,
    inherit: SVG.Transformation,

    create: function (source, inversed) {
      this.constructor.apply(this, [].slice.call(arguments));
    },

    extend: {
      arguments: ['scaleX', 'scaleY', 'cx', 'cy'],
      method: 'scale'
    }

  });

  SVG.Skew = SVG.invent({

    parent: SVG.Matrix,
    inherit: SVG.Transformation,

    create: function (source, inversed) {
      this.constructor.apply(this, [].slice.call(arguments));
    },

    extend: {
      arguments: ['skewX', 'skewY', 'cx', 'cy'],
      method: 'skew'
    }

  });

  SVG.extend(SVG.Element, {
    // Dynamic style generator
    style: function (s, v) {
      if (arguments.length == 0) {
        // get full style
        return this.node.style.cssText || '';
      } else if (arguments.length < 2) {
        // apply every style individually if an object is passed
        if (typeof s == 'object') {
          for (v in s) this.style(v, s[v]);
        } else if (SVG.regex.isCss.test(s)) {
          // parse css string
          s = s.split(/\s*;\s*/)
          // filter out suffix ; and stuff like ;;
          .filter(function (e) {
            return !!e;
          }).map(function (e) {
            return e.split(/\s*:\s*/);
          });

          // apply every definition individually
          while (v = s.pop()) {
            this.style(v[0], v[1]);
          }
        } else {
          // act as a getter if the first and only argument is not an object
          return this.node.style[camelCase(s)];
        }
      } else {
        this.node.style[camelCase(s)] = v === null || SVG.regex.isBlank.test(v) ? '' : v;
      }

      return this;
    }
  });
  SVG.Parent = SVG.invent({
    // Initialize node
    create: function (element) {
      this.constructor.call(this, element);
    }

    // Inherit from
    , inherit: SVG.Element

    // Add class methods
    , extend: {
      // Returns all child elements
      children: function () {
        return SVG.utils.map(SVG.utils.filterSVGElements(this.node.childNodes), function (node) {
          return SVG.adopt(node);
        });
      }
      // Add given element at a position
      , add: function (element, i) {
        if (i == null) this.node.appendChild(element.node);else if (element.node != this.node.childNodes[i]) this.node.insertBefore(element.node, this.node.childNodes[i]);

        return this;
      }
      // Basically does the same as `add()` but returns the added element instead
      , put: function (element, i) {
        this.add(element, i);
        return element;
      }
      // Checks if the given element is a child
      , has: function (element) {
        return this.index(element) >= 0;
      }
      // Gets index of given element
      , index: function (element) {
        return [].slice.call(this.node.childNodes).indexOf(element.node);
      }
      // Get a element at the given index
      , get: function (i) {
        return SVG.adopt(this.node.childNodes[i]);
      }
      // Get first child
      , first: function () {
        return this.get(0);
      }
      // Get the last child
      , last: function () {
        return this.get(this.node.childNodes.length - 1);
      }
      // Iterates over all children and invokes a given block
      , each: function (block, deep) {
        var i,
            il,
            children = this.children();

        for (i = 0, il = children.length; i < il; i++) {
          if (children[i] instanceof SVG.Element) block.apply(children[i], [i, children]);

          if (deep && children[i] instanceof SVG.Container) children[i].each(block, deep);
        }

        return this;
      }
      // Remove a given child
      , removeElement: function (element) {
        this.node.removeChild(element.node);

        return this;
      }
      // Remove all elements in this container
      , clear: function () {
        // remove children
        while (this.node.hasChildNodes()) this.node.removeChild(this.node.lastChild);

        // remove defs reference
        delete this._defs;

        return this;
      },
      // Get defs
      defs: function () {
        return this.doc().defs();
      }
    }

  });

  SVG.extend(SVG.Parent, {

    ungroup: function (parent, depth) {
      if (depth === 0 || this instanceof SVG.Defs || this.node == SVG.parser.draw) return this;

      parent = parent || (this instanceof SVG.Doc ? this : this.parent(SVG.Parent));
      depth = depth || Infinity;

      this.each(function () {
        if (this instanceof SVG.Defs) return this;
        if (this instanceof SVG.Parent) return this.ungroup(parent, depth - 1);
        return this.toParent(parent);
      });

      this.node.firstChild || this.remove();

      return this;
    },

    flatten: function (parent, depth) {
      return this.ungroup(parent, depth);
    }

  });
  SVG.Container = SVG.invent({
    // Initialize node
    create: function (element) {
      this.constructor.call(this, element);
    }

    // Inherit from
    , inherit: SVG.Parent

  });

  SVG.ViewBox = SVG.invent({

    create: function (source) {
      var i,
          base = [0, 0, 0, 0];

      var x,
          y,
          width,
          height,
          box,
          view,
          we,
          he,
          wm = 1 // width multiplier
      ,
          hm = 1 // height multiplier
      ,
          reg = /[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?/gi;

      if (source instanceof SVG.Element) {

        we = source;
        he = source;
        view = (source.attr('viewBox') || '').match(reg);
        box = source.bbox;

        // get dimensions of current node
        width = new SVG.Number(source.width());
        height = new SVG.Number(source.height());

        // find nearest non-percentual dimensions
        while (width.unit == '%') {
          wm *= width.value;
          width = new SVG.Number(we instanceof SVG.Doc ? we.parent().offsetWidth : we.parent().width());
          we = we.parent();
        }
        while (height.unit == '%') {
          hm *= height.value;
          height = new SVG.Number(he instanceof SVG.Doc ? he.parent().offsetHeight : he.parent().height());
          he = he.parent();
        }

        // ensure defaults
        this.x = 0;
        this.y = 0;
        this.width = width * wm;
        this.height = height * hm;
        this.zoom = 1;

        if (view) {
          // get width and height from viewbox
          x = parseFloat(view[0]);
          y = parseFloat(view[1]);
          width = parseFloat(view[2]);
          height = parseFloat(view[3]);

          // calculate zoom accoring to viewbox
          this.zoom = this.width / this.height > width / height ? this.height / height : this.width / width;

          // calculate real pixel dimensions on parent SVG.Doc element
          this.x = x;
          this.y = y;
          this.width = width;
          this.height = height;
        }
      } else {

        // ensure source as object
        source = typeof source === 'string' ? source.match(reg).map(function (el) {
          return parseFloat(el);
        }) : Array.isArray(source) ? source : typeof source == 'object' ? [source.x, source.y, source.width, source.height] : arguments.length == 4 ? [].slice.call(arguments) : base;

        this.x = source[0];
        this.y = source[1];
        this.width = source[2];
        this.height = source[3];
      }
    },

    extend: {

      toString: function () {
        return this.x + ' ' + this.y + ' ' + this.width + ' ' + this.height;
      },
      morph: function (x, y, width, height) {
        this.destination = new SVG.ViewBox(x, y, width, height);
        return this;
      },

      at: function (pos) {

        if (!this.destination) return this;

        return new SVG.ViewBox([this.x + (this.destination.x - this.x) * pos, this.y + (this.destination.y - this.y) * pos, this.width + (this.destination.width - this.width) * pos, this.height + (this.destination.height - this.height) * pos]);
      }

      // Define parent
    }, parent: SVG.Container

    // Add parent method
    , construct: {

      // get/set viewbox
      viewbox: function (x, y, width, height) {
        if (arguments.length == 0)
          // act as a getter if there are no arguments
          return new SVG.ViewBox(this);

        // otherwise act as a setter
        return this.attr('viewBox', new SVG.ViewBox(x, y, width, height));
      }

    }

  })
  // Add events to elements

  ;['click', 'dblclick', 'mousedown', 'mouseup', 'mouseover', 'mouseout', 'mousemove', 'mouseenter', 'mouseleave', 'touchstart', 'touchmove', 'touchleave', 'touchend', 'touchcancel'].forEach(function (event) {
    // add event to SVG.Element
    SVG.Element.prototype[event] = function (f) {
      // bind event to element rather than element node
      if (f == null) {
        SVG.off(this, event);
      } else {
        SVG.on(this, event, f);
      }
      return this;
    };
  });

  SVG.listenerId = 0;

  // Add event binder in the SVG namespace
  SVG.on = function (node, events, listener, binding, options) {
    var l = listener.bind(binding || node);
    var n = node instanceof SVG.Element ? node.node : node;

    // ensure instance object for nodes which are not adopted
    n.instance = n.instance || { _events: {} };

    var bag = n.instance._events;

    // add id to listener
    if (!listener._svgjsListenerId) {
      listener._svgjsListenerId = ++SVG.listenerId;
    }

    events.split(SVG.regex.delimiter).forEach(function (event) {
      var ev = event.split('.')[0];
      var ns = event.split('.')[1] || '*';

      // ensure valid object
      bag[ev] = bag[ev] || {};
      bag[ev][ns] = bag[ev][ns] || {};

      // reference listener
      bag[ev][ns][listener._svgjsListenerId] = l;

      // add listener
      n.addEventListener(ev, l, options || false);
    });
  };

  // Add event unbinder in the SVG namespace
  SVG.off = function (node, events, listener, options) {
    var n = node instanceof SVG.Element ? node.node : node;
    if (!n.instance) return;

    // listener can be a function or a number
    if (typeof listener === 'function') {
      listener = listener._svgjsListenerId;
      if (!listener) return;
    }

    var bag = n.instance._events;(events || '').split(SVG.regex.delimiter).forEach(function (event) {
      var ev = event && event.split('.')[0];
      var ns = event && event.split('.')[1];
      var namespace, l;

      if (listener) {
        // remove listener reference
        if (bag[ev] && bag[ev][ns || '*']) {
          // removeListener
          n.removeEventListener(ev, bag[ev][ns || '*'][listener], options || false);

          delete bag[ev][ns || '*'][listener];
        }
      } else if (ev && ns) {
        // remove all listeners for a namespaced event
        if (bag[ev] && bag[ev][ns]) {
          for (l in bag[ev][ns]) {
            SVG.off(n, [ev, ns].join('.'), l);
          }

          delete bag[ev][ns];
        }
      } else if (ns) {
        // remove all listeners for a specific namespace
        for (event in bag) {
          for (namespace in bag[event]) {
            if (ns === namespace) {
              SVG.off(n, [event, ns].join('.'));
            }
          }
        }
      } else if (ev) {
        // remove all listeners for the event
        if (bag[ev]) {
          for (namespace in bag[ev]) {
            SVG.off(n, [ev, namespace].join('.'));
          }

          delete bag[ev];
        }
      } else {
        // remove all listeners on a given node
        for (event in bag) {
          SVG.off(n, event);
        }

        n.instance._events = {};
      }
    });
  };

  SVG.extend(SVG.Element, {
    // Bind given event to listener
    on: function (event, listener, binding, options) {
      SVG.on(this, event, listener, binding, options);
      return this;
    },
    // Unbind event from listener
    off: function (event, listener) {
      SVG.off(this.node, event, listener);
      return this;
    },
    fire: function (event, data) {
      // Dispatch event
      if (event instanceof window.Event) {
        this.node.dispatchEvent(event);
      } else {
        this.node.dispatchEvent(event = new SVG.CustomEvent(event, { detail: data, cancelable: true }));
      }
      this._event = event;
      return this;
    },
    event: function () {
      return this._event;
    }
  });

  SVG.Defs = SVG.invent({
    // Initialize node
    create: 'defs'

    // Inherit from
    , inherit: SVG.Container

  });
  SVG.G = SVG.invent({
    // Initialize node
    create: 'g'

    // Inherit from
    , inherit: SVG.Container

    // Add class methods
    , extend: {
      // Move over x-axis
      x: function (x) {
        return x == null ? this.transform('x') : this.transform({ x: x - this.x() }, true);
      }
      // Move over y-axis
      , y: function (y) {
        return y == null ? this.transform('y') : this.transform({ y: y - this.y() }, true);
      }
      // Move by center over x-axis
      , cx: function (x) {
        return x == null ? this.gbox().cx : this.x(x - this.gbox().width / 2);
      }
      // Move by center over y-axis
      , cy: function (y) {
        return y == null ? this.gbox().cy : this.y(y - this.gbox().height / 2);
      },
      gbox: function () {

        var bbox = this.bbox(),
            trans = this.transform();

        bbox.x += trans.x;
        bbox.x2 += trans.x;
        bbox.cx += trans.x;

        bbox.y += trans.y;
        bbox.y2 += trans.y;
        bbox.cy += trans.y;

        return bbox;
      }

      // Add parent method
    }, construct: {
      // Create a group element
      group: function () {
        return this.put(new SVG.G());
      }
    }
  });

  SVG.Doc = SVG.invent({
    // Initialize node
    create: function (element) {
      if (element) {
        // ensure the presence of a dom element
        element = typeof element == 'string' ? document.getElementById(element) : element;

        // If the target is an svg element, use that element as the main wrapper.
        // This allows svg.js to work with svg documents as well.
        if (element.nodeName == 'svg') {
          this.constructor.call(this, element);
        } else {
          this.constructor.call(this, SVG.create('svg'));
          element.appendChild(this.node);
          this.size('100%', '100%');
        }

        // set svg element attributes and ensure defs node
        this.namespace().defs();
      }
    }

    // Inherit from
    , inherit: SVG.Container

    // Add class methods
    , extend: {
      // Add namespaces
      namespace: function () {
        return this.attr({ xmlns: SVG.ns, version: '1.1' }).attr('xmlns:xlink', SVG.xlink, SVG.xmlns).attr('xmlns:svgjs', SVG.svgjs, SVG.xmlns);
      }
      // Creates and returns defs element
      , defs: function () {
        if (!this._defs) {
          var defs;

          // Find or create a defs element in this instance
          if (defs = this.node.getElementsByTagName('defs')[0]) this._defs = SVG.adopt(defs);else this._defs = new SVG.Defs();

          // Make sure the defs node is at the end of the stack
          this.node.appendChild(this._defs.node);
        }

        return this._defs;
      }
      // custom parent method
      , parent: function () {
        if (!this.node.parentNode || this.node.parentNode.nodeName == '#document' || this.node.parentNode.nodeName == '#document-fragment') return null;
        return this.node.parentNode;
      }
      // Fix for possible sub-pixel offset. See:
      // https://bugzilla.mozilla.org/show_bug.cgi?id=608812
      , spof: function () {
        var pos = this.node.getScreenCTM();

        if (pos) this.style('left', -pos.e % 1 + 'px').style('top', -pos.f % 1 + 'px');

        return this;
      }

      // Removes the doc from the DOM
      , remove: function () {
        if (this.parent()) {
          this.parent().removeChild(this.node);
        }

        return this;
      },
      clear: function () {
        // remove children
        while (this.node.hasChildNodes()) this.node.removeChild(this.node.lastChild);

        // remove defs reference
        delete this._defs;

        // add back parser
        if (!SVG.parser.draw.parentNode) this.node.appendChild(SVG.parser.draw);

        return this;
      },
      clone: function (parent) {
        // write dom data to the dom so the clone can pickup the data
        this.writeDataToDom();

        // get reference to node
        var node = this.node;

        // clone element and assign new id
        var clone = assignNewId(node.cloneNode(true));

        // insert the clone in the given parent or after myself
        if (parent) {
          (parent.node || parent).appendChild(clone.node);
        } else {
          node.parentNode.insertBefore(clone.node, node.nextSibling);
        }

        return clone;
      }
    }

  });

  // ### This module adds backward / forward functionality to elements.

  //
  SVG.extend(SVG.Element, {
    // Get all siblings, including myself
    siblings: function () {
      return this.parent().children();
    }
    // Get the curent position siblings
    , position: function () {
      return this.parent().index(this);
    }
    // Get the next element (will return null if there is none)
    , next: function () {
      return this.siblings()[this.position() + 1];
    }
    // Get the next element (will return null if there is none)
    , previous: function () {
      return this.siblings()[this.position() - 1];
    }
    // Send given element one step forward
    , forward: function () {
      var i = this.position() + 1,
          p = this.parent();

      // move node one step forward
      p.removeElement(this).add(this, i);

      // make sure defs node is always at the top
      if (p instanceof SVG.Doc) p.node.appendChild(p.defs().node);

      return this;
    }
    // Send given element one step backward
    , backward: function () {
      var i = this.position();

      if (i > 0) this.parent().removeElement(this).add(this, i - 1);

      return this;
    }
    // Send given element all the way to the front
    , front: function () {
      var p = this.parent();

      // Move node forward
      p.node.appendChild(this.node);

      // Make sure defs node is always at the top
      if (p instanceof SVG.Doc) p.node.appendChild(p.defs().node);

      return this;
    }
    // Send given element all the way to the back
    , back: function () {
      if (this.position() > 0) this.parent().removeElement(this).add(this, 0);

      return this;
    }
    // Inserts a given element before the targeted element
    , before: function (element) {
      element.remove();

      var i = this.position();

      this.parent().add(element, i);

      return this;
    }
    // Insters a given element after the targeted element
    , after: function (element) {
      element.remove();

      var i = this.position();

      this.parent().add(element, i + 1);

      return this;
    }

  });
  SVG.Mask = SVG.invent({
    // Initialize node
    create: function () {
      this.constructor.call(this, SVG.create('mask'));

      // keep references to masked elements
      this.targets = [];
    }

    // Inherit from
    , inherit: SVG.Container

    // Add class methods
    , extend: {
      // Unmask all masked elements and remove itself
      remove: function () {
        // unmask all targets
        for (var i = this.targets.length - 1; i >= 0; i--) if (this.targets[i]) this.targets[i].unmask();
        this.targets = [];

        // remove mask from parent
        SVG.Element.prototype.remove.call(this);

        return this;
      }

      // Add parent method
    }, construct: {
      // Create masking element
      mask: function () {
        return this.defs().put(new SVG.Mask());
      }
    }
  });

  SVG.extend(SVG.Element, {
    // Distribute mask to svg element
    maskWith: function (element) {
      // use given mask or create a new one
      this.masker = element instanceof SVG.Mask ? element : this.parent().mask().add(element);

      // store reverence on self in mask
      this.masker.targets.push(this);

      // apply mask
      return this.attr('mask', 'url("#' + this.masker.attr('id') + '")');
    }
    // Unmask element
    , unmask: function () {
      delete this.masker;
      return this.attr('mask', null);
    }

  });

  SVG.ClipPath = SVG.invent({
    // Initialize node
    create: function () {
      this.constructor.call(this, SVG.create('clipPath'));

      // keep references to clipped elements
      this.targets = [];
    }

    // Inherit from
    , inherit: SVG.Container

    // Add class methods
    , extend: {
      // Unclip all clipped elements and remove itself
      remove: function () {
        // unclip all targets
        for (var i = this.targets.length - 1; i >= 0; i--) if (this.targets[i]) this.targets[i].unclip();
        this.targets = [];

        // remove clipPath from parent
        this.parent().removeElement(this);

        return this;
      }

      // Add parent method
    }, construct: {
      // Create clipping element
      clip: function () {
        return this.defs().put(new SVG.ClipPath());
      }
    }
  });

  //
  SVG.extend(SVG.Element, {
    // Distribute clipPath to svg element
    clipWith: function (element) {
      // use given clip or create a new one
      this.clipper = element instanceof SVG.ClipPath ? element : this.parent().clip().add(element);

      // store reverence on self in mask
      this.clipper.targets.push(this);

      // apply mask
      return this.attr('clip-path', 'url("#' + this.clipper.attr('id') + '")');
    }
    // Unclip element
    , unclip: function () {
      delete this.clipper;
      return this.attr('clip-path', null);
    }

  });
  SVG.Gradient = SVG.invent({
    // Initialize node
    create: function (type) {
      this.constructor.call(this, SVG.create(type + 'Gradient'));

      // store type
      this.type = type;
    }

    // Inherit from
    , inherit: SVG.Container

    // Add class methods
    , extend: {
      // Add a color stop
      at: function (offset, color, opacity) {
        return this.put(new SVG.Stop()).update(offset, color, opacity);
      }
      // Update gradient
      , update: function (block) {
        // remove all stops
        this.clear();

        // invoke passed block
        if (typeof block == 'function') block.call(this, this);

        return this;
      }
      // Return the fill id
      , fill: function () {
        return 'url(#' + this.id() + ')';
      }
      // Alias string convertion to fill
      , toString: function () {
        return this.fill();
      }
      // custom attr to handle transform
      , attr: function (a, b, c) {
        if (a == 'transform') a = 'gradientTransform';
        return SVG.Container.prototype.attr.call(this, a, b, c);
      }

      // Add parent method
    }, construct: {
      // Create gradient element in defs
      gradient: function (type, block) {
        return this.defs().gradient(type, block);
      }
    }
  });

  // Add animatable methods to both gradient and fx module
  SVG.extend(SVG.Gradient, SVG.FX, {
    // From position
    from: function (x, y) {
      return (this._target || this).type == 'radial' ? this.attr({ fx: new SVG.Number(x), fy: new SVG.Number(y) }) : this.attr({ x1: new SVG.Number(x), y1: new SVG.Number(y) });
    }
    // To position
    , to: function (x, y) {
      return (this._target || this).type == 'radial' ? this.attr({ cx: new SVG.Number(x), cy: new SVG.Number(y) }) : this.attr({ x2: new SVG.Number(x), y2: new SVG.Number(y) });
    }
  });

  // Base gradient generation
  SVG.extend(SVG.Defs, {
    // define gradient
    gradient: function (type, block) {
      return this.put(new SVG.Gradient(type)).update(block);
    }

  });

  SVG.Stop = SVG.invent({
    // Initialize node
    create: 'stop'

    // Inherit from
    , inherit: SVG.Element

    // Add class methods
    , extend: {
      // add color stops
      update: function (o) {
        if (typeof o == 'number' || o instanceof SVG.Number) {
          o = {
            offset: arguments[0],
            color: arguments[1],
            opacity: arguments[2]
          };
        }

        // set attributes
        if (o.opacity != null) this.attr('stop-opacity', o.opacity);
        if (o.color != null) this.attr('stop-color', o.color);
        if (o.offset != null) this.attr('offset', new SVG.Number(o.offset));

        return this;
      }
    }

  });

  SVG.Pattern = SVG.invent({
    // Initialize node
    create: 'pattern'

    // Inherit from
    , inherit: SVG.Container

    // Add class methods
    , extend: {
      // Return the fill id
      fill: function () {
        return 'url(#' + this.id() + ')';
      }
      // Update pattern by rebuilding
      , update: function (block) {
        // remove content
        this.clear();

        // invoke passed block
        if (typeof block == 'function') block.call(this, this);

        return this;
      }
      // Alias string convertion to fill
      , toString: function () {
        return this.fill();
      }
      // custom attr to handle transform
      , attr: function (a, b, c) {
        if (a == 'transform') a = 'patternTransform';
        return SVG.Container.prototype.attr.call(this, a, b, c);
      }

      // Add parent method
    }, construct: {
      // Create pattern element in defs
      pattern: function (width, height, block) {
        return this.defs().pattern(width, height, block);
      }
    }
  });

  SVG.extend(SVG.Defs, {
    // Define gradient
    pattern: function (width, height, block) {
      return this.put(new SVG.Pattern()).update(block).attr({
        x: 0,
        y: 0,
        width: width,
        height: height,
        patternUnits: 'userSpaceOnUse'
      });
    }

  });
  SVG.Shape = SVG.invent({
    // Initialize node
    create: function (element) {
      this.constructor.call(this, element);
    }

    // Inherit from
    , inherit: SVG.Element

  });

  SVG.Bare = SVG.invent({
    // Initialize
    create: function (element, inherit) {
      // construct element
      this.constructor.call(this, SVG.create(element));

      // inherit custom methods
      if (inherit) for (var method in inherit.prototype) if (typeof inherit.prototype[method] === 'function') this[method] = inherit.prototype[method];
    }

    // Inherit from
    , inherit: SVG.Element

    // Add methods
    , extend: {
      // Insert some plain text
      words: function (text) {
        // remove contents
        while (this.node.hasChildNodes()) this.node.removeChild(this.node.lastChild);

        // create text node
        this.node.appendChild(document.createTextNode(text));

        return this;
      }
    }
  });

  SVG.extend(SVG.Parent, {
    // Create an element that is not described by SVG.js
    element: function (element, inherit) {
      return this.put(new SVG.Bare(element, inherit));
    }
  });

  SVG.Symbol = SVG.invent({
    // Initialize node
    create: 'symbol'

    // Inherit from
    , inherit: SVG.Container,

    construct: {
      // create symbol
      symbol: function () {
        return this.put(new SVG.Symbol());
      }
    }
  });

  SVG.Use = SVG.invent({
    // Initialize node
    create: 'use'

    // Inherit from
    , inherit: SVG.Shape

    // Add class methods
    , extend: {
      // Use element as a reference
      element: function (element, file) {
        // Set lined element
        return this.attr('href', (file || '') + '#' + element, SVG.xlink);
      }

      // Add parent method
    }, construct: {
      // Create a use element
      use: function (element, file) {
        return this.put(new SVG.Use()).element(element, file);
      }
    }
  });
  SVG.Rect = SVG.invent({
    // Initialize node
    create: 'rect'

    // Inherit from
    , inherit: SVG.Shape

    // Add parent method
    , construct: {
      // Create a rect element
      rect: function (width, height) {
        return this.put(new SVG.Rect()).size(width, height);
      }
    }
  });
  SVG.Circle = SVG.invent({
    // Initialize node
    create: 'circle'

    // Inherit from
    , inherit: SVG.Shape

    // Add parent method
    , construct: {
      // Create circle element, based on ellipse
      circle: function (size) {
        return this.put(new SVG.Circle()).rx(new SVG.Number(size).divide(2)).move(0, 0);
      }
    }
  });

  SVG.extend(SVG.Circle, SVG.FX, {
    // Radius x value
    rx: function (rx) {
      return this.attr('r', rx);
    }
    // Alias radius x value
    , ry: function (ry) {
      return this.rx(ry);
    }
  });

  SVG.Ellipse = SVG.invent({
    // Initialize node
    create: 'ellipse'

    // Inherit from
    , inherit: SVG.Shape

    // Add parent method
    , construct: {
      // Create an ellipse
      ellipse: function (width, height) {
        return this.put(new SVG.Ellipse()).size(width, height).move(0, 0);
      }
    }
  });

  SVG.extend(SVG.Ellipse, SVG.Rect, SVG.FX, {
    // Radius x value
    rx: function (rx) {
      return this.attr('rx', rx);
    }
    // Radius y value
    , ry: function (ry) {
      return this.attr('ry', ry);
    }
  });

  // Add common method
  SVG.extend(SVG.Circle, SVG.Ellipse, {
    // Move over x-axis
    x: function (x) {
      return x == null ? this.cx() - this.rx() : this.cx(x + this.rx());
    }
    // Move over y-axis
    , y: function (y) {
      return y == null ? this.cy() - this.ry() : this.cy(y + this.ry());
    }
    // Move by center over x-axis
    , cx: function (x) {
      return x == null ? this.attr('cx') : this.attr('cx', x);
    }
    // Move by center over y-axis
    , cy: function (y) {
      return y == null ? this.attr('cy') : this.attr('cy', y);
    }
    // Set width of element
    , width: function (width) {
      return width == null ? this.rx() * 2 : this.rx(new SVG.Number(width).divide(2));
    }
    // Set height of element
    , height: function (height) {
      return height == null ? this.ry() * 2 : this.ry(new SVG.Number(height).divide(2));
    }
    // Custom size function
    , size: function (width, height) {
      var p = proportionalSize(this, width, height);

      return this.rx(new SVG.Number(p.width).divide(2)).ry(new SVG.Number(p.height).divide(2));
    }
  });
  SVG.Line = SVG.invent({
    // Initialize node
    create: 'line'

    // Inherit from
    , inherit: SVG.Shape

    // Add class methods
    , extend: {
      // Get array
      array: function () {
        return new SVG.PointArray([[this.attr('x1'), this.attr('y1')], [this.attr('x2'), this.attr('y2')]]);
      }
      // Overwrite native plot() method
      , plot: function (x1, y1, x2, y2) {
        if (x1 == null) return this.array();else if (typeof y1 !== 'undefined') x1 = { x1: x1, y1: y1, x2: x2, y2: y2 };else x1 = new SVG.PointArray(x1).toLine();

        return this.attr(x1);
      }
      // Move by left top corner
      , move: function (x, y) {
        return this.attr(this.array().move(x, y).toLine());
      }
      // Set element size to given width and height
      , size: function (width, height) {
        var p = proportionalSize(this, width, height);

        return this.attr(this.array().size(p.width, p.height).toLine());
      }

      // Add parent method
    }, construct: {
      // Create a line element
      line: function (x1, y1, x2, y2) {
        // make sure plot is called as a setter
        // x1 is not necessarily a number, it can also be an array, a string and a SVG.PointArray
        return SVG.Line.prototype.plot.apply(this.put(new SVG.Line()), x1 != null ? [x1, y1, x2, y2] : [0, 0, 0, 0]);
      }
    }
  });

  SVG.Polyline = SVG.invent({
    // Initialize node
    create: 'polyline'

    // Inherit from
    , inherit: SVG.Shape

    // Add parent method
    , construct: {
      // Create a wrapped polyline element
      polyline: function (p) {
        // make sure plot is called as a setter
        return this.put(new SVG.Polyline()).plot(p || new SVG.PointArray());
      }
    }
  });

  SVG.Polygon = SVG.invent({
    // Initialize node
    create: 'polygon'

    // Inherit from
    , inherit: SVG.Shape

    // Add parent method
    , construct: {
      // Create a wrapped polygon element
      polygon: function (p) {
        // make sure plot is called as a setter
        return this.put(new SVG.Polygon()).plot(p || new SVG.PointArray());
      }
    }
  });

  // Add polygon-specific functions
  SVG.extend(SVG.Polyline, SVG.Polygon, {
    // Get array
    array: function () {
      return this._array || (this._array = new SVG.PointArray(this.attr('points')));
    }
    // Plot new path
    , plot: function (p) {
      return p == null ? this.array() : this.clear().attr('points', typeof p == 'string' ? p : this._array = new SVG.PointArray(p));
    }
    // Clear array cache
    , clear: function () {
      delete this._array;
      return this;
    }
    // Move by left top corner
    , move: function (x, y) {
      return this.attr('points', this.array().move(x, y));
    }
    // Set element size to given width and height
    , size: function (width, height) {
      var p = proportionalSize(this, width, height);

      return this.attr('points', this.array().size(p.width, p.height));
    }

  });

  // unify all point to point elements
  SVG.extend(SVG.Line, SVG.Polyline, SVG.Polygon, {
    // Define morphable array
    morphArray: SVG.PointArray
    // Move by left top corner over x-axis
    , x: function (x) {
      return x == null ? this.bbox().x : this.move(x, this.bbox().y);
    }
    // Move by left top corner over y-axis
    , y: function (y) {
      return y == null ? this.bbox().y : this.move(this.bbox().x, y);
    }
    // Set width of element
    , width: function (width) {
      var b = this.bbox();

      return width == null ? b.width : this.size(width, b.height);
    }
    // Set height of element
    , height: function (height) {
      var b = this.bbox();

      return height == null ? b.height : this.size(b.width, height);
    }
  });
  SVG.Path = SVG.invent({
    // Initialize node
    create: 'path'

    // Inherit from
    , inherit: SVG.Shape

    // Add class methods
    , extend: {
      // Define morphable array
      morphArray: SVG.PathArray
      // Get array
      , array: function () {
        return this._array || (this._array = new SVG.PathArray(this.attr('d')));
      }
      // Plot new path
      , plot: function (d) {
        return d == null ? this.array() : this.clear().attr('d', typeof d == 'string' ? d : this._array = new SVG.PathArray(d));
      }
      // Clear array cache
      , clear: function () {
        delete this._array;
        return this;
      }
      // Move by left top corner
      , move: function (x, y) {
        return this.attr('d', this.array().move(x, y));
      }
      // Move by left top corner over x-axis
      , x: function (x) {
        return x == null ? this.bbox().x : this.move(x, this.bbox().y);
      }
      // Move by left top corner over y-axis
      , y: function (y) {
        return y == null ? this.bbox().y : this.move(this.bbox().x, y);
      }
      // Set element size to given width and height
      , size: function (width, height) {
        var p = proportionalSize(this, width, height);

        return this.attr('d', this.array().size(p.width, p.height));
      }
      // Set width of element
      , width: function (width) {
        return width == null ? this.bbox().width : this.size(width, this.bbox().height);
      }
      // Set height of element
      , height: function (height) {
        return height == null ? this.bbox().height : this.size(this.bbox().width, height);
      }

      // Add parent method
    }, construct: {
      // Create a wrapped path element
      path: function (d) {
        // make sure plot is called as a setter
        return this.put(new SVG.Path()).plot(d || new SVG.PathArray());
      }
    }
  });

  SVG.Image = SVG.invent({
    // Initialize node
    create: 'image'

    // Inherit from
    , inherit: SVG.Shape

    // Add class methods
    , extend: {
      // (re)load image
      load: function (url) {
        if (!url) return this;

        var self = this,
            img = new window.Image();

        // preload image
        SVG.on(img, 'load', function () {
          SVG.off(img);

          var p = self.parent(SVG.Pattern);

          if (p === null) return;

          // ensure image size
          if (self.width() == 0 && self.height() == 0) self.size(img.width, img.height);

          // ensure pattern size if not set
          if (p && p.width() == 0 && p.height() == 0) p.size(self.width(), self.height());

          // callback
          if (typeof self._loaded === 'function') self._loaded.call(self, {
            width: img.width,
            height: img.height,
            ratio: img.width / img.height,
            url: url
          });
        });

        SVG.on(img, 'error', function (e) {
          SVG.off(img);

          if (typeof self._error === 'function') {
            self._error.call(self, e);
          }
        });

        return this.attr('href', img.src = this.src = url, SVG.xlink);
      }
      // Add loaded callback
      , loaded: function (loaded) {
        this._loaded = loaded;
        return this;
      },

      error: function (error) {
        this._error = error;
        return this;
      }

      // Add parent method
    }, construct: {
      // create image element, load image and set its size
      image: function (source, width, height) {
        return this.put(new SVG.Image()).load(source).size(width || 0, height || width || 0);
      }
    }

  });
  SVG.Text = SVG.invent({
    // Initialize node
    create: function () {
      this.constructor.call(this, SVG.create('text'));

      this.dom.leading = new SVG.Number(1.3); // store leading value for rebuilding
      this._rebuild = true; // enable automatic updating of dy values
      this._build = false; // disable build mode for adding multiple lines

      // set default font
      this.attr('font-family', SVG.defaults.attrs['font-family']);
    }

    // Inherit from
    , inherit: SVG.Shape

    // Add class methods
    , extend: {
      // Move over x-axis
      x: function (x) {
        // act as getter
        if (x == null) return this.attr('x');

        return this.attr('x', x);
      }
      // Move over y-axis
      , y: function (y) {
        var oy = this.attr('y'),
            o = typeof oy === 'number' ? oy - this.bbox().y : 0;

        // act as getter
        if (y == null) return typeof oy === 'number' ? oy - o : oy;

        return this.attr('y', typeof y.valueOf() === 'number' ? y + o : y);
      }
      // Move center over x-axis
      , cx: function (x) {
        return x == null ? this.bbox().cx : this.x(x - this.bbox().width / 2);
      }
      // Move center over y-axis
      , cy: function (y) {
        return y == null ? this.bbox().cy : this.y(y - this.bbox().height / 2);
      }
      // Set the text content
      , text: function (text) {
        // act as getter
        if (typeof text === 'undefined') {
          var text = '';
          var children = this.node.childNodes;
          for (var i = 0, len = children.length; i < len; ++i) {

            // add newline if its not the first child and newLined is set to true
            if (i != 0 && children[i].nodeType != 3 && SVG.adopt(children[i]).dom.newLined == true) {
              text += '\n';
            }

            // add content of this node
            text += children[i].textContent;
          }

          return text;
        }

        // remove existing content
        this.clear().build(true);

        if (typeof text === 'function') {
          // call block
          text.call(this, this);
        } else {
          // store text and make sure text is not blank
          text = text.split('\n');

          // build new lines
          for (var i = 0, il = text.length; i < il; i++) this.tspan(text[i]).newLine();
        }

        // disable build mode and rebuild lines
        return this.build(false).rebuild();
      }
      // Set font size
      , size: function (size) {
        return this.attr('font-size', size).rebuild();
      }
      // Set / get leading
      , leading: function (value) {
        // act as getter
        if (value == null) return this.dom.leading;

        // act as setter
        this.dom.leading = new SVG.Number(value);

        return this.rebuild();
      }
      // Get all the first level lines
      , lines: function () {
        var node = (this.textPath && this.textPath() || this).node;

        // filter tspans and map them to SVG.js instances
        var lines = SVG.utils.map(SVG.utils.filterSVGElements(node.childNodes), function (el) {
          return SVG.adopt(el);
        });

        // return an instance of SVG.set
        return new SVG.Set(lines);
      }
      // Rebuild appearance type
      , rebuild: function (rebuild) {
        // store new rebuild flag if given
        if (typeof rebuild == 'boolean') this._rebuild = rebuild;

        // define position of all lines
        if (this._rebuild) {
          var self = this,
              blankLineOffset = 0,
              dy = this.dom.leading * new SVG.Number(this.attr('font-size'));

          this.lines().each(function () {
            if (this.dom.newLined) {
              if (!self.textPath()) this.attr('x', self.attr('x'));
              if (this.text() == '\n') {
                blankLineOffset += dy;
              } else {
                this.attr('dy', dy + blankLineOffset);
                blankLineOffset = 0;
              }
            }
          });

          this.fire('rebuild');
        }

        return this;
      }
      // Enable / disable build mode
      , build: function (build) {
        this._build = !!build;
        return this;
      }
      // overwrite method from parent to set data properly
      , setData: function (o) {
        this.dom = o;
        this.dom.leading = new SVG.Number(o.leading || 1.3);
        return this;
      }

      // Add parent method
    }, construct: {
      // Create text element
      text: function (text) {
        return this.put(new SVG.Text()).text(text);
      }
      // Create plain text element
      , plain: function (text) {
        return this.put(new SVG.Text()).plain(text);
      }
    }

  });

  SVG.Tspan = SVG.invent({
    // Initialize node
    create: 'tspan'

    // Inherit from
    , inherit: SVG.Shape

    // Add class methods
    , extend: {
      // Set text content
      text: function (text) {
        if (text == null) return this.node.textContent + (this.dom.newLined ? '\n' : '');

        typeof text === 'function' ? text.call(this, this) : this.plain(text);

        return this;
      }
      // Shortcut dx
      , dx: function (dx) {
        return this.attr('dx', dx);
      }
      // Shortcut dy
      , dy: function (dy) {
        return this.attr('dy', dy);
      }
      // Create new line
      , newLine: function () {
        // fetch text parent
        var t = this.parent(SVG.Text);

        // mark new line
        this.dom.newLined = true;

        // apply new hy¡n
        return this.dy(t.dom.leading * t.attr('font-size')).attr('x', t.x());
      }
    }

  });

  SVG.extend(SVG.Text, SVG.Tspan, {
    // Create plain text node
    plain: function (text) {
      // clear if build mode is disabled
      if (this._build === false) this.clear();

      // create text node
      this.node.appendChild(document.createTextNode(text));

      return this;
    }
    // Create a tspan
    , tspan: function (text) {
      var node = (this.textPath && this.textPath() || this).node,
          tspan = new SVG.Tspan();

      // clear if build mode is disabled
      if (this._build === false) this.clear();

      // add new tspan
      node.appendChild(tspan.node);

      return tspan.text(text);
    }
    // Clear all lines
    , clear: function () {
      var node = (this.textPath && this.textPath() || this).node;

      // remove existing child nodes
      while (node.hasChildNodes()) node.removeChild(node.lastChild);

      return this;
    }
    // Get length of text element
    , length: function () {
      return this.node.getComputedTextLength();
    }
  });

  SVG.TextPath = SVG.invent({
    // Initialize node
    create: 'textPath'

    // Inherit from
    , inherit: SVG.Parent

    // Define parent class
    , parent: SVG.Text

    // Add parent method
    , construct: {
      morphArray: SVG.PathArray
      // Create path for text to run on
      , path: function (d) {
        // create textPath element
        var path = new SVG.TextPath(),
            track = this.doc().defs().path(d);

        // move lines to textpath
        while (this.node.hasChildNodes()) path.node.appendChild(this.node.firstChild);

        // add textPath element as child node
        this.node.appendChild(path.node);

        // link textPath to path and add content
        path.attr('href', '#' + track, SVG.xlink);

        return this;
      }
      // return the array of the path track element
      , array: function () {
        var track = this.track();

        return track ? track.array() : null;
      }
      // Plot path if any
      , plot: function (d) {
        var track = this.track(),
            pathArray = null;

        if (track) {
          pathArray = track.plot(d);
        }

        return d == null ? pathArray : this;
      }
      // Get the path track element
      , track: function () {
        var path = this.textPath();

        if (path) return path.reference('href');
      }
      // Get the textPath child
      , textPath: function () {
        if (this.node.firstChild && this.node.firstChild.nodeName == 'textPath') return SVG.adopt(this.node.firstChild);
      }
    }
  });

  SVG.Nested = SVG.invent({
    // Initialize node
    create: function () {
      this.constructor.call(this, SVG.create('svg'));

      this.style('overflow', 'visible');
    }

    // Inherit from
    , inherit: SVG.Container

    // Add parent method
    , construct: {
      // Create nested svg document
      nested: function () {
        return this.put(new SVG.Nested());
      }
    }
  });
  SVG.A = SVG.invent({
    // Initialize node
    create: 'a'

    // Inherit from
    , inherit: SVG.Container

    // Add class methods
    , extend: {
      // Link url
      to: function (url) {
        return this.attr('href', url, SVG.xlink);
      }
      // Link show attribute
      , show: function (target) {
        return this.attr('show', target, SVG.xlink);
      }
      // Link target attribute
      , target: function (target) {
        return this.attr('target', target);
      }

      // Add parent method
    }, construct: {
      // Create a hyperlink element
      link: function (url) {
        return this.put(new SVG.A()).to(url);
      }
    }
  });

  SVG.extend(SVG.Element, {
    // Create a hyperlink element
    linkTo: function (url) {
      var link = new SVG.A();

      if (typeof url == 'function') url.call(link, link);else link.to(url);

      return this.parent().put(link).put(this);
    }

  });
  SVG.Marker = SVG.invent({
    // Initialize node
    create: 'marker'

    // Inherit from
    , inherit: SVG.Container

    // Add class methods
    , extend: {
      // Set width of element
      width: function (width) {
        return this.attr('markerWidth', width);
      }
      // Set height of element
      , height: function (height) {
        return this.attr('markerHeight', height);
      }
      // Set marker refX and refY
      , ref: function (x, y) {
        return this.attr('refX', x).attr('refY', y);
      }
      // Update marker
      , update: function (block) {
        // remove all content
        this.clear();

        // invoke passed block
        if (typeof block == 'function') block.call(this, this);

        return this;
      }
      // Return the fill id
      , toString: function () {
        return 'url(#' + this.id() + ')';
      }

      // Add parent method
    }, construct: {
      marker: function (width, height, block) {
        // Create marker element in defs
        return this.defs().marker(width, height, block);
      }
    }

  });

  SVG.extend(SVG.Defs, {
    // Create marker
    marker: function (width, height, block) {
      // Set default viewbox to match the width and height, set ref to cx and cy and set orient to auto
      return this.put(new SVG.Marker()).size(width, height).ref(width / 2, height / 2).viewbox(0, 0, width, height).attr('orient', 'auto').update(block);
    }

  });

  SVG.extend(SVG.Line, SVG.Polyline, SVG.Polygon, SVG.Path, {
    // Create and attach markers
    marker: function (marker, width, height, block) {
      var attr = ['marker'];

      // Build attribute name
      if (marker != 'all') attr.push(marker);
      attr = attr.join('-');

      // Set marker attribute
      marker = arguments[1] instanceof SVG.Marker ? arguments[1] : this.doc().marker(width, height, block);

      return this.attr(attr, marker);
    }

  });
  // Define list of available attributes for stroke and fill
  var sugar = {
    stroke: ['color', 'width', 'opacity', 'linecap', 'linejoin', 'miterlimit', 'dasharray', 'dashoffset'],
    fill: ['color', 'opacity', 'rule'],
    prefix: function (t, a) {
      return a == 'color' ? t : t + '-' + a;
    }

    // Add sugar for fill and stroke
  };['fill', 'stroke'].forEach(function (m) {
    var i,
        extension = {};

    extension[m] = function (o) {
      if (typeof o == 'undefined') return this;
      if (typeof o == 'string' || SVG.Color.isRgb(o) || o && typeof o.fill === 'function') this.attr(m, o);else
        // set all attributes from sugar.fill and sugar.stroke list
        for (i = sugar[m].length - 1; i >= 0; i--) if (o[sugar[m][i]] != null) this.attr(sugar.prefix(m, sugar[m][i]), o[sugar[m][i]]);

      return this;
    };

    SVG.extend(SVG.Element, SVG.FX, extension);
  });

  SVG.extend(SVG.Element, SVG.FX, {
    // Map rotation to transform
    rotate: function (d, cx, cy) {
      return this.transform({ rotation: d, cx: cx, cy: cy });
    }
    // Map skew to transform
    , skew: function (x, y, cx, cy) {
      return arguments.length == 1 || arguments.length == 3 ? this.transform({ skew: x, cx: y, cy: cx }) : this.transform({ skewX: x, skewY: y, cx: cx, cy: cy });
    }
    // Map scale to transform
    , scale: function (x, y, cx, cy) {
      return arguments.length == 1 || arguments.length == 3 ? this.transform({ scale: x, cx: y, cy: cx }) : this.transform({ scaleX: x, scaleY: y, cx: cx, cy: cy });
    }
    // Map translate to transform
    , translate: function (x, y) {
      return this.transform({ x: x, y: y });
    }
    // Map flip to transform
    , flip: function (a, o) {
      o = typeof a == 'number' ? a : o;
      return this.transform({ flip: a || 'both', offset: o });
    }
    // Map matrix to transform
    , matrix: function (m) {
      return this.attr('transform', new SVG.Matrix(arguments.length == 6 ? [].slice.call(arguments) : m));
    }
    // Opacity
    , opacity: function (value) {
      return this.attr('opacity', value);
    }
    // Relative move over x axis
    , dx: function (x) {
      return this.x(new SVG.Number(x).plus(this instanceof SVG.FX ? 0 : this.x()), true);
    }
    // Relative move over y axis
    , dy: function (y) {
      return this.y(new SVG.Number(y).plus(this instanceof SVG.FX ? 0 : this.y()), true);
    }
    // Relative move over x and y axes
    , dmove: function (x, y) {
      return this.dx(x).dy(y);
    }
  });

  SVG.extend(SVG.Rect, SVG.Ellipse, SVG.Circle, SVG.Gradient, SVG.FX, {
    // Add x and y radius
    radius: function (x, y) {
      var type = (this._target || this).type;
      return type == 'radial' || type == 'circle' ? this.attr('r', new SVG.Number(x)) : this.rx(x).ry(y == null ? x : y);
    }
  });

  SVG.extend(SVG.Path, {
    // Get path length
    length: function () {
      return this.node.getTotalLength();
    }
    // Get point at length
    , pointAt: function (length) {
      return this.node.getPointAtLength(length);
    }
  });

  SVG.extend(SVG.Parent, SVG.Text, SVG.Tspan, SVG.FX, {
    // Set font
    font: function (a, v) {
      if (typeof a == 'object') {
        for (v in a) this.font(v, a[v]);
      }

      return a == 'leading' ? this.leading(v) : a == 'anchor' ? this.attr('text-anchor', v) : a == 'size' || a == 'family' || a == 'weight' || a == 'stretch' || a == 'variant' || a == 'style' ? this.attr('font-' + a, v) : this.attr(a, v);
    }
  });

  SVG.Set = SVG.invent({
    // Initialize
    create: function (members) {
      if (members instanceof SVG.Set) {
        this.members = members.members.slice();
      } else {
        Array.isArray(members) ? this.members = members : this.clear();
      }
    }

    // Add class methods
    , extend: {
      // Add element to set
      add: function () {
        var i,
            il,
            elements = [].slice.call(arguments);

        for (i = 0, il = elements.length; i < il; i++) this.members.push(elements[i]);

        return this;
      }
      // Remove element from set
      , remove: function (element) {
        var i = this.index(element);

        // remove given child
        if (i > -1) this.members.splice(i, 1);

        return this;
      }
      // Iterate over all members
      , each: function (block) {
        for (var i = 0, il = this.members.length; i < il; i++) block.apply(this.members[i], [i, this.members]);

        return this;
      }
      // Restore to defaults
      , clear: function () {
        // initialize store
        this.members = [];

        return this;
      }
      // Get the length of a set
      , length: function () {
        return this.members.length;
      }
      // Checks if a given element is present in set
      , has: function (element) {
        return this.index(element) >= 0;
      }
      // retuns index of given element in set
      , index: function (element) {
        return this.members.indexOf(element);
      }
      // Get member at given index
      , get: function (i) {
        return this.members[i];
      }
      // Get first member
      , first: function () {
        return this.get(0);
      }
      // Get last member
      , last: function () {
        return this.get(this.members.length - 1);
      }
      // Default value
      , valueOf: function () {
        return this.members;
      }
      // Get the bounding box of all members included or empty box if set has no items
      , bbox: function () {
        // return an empty box of there are no members
        if (this.members.length == 0) return new SVG.RBox();

        // get the first rbox and update the target bbox
        var rbox = this.members[0].rbox(this.members[0].doc());

        this.each(function () {
          // user rbox for correct position and visual representation
          rbox = rbox.merge(this.rbox(this.doc()));
        });

        return rbox;
      }

      // Add parent method
    }, construct: {
      // Create a new set
      set: function (members) {
        return new SVG.Set(members);
      }
    }
  });

  SVG.FX.Set = SVG.invent({
    // Initialize node
    create: function (set) {
      // store reference to set
      this.set = set;
    }

  });

  // Alias methods
  SVG.Set.inherit = function () {
    var m,
        methods = [];

    // gather shape methods
    for (var m in SVG.Shape.prototype) if (typeof SVG.Shape.prototype[m] == 'function' && typeof SVG.Set.prototype[m] != 'function') methods.push(m);

    // apply shape aliasses
    methods.forEach(function (method) {
      SVG.Set.prototype[method] = function () {
        for (var i = 0, il = this.members.length; i < il; i++) if (this.members[i] && typeof this.members[i][method] == 'function') this.members[i][method].apply(this.members[i], arguments);

        return method == 'animate' ? this.fx || (this.fx = new SVG.FX.Set(this)) : this;
      };
    });

    // clear methods for the next round
    methods = [];

    // gather fx methods
    for (var m in SVG.FX.prototype) if (typeof SVG.FX.prototype[m] == 'function' && typeof SVG.FX.Set.prototype[m] != 'function') methods.push(m);

    // apply fx aliasses
    methods.forEach(function (method) {
      SVG.FX.Set.prototype[method] = function () {
        for (var i = 0, il = this.set.members.length; i < il; i++) this.set.members[i].fx[method].apply(this.set.members[i].fx, arguments);

        return this;
      };
    });
  };

  SVG.extend(SVG.Element, {
    // Store data values on svg nodes
    data: function (a, v, r) {
      if (typeof a == 'object') {
        for (v in a) this.data(v, a[v]);
      } else if (arguments.length < 2) {
        try {
          return JSON.parse(this.attr('data-' + a));
        } catch (e) {
          return this.attr('data-' + a);
        }
      } else {
        this.attr('data-' + a, v === null ? null : r === true || typeof v === 'string' || typeof v === 'number' ? v : JSON.stringify(v));
      }

      return this;
    }
  });
  SVG.extend(SVG.Element, {
    // Remember arbitrary data
    remember: function (k, v) {
      // remember every item in an object individually
      if (typeof arguments[0] == 'object') for (var v in k) this.remember(v, k[v]);

      // retrieve memory
      else if (arguments.length == 1) return this.memory()[k];

        // store memory
        else this.memory()[k] = v;

      return this;
    }

    // Erase a given memory
    , forget: function () {
      if (arguments.length == 0) this._memory = {};else for (var i = arguments.length - 1; i >= 0; i--) delete this.memory()[arguments[i]];

      return this;
    }

    // Initialize or return local memory object
    , memory: function () {
      return this._memory || (this._memory = {});
    }

  });
  // Method for getting an element by id
  SVG.get = function (id) {
    var node = document.getElementById(idFromReference(id) || id);
    return SVG.adopt(node);
  };

  // Select elements by query string
  SVG.select = function (query, parent) {
    return new SVG.Set(SVG.utils.map((parent || document).querySelectorAll(query), function (node) {
      return SVG.adopt(node);
    }));
  };

  SVG.extend(SVG.Parent, {
    // Scoped select method
    select: function (query) {
      return SVG.select(query, this.node);
    }

  });
  function pathRegReplace(a, b, c, d) {
    return c + d.replace(SVG.regex.dots, ' .');
  }

  // creates deep clone of array
  function array_clone(arr) {
    var clone = arr.slice(0);
    for (var i = clone.length; i--;) {
      if (Array.isArray(clone[i])) {
        clone[i] = array_clone(clone[i]);
      }
    }
    return clone;
  }

  // tests if a given element is instance of an object
  function is(el, obj) {
    return el instanceof obj;
  }

  // tests if a given selector matches an element
  function matches(el, selector) {
    return (el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector).call(el, selector);
  }

  // Convert dash-separated-string to camelCase
  function camelCase(s) {
    return s.toLowerCase().replace(/-(.)/g, function (m, g) {
      return g.toUpperCase();
    });
  }

  // Capitalize first letter of a string
  function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  // Ensure to six-based hex
  function fullHex(hex) {
    return hex.length == 4 ? ['#', hex.substring(1, 2), hex.substring(1, 2), hex.substring(2, 3), hex.substring(2, 3), hex.substring(3, 4), hex.substring(3, 4)].join('') : hex;
  }

  // Component to hex value
  function compToHex(comp) {
    var hex = comp.toString(16);
    return hex.length == 1 ? '0' + hex : hex;
  }

  // Calculate proportional width and height values when necessary
  function proportionalSize(element, width, height) {
    if (width == null || height == null) {
      var box = element.bbox();

      if (width == null) width = box.width / box.height * height;else if (height == null) height = box.height / box.width * width;
    }

    return {
      width: width,
      height: height
    };
  }

  // Delta transform point
  function deltaTransformPoint(matrix, x, y) {
    return {
      x: x * matrix.a + y * matrix.c + 0,
      y: x * matrix.b + y * matrix.d + 0
    };
  }

  // Map matrix array to object
  function arrayToMatrix(a) {
    return { a: a[0], b: a[1], c: a[2], d: a[3], e: a[4], f: a[5] };
  }

  // Parse matrix if required
  function parseMatrix(matrix) {
    if (!(matrix instanceof SVG.Matrix)) matrix = new SVG.Matrix(matrix);

    return matrix;
  }

  // Add centre point to transform object
  function ensureCentre(o, target) {
    o.cx = o.cx == null ? target.bbox().cx : o.cx;
    o.cy = o.cy == null ? target.bbox().cy : o.cy;
  }

  // PathArray Helpers
  function arrayToString(a) {
    for (var i = 0, il = a.length, s = ''; i < il; i++) {
      s += a[i][0];

      if (a[i][1] != null) {
        s += a[i][1];

        if (a[i][2] != null) {
          s += ' ';
          s += a[i][2];

          if (a[i][3] != null) {
            s += ' ';
            s += a[i][3];
            s += ' ';
            s += a[i][4];

            if (a[i][5] != null) {
              s += ' ';
              s += a[i][5];
              s += ' ';
              s += a[i][6];

              if (a[i][7] != null) {
                s += ' ';
                s += a[i][7];
              }
            }
          }
        }
      }
    }

    return s + ' ';
  }

  // Deep new id assignment
  function assignNewId(node) {
    // do the same for SVG child nodes as well
    for (var i = node.childNodes.length - 1; i >= 0; i--) if (node.childNodes[i] instanceof window.SVGElement) assignNewId(node.childNodes[i]);

    return SVG.adopt(node).id(SVG.eid(node.nodeName));
  }

  // Add more bounding box properties
  function fullBox(b) {
    if (b.x == null) {
      b.x = 0;
      b.y = 0;
      b.width = 0;
      b.height = 0;
    }

    b.w = b.width;
    b.h = b.height;
    b.x2 = b.x + b.width;
    b.y2 = b.y + b.height;
    b.cx = b.x + b.width / 2;
    b.cy = b.y + b.height / 2;

    return b;
  }

  // Get id from reference string
  function idFromReference(url) {
    var m = (url || '').toString().match(SVG.regex.reference);

    if (m) return m[1];
  }

  // If values like 1e-88 are passed, this is not a valid 32 bit float,
  // but in those cases, we are so close to 0 that 0 works well!
  function float32String(v) {
    return Math.abs(v) > 1e-37 ? v : 0;
  }

  // Create matrix array for looping
  var abcdef = 'abcdef'.split('');

  // Add CustomEvent to IE9 and IE10
  if (typeof window.CustomEvent !== 'function') {
    // Code from: https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent
    var CustomEventPoly = function (event, options) {
      options = options || { bubbles: false, cancelable: false, detail: undefined };
      var e = document.createEvent('CustomEvent');
      e.initCustomEvent(event, options.bubbles, options.cancelable, options.detail);
      return e;
    };

    CustomEventPoly.prototype = window.Event.prototype;

    SVG.CustomEvent = CustomEventPoly;
  } else {
    SVG.CustomEvent = window.CustomEvent;
  }

  // requestAnimationFrame / cancelAnimationFrame Polyfill with fallback based on Paul Irish
  (function (w) {
    var lastTime = 0;
    var vendors = ['moz', 'webkit'];

    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
      w.requestAnimationFrame = w[vendors[x] + 'RequestAnimationFrame'];
      w.cancelAnimationFrame = w[vendors[x] + 'CancelAnimationFrame'] || w[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    w.requestAnimationFrame = w.requestAnimationFrame || function (callback) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));

      var id = w.setTimeout(function () {
        callback(currTime + timeToCall);
      }, timeToCall);

      lastTime = currTime + timeToCall;
      return id;
    };

    w.cancelAnimationFrame = w.cancelAnimationFrame || w.clearTimeout;
  })(window);

  return SVG;
});

/***/ })

/******/ });
//# sourceMappingURL=client.bundle.js.map