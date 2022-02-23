/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./client/HideModelerElements.js":
/*!***************************************!*\
  !*** ./client/HideModelerElements.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ HideModelerElements)
/* harmony export */ });
/* harmony import */ var min_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! min-dom */ "./node_modules/min-dom/dist/index.esm.js");
/* harmony import */ var bpmn_js_token_simulation_lib_util_EventHelper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! bpmn-js-token-simulation/lib/util/EventHelper */ "./node_modules/bpmn-js-token-simulation/lib/util/EventHelper.js");





function HideModelerElements(eventBus, toggleMode) {
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

  eventBus.on(bpmn_js_token_simulation_lib_util_EventHelper__WEBPACK_IMPORTED_MODULE_0__.TOGGLE_MODE_EVENT, function(context) {
    var active = context.active;

    var propertiesPanel = (0,min_dom__WEBPACK_IMPORTED_MODULE_1__.query)('.properties');

    if (active) {
      (0,min_dom__WEBPACK_IMPORTED_MODULE_1__.classes)(propertiesPanel).add('hidden');
    } else {
      (0,min_dom__WEBPACK_IMPORTED_MODULE_1__.classes)(propertiesPanel).remove('hidden');
    }
  });
}

HideModelerElements.$inject = [
  'eventBus',
  'toggleMode'
];

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/animation/Animation.js":
/*!**************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/animation/Animation.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Animation)
/* harmony export */ });
/* harmony import */ var min_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! min-dom */ "./node_modules/min-dom/dist/index.esm.js");
/* harmony import */ var tiny_svg__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! tiny-svg */ "./node_modules/tiny-svg/dist/index.esm.js");
/* harmony import */ var _util_EventHelper__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../util/EventHelper */ "./node_modules/bpmn-js-token-simulation/lib/util/EventHelper.js");






const STYLE = getComputedStyle(document.documentElement);

const DEFAULT_PRIMARY_COLOR = STYLE.getPropertyValue('--token-simulation-green-base-44');
const DEFAULT_AUXILIARY_COLOR = STYLE.getPropertyValue('--token-simulation-white');

function noop() {}

function getSegmentEasing(index, waypoints) {

  // only a single segment
  if (waypoints.length === 2) {
    return EASE_IN_OUT;
  }

  // first segment
  if (index === 1) {
    return EASE_IN;
  }

  // last segment
  if (index === waypoints.length - 1) {
    return EASE_OUT;
  }

  return EASE_LINEAR;
}

const EASE_LINEAR = function(pos) {
  return pos;
};
const EASE_IN = function(pos) {
  return -Math.cos(pos * Math.PI / 2) + 1;
};
const EASE_OUT = function(pos) {
  return Math.sin(pos * Math.PI / 2);
};
const EASE_IN_OUT = function(pos) {
  return -Math.cos(pos * Math.PI) / 2 + 0.5;
};

const TOKEN_SIZE = 20;


function Animation(canvas, eventBus, scopeFilter) {
  this._eventBus = eventBus;
  this._scopeFilter = scopeFilter;

  this._animations = new Set();
  this._speed = 1;

  eventBus.on('import.done', () => {
    const viewport = (0,min_dom__WEBPACK_IMPORTED_MODULE_0__.query)('.viewport', canvas._svg);

    this.group = (0,tiny_svg__WEBPACK_IMPORTED_MODULE_1__.appendTo)(
      (0,tiny_svg__WEBPACK_IMPORTED_MODULE_1__.create)('<g class="animation-tokens" />'),
      viewport
    );
  });

  eventBus.on(_util_EventHelper__WEBPACK_IMPORTED_MODULE_2__.RESET_SIMULATION_EVENT, () => {
    this.clearAnimations();
  });

  eventBus.on(_util_EventHelper__WEBPACK_IMPORTED_MODULE_2__.PAUSE_SIMULATION_EVENT, () => {
    this.pause();
  });

  eventBus.on(_util_EventHelper__WEBPACK_IMPORTED_MODULE_2__.PLAY_SIMULATION_EVENT, () => {
    this.play();
  });

  eventBus.on(_util_EventHelper__WEBPACK_IMPORTED_MODULE_2__.SCOPE_FILTER_CHANGED_EVENT, event => {

    this.each(animation => {
      if (this._scopeFilter.isShown(animation.scope)) {
        animation.show();
      } else {
        animation.hide();
      }
    });
  });

  eventBus.on(_util_EventHelper__WEBPACK_IMPORTED_MODULE_2__.SCOPE_DESTROYED_EVENT, event => {
    const {
      scope
    } = event;

    this.clearAnimations(scope);
  });
}

Animation.prototype.animate = function(connection, scope, done) {
  this.createAnimation(connection, scope, done);
};

Animation.prototype.pause = function() {
  this.each(animation => animation.pause());
};

Animation.prototype.play = function() {
  this.each(animation => animation.play());
};

Animation.prototype.each = function(fn) {
  this._animations.forEach(fn);
};

Animation.prototype.createAnimation = function(connection, scope, done=noop) {
  if (!this.group) {
    return;
  }

  const tokenGfx = this._createTokenGfx(scope);

  const animation = new TokenAnimation(tokenGfx, connection.waypoints, () => {
    this._animations.delete(animation);

    done();
  });

  animation.setSpeed(this.getAnimationSpeed());

  if (!this._scopeFilter.isShown(scope)) {
    animation.hide();
  }

  animation.scope = scope;
  animation.element = connection;

  this._animations.add(animation);

  this._eventBus.fire(_util_EventHelper__WEBPACK_IMPORTED_MODULE_2__.ANIMATION_CREATED_EVENT, {
    animation
  });

  animation.play();

  return animation;
};

Animation.prototype.setAnimationSpeed = function(speed) {
  this._speed = speed;

  this.each(animation => animation.setSpeed(speed));

  this._eventBus.fire(_util_EventHelper__WEBPACK_IMPORTED_MODULE_2__.ANIMATION_SPEED_CHANGED_EVENT, {
    speed
  });
};

Animation.prototype.getAnimationSpeed = function() {
  return this._speed;
};

Animation.prototype.clearAnimations = function(scope) {
  this.each(animation => {
    if (!scope || animation.scope === scope) {
      animation.remove();
    }
  });
};

Animation.prototype._createTokenGfx = function(scope) {
  const parent = (0,tiny_svg__WEBPACK_IMPORTED_MODULE_1__.create)(this._getTokenSVG(scope).trim());

  return (0,tiny_svg__WEBPACK_IMPORTED_MODULE_1__.appendTo)(parent, this.group);
};

Animation.prototype._getTokenSVG = function(scope) {

  const colors = scope.colors || {
    primary: DEFAULT_PRIMARY_COLOR,
    auxiliary: DEFAULT_AUXILIARY_COLOR
  };

  return `
    <g class="token">
      <circle
        class="circle"
        r="${TOKEN_SIZE / 2}"
        cx="${TOKEN_SIZE / 2}"
        cy="${TOKEN_SIZE / 2}"
        fill="${ colors.primary }"
      />
      <text
        class="text"
        transform="translate(10, 14)"
        text-anchor="middle"
        fill="${ colors.auxiliary }"
      >1</text>
    </g>
  `;
};

Animation.$inject = [
  'canvas',
  'eventBus',
  'scopeFilter'
];


function TokenAnimation(gfx, waypoints, done) {
  this.gfx = gfx;
  this.waypoints = waypoints;
  this.done = done;

  this._paused = true;
  this._t = 0;
  this._parts = [];

  this.create();
}

TokenAnimation.prototype.pause = function() {
  this._paused = true;
};

TokenAnimation.prototype.play = function() {

  if (this._paused) {
    this._paused = false;

    this.tick(0);
  }

  this.schedule();
};

TokenAnimation.prototype.schedule = function() {

  if (this._paused) {
    return;
  }

  if (this._scheduled) {
    return;
  }

  const last = Date.now();

  this._scheduled = true;

  requestAnimationFrame(() => {
    this._scheduled = false;

    if (this._paused) {
      return;
    }

    this.tick((Date.now() - last) * this._speed);
    this.schedule();
  });
};


TokenAnimation.prototype.tick = function(tElapsed) {

  const t = this._t = this._t + tElapsed;

  const part = this._parts.find(
    p => p.startTime <= t && p.endTime > t
  );

  // completed
  if (!part) {
    return this.remove();
  }

  const segmentTime = t - part.startTime;
  const segmentLength = part.length * part.easing(segmentTime / part.duration);

  const currentLength = part.startLength + segmentLength;

  const point = this._path.getPointAtLength(currentLength);

  this.move(point.x, point.y);
};

TokenAnimation.prototype.move = function(x, y) {
  (0,tiny_svg__WEBPACK_IMPORTED_MODULE_1__.attr)(this.gfx, 'transform', `translate(${x}, ${y})`);
};

TokenAnimation.prototype.create = function() {
  const waypoints = this.waypoints;

  const parts = waypoints.reduce((parts, point, index) => {

    const lastPoint = waypoints[index - 1];

    if (lastPoint) {
      const lastPart = parts[parts.length - 1];

      const startLength = lastPart && lastPart.endLength || 0;
      const length = distance(lastPoint, point);

      parts.push({
        startLength,
        endLength: startLength + length,
        length,
        easing: getSegmentEasing(index, waypoints)
      });
    }

    return parts;
  }, []);

  const totalLength = parts.reduce(function(length, part) {
    return length + part.length;
  }, 0);

  const d = waypoints.reduce((d, waypoint, index) => {

    const x = waypoint.x - TOKEN_SIZE / 2,
          y = waypoint.y - TOKEN_SIZE / 2;

    d.push([ index > 0 ? 'L' : 'M', x, y ]);

    return d;
  }, []).flat().join(' ');

  const totalDuration = getAnimationDuration(totalLength);

  this._parts = parts.reduce((parts, part, index) => {
    const duration = totalDuration / totalLength * part.length;
    const startTime = index > 0 ? parts[index - 1].endTime : 0;
    const endTime = startTime + duration;

    return [
      ...parts,
      {
        ...part,
        startTime,
        endTime,
        duration
      }
    ];
  }, []);

  this._path = (0,tiny_svg__WEBPACK_IMPORTED_MODULE_1__.create)(`<path d="${d}" />`);
  this._t = 0;
};

TokenAnimation.prototype.show = function() {
  (0,tiny_svg__WEBPACK_IMPORTED_MODULE_1__.attr)(this.gfx, 'display', '');
};

TokenAnimation.prototype.hide = function() {
  (0,tiny_svg__WEBPACK_IMPORTED_MODULE_1__.attr)(this.gfx, 'display', 'none');
};

TokenAnimation.prototype.remove = function() {
  this.pause();

  (0,tiny_svg__WEBPACK_IMPORTED_MODULE_1__.remove)(this.gfx);

  this.done();
};

TokenAnimation.prototype.setSpeed = function(speed) {
  this._speed = speed;
};

function getAnimationDuration(length) {
  return Math.log(length) * randomBetween(250, 300);
}

function randomBetween(min, max) {
  return min + Math.floor(Math.random() * (max - min));
}

function distance(a, b) {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/animation/behaviors/AnimatedMessageFlowBehavior.js":
/*!******************************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/animation/behaviors/AnimatedMessageFlowBehavior.js ***!
  \******************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AnimatedMessageFlowBehavior)
/* harmony export */ });
/* harmony import */ var _simulator_behaviors_MessageFlowBehavior__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../simulator/behaviors/MessageFlowBehavior */ "./node_modules/bpmn-js-token-simulation/lib/simulator/behaviors/MessageFlowBehavior.js");
/* harmony import */ var inherits__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! inherits */ "./node_modules/inherits/inherits_browser.js");
/* harmony import */ var inherits__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(inherits__WEBPACK_IMPORTED_MODULE_0__);





function AnimatedMessageFlowBehavior(injector, animation) {
  injector.invoke(_simulator_behaviors_MessageFlowBehavior__WEBPACK_IMPORTED_MODULE_1__.default, this);

  this._animation = animation;
}

inherits__WEBPACK_IMPORTED_MODULE_0___default()(AnimatedMessageFlowBehavior, _simulator_behaviors_MessageFlowBehavior__WEBPACK_IMPORTED_MODULE_1__.default);

AnimatedMessageFlowBehavior.$inject = [
  'injector',
  'animation'
];

AnimatedMessageFlowBehavior.prototype.signal = function(context) {

  const {
    element,
    scope
  } = context;

  this._animation.animate(element, scope, () => {
    _simulator_behaviors_MessageFlowBehavior__WEBPACK_IMPORTED_MODULE_1__.default.prototype.signal.call(this, context);
  });
};


/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/animation/behaviors/AnimatedSequenceFlowBehavior.js":
/*!*******************************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/animation/behaviors/AnimatedSequenceFlowBehavior.js ***!
  \*******************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AnimatedSequenceFlowBehavior)
/* harmony export */ });
/* harmony import */ var _simulator_behaviors_SequenceFlowBehavior__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../simulator/behaviors/SequenceFlowBehavior */ "./node_modules/bpmn-js-token-simulation/lib/simulator/behaviors/SequenceFlowBehavior.js");
/* harmony import */ var inherits__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! inherits */ "./node_modules/inherits/inherits_browser.js");
/* harmony import */ var inherits__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(inherits__WEBPACK_IMPORTED_MODULE_0__);





function AnimatedSequenceFlowBehavior(injector, animation) {
  injector.invoke(_simulator_behaviors_SequenceFlowBehavior__WEBPACK_IMPORTED_MODULE_1__.default, this);

  this._animation = animation;
}

inherits__WEBPACK_IMPORTED_MODULE_0___default()(AnimatedSequenceFlowBehavior, _simulator_behaviors_SequenceFlowBehavior__WEBPACK_IMPORTED_MODULE_1__.default);

AnimatedSequenceFlowBehavior.$inject = [
  'injector',
  'animation'
];

AnimatedSequenceFlowBehavior.prototype.enter = function(context) {

  const {
    element,
    scope
  } = context;

  this._animation.animate(element, scope, () => {
    _simulator_behaviors_SequenceFlowBehavior__WEBPACK_IMPORTED_MODULE_1__.default.prototype.enter.call(this, context);
  });
};

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/animation/behaviors/index.js":
/*!********************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/animation/behaviors/index.js ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _AnimatedMessageFlowBehavior__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AnimatedMessageFlowBehavior */ "./node_modules/bpmn-js-token-simulation/lib/animation/behaviors/AnimatedMessageFlowBehavior.js");
/* harmony import */ var _AnimatedSequenceFlowBehavior__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AnimatedSequenceFlowBehavior */ "./node_modules/bpmn-js-token-simulation/lib/animation/behaviors/AnimatedSequenceFlowBehavior.js");



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  sequenceFlowBehavior: [ 'type', _AnimatedSequenceFlowBehavior__WEBPACK_IMPORTED_MODULE_0__.default ],
  messageFlowBehavior: [ 'type', _AnimatedMessageFlowBehavior__WEBPACK_IMPORTED_MODULE_1__.default ]
});

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/animation/index.js":
/*!**********************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/animation/index.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _behaviors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./behaviors */ "./node_modules/bpmn-js-token-simulation/lib/animation/behaviors/index.js");
/* harmony import */ var _features_scope_filter__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../features/scope-filter */ "./node_modules/bpmn-js-token-simulation/lib/features/scope-filter/index.js");
/* harmony import */ var _simulator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../simulator */ "./node_modules/bpmn-js-token-simulation/lib/simulator/index.js");
/* harmony import */ var _Animation__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Animation */ "./node_modules/bpmn-js-token-simulation/lib/animation/Animation.js");






/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  __depends__: [
    _simulator__WEBPACK_IMPORTED_MODULE_0__.default,
    _behaviors__WEBPACK_IMPORTED_MODULE_1__.default,
    _features_scope_filter__WEBPACK_IMPORTED_MODULE_2__.default
  ],
  animation: [ 'type', _Animation__WEBPACK_IMPORTED_MODULE_3__.default ]
});

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/base.js":
/*!***********************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/base.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _simulator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./simulator */ "./node_modules/bpmn-js-token-simulation/lib/simulator/index.js");
/* harmony import */ var _animation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./animation */ "./node_modules/bpmn-js-token-simulation/lib/animation/index.js");
/* harmony import */ var _features_colored_scopes__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./features/colored-scopes */ "./node_modules/bpmn-js-token-simulation/lib/features/colored-scopes/index.js");
/* harmony import */ var _features_context_pads__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./features/context-pads */ "./node_modules/bpmn-js-token-simulation/lib/features/context-pads/index.js");
/* harmony import */ var _features_simulation_state__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./features/simulation-state */ "./node_modules/bpmn-js-token-simulation/lib/features/simulation-state/index.js");
/* harmony import */ var _features_show_scopes__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./features/show-scopes */ "./node_modules/bpmn-js-token-simulation/lib/features/show-scopes/index.js");
/* harmony import */ var _features_log__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./features/log */ "./node_modules/bpmn-js-token-simulation/lib/features/log/index.js");
/* harmony import */ var _features_element_support__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./features/element-support */ "./node_modules/bpmn-js-token-simulation/lib/features/element-support/index.js");
/* harmony import */ var _features_pause_simulation__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./features/pause-simulation */ "./node_modules/bpmn-js-token-simulation/lib/features/pause-simulation/index.js");
/* harmony import */ var _features_reset_simulation__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./features/reset-simulation */ "./node_modules/bpmn-js-token-simulation/lib/features/reset-simulation/index.js");
/* harmony import */ var _features_token_count__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./features/token-count */ "./node_modules/bpmn-js-token-simulation/lib/features/token-count/index.js");
/* harmony import */ var _features_set_animation_speed__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./features/set-animation-speed */ "./node_modules/bpmn-js-token-simulation/lib/features/set-animation-speed/index.js");
/* harmony import */ var _features_exclusive_gateway_settings__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./features/exclusive-gateway-settings */ "./node_modules/bpmn-js-token-simulation/lib/features/exclusive-gateway-settings/index.js");
/* harmony import */ var _features_preserve_element_colors__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./features/preserve-element-colors */ "./node_modules/bpmn-js-token-simulation/lib/features/preserve-element-colors/index.js");
/* harmony import */ var _features_palette__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./features/palette */ "./node_modules/bpmn-js-token-simulation/lib/features/palette/index.js");

















/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  __depends__: [
    _simulator__WEBPACK_IMPORTED_MODULE_0__.default,
    _animation__WEBPACK_IMPORTED_MODULE_1__.default,
    _features_colored_scopes__WEBPACK_IMPORTED_MODULE_2__.default,
    _features_context_pads__WEBPACK_IMPORTED_MODULE_3__.default,
    _features_simulation_state__WEBPACK_IMPORTED_MODULE_4__.default,
    _features_show_scopes__WEBPACK_IMPORTED_MODULE_5__.default,
    _features_log__WEBPACK_IMPORTED_MODULE_6__.default,
    _features_element_support__WEBPACK_IMPORTED_MODULE_7__.default,
    _features_pause_simulation__WEBPACK_IMPORTED_MODULE_8__.default,
    _features_reset_simulation__WEBPACK_IMPORTED_MODULE_9__.default,
    _features_token_count__WEBPACK_IMPORTED_MODULE_10__.default,
    _features_set_animation_speed__WEBPACK_IMPORTED_MODULE_11__.default,
    _features_exclusive_gateway_settings__WEBPACK_IMPORTED_MODULE_12__.default,
    _features_preserve_element_colors__WEBPACK_IMPORTED_MODULE_13__.default,
    _features_palette__WEBPACK_IMPORTED_MODULE_14__.default
  ]
});

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/colored-scopes/ColoredScopes.js":
/*!********************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/colored-scopes/ColoredScopes.js ***!
  \********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ColoredScopes)
/* harmony export */ });
/* harmony import */ var randomcolor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! randomcolor */ "./node_modules/randomcolor/randomColor.js");
/* harmony import */ var randomcolor__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(randomcolor__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _util_EventHelper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../util/EventHelper */ "./node_modules/bpmn-js-token-simulation/lib/util/EventHelper.js");




const HIGH_PRIORITY = 1500;


function ColoredScopes(eventBus) {

  const colors = randomcolor__WEBPACK_IMPORTED_MODULE_0___default()({
    count: 60
  }).filter(c => getContrastYIQ(c.substring(1)) < 200);

  function getContrastYIQ(hexcolor) {
    var r = parseInt(hexcolor.substr(0,2),16);
    var g = parseInt(hexcolor.substr(2,2),16);
    var b = parseInt(hexcolor.substr(4,2),16);
    var yiq = ((r*299)+(g*587)+(b*114))/1000;
    return yiq;
  }

  let colorsIdx = 0;

  function getColors(scope) {
    const {
      element
    } = scope;

    if (element && element.type === 'bpmn:MessageFlow') {
      return {
        primary: '#999',
        auxiliary: '#FFF'
      };
    }

    if (scope.parent) {
      return scope.parent.colors;
    }

    const primary = colors[ (colorsIdx++) % colors.length ];

    return {
      primary,
      auxiliary: getContrastYIQ(primary) >= 128 ? '#111' : '#fff'
    };
  }

  eventBus.on(_util_EventHelper__WEBPACK_IMPORTED_MODULE_1__.SCOPE_CREATE_EVENT, HIGH_PRIORITY, event => {

    const {
      scope
    } = event;

    scope.colors = getColors(scope);
  });
}

ColoredScopes.$inject = [
  'eventBus'
];

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/colored-scopes/index.js":
/*!************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/colored-scopes/index.js ***!
  \************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ColoredScopes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ColoredScopes */ "./node_modules/bpmn-js-token-simulation/lib/features/colored-scopes/ColoredScopes.js");


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  __init__: [
    'coloredScopes'
  ],
  coloredScopes: [ 'type', _ColoredScopes__WEBPACK_IMPORTED_MODULE_0__.default ]
});

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/context-pads/ContextPads.js":
/*!****************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/context-pads/ContextPads.js ***!
  \****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ContextPads),
/* harmony export */   "isAncestor": () => (/* binding */ isAncestor)
/* harmony export */ });
/* harmony import */ var _util_ElementHelper__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../util/ElementHelper */ "./node_modules/bpmn-js-token-simulation/lib/util/ElementHelper.js");
/* harmony import */ var _util_EventHelper__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../util/EventHelper */ "./node_modules/bpmn-js-token-simulation/lib/util/EventHelper.js");
/* harmony import */ var min_dom__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! min-dom */ "./node_modules/min-dom/dist/index.esm.js");
/* harmony import */ var _handler_BoundaryEventHandler__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./handler/BoundaryEventHandler */ "./node_modules/bpmn-js-token-simulation/lib/features/context-pads/handler/BoundaryEventHandler.js");
/* harmony import */ var _handler_ExclusiveGatewayHandler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./handler/ExclusiveGatewayHandler */ "./node_modules/bpmn-js-token-simulation/lib/features/context-pads/handler/ExclusiveGatewayHandler.js");
/* harmony import */ var _handler_EventBasedGatewayHandler__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./handler/EventBasedGatewayHandler */ "./node_modules/bpmn-js-token-simulation/lib/features/context-pads/handler/EventBasedGatewayHandler.js");
/* harmony import */ var _handler_ContinueHandler__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./handler/ContinueHandler */ "./node_modules/bpmn-js-token-simulation/lib/features/context-pads/handler/ContinueHandler.js");
/* harmony import */ var _handler_StartEventHandler__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./handler/StartEventHandler */ "./node_modules/bpmn-js-token-simulation/lib/features/context-pads/handler/StartEventHandler.js");
/* harmony import */ var _handler_PauseHandler__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./handler/PauseHandler */ "./node_modules/bpmn-js-token-simulation/lib/features/context-pads/handler/PauseHandler.js");














const LOW_PRIORITY = 500;

const OFFSET_TOP = -15;
const OFFSET_LEFT = -15;


function ContextPads(
    eventBus, elementRegistry,
    overlays, injector,
    canvas, scopeFilter) {

  this._elementRegistry = elementRegistry;
  this._overlays = overlays;
  this._injector = injector;
  this._canvas = canvas;
  this._scopeFilter = scopeFilter;

  this._overlayCache = new Map();

  this._handlerIdx = 0;

  this._handlers = [];

  this.registerHandler('bpmn:ExclusiveGateway', _handler_ExclusiveGatewayHandler__WEBPACK_IMPORTED_MODULE_0__.default);
  this.registerHandler('bpmn:IntermediateCatchEvent', _handler_ContinueHandler__WEBPACK_IMPORTED_MODULE_1__.default);
  this.registerHandler('bpmn:Activity', _handler_ContinueHandler__WEBPACK_IMPORTED_MODULE_1__.default);

  this.registerHandler('bpmn:EventBasedGateway', _handler_EventBasedGatewayHandler__WEBPACK_IMPORTED_MODULE_2__.default);

  this.registerHandler('bpmn:Activity', _handler_BoundaryEventHandler__WEBPACK_IMPORTED_MODULE_3__.default);

  this.registerHandler('bpmn:Process', _handler_StartEventHandler__WEBPACK_IMPORTED_MODULE_4__.default);
  this.registerHandler('bpmn:SubProcess', _handler_StartEventHandler__WEBPACK_IMPORTED_MODULE_4__.default);
  this.registerHandler('bpmn:Participant', _handler_StartEventHandler__WEBPACK_IMPORTED_MODULE_4__.default);
  this.registerHandler('bpmn:Activity', _handler_PauseHandler__WEBPACK_IMPORTED_MODULE_5__.default);

  eventBus.on(_util_EventHelper__WEBPACK_IMPORTED_MODULE_6__.TOGGLE_MODE_EVENT, LOW_PRIORITY, context => {
    const active = context.active;

    if (active) {
      this.openContextPads();
    } else {
      this.closeContextPads();
    }
  });

  eventBus.on(_util_EventHelper__WEBPACK_IMPORTED_MODULE_6__.RESET_SIMULATION_EVENT, LOW_PRIORITY, () => {
    this.closeContextPads();
    this.openContextPads();
  });

  eventBus.on(_util_EventHelper__WEBPACK_IMPORTED_MODULE_6__.SCOPE_FILTER_CHANGED_EVENT, event => {

    const showElements = (0,min_dom__WEBPACK_IMPORTED_MODULE_7__.queryAll)(
      '.djs-overlay-ts-context-menu [data-scope-ids]',
      overlays._overlayRoot
    );

    for (const element of showElements) {

      const scopeIds = element.dataset.scopeIds.split(',');

      const shown = scopeIds.some(id => scopeFilter.isShown(id));

      (0,min_dom__WEBPACK_IMPORTED_MODULE_7__.classes)(element).toggle('hidden', !shown);
    }


    const hideElements = (0,min_dom__WEBPACK_IMPORTED_MODULE_7__.queryAll)(
      '.djs-overlay-ts-context-menu [data-hide-scope-ids]',
      overlays._overlayRoot
    );

    for (const element of hideElements) {

      const scopeIds = element.dataset.hideScopeIds.split(',');

      const shown = scopeIds.some(id => scopeFilter.isShown(id));

      (0,min_dom__WEBPACK_IMPORTED_MODULE_7__.classes)(element).toggle('hidden', shown);
    }
  });

  eventBus.on(_util_EventHelper__WEBPACK_IMPORTED_MODULE_6__.ELEMENT_CHANGED_EVENT, LOW_PRIORITY, event => {
    const {
      element
    } = event;

    this.updateElementContextPads(element);
  });
}

/**
 * Register a handler for an element type.
 * An element type can have multiple handlers.
 *
 * @param {String} type
 * @param {Object} handlerCls
 */
ContextPads.prototype.registerHandler = function(type, handlerCls) {
  const handler = this._injector.instantiate(handlerCls);

  handler.hash = String(this._handlerIdx++);

  this._handlers.push({ handler, type });
};

ContextPads.prototype.getHandlers = function(element) {

  return (
    this._handlers.filter(
      ({ type }) => (0,_util_ElementHelper__WEBPACK_IMPORTED_MODULE_8__.is)(element, type)
    ).map(
      ({ handler }) => handler
    )
  );
};

ContextPads.prototype.openContextPads = function(parent) {

  if (!parent) {
    parent = this._canvas.getRootElement();
  }

  this._elementRegistry.forEach((element) => {
    if (isAncestor(parent, element)) {
      this.updateElementContextPads(element);
    }
  });
};

ContextPads.prototype._getOverlays = function(hash) {
  return this._overlayCache.get(hash) || [];
};

ContextPads.prototype._addOverlay = function(element, options) {

  const {
    handlerHash
  } = options;

  if (!handlerHash) {
    throw new Error('<handlerHash> required');
  }

  const overlayId = this._overlays.add(element, 'ts-context-menu', {
    ...options,
    position: {
      top: OFFSET_TOP,
      left: OFFSET_LEFT
    },
    show: {
      minZoom: 0.5
    }
  });

  const overlay = this._overlays.get(overlayId);

  const overlayCache = this._overlayCache;

  if (!overlayCache.has(handlerHash)) {
    overlayCache.set(handlerHash, []);
  }

  overlayCache.get(handlerHash).push(overlay);
};

ContextPads.prototype._removeOverlay = function(overlay) {

  const {
    id,
    handlerHash
  } = overlay;

  // remove overlay
  this._overlays.remove(id);

  // remove from overlay cache
  const overlays = this._overlayCache.get(handlerHash) || [];

  const idx = overlays.indexOf(overlay);

  if (idx !== -1) {
    overlays.splice(idx, 1);
  }
};

ContextPads.prototype.updateElementContextPads = function(element) {
  for (const handler of this.getHandlers(element)) {
    this._updateElementContextPads(element, handler);
  }
};

ContextPads.prototype._updateElementContextPads = function(element, handler) {

  const contextPads = (handler.createContextPads(element) || []).filter(p => p);

  const handlerHash = `${element.id}------${handler.hash}`;

  const existingOverlays = this._getOverlays(handlerHash);

  const updatedOverlays = [];

  for (const contextPad of contextPads) {

    const {
      element,
      scopes: _scopes,
      hideScopes: _hideScopes,
      action: _action,
      html: _html
    } = contextPad;


    const hash = `${contextPad.element.id}-------${_html}`;

    let existingOverlay = existingOverlays.find(
      o => o.hash === hash
    );

    const html = existingOverlay && existingOverlay.html || (0,min_dom__WEBPACK_IMPORTED_MODULE_7__.domify)(_html);

    if (_scopes) {
      const scopes = _scopes();

      html.dataset.scopeIds = scopes.map(s => s.id).join(',');

      const shownScopes = scopes.filter(s => this._scopeFilter.isShown(s));

      (0,min_dom__WEBPACK_IMPORTED_MODULE_7__.classes)(html).toggle('hidden', shownScopes.length === 0);
    }

    if (_hideScopes) {
      const scopes = _hideScopes();

      html.dataset.hideScopeIds = scopes.map(s => s.id).join(',');

      const shownScopes = scopes.filter(s => this._scopeFilter.isShown(s));

      (0,min_dom__WEBPACK_IMPORTED_MODULE_7__.classes)(html).toggle('hidden', shownScopes.length > 0);
    }

    if (existingOverlay) {
      updatedOverlays.push(existingOverlay);

      continue;
    }

    if (_action) {

      min_dom__WEBPACK_IMPORTED_MODULE_7__.event.bind(html, 'click', event => {
        event.preventDefault();

        const scopes = _scopes
          ? _scopes().filter(s => this._scopeFilter.isShown(s))
          : null;

        _action(scopes);
      });
    }

    this._addOverlay(element, {
      hash,
      handlerHash,
      html
    });
  }

  for (const existingOverlay of existingOverlays) {
    if (!updatedOverlays.includes(existingOverlay)) {
      this._removeOverlay(existingOverlay);
    }
  }
};

ContextPads.prototype.closeContextPads = function() {
  for (const overlays of this._overlayCache.values()) {

    for (const overlay of overlays) {
      this._closeOverlay(overlay);
    }
  }

  this._overlayCache.clear();
};

ContextPads.prototype._closeOverlay = function(overlay) {
  this._overlays.remove(overlay.id);
};

ContextPads.$inject = [
  'eventBus',
  'elementRegistry',
  'overlays',
  'injector',
  'canvas',
  'scopeFilter'
];


// helpers ///////////////

function isAncestor(ancestor, descendant) {

  do {
    if (ancestor === descendant) {
      return true;
    }

    descendant = descendant.parent;
  } while (descendant);

  return false;
}

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/context-pads/handler/BoundaryEventHandler.js":
/*!*********************************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/context-pads/handler/BoundaryEventHandler.js ***!
  \*********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ BoundaryEventHandler)
/* harmony export */ });
/* harmony import */ var _icons__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../icons */ "./node_modules/bpmn-js-token-simulation/lib/icons/index.js");



function BoundaryEventHandler(simulator) {
  this._simulator = simulator;
}

BoundaryEventHandler.prototype.createContextPads = function(element) {
  return element.attachers.map(
    attacher => this.createBoundaryContextPad(attacher)
  );
};

BoundaryEventHandler.prototype.createBoundaryContextPad = function(element) {

  const scopes = () => {
    return this._findScopes({
      element: element.host
    });
  };

  const html = `
    <div class="context-pad" title="Trigger Event">
      ${(0,_icons__WEBPACK_IMPORTED_MODULE_0__.PlayIcon)()}
    </div>
  `;

  // TODO(nikku): do not show on compenstation boundary

  const action = (scopes) => {

    return this._simulator.signal({
      element: element,
      parentScope: scopes[0].parent
    });
  };

  return {
    action,
    element,
    html,
    scopes
  };
};

BoundaryEventHandler.prototype._findScopes = function(options) {
  return this._simulator.findScopes(options);
};

BoundaryEventHandler.$inject = [
  'simulator'
];

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/context-pads/handler/ContinueHandler.js":
/*!****************************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/context-pads/handler/ContinueHandler.js ***!
  \****************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ContinueHandler)
/* harmony export */ });
/* harmony import */ var _icons__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../icons */ "./node_modules/bpmn-js-token-simulation/lib/icons/index.js");



function ContinueHandler(simulator) {
  this._simulator = simulator;
}

ContinueHandler.prototype.createContextPads = function(element) {

  const scopes = () => this._findScopes(scope => {
    return (
      !scope.destroyed &&
      scope.element === element &&
      !scope.children.length
    );
  });

  const html = `
    <div class="context-pad" title="Trigger Event">
      ${ (0,_icons__WEBPACK_IMPORTED_MODULE_0__.PlayIcon)() }
    </div>
  `;

  const action = (scopes) => {
    this._simulator.signal({
      element,
      scope: scopes[0]
    });
  };

  return [
    {
      action,
      element,
      html,
      scopes
    }
  ];
};

ContinueHandler.prototype._findScopes = function(options) {
  return this._simulator.findScopes(options);
};

ContinueHandler.$inject = [
  'simulator'
];

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/context-pads/handler/EventBasedGatewayHandler.js":
/*!*************************************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/context-pads/handler/EventBasedGatewayHandler.js ***!
  \*************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ EventBasedGatewayHandler)
/* harmony export */ });
/* harmony import */ var _util_ElementHelper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../util/ElementHelper */ "./node_modules/bpmn-js-token-simulation/lib/util/ElementHelper.js");
/* harmony import */ var _icons__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../icons */ "./node_modules/bpmn-js-token-simulation/lib/icons/index.js");





function EventBasedGatewayHandler(simulator) {
  this._simulator = simulator;
}

EventBasedGatewayHandler.prototype.createContextPads = function(element) {
  const catchEvents = (
    element.outgoing.filter(
      outgoing => (0,_util_ElementHelper__WEBPACK_IMPORTED_MODULE_0__.is)(outgoing, 'bpmn:SequenceFlow')
    ).map(
      outgoing => outgoing.target
    ).filter(
      element => (0,_util_ElementHelper__WEBPACK_IMPORTED_MODULE_0__.is)(element, 'bpmn:IntermediateCatchEvent') || (0,_util_ElementHelper__WEBPACK_IMPORTED_MODULE_0__.is)(element, 'bpmn:ReceiveTask')
    )
  );

  return catchEvents.map(
    element => this.createCatchEventPad(element)
  );
};

EventBasedGatewayHandler.prototype.createCatchEventPad = function(element) {

  const scopeElement = element.incoming.map(
    connection => connection.source
  ).find(
    element => (0,_util_ElementHelper__WEBPACK_IMPORTED_MODULE_0__.is)(element, 'bpmn:EventBasedGateway')
  );

  if (!scopeElement) {
    return;
  }

  const scopes = () => {
    return this._findScopes({
      element: scopeElement
    });
  };

  const html = `
    <div class="context-pad" title="Trigger Event">
      ${(0,_icons__WEBPACK_IMPORTED_MODULE_1__.PlayIcon)()}
    </div>
  `;

  const action = (scopes) => {
    this._simulator.signal({
      element: element,
      scope: scopes[0]
    });
  };

  return {
    action,
    element,
    html,
    scopes
  };
};

EventBasedGatewayHandler.prototype._findScopes = function(options) {
  return this._simulator.findScopes(options);
};

EventBasedGatewayHandler.$inject = [
  'simulator'
];

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/context-pads/handler/ExclusiveGatewayHandler.js":
/*!************************************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/context-pads/handler/ExclusiveGatewayHandler.js ***!
  \************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ExclusiveGatewayHandler)
/* harmony export */ });
/* harmony import */ var _util_ElementHelper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../util/ElementHelper */ "./node_modules/bpmn-js-token-simulation/lib/util/ElementHelper.js");
/* harmony import */ var _icons__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../icons */ "./node_modules/bpmn-js-token-simulation/lib/icons/index.js");





function ExclusiveGatewayHandler(exclusiveGatewaySettings) {
  this._exclusiveGatewaySettings = exclusiveGatewaySettings;
}

ExclusiveGatewayHandler.prototype.createContextPads = function(element) {

  const outgoingFlows = element.outgoing.filter(function(outgoing) {
    return (0,_util_ElementHelper__WEBPACK_IMPORTED_MODULE_0__.is)(outgoing, 'bpmn:SequenceFlow');
  });

  if (outgoingFlows.length < 2) {
    return;
  }

  const html = `
    <div class="context-pad" title="Set Sequence Flow">
      ${(0,_icons__WEBPACK_IMPORTED_MODULE_1__.ForkIcon)()}
    </div>
  `;

  const action = () => {
    this._exclusiveGatewaySettings.setSequenceFlow(element);
  };

  return [
    {
      action,
      element,
      html
    }
  ];
};

ExclusiveGatewayHandler.$inject = [
  'exclusiveGatewaySettings'
];

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/context-pads/handler/PauseHandler.js":
/*!*************************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/context-pads/handler/PauseHandler.js ***!
  \*************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PauseHandler)
/* harmony export */ });
/* harmony import */ var _icons__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../icons */ "./node_modules/bpmn-js-token-simulation/lib/icons/index.js");



function PauseHandler(simulator) {
  this._simulator = simulator;
}

PauseHandler.prototype.createContextPads = function(element) {

  return [
    this.createPauseContextPad(element)
  ];
};

PauseHandler.prototype.createPauseContextPad = function(element) {

  const scopes = () => this._findScopes({
    element
  }).filter(scope => !scope.children.length);

  const wait = this._isPaused(element);

  const html = `
    <div class="context-pad ${ wait ? '' : 'show-hover' }" title="${ wait ? 'Remove' : 'Add' } pause point">
      ${ (wait ? _icons__WEBPACK_IMPORTED_MODULE_0__.RemovePauseIcon : _icons__WEBPACK_IMPORTED_MODULE_0__.PauseIcon)('show-hover') }
      ${ (0,_icons__WEBPACK_IMPORTED_MODULE_0__.PauseIcon)('hide-hover') }
    </div>
  `;

  const action = () => {

    this._togglePaused(element);
  };

  return {
    action,
    element,
    hideScopes: scopes,
    html
  };
};

PauseHandler.prototype._isPaused = function(element) {

  const {
    wait
  } = this._simulator.getConfig(element);

  return wait;
};

PauseHandler.prototype._togglePaused = function(element) {
  const wait = !this._isPaused(element);

  this._simulator.waitAtElement(element, wait);
};

PauseHandler.prototype._findScopes = function(options) {
  return this._simulator.findScopes(options);
};

PauseHandler.$inject = [
  'simulator'
];

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/context-pads/handler/StartEventHandler.js":
/*!******************************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/context-pads/handler/StartEventHandler.js ***!
  \******************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ StartEventHandler)
/* harmony export */ });
/* harmony import */ var _util_ElementHelper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../util/ElementHelper */ "./node_modules/bpmn-js-token-simulation/lib/util/ElementHelper.js");
/* harmony import */ var _util_ElementHelper__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../util/ElementHelper */ "./node_modules/bpmn-js/lib/util/ModelUtil.js");
/* harmony import */ var _icons__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../icons */ "./node_modules/bpmn-js-token-simulation/lib/icons/index.js");





function StartEventHandler(simulator) {
  this._simulator = simulator;
}

StartEventHandler.prototype.createContextPads = function(element) {

  const startEvents = findStartEvents(element);

  const pads = startEvents.map(
    startEvent => this.createStartEventContextPad(startEvent, element)
  );

  return pads;
};

StartEventHandler.prototype.createStartEventContextPad = function(element, parent) {

  const parentElement = element.parent;

  let scopes;

  if ((0,_util_ElementHelper__WEBPACK_IMPORTED_MODULE_0__.is)(parentElement, 'bpmn:SubProcess')) {

    if (!isEventSubProcess(parentElement)) {
      return;
    }

    scopes = () => this._findScopes({
      element: parentElement.parent
    });
  }

  const html = `
    <div class="context-pad">
      ${(0,_icons__WEBPACK_IMPORTED_MODULE_1__.PlayIcon)()}
    </div>
  `;

  const action = (scopes) => {
    const parentScope = scopes && scopes[0];

    this._simulator.signal({
      element: parentElement,
      startEvent: element,
      parentScope
    });
  };

  return {
    action,
    element,
    html,
    scopes
  };
};

StartEventHandler.prototype._findScopes = function(options) {
  return this._simulator.findScopes(options);
};

StartEventHandler.$inject = [
  'simulator'
];


// helpers //////////////

function findStartEvents(processElement) {

  const startEvents = processElement.businessObject.triggeredByEvent
    ? []
    : processElement.children.filter(isStartEvent);

  const eventSubProcesses = processElement.children.filter(isEventSubProcess);

  return eventSubProcesses.reduce((startEvents, subProcessElement) => {

    for (const subProcessChild of subProcessElement.children) {
      if (isStartEvent(subProcessChild)) {
        startEvents.push(subProcessChild);
      }
    }

    return startEvents;
  }, startEvents);
}

function isEventSubProcess(element) {
  return (0,_util_ElementHelper__WEBPACK_IMPORTED_MODULE_2__.getBusinessObject)(element).triggeredByEvent;
}

function isStartEvent(element) {
  return (0,_util_ElementHelper__WEBPACK_IMPORTED_MODULE_0__.is)(element, 'bpmn:StartEvent');
}

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/context-pads/index.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/context-pads/index.js ***!
  \**********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ContextPads__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ContextPads */ "./node_modules/bpmn-js-token-simulation/lib/features/context-pads/ContextPads.js");
/* harmony import */ var _scope_filter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../scope-filter */ "./node_modules/bpmn-js-token-simulation/lib/features/scope-filter/index.js");




/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  __depends__: [
    _scope_filter__WEBPACK_IMPORTED_MODULE_0__.default
  ],
  __init__: [
    'contextPads'
  ],
  contextPads: [ 'type', _ContextPads__WEBPACK_IMPORTED_MODULE_1__.default ]
});

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/disable-modeling/DisableModeling.js":
/*!************************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/disable-modeling/DisableModeling.js ***!
  \************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ DisableModeling)
/* harmony export */ });
/* harmony import */ var _util_EventHelper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../util/EventHelper */ "./node_modules/bpmn-js-token-simulation/lib/util/EventHelper.js");


const HIGH_PRIORITY = 10001;


function DisableModeling(
    eventBus,
    contextPad,
    dragging,
    directEditing,
    editorActions,
    modeling,
    palette,
    paletteProvider) {

  let modelingDisabled = false;

  eventBus.on(_util_EventHelper__WEBPACK_IMPORTED_MODULE_0__.TOGGLE_MODE_EVENT, HIGH_PRIORITY, event => {

    modelingDisabled = event.active;

    if (modelingDisabled) {
      directEditing.cancel();
      contextPad.close();
      dragging.cancel();
    }

    palette._update();
  });

  function intercept(obj, fnName, cb) {
    const fn = obj[fnName];
    obj[fnName] = function() {
      return cb.call(this, fn, arguments);
    };
  }

  function ignoreIfModelingDisabled(obj, fnName) {
    intercept(obj, fnName, function(fn, args) {
      if (modelingDisabled) {
        return;
      }

      return fn.apply(this, args);
    });
  }

  function throwIfModelingDisabled(obj, fnName) {
    intercept(obj, fnName, function(fn, args) {
      if (modelingDisabled) {
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

  intercept(editorActions, 'trigger', function(fn, args) {
    const action = args[0];

    if (modelingDisabled && isAnyAction([
      'undo',
      'redo',
      'copy',
      'paste',
      'removeSelection',
      'spaceTool',
      'lassoTool',
      'globalConnectTool',
      'distributeElements',
      'alignElements',
      'directEditing',
    ], action)) {
      return;
    }

    return fn.apply(this, args);
  });
}

DisableModeling.$inject = [
  'eventBus',
  'contextPad',
  'dragging',
  'directEditing',
  'editorActions',
  'modeling',
  'palette',
  'paletteProvider',
];


// helpers //////////

function isAnyAction(actions, action) {
  return actions.indexOf(action) > -1;
}

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/disable-modeling/index.js":
/*!**************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/disable-modeling/index.js ***!
  \**************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _DisableModeling__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DisableModeling */ "./node_modules/bpmn-js-token-simulation/lib/features/disable-modeling/DisableModeling.js");


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  __init__: [
    'disableModeling'
  ],
  disableModeling: [ 'type', _DisableModeling__WEBPACK_IMPORTED_MODULE_0__.default ]
});

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/editor-actions/EditorActions.js":
/*!********************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/editor-actions/EditorActions.js ***!
  \********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ EditorActions)
/* harmony export */ });
function EditorActions(
    eventBus,
    toggleMode,
    pauseSimulation,
    resetSimulation,
    editorActions,
    injector
) {
  editorActions.register({
    toggleTokenSimulation: function() {
      toggleMode.toggleMode();
    }
  });

  editorActions.register({
    togglePauseTokenSimulation: function() {
      pauseSimulation.toggle();
    }
  });

  editorActions.register({
    resetTokenSimulation: function() {
      resetSimulation.resetSimulation();
    }
  });

  const log = injector.get('log', false);

  log && editorActions.register({
    toggleTokenSimulationLog: function() {
      log.toggle();
    }
  });
}

EditorActions.$inject = [
  'eventBus',
  'toggleMode',
  'pauseSimulation',
  'resetSimulation',
  'editorActions',
  'injector'
];

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/editor-actions/index.js":
/*!************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/editor-actions/index.js ***!
  \************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _EditorActions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./EditorActions */ "./node_modules/bpmn-js-token-simulation/lib/features/editor-actions/EditorActions.js");


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  __init__: [
    'tokenSimulationEditorActions'
  ],
  tokenSimulationEditorActions: [ 'type', _EditorActions__WEBPACK_IMPORTED_MODULE_0__.default ]
});

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/element-colors/ElementColors.js":
/*!********************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/element-colors/ElementColors.js ***!
  \********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ElementColors)
/* harmony export */ });
function ElementColors(elementRegistry, graphicsFactory) {
  this._elementRegistry = elementRegistry;
  this._graphicsFactory = graphicsFactory;
}

ElementColors.$inject = [
  'elementRegistry',
  'graphicsFactory'
];

ElementColors.prototype.get = function(element) {

  const di = getDi(element);

  if (!di) {
    return undefined;
  }

  // reading in accordance with bpmn-js@8.7+,
  // BPMN-in-Color specification
  if (isLabel(element)) {
    return {
      stroke: di.label && di.label.get('color')
    };
  } else {
    return {
      fill: di.get('background-color'),
      stroke: di.get('border-color')
    };
  }
};

ElementColors.prototype.set = function(element, colors) {

  const {
    fill,
    stroke
  } = colors;

  const di = getDi(element);

  if (!di) {
    return;
  }

  // writing in accordance with bpmn-js@8.7+,
  // BPMN-in-Color specification
  if (isLabel(element)) {
    di.label && di.label.set('color', stroke);
  } else {
    di.set('background-color', fill);
    di.set('border-color', stroke);
  }

  this._forceRedraw(element);
};

ElementColors.prototype._forceRedraw = function(element) {
  const gfx = this._elementRegistry.getGraphics(element);
  const type = element.waypoints ? 'connection' : 'shape';

  this._graphicsFactory.update(type, element, gfx);
};


// helpers /////////////////

function getDi(element) {
  return element.businessObject && element.businessObject.di;
}

function isLabel(element) {
  return 'labelTarget' in element;
}

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/element-colors/index.js":
/*!************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/element-colors/index.js ***!
  \************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ElementColors__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ElementColors */ "./node_modules/bpmn-js-token-simulation/lib/features/element-colors/ElementColors.js");


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  elementColors: [ 'type', _ElementColors__WEBPACK_IMPORTED_MODULE_0__.default ]
});

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/element-notifications/ElementNotifications.js":
/*!**********************************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/element-notifications/ElementNotifications.js ***!
  \**********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ElementNotifications)
/* harmony export */ });
/* harmony import */ var min_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! min-dom */ "./node_modules/min-dom/dist/index.esm.js");
/* harmony import */ var _util_EventHelper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../util/EventHelper */ "./node_modules/bpmn-js-token-simulation/lib/util/EventHelper.js");




const OFFSET_TOP = -15;
const OFFSET_RIGHT = 15;


function ElementNotifications(overlays, eventBus) {
  this._overlays = overlays;

  eventBus.on([
    _util_EventHelper__WEBPACK_IMPORTED_MODULE_0__.RESET_SIMULATION_EVENT,
    _util_EventHelper__WEBPACK_IMPORTED_MODULE_0__.SCOPE_CREATE_EVENT,
    _util_EventHelper__WEBPACK_IMPORTED_MODULE_0__.TOGGLE_MODE_EVENT
  ], () => {
    this.clear();
  });
}

ElementNotifications.prototype.addElementNotification = function(element, options) {
  const position = {
    top: OFFSET_TOP,
    right: OFFSET_RIGHT
  };

  const {
    type,
    icon,
    text,
    scope = {}
  } = options;

  const colors = scope.colors;

  const colorMarkup = colors
    ? `style="color: ${colors.auxiliary}; background: ${colors.primary}"`
    : '';

  const html = (0,min_dom__WEBPACK_IMPORTED_MODULE_1__.domify)(`
    <div class="element-notification ${ type || '' }" ${colorMarkup}>
      ${ icon || '' }
      <span class="text">${ text }</span>
    </div>
  `);

  this._overlays.add(element, 'element-notification', {
    position,
    html: html,
    show: {
      minZoom: 0.5
    }
  });
};

ElementNotifications.prototype.clear = function() {
  this._overlays.remove({ type: 'element-notification' });
};

ElementNotifications.prototype.removeElementNotification = function(element) {
  this._overlays.remove({ element: element });
};

ElementNotifications.$inject = [ 'overlays', 'eventBus' ];

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/element-notifications/index.js":
/*!*******************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/element-notifications/index.js ***!
  \*******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ElementNotifications__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ElementNotifications */ "./node_modules/bpmn-js-token-simulation/lib/features/element-notifications/ElementNotifications.js");


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  elementNotifications: [ 'type', _ElementNotifications__WEBPACK_IMPORTED_MODULE_0__.default ]
});

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/element-support/ElementSupport.js":
/*!**********************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/element-support/ElementSupport.js ***!
  \**********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ElementSupport)
/* harmony export */ });
/* harmony import */ var min_dom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! min-dom */ "./node_modules/min-dom/dist/index.esm.js");
/* harmony import */ var _util_ElementHelper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../util/ElementHelper */ "./node_modules/bpmn-js-token-simulation/lib/util/ElementHelper.js");
/* harmony import */ var _util_EventHelper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../util/EventHelper */ "./node_modules/bpmn-js-token-simulation/lib/util/EventHelper.js");
/* harmony import */ var _icons__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../icons */ "./node_modules/bpmn-js-token-simulation/lib/icons/index.js");









const UNSUPPORTED_ELEMENTS = [
  'bpmn:InclusiveGateway',
  'bpmn:ComplexGateway'
];

function isLabel(element) {
  return element.labelTarget;
}


function ElementSupport(
    eventBus, elementRegistry, canvas,
    notifications, elementNotifications) {

  this._eventBus = eventBus;
  this._elementRegistry = elementRegistry;
  this._elementNotifications = elementNotifications;
  this._notifications = notifications;

  this._canvasParent = canvas.getContainer().parentNode;

  eventBus.on(_util_EventHelper__WEBPACK_IMPORTED_MODULE_0__.TOGGLE_MODE_EVENT, event => {

    if (event.active) {
      this.enable();
    } else {
      this.clear();
    }
  });
}

ElementSupport.prototype.getUnsupportedElements = function() {
  return this._unsupportedElements;
};

ElementSupport.prototype.enable = function() {

  const unsupportedElements = [];

  this._elementRegistry.forEach(element => {

    if (isLabel(element)) {
      return;
    }

    if (!(0,_util_ElementHelper__WEBPACK_IMPORTED_MODULE_1__.is)(element, UNSUPPORTED_ELEMENTS)) {
      return;
    }

    this.showWarning(element);

    unsupportedElements.push(element);
  });

  if (unsupportedElements.length) {

    this._notifications.showNotification({
      text: 'Found unsupported elements',
      icon: (0,_icons__WEBPACK_IMPORTED_MODULE_2__.ExclamationTriangleIcon)(),
      type: 'warning',
      ttl: 5000
    });
  }

  this._unsupportedElements = unsupportedElements;
};

ElementSupport.prototype.clear = function() {
  (0,min_dom__WEBPACK_IMPORTED_MODULE_3__.classes)(this._canvasParent).remove('warning');
};

ElementSupport.prototype.showWarning = function(element) {
  this._elementNotifications.addElementNotification(element, {
    type: 'warning',
    icon: (0,_icons__WEBPACK_IMPORTED_MODULE_2__.ExclamationTriangleIcon)(),
    text: 'Not supported'
  });
};

ElementSupport.$inject = [
  'eventBus',
  'elementRegistry',
  'canvas',
  'notifications',
  'elementNotifications'
];

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/element-support/index.js":
/*!*************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/element-support/index.js ***!
  \*************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ElementSupport__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ElementSupport */ "./node_modules/bpmn-js-token-simulation/lib/features/element-support/ElementSupport.js");
/* harmony import */ var _element_notifications__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../element-notifications */ "./node_modules/bpmn-js-token-simulation/lib/features/element-notifications/index.js");
/* harmony import */ var _notifications__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../notifications */ "./node_modules/bpmn-js-token-simulation/lib/features/notifications/index.js");




/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  __depends__: [
    _element_notifications__WEBPACK_IMPORTED_MODULE_0__.default,
    _notifications__WEBPACK_IMPORTED_MODULE_1__.default
  ],
  __init__: [ 'elementSupport' ],
  elementSupport: [ 'type', _ElementSupport__WEBPACK_IMPORTED_MODULE_2__.default ]
});


/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/exclusive-gateway-settings/ExclusiveGatewaySettings.js":
/*!*******************************************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/exclusive-gateway-settings/ExclusiveGatewaySettings.js ***!
  \*******************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ExclusiveGatewaySettings)
/* harmony export */ });
/* harmony import */ var _util_ElementHelper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../util/ElementHelper */ "./node_modules/bpmn-js-token-simulation/lib/util/ElementHelper.js");
/* harmony import */ var _util_EventHelper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../util/EventHelper */ "./node_modules/bpmn-js-token-simulation/lib/util/EventHelper.js");





const SELECTED_COLOR = '--token-simulation-grey-darken-30';
const NOT_SELECTED_COLOR = '--token-simulation-grey-lighten-56';

function getNext(gateway, sequenceFlow) {
  var outgoing = gateway.outgoing.filter(isSequenceFlow);

  var index = outgoing.indexOf(sequenceFlow || gateway.sequenceFlow);

  if (outgoing[index + 1]) {
    return outgoing[index + 1];
  } else {
    return outgoing[0];
  }
}

function isSequenceFlow(connection) {
  return (0,_util_ElementHelper__WEBPACK_IMPORTED_MODULE_0__.is)(connection, 'bpmn:SequenceFlow');
}


function ExclusiveGatewaySettings(
    eventBus, elementRegistry,
    elementColors, simulator, simulationStyles) {

  this._elementRegistry = elementRegistry;
  this._elementColors = elementColors;
  this._simulator = simulator;
  this._simulationStyles = simulationStyles;

  eventBus.on(_util_EventHelper__WEBPACK_IMPORTED_MODULE_1__.TOGGLE_MODE_EVENT, event => {
    if (event.active) {
      this.setSequenceFlowsDefault();
    } else {
      this.resetSequenceFlows();
    }
  });
}

ExclusiveGatewaySettings.prototype.setSequenceFlowsDefault = function() {
  const exclusiveGateways = this._elementRegistry.filter(element => {
    return (0,_util_ElementHelper__WEBPACK_IMPORTED_MODULE_0__.is)(element, 'bpmn:ExclusiveGateway');
  });

  for (const gateway of exclusiveGateways) {
    this.setSequenceFlow(gateway);
  }
};

ExclusiveGatewaySettings.prototype.resetSequenceFlows = function() {

  const exclusiveGateways = this._elementRegistry.filter(element => {
    return (0,_util_ElementHelper__WEBPACK_IMPORTED_MODULE_0__.is)(element, 'bpmn:ExclusiveGateway');
  });

  exclusiveGateways.forEach(exclusiveGateway => {
    if (exclusiveGateway.outgoing.filter(isSequenceFlow).length) {
      this.resetSequenceFlow(exclusiveGateway);
    }
  });
};

ExclusiveGatewaySettings.prototype.resetSequenceFlow = function(gateway) {
  this._simulator.setConfig(gateway, { activeOutgoing: undefined });
};

ExclusiveGatewaySettings.prototype.setSequenceFlow = function(gateway) {

  const outgoing = gateway.outgoing.filter(isSequenceFlow);

  // not forking
  if (outgoing.length < 2) {
    return;
  }

  const {
    activeOutgoing
  } = this._simulator.getConfig(gateway);

  let newActiveOutgoing;

  if (activeOutgoing) {

    // set next sequence flow
    newActiveOutgoing = getNext(gateway, activeOutgoing);
  } else {

    // set first sequence flow
    newActiveOutgoing = outgoing[ 0 ];
  }

  this._simulator.setConfig(gateway, { activeOutgoing: newActiveOutgoing });

  // set colors
  gateway.outgoing.forEach(outgoing => {

    const style = outgoing === newActiveOutgoing ? SELECTED_COLOR : NOT_SELECTED_COLOR;
    const stroke = this._simulationStyles.get(style);

    this._elementColors.set(outgoing, {
      stroke
    });
  });
};

ExclusiveGatewaySettings.$inject = [
  'eventBus',
  'elementRegistry',
  'elementColors',
  'simulator',
  'simulationStyles'
];

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/exclusive-gateway-settings/index.js":
/*!************************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/exclusive-gateway-settings/index.js ***!
  \************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ExclusiveGatewaySettings__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ExclusiveGatewaySettings */ "./node_modules/bpmn-js-token-simulation/lib/features/exclusive-gateway-settings/ExclusiveGatewaySettings.js");
/* harmony import */ var _element_colors__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../element-colors */ "./node_modules/bpmn-js-token-simulation/lib/features/element-colors/index.js");
/* harmony import */ var _simulation_styles__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../simulation-styles */ "./node_modules/bpmn-js-token-simulation/lib/features/simulation-styles/index.js");




/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  __depends__: [
    _element_colors__WEBPACK_IMPORTED_MODULE_0__.default,
    _simulation_styles__WEBPACK_IMPORTED_MODULE_1__.default
  ],
  exclusiveGatewaySettings: [ 'type', _ExclusiveGatewaySettings__WEBPACK_IMPORTED_MODULE_2__.default ]
});

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/keyboard-bindings/KeyboardBindings.js":
/*!**************************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/keyboard-bindings/KeyboardBindings.js ***!
  \**************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ KeyboardBindings)
/* harmony export */ });
/* harmony import */ var _util_EventHelper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../util/EventHelper */ "./node_modules/bpmn-js-token-simulation/lib/util/EventHelper.js");


const VERY_HIGH_PRIORITY = 10000;


function KeyboardBindings(eventBus, injector) {

  var editorActions = injector.get('editorActions', false),
      keyboard = injector.get('keyboard', false);

  if (!keyboard || !editorActions) {
    return;
  }


  var isActive = false;


  function handleKeyEvent(keyEvent) {
    if (isKey([ 't', 'T' ], keyEvent)) {
      editorActions.trigger('toggleTokenSimulation');

      return true;
    }

    if (!isActive) {
      return;
    }

    if (isKey([ 'l', 'L' ], keyEvent)) {
      editorActions.trigger('toggleTokenSimulationLog');

      return true;
    }

    // see https://developer.mozilla.org/de/docs/Web/API/KeyboardEvent/key/Key_Values#Whitespace_keys
    if (isKey([ ' ', 'Spacebar' ], keyEvent)) {
      editorActions.trigger('togglePauseTokenSimulation');

      return true;
    }

    if (isKey([ 'r', 'R' ], keyEvent)) {
      editorActions.trigger('resetTokenSimulation');

      return true;
    }
  }


  eventBus.on('keyboard.init', function() {

    keyboard.addListener(VERY_HIGH_PRIORITY, function(event) {
      var keyEvent = event.keyEvent;

      handleKeyEvent(keyEvent);
    });

  });

  eventBus.on(_util_EventHelper__WEBPACK_IMPORTED_MODULE_0__.TOGGLE_MODE_EVENT, function(context) {
    var active = context.active;

    if (active) {
      isActive = true;
    } else {
      isActive = false;
    }
  });

}

KeyboardBindings.$inject = [ 'eventBus', 'injector' ];


// helpers //////////

function isKey(keys, event) {
  return keys.indexOf(event.key) > -1;
}

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/keyboard-bindings/index.js":
/*!***************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/keyboard-bindings/index.js ***!
  \***************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _KeyboardBindings__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./KeyboardBindings */ "./node_modules/bpmn-js-token-simulation/lib/features/keyboard-bindings/KeyboardBindings.js");


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  __init__: [
    'tokenSimulationKeyboardBindings'
  ],
  tokenSimulationKeyboardBindings: [ 'type', _KeyboardBindings__WEBPACK_IMPORTED_MODULE_0__.default ]
});

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/log/Log.js":
/*!***********************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/log/Log.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Log)
/* harmony export */ });
/* harmony import */ var min_dom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! min-dom */ "./node_modules/min-dom/dist/index.esm.js");
/* harmony import */ var _util_ElementHelper__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../util/ElementHelper */ "./node_modules/bpmn-js-token-simulation/lib/util/ElementHelper.js");
/* harmony import */ var _util_ElementHelper__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../util/ElementHelper */ "./node_modules/bpmn-js/lib/util/ModelUtil.js");
/* harmony import */ var diagram_js_lib_util_EscapeUtil__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! diagram-js/lib/util/EscapeUtil */ "./node_modules/diagram-js/lib/util/EscapeUtil.js");
/* harmony import */ var _util_EventHelper__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../util/EventHelper */ "./node_modules/bpmn-js-token-simulation/lib/util/EventHelper.js");
/* harmony import */ var _icons__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../icons */ "./node_modules/bpmn-js-token-simulation/lib/icons/index.js");











const ICON_INFO = (0,_icons__WEBPACK_IMPORTED_MODULE_0__.InfoIcon)();

function getElementName(element) {
  const name = element && element.businessObject.name;

  return name && (0,diagram_js_lib_util_EscapeUtil__WEBPACK_IMPORTED_MODULE_1__.escapeHTML)(name);
}


function Log(
    eventBus, notifications,
    tokenSimulationPalette, canvas,
    scopeFilter, simulator) {

  this._notifications = notifications;
  this._tokenSimulationPalette = tokenSimulationPalette;
  this._canvas = canvas;
  this._scopeFilter = scopeFilter;

  this._init();

  eventBus.on(_util_EventHelper__WEBPACK_IMPORTED_MODULE_2__.SCOPE_FILTER_CHANGED_EVENT, event => {
    const allElements = (0,min_dom__WEBPACK_IMPORTED_MODULE_3__.queryAll)('.entry[data-scope-id]', this._container);

    for (const element of allElements) {
      const scopeId = element.dataset.scopeId;

      (0,min_dom__WEBPACK_IMPORTED_MODULE_3__.classes)(element).toggle('inactive', !this._scopeFilter.isShown(scopeId));
    }
  });

  eventBus.on(_util_EventHelper__WEBPACK_IMPORTED_MODULE_2__.SCOPE_DESTROYED_EVENT, event => {
    const {
      scope
    } = event;

    const {
      destroyContext,
      element: scopeElement
    } = scope;

    const {
      reason
    } = destroyContext;

    const isCompletion = reason === 'complete';

    const processScopes = [
      'bpmn:Process',
      'bpmn:Participant',
      'bpmn:SubProcess'
    ];

    if (!processScopes.includes(scopeElement.type)) {
      return;
    }

    const isSubProcess = (0,_util_ElementHelper__WEBPACK_IMPORTED_MODULE_4__.is)(scopeElement, 'bpmn:SubProcess');

    const text = `${
      isSubProcess ? (getElementName(scopeElement) || 'SubProcess') : 'Process'
    } ${
      isCompletion ? 'finished' : 'canceled'
    }`;

    this.log({
      text,
      icon: isCompletion ? (0,_icons__WEBPACK_IMPORTED_MODULE_0__.CheckCircleIcon)() : (0,_icons__WEBPACK_IMPORTED_MODULE_0__.TimesCircleIcon)(),
      scope
    });
  });

  eventBus.on(_util_EventHelper__WEBPACK_IMPORTED_MODULE_2__.SCOPE_CREATE_EVENT, event => {
    const {
      scope
    } = event;

    const {
      element: scopeElement
    } = scope;

    const processScopes = [
      'bpmn:Process',
      'bpmn:Participant',
      'bpmn:SubProcess'
    ];

    if (!processScopes.includes(scopeElement.type)) {
      return;
    }

    const isSubProcess = (0,_util_ElementHelper__WEBPACK_IMPORTED_MODULE_4__.is)(scopeElement, 'bpmn:SubProcess');

    const text = `${
      isSubProcess ? (getElementName(scopeElement) || 'SubProcess') : 'Process'
    } started`;

    this.log({
      text,
      icon: (0,_icons__WEBPACK_IMPORTED_MODULE_0__.CheckCircleIcon)(),
      scope
    });
  });

  eventBus.on(_util_EventHelper__WEBPACK_IMPORTED_MODULE_2__.TRACE_EVENT, event => {

    const {
      action,
      scope: elementScope,
      element
    } = event;

    if (action !== 'exit') {
      return;
    }

    const scope = elementScope.parent;

    const elementName = getElementName(element);

    if ((0,_util_ElementHelper__WEBPACK_IMPORTED_MODULE_4__.is)(element, 'bpmn:BusinessRuleTask')) {
      this.log({
        text: elementName || 'Business Rule Task',
        icon: 'bpmn-icon-business-rule',
        scope
      });
    } else if ((0,_util_ElementHelper__WEBPACK_IMPORTED_MODULE_4__.is)(element, 'bpmn:CallActivity')) {
      this.log({
        text: elementName || 'Call Activity',
        icon: 'bpmn-icon-call-activity',
        scope
      });
    } else if ((0,_util_ElementHelper__WEBPACK_IMPORTED_MODULE_4__.is)(element, 'bpmn:IntermediateCatchEvent') || (0,_util_ElementHelper__WEBPACK_IMPORTED_MODULE_4__.is)(element, 'bpmn:IntermediateThrowEvent')) {
      this.log({
        text: elementName || 'Intermediate Event',
        icon: 'bpmn-icon-intermediate-event-none',
        scope
      });
    } if ((0,_util_ElementHelper__WEBPACK_IMPORTED_MODULE_4__.is)(element, 'bpmn:BoundaryEvent')) {
      this.log({
        text: elementName || 'Boundary Event',
        icon: 'bpmn-icon-intermediate-event-none',
        scope
      });
    } else if ((0,_util_ElementHelper__WEBPACK_IMPORTED_MODULE_4__.is)(element, 'bpmn:ManualTask')) {
      this.log({
        text: elementName || 'Manual Task',
        icon: 'bpmn-icon-manual',
        scope
      });
    } else if ((0,_util_ElementHelper__WEBPACK_IMPORTED_MODULE_4__.is)(element, 'bpmn:ScriptTask')) {
      this.log({
        text: elementName || 'Script Task',
        icon: 'bpmn-icon-script',
        scope
      });
    } else if ((0,_util_ElementHelper__WEBPACK_IMPORTED_MODULE_4__.is)(element, 'bpmn:ServiceTask')) {
      this.log({
        text: elementName || 'Service Task',
        icon: 'bpmn-icon-service',
        scope
      });
    } else if ((0,_util_ElementHelper__WEBPACK_IMPORTED_MODULE_4__.is)(element, 'bpmn:Task')) {
      this.log({
        text: elementName || 'Task',
        icon: 'bpmn-icon-task',
        scope
      });
    } else if ((0,_util_ElementHelper__WEBPACK_IMPORTED_MODULE_4__.is)(element, 'bpmn:UserTask')) {
      this.log({
        text: elementName || 'User Task',
        icon: 'bpmn-icon-user',
        scope
      });
    } else if ((0,_util_ElementHelper__WEBPACK_IMPORTED_MODULE_4__.is)(element, 'bpmn:ExclusiveGateway')) {
      if (element.outgoing.length < 2) {
        return;
      }

      const sequenceFlowName = getElementName(element.sequenceFlow);

      let text = elementName || 'Gateway';

      if (sequenceFlowName) {
        text = text.concat(` ${ (0,_icons__WEBPACK_IMPORTED_MODULE_0__.AngleRightIcon)() } ${ sequenceFlowName }`);
      }

      this.log({
        text,
        icon: 'bpmn-icon-gateway-xor',
        scope
      });
    } else if ((0,_util_ElementHelper__WEBPACK_IMPORTED_MODULE_4__.is)(element, 'bpmn:EndEvent')) {
      if ((0,_util_ElementHelper__WEBPACK_IMPORTED_MODULE_4__.isTypedEvent)((0,_util_ElementHelper__WEBPACK_IMPORTED_MODULE_5__.getBusinessObject)(element), 'bpmn:TerminateEventDefinition')) {
        this.log({
          text: elementName || 'Terminate End Event',
          icon: 'bpmn-icon-end-event-terminate',
          scope
        });
      } else {
        this.log({
          text: elementName || 'End Event',
          icon: 'bpmn-icon-end-event-none',
          scope
        });
      }
    } else if ((0,_util_ElementHelper__WEBPACK_IMPORTED_MODULE_4__.is)(element, 'bpmn:StartEvent')) {
      this.log({
        text: elementName || 'Start Event',
        icon: 'bpmn-icon-start-event-none',
        scope
      });
    }
  });


  eventBus.on([
    _util_EventHelper__WEBPACK_IMPORTED_MODULE_2__.TOGGLE_MODE_EVENT,
    _util_EventHelper__WEBPACK_IMPORTED_MODULE_2__.RESET_SIMULATION_EVENT
  ], event => {
    this.clear();

    (0,min_dom__WEBPACK_IMPORTED_MODULE_3__.classes)(this._container).add('hidden');
  });
}

Log.prototype._init = function() {
  this._container = (0,min_dom__WEBPACK_IMPORTED_MODULE_3__.domify)(`
    <div class="token-simulation-log hidden">
      <div class="header">
        ${ (0,_icons__WEBPACK_IMPORTED_MODULE_0__.LogIcon)('log-icon') }
        <button class="close">
          ${ (0,_icons__WEBPACK_IMPORTED_MODULE_0__.TimesIcon)() }
        </button>
      </div>
      <div class="content">
        <p class="entry placeholder">No Entries</p>
      </div>
    </div>
  `);

  this._placeholder = (0,min_dom__WEBPACK_IMPORTED_MODULE_3__.query)('.placeholder', this._container);

  this._content = (0,min_dom__WEBPACK_IMPORTED_MODULE_3__.query)('.content', this._container);

  min_dom__WEBPACK_IMPORTED_MODULE_3__.event.bind(this._content, 'wheel', event => {
    event.stopPropagation();
  });

  min_dom__WEBPACK_IMPORTED_MODULE_3__.event.bind(this._content, 'mousedown', event => {
    event.stopPropagation();
  });

  this._close = (0,min_dom__WEBPACK_IMPORTED_MODULE_3__.query)('.close', this._container);

  min_dom__WEBPACK_IMPORTED_MODULE_3__.event.bind(this._close, 'click', () => {
    (0,min_dom__WEBPACK_IMPORTED_MODULE_3__.classes)(this._container).add('hidden');
  });

  this._icon = (0,min_dom__WEBPACK_IMPORTED_MODULE_3__.query)('.log-icon', this._container);

  min_dom__WEBPACK_IMPORTED_MODULE_3__.event.bind(this._icon, 'click', () => {
    (0,min_dom__WEBPACK_IMPORTED_MODULE_3__.classes)(this._container).add('hidden');
  });

  this._canvas.getContainer().appendChild(this._container);

  this.paletteEntry = (0,min_dom__WEBPACK_IMPORTED_MODULE_3__.domify)(`
    <div class="entry" title="Show Simulation Log">
      ${ (0,_icons__WEBPACK_IMPORTED_MODULE_0__.LogIcon)() }
    </div>
  `);

  min_dom__WEBPACK_IMPORTED_MODULE_3__.event.bind(this.paletteEntry, 'click', () => {
    (0,min_dom__WEBPACK_IMPORTED_MODULE_3__.classes)(this._container).remove('hidden');
  });

  this._tokenSimulationPalette.addEntry(this.paletteEntry, 3);
};

Log.prototype.toggle = function() {
  const container = this._container;

  if ((0,min_dom__WEBPACK_IMPORTED_MODULE_3__.classes)(container).has('hidden')) {
    (0,min_dom__WEBPACK_IMPORTED_MODULE_3__.classes)(container).remove('hidden');
  } else {
    (0,min_dom__WEBPACK_IMPORTED_MODULE_3__.classes)(container).add('hidden');
  }
};

Log.prototype.log = function(options) {

  const {
    text,
    type = 'info',
    icon = ICON_INFO,
    scope
  } = options;

  (0,min_dom__WEBPACK_IMPORTED_MODULE_3__.classes)(this._placeholder).add('hidden');

  const date = new Date();

  const dateString = date.toLocaleTimeString() + ':' + date.getUTCMilliseconds();

  this._notifications.showNotification(options);

  const iconMarkup = icon.startsWith('<') ? icon : `<i class="${icon}"></i>`;

  const colors = scope && scope.colors;

  const colorMarkup = colors ? `style="background: ${colors.primary}; color: ${colors.auxiliary}"` : '';

  const logEntry = (0,min_dom__WEBPACK_IMPORTED_MODULE_3__.domify)(`
    <p class="entry ${ type } ${
      scope && this._scopeFilter.isShown(scope) ? '' : 'inactive'
    }" ${
      scope ? `data-scope-id="${scope.id}"` : ''
    }>
      <span class="date">${ dateString }</span>
      <span class="icon">${iconMarkup}</span>
      <span class="text">${text}</span>
      ${
        scope
          ? `<span class="scope" data-scope-id="${scope.id}" ${colorMarkup}>${scope.id}</span>`
          : ''
      }
    </p>
  `);

  min_dom__WEBPACK_IMPORTED_MODULE_3__.delegate.bind(logEntry, '.scope[data-scope-id]', 'click', event => {
    this._scopeFilter.toggle(scope);
  });

  this._content.appendChild(logEntry);

  this._content.scrollTop = this._content.scrollHeight;
};

Log.prototype.clear = function() {
  while (this._content.firstChild) {
    this._content.removeChild(this._content.firstChild);
  }

  this._placeholder = (0,min_dom__WEBPACK_IMPORTED_MODULE_3__.domify)('<p class="entry placeholder">No Entries</p>');

  this._content.appendChild(this._placeholder);
};

Log.$inject = [
  'eventBus',
  'notifications',
  'tokenSimulationPalette',
  'canvas',
  'scopeFilter',
  'simulator'
];

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/log/index.js":
/*!*************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/log/index.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Log__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Log */ "./node_modules/bpmn-js-token-simulation/lib/features/log/Log.js");
/* harmony import */ var _scope_filter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../scope-filter */ "./node_modules/bpmn-js-token-simulation/lib/features/scope-filter/index.js");
/* harmony import */ var _notifications__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../notifications */ "./node_modules/bpmn-js-token-simulation/lib/features/notifications/index.js");





/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  __depends__: [
    _notifications__WEBPACK_IMPORTED_MODULE_0__.default,
    _scope_filter__WEBPACK_IMPORTED_MODULE_1__.default
  ],
  __init__: [
    'log'
  ],
  log: [ 'type', _Log__WEBPACK_IMPORTED_MODULE_2__.default ]
});

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/notifications/Notifications.js":
/*!*******************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/notifications/Notifications.js ***!
  \*******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Notifications)
/* harmony export */ });
/* harmony import */ var min_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! min-dom */ "./node_modules/min-dom/dist/index.esm.js");
/* harmony import */ var _util_EventHelper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../util/EventHelper */ "./node_modules/bpmn-js-token-simulation/lib/util/EventHelper.js");
/* harmony import */ var _icons__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../icons */ "./node_modules/bpmn-js-token-simulation/lib/icons/index.js");







const NOTIFICATION_TIME_TO_LIVE = 2000; // ms

const INFO_ICON = (0,_icons__WEBPACK_IMPORTED_MODULE_0__.InfoIcon)();


function Notifications(eventBus, canvas, scopeFilter) {
  this._eventBus = eventBus;
  this._canvas = canvas;
  this._scopeFilter = scopeFilter;

  this._init();

  eventBus.on([
    _util_EventHelper__WEBPACK_IMPORTED_MODULE_1__.TOGGLE_MODE_EVENT,
    _util_EventHelper__WEBPACK_IMPORTED_MODULE_1__.RESET_SIMULATION_EVENT
  ], event => {
    this.clear();
  });
}

Notifications.prototype._init = function() {
  this.container = (0,min_dom__WEBPACK_IMPORTED_MODULE_2__.domify)('<div class="notifications"></div>');

  this._canvas.getContainer().appendChild(this.container);
};

Notifications.prototype.showNotification = function(options) {

  const {
    text,
    type = 'info',
    icon = INFO_ICON,
    scope,
    ttl = NOTIFICATION_TIME_TO_LIVE
  } = options;

  if (scope && !this._scopeFilter.isShown(scope)) {
    return;
  }

  const iconMarkup = icon.startsWith('<')
    ? icon
    : `<i class="${ icon }"></i>`;

  const colors = scope && scope.colors;

  const colorMarkup = colors ? `style="color: ${colors.auxiliary}; background: ${colors.primary}"` : '';

  const notification = (0,min_dom__WEBPACK_IMPORTED_MODULE_2__.domify)(`
    <div class="notification ${type}">
      <span class="icon">${iconMarkup}</span>
      <span class="text">${text}</span>
      ${ scope ? `<span class="scope" ${colorMarkup}>${scope.id}</span>` : '' }
    </div>
  `);

  this.container.appendChild(notification);

  // prevent more than 5 notifications at once
  while (this.container.children.length > 5) {
    this.container.children[0].remove();
  }

  setTimeout(function() {
    notification.remove();
  }, ttl);
};

Notifications.prototype.clear = function() {
  while (this.container.children.length) {
    this.container.children[0].remove();
  }
};

Notifications.$inject = [
  'eventBus',
  'canvas',
  'scopeFilter'
];

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/notifications/index.js":
/*!***********************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/notifications/index.js ***!
  \***********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _scope_filter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../scope-filter */ "./node_modules/bpmn-js-token-simulation/lib/features/scope-filter/index.js");
/* harmony import */ var _Notifications__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Notifications */ "./node_modules/bpmn-js-token-simulation/lib/features/notifications/Notifications.js");




/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  __depends__: [
    _scope_filter__WEBPACK_IMPORTED_MODULE_0__.default
  ],
  notifications: [ 'type', _Notifications__WEBPACK_IMPORTED_MODULE_1__.default ]
});

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/palette/Palette.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/palette/Palette.js ***!
  \*******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Palette)
/* harmony export */ });
/* harmony import */ var min_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! min-dom */ "./node_modules/min-dom/dist/index.esm.js");
/* harmony import */ var _util_EventHelper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../util/EventHelper */ "./node_modules/bpmn-js-token-simulation/lib/util/EventHelper.js");





function Palette(eventBus, canvas) {
  var self = this;

  this._canvas = canvas;

  this.entries = [];

  this._init();

  eventBus.on(_util_EventHelper__WEBPACK_IMPORTED_MODULE_0__.TOGGLE_MODE_EVENT, function(context) {
    var active = context.active;

    if (active) {
      (0,min_dom__WEBPACK_IMPORTED_MODULE_1__.classes)(self.container).remove('hidden');
    } else {
      (0,min_dom__WEBPACK_IMPORTED_MODULE_1__.classes)(self.container).add('hidden');
    }
  });
}

Palette.prototype._init = function() {
  this.container = (0,min_dom__WEBPACK_IMPORTED_MODULE_1__.domify)('<div class="token-simulation-palette hidden"></div>');

  this._canvas.getContainer().appendChild(this.container);
};

Palette.prototype.addEntry = function(entry, index) {
  var childIndex = 0;

  this.entries.forEach(function(entry) {
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

Palette.$inject = [ 'eventBus', 'canvas' ];

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/palette/index.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/palette/index.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Palette__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Palette */ "./node_modules/bpmn-js-token-simulation/lib/features/palette/Palette.js");


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  __init__: [
    'tokenSimulationPalette'
  ],
  tokenSimulationPalette: [ 'type', _Palette__WEBPACK_IMPORTED_MODULE_0__.default ]
});

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/pause-simulation/PauseSimulation.js":
/*!************************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/pause-simulation/PauseSimulation.js ***!
  \************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PauseSimulation)
/* harmony export */ });
/* harmony import */ var min_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! min-dom */ "./node_modules/min-dom/dist/index.esm.js");
/* harmony import */ var _util_EventHelper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../util/EventHelper */ "./node_modules/bpmn-js-token-simulation/lib/util/EventHelper.js");
/* harmony import */ var _icons__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../icons */ "./node_modules/bpmn-js-token-simulation/lib/icons/index.js");







const PLAY_MARKUP = (0,_icons__WEBPACK_IMPORTED_MODULE_0__.PlayIcon)();
const PAUSE_MARKUP = (0,_icons__WEBPACK_IMPORTED_MODULE_0__.PauseIcon)();

const HIGH_PRIORITY = 1500;


function PauseSimulation(
    eventBus, tokenSimulationPalette,
    notifications, canvas) {

  this._eventBus = eventBus;
  this._tokenSimulationPalette = tokenSimulationPalette;
  this._notifications = notifications;

  this.canvasParent = canvas.getContainer().parentNode;

  this.isActive = false;
  this.isPaused = true;

  this._init();

  // unpause on simulation start
  eventBus.on(_util_EventHelper__WEBPACK_IMPORTED_MODULE_1__.SCOPE_CREATE_EVENT, HIGH_PRIORITY, event => {
    this.activate();
    this.unpause();
  });

  eventBus.on([
    _util_EventHelper__WEBPACK_IMPORTED_MODULE_1__.RESET_SIMULATION_EVENT,
    _util_EventHelper__WEBPACK_IMPORTED_MODULE_1__.TOGGLE_MODE_EVENT
  ], () => {
    this.deactivate();
    this.pause();
  });

  eventBus.on(_util_EventHelper__WEBPACK_IMPORTED_MODULE_1__.TRACE_EVENT, HIGH_PRIORITY, event => {
    this.unpause();
  });
}

PauseSimulation.prototype._init = function() {
  this.paletteEntry = (0,min_dom__WEBPACK_IMPORTED_MODULE_2__.domify)(`
    <div class="entry disabled" title="Play/Pause Simulation">
      ${ PLAY_MARKUP }
    </div>
  `);

  min_dom__WEBPACK_IMPORTED_MODULE_2__.event.bind(this.paletteEntry, 'click', this.toggle.bind(this));

  this._tokenSimulationPalette.addEntry(this.paletteEntry, 1);
};

PauseSimulation.prototype.toggle = function() {
  if (this.isPaused) {
    this.unpause();
  } else {
    this.pause();
  }
};

PauseSimulation.prototype.pause = function() {
  if (!this.isActive) {
    return;
  }

  (0,min_dom__WEBPACK_IMPORTED_MODULE_2__.classes)(this.paletteEntry).remove('active');
  (0,min_dom__WEBPACK_IMPORTED_MODULE_2__.classes)(this.canvasParent).add('paused');

  this.paletteEntry.innerHTML = PLAY_MARKUP;

  this._eventBus.fire(_util_EventHelper__WEBPACK_IMPORTED_MODULE_1__.PAUSE_SIMULATION_EVENT);

  this._notifications.showNotification({
    text: 'Pause Simulation'
  });

  this.isPaused = true;
};

PauseSimulation.prototype.unpause = function() {

  if (!this.isActive || !this.isPaused) {
    return;
  }

  (0,min_dom__WEBPACK_IMPORTED_MODULE_2__.classes)(this.paletteEntry).add('active');
  (0,min_dom__WEBPACK_IMPORTED_MODULE_2__.classes)(this.canvasParent).remove('paused');

  this.paletteEntry.innerHTML = PAUSE_MARKUP;

  this._eventBus.fire(_util_EventHelper__WEBPACK_IMPORTED_MODULE_1__.PLAY_SIMULATION_EVENT);

  this._notifications.showNotification({
    text: 'Play Simulation'
  });

  this.isPaused = false;
};

PauseSimulation.prototype.activate = function() {
  this.isActive = true;

  (0,min_dom__WEBPACK_IMPORTED_MODULE_2__.classes)(this.paletteEntry).remove('disabled');
};

PauseSimulation.prototype.deactivate = function() {
  this.isActive = false;

  (0,min_dom__WEBPACK_IMPORTED_MODULE_2__.classes)(this.paletteEntry).remove('active');
  (0,min_dom__WEBPACK_IMPORTED_MODULE_2__.classes)(this.paletteEntry).add('disabled');
};

PauseSimulation.$inject = [
  'eventBus',
  'tokenSimulationPalette',
  'notifications',
  'canvas'
];

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/pause-simulation/index.js":
/*!**************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/pause-simulation/index.js ***!
  \**************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _PauseSimulation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./PauseSimulation */ "./node_modules/bpmn-js-token-simulation/lib/features/pause-simulation/PauseSimulation.js");
/* harmony import */ var _notifications__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../notifications */ "./node_modules/bpmn-js-token-simulation/lib/features/notifications/index.js");




/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  __depends__: [
    _notifications__WEBPACK_IMPORTED_MODULE_0__.default
  ],
  __init__: [
    'pauseSimulation'
  ],
  pauseSimulation: [ 'type', _PauseSimulation__WEBPACK_IMPORTED_MODULE_1__.default ]
});

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/preserve-element-colors/PreserveElementColors.js":
/*!*************************************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/preserve-element-colors/PreserveElementColors.js ***!
  \*************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PreserveElementColors)
/* harmony export */ });
/* harmony import */ var _util_EventHelper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../util/EventHelper */ "./node_modules/bpmn-js-token-simulation/lib/util/EventHelper.js");


const VERY_HIGH_PRIORITY = 50000;


function PreserveElementColors(
    eventBus, elementRegistry, elementColors) {

  this._elementRegistry = elementRegistry;
  this._elementColors = elementColors;

  this._colorCache = {};

  eventBus.on(_util_EventHelper__WEBPACK_IMPORTED_MODULE_0__.TOGGLE_MODE_EVENT, VERY_HIGH_PRIORITY, event => {
    const active = event.active;

    if (active) {
      this.preserveColors();
    } else {
      this.resetColors();
    }
  });
}

PreserveElementColors.prototype.preserveColors = function() {
  this._elementRegistry.forEach(element => {
    this._colorCache[element.id] = this._elementColors.get(element);

    this._elementColors.set(element, {
      stroke: '#000',
      fill: '#fff'
    });
  });
};

PreserveElementColors.prototype.resetColors = function() {
  this._elementRegistry.forEach(element => {

    const cachedColors = this._colorCache[element.id];

    if (cachedColors) {
      this._elementColors.set(element, cachedColors);
    }
  });

  this._colorCache = {};
};

PreserveElementColors.$inject = [
  'eventBus',
  'elementRegistry',
  'elementColors'
];

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/preserve-element-colors/index.js":
/*!*********************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/preserve-element-colors/index.js ***!
  \*********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _PreserveElementColors__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./PreserveElementColors */ "./node_modules/bpmn-js-token-simulation/lib/features/preserve-element-colors/PreserveElementColors.js");
/* harmony import */ var _element_colors__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../element-colors */ "./node_modules/bpmn-js-token-simulation/lib/features/element-colors/index.js");



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  __depends__: [ _element_colors__WEBPACK_IMPORTED_MODULE_0__.default ],
  __init__: [
    'preserveElementColors'
  ],
  preserveElementColors: [ 'type', _PreserveElementColors__WEBPACK_IMPORTED_MODULE_1__.default ]
});

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/reset-simulation/ResetSimulation.js":
/*!************************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/reset-simulation/ResetSimulation.js ***!
  \************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ResetSimulation)
/* harmony export */ });
/* harmony import */ var min_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! min-dom */ "./node_modules/min-dom/dist/index.esm.js");
/* harmony import */ var _util_EventHelper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../util/EventHelper */ "./node_modules/bpmn-js-token-simulation/lib/util/EventHelper.js");
/* harmony import */ var _icons__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../icons */ "./node_modules/bpmn-js-token-simulation/lib/icons/index.js");







function ResetSimulation(eventBus, tokenSimulationPalette, notifications) {
  this._eventBus = eventBus;
  this._tokenSimulationPalette = tokenSimulationPalette;
  this._notifications = notifications;

  this._init();

  eventBus.on(_util_EventHelper__WEBPACK_IMPORTED_MODULE_0__.SCOPE_CREATE_EVENT, () => {
    (0,min_dom__WEBPACK_IMPORTED_MODULE_1__.classes)(this._paletteEntry).remove('disabled');
  });

  eventBus.on(_util_EventHelper__WEBPACK_IMPORTED_MODULE_0__.TOGGLE_MODE_EVENT, (event) => {
    const active = this._active = event.active;

    if (!active) {
      this.resetSimulation();
    }
  });
}

ResetSimulation.prototype._init = function() {
  this._paletteEntry = (0,min_dom__WEBPACK_IMPORTED_MODULE_1__.domify)(`
    <div class="entry disabled" title="Reset Simulation">
      ${ (0,_icons__WEBPACK_IMPORTED_MODULE_2__.ResetIcon)() }
    </div>
  `);

  min_dom__WEBPACK_IMPORTED_MODULE_1__.event.bind(this._paletteEntry, 'click', () => {
    this.resetSimulation();

    this._notifications.showNotification({
      text: 'Reset Simulation',
      type: 'info'
    });
  });

  this._tokenSimulationPalette.addEntry(this._paletteEntry, 2);
};

ResetSimulation.prototype.resetSimulation = function() {
  (0,min_dom__WEBPACK_IMPORTED_MODULE_1__.classes)(this._paletteEntry).add('disabled');

  this._eventBus.fire(_util_EventHelper__WEBPACK_IMPORTED_MODULE_0__.RESET_SIMULATION_EVENT);
};

ResetSimulation.$inject = [
  'eventBus',
  'tokenSimulationPalette',
  'notifications'
];

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/reset-simulation/index.js":
/*!**************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/reset-simulation/index.js ***!
  \**************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ResetSimulation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ResetSimulation */ "./node_modules/bpmn-js-token-simulation/lib/features/reset-simulation/ResetSimulation.js");
/* harmony import */ var _notifications__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../notifications */ "./node_modules/bpmn-js-token-simulation/lib/features/notifications/index.js");




/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  __depends__: [
    _notifications__WEBPACK_IMPORTED_MODULE_0__.default
  ],
  __init__: [
    'resetSimulation'
  ],
  resetSimulation: [ 'type', _ResetSimulation__WEBPACK_IMPORTED_MODULE_1__.default ]
});

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/scope-filter/ScopeFilter.js":
/*!****************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/scope-filter/ScopeFilter.js ***!
  \****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ScopeFilter)
/* harmony export */ });
/* harmony import */ var _util_EventHelper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../util/EventHelper */ "./node_modules/bpmn-js-token-simulation/lib/util/EventHelper.js");


const DEFAULT_SCOPE_FILTER = (s) => true;


function ScopeFilter(eventBus, simulator) {
  this._eventBus = eventBus;
  this._simulator = simulator;

  this._filter = DEFAULT_SCOPE_FILTER;

  eventBus.on([
    _util_EventHelper__WEBPACK_IMPORTED_MODULE_0__.TOGGLE_MODE_EVENT,
    _util_EventHelper__WEBPACK_IMPORTED_MODULE_0__.RESET_SIMULATION_EVENT
  ], () => {
    this._filter = DEFAULT_SCOPE_FILTER;
  });

  eventBus.on(_util_EventHelper__WEBPACK_IMPORTED_MODULE_0__.SCOPE_DESTROYED_EVENT, event => {

    const {
      scope
    } = event;

    // if we're currently filtering, ensure newly
    // created instance is shown

    if (this._scope === scope && scope.parent) {
      this.toggle(scope.parent);
    }
  });


  eventBus.on(_util_EventHelper__WEBPACK_IMPORTED_MODULE_0__.SCOPE_CREATE_EVENT, event => {

    const {
      scope
    } = event;

    // if we're currently filtering, ensure newly
    // created instance is shown

    if (!scope.parent && this._scope && !isAncestor(this._scope, scope)) {
      this.toggle(null);
    }
  });
}

ScopeFilter.prototype.toggle = function(scope) {

  const setFilter = this._scope !== scope;

  this._scope = setFilter ? scope : null;

  this._filter =
    this._scope
      ? s => isAncestor(this._scope, s)
      : s => true;

  this._eventBus.fire(_util_EventHelper__WEBPACK_IMPORTED_MODULE_0__.SCOPE_FILTER_CHANGED_EVENT, {
    filter: this._filter,
    scope: this._scope
  });
};

ScopeFilter.prototype.isShown = function(scope) {

  if (typeof scope === 'string') {
    scope = this._simulator.findScope(s => s.id === scope);
  }

  return scope && this._filter(scope);
};

ScopeFilter.prototype.findScope = function(options) {
  return this._simulator.findScopes(options).filter(s => this.isShown(s))[0];
};

ScopeFilter.$inject = [
  'eventBus',
  'simulator'
];

function isAncestor(parent, scope) {
  do {
    if (parent === scope) {
      return true;
    }
  } while ((scope = scope.parent));

  return false;
}

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/scope-filter/index.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/scope-filter/index.js ***!
  \**********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ScopeFilter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ScopeFilter */ "./node_modules/bpmn-js-token-simulation/lib/features/scope-filter/ScopeFilter.js");


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  scopeFilter: [ 'type', _ScopeFilter__WEBPACK_IMPORTED_MODULE_0__.default ]
});

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/set-animation-speed/SetAnimationSpeed.js":
/*!*****************************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/set-animation-speed/SetAnimationSpeed.js ***!
  \*****************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SetAnimationSpeed)
/* harmony export */ });
/* harmony import */ var min_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! min-dom */ "./node_modules/min-dom/dist/index.esm.js");
/* harmony import */ var _util_EventHelper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../util/EventHelper */ "./node_modules/bpmn-js-token-simulation/lib/util/EventHelper.js");
/* harmony import */ var _icons__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../icons */ "./node_modules/bpmn-js-token-simulation/lib/icons/index.js");




const SPEEDS = [
  [ 'Slow', 0.5 ],
  [ 'Normal', 1 ],
  [ 'Fast', 2 ]
];




function SetAnimationSpeed(canvas, animation, eventBus) {
  this._canvas = canvas;
  this._animation = animation;
  this._eventBus = eventBus;

  this._init(animation.getAnimationSpeed());

  eventBus.on(_util_EventHelper__WEBPACK_IMPORTED_MODULE_0__.TOGGLE_MODE_EVENT, event => {
    const active = event.active;

    if (!active) {
      (0,min_dom__WEBPACK_IMPORTED_MODULE_1__.classes)(this._container).add('hidden');
    } else {
      (0,min_dom__WEBPACK_IMPORTED_MODULE_1__.classes)(this._container).remove('hidden');
    }
  });

  eventBus.on(_util_EventHelper__WEBPACK_IMPORTED_MODULE_0__.ANIMATION_SPEED_CHANGED_EVENT, event => {
    this.setActive(event.speed);
  });
}

SetAnimationSpeed.prototype.getToggleSpeed = function(element) {
  return parseFloat(element.dataset.speed);
};

SetAnimationSpeed.prototype._init = function(animationSpeed) {
  this._container = (0,min_dom__WEBPACK_IMPORTED_MODULE_1__.domify)(`
    <div class="set-animation-speed hidden">
      ${ (0,_icons__WEBPACK_IMPORTED_MODULE_2__.TachometerIcon)() }
      <div class="animation-speed-buttons">
        ${
          SPEEDS.map(([ label, speed ], idx) => `
            <button title="Set animation speed = ${ label }" data-speed="${ speed }" class="animation-speed-button ${speed === animationSpeed ? 'active' : ''}">
              ${
                Array.from({ length: idx + 1 }).map(
                  () => (0,_icons__WEBPACK_IMPORTED_MODULE_2__.AngleRightIcon)()
                ).join('')
              }
            </button>
          `).join('')
        }
      </div>
    </div>
  `);

  min_dom__WEBPACK_IMPORTED_MODULE_1__.delegate.bind(this._container, '[data-speed]', 'click', event => {

    const toggle = event.delegateTarget;

    const speed = this.getToggleSpeed(toggle);

    this._animation.setAnimationSpeed(speed);
  });

  this._canvas.getContainer().appendChild(this._container);
};

SetAnimationSpeed.prototype.setActive = function(speed) {
  (0,min_dom__WEBPACK_IMPORTED_MODULE_1__.queryAll)('[data-speed]', this._container).forEach(toggle => {

    const active = this.getToggleSpeed(toggle) === speed;

    (0,min_dom__WEBPACK_IMPORTED_MODULE_1__.classes)(toggle)[active ? 'add' : 'remove']('active');
  });
};

SetAnimationSpeed.$inject = [
  'canvas',
  'animation',
  'eventBus'
];


/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/set-animation-speed/index.js":
/*!*****************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/set-animation-speed/index.js ***!
  \*****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _SetAnimationSpeed__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SetAnimationSpeed */ "./node_modules/bpmn-js-token-simulation/lib/features/set-animation-speed/SetAnimationSpeed.js");


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  __init__: [
    'setAnimationSpeed'
  ],
  setAnimationSpeed: [ 'type', _SetAnimationSpeed__WEBPACK_IMPORTED_MODULE_0__.default ]
});

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/show-scopes/ShowScopes.js":
/*!**************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/show-scopes/ShowScopes.js ***!
  \**************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ShowScopes)
/* harmony export */ });
/* harmony import */ var min_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! min-dom */ "./node_modules/min-dom/dist/index.esm.js");
/* harmony import */ var _util_EventHelper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../util/EventHelper */ "./node_modules/bpmn-js-token-simulation/lib/util/EventHelper.js");




const FILL_COLOR = '--token-simulation-silver-base-97';
const STROKE_COLOR = '--token-simulation-green-base-44';


function ShowScopes(
    eventBus,
    canvas,
    scopeFilter,
    elementColors,
    simulationStyles) {

  this._eventBus = eventBus;
  this._canvas = canvas;
  this._scopeFilter = scopeFilter;
  this._elementColors = elementColors;
  this._simulationStyles = simulationStyles;

  this._highlight = null;

  this._init();

  eventBus.on(_util_EventHelper__WEBPACK_IMPORTED_MODULE_0__.TOGGLE_MODE_EVENT, event => {
    const active = event.active;

    if (active) {
      (0,min_dom__WEBPACK_IMPORTED_MODULE_1__.classes)(this._container).remove('hidden');
    } else {
      (0,min_dom__WEBPACK_IMPORTED_MODULE_1__.classes)(this._container).add('hidden');
      (0,min_dom__WEBPACK_IMPORTED_MODULE_1__.clear)(this._container);

      this.unhighlightScope();
    }
  });

  eventBus.on(_util_EventHelper__WEBPACK_IMPORTED_MODULE_0__.SCOPE_FILTER_CHANGED_EVENT, event => {

    const allElements = this.getScopeElements();

    for (const element of allElements) {
      const scopeId = element.dataset.scopeId;

      (0,min_dom__WEBPACK_IMPORTED_MODULE_1__.classes)(element).toggle('inactive', !this._scopeFilter.isShown(scopeId));
    }
  });

  eventBus.on(_util_EventHelper__WEBPACK_IMPORTED_MODULE_0__.SCOPE_CREATE_EVENT, event => {
    this.addScope(event.scope);
  });

  eventBus.on(_util_EventHelper__WEBPACK_IMPORTED_MODULE_0__.SCOPE_DESTROYED_EVENT, event => {
    this.removeScope(event.scope);
  });

  eventBus.on(_util_EventHelper__WEBPACK_IMPORTED_MODULE_0__.SCOPE_CHANGED_EVENT, event => {
    this.updateScope(event.scope);
  });

  eventBus.on(_util_EventHelper__WEBPACK_IMPORTED_MODULE_0__.RESET_SIMULATION_EVENT, () => {
    this.removeAllInstances();
  });
}

ShowScopes.prototype._init = function() {
  this._container = (0,min_dom__WEBPACK_IMPORTED_MODULE_1__.domify)('<div class="token-simulation-scopes hidden"></div>');

  this._canvas.getContainer().appendChild(this._container);
};

ShowScopes.prototype.addScope = function(scope) {

  const processElements = [
    'bpmn:Process',
    'bpmn:SubProcess',
    'bpmn:Participant'
  ];

  const {
    element: scopeElement
  } = scope;

  if (!processElements.includes(scopeElement.type)) {
    return;
  }

  const colors = scope.colors;

  const colorMarkup = colors ? `style="color: ${colors.auxiliary}; background: ${colors.primary}"` : '';

  const html = (0,min_dom__WEBPACK_IMPORTED_MODULE_1__.domify)(`
    <div data-scope-id="${scope.id}" class="scope"
         title="View Process Instance ${scope.id}" ${colorMarkup}>
      ${scope.getTokens()}
    </div>
  `);

  min_dom__WEBPACK_IMPORTED_MODULE_1__.event.bind(html, 'click', () => {
    this._scopeFilter.toggle(scope);
  });

  min_dom__WEBPACK_IMPORTED_MODULE_1__.event.bind(html, 'mouseenter', () => {
    this.highlightScope(scopeElement);
  });

  min_dom__WEBPACK_IMPORTED_MODULE_1__.event.bind(html, 'mouseleave', () => {
    this.unhighlightScope();
  });

  if (!this._scopeFilter.isShown(scope)) {
    (0,min_dom__WEBPACK_IMPORTED_MODULE_1__.classes)(html).add('inactive');
  }

  this._container.appendChild(html);
};

ShowScopes.prototype.getScopeElements = function() {
  return (0,min_dom__WEBPACK_IMPORTED_MODULE_1__.queryAll)('[data-scope-id]', this._container);
};

ShowScopes.prototype.getScopeElement = function(scope) {
  return (0,min_dom__WEBPACK_IMPORTED_MODULE_1__.query)(`[data-scope-id="${scope.id}"]`, this._container);
};

ShowScopes.prototype.updateScope = function(scope) {
  const element = this.getScopeElement(scope);

  if (element) {
    element.textContent = scope.getTokens();
  }
};

ShowScopes.prototype.removeScope = function(scope) {
  const element = this.getScopeElement(scope);

  if (element) {
    element.remove();
  }
};

ShowScopes.prototype.removeAllInstances = function() {
  this._container.innerHTML = '';
};

ShowScopes.prototype.highlightScope = function(element) {

  this.unhighlightScope();

  this._highlight = {
    element,
    colors: this._elementColors.get(element)
  };

  this._elementColors.set(element, this._getHighlightColors());

  if (!element.parent) {
    (0,min_dom__WEBPACK_IMPORTED_MODULE_1__.classes)(this._canvas.getContainer()).add('highlight');
  }
};

ShowScopes.prototype.unhighlightScope = function() {

  if (!this._highlight) {
    return;
  }

  const {
    element,
    colors
  } = this._highlight;

  this._elementColors.set(element, colors);

  if (!element.parent) {
    (0,min_dom__WEBPACK_IMPORTED_MODULE_1__.classes)(this._canvas.getContainer()).remove('highlight');
  }

  this._highlight = null;
};

ShowScopes.prototype._getHighlightColors = function() {
  return {
    fill: this._simulationStyles.get(FILL_COLOR),
    stroke: this._simulationStyles.get(STROKE_COLOR)
  };
};

ShowScopes.$inject = [
  'eventBus',
  'canvas',
  'scopeFilter',
  'elementColors',
  'simulationStyles'
];

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/show-scopes/index.js":
/*!*********************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/show-scopes/index.js ***!
  \*********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ShowScopes__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ShowScopes */ "./node_modules/bpmn-js-token-simulation/lib/features/show-scopes/ShowScopes.js");
/* harmony import */ var _scope_filter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../scope-filter */ "./node_modules/bpmn-js-token-simulation/lib/features/scope-filter/index.js");
/* harmony import */ var _simulation_styles__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../simulation-styles */ "./node_modules/bpmn-js-token-simulation/lib/features/simulation-styles/index.js");





/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  __depends__: [
    _scope_filter__WEBPACK_IMPORTED_MODULE_0__.default,
    _simulation_styles__WEBPACK_IMPORTED_MODULE_1__.default
  ],
  __init__: [
    'showScopes'
  ],
  showScopes: [ 'type', _ShowScopes__WEBPACK_IMPORTED_MODULE_2__.default ]
});

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/simulation-state/SimulationState.js":
/*!************************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/simulation-state/SimulationState.js ***!
  \************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SimulationState)
/* harmony export */ });
/* harmony import */ var _util_EventHelper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../util/EventHelper */ "./node_modules/bpmn-js-token-simulation/lib/util/EventHelper.js");
/* harmony import */ var _icons__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../icons */ "./node_modules/bpmn-js-token-simulation/lib/icons/index.js");





function SimulationState(
    eventBus,
    simulator,
    elementNotifications) {

  eventBus.on(_util_EventHelper__WEBPACK_IMPORTED_MODULE_0__.SCOPE_DESTROYED_EVENT, event => {
    const {
      scope
    } = event;

    const {
      destroyContext,
      element: scopeElement
    } = scope;

    const {
      element,
      reason
    } = destroyContext;

    if (reason !== 'complete') {
      return;
    }

    const processScopes = [
      'bpmn:Process',
      'bpmn:Participant'
    ];

    if (!processScopes.includes(scopeElement.type)) {
      return;
    }

    elementNotifications.addElementNotification(element, {
      type: 'success',
      icon: (0,_icons__WEBPACK_IMPORTED_MODULE_1__.CheckCircleIcon)(),
      text: 'Finished',
      scope
    });
  });
}

SimulationState.$inject = [
  'eventBus',
  'simulator',
  'elementNotifications'
];

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/simulation-state/index.js":
/*!**************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/simulation-state/index.js ***!
  \**************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _SimulationState__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./SimulationState */ "./node_modules/bpmn-js-token-simulation/lib/features/simulation-state/SimulationState.js");
/* harmony import */ var _element_notifications__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../element-notifications */ "./node_modules/bpmn-js-token-simulation/lib/features/element-notifications/index.js");
/* harmony import */ var _notifications__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../notifications */ "./node_modules/bpmn-js-token-simulation/lib/features/notifications/index.js");





/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  __depends__: [
    _element_notifications__WEBPACK_IMPORTED_MODULE_0__.default,
    _notifications__WEBPACK_IMPORTED_MODULE_1__.default
  ],
  __init__: [
    'simulationState'
  ],
  simulationState: [ 'type', _SimulationState__WEBPACK_IMPORTED_MODULE_2__.default ]
});

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/simulation-styles/SimulationStyles.js":
/*!**************************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/simulation-styles/SimulationStyles.js ***!
  \**************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SimulationStyles)
/* harmony export */ });
function SimulationStyles() {
  this._cache = {};
}

SimulationStyles.$inject = [];


SimulationStyles.prototype.get = function(prop) {

  const cachedValue = this._cache[prop];

  if (cachedValue) {
    return cachedValue;
  }

  if (!this._computedStyle) {
    this._computedStyle = this._getComputedStyle();
  }

  return this._cache[prop] = this._computedStyle.getPropertyValue(prop).trim();
};

SimulationStyles.prototype._getComputedStyle = function() {

  const get = typeof getComputedStyle === 'function'
    ? getComputedStyle
    : getComputedStyleMock;

  const element = typeof document !== 'undefined'
    ? document.documentElement
    : {};

  return get(element);
};


// helpers //////////////////

function getComputedStyleMock() {
  return {
    getPropertyValue() {
      return '';
    }
  };
}

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/simulation-styles/index.js":
/*!***************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/simulation-styles/index.js ***!
  \***************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _SimulationStyles__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SimulationStyles */ "./node_modules/bpmn-js-token-simulation/lib/features/simulation-styles/SimulationStyles.js");


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  simulationStyles: [ 'type', _SimulationStyles__WEBPACK_IMPORTED_MODULE_0__.default ]
});

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/toggle-mode/modeler/ToggleMode.js":
/*!**********************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/toggle-mode/modeler/ToggleMode.js ***!
  \**********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ToggleMode)
/* harmony export */ });
/* harmony import */ var min_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! min-dom */ "./node_modules/min-dom/dist/index.esm.js");
/* harmony import */ var _util_EventHelper__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../util/EventHelper */ "./node_modules/bpmn-js-token-simulation/lib/util/EventHelper.js");
/* harmony import */ var _icons__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../icons */ "./node_modules/bpmn-js-token-simulation/lib/icons/index.js");







function ToggleMode(
    eventBus, canvas, selection,
    contextPad) {

  this._eventBus = eventBus;
  this._canvas = canvas;
  this._selection = selection;
  this._contextPad = contextPad;

  this._active = false;

  eventBus.on('import.parse.start', () => {

    if (this._active) {
      this.toggleMode(false);

      eventBus.once('import.done', () => {
        this.toggleMode(true);
      });
    }
  });

  eventBus.on('diagram.init', () => {
    this._canvasParent = this._canvas.getContainer().parentNode;
    this._palette = (0,min_dom__WEBPACK_IMPORTED_MODULE_0__.query)('.djs-palette', this._canvas.getContainer());

    this._init();
  });
}

ToggleMode.prototype._init = function() {
  this._container = (0,min_dom__WEBPACK_IMPORTED_MODULE_0__.domify)(`
    <div class="toggle-mode">
      Token Simulation <span class="toggle">${ (0,_icons__WEBPACK_IMPORTED_MODULE_1__.ToggleOffIcon)() }</span>
    </div>
  `);

  min_dom__WEBPACK_IMPORTED_MODULE_0__.event.bind(this._container, 'click', () => this.toggleMode());

  this._canvas.getContainer().appendChild(this._container);
};

ToggleMode.prototype.toggleMode = function(active = !this._active) {

  if (active === this._active) {
    return;
  }

  if (active) {
    this._container.innerHTML = `Token Simulation <span class="toggle">${ (0,_icons__WEBPACK_IMPORTED_MODULE_1__.ToggleOnIcon)() }</span>`;

    (0,min_dom__WEBPACK_IMPORTED_MODULE_0__.classes)(this._canvasParent).add('simulation');
    (0,min_dom__WEBPACK_IMPORTED_MODULE_0__.classes)(this._palette).add('hidden');
  } else {
    this._container.innerHTML = `Token Simulation <span class="toggle">${ (0,_icons__WEBPACK_IMPORTED_MODULE_1__.ToggleOffIcon)() }</span>`;

    (0,min_dom__WEBPACK_IMPORTED_MODULE_0__.classes)(this._canvasParent).remove('simulation');
    (0,min_dom__WEBPACK_IMPORTED_MODULE_0__.classes)(this._palette).remove('hidden');

    const elements = this._selection.get();

    if (elements.length === 1) {
      this._contextPad.open(elements[0]);
    }
  }

  this._eventBus.fire(_util_EventHelper__WEBPACK_IMPORTED_MODULE_2__.TOGGLE_MODE_EVENT, {
    active
  });

  this._active = active;
};

ToggleMode.$inject = [
  'eventBus',
  'canvas',
  'selection',
  'contextPad'
];

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/toggle-mode/modeler/index.js":
/*!*****************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/toggle-mode/modeler/index.js ***!
  \*****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ToggleMode__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ToggleMode */ "./node_modules/bpmn-js-token-simulation/lib/features/toggle-mode/modeler/ToggleMode.js");


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  __init__: [
    'toggleMode'
  ],
  toggleMode: [ 'type', _ToggleMode__WEBPACK_IMPORTED_MODULE_0__.default ]
});

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/token-count/TokenCount.js":
/*!**************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/token-count/TokenCount.js ***!
  \**************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TokenCount)
/* harmony export */ });
/* harmony import */ var min_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! min-dom */ "./node_modules/min-dom/dist/index.esm.js");
/* harmony import */ var _util_ElementHelper__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../util/ElementHelper */ "./node_modules/bpmn-js-token-simulation/lib/util/ElementHelper.js");
/* harmony import */ var _util_EventHelper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../util/EventHelper */ "./node_modules/bpmn-js-token-simulation/lib/util/EventHelper.js");







const OFFSET_BOTTOM = 10;
const OFFSET_LEFT = -15;

const LOW_PRIORITY = 500;

const DEFAULT_PRIMARY_COLOR = '--token-simulation-green-base-44';
const DEFAULT_AUXILIARY_COLOR = '--token-simulation-white';


function TokenCount(
    eventBus, overlays,
    simulator, scopeFilter,
    simulationStyles) {

  this._overlays = overlays;
  this._scopeFilter = scopeFilter;
  this._simulator = simulator;
  this._simulationStyles = simulationStyles;

  this.overlayIds = {};

  eventBus.on(_util_EventHelper__WEBPACK_IMPORTED_MODULE_0__.ELEMENT_CHANGED_EVENT, LOW_PRIORITY, event => {

    const {
      element
    } = event;

    this.removeTokenCounts(element);
    this.addTokenCounts(element);
  });

  eventBus.on(_util_EventHelper__WEBPACK_IMPORTED_MODULE_0__.SCOPE_FILTER_CHANGED_EVENT, event => {

    const allElements = (0,min_dom__WEBPACK_IMPORTED_MODULE_1__.queryAll)('.token-count[data-scope-id]', overlays._overlayRoot);

    for (const element of allElements) {
      const scopeId = element.dataset.scopeId;

      (0,min_dom__WEBPACK_IMPORTED_MODULE_1__.classes)(element).toggle('inactive', !this._scopeFilter.isShown(scopeId));
    }
  });
}

TokenCount.prototype.addTokenCounts = function(element) {

  if ((0,_util_ElementHelper__WEBPACK_IMPORTED_MODULE_2__.is)(element, 'bpmn:MessageFlow') || (0,_util_ElementHelper__WEBPACK_IMPORTED_MODULE_2__.is)(element, 'bpmn:SequenceFlow')) {
    return;
  }

  const scopes = this._simulator.findScopes(scope => {
    return (
      !scope.destroyed &&
      scope.children.some(c => !c.destroyed && c.element === element && !c.children.length)
    );
  });

  this.addTokenCount(element, scopes);
};

TokenCount.prototype.addTokenCount = function(element, scopes) {
  if (!scopes.length) {
    return;
  }

  const tokenMarkup = scopes.map(scope => {
    return this._getTokenHTML(element, scope);
  }).join('');

  const html = (0,min_dom__WEBPACK_IMPORTED_MODULE_1__.domify)(`
    <div class="token-count-parent">
      ${tokenMarkup}
    </div>
  `);

  const position = { bottom: OFFSET_BOTTOM, left: OFFSET_LEFT };

  const overlayId = this._overlays.add(element, 'token-count', {
    position: position,
    html: html,
    show: {
      minZoom: 0.5
    }
  });

  this.overlayIds[element.id] = overlayId;
};

TokenCount.prototype.removeTokenCounts = function(element) {
  this.removeTokenCount(element);
};

TokenCount.prototype.removeTokenCount = function(element) {
  const overlayId = this.overlayIds[element.id];

  if (!overlayId) {
    return;
  }

  this._overlays.remove(overlayId);

  delete this.overlayIds[element.id];
};

TokenCount.prototype._getTokenHTML = function(element, scope) {

  const colors = scope.colors || this._getDefaultColors();

  return `
    <div data-scope-id="${scope.id}" class="token-count waiting ${this._scopeFilter.isShown(scope) ? '' : 'inactive' }"
         style="color: ${colors.auxiliary}; background: ${ colors.primary }">
      ${scope.getTokensByElement(element)}
    </div>
  `;
};

TokenCount.prototype._getDefaultColors = function() {
  return {
    primary: this._simulationStyles.get(DEFAULT_PRIMARY_COLOR),
    auxiliary: this._simuationStyles.get(DEFAULT_AUXILIARY_COLOR)
  };
};

TokenCount.$inject = [
  'eventBus',
  'overlays',
  'simulator',
  'scopeFilter',
  'simulationStyles'
];

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/features/token-count/index.js":
/*!*********************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/features/token-count/index.js ***!
  \*********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _TokenCount__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./TokenCount */ "./node_modules/bpmn-js-token-simulation/lib/features/token-count/TokenCount.js");
/* harmony import */ var _scope_filter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../scope-filter */ "./node_modules/bpmn-js-token-simulation/lib/features/scope-filter/index.js");
/* harmony import */ var _simulation_styles__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../simulation-styles */ "./node_modules/bpmn-js-token-simulation/lib/features/simulation-styles/index.js");





/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  __depends__: [
    _scope_filter__WEBPACK_IMPORTED_MODULE_0__.default,
    _simulation_styles__WEBPACK_IMPORTED_MODULE_1__.default
  ],
  __init__: [
    'tokenCount'
  ],
  tokenCount: [ 'type', _TokenCount__WEBPACK_IMPORTED_MODULE_2__.default ]
});

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/icons/index.js":
/*!******************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/icons/index.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AngleRightIcon": () => (/* binding */ AngleRightIcon),
/* harmony export */   "CheckCircleIcon": () => (/* binding */ CheckCircleIcon),
/* harmony export */   "ExclamationTriangleIcon": () => (/* binding */ ExclamationTriangleIcon),
/* harmony export */   "ForkIcon": () => (/* binding */ ForkIcon),
/* harmony export */   "InfoIcon": () => (/* binding */ InfoIcon),
/* harmony export */   "LogIcon": () => (/* binding */ LogIcon),
/* harmony export */   "PauseIcon": () => (/* binding */ PauseIcon),
/* harmony export */   "PlayIcon": () => (/* binding */ PlayIcon),
/* harmony export */   "RemovePauseIcon": () => (/* binding */ RemovePauseIcon),
/* harmony export */   "ResetIcon": () => (/* binding */ ResetIcon),
/* harmony export */   "TachometerIcon": () => (/* binding */ TachometerIcon),
/* harmony export */   "TimesCircleIcon": () => (/* binding */ TimesCircleIcon),
/* harmony export */   "TimesIcon": () => (/* binding */ TimesIcon),
/* harmony export */   "ToggleOffIcon": () => (/* binding */ ToggleOffIcon),
/* harmony export */   "ToggleOnIcon": () => (/* binding */ ToggleOnIcon)
/* harmony export */ });
var LogSVG = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 448 512\"><!-- Font Awesome Free 5.15.4 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) --><path fill=\"currentColor\" d=\"M12.83 352h262.34A12.82 12.82 0 0 0 288 339.17v-38.34A12.82 12.82 0 0 0 275.17 288H12.83A12.82 12.82 0 0 0 0 300.83v38.34A12.82 12.82 0 0 0 12.83 352zm0-256h262.34A12.82 12.82 0 0 0 288 83.17V44.83A12.82 12.82 0 0 0 275.17 32H12.83A12.82 12.82 0 0 0 0 44.83v38.34A12.82 12.82 0 0 0 12.83 96zM432 160H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm0 256H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16z\"/></svg>";

var AngleRightSVG = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 512\"><!-- Font Awesome Free 5.15.4 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) --><path fill=\"currentColor\" d=\"M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z\"/></svg>";

var CheckCircleSVG = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\"><!-- Font Awesome Free 5.15.4 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) --><path fill=\"currentColor\" d=\"M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z\"/></svg>";

var ForkSVG = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 384 512\"><!-- Font Awesome Free 5.15.4 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) --><path fill=\"currentColor\" d=\"M384 144c0-44.2-35.8-80-80-80s-80 35.8-80 80c0 36.4 24.3 67.1 57.5 76.8-.6 16.1-4.2 28.5-11 36.9-15.4 19.2-49.3 22.4-85.2 25.7-28.2 2.6-57.4 5.4-81.3 16.9v-144c32.5-10.2 56-40.5 56-76.3 0-44.2-35.8-80-80-80S0 35.8 0 80c0 35.8 23.5 66.1 56 76.3v199.3C23.5 365.9 0 396.2 0 432c0 44.2 35.8 80 80 80s80-35.8 80-80c0-34-21.2-63.1-51.2-74.6 3.1-5.2 7.8-9.8 14.9-13.4 16.2-8.2 40.4-10.4 66.1-12.8 42.2-3.9 90-8.4 118.2-43.4 14-17.4 21.1-39.8 21.6-67.9 31.6-10.8 54.4-40.7 54.4-75.9zM80 64c8.8 0 16 7.2 16 16s-7.2 16-16 16-16-7.2-16-16 7.2-16 16-16zm0 384c-8.8 0-16-7.2-16-16s7.2-16 16-16 16 7.2 16 16-7.2 16-16 16zm224-320c8.8 0 16 7.2 16 16s-7.2 16-16 16-16-7.2-16-16 7.2-16 16-16z\"/></svg>";

var ExclamationTriangleSVG = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 576 512\"><!-- Font Awesome Free 5.15.4 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) --><path fill=\"currentColor\" d=\"M569.517 440.013C587.975 472.007 564.806 512 527.94 512H48.054c-36.937 0-59.999-40.055-41.577-71.987L246.423 23.985c18.467-32.009 64.72-31.951 83.154 0l239.94 416.028zM288 354c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z\"/></svg>";

var InfoSVG = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 192 512\"><!-- Font Awesome Free 5.15.4 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) --><path fill=\"currentColor\" d=\"M20 424.229h20V279.771H20c-11.046 0-20-8.954-20-20V212c0-11.046 8.954-20 20-20h112c11.046 0 20 8.954 20 20v212.229h20c11.046 0 20 8.954 20 20V492c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20v-47.771c0-11.046 8.954-20 20-20zM96 0C56.235 0 24 32.235 24 72s32.235 72 72 72 72-32.235 72-72S135.764 0 96 0z\"/></svg>";

var PauseSVG = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 448 512\"><!-- Font Awesome Free 5.15.4 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) --><path fill=\"currentColor\" d=\"M144 479H48c-26.5 0-48-21.5-48-48V79c0-26.5 21.5-48 48-48h96c26.5 0 48 21.5 48 48v352c0 26.5-21.5 48-48 48zm304-48V79c0-26.5-21.5-48-48-48h-96c-26.5 0-48 21.5-48 48v352c0 26.5 21.5 48 48 48h96c26.5 0 48-21.5 48-48z\"/></svg>";

var RemovePauseSVG = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 580.5 448\">\n  <path fill=\"currentColor\" d=\"M112 0C85 0 64 22 64 48v196l192-89V48c0-26-22-48-48-48zm256 0c-27 0-48 22-48 48v77l190-89c-5-21-24-36-46-36Zm144 105-192 89v70l192-89zM256 224 64 314v70l192-90zm256 21-192 89v66c0 27 21 48 48 48h96c26 0 48-21 48-48zM256 364 89 442c7 4 14 6 23 6h96c26 0 48-21 48-48z\"/>\n  <rect fill=\"currentColor\" width=\"63.3\" height=\"618.2\" x=\"311.5\" y=\"-469.4\" transform=\"rotate(65)\" rx=\"10\"/>\n</svg>\n";

var PlaySVG = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 448 512\"><!-- Adapted from Font Awesome Free 5.15.4 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) --><path fill=\"currentColor\" d=\"M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z\"/></svg>";

var ResetSVG = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\"><!-- Font Awesome Free 5.15.4 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) --><path fill=\"currentColor\" d=\"M440.65 12.57l4 82.77A247.16 247.16 0 0 0 255.83 8C134.73 8 33.91 94.92 12.29 209.82A12 12 0 0 0 24.09 224h49.05a12 12 0 0 0 11.67-9.26 175.91 175.91 0 0 1 317-56.94l-101.46-4.86a12 12 0 0 0-12.57 12v47.41a12 12 0 0 0 12 12H500a12 12 0 0 0 12-12V12a12 12 0 0 0-12-12h-47.37a12 12 0 0 0-11.98 12.57zM255.83 432a175.61 175.61 0 0 1-146-77.8l101.8 4.87a12 12 0 0 0 12.57-12v-47.4a12 12 0 0 0-12-12H12a12 12 0 0 0-12 12V500a12 12 0 0 0 12 12h47.35a12 12 0 0 0 12-12.6l-4.15-82.57A247.17 247.17 0 0 0 255.83 504c121.11 0 221.93-86.92 243.55-201.82a12 12 0 0 0-11.8-14.18h-49.05a12 12 0 0 0-11.67 9.26A175.86 175.86 0 0 1 255.83 432z\"/></svg>";

var TachometerSVG = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 576 512\"><!-- Font Awesome Free 5.15.4 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) --><path fill=\"currentColor\" d=\"M288 32C128.94 32 0 160.94 0 320c0 52.8 14.25 102.26 39.06 144.8 5.61 9.62 16.3 15.2 27.44 15.2h443c11.14 0 21.83-5.58 27.44-15.2C561.75 422.26 576 372.8 576 320c0-159.06-128.94-288-288-288zm0 64c14.71 0 26.58 10.13 30.32 23.65-1.11 2.26-2.64 4.23-3.45 6.67l-9.22 27.67c-5.13 3.49-10.97 6.01-17.64 6.01-17.67 0-32-14.33-32-32S270.33 96 288 96zM96 384c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32 32zm48-160c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32 32zm246.77-72.41l-61.33 184C343.13 347.33 352 364.54 352 384c0 11.72-3.38 22.55-8.88 32H232.88c-5.5-9.45-8.88-20.28-8.88-32 0-33.94 26.5-61.43 59.9-63.59l61.34-184.01c4.17-12.56 17.73-19.45 30.36-15.17 12.57 4.19 19.35 17.79 15.17 30.36zm14.66 57.2l15.52-46.55c3.47-1.29 7.13-2.23 11.05-2.23 17.67 0 32 14.33 32 32s-14.33 32-32 32c-11.38-.01-20.89-6.28-26.57-15.22zM480 384c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32 32z\"/></svg>";

var TimesCircleSVG = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\"><!-- Font Awesome Free 5.15.4 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) --><path fill=\"currentColor\" d=\"M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm121.6 313.1c4.7 4.7 4.7 12.3 0 17L338 377.6c-4.7 4.7-12.3 4.7-17 0L256 312l-65.1 65.6c-4.7 4.7-12.3 4.7-17 0L134.4 338c-4.7-4.7-4.7-12.3 0-17l65.6-65-65.6-65.1c-4.7-4.7-4.7-12.3 0-17l39.6-39.6c4.7-4.7 12.3-4.7 17 0l65 65.7 65.1-65.6c4.7-4.7 12.3-4.7 17 0l39.6 39.6c4.7 4.7 4.7 12.3 0 17L312 256l65.6 65.1z\"/></svg>";

var TimesSVG = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 352 512\"><!-- Font Awesome Free 5.15.4 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) --><path fill=\"currentColor\" d=\"M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z\"/></svg>";

var ToggleOffSVG = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 576 512\"><!-- Font Awesome Free 5.15.4 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) --><path fill=\"currentColor\" d=\"M384 64H192C85.961 64 0 149.961 0 256s85.961 192 192 192h192c106.039 0 192-85.961 192-192S490.039 64 384 64zM64 256c0-70.741 57.249-128 128-128 70.741 0 128 57.249 128 128 0 70.741-57.249 128-128 128-70.741 0-128-57.249-128-128zm320 128h-48.905c65.217-72.858 65.236-183.12 0-256H384c70.741 0 128 57.249 128 128 0 70.74-57.249 128-128 128z\"/></svg>";

var ToggleOnSVG = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 576 512\"><!-- Font Awesome Free 5.15.4 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) --><path fill=\"currentColor\" d=\"M384 64H192C86 64 0 150 0 256s86 192 192 192h192c106 0 192-86 192-192S490 64 384 64zm0 320c-70.8 0-128-57.3-128-128 0-70.8 57.3-128 128-128 70.8 0 128 57.3 128 128 0 70.8-57.3 128-128 128z\"/></svg>";

function createIcon(svg) {
  return function Icon(className = '') {
    return `<span class="bts-icon ${ className }">${svg}</span>`;
  };
}

const LogIcon = createIcon(LogSVG);
const AngleRightIcon = createIcon(AngleRightSVG);
const CheckCircleIcon = createIcon(CheckCircleSVG);
const RemovePauseIcon = createIcon(RemovePauseSVG);
const ForkIcon = createIcon(ForkSVG);
const ExclamationTriangleIcon = createIcon(ExclamationTriangleSVG);
const InfoIcon = createIcon(InfoSVG);
const PauseIcon = createIcon(PauseSVG);
const PlayIcon = createIcon(PlaySVG);
const ResetIcon = createIcon(ResetSVG);
const TachometerIcon = createIcon(TachometerSVG);
const TimesCircleIcon = createIcon(TimesCircleSVG);
const TimesIcon = createIcon(TimesSVG);
const ToggleOffIcon = createIcon(ToggleOffSVG);
const ToggleOnIcon = createIcon(ToggleOnSVG);




/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/modeler.js":
/*!**************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/modeler.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base */ "./node_modules/bpmn-js-token-simulation/lib/base.js");
/* harmony import */ var _features_disable_modeling__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./features/disable-modeling */ "./node_modules/bpmn-js-token-simulation/lib/features/disable-modeling/index.js");
/* harmony import */ var _features_toggle_mode_modeler__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./features/toggle-mode/modeler */ "./node_modules/bpmn-js-token-simulation/lib/features/toggle-mode/modeler/index.js");
/* harmony import */ var _features_editor_actions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./features/editor-actions */ "./node_modules/bpmn-js-token-simulation/lib/features/editor-actions/index.js");
/* harmony import */ var _features_keyboard_bindings__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./features/keyboard-bindings */ "./node_modules/bpmn-js-token-simulation/lib/features/keyboard-bindings/index.js");







/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  __depends__: [
    _base__WEBPACK_IMPORTED_MODULE_0__.default,
    _features_disable_modeling__WEBPACK_IMPORTED_MODULE_1__.default,
    _features_toggle_mode_modeler__WEBPACK_IMPORTED_MODULE_2__.default,
    _features_editor_actions__WEBPACK_IMPORTED_MODULE_3__.default,
    _features_keyboard_bindings__WEBPACK_IMPORTED_MODULE_4__.default
  ]
});

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/simulator/Simulator.js":
/*!**************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/simulator/Simulator.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Simulator)
/* harmony export */ });
/* harmony import */ var ids__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ids */ "./node_modules/ids/dist/index.esm.js");



function Simulator(injector, eventBus) {

  const ids = new ids__WEBPACK_IMPORTED_MODULE_0__.default([ 32, 36 ]);

  // element configuration
  const configuration = {};

  const behaviors = {};

  const scopes = [];

  const noopBehavior = new NoopBehavior();

  const jobs = [];

  const changedElements = new Set();


  on('tick', function() {
    for (const element of changedElements) {
      emit('elementChanged', {
        element
      });
    }

    changedElements.clear();
  });

  function queue(scope, task) {

    // add this task
    jobs.push([ task, scope ]);

    if (jobs.length !== 1) {
      return;
    }

    let next;

    while ((next = jobs[0])) {

      const [ task, scope ] = next;

      if (!scope.destroyed) {
        task();
      }

      // remove first task
      jobs.shift();
    }

    emit('tick');
  }

  function getBehavior(element) {
    return behaviors[element.type] || noopBehavior;
  }

  function signal(context) {

    const {
      element,
      parentScope,
      initiator
    } = context;

    const scope = context.scope || createScope(element, parentScope, initiator && initiator.element);

    queue(scope, function() {

      trace('signal', {
        ...context,
        scope
      });

      getBehavior(element).signal({
        ...context,
        scope
      });

      if (scope.parent) {
        scopeChanged(scope.parent);
      }
    });

    return scope;
  }

  function enter(context) {

    const {
      element,
      scope: parentScope
    } = context;

    const scope = createScope(element, parentScope, element);

    queue(scope, function() {
      trace('enter', context);

      getBehavior(element).enter({
        ...context,
        scope
      });

      scopeChanged(parentScope);
    });

    return scope;
  }

  function exit(context) {

    const {
      element,
      scope,
      initiator = {
        element,
        scope
      }
    } = context;

    queue(scope, function() {

      trace('exit', context);

      getBehavior(element).exit(context);

      destroyScope(scope, {
        ...initiator,
        reason: 'complete'
      });

      scope.parent && scopeChanged(scope.parent);
    });
  }

  function createScope(element, parentScope=null, initiator=null) {

    trace('createScope', {
      element,
      scope: parentScope
    });

    const scope = {
      id: ids.next(),
      element,
      children: [],
      interrupted: false,
      destroyed: false,
      initiator,
      parent: parentScope,
      getTokens() {
        return this.children.filter(c => !c.destroyed).length;
      },
      getTokensByElement(element) {
        return this.children.filter(c => !c.destroyed && c.element === element).length;
      }
    };

    if (parentScope) {
      parentScope.children.push(scope);
    }

    scopes.push(scope);

    emit('createScope', {
      scope
    });

    elementChanged(element);

    if (parentScope) {
      elementChanged(parentScope.element);
    }

    return scope;
  }

  function scopeFilter(filter) {

    if (typeof filter === 'function') {
      return filter;
    }

    const {
      element,
      waitsOnElement,
      parent,
      destroyed = false
    } = filter;

    return (
      scope =>
        (!element || scope.element === element) &&
        (!parent || scope.parent === parent) &&
        (!waitsOnElement || scope.getTokensByElement(waitsOnElement) > 0) &&
        (destroyed === !!scope.destroyed)
    );
  }

  function findScopes(filter) {
    return scopes.filter(scopeFilter(filter));
  }

  function findScope(filter) {
    return scopes.find(scopeFilter(filter));
  }

  const noneContext = Object.freeze({
    element: null,
    scope: null,
    reason: 'cancel'
  });

  function destroyScope(scope, context=noneContext) {

    if (scope.destroyed) {
      return;
    }

    [ 'element', 'scope', 'reason' ].forEach(property => {
      if (!(property in context)) {
        throw new Error(`no <context.${property}> provided`);
      }
    });

    for (const childScope of scope.children) {
      if (!childScope.destroyed) {
        destroyScope(childScope, {
          ...context,
          reason: 'cancel'
        });
      }
    }

    trace('destroyScope', {
      element: scope.element,
      scope
    });

    scope.destroyContext = context;

    scope.destroyed = true;

    elementChanged(scope.element);

    if (scope.parent) {
      elementChanged(scope.parent.element);
    }

    emit('destroyScope', {
      scope
    });
  }

  function trace(action, context) {

    emit('trace', {
      ...context,
      action
    });
  }

  function elementChanged(element) {
    changedElements.add(element);

    // tick, unless jobs are queued
    // (and tick is going to happen naturally)
    if (!jobs.length) {
      emit('tick');
    }
  }

  function scopeChanged(scope) {
    emit('scopeChanged', {
      scope
    });
  }

  function emit(event, payload={}) {
    return eventBus.fire(`tokenSimulation.simulator.${event}`, payload);
  }

  function on(event, callback) {
    eventBus.on('tokenSimulation.simulator.' + event, callback);
  }

  function off(event, callback) {
    eventBus.off('tokenSimulation.simulator.' + event, callback);
  }

  function setConfig(element, updatedConfig) {

    const existingConfig = getConfig(element);

    configuration[element.id || element] = {
      ...existingConfig,
      ...updatedConfig
    };

    elementChanged(element);
  }

  function getConfig(element) {
    return configuration[element.id || element] || {};
  }

  function waitAtElement(element, wait=true) {
    setConfig(element, {
      wait
    });
  }

  function reset() {
    for (const scope of scopes) {
      destroyScope(scope);
    }

    scopes.length = 0;

    // TODO(nikku): clear configuration?

    emit('tick');
    emit('reset');
  }

  this.waitAtElement = waitAtElement;

  this.createScope = createScope;
  this.destroyScope = destroyScope;

  this.findScope = findScope;
  this.findScopes = findScopes;

  this.setConfig = setConfig;
  this.getConfig = getConfig;

  this.signal = signal;
  this.enter = enter;
  this.exit = exit;

  this.reset = reset;

  this.on = on;
  this.off = off;

  this.registerBehavior = function(element, behavior) {
    behaviors[element] = behavior;
  };
}

Simulator.$inject = [ 'injector', 'eventBus' ];


// helpers /////////////////

function NoopBehavior() {

  this.signal = function(context) {
    console.log('ignored #exit', context.element);
  };

  this.exit = function(context) {
    console.log('ignored #exit', context.element);
  };

  this.enter = function(context) {
    console.log('ignored #enter', context.element);
  };

}

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/simulator/behaviors/ActivityBehavior.js":
/*!*******************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/simulator/behaviors/ActivityBehavior.js ***!
  \*******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ActivityBehavior)
/* harmony export */ });
/* harmony import */ var _ModelUtil__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ModelUtil */ "./node_modules/bpmn-js-token-simulation/lib/simulator/behaviors/ModelUtil.js");



function ActivityBehavior(simulator, scopeBehavior) {
  this._simulator = simulator;
  this._scopeBehavior = scopeBehavior;

  const elements = [
    'bpmn:BusinessRuleTask',
    'bpmn:CallActivity',
    'bpmn:ManualTask',
    'bpmn:ScriptTask',
    'bpmn:SendTask',
    'bpmn:ServiceTask',
    'bpmn:Task',
    'bpmn:UserTask'
  ];

  for (const element of elements) {
    simulator.registerBehavior(element, this);
  }
}

ActivityBehavior.prototype.signal = function(context) {

  const {
    initiator,
    element
  } = context;

  const initiatingFlow = initiator && initiator.element;

  // if signaled by a message flow,
  // check for the next message flows to either
  // trigger or wait for; this implements intuitive,
  // as-you-would expect message flow execution in modeling
  // direction (left-to-right).
  if ((0,_ModelUtil__WEBPACK_IMPORTED_MODULE_0__.isMessageFlow)(initiatingFlow)) {

    const referencePoint = last(initiatingFlow.waypoints);

    const messageContexts = this._getMessageContexts(element, referencePoint);

    // trigger messages that are pending send
    const allProcessed = this._triggerMessages(context, messageContexts);

    if (!allProcessed) {
      return;
    }
  }

  this._simulator.exit(context);
};

ActivityBehavior.prototype.enter = function(context) {

  const {
    element
  } = context;

  const wait = this._waitsAtElement(element);

  const messageContexts = this._getMessageContexts(element);

  if (wait || messageContexts[0] && messageContexts[0].incoming) {
    return;
  }

  // trigger messages that are pending send
  const allProcessed = this._triggerMessages(context, messageContexts);

  if (!allProcessed) {
    return;
  }

  this._simulator.exit(context);
};

ActivityBehavior.prototype.exit = function(context) {

  const {
    element,
    scope
  } = context;

  if (scope.interrupted) {
    return;
  }

  // TODO(nikku): if a outgoing flow is conditional,
  //              task has exclusive gateway semantics,
  //              else, task has parallel gateway semantics

  const parentScope = scope.parent;

  let sequenceFlowTaken = false;

  for (const outgoingFlow of element.outgoing) {

    if (!(0,_ModelUtil__WEBPACK_IMPORTED_MODULE_0__.isSequenceFlow)(outgoingFlow)) {
      continue;
    }

    this._simulator.enter({
      element: outgoingFlow,
      scope: parentScope
    });

    sequenceFlowTaken = true;
  }

  // element has token sink semantics
  if (!sequenceFlowTaken) {
    this._scopeBehavior.tryExit(scope.parent, {
      element,
      scope
    });
  }
};

ActivityBehavior.prototype._waitsAtElement = function(element) {
  return this._simulator.getConfig(element).wait;
};

ActivityBehavior.prototype._getMessageContexts = function(element, after=null) {

  const filterAfter = after ? ctx => ctx.referencePoint.x > after.x : () => true;
  const sortByReference = (a, b) => a.referencePoint.x - b.referencePoint.x;

  return [
    ...element.incoming.filter(_ModelUtil__WEBPACK_IMPORTED_MODULE_0__.isMessageFlow).map(flow => ({
      incoming: flow,
      referencePoint: last(flow.waypoints)
    })),
    ...element.outgoing.filter(_ModelUtil__WEBPACK_IMPORTED_MODULE_0__.isMessageFlow).map(flow => ({
      outgoing: flow,
      referencePoint: first(flow.waypoints)
    }))
  ].sort(sortByReference).filter(filterAfter);
};

/**
 * @param {any} context
 * @param {any[]} messageContexts
 *
 * @return {boolean} true if all message contexts got satisfied, i.e. messages sent
 */
ActivityBehavior.prototype._triggerMessages = function(context, messageContexts) {

  let i = 0;

  for (; i < messageContexts.length; i++) {
    let { outgoing } = messageContexts[i];

    if (!outgoing) {
      break;
    }

    this._simulator.signal({
      element: outgoing
    });
  }

  return !(i - messageContexts.length);
};

ActivityBehavior.$inject = [ 'simulator', 'scopeBehavior' ];


// helpers //////////////////

function first(arr) {
  return arr && arr[0];
}

function last(arr) {
  return arr && arr[arr.length - 1];
}

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/simulator/behaviors/BoundaryEventBehavior.js":
/*!************************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/simulator/behaviors/BoundaryEventBehavior.js ***!
  \************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ BoundaryEventBehavior)
/* harmony export */ });
/* harmony import */ var _ModelUtil__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ModelUtil */ "./node_modules/bpmn-js/lib/util/ModelUtil.js");



function BoundaryEventBehavior(
    simulator,
    activityBehavior,
    scopeBehavior) {

  this._simulator = simulator;
  this._activityBehavior = activityBehavior;
  this._scopeBehavior = scopeBehavior;

  simulator.registerBehavior('bpmn:BoundaryEvent', this);
}

BoundaryEventBehavior.prototype.signal = function(context) {

  const {
    element,
    scope
  } = context;

  const scopeElement = element.host;

  const cancelActivity = (0,_ModelUtil__WEBPACK_IMPORTED_MODULE_0__.getBusinessObject)(element).cancelActivity;

  if (cancelActivity) {

    const cancelScope = this._simulator.findScope({
      parent: scope.parent,
      element: scopeElement
    });

    if (!cancelScope) {
      throw new Error('cancel scope not found');
    }

    const initiator = {
      element,
      scope
    };

    this._scopeBehavior.interrupt(cancelScope, initiator);

    // attempt child scope exit
    // may fail if interrupting activities are still running
    this._scopeBehavior.tryExit(cancelScope, initiator);
  }

  this._simulator.exit(context);
};

BoundaryEventBehavior.prototype.exit = function(context) {
  this._activityBehavior.exit(context);
};

BoundaryEventBehavior.$inject = [
  'simulator',
  'activityBehavior',
  'scopeBehavior'
];

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/simulator/behaviors/EndEventBehavior.js":
/*!*******************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/simulator/behaviors/EndEventBehavior.js ***!
  \*******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ EndEventBehavior)
/* harmony export */ });
/* harmony import */ var _ModelUtil__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ModelUtil */ "./node_modules/bpmn-js-token-simulation/lib/simulator/behaviors/ModelUtil.js");



function EndEventBehavior(
    simulator,
    eventBehaviors,
    scopeBehavior) {

  this._simulator = simulator;
  this._eventBehaviors = eventBehaviors;
  this._scopeBehavior = scopeBehavior;

  simulator.registerBehavior('bpmn:EndEvent', this);
}

EndEventBehavior.prototype.enter = function(context) {

  const {
    element
  } = context;

  const eventBehavior = this._eventBehaviors.get(element);

  if (eventBehavior) {
    eventBehavior(context);
  }

  for (const outgoing of element.outgoing) {
    if ((0,_ModelUtil__WEBPACK_IMPORTED_MODULE_0__.isMessageFlow)(outgoing)) {
      this._simulator.signal({
        element: outgoing
      });
    }
  }

  this._simulator.exit(context);
};

EndEventBehavior.prototype.exit = function(context) {

  const {
    element,
    scope
  } = context;

  const initiator = {
    element,
    scope
  };

  const {
    parent: parentScope
  } = scope;

  if ((0,_ModelUtil__WEBPACK_IMPORTED_MODULE_0__.isTerminate)(element)) {
    this._scopeBehavior.terminate(parentScope, initiator);
  }

  this._scopeBehavior.tryExit(parentScope, initiator);
};

EndEventBehavior.$inject = [
  'simulator',
  'eventBehaviors',
  'scopeBehavior'
];

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/simulator/behaviors/EventBasedGatewayBehavior.js":
/*!****************************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/simulator/behaviors/EventBasedGatewayBehavior.js ***!
  \****************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ EventBasedGatewayBehavior)
/* harmony export */ });
function EventBasedGatewayBehavior(simulator) {
  this._simulator = simulator;

  simulator.registerBehavior('bpmn:EventBasedGateway', this);
}

EventBasedGatewayBehavior.prototype.enter = function(context) {

  // literally do nothing, catch event behavior will unstuck us
};

EventBasedGatewayBehavior.$inject = [
  'simulator'
];

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/simulator/behaviors/EventBehaviors.js":
/*!*****************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/simulator/behaviors/EventBehaviors.js ***!
  \*****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ EventBehaviors)
/* harmony export */ });
/* harmony import */ var _util_ElementHelper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../util/ElementHelper */ "./node_modules/bpmn-js-token-simulation/lib/util/ElementHelper.js");
/* harmony import */ var _util_ElementHelper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../util/ElementHelper */ "./node_modules/bpmn-js/lib/util/ModelUtil.js");



function EventBehaviors(
    simulator,
    elementRegistry) {

  this._simulator = simulator;
  this._elementRegistry = elementRegistry;
}

EventBehaviors.prototype.get = function(element) {

  const behaviors = {
    'bpmn:LinkEventDefinition': (context) => {

      const {
        element,
        scope
      } = context;

      const {
        parent: parentScope
      } = scope;

      const eventDefinition = (0,_util_ElementHelper__WEBPACK_IMPORTED_MODULE_0__.getEventDefinition)(element, 'bpmn:LinkEventDefinition');
      const name = eventDefinition.get('name');

      // HINT: links work only within the same process

      const triggerElements = this._elementRegistry.filter(e => {
        return (
          e.parent === element.parent &&
          (0,_util_ElementHelper__WEBPACK_IMPORTED_MODULE_0__.is)(e, 'bpmn:CatchEvent') &&
          (0,_util_ElementHelper__WEBPACK_IMPORTED_MODULE_0__.isTypedEvent)(e, 'bpmn:LinkEventDefinition') &&
          (0,_util_ElementHelper__WEBPACK_IMPORTED_MODULE_0__.getEventDefinition)(e, 'bpmn:LinkEventDefinition').get('name') === name
        );
      });

      for (const triggerElement of triggerElements) {
        this._simulator.enter({
          element: triggerElement,
          scope: parentScope
        });
      }
    },

    'bpmn:SignalEventDefinition': (context) => {

      const {
        element
      } = context;

      // HINT: signals work only within the whole diagram,
      //       triggers start events, boundary events and
      //       intermediate catch events

      const eventDefinition = (0,_util_ElementHelper__WEBPACK_IMPORTED_MODULE_0__.getEventDefinition)(element, 'bpmn:SignalEventDefinition');
      const signal = eventDefinition.get('signalRef');

      const triggerElements = this._elementRegistry.filter(e => {
        return (
          (0,_util_ElementHelper__WEBPACK_IMPORTED_MODULE_0__.is)(e, 'bpmn:CatchEvent') &&
          (0,_util_ElementHelper__WEBPACK_IMPORTED_MODULE_0__.isTypedEvent)(e, 'bpmn:SignalEventDefinition') &&
          (0,_util_ElementHelper__WEBPACK_IMPORTED_MODULE_0__.getEventDefinition)(e, 'bpmn:SignalEventDefinition').get('signalRef') === signal
        );
      });

      // trigger signal events for found elements
      const triggers = triggerElements.map(triggerElement => {

        // signal the following elements
        //
        //   * start events outside of sub-processes
        //   * start events in event sub-processes with active parent scope
        //   * intermediate events with active scope
        //   * boundary events with active scope waiting in host
        //
        if ((0,_util_ElementHelper__WEBPACK_IMPORTED_MODULE_0__.is)(triggerElement, 'bpmn:StartEvent')) {

          const triggerParent = triggerElement.parent;

          const startEvent = triggerElement;

          if ((0,_util_ElementHelper__WEBPACK_IMPORTED_MODULE_0__.is)(triggerParent, 'bpmn:SubProcess')) {

            // trigger event sub-processes only
            if ((0,_util_ElementHelper__WEBPACK_IMPORTED_MODULE_1__.getBusinessObject)(triggerParent).triggeredByEvent) {
              const parentScopes = this._simulator.findScopes({
                element: triggerParent.parent
              });

              // only trigger if parent scope exists
              return parentScopes.map(parentScope => () => this._simulator.signal({
                element: triggerParent,
                startEvent,
                parentScope
              }));
            }
          } else {
            return () => this._simulator.signal({
              element: triggerElement.parent,
              startEvent
            });
          }
        }

        if ((0,_util_ElementHelper__WEBPACK_IMPORTED_MODULE_0__.is)(triggerElement, 'bpmn:IntermediateCatchEvent')) {

          // (a) scope waiting at element will be signaled
          const eventSource = triggerElement.incoming.find(
            incoming => (0,_util_ElementHelper__WEBPACK_IMPORTED_MODULE_0__.is)(incoming.source, 'bpmn:EventBasedGateway')
          );

          const scopes = this._simulator.findScopes({
            element: eventSource && eventSource.source || triggerElement
          });

          return scopes.map(scope => () => this._simulator.signal({
            element: triggerElement,
            scope
          }));
        }

        if ((0,_util_ElementHelper__WEBPACK_IMPORTED_MODULE_0__.is)(triggerElement, 'bpmn:BoundaryEvent')) {
          const scopes = this._simulator.findScopes({
            element: triggerElement.host
          });

          return scopes.map(scope => () => this._simulator.signal({
            element: triggerElement,
            parentScope: scope.parent
          }));
        }

        // nothing to trigger
        return [];
      }).flat();

      for (const trigger of triggers) {
        if (trigger) {
          trigger();
        }
      }

    },

    'bpmn:EscalationEventDefinition': (context) => {

      const {
        element,
        scope
      } = context;

      // HINT: escalations are propagated up the scope
      //       chain and caught by the first matching boundary event
      //       or event sub-process

      const eventDefinition = (0,_util_ElementHelper__WEBPACK_IMPORTED_MODULE_0__.getEventDefinition)(element, 'bpmn:EscalationEventDefinition');
      const escalation = eventDefinition.get('escalationRef');

      let triggerElement, parentScope = scope.parent;

      do {

        // find event sub-process catching in scope
        triggerElement = parentScope.element.children.find(e => {
          return (0,_util_ElementHelper__WEBPACK_IMPORTED_MODULE_0__.is)(e, 'bpmn:SubProcess') && e.children.find(e => {
            return (
              (0,_util_ElementHelper__WEBPACK_IMPORTED_MODULE_0__.is)(e, 'bpmn:CatchEvent') &&
              (0,_util_ElementHelper__WEBPACK_IMPORTED_MODULE_0__.isTypedEvent)(e, 'bpmn:EscalationEventDefinition') &&
              (0,_util_ElementHelper__WEBPACK_IMPORTED_MODULE_0__.getEventDefinition)(e, 'bpmn:EscalationEventDefinition').get('escalationRef') === escalation
            );
          });
        }) || parentScope.element.attachers.find(e => {
          return (
            (0,_util_ElementHelper__WEBPACK_IMPORTED_MODULE_0__.is)(e, 'bpmn:CatchEvent') &&
            (0,_util_ElementHelper__WEBPACK_IMPORTED_MODULE_0__.isTypedEvent)(e, 'bpmn:EscalationEventDefinition') &&
            (0,_util_ElementHelper__WEBPACK_IMPORTED_MODULE_0__.getEventDefinition)(e, 'bpmn:EscalationEventDefinition').get('escalationRef') === escalation
          );
        });

      } while (!triggerElement && (parentScope = parentScope.parent));

      if (!triggerElement) {
        return;
      }

      if ((0,_util_ElementHelper__WEBPACK_IMPORTED_MODULE_0__.is)(triggerElement, 'bpmn:BoundaryEvent')) {
        parentScope = parentScope.parent;
      }

      this._simulator.signal({
        element: triggerElement,
        parentScope
      });
    },

    'bpmn:ErrorEventDefinition': (context) => {

      const {
        element,
        scope
      } = context;

      // HINT: errors are handled in current scope only (do not bubble)

      const eventDefinition = (0,_util_ElementHelper__WEBPACK_IMPORTED_MODULE_0__.getEventDefinition)(element, 'bpmn:ErrorEventDefinition');
      const error = eventDefinition.get('errorRef');

      let parentScope = scope.parent;

      // find catching event sub-process or boundary event
      const triggerElement = parentScope.element.children.find(e => {
        return (0,_util_ElementHelper__WEBPACK_IMPORTED_MODULE_0__.is)(e, 'bpmn:SubProcess') && e.children.find(e => {
          return (
            (0,_util_ElementHelper__WEBPACK_IMPORTED_MODULE_0__.is)(e, 'bpmn:StartEvent') &&
            (0,_util_ElementHelper__WEBPACK_IMPORTED_MODULE_0__.isTypedEvent)(e, 'bpmn:ErrorEventDefinition') &&
            (0,_util_ElementHelper__WEBPACK_IMPORTED_MODULE_0__.getEventDefinition)(e, 'bpmn:ErrorEventDefinition').get('errorRef') === error
          );
        });
      }) || parentScope.element.attachers.find(e => {
        return (
          (0,_util_ElementHelper__WEBPACK_IMPORTED_MODULE_0__.is)(e, 'bpmn:CatchEvent') &&
          (0,_util_ElementHelper__WEBPACK_IMPORTED_MODULE_0__.isTypedEvent)(e, 'bpmn:ErrorEventDefinition') &&
          (0,_util_ElementHelper__WEBPACK_IMPORTED_MODULE_0__.getEventDefinition)(e, 'bpmn:ErrorEventDefinition').get('errorRef') === error
        );
      });

      if (!triggerElement) {
        return;
      }

      if ((0,_util_ElementHelper__WEBPACK_IMPORTED_MODULE_0__.is)(triggerElement, 'bpmn:BoundaryEvent')) {
        parentScope = parentScope.parent;
      }

      // TODO(nikku): trigger same behavior if error boundary is signaled

      // TODO(nikku): error has interrupt semantics;
      // clear all active scopes

      this._simulator.signal({
        element: triggerElement,
        parentScope
      });
    }
  };

  const entry = Object.entries(behaviors).find(
    entry => (0,_util_ElementHelper__WEBPACK_IMPORTED_MODULE_0__.isTypedEvent)(element, entry[0])
  );

  return entry && entry[1];
};

EventBehaviors.$inject = [
  'simulator',
  'elementRegistry'
];

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/simulator/behaviors/ExclusiveGatewayBehavior.js":
/*!***************************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/simulator/behaviors/ExclusiveGatewayBehavior.js ***!
  \***************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ExclusiveGatewayBehavior)
/* harmony export */ });
/* harmony import */ var _ModelUtil__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ModelUtil */ "./node_modules/bpmn-js-token-simulation/lib/simulator/behaviors/ModelUtil.js");



function ExclusiveGatewayBehavior(simulator) {
  this._simulator = simulator;

  simulator.registerBehavior('bpmn:ExclusiveGateway', this);
}

ExclusiveGatewayBehavior.prototype.enter = function(context) {
  this._simulator.exit(context);
};

ExclusiveGatewayBehavior.prototype.exit = function(context) {

  const {
    element,
    scope
  } = context;

  // depends on UI to properly configure activeOutgoing for
  // each exclusive gateway

  const outgoings = (0,_ModelUtil__WEBPACK_IMPORTED_MODULE_0__.filterSequenceFlows)(element.outgoing);

  if (outgoings.length === 1) {
    return this._simulator.enter({
      element: outgoings[0],
      scope: scope.parent
    });
  }

  const {
    activeOutgoing
  } = this._simulator.getConfig(element);

  const outgoing = outgoings.find(o => o === activeOutgoing);

  if (!outgoing) {
    throw new Error('no outgoing configured');
  }

  return this._simulator.enter({
    element: outgoing,
    scope: scope.parent
  });
};

ExclusiveGatewayBehavior.$inject = [ 'simulator' ];

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/simulator/behaviors/IntermediateCatchEventBehavior.js":
/*!*********************************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/simulator/behaviors/IntermediateCatchEventBehavior.js ***!
  \*********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ IntermediateCatchEventBehavior)
/* harmony export */ });
/* harmony import */ var _ModelUtil__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ModelUtil */ "./node_modules/bpmn-js-token-simulation/lib/simulator/behaviors/ModelUtil.js");



function IntermediateCatchEventBehavior(
    simulator,
    activityBehavior) {

  this._activityBehavior = activityBehavior;
  this._simulator = simulator;

  simulator.registerBehavior('bpmn:IntermediateCatchEvent', this);
  simulator.registerBehavior('bpmn:ReceiveTask', this);
}

IntermediateCatchEventBehavior.prototype.signal = function(context) {
  this._simulator.exit(context);
};

IntermediateCatchEventBehavior.prototype.enter = function(context) {
  const {
    element
  } = context;

  if ((0,_ModelUtil__WEBPACK_IMPORTED_MODULE_0__.isLink)(element)) {
    this._simulator.exit(context);
  }
};

IntermediateCatchEventBehavior.prototype.exit = function(context) {
  this._activityBehavior.exit(context);
};

IntermediateCatchEventBehavior.$inject = [
  'simulator',
  'activityBehavior'
];

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/simulator/behaviors/IntermediateThrowEventBehavior.js":
/*!*********************************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/simulator/behaviors/IntermediateThrowEventBehavior.js ***!
  \*********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ IntermediateThrowEventBehavior)
/* harmony export */ });
function IntermediateThrowEventBehavior(
    simulator,
    activityBehavior,
    eventBehaviors) {

  this._simulator = simulator;
  this._activityBehavior = activityBehavior;
  this._eventBehaviors = eventBehaviors;

  simulator.registerBehavior('bpmn:IntermediateThrowEvent', this);
}

IntermediateThrowEventBehavior.prototype.enter = function(context) {
  const {
    element
  } = context;

  const eventBehavior = this._eventBehaviors.get(element);

  if (eventBehavior) {
    eventBehavior(context);
  }

  this._activityBehavior.enter(context);
};

IntermediateThrowEventBehavior.prototype.exit = function(context) {
  this._activityBehavior.exit(context);
};

IntermediateThrowEventBehavior.$inject = [
  'simulator',
  'activityBehavior',
  'eventBehaviors'
];

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/simulator/behaviors/MessageFlowBehavior.js":
/*!**********************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/simulator/behaviors/MessageFlowBehavior.js ***!
  \**********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ MessageFlowBehavior)
/* harmony export */ });
/* harmony import */ var _ModelUtil__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ModelUtil */ "./node_modules/bpmn-js/lib/util/ModelUtil.js");



function MessageFlowBehavior(simulator) {
  this._simulator = simulator;

  simulator.registerBehavior('bpmn:MessageFlow', this);
}

MessageFlowBehavior.prototype.signal = function(context) {
  this._simulator.exit(context);
};

MessageFlowBehavior.prototype.exit = function(context) {
  const {
    element,
    scope
  } = context;

  const target = element.target;

  // skip cosmetic flows that model generic,
  // undirected communication
  if ((0,_ModelUtil__WEBPACK_IMPORTED_MODULE_0__.is)(target, 'bpmn:Participant')) {
    return;
  }

  // (a) scope waiting at element will be signaled
  const eventSource = target.incoming.find(
    incoming => (0,_ModelUtil__WEBPACK_IMPORTED_MODULE_0__.is)(incoming.source, 'bpmn:EventBasedGateway')
  );

  const waitingScope = this._simulator.findScope({
    element: eventSource && eventSource.source || target
  });

  if (waitingScope) {
    this._simulator.signal({
      element: target,
      scope: waitingScope,
      initiator: {
        element,
        scope
      }
    });
  } else if ((0,_ModelUtil__WEBPACK_IMPORTED_MODULE_0__.is)(target, 'bpmn:StartEvent')) {
    this._simulator.signal({
      startEvent: target,
      element: target.parent,
      initiator: {
        element,
        scope
      }
    });
  } else {

    // (b) scope active with element => log message received at element
    const targetScope = this._simulator.findScope({
      element: target.parent
    });

    if (targetScope) {

      // TODO(nikku): log message received
    } else {

      // (c) no scope at target => message is just discarted
    }
  }
};

MessageFlowBehavior.$inject = [ 'simulator' ];

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/simulator/behaviors/ModelUtil.js":
/*!************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/simulator/behaviors/ModelUtil.js ***!
  \************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "is": () => (/* reexport safe */ bpmn_js_lib_util_ModelUtil__WEBPACK_IMPORTED_MODULE_0__.is),
/* harmony export */   "getBusinessObject": () => (/* reexport safe */ bpmn_js_lib_util_ModelUtil__WEBPACK_IMPORTED_MODULE_0__.getBusinessObject),
/* harmony export */   "filterSequenceFlows": () => (/* binding */ filterSequenceFlows),
/* harmony export */   "isMessageFlow": () => (/* binding */ isMessageFlow),
/* harmony export */   "isSequenceFlow": () => (/* binding */ isSequenceFlow),
/* harmony export */   "isTerminate": () => (/* binding */ isTerminate),
/* harmony export */   "isLink": () => (/* binding */ isLink),
/* harmony export */   "isEventSubProcess": () => (/* binding */ isEventSubProcess)
/* harmony export */ });
/* harmony import */ var bpmn_js_lib_util_ModelUtil__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! bpmn-js/lib/util/ModelUtil */ "./node_modules/bpmn-js/lib/util/ModelUtil.js");




function filterSequenceFlows(flows) {
  return flows.filter(f => (0,bpmn_js_lib_util_ModelUtil__WEBPACK_IMPORTED_MODULE_0__.is)(f, 'bpmn:SequenceFlow'));
}

function isMessageFlow(element) {
  return (0,bpmn_js_lib_util_ModelUtil__WEBPACK_IMPORTED_MODULE_0__.is)(element, 'bpmn:MessageFlow');
}

function isSequenceFlow(element) {
  return (0,bpmn_js_lib_util_ModelUtil__WEBPACK_IMPORTED_MODULE_0__.is)(element, 'bpmn:SequenceFlow');
}

function isTerminate(element) {
  return ((0,bpmn_js_lib_util_ModelUtil__WEBPACK_IMPORTED_MODULE_0__.getBusinessObject)(element).eventDefinitions || []).find(definition => {
    return (0,bpmn_js_lib_util_ModelUtil__WEBPACK_IMPORTED_MODULE_0__.is)(definition, 'bpmn:TerminateEventDefinition');
  });
}

function isLink(element) {
  return ((0,bpmn_js_lib_util_ModelUtil__WEBPACK_IMPORTED_MODULE_0__.getBusinessObject)(element).eventDefinitions || []).find(definition => {
    return (0,bpmn_js_lib_util_ModelUtil__WEBPACK_IMPORTED_MODULE_0__.is)(definition, 'bpmn:LinkEventDefinition');
  });
}

function isEventSubProcess(element) {
  return (0,bpmn_js_lib_util_ModelUtil__WEBPACK_IMPORTED_MODULE_0__.getBusinessObject)(element).triggeredByEvent;
}

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/simulator/behaviors/ParallelGatewayBehavior.js":
/*!**************************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/simulator/behaviors/ParallelGatewayBehavior.js ***!
  \**************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ParallelGatewayBehavior)
/* harmony export */ });
/* harmony import */ var _ModelUtil__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ModelUtil */ "./node_modules/bpmn-js-token-simulation/lib/simulator/behaviors/ModelUtil.js");



function ParallelGatewayBehavior(
    simulator,
    activityBehavior) {

  this._simulator = simulator;
  this._activityBehavior = activityBehavior;

  simulator.registerBehavior('bpmn:ParallelGateway', this);
}

ParallelGatewayBehavior.prototype.enter = function(context) {

  const {
    scope,
    element
  } = context;

  const sequenceFlows = (0,_ModelUtil__WEBPACK_IMPORTED_MODULE_0__.filterSequenceFlows)(element.incoming);

  const {
    parent: parentScope
  } = scope;

  const elementScopes = parentScope.children.filter(c => !c.destroyed && c.element === element);

  if (elementScopes.length === sequenceFlows.length) {

    for (const childScope of elementScopes) {

      if (childScope !== scope) {
        this._simulator.destroyScope(childScope, {
          scope,
          element,
          reason: 'join'
        });
      }
    }

    this._simulator.exit(context);
  }
};

ParallelGatewayBehavior.prototype.exit = function(context) {
  this._activityBehavior.exit(context);
};

ParallelGatewayBehavior.$inject = [
  'simulator',
  'activityBehavior'
];

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/simulator/behaviors/ProcessBehavior.js":
/*!******************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/simulator/behaviors/ProcessBehavior.js ***!
  \******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ProcessBehavior)
/* harmony export */ });
/* harmony import */ var _ModelUtil__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ModelUtil */ "./node_modules/bpmn-js/lib/util/ModelUtil.js");



function ProcessBehavior(
    simulator,
    scopeBehavior) {

  this._simulator = simulator;
  this._scopeBehavior = scopeBehavior;

  simulator.registerBehavior('bpmn:Process', this);
  simulator.registerBehavior('bpmn:Participant', this);
}

ProcessBehavior.prototype.signal = function(context) {

  const {
    element,
    startEvent = findProcessStart(element),
    scope
  } = context;

  if (!startEvent) {
    throw new Error('missing <startEvent>');
  }

  this._simulator.signal({
    element: startEvent,
    parentScope: scope
  });
};

ProcessBehavior.prototype.exit = function(context) {

  const {
    scope,
    initiator
  } = context;

  // ensure that all sub-scopes are destroyed

  this._scopeBehavior.destroyChildren(scope, initiator);
};


ProcessBehavior.$inject = [
  'simulator',
  'scopeBehavior'
];


// helpers //////////////////

function findProcessStart(element) {
  return element.children.find(child => (0,_ModelUtil__WEBPACK_IMPORTED_MODULE_0__.is)(child, 'bpmn:StartEvent'));
}

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/simulator/behaviors/ScopeBehavior.js":
/*!****************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/simulator/behaviors/ScopeBehavior.js ***!
  \****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ScopeBehavior)
/* harmony export */ });
/* harmony import */ var _ModelUtil__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ModelUtil */ "./node_modules/bpmn-js-token-simulation/lib/simulator/behaviors/ModelUtil.js");
/* harmony import */ var _ModelUtil__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ModelUtil */ "./node_modules/bpmn-js/lib/util/ModelUtil.js");



function ScopeBehavior(simulator) {
  this._simulator = simulator;
}

ScopeBehavior.prototype.isFinished = function(scope, excludeScope=null) {
  return scope.children.every(c => c === excludeScope || c.destroyed);
};

ScopeBehavior.prototype.destroyChildren = function(scope, initiator) {

  for (const childScope of scope.children) {

    if (childScope.destroyed) {
      continue;
    }

    this._simulator.destroyScope(childScope, {
      reason: 'cancel',
      ...initiator
    });
  }
};

ScopeBehavior.prototype.enter = function(context) {

  const {
    element,
    scope,
    parentScope
  } = context;

  const {
    parent: parentElement
  } = element;

  // trigger event sub-process
  if ((0,_ModelUtil__WEBPACK_IMPORTED_MODULE_0__.isEventSubProcess)(parentElement)) {

    if (!parentScope) {
      throw new Error('missing <parentScope>');
    }

    // if we're interrupting, clear all non-interrupting
    // child scopes, remove all tokens and re-add tokens
    // to all interrupting child scopes
    if (isInterrupting(element)) {
      parentScope.interrupting = true;

      this.interrupt(parentScope.parent, {
        element,
        scope
      });
    }
  }
};

ScopeBehavior.prototype.terminate = function(scope, initiator) {

  // mark as interrupted
  scope.interrupted = true;

  // kill all but initiating child scopes
  for (const childScope of scope.children) {

    if (childScope.destroyed || childScope === initiator.scope) {
      continue;
    }

    this._simulator.destroyScope(childScope, {
      reason: 'cancel',
      ...initiator
    });
  }
};

ScopeBehavior.prototype.interrupt = function(scope, initiator) {

  // mark as interrupted
  scope.interrupted = true;

  // kill non-interrupting child scopes
  for (const childScope of scope.children) {

    if (childScope.destroyed || childScope.interrupting) {
      continue;
    }

    this._simulator.destroyScope(childScope, {
      reason: 'cancel',
      ...initiator
    });
  }
};

ScopeBehavior.prototype.tryExit = function(scope, initiator) {
  if (!scope) {
    throw new Error('missing <scope>');
  }

  if (!initiator) {
    throw new Error('missing <initiator>');
  }

  if (!this.isFinished(scope, initiator.scope)) {
    return;
  }

  this.exit({
    scope,
    initiator
  });
};

ScopeBehavior.prototype.exit = function(context) {

  const {
    scope,
    initiator
  } = context;

  if (!initiator) {
    throw new Error('missing <initiator>');
  }

  this._simulator.exit({
    element: scope.element,
    scope: scope,
    initiator
  });
};

ScopeBehavior.$inject = [
  'simulator'
];


// helpers ////////////////

function isInterrupting(element) {
  return (0,_ModelUtil__WEBPACK_IMPORTED_MODULE_1__.getBusinessObject)(element).isInterrupting;
}

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/simulator/behaviors/SequenceFlowBehavior.js":
/*!***********************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/simulator/behaviors/SequenceFlowBehavior.js ***!
  \***********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SequenceFlowBehavior)
/* harmony export */ });
function SequenceFlowBehavior(
    simulator,
    scopeBehavior) {

  this._simulator = simulator;
  this._scopeBehavior = scopeBehavior;

  simulator.registerBehavior('bpmn:SequenceFlow', this);
}

SequenceFlowBehavior.prototype.enter = function(context) {
  this._simulator.exit(context);
};

SequenceFlowBehavior.prototype.exit = function(context) {
  const {
    element,
    scope
  } = context;

  this._simulator.enter({
    element: element.target,
    scope: scope.parent
  });
};

SequenceFlowBehavior.$inject = [
  'simulator',
  'scopeBehavior'
];

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/simulator/behaviors/StartEventBehavior.js":
/*!*********************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/simulator/behaviors/StartEventBehavior.js ***!
  \*********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ StartEventBehavior)
/* harmony export */ });
function StartEventBehavior(
    simulator,
    activityBehavior,
    scopeBehavior) {

  this._simulator = simulator;
  this._activityBehavior = activityBehavior;
  this._scopeBehavior = scopeBehavior;

  simulator.registerBehavior('bpmn:StartEvent', this);
}

StartEventBehavior.prototype.signal = function(context) {

  const {
    parentScope
  } = context;

  if (!parentScope) {
    throw new Error('missing <parentScope>');
  }

  this._scopeBehavior.enter(context);

  this._simulator.exit(context);
};

StartEventBehavior.prototype.exit = function(context) {
  this._activityBehavior.exit(context);
};

StartEventBehavior.$inject = [
  'simulator',
  'activityBehavior',
  'scopeBehavior'
];

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/simulator/behaviors/SubProcessBehavior.js":
/*!*********************************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/simulator/behaviors/SubProcessBehavior.js ***!
  \*********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SubProcessBehavior)
/* harmony export */ });
/* harmony import */ var _ModelUtil__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ModelUtil */ "./node_modules/bpmn-js/lib/util/ModelUtil.js");



function SubProcessBehavior(
    simulator,
    activityBehavior,
    scopeBehavior) {

  this._simulator = simulator;
  this._activityBehavior = activityBehavior;
  this._scopeBehavior = scopeBehavior;

  simulator.registerBehavior('bpmn:SubProcess', this);
  simulator.registerBehavior('bpmn:Transaction', this);
  simulator.registerBehavior('bpmn:AdHocSubProcess', this);
}

SubProcessBehavior.prototype.signal = function(context) {
  const {
    element,
    startEvent = findSubProcessStart(element),
    scope
  } = context;

  if (!startEvent) {
    throw new Error('missing <startEvent>');
  }

  this._simulator.signal({
    element: startEvent,
    parentScope: scope
  });
};

SubProcessBehavior.prototype.enter = function(context) {

  const {
    element
  } = context;

  var wait = this._waitsAtElement(element);

  if (wait) {
    return;
  }

  this.signal(context);
};

SubProcessBehavior.prototype.exit = function(context) {

  const {
    scope,
    initiator
  } = context;

  this._activityBehavior.exit(context);

  const {
    parent: scopeParent
  } = scope;

  this._scopeBehavior.tryExit(scopeParent, {
    ...initiator,
    scope
  });
};

SubProcessBehavior.prototype._waitsAtElement = function(element) {
  return this._simulator.getConfig(element).wait;
};

SubProcessBehavior.$inject = [
  'simulator',
  'activityBehavior',
  'scopeBehavior'
];


// helpers //////////////////

function findSubProcessStart(element) {
  return element.children.find(child => (0,_ModelUtil__WEBPACK_IMPORTED_MODULE_0__.is)(child, 'bpmn:StartEvent'));
}

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/simulator/behaviors/index.js":
/*!********************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/simulator/behaviors/index.js ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _StartEventBehavior__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./StartEventBehavior */ "./node_modules/bpmn-js-token-simulation/lib/simulator/behaviors/StartEventBehavior.js");
/* harmony import */ var _EndEventBehavior__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./EndEventBehavior */ "./node_modules/bpmn-js-token-simulation/lib/simulator/behaviors/EndEventBehavior.js");
/* harmony import */ var _BoundaryEventBehavior__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./BoundaryEventBehavior */ "./node_modules/bpmn-js-token-simulation/lib/simulator/behaviors/BoundaryEventBehavior.js");
/* harmony import */ var _IntermediateCatchEventBehavior__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./IntermediateCatchEventBehavior */ "./node_modules/bpmn-js-token-simulation/lib/simulator/behaviors/IntermediateCatchEventBehavior.js");
/* harmony import */ var _IntermediateThrowEventBehavior__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./IntermediateThrowEventBehavior */ "./node_modules/bpmn-js-token-simulation/lib/simulator/behaviors/IntermediateThrowEventBehavior.js");
/* harmony import */ var _ExclusiveGatewayBehavior__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./ExclusiveGatewayBehavior */ "./node_modules/bpmn-js-token-simulation/lib/simulator/behaviors/ExclusiveGatewayBehavior.js");
/* harmony import */ var _ParallelGatewayBehavior__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./ParallelGatewayBehavior */ "./node_modules/bpmn-js-token-simulation/lib/simulator/behaviors/ParallelGatewayBehavior.js");
/* harmony import */ var _EventBasedGatewayBehavior__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./EventBasedGatewayBehavior */ "./node_modules/bpmn-js-token-simulation/lib/simulator/behaviors/EventBasedGatewayBehavior.js");
/* harmony import */ var _ActivityBehavior__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./ActivityBehavior */ "./node_modules/bpmn-js-token-simulation/lib/simulator/behaviors/ActivityBehavior.js");
/* harmony import */ var _SubProcessBehavior__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./SubProcessBehavior */ "./node_modules/bpmn-js-token-simulation/lib/simulator/behaviors/SubProcessBehavior.js");
/* harmony import */ var _SequenceFlowBehavior__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./SequenceFlowBehavior */ "./node_modules/bpmn-js-token-simulation/lib/simulator/behaviors/SequenceFlowBehavior.js");
/* harmony import */ var _MessageFlowBehavior__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./MessageFlowBehavior */ "./node_modules/bpmn-js-token-simulation/lib/simulator/behaviors/MessageFlowBehavior.js");
/* harmony import */ var _EventBehaviors__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./EventBehaviors */ "./node_modules/bpmn-js-token-simulation/lib/simulator/behaviors/EventBehaviors.js");
/* harmony import */ var _ScopeBehavior__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./ScopeBehavior */ "./node_modules/bpmn-js-token-simulation/lib/simulator/behaviors/ScopeBehavior.js");
/* harmony import */ var _ProcessBehavior__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./ProcessBehavior */ "./node_modules/bpmn-js-token-simulation/lib/simulator/behaviors/ProcessBehavior.js");






















/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  __init__: [
    'startEventBehavior',
    'endEventBehavior',
    'boundaryEventBehavior',
    'intermediateCatchEventBehavior',
    'intermediateThrowEventBehavior',
    'exclusiveGatewayBehavior',
    'parallelGatewayBehavior',
    'eventBasedGatewayBehavior',
    'subProcessBehavior',
    'sequenceFlowBehavior',
    'messageFlowBehavior',
    'processBehavior'
  ],
  startEventBehavior: [ 'type', _StartEventBehavior__WEBPACK_IMPORTED_MODULE_0__.default ],
  endEventBehavior: [ 'type', _EndEventBehavior__WEBPACK_IMPORTED_MODULE_1__.default ],
  boundaryEventBehavior: [ 'type', _BoundaryEventBehavior__WEBPACK_IMPORTED_MODULE_2__.default ],
  intermediateCatchEventBehavior: [ 'type', _IntermediateCatchEventBehavior__WEBPACK_IMPORTED_MODULE_3__.default ],
  intermediateThrowEventBehavior: [ 'type', _IntermediateThrowEventBehavior__WEBPACK_IMPORTED_MODULE_4__.default ],
  exclusiveGatewayBehavior: [ 'type', _ExclusiveGatewayBehavior__WEBPACK_IMPORTED_MODULE_5__.default ],
  parallelGatewayBehavior: [ 'type', _ParallelGatewayBehavior__WEBPACK_IMPORTED_MODULE_6__.default ],
  eventBasedGatewayBehavior: [ 'type', _EventBasedGatewayBehavior__WEBPACK_IMPORTED_MODULE_7__.default ],
  activityBehavior: [ 'type', _ActivityBehavior__WEBPACK_IMPORTED_MODULE_8__.default ],
  subProcessBehavior: [ 'type', _SubProcessBehavior__WEBPACK_IMPORTED_MODULE_9__.default ],
  sequenceFlowBehavior: [ 'type', _SequenceFlowBehavior__WEBPACK_IMPORTED_MODULE_10__.default ],
  messageFlowBehavior: [ 'type', _MessageFlowBehavior__WEBPACK_IMPORTED_MODULE_11__.default ],
  eventBehaviors: [ 'type', _EventBehaviors__WEBPACK_IMPORTED_MODULE_12__.default ],
  scopeBehavior: [ 'type', _ScopeBehavior__WEBPACK_IMPORTED_MODULE_13__.default ],
  processBehavior: [ 'type', _ProcessBehavior__WEBPACK_IMPORTED_MODULE_14__.default ]
});

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/simulator/index.js":
/*!**********************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/simulator/index.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Simulator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Simulator */ "./node_modules/bpmn-js-token-simulation/lib/simulator/Simulator.js");
/* harmony import */ var _behaviors__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./behaviors */ "./node_modules/bpmn-js-token-simulation/lib/simulator/behaviors/index.js");



const HIGH_PRIORITY = 5000;

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  __depends__: [
    _behaviors__WEBPACK_IMPORTED_MODULE_0__.default
  ],
  __init__: [
    [ 'eventBus', 'simulator', function(eventBus, simulator) {
      eventBus.on('tokenSimulation.toggleMode', HIGH_PRIORITY, event => {
        if (!event.active) {
          simulator.reset();
        }
      });

      eventBus.on('tokenSimulation.resetSimulation', HIGH_PRIORITY, event => {
        simulator.reset();
      });
    } ]
  ],
  simulator: [ 'type', _Simulator__WEBPACK_IMPORTED_MODULE_1__.default ]
});

/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/util/ElementHelper.js":
/*!*************************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/util/ElementHelper.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "is": () => (/* binding */ is),
/* harmony export */   "getEventDefinition": () => (/* binding */ getEventDefinition),
/* harmony export */   "isTypedEvent": () => (/* binding */ isTypedEvent),
/* harmony export */   "getBusinessObject": () => (/* reexport safe */ bpmn_js_lib_util_ModelUtil__WEBPACK_IMPORTED_MODULE_0__.getBusinessObject)
/* harmony export */ });
/* harmony import */ var min_dash__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! min-dash */ "./node_modules/min-dash/dist/index.esm.js");
/* harmony import */ var bpmn_js_lib_util_ModelUtil__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! bpmn-js/lib/util/ModelUtil */ "./node_modules/bpmn-js/lib/util/ModelUtil.js");




function is(element, types) {
  if (element.type === 'label') {
    return false;
  }

  if (!Array.isArray(types)) {
    types = [ types ];
  }

  return types.some(function(type) {
    return (0,bpmn_js_lib_util_ModelUtil__WEBPACK_IMPORTED_MODULE_0__.is)(element, type);
  });
}

function getEventDefinition(event, eventDefinitionType) {
  return (0,min_dash__WEBPACK_IMPORTED_MODULE_1__.find)((0,bpmn_js_lib_util_ModelUtil__WEBPACK_IMPORTED_MODULE_0__.getBusinessObject)(event).eventDefinitions, definition => {
    return is(definition, eventDefinitionType);
  });
}

function isTypedEvent(event, eventDefinitionType) {
  return (0,min_dash__WEBPACK_IMPORTED_MODULE_1__.some)((0,bpmn_js_lib_util_ModelUtil__WEBPACK_IMPORTED_MODULE_0__.getBusinessObject)(event).eventDefinitions, definition => {
    return is(definition, eventDefinitionType);
  });
}



/***/ }),

/***/ "./node_modules/bpmn-js-token-simulation/lib/util/EventHelper.js":
/*!***********************************************************************!*\
  !*** ./node_modules/bpmn-js-token-simulation/lib/util/EventHelper.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TOGGLE_MODE_EVENT": () => (/* binding */ TOGGLE_MODE_EVENT),
/* harmony export */   "PLAY_SIMULATION_EVENT": () => (/* binding */ PLAY_SIMULATION_EVENT),
/* harmony export */   "PAUSE_SIMULATION_EVENT": () => (/* binding */ PAUSE_SIMULATION_EVENT),
/* harmony export */   "RESET_SIMULATION_EVENT": () => (/* binding */ RESET_SIMULATION_EVENT),
/* harmony export */   "ANIMATION_CREATED_EVENT": () => (/* binding */ ANIMATION_CREATED_EVENT),
/* harmony export */   "ANIMATION_SPEED_CHANGED_EVENT": () => (/* binding */ ANIMATION_SPEED_CHANGED_EVENT),
/* harmony export */   "ELEMENT_CHANGED_EVENT": () => (/* binding */ ELEMENT_CHANGED_EVENT),
/* harmony export */   "SCOPE_DESTROYED_EVENT": () => (/* binding */ SCOPE_DESTROYED_EVENT),
/* harmony export */   "SCOPE_CHANGED_EVENT": () => (/* binding */ SCOPE_CHANGED_EVENT),
/* harmony export */   "SCOPE_CREATE_EVENT": () => (/* binding */ SCOPE_CREATE_EVENT),
/* harmony export */   "SCOPE_FILTER_CHANGED_EVENT": () => (/* binding */ SCOPE_FILTER_CHANGED_EVENT),
/* harmony export */   "TRACE_EVENT": () => (/* binding */ TRACE_EVENT)
/* harmony export */ });
const TOGGLE_MODE_EVENT = 'tokenSimulation.toggleMode';
const PLAY_SIMULATION_EVENT = 'tokenSimulation.playSimulation';
const PAUSE_SIMULATION_EVENT = 'tokenSimulation.pauseSimulation';
const RESET_SIMULATION_EVENT = 'tokenSimulation.resetSimulation';
const ANIMATION_CREATED_EVENT = 'tokenSimulation.animationCreated';
const ANIMATION_SPEED_CHANGED_EVENT = 'tokenSimulation.animationSpeedChanged';
const ELEMENT_CHANGED_EVENT = 'tokenSimulation.simulator.elementChanged';
const SCOPE_DESTROYED_EVENT = 'tokenSimulation.simulator.destroyScope';
const SCOPE_CHANGED_EVENT = 'tokenSimulation.simulator.scopeChanged';
const SCOPE_CREATE_EVENT = 'tokenSimulation.simulator.createScope';
const SCOPE_FILTER_CHANGED_EVENT = 'tokenSimulation.scopeFilterChanged';
const TRACE_EVENT = 'tokenSimulation.simulator.trace';



/***/ }),

/***/ "./node_modules/bpmn-js/lib/util/ModelUtil.js":
/*!****************************************************!*\
  !*** ./node_modules/bpmn-js/lib/util/ModelUtil.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "is": () => (/* binding */ is),
/* harmony export */   "getBusinessObject": () => (/* binding */ getBusinessObject)
/* harmony export */ });
/**
 * Is an element of the given BPMN type?
 *
 * @param  {djs.model.Base|ModdleElement} element
 * @param  {string} type
 *
 * @return {boolean}
 */
function is(element, type) {
  var bo = getBusinessObject(element);

  return bo && (typeof bo.$instanceOf === 'function') && bo.$instanceOf(type);
}


/**
 * Return the business object for a given element.
 *
 * @param  {djs.model.Base|ModdleElement} element
 *
 * @return {ModdleElement}
 */
function getBusinessObject(element) {
  return (element && element.businessObject) || element;
}

/***/ }),

/***/ "./node_modules/camunda-modeler-plugin-helpers/index.js":
/*!**************************************************************!*\
  !*** ./node_modules/camunda-modeler-plugin-helpers/index.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "registerClientPlugin": () => (/* binding */ registerClientPlugin),
/* harmony export */   "registerBpmnJSPlugin": () => (/* binding */ registerBpmnJSPlugin),
/* harmony export */   "registerBpmnJSModdleExtension": () => (/* binding */ registerBpmnJSModdleExtension),
/* harmony export */   "getModelerDirectory": () => (/* binding */ getModelerDirectory),
/* harmony export */   "getPluginsDirectory": () => (/* binding */ getPluginsDirectory)
/* harmony export */ });
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
 * @param {Object} module
 *
 * @example
 *
 * import {
 *   registerBpmnJSPlugin
 * } from 'camunda-modeler-plugin-helpers';
 *
 * const BpmnJSModule = {
 *   __init__: [ 'myService' ],
 *   myService: [ 'type', ... ]
 * };
 *
 * registerBpmnJSPlugin(BpmnJSModule);
 */
function registerBpmnJSPlugin(module) {
  registerClientPlugin(module, 'bpmn.modeler.additionalModules');
}

/**
 * Validate and register a bpmn-moddle extension plugin.
 *
 * @param {Object} descriptor
 *
 * @example
 * import {
 *   registerBpmnJSModdleExtension
 * } from 'camunda-modeler-plugin-helpers';
 *
 * var moddleDescriptor = {
 *   name: 'my descriptor',
 *   uri: 'http://example.my.company.localhost/schema/my-descriptor/1.0',
 *   prefix: 'mydesc',
 *
 *   ...
 * };
 *
 * registerBpmnJSModdleExtension(moddleDescriptor);
 */
function registerBpmnJSModdleExtension(descriptor) {
  registerClientPlugin(descriptor, 'bpmn.modeler.moddleExtension');
}

/**
 * Return the modeler directory, as a string.
 *
 * @deprecated Will be removed in future Camunda Modeler versions without replacement.
 *
 * @return {String}
 */
function getModelerDirectory() {
  return window.getModelerDirectory();
}

/**
 * Return the modeler plugin directory, as a string.
 *
 * @deprecated Will be removed in future Camunda Modeler versions without replacement.
 *
 * @return {String}
 */
function getPluginsDirectory() {
  return window.getPluginsDirectory();
}

/***/ }),

/***/ "./node_modules/css.escape/css.escape.js":
/*!***********************************************!*\
  !*** ./node_modules/css.escape/css.escape.js ***!
  \***********************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

/*! https://mths.be/cssescape v1.5.1 by @mathias | MIT license */
;(function(root, factory) {
	// https://github.com/umdjs/umd/blob/master/returnExports.js
	if (true) {
		// For Node.js.
		module.exports = factory(root);
	} else {}
}(typeof __webpack_require__.g != 'undefined' ? __webpack_require__.g : this, function(root) {

	if (root.CSS && root.CSS.escape) {
		return root.CSS.escape;
	}

	// https://drafts.csswg.org/cssom/#serialize-an-identifier
	var cssEscape = function(value) {
		if (arguments.length == 0) {
			throw new TypeError('`CSS.escape` requires an argument.');
		}
		var string = String(value);
		var length = string.length;
		var index = -1;
		var codeUnit;
		var result = '';
		var firstCodeUnit = string.charCodeAt(0);
		while (++index < length) {
			codeUnit = string.charCodeAt(index);
			// Note: there’s no need to special-case astral symbols, surrogate
			// pairs, or lone surrogates.

			// If the character is NULL (U+0000), then the REPLACEMENT CHARACTER
			// (U+FFFD).
			if (codeUnit == 0x0000) {
				result += '\uFFFD';
				continue;
			}

			if (
				// If the character is in the range [\1-\1F] (U+0001 to U+001F) or is
				// U+007F, […]
				(codeUnit >= 0x0001 && codeUnit <= 0x001F) || codeUnit == 0x007F ||
				// If the character is the first character and is in the range [0-9]
				// (U+0030 to U+0039), […]
				(index == 0 && codeUnit >= 0x0030 && codeUnit <= 0x0039) ||
				// If the character is the second character and is in the range [0-9]
				// (U+0030 to U+0039) and the first character is a `-` (U+002D), […]
				(
					index == 1 &&
					codeUnit >= 0x0030 && codeUnit <= 0x0039 &&
					firstCodeUnit == 0x002D
				)
			) {
				// https://drafts.csswg.org/cssom/#escape-a-character-as-code-point
				result += '\\' + codeUnit.toString(16) + ' ';
				continue;
			}

			if (
				// If the character is the first character and is a `-` (U+002D), and
				// there is no second character, […]
				index == 0 &&
				length == 1 &&
				codeUnit == 0x002D
			) {
				result += '\\' + string.charAt(index);
				continue;
			}

			// If the character is not handled by one of the above rules and is
			// greater than or equal to U+0080, is `-` (U+002D) or `_` (U+005F), or
			// is in one of the ranges [0-9] (U+0030 to U+0039), [A-Z] (U+0041 to
			// U+005A), or [a-z] (U+0061 to U+007A), […]
			if (
				codeUnit >= 0x0080 ||
				codeUnit == 0x002D ||
				codeUnit == 0x005F ||
				codeUnit >= 0x0030 && codeUnit <= 0x0039 ||
				codeUnit >= 0x0041 && codeUnit <= 0x005A ||
				codeUnit >= 0x0061 && codeUnit <= 0x007A
			) {
				// the character itself
				result += string.charAt(index);
				continue;
			}

			// Otherwise, the escaped character.
			// https://drafts.csswg.org/cssom/#escape-a-character
			result += '\\' + string.charAt(index);

		}
		return result;
	};

	if (!root.CSS) {
		root.CSS = {};
	}

	root.CSS.escape = cssEscape;
	return cssEscape;

}));


/***/ }),

/***/ "./node_modules/diagram-js/lib/util/EscapeUtil.js":
/*!********************************************************!*\
  !*** ./node_modules/diagram-js/lib/util/EscapeUtil.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "escapeCSS": () => (/* reexport default from dynamic */ css_escape__WEBPACK_IMPORTED_MODULE_0___default.a),
/* harmony export */   "escapeHTML": () => (/* binding */ escapeHTML)
/* harmony export */ });
/* harmony import */ var css_escape__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! css.escape */ "./node_modules/css.escape/css.escape.js");
/* harmony import */ var css_escape__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(css_escape__WEBPACK_IMPORTED_MODULE_0__);


var HTML_ESCAPE_MAP = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  '\'': '&#39;'
};

function escapeHTML(str) {
  str = '' + str;

  return str && str.replace(/[&<>"']/g, function(match) {
    return HTML_ESCAPE_MAP[match];
  });
}


/***/ }),

/***/ "./node_modules/ids/dist/index.esm.js":
/*!********************************************!*\
  !*** ./node_modules/ids/dist/index.esm.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var hat_1 = createCommonjsModule(function (module) {
var hat = module.exports = function (bits, base) {
    if (!base) base = 16;
    if (bits === undefined) bits = 128;
    if (bits <= 0) return '0';
    
    var digits = Math.log(Math.pow(2, bits)) / Math.log(base);
    for (var i = 2; digits === Infinity; i *= 2) {
        digits = Math.log(Math.pow(2, bits / i)) / Math.log(base) * i;
    }
    
    var rem = digits - Math.floor(digits);
    
    var res = '';
    
    for (var i = 0; i < Math.floor(digits); i++) {
        var x = Math.floor(Math.random() * base).toString(base);
        res = x + res;
    }
    
    if (rem) {
        var b = Math.pow(base, rem);
        var x = Math.floor(Math.random() * b).toString(base);
        res = x + res;
    }
    
    var parsed = parseInt(res, base);
    if (parsed !== Infinity && parsed >= Math.pow(2, bits)) {
        return hat(bits, base)
    }
    else return res;
};

hat.rack = function (bits, base, expandBy) {
    var fn = function (data) {
        var iters = 0;
        do {
            if (iters ++ > 10) {
                if (expandBy) bits += expandBy;
                else throw new Error('too many ID collisions, use more bits')
            }
            
            var id = hat(bits, base);
        } while (Object.hasOwnProperty.call(hats, id));
        
        hats[id] = data;
        return id;
    };
    var hats = fn.hats = {};
    
    fn.get = function (id) {
        return fn.hats[id];
    };
    
    fn.set = function (id, value) {
        fn.hats[id] = value;
        return fn;
    };
    
    fn.bits = bits || 128;
    fn.base = base || 16;
    return fn;
};
});

/**
 * Create a new id generator / cache instance.
 *
 * You may optionally provide a seed that is used internally.
 *
 * @param {Seed} seed
 */

function Ids(seed) {
  if (!(this instanceof Ids)) {
    return new Ids(seed);
  }

  seed = seed || [128, 36, 1];
  this._seed = seed.length ? hat_1.rack(seed[0], seed[1], seed[2]) : seed;
}
/**
 * Generate a next id.
 *
 * @param {Object} [element] element to bind the id to
 *
 * @return {String} id
 */

Ids.prototype.next = function (element) {
  return this._seed(element || true);
};
/**
 * Generate a next id with a given prefix.
 *
 * @param {Object} [element] element to bind the id to
 *
 * @return {String} id
 */


Ids.prototype.nextPrefixed = function (prefix, element) {
  var id;

  do {
    id = prefix + this.next(true);
  } while (this.assigned(id)); // claim {prefix}{random}


  this.claim(id, element); // return

  return id;
};
/**
 * Manually claim an existing id.
 *
 * @param {String} id
 * @param {String} [element] element the id is claimed by
 */


Ids.prototype.claim = function (id, element) {
  this._seed.set(id, element || true);
};
/**
 * Returns true if the given id has already been assigned.
 *
 * @param  {String} id
 * @return {Boolean}
 */


Ids.prototype.assigned = function (id) {
  return this._seed.get(id) || false;
};
/**
 * Unclaim an id.
 *
 * @param  {String} id the id to unclaim
 */


Ids.prototype.unclaim = function (id) {
  delete this._seed.hats[id];
};
/**
 * Clear all claimed ids.
 */


Ids.prototype.clear = function () {
  var hats = this._seed.hats,
      id;

  for (id in hats) {
    this.unclaim(id);
  }
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Ids);
//# sourceMappingURL=index.esm.js.map


/***/ }),

/***/ "./node_modules/inherits/inherits_browser.js":
/*!***************************************************!*\
  !*** ./node_modules/inherits/inherits_browser.js ***!
  \***************************************************/
/***/ ((module) => {

if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      })
    }
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      var TempCtor = function () {}
      TempCtor.prototype = superCtor.prototype
      ctor.prototype = new TempCtor()
      ctor.prototype.constructor = ctor
    }
  }
}


/***/ }),

/***/ "./node_modules/min-dash/dist/index.esm.js":
/*!*************************************************!*\
  !*** ./node_modules/min-dash/dist/index.esm.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "assign": () => (/* binding */ assign),
/* harmony export */   "bind": () => (/* binding */ bind),
/* harmony export */   "debounce": () => (/* binding */ debounce),
/* harmony export */   "ensureArray": () => (/* binding */ ensureArray),
/* harmony export */   "every": () => (/* binding */ every),
/* harmony export */   "filter": () => (/* binding */ filter),
/* harmony export */   "find": () => (/* binding */ find),
/* harmony export */   "findIndex": () => (/* binding */ findIndex),
/* harmony export */   "flatten": () => (/* binding */ flatten),
/* harmony export */   "forEach": () => (/* binding */ forEach),
/* harmony export */   "get": () => (/* binding */ get),
/* harmony export */   "groupBy": () => (/* binding */ groupBy),
/* harmony export */   "has": () => (/* binding */ has),
/* harmony export */   "isArray": () => (/* binding */ isArray),
/* harmony export */   "isDefined": () => (/* binding */ isDefined),
/* harmony export */   "isFunction": () => (/* binding */ isFunction),
/* harmony export */   "isNil": () => (/* binding */ isNil),
/* harmony export */   "isNumber": () => (/* binding */ isNumber),
/* harmony export */   "isObject": () => (/* binding */ isObject),
/* harmony export */   "isString": () => (/* binding */ isString),
/* harmony export */   "isUndefined": () => (/* binding */ isUndefined),
/* harmony export */   "keys": () => (/* binding */ keys),
/* harmony export */   "map": () => (/* binding */ map),
/* harmony export */   "matchPattern": () => (/* binding */ matchPattern),
/* harmony export */   "merge": () => (/* binding */ merge),
/* harmony export */   "omit": () => (/* binding */ omit),
/* harmony export */   "pick": () => (/* binding */ pick),
/* harmony export */   "reduce": () => (/* binding */ reduce),
/* harmony export */   "set": () => (/* binding */ set),
/* harmony export */   "size": () => (/* binding */ size),
/* harmony export */   "some": () => (/* binding */ some),
/* harmony export */   "sortBy": () => (/* binding */ sortBy),
/* harmony export */   "throttle": () => (/* binding */ throttle),
/* harmony export */   "unionBy": () => (/* binding */ unionBy),
/* harmony export */   "uniqueBy": () => (/* binding */ uniqueBy),
/* harmony export */   "values": () => (/* binding */ values),
/* harmony export */   "without": () => (/* binding */ without)
/* harmony export */ });
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
  var tag = nativeToString.call(obj);
  return tag === '[object Function]' || tag === '[object AsyncFunction]' || tag === '[object GeneratorFunction]' || tag === '[object AsyncGeneratorFunction]' || tag === '[object Proxy]';
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
  var val, result;

  if (isUndefined(collection)) {
    return;
  }

  var convertKey = isArray(collection) ? toNum : identity;

  for (var key in collection) {
    if (has(collection, key)) {
      val = collection[key];
      result = iterator(val, convertKey(key));

      if (result === false) {
        return val;
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
  return !!reduce(collection, function (matches, val, key) {
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

  for (var _len = arguments.length, collections = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
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
    } // not inserted, append (!)


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

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    lastArgs = args;
    lastThis = this; // ensure an execution is scheduled

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

    fn.apply(void 0, arguments);
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

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

/**
 * Convenience wrapper for `Object.assign`.
 *
 * @param {Object} target
 * @param {...Object} others
 *
 * @return {Object} the target
 */

function assign(target) {
  for (var _len = arguments.length, others = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    others[_key - 1] = arguments[_key];
  }

  return _extends.apply(void 0, [target].concat(others));
}
/**
 * Sets a nested property of a given object to the specified value.
 *
 * This mutates the object and returns it.
 *
 * @param {Object} target The target of the set operation.
 * @param {(string|number)[]} path The path to the nested value.
 * @param {any} value The value to set.
 */

function set(target, path, value) {
  var currentTarget = target;
  forEach(path, function (key, idx) {
    if (key === '__proto__') {
      throw new Error('illegal key: __proto__');
    }

    var nextKey = path[idx + 1];
    var nextTarget = currentTarget[key];

    if (isDefined(nextKey) && isNil(nextTarget)) {
      nextTarget = currentTarget[key] = isNaN(+nextKey) ? {} : [];
    }

    if (isUndefined(nextKey)) {
      if (isUndefined(value)) {
        delete currentTarget[key];
      } else {
        currentTarget[key] = value;
      }
    } else {
      currentTarget = nextTarget;
    }
  });
  return target;
}
/**
 * Gets a nested property of a given object.
 *
 * @param {Object} target The target of the get operation.
 * @param {(string|number)[]} path The path to the nested value.
 * @param {any} [defaultValue] The value to return if no value exists.
 */

function get(target, path, defaultValue) {
  var currentTarget = target;
  forEach(path, function (key) {
    // accessing nil property yields <undefined>
    if (isNil(currentTarget)) {
      currentTarget = undefined;
      return false;
    }

    currentTarget = currentTarget[key];
  });
  return isUndefined(currentTarget) ? defaultValue : currentTarget;
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
  for (var _len2 = arguments.length, sources = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
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
      if (key === '__proto__') {
        return;
      }

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
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "attr": () => (/* binding */ attr),
/* harmony export */   "classes": () => (/* binding */ classes),
/* harmony export */   "clear": () => (/* binding */ clear),
/* harmony export */   "closest": () => (/* binding */ closest),
/* harmony export */   "delegate": () => (/* binding */ delegate),
/* harmony export */   "domify": () => (/* binding */ domify),
/* harmony export */   "event": () => (/* binding */ componentEvent),
/* harmony export */   "matches": () => (/* binding */ matchesSelector),
/* harmony export */   "query": () => (/* binding */ query),
/* harmony export */   "queryAll": () => (/* binding */ all),
/* harmony export */   "remove": () => (/* binding */ remove)
/* harmony export */ });
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

var indexof = function(arr, obj){
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

var proto = typeof Element !== 'undefined' ? Element.prototype : {};
var vendor = proto.matches
  || proto.matchesSelector
  || proto.webkitMatchesSelector
  || proto.mozMatchesSelector
  || proto.msMatchesSelector
  || proto.oMatchesSelector;

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
  if (!el || el.nodeType !== 1) return false;
  if (vendor) return vendor.call(el, selector);
  var nodes = el.parentNode.querySelectorAll(selector);
  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i] == el) return true;
  }
  return false;
}

/**
 * Closest
 *
 * @param {Element} el
 * @param {String} selector
 * @param {Boolean} checkYourSelf (optional)
 */
function closest (element, selector, checkYourSelf) {
  var currentElem = checkYourSelf ? element : element.parentNode;

  while (currentElem && currentElem.nodeType !== document.DOCUMENT_NODE && currentElem.nodeType !== document.DOCUMENT_FRAGMENT_NODE) {

    if (matchesSelector(currentElem, selector)) {
      return currentElem;
    }

    currentElem = currentElem.parentNode;
  }

  return matchesSelector(currentElem, selector) ? currentElem : null;
}

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

var bind_1 = function(el, type, fn, capture){
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

var unbind_1 = function(el, type, fn, capture){
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

function bind$1(el, selector, type, fn, capture) {
  if (forceCaptureEvents.indexOf(type) !== -1) {
    capture = true;
  }

  return componentEvent.bind(el, type, function (e) {
    var target = e.target || e.srcElement;
    e.delegateTarget = closest(target, selector, true, el);
    if (e.delegateTarget) {
      fn.call(el, e);
    }
  }, capture);
}

/**
 * Unbind event `type`'s callback `fn`.
 *
 * @param {Element} el
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @api public
 */
function unbind$1(el, type, fn, capture) {
  if (forceCaptureEvents.indexOf(type) !== -1) {
    capture = true;
  }

  return componentEvent.unbind(el, type, fn, capture);
}

var delegate = {
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

map.td =
map.th = [3, '<table><tbody><tr>', '</tr></tbody></table>'];

map.option =
map.optgroup = [1, '<select multiple="multiple">', '</select>'];

map.thead =
map.tbody =
map.colgroup =
map.caption =
map.tfoot = [1, '<table>', '</table>'];

map.polyline =
map.ellipse =
map.polygon =
map.circle =
map.text =
map.line =
map.path =
map.rect =
map.g = [1, '<svg xmlns="http://www.w3.org/2000/svg" version="1.1">','</svg>'];

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

/***/ "./node_modules/randomcolor/randomColor.js":
/*!*************************************************!*\
  !*** ./node_modules/randomcolor/randomColor.js ***!
  \*************************************************/
/***/ (function(module, exports, __webpack_require__) {

/* module decorator */ module = __webpack_require__.nmd(module);
// randomColor by David Merfield under the CC0 license
// https://github.com/davidmerfield/randomColor/

;(function(root, factory) {

  // Support CommonJS
  if (true) {
    var randomColor = factory();

    // Support NodeJS & Component, which allow module.exports to be a function
    if ( true && module && module.exports) {
      exports = module.exports = randomColor;
    }

    // Support CommonJS 1.1.1 spec
    exports.randomColor = randomColor;

  // Support AMD
  } else {}

}(this, function() {

  // Seed to get repeatable colors
  var seed = null;

  // Shared color dictionary
  var colorDictionary = {};

  // Populate the color dictionary
  loadColorBounds();

  // check if a range is taken
  var colorRanges = [];

  var randomColor = function (options) {

    options = options || {};

    // Check if there is a seed and ensure it's an
    // integer. Otherwise, reset the seed value.
    if (options.seed !== undefined && options.seed !== null && options.seed === parseInt(options.seed, 10)) {
      seed = options.seed;

    // A string was passed as a seed
    } else if (typeof options.seed === 'string') {
      seed = stringToInteger(options.seed);

    // Something was passed as a seed but it wasn't an integer or string
    } else if (options.seed !== undefined && options.seed !== null) {
      throw new TypeError('The seed value must be an integer or string');

    // No seed, reset the value outside.
    } else {
      seed = null;
    }

    var H,S,B;

    // Check if we need to generate multiple colors
    if (options.count !== null && options.count !== undefined) {

      var totalColors = options.count,
          colors = [];
      // Value false at index i means the range i is not taken yet.
      for (var i = 0; i < options.count; i++) {
        colorRanges.push(false)
        }
      options.count = null;

      while (totalColors > colors.length) {

        var color = randomColor(options);

        if (seed !== null) {
          options.seed = seed;
        }

        colors.push(color);
      }

      options.count = totalColors;

      return colors;
    }

    // First we pick a hue (H)
    H = pickHue(options);

    // Then use H to determine saturation (S)
    S = pickSaturation(H, options);

    // Then use S and H to determine brightness (B).
    B = pickBrightness(H, S, options);

    // Then we return the HSB color in the desired format
    return setFormat([H,S,B], options);
  };

  function pickHue(options) {
    if (colorRanges.length > 0) {
      var hueRange = getRealHueRange(options.hue)

      var hue = randomWithin(hueRange)

      //Each of colorRanges.length ranges has a length equal approximatelly one step
      var step = (hueRange[1] - hueRange[0]) / colorRanges.length

      var j = parseInt((hue - hueRange[0]) / step)

      //Check if the range j is taken
      if (colorRanges[j] === true) {
        j = (j + 2) % colorRanges.length
      }
      else {
        colorRanges[j] = true
           }

      var min = (hueRange[0] + j * step) % 359,
          max = (hueRange[0] + (j + 1) * step) % 359;

      hueRange = [min, max]

      hue = randomWithin(hueRange)

      if (hue < 0) {hue = 360 + hue;}
      return hue
    }
    else {
      var hueRange = getHueRange(options.hue)

      hue = randomWithin(hueRange);
      // Instead of storing red as two seperate ranges,
      // we group them, using negative numbers
      if (hue < 0) {
        hue = 360 + hue;
      }

      return hue;
    }
  }

  function pickSaturation (hue, options) {

    if (options.hue === 'monochrome') {
      return 0;
    }

    if (options.luminosity === 'random') {
      return randomWithin([0,100]);
    }

    var saturationRange = getSaturationRange(hue);

    var sMin = saturationRange[0],
        sMax = saturationRange[1];

    switch (options.luminosity) {

      case 'bright':
        sMin = 55;
        break;

      case 'dark':
        sMin = sMax - 10;
        break;

      case 'light':
        sMax = 55;
        break;
   }

    return randomWithin([sMin, sMax]);

  }

  function pickBrightness (H, S, options) {

    var bMin = getMinimumBrightness(H, S),
        bMax = 100;

    switch (options.luminosity) {

      case 'dark':
        bMax = bMin + 20;
        break;

      case 'light':
        bMin = (bMax + bMin)/2;
        break;

      case 'random':
        bMin = 0;
        bMax = 100;
        break;
    }

    return randomWithin([bMin, bMax]);
  }

  function setFormat (hsv, options) {

    switch (options.format) {

      case 'hsvArray':
        return hsv;

      case 'hslArray':
        return HSVtoHSL(hsv);

      case 'hsl':
        var hsl = HSVtoHSL(hsv);
        return 'hsl('+hsl[0]+', '+hsl[1]+'%, '+hsl[2]+'%)';

      case 'hsla':
        var hslColor = HSVtoHSL(hsv);
        var alpha = options.alpha || Math.random();
        return 'hsla('+hslColor[0]+', '+hslColor[1]+'%, '+hslColor[2]+'%, ' + alpha + ')';

      case 'rgbArray':
        return HSVtoRGB(hsv);

      case 'rgb':
        var rgb = HSVtoRGB(hsv);
        return 'rgb(' + rgb.join(', ') + ')';

      case 'rgba':
        var rgbColor = HSVtoRGB(hsv);
        var alpha = options.alpha || Math.random();
        return 'rgba(' + rgbColor.join(', ') + ', ' + alpha + ')';

      default:
        return HSVtoHex(hsv);
    }

  }

  function getMinimumBrightness(H, S) {

    var lowerBounds = getColorInfo(H).lowerBounds;

    for (var i = 0; i < lowerBounds.length - 1; i++) {

      var s1 = lowerBounds[i][0],
          v1 = lowerBounds[i][1];

      var s2 = lowerBounds[i+1][0],
          v2 = lowerBounds[i+1][1];

      if (S >= s1 && S <= s2) {

         var m = (v2 - v1)/(s2 - s1),
             b = v1 - m*s1;

         return m*S + b;
      }

    }

    return 0;
  }

  function getHueRange (colorInput) {

    if (typeof parseInt(colorInput) === 'number') {

      var number = parseInt(colorInput);

      if (number < 360 && number > 0) {
        return [number, number];
      }

    }

    if (typeof colorInput === 'string') {

      if (colorDictionary[colorInput]) {
        var color = colorDictionary[colorInput];
        if (color.hueRange) {return color.hueRange;}
      } else if (colorInput.match(/^#?([0-9A-F]{3}|[0-9A-F]{6})$/i)) {
        var hue = HexToHSB(colorInput)[0];
        return [ hue, hue ];
      }
    }

    return [0,360];

  }

  function getSaturationRange (hue) {
    return getColorInfo(hue).saturationRange;
  }

  function getColorInfo (hue) {

    // Maps red colors to make picking hue easier
    if (hue >= 334 && hue <= 360) {
      hue-= 360;
    }

    for (var colorName in colorDictionary) {
       var color = colorDictionary[colorName];
       if (color.hueRange &&
           hue >= color.hueRange[0] &&
           hue <= color.hueRange[1]) {
          return colorDictionary[colorName];
       }
    } return 'Color not found';
  }

  function randomWithin (range) {
    if (seed === null) {
      //generate random evenly destinct number from : https://martin.ankerl.com/2009/12/09/how-to-create-random-colors-programmatically/
      var golden_ratio = 0.618033988749895
      var r=Math.random()
      r += golden_ratio
      r %= 1
      return Math.floor(range[0] + r*(range[1] + 1 - range[0]));
    } else {
      //Seeded random algorithm from http://indiegamr.com/generate-repeatable-random-numbers-in-js/
      var max = range[1] || 1;
      var min = range[0] || 0;
      seed = (seed * 9301 + 49297) % 233280;
      var rnd = seed / 233280.0;
      return Math.floor(min + rnd * (max - min));
}
  }

  function HSVtoHex (hsv){

    var rgb = HSVtoRGB(hsv);

    function componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? '0' + hex : hex;
    }

    var hex = '#' + componentToHex(rgb[0]) + componentToHex(rgb[1]) + componentToHex(rgb[2]);

    return hex;

  }

  function defineColor (name, hueRange, lowerBounds) {

    var sMin = lowerBounds[0][0],
        sMax = lowerBounds[lowerBounds.length - 1][0],

        bMin = lowerBounds[lowerBounds.length - 1][1],
        bMax = lowerBounds[0][1];

    colorDictionary[name] = {
      hueRange: hueRange,
      lowerBounds: lowerBounds,
      saturationRange: [sMin, sMax],
      brightnessRange: [bMin, bMax]
    };

  }

  function loadColorBounds () {

    defineColor(
      'monochrome',
      null,
      [[0,0],[100,0]]
    );

    defineColor(
      'red',
      [-26,18],
      [[20,100],[30,92],[40,89],[50,85],[60,78],[70,70],[80,60],[90,55],[100,50]]
    );

    defineColor(
      'orange',
      [18,46],
      [[20,100],[30,93],[40,88],[50,86],[60,85],[70,70],[100,70]]
    );

    defineColor(
      'yellow',
      [46,62],
      [[25,100],[40,94],[50,89],[60,86],[70,84],[80,82],[90,80],[100,75]]
    );

    defineColor(
      'green',
      [62,178],
      [[30,100],[40,90],[50,85],[60,81],[70,74],[80,64],[90,50],[100,40]]
    );

    defineColor(
      'blue',
      [178, 257],
      [[20,100],[30,86],[40,80],[50,74],[60,60],[70,52],[80,44],[90,39],[100,35]]
    );

    defineColor(
      'purple',
      [257, 282],
      [[20,100],[30,87],[40,79],[50,70],[60,65],[70,59],[80,52],[90,45],[100,42]]
    );

    defineColor(
      'pink',
      [282, 334],
      [[20,100],[30,90],[40,86],[60,84],[80,80],[90,75],[100,73]]
    );

  }

  function HSVtoRGB (hsv) {

    // this doesn't work for the values of 0 and 360
    // here's the hacky fix
    var h = hsv[0];
    if (h === 0) {h = 1;}
    if (h === 360) {h = 359;}

    // Rebase the h,s,v values
    h = h/360;
    var s = hsv[1]/100,
        v = hsv[2]/100;

    var h_i = Math.floor(h*6),
      f = h * 6 - h_i,
      p = v * (1 - s),
      q = v * (1 - f*s),
      t = v * (1 - (1 - f)*s),
      r = 256,
      g = 256,
      b = 256;

    switch(h_i) {
      case 0: r = v; g = t; b = p;  break;
      case 1: r = q; g = v; b = p;  break;
      case 2: r = p; g = v; b = t;  break;
      case 3: r = p; g = q; b = v;  break;
      case 4: r = t; g = p; b = v;  break;
      case 5: r = v; g = p; b = q;  break;
    }

    var result = [Math.floor(r*255), Math.floor(g*255), Math.floor(b*255)];
    return result;
  }

  function HexToHSB (hex) {
    hex = hex.replace(/^#/, '');
    hex = hex.length === 3 ? hex.replace(/(.)/g, '$1$1') : hex;

    var red = parseInt(hex.substr(0, 2), 16) / 255,
          green = parseInt(hex.substr(2, 2), 16) / 255,
          blue = parseInt(hex.substr(4, 2), 16) / 255;

    var cMax = Math.max(red, green, blue),
          delta = cMax - Math.min(red, green, blue),
          saturation = cMax ? (delta / cMax) : 0;

    switch (cMax) {
      case red: return [ 60 * (((green - blue) / delta) % 6) || 0, saturation, cMax ];
      case green: return [ 60 * (((blue - red) / delta) + 2) || 0, saturation, cMax ];
      case blue: return [ 60 * (((red - green) / delta) + 4) || 0, saturation, cMax ];
    }
  }

  function HSVtoHSL (hsv) {
    var h = hsv[0],
      s = hsv[1]/100,
      v = hsv[2]/100,
      k = (2-s)*v;

    return [
      h,
      Math.round(s*v / (k<1 ? k : 2-k) * 10000) / 100,
      k/2 * 100
    ];
  }

  function stringToInteger (string) {
    var total = 0
    for (var i = 0; i !== string.length; i++) {
      if (total >= Number.MAX_SAFE_INTEGER) break;
      total += string.charCodeAt(i)
    }
    return total
  }

  // get The range of given hue when options.count!=0
  function getRealHueRange(colorHue)
  { if (!isNaN(colorHue)) {
    var number = parseInt(colorHue);

    if (number < 360 && number > 0) {
      return getColorInfo(colorHue).hueRange
    }
  }
    else if (typeof colorHue === 'string') {

      if (colorDictionary[colorHue]) {
        var color = colorDictionary[colorHue];

        if (color.hueRange) {
          return color.hueRange
       }
    } else if (colorHue.match(/^#?([0-9A-F]{3}|[0-9A-F]{6})$/i)) {
        var hue = HexToHSB(colorHue)[0]
        return getColorInfo(hue).hueRange
    }
  }

    return [0,360]
}
  return randomColor;
}));


/***/ }),

/***/ "./node_modules/tiny-svg/dist/index.esm.js":
/*!*************************************************!*\
  !*** ./node_modules/tiny-svg/dist/index.esm.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "append": () => (/* binding */ append),
/* harmony export */   "appendTo": () => (/* binding */ appendTo),
/* harmony export */   "attr": () => (/* binding */ attr),
/* harmony export */   "classes": () => (/* binding */ classes),
/* harmony export */   "clear": () => (/* binding */ clear),
/* harmony export */   "clone": () => (/* binding */ clone),
/* harmony export */   "create": () => (/* binding */ create),
/* harmony export */   "innerSVG": () => (/* binding */ innerSVG),
/* harmony export */   "prepend": () => (/* binding */ prepend),
/* harmony export */   "prependTo": () => (/* binding */ prependTo),
/* harmony export */   "remove": () => (/* binding */ remove),
/* harmony export */   "replace": () => (/* binding */ replace),
/* harmony export */   "transform": () => (/* binding */ transform),
/* harmony export */   "on": () => (/* binding */ on),
/* harmony export */   "off": () => (/* binding */ off),
/* harmony export */   "createPoint": () => (/* binding */ createPoint),
/* harmony export */   "createMatrix": () => (/* binding */ createMatrix),
/* harmony export */   "createTransform": () => (/* binding */ createTransform),
/* harmony export */   "select": () => (/* binding */ select),
/* harmony export */   "selectAll": () => (/* binding */ selectAll)
/* harmony export */ });
function ensureImported(element, target) {

  if (element.ownerDocument !== target.ownerDocument) {
    try {
      // may fail on webkit
      return target.ownerDocument.importNode(element, true);
    } catch (e) {
      // ignore
    }
  }

  return element;
}

/**
 * appendTo utility
 */

/**
 * Append a node to a target element and return the appended node.
 *
 * @param  {SVGElement} element
 * @param  {SVGElement} target
 *
 * @return {SVGElement} the appended node
 */
function appendTo(element, target) {
  return target.appendChild(ensureImported(element, target));
}

/**
 * append utility
 */

/**
 * Append a node to an element
 *
 * @param  {SVGElement} element
 * @param  {SVGElement} node
 *
 * @return {SVGElement} the element
 */
function append(target, node) {
  appendTo(node, target);
  return target;
}

/**
 * attribute accessor utility
 */

var LENGTH_ATTR = 2;

var CSS_PROPERTIES = {
  'alignment-baseline': 1,
  'baseline-shift': 1,
  'clip': 1,
  'clip-path': 1,
  'clip-rule': 1,
  'color': 1,
  'color-interpolation': 1,
  'color-interpolation-filters': 1,
  'color-profile': 1,
  'color-rendering': 1,
  'cursor': 1,
  'direction': 1,
  'display': 1,
  'dominant-baseline': 1,
  'enable-background': 1,
  'fill': 1,
  'fill-opacity': 1,
  'fill-rule': 1,
  'filter': 1,
  'flood-color': 1,
  'flood-opacity': 1,
  'font': 1,
  'font-family': 1,
  'font-size': LENGTH_ATTR,
  'font-size-adjust': 1,
  'font-stretch': 1,
  'font-style': 1,
  'font-variant': 1,
  'font-weight': 1,
  'glyph-orientation-horizontal': 1,
  'glyph-orientation-vertical': 1,
  'image-rendering': 1,
  'kerning': 1,
  'letter-spacing': 1,
  'lighting-color': 1,
  'marker': 1,
  'marker-end': 1,
  'marker-mid': 1,
  'marker-start': 1,
  'mask': 1,
  'opacity': 1,
  'overflow': 1,
  'pointer-events': 1,
  'shape-rendering': 1,
  'stop-color': 1,
  'stop-opacity': 1,
  'stroke': 1,
  'stroke-dasharray': 1,
  'stroke-dashoffset': 1,
  'stroke-linecap': 1,
  'stroke-linejoin': 1,
  'stroke-miterlimit': 1,
  'stroke-opacity': 1,
  'stroke-width': LENGTH_ATTR,
  'text-anchor': 1,
  'text-decoration': 1,
  'text-rendering': 1,
  'unicode-bidi': 1,
  'visibility': 1,
  'word-spacing': 1,
  'writing-mode': 1
};


function getAttribute(node, name) {
  if (CSS_PROPERTIES[name]) {
    return node.style[name];
  } else {
    return node.getAttributeNS(null, name);
  }
}

function setAttribute(node, name, value) {
  var hyphenated = name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

  var type = CSS_PROPERTIES[hyphenated];

  if (type) {
    // append pixel unit, unless present
    if (type === LENGTH_ATTR && typeof value === 'number') {
      value = String(value) + 'px';
    }

    node.style[hyphenated] = value;
  } else {
    node.setAttributeNS(null, name, value);
  }
}

function setAttributes(node, attrs) {

  var names = Object.keys(attrs), i, name;

  for (i = 0, name; (name = names[i]); i++) {
    setAttribute(node, name, attrs[name]);
  }
}

/**
 * Gets or sets raw attributes on a node.
 *
 * @param  {SVGElement} node
 * @param  {Object} [attrs]
 * @param  {String} [name]
 * @param  {String} [value]
 *
 * @return {String}
 */
function attr(node, name, value) {
  if (typeof name === 'string') {
    if (value !== undefined) {
      setAttribute(node, name, value);
    } else {
      return getAttribute(node, name);
    }
  } else {
    setAttributes(node, name);
  }

  return node;
}

/**
 * Clear utility
 */
function index(arr, obj) {
  if (arr.indexOf) {
    return arr.indexOf(obj);
  }


  for (var i = 0; i < arr.length; ++i) {
    if (arr[i] === obj) {
      return i;
    }
  }

  return -1;
}

var re = /\s+/;

var toString = Object.prototype.toString;

function defined(o) {
  return typeof o !== 'undefined';
}

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

ClassList.prototype.add = function(name) {

  // classList
  if (this.list) {
    this.list.add(name);
    return this;
  }

  // fallback
  var arr = this.array();
  var i = index(arr, name);
  if (!~i) {
    arr.push(name);
  }

  if (defined(this.el.className.baseVal)) {
    this.el.className.baseVal = arr.join(' ');
  } else {
    this.el.className = arr.join(' ');
  }

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

ClassList.prototype.remove = function(name) {
  if ('[object RegExp]' === toString.call(name)) {
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
  if (~i) {
    arr.splice(i, 1);
  }
  this.el.className.baseVal = arr.join(' ');
  return this;
};

/**
 * Remove all classes matching `re`.
 *
 * @param {RegExp} re
 * @return {ClassList}
 * @api private
 */

ClassList.prototype.removeMatching = function(re) {
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

ClassList.prototype.toggle = function(name, force) {
  // classList
  if (this.list) {
    if (defined(force)) {
      if (force !== this.list.toggle(name, force)) {
        this.list.toggle(name); // toggle again to correct
      }
    } else {
      this.list.toggle(name);
    }
    return this;
  }

  // fallback
  if (defined(force)) {
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

ClassList.prototype.array = function() {
  var className = this.el.getAttribute('class') || '';
  var str = className.replace(/^\s+|\s+$/g, '');
  var arr = str.split(re);
  if ('' === arr[0]) {
    arr.shift();
  }
  return arr;
};

/**
 * Check if class `name` is present.
 *
 * @param {String} name
 * @return {ClassList}
 * @api public
 */

ClassList.prototype.has =
ClassList.prototype.contains = function(name) {
  return (
    this.list ?
      this.list.contains(name) :
      !! ~index(this.array(), name)
  );
};

function remove(element) {
  var parent = element.parentNode;

  if (parent) {
    parent.removeChild(element);
  }

  return element;
}

/**
 * Clear utility
 */

/**
 * Removes all children from the given element
 *
 * @param  {DOMElement} element
 * @return {DOMElement} the element (for chaining)
 */
function clear(element) {
  var child;

  while ((child = element.firstChild)) {
    remove(child);
  }

  return element;
}

function clone(element) {
  return element.cloneNode(true);
}

var ns = {
  svg: 'http://www.w3.org/2000/svg'
};

/**
 * DOM parsing utility
 */

var SVG_START = '<svg xmlns="' + ns.svg + '"';

function parse(svg) {

  var unwrap = false;

  // ensure we import a valid svg document
  if (svg.substring(0, 4) === '<svg') {
    if (svg.indexOf(ns.svg) === -1) {
      svg = SVG_START + svg.substring(4);
    }
  } else {
    // namespace svg
    svg = SVG_START + '>' + svg + '</svg>';
    unwrap = true;
  }

  var parsed = parseDocument(svg);

  if (!unwrap) {
    return parsed;
  }

  var fragment = document.createDocumentFragment();

  var parent = parsed.firstChild;

  while (parent.firstChild) {
    fragment.appendChild(parent.firstChild);
  }

  return fragment;
}

function parseDocument(svg) {

  var parser;

  // parse
  parser = new DOMParser();
  parser.async = false;

  return parser.parseFromString(svg, 'text/xml');
}

/**
 * Create utility for SVG elements
 */


/**
 * Create a specific type from name or SVG markup.
 *
 * @param {String} name the name or markup of the element
 * @param {Object} [attrs] attributes to set on the element
 *
 * @returns {SVGElement}
 */
function create(name, attrs) {
  var element;

  if (name.charAt(0) === '<') {
    element = parse(name).firstChild;
    element = document.importNode(element, true);
  } else {
    element = document.createElementNS(ns.svg, name);
  }

  if (attrs) {
    attr(element, attrs);
  }

  return element;
}

/**
 * Events handling utility
 */

function on(node, event, listener, useCapture) {
  node.addEventListener(event, listener, useCapture);
}

function off(node, event, listener, useCapture) {
  node.removeEventListener(event, listener, useCapture);
}

/**
 * Geometry helpers
 */

// fake node used to instantiate svg geometry elements
var node = create('svg');

function extend(object, props) {
  var i, k, keys = Object.keys(props);

  for (i = 0; (k = keys[i]); i++) {
    object[k] = props[k];
  }

  return object;
}


function createPoint(x, y) {
  var point = node.createSVGPoint();

  switch (arguments.length) {
  case 0:
    return point;
  case 2:
    x = {
      x: x,
      y: y
    };
    break;
  }

  return extend(point, x);
}

/**
 * Create matrix via args.
 *
 * @example
 *
 * createMatrix({ a: 1, b: 1 });
 * createMatrix();
 * createMatrix(1, 2, 0, 0, 30, 20);
 *
 * @return {SVGMatrix}
 */
function createMatrix(a, b, c, d, e, f) {
  var matrix = node.createSVGMatrix();

  switch (arguments.length) {
  case 0:
    return matrix;
  case 1:
    return extend(matrix, a);
  case 6:
    return extend(matrix, {
      a: a,
      b: b,
      c: c,
      d: d,
      e: e,
      f: f
    });
  }
}

function createTransform(matrix) {
  if (matrix) {
    return node.createSVGTransformFromMatrix(matrix);
  } else {
    return node.createSVGTransform();
  }
}

/**
 * Serialization util
 */

var TEXT_ENTITIES = /([&<>]{1})/g;
var ATTR_ENTITIES = /([\n\r"]{1})/g;

var ENTITY_REPLACEMENT = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '\''
};

function escape(str, pattern) {

  function replaceFn(match, entity) {
    return ENTITY_REPLACEMENT[entity] || entity;
  }

  return str.replace(pattern, replaceFn);
}

function serialize(node, output) {

  var i, len, attrMap, attrNode, childNodes;

  switch (node.nodeType) {
  // TEXT
  case 3:
    // replace special XML characters
    output.push(escape(node.textContent, TEXT_ENTITIES));
    break;

  // ELEMENT
  case 1:
    output.push('<', node.tagName);

    if (node.hasAttributes()) {
      attrMap = node.attributes;
      for (i = 0, len = attrMap.length; i < len; ++i) {
        attrNode = attrMap.item(i);
        output.push(' ', attrNode.name, '="', escape(attrNode.value, ATTR_ENTITIES), '"');
      }
    }

    if (node.hasChildNodes()) {
      output.push('>');
      childNodes = node.childNodes;
      for (i = 0, len = childNodes.length; i < len; ++i) {
        serialize(childNodes.item(i), output);
      }
      output.push('</', node.tagName, '>');
    } else {
      output.push('/>');
    }
    break;

  // COMMENT
  case 8:
    output.push('<!--', escape(node.nodeValue, TEXT_ENTITIES), '-->');
    break;

  // CDATA
  case 4:
    output.push('<![CDATA[', node.nodeValue, ']]>');
    break;

  default:
    throw new Error('unable to handle node ' + node.nodeType);
  }

  return output;
}

/**
 * innerHTML like functionality for SVG elements.
 * based on innerSVG (https://code.google.com/p/innersvg)
 */


function set(element, svg) {

  var parsed = parse(svg);

  // clear element contents
  clear(element);

  if (!svg) {
    return;
  }

  if (!isFragment(parsed)) {
    // extract <svg> from parsed document
    parsed = parsed.documentElement;
  }

  var nodes = slice(parsed.childNodes);

  // import + append each node
  for (var i = 0; i < nodes.length; i++) {
    appendTo(nodes[i], element);
  }

}

function get(element) {
  var child = element.firstChild,
      output = [];

  while (child) {
    serialize(child, output);
    child = child.nextSibling;
  }

  return output.join('');
}

function isFragment(node) {
  return node.nodeName === '#document-fragment';
}

function innerSVG(element, svg) {

  if (svg !== undefined) {

    try {
      set(element, svg);
    } catch (e) {
      throw new Error('error parsing SVG: ' + e.message);
    }

    return element;
  } else {
    return get(element);
  }
}


function slice(arr) {
  return Array.prototype.slice.call(arr);
}

/**
 * Selection utilities
 */

function select(node, selector) {
  return node.querySelector(selector);
}

function selectAll(node, selector) {
  var nodes = node.querySelectorAll(selector);

  return [].map.call(nodes, function(element) {
    return element;
  });
}

/**
 * prependTo utility
 */

/**
 * Prepend a node to a target element and return the prepended node.
 *
 * @param  {SVGElement} node
 * @param  {SVGElement} target
 *
 * @return {SVGElement} the prepended node
 */
function prependTo(node, target) {
  return target.insertBefore(ensureImported(node, target), target.firstChild || null);
}

/**
 * prepend utility
 */

/**
 * Prepend a node to a target element
 *
 * @param  {SVGElement} target
 * @param  {SVGElement} node
 *
 * @return {SVGElement} the target element
 */
function prepend(target, node) {
  prependTo(node, target);
  return target;
}

/**
 * Replace utility
 */

function replace(element, replacement) {
  element.parentNode.replaceChild(ensureImported(replacement, element), element);
  return replacement;
}

/**
 * transform accessor utility
 */

function wrapMatrix(transformList, transform) {
  if (transform instanceof SVGMatrix) {
    return transformList.createSVGTransformFromMatrix(transform);
  }

  return transform;
}


function setTransforms(transformList, transforms) {
  var i, t;

  transformList.clear();

  for (i = 0; (t = transforms[i]); i++) {
    transformList.appendItem(wrapMatrix(transformList, t));
  }
}

/**
 * Get or set the transforms on the given node.
 *
 * @param {SVGElement} node
 * @param  {SVGTransform|SVGMatrix|Array<SVGTransform|SVGMatrix>} [transforms]
 *
 * @return {SVGTransform} the consolidated transform
 */
function transform(node, transforms) {
  var transformList = node.transform.baseVal;

  if (transforms) {

    if (!Array.isArray(transforms)) {
      transforms = [ transforms ];
    }

    setTransforms(transformList, transforms);
  }

  return transformList.consolidate();
}




/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**************************!*\
  !*** ./client/client.js ***!
  \**************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var camunda_modeler_plugin_helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! camunda-modeler-plugin-helpers */ "./node_modules/camunda-modeler-plugin-helpers/index.js");
/* harmony import */ var bpmn_js_token_simulation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! bpmn-js-token-simulation */ "./node_modules/bpmn-js-token-simulation/lib/modeler.js");
/* harmony import */ var _HideModelerElements__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./HideModelerElements */ "./client/HideModelerElements.js");





const TokenSimulationPluginModule = {
  __init__: [ 'hideModelerElements' ],
  hideModelerElements: [ 'type', _HideModelerElements__WEBPACK_IMPORTED_MODULE_1__.default ]
};

(0,camunda_modeler_plugin_helpers__WEBPACK_IMPORTED_MODULE_0__.registerBpmnJSPlugin)(bpmn_js_token_simulation__WEBPACK_IMPORTED_MODULE_2__.default);
(0,camunda_modeler_plugin_helpers__WEBPACK_IMPORTED_MODULE_0__.registerBpmnJSPlugin)(TokenSimulationPluginModule);

})();

/******/ })()
;
//# sourceMappingURL=client.bundle.js.map