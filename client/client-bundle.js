(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var domify = require('min-dom/lib/domify');

var config = {
  'sayHello': 'say-hello',
  'ready': 'ready',
  'thx': 'thx',

  'endEventAdded': 'endEventAdded',
  'gatewayAdded': 'gatewayAdded',
  'poolAdded': 'poolAdded',
  'sequenceflowAdded': 'sequenceflowAdded',
  'startEventAdded': 'startEventAdded',
  'taskAdded': 'taskAdded',

  'favColor': 'favColor',
  'hateColor': 'hateColor',

  'shapeRem1': 'shapeRem1',
  'shapeRem2': 'shapeRem2',

  'canConnect1': 'canConnect1',
  'canConnect2': 'canConnect2',
  'canConnect3': 'canConnect3',
  'cantConnect1': 'cantConnect1',
  'cantConnect2': 'cantConnect2',
  'cantConnect3': 'cantConnect3',

  'minimap': 'minimap',

  'toggleOn': 'toggleOn',
  'toggleOff': 'toggleOff'
};

var comments = {
  'sayHello': 'Hello, my name is Darlene. I\'m here to help you.',
  'ready': 'Let\'s go!',
  'thx': 'Bye! I\'ll see you soon!',

  'endEventAdded': 'A new end event was added.',
  'gatewayAdded': 'A new gateway was added.',
  'poolAdded': 'A new pool was added.',
  'sequenceflowAdded': 'A new sequence flow was added.',
  'startEventAdded': 'A new start event was addded.',
  'taskAdded': 'A new task was added.',

  'favColor': 'Wow! My favorite color!',
  'hateColor': 'I hate this color!',

  'shapeRem1': 'Bye!',
  'shapeRem2': 'See ya!',

  'canConnect1': 'That\'s possible.',
  'canConnect2': 'Yeah, that works.',
  'canConnect3': 'Looks fine.',
  'cantConnect1': 'That\'s not allowed.',
  'cantConnect2': 'You can\'t do this.',
  'cantConnect3': 'Impossible.',

  'minimap': 'Nice, you\'re using the new minimap.',

  'toggleOn': 'How can I help you?',
  'toggleOff': 'Okay, I\'m right here if you need me.'
};

function Darlene(eventBus, bpmnRules, editorActions, canvas, minimap) {
  var self = this;

  this.played = [];

  this.isActive = true;

  this.comments = {};

  this.loadComments(config);

  this.lastCommentPlayed = -1;

  this.showCommentTimeout = null;

  this.context = new AudioContext();

  editorActions.register({
    toggleDarlene: function() {
      self.toggle();
    },
    sayHello: function() {
      self.playComment('sayHello');
    },
    sayThankYou: function() {
      self.playComment('thx');
    }
  });

  minimap._parent.addEventListener('click', function() {
    self.playCommentOnce('minimap');
  });

  eventBus.on('import.done', function() {
    setTimeout(function() {
      self.playComment('ready');
    }, 500);
  });

  eventBus.on('shape.added', function(event) {

    var element = event.element;

    switch (element.type) {
    case 'bpmn:Task':
      self.playComment('taskAdded');
      break;
    case 'bpmn:ExclusiveGateway':
      self.playComment('gatewayAdded');
      break;
    case 'bpmn:Participant':
      self.playComment('poolAdded');
      break;
    case 'bpmn:StartEvent':
      self.playComment('startEventAdded');
      break;
    case 'bpmn:EndEvent':
      self.playComment('endEventAdded');
      break;
    }
  });

  eventBus.on('connection.added', function(context) {
    if (context.element.type === 'bpmn:SequenceFlow') {
      self.playComment('sequenceflowAdded');
    }
  });

  eventBus.on('commandStack.element.setColor.postExecuted', function(context) {
    self.playRandomComment([ 'favColor', 'hateColor' ]);
  });

  eventBus.on('shape.removed', function(context) {
    self.playRandomComment([ 'shapeRem1', 'shapeRem2' ]);
  });

  eventBus.on('commandStack.connection.create.canExecute', 100000, function(context) {
    if (bpmnRules.canConnect(context.context.source, context.context.target)) {
      self.playRandomComment([ 'canConnect1', 'canConnect2', 'canConnect3' ]);
    } else {
      self.playRandomComment([ 'cantConnect1', 'cantConnect2', 'cantConnect3' ]);
    }
  });

  this.addImage(canvas.getContainer());

  window.plugin = this;
}

Darlene.prototype.loadComments = function(config) {
  var self = this;

  Object.keys(config).forEach(function(key) {
    var request = new XMLHttpRequest();

    var url = getPluginsDirectory() + '/darlene/client/sounds/' + config[key] + '.mp3';

    request.open('GET', url, true);

    request.responseType = 'arraybuffer';

    request.onload = function() {
      self.context.decodeAudioData(request.response, function(buffer) {
        self.comments[key] = buffer;
      });
    };

    request.send();
  });
};

Darlene.prototype.playRandomComment = function(comments) {
  var increment = 1 / comments.length;

  var random = Math.random();

  var index = Math.floor(random / increment);

  this.playComment(comments[index]);
};

Darlene.prototype.playCommentOnce = function(comment) {
  if (this.played.indexOf(comment) !== - 1) {
    return;
  }

  this.played.push(comment);

  this.playComment(comment);
};

Darlene.prototype.playComment = function(comment) {
  if (!this.isActive) {
    return;
  }

  var now = this.context.currentTime;

  if (now - this.lastCommentPlayed < 1) {
    return;
  }

  this.showComment(comment);

  if (!this.comments[comment]) {
    return;
  }

  var buffer = this.comments[comment];

  // source
  var source = this.context.createBufferSource();
  source.buffer = buffer;

  // gain
  var gain = this.context.createGain();
  source.connect(gain);
  gain.connect(this.context.destination);

  source.start(now);

  // garbage collection
  source.stop(now + 10000); // ms

  setTimeout(() => {
    gain.disconnect();
  }, 10000);

  this.lastCommentPlayed = now;
};

Darlene.prototype.showComment = function(comment) {
  var self = this;

  if (comments[comment]) {
    if (!this._commentBox1) return;

    this._commentBox1.style.visibility = 'visible';
    this._commentBox2.style.visibility = 'visible';

    this._commentBox2.textContent = comments[comment];

    clearTimeout(this.showCommentTimeout);

    this.showCommentTimeout = setTimeout(function() {
      self._commentBox1.style.visibility = 'hidden';
      self._commentBox2.style.visibility = 'hidden';
    }, 5000);
  }
};

Darlene.prototype.toggle = function() {
  if (this.isActive) {
    this._image.src = getPluginsDirectory() + '/darlene/darlene-inactive.png';

    this.playComment('toggleOff');

    this.isActive = false;
  } else {
    this.isActive = true;

    this._image.src = getPluginsDirectory() + '/darlene/darlene-active.png';

    this.playComment('toggleOn');
  }
};

Darlene.prototype.addImage = function(container) {
  var markup =
      '<div ' +
        'style="position: absolute; bottom: 15px; left: 15px; z-index: 100">' +
        '<img src="' + getPluginsDirectory() + '/darlene/darlene-active.png" width="50px">' +
        '<div id="comment-1" style="position: absolute; top: -10px; left: 45px; color: white; background-color: #3E3E3F; border-radius: 2px; width: 10px; height: 10px"></div>' +
        '<div id="comment-2" style="position: absolute; top: -50px; left: 60px; color: white; background-color: #3E3E3F; padding: 10px; border-radius: 2px; width: 300px"></div>' +
      '</div>';

  var element = domify(markup);

  container.appendChild(element);

  this._image = element.childNodes[0];
  this._commentBox1 = element.childNodes[1];
  this._commentBox2 = element.childNodes[2];

  this._commentBox1.style.visibility = 'hidden';
  this._commentBox2.style.visibility = 'hidden';
};

Darlene.$inject = [ 'eventBus', 'bpmnRules', 'editorActions', 'canvas', 'minimap' ];

module.exports = {
  __init__: [ 'translateComments' ],
  translateComments: [ 'type', Darlene ]
};

},{"min-dom/lib/domify":5}],2:[function(require,module,exports){
var registerBpmnJSPlugin = require('camunda-modeler-plugin-helpers').registerBpmnJSPlugin;
var Darlene = require('./Darlene');

registerBpmnJSPlugin(Darlene);

},{"./Darlene":1,"camunda-modeler-plugin-helpers":3}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){

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

},{}],5:[function(require,module,exports){
module.exports = require('domify');
},{"domify":4}]},{},[2]);
