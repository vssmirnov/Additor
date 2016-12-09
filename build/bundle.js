/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _AudioCtrl = __webpack_require__(1);

	var _AudioCtrl2 = _interopRequireDefault(_AudioCtrl);

	var _OvertoneCtrl = __webpack_require__(9);

	var _OvertoneCtrl2 = _interopRequireDefault(_OvertoneCtrl);

	var _EnvelopeCtrl = __webpack_require__(11);

	var _EnvelopeCtrl2 = _interopRequireDefault(_EnvelopeCtrl);

	var _FilterCtrl = __webpack_require__(15);

	var _FilterCtrl2 = _interopRequireDefault(_FilterCtrl);

	var _DelayCtrl = __webpack_require__(17);

	var _DelayCtrl2 = _interopRequireDefault(_DelayCtrl);

	var _VoicesCtrl = __webpack_require__(18);

	var _VoicesCtrl2 = _interopRequireDefault(_VoicesCtrl);

	var _PresetsCtrl = __webpack_require__(19);

	var _PresetsCtrl2 = _interopRequireDefault(_PresetsCtrl);

	var _MainOutputCtrl = __webpack_require__(21);

	var _MainOutputCtrl2 = _interopRequireDefault(_MainOutputCtrl);

	var _KeyboardCtrl = __webpack_require__(24);

	var _KeyboardCtrl2 = _interopRequireDefault(_KeyboardCtrl);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	(function () {
	  'use strict';

	  var app = function () {

	    /**
	     * adt (additor) is the object whose properties define the controller components
	     */
	    var adt = {
	      synth: {},
	      ot: {},
	      env: {},
	      filter: {},
	      delay: {},
	      output: {},
	      voices: {},
	      kbd: {},
	      presets: {}
	    };

	    /**
	     * Initialize the controllers
	     */
	    (function initControllers() {
	      (0, _AudioCtrl2.default)(adt);
	      (0, _OvertoneCtrl2.default)(adt);
	      (0, _EnvelopeCtrl2.default)(adt);
	      (0, _FilterCtrl2.default)(adt);
	      (0, _DelayCtrl2.default)(adt);
	      (0, _MainOutputCtrl2.default)(adt);
	      (0, _VoicesCtrl2.default)(adt);
	      (0, _KeyboardCtrl2.default)(adt);
	      (0, _PresetsCtrl2.default)(adt);
	    })();
	  }();
	})();

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _ChannelStrip = __webpack_require__(2);

	var _ChannelStrip2 = _interopRequireDefault(_ChannelStrip);

	var _StereoFeedbackDelay = __webpack_require__(3);

	var _StereoFeedbackDelay2 = _interopRequireDefault(_StereoFeedbackDelay);

	var _AdditiveSynth = __webpack_require__(4);

	var _AdditiveSynth2 = _interopRequireDefault(_AdditiveSynth);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	'use strict'; /* ------------------------ */
	/* --- Audio controller --- */
	/* ------------------------ */

	var AudioCtrl = function AudioCtrl(adt) {

	  if (typeof AudioContext !== 'undefined') {
	    adt.audioCtx = new AudioContext();
	  } else if (typeof webkitAudioContext !== 'undefined') {
	    adt.audioCtx = new webkitAudioContext();
	  } else {
	    alert('Error: no Web Audio API detected in this browser');
	  }

	  adt.output.node = new _ChannelStrip2.default({ audioCtx: adt.audioCtx });
	  adt.output.node.connect(adt.audioCtx.destination);

	  adt.delay.node = new _StereoFeedbackDelay2.default({
	    audioCtx: adt.audioCtx,
	    maxDelayTime: 10
	  });
	  adt.delay.node.connect(adt.output.node.input);

	  adt.filter.node = adt.audioCtx.createBiquadFilter();
	  adt.filter.node.connect(adt.delay.node.input);

	  adt.synth.node = new _AdditiveSynth2.default({
	    audioCtx: adt.audioCtx,
	    numVoices: 8,
	    numOvertones: 40
	  });
	  adt.synth.node.connect(adt.filter.node);
	};

	exports.default = AudioCtrl;

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var ChannelStrip = function () {
	  function ChannelStrip(o) {
	    _classCallCheck(this, ChannelStrip);

	    o = o || {};

	    this._audioCtx = o.audioCtx || window.audioCtx || new AudioContext();

	    this._inputGainNode = this._audioCtx.createGain();
	    this._panner = this._audioCtx.createPanner();
	    this._panner.panningModel = 'equalpower';
	    this._panner.distanceModel = 'linear';

	    this._outputGainNode = this._audioCtx.createGain();

	    this._inputGainNode.connect(this._panner);
	    this._panner.connect(this._outputGainNode);

	    this._inputGainNode.gain.value = o.inputGain || 1;
	    this._outputGainNode.gain.value = o.outputGain || 1;

	    this.input = this._inputGainNode;
	    this.output = this._outputGainNode;

	    return this;
	  }

	  /* =================== */
	  /* --- Audio setup --- */
	  /* =================== */

	  /**
	   * Connect this node to a destination
	   * @param {AudioNode} destination - The destination to connect to
	   */


	  _createClass(ChannelStrip, [{
	    key: 'connect',
	    value: function connect(destination) {
	      this.output.connect(destination);
	      return this;
	    }

	    /* =========================== */
	    /* --- Getters and setters --- */
	    /* =========================== */

	    /** Options */

	  }, {
	    key: 'setOptions',
	    value: function setOptions(o) {
	      o = o || {};
	      this.options = o;
	    }

	    /** Input gain */

	  }, {
	    key: 'options',
	    get: function get() {
	      return {
	        inputGain: this.inputGain,
	        outputGain: this.outputGain,
	        pan: this.pan
	      };
	    },
	    set: function set(o) {
	      o = o || {};

	      if (o.inputGain) this.inputGain = o.inputGain;
	      if (o.outputGain) this.outputGain = o.outputGain;
	      if (o.pan) this.pan = o.pan;

	      return this;
	    }
	  }, {
	    key: 'inputGain',
	    get: function get() {
	      return this._inputGainNode.gain.value;
	    },
	    set: function set(newGain) {
	      this._inputGainNode.gain.value = newGain;
	      return this;
	    }

	    /** Pan */

	  }, {
	    key: 'pan',
	    get: function get() {
	      return this._panner.positionX;
	    },
	    set: function set(newPan) {
	      var x = newPan / 2 - 0.5,
	          z = 1 - Math.abs(x);

	      this._panner.setPosition(x, 0, z);
	      return this;
	    }

	    /** Output gain */

	  }, {
	    key: 'outputGain',
	    get: function get() {
	      return this._outputGainNode.gain.value;
	    },
	    set: function set(newGain) {
	      this._outputGainNode.gain.value = newGain;
	      return this;
	    }
	  }]);

	  return ChannelStrip;
	}();

	exports.default = ChannelStrip;

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var StereoFeedbackDelay = function () {

	  /**
	   * Stereo delay with feedback
	   * @param {object} [o] - Options
	   * @param {number} [o.delayTimeL]
	   * @param {number} [o.delayTimeR]
	   * @param {number} [o.feedbackL]
	   * @param {number} [o.feedbackR]
	   * @param {number} [o.crossfeedL]
	   * @param {number} [o.crossfeedR]
	   * @param {number} [o.dryMixL]
	   * @param {number} [o.dryMixR]
	   * @param {number} [o.wetMixL]
	   * @param {number} [o.wetMixR]
	   */
	  function StereoFeedbackDelay(o) {
	    _classCallCheck(this, StereoFeedbackDelay);

	    o = o || {};

	    this._audioCtx = o.audioCtx || window.audioCtx || new AudioContext();

	    this._maxDelayTime = o.maxDelayTime || 10;

	    this._input = this._audioCtx.createGain();
	    this._channelSplitter = this._audioCtx.createChannelSplitter(2);
	    this._dryMixL = this._audioCtx.createGain();
	    this._dryMixR = this._audioCtx.createGain();
	    this._wetMixL = this._audioCtx.createGain();
	    this._wetMixR = this._audioCtx.createGain();
	    this._delayL = this._audioCtx.createDelay(this._maxDelayTime);
	    this._delayR = this._audioCtx.createDelay(this._maxDelayTime);
	    this._feedbackL = this._audioCtx.createGain();
	    this._feedbackR = this._audioCtx.createGain();
	    this._crossfeedL = this._audioCtx.createGain();
	    this._crossfeedR = this._audioCtx.createGain();
	    this._channelMerger = this._audioCtx.createChannelMerger(2);
	    this._output = this._audioCtx.createGain();

	    this._connectAudioNodes();
	    this._setAudioDefaults(o);

	    return this;
	  }

	  _createClass(StereoFeedbackDelay, [{
	    key: '_connectAudioNodes',
	    value: function _connectAudioNodes() {
	      this._input.connect(this._channelSplitter);
	      this._channelSplitter.connect(this._dryMixL, 0);
	      this._channelSplitter.connect(this._dryMixR, 1);
	      this._channelSplitter.connect(this._delayL, 0);
	      this._channelSplitter.connect(this._delayR, 1);
	      this._delayL.connect(this._feedbackL);
	      this._delayR.connect(this._feedbackR);
	      this._feedbackL.connect(this._delayL);
	      this._feedbackR.connect(this._delayR);
	      this._delayL.connect(this._crossfeedR);
	      this._delayR.connect(this._crossfeedL);
	      this._crossfeedL.connect(this._delayL);
	      this._crossfeedR.connect(this._delayR);
	      this._delayL.connect(this._wetMixL);
	      this._delayR.connect(this._wetMixR);
	      this._dryMixL.connect(this._channelMerger, 0, 0);
	      this._dryMixR.connect(this._channelMerger, 0, 1);
	      this._wetMixL.connect(this._channelMerger, 0, 0);
	      this._wetMixR.connect(this._channelMerger, 0, 1);
	      this._channelMerger.connect(this._output);

	      return this;
	    }
	  }, {
	    key: '_setAudioDefaults',
	    value: function _setAudioDefaults(o) {
	      o = o || {};

	      this._input.gain.value = 1;
	      this._delayL.delayTime.value = o.delayTimeL || 0.5;
	      this._delayR.delayTime.value = o.delayTimeR || 0.5;
	      this._dryMixL.gain.value = o.dryMixL || 1;
	      this._dryMixR.gain.value = o.dryMixR || 1;
	      this._wetMixL.gain.value = o.wetMixL || 0.2;
	      this._wetMixR.gain.value = o.wetMixR || 0.2;
	      this._feedbackL.gain.value = o.feedbackL || 0.1;
	      this._feedbackR.gain.value = o.feedbackR || 0.1;
	      this._crossfeedL.gain.value = o.crossfeedL || 0;
	      this._crossfeedR.gain.value = o.crossfeedR || 0;
	      this._output.gain.value = 1;

	      return this;
	    }
	  }, {
	    key: 'connect',
	    value: function connect(destination) {
	      this._output.connect(destination);
	      return this;
	    }

	    /* =========================== */
	    /* --- Getters and setters --- */
	    /* =========================== */

	  }, {
	    key: 'input',
	    get: function get() {
	      return this._input;
	    }

	    /** Delay time left */

	  }, {
	    key: 'delayTimeL',
	    get: function get() {
	      return this._delayL.delayTime;
	    },
	    set: function set(time) {
	      this._delayL.delayTime.value = time;
	      return this;
	    }

	    /** Delay time right */

	  }, {
	    key: 'delayTimeR',
	    get: function get() {
	      return this._delayR.delayTime;
	    },
	    set: function set(time) {
	      this._delayR.delayTime.value = time;
	      return this;
	    }

	    /** Feedback L */

	  }, {
	    key: 'feedbackL',
	    get: function get() {
	      return this._feedbackL.gain;
	    },
	    set: function set(gain) {
	      this._feedbackL.gain.value = gain;
	      return this;
	    }

	    /** Feedback R */

	  }, {
	    key: 'feedbackR',
	    get: function get() {
	      return this._feedbackR.gain;
	    },
	    set: function set(gain) {
	      this._feedbackR.gain.value = gain;
	      return this;
	    }

	    /** Cross-feed L */

	  }, {
	    key: 'crossfeedL',
	    get: function get() {
	      return this._crossfeedL.gain;
	    },
	    set: function set(gain) {
	      this._crossfeedL.gain.value = gain;
	      return this;
	    }

	    /** Cross-feed R */

	  }, {
	    key: 'crossfeedR',
	    get: function get() {
	      return this._crossfeedR.gain;
	    },
	    set: function set(gain) {
	      this._crossfeedR.gain.value = gain;
	      return this;
	    }

	    /** Dry mix L */

	  }, {
	    key: 'dryMixL',
	    get: function get() {
	      return this._dryMixL.gain;
	    },
	    set: function set(gain) {
	      this._dryMixL.gain.value = gain;
	      return this;
	    }

	    /** Dry mix R */

	  }, {
	    key: 'dryMixR',
	    get: function get() {
	      return this._dryMixR.gain;
	    },
	    set: function set(gain) {
	      this._dryMixR.gain.value = gain;
	      return this;
	    }

	    /** Wet mix L */

	  }, {
	    key: 'wetMixL',
	    get: function get() {
	      return this._wetMixL.gain;
	    },
	    set: function set(gain) {
	      this._wetMixL.gain.value = gain;
	      return this;
	    }

	    /** Wet mix R */

	  }, {
	    key: 'wetMixR',
	    get: function get() {
	      return this._wetMixR.gain;
	    },
	    set: function set(gain) {
	      this._wetMixR.gain.value = gain;
	      return this;
	    }
	  }]);

	  return StereoFeedbackDelay;
	}();

	exports.default = StereoFeedbackDelay;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _AdditiveSynthVoice = __webpack_require__(5);

	var _AdditiveSynthVoice2 = _interopRequireDefault(_AdditiveSynthVoice);

	var _ChannelStrip = __webpack_require__(2);

	var _ChannelStrip2 = _interopRequireDefault(_ChannelStrip);

	var _util = __webpack_require__(8);

	var _util2 = _interopRequireDefault(_util);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	'use strict';

	var AdditiveSynth = function () {
	  function AdditiveSynth(o) {
	    _classCallCheck(this, AdditiveSynth);

	    o = o || {};

	    this._audioCtx = o.audioCtx || window.audioCtx || new AudioContext();

	    var numVoices = o.numVoices || 16;
	    this._numOvertones = o.numOvertones || 20;

	    this._voices = [];
	    this._availableVoices = [];
	    this._busyVoices = []; // { voiceNum: {number}, pitch: {number} }
	    this._channelStrip = new _ChannelStrip2.default({ audioCtx: this._audioCtx });

	    for (var i = 0; i < numVoices; i++) {
	      this._voices.push(new _AdditiveSynthVoice2.default({ audioCtx: this._audioCtx,
	        numOvertones: this._numOvertones }));
	      this._voices[i].connect(this._channelStrip.input);
	      this._availableVoices.push(i);
	    }

	    this.output = this._channelStrip.output;
	  }

	  /* =================== */
	  /* --- Audio setup --- */
	  /* =================== */

	  /**
	   * Connect this node to a destination
	   * @param {AudioNode} destination - The destination to connect to
	   */


	  _createClass(AdditiveSynth, [{
	    key: 'connect',
	    value: function connect(destination) {
	      this.output.connect(destination);
	      return this;
	    }

	    /* =========================== */
	    /* --- Getters and setters --- */
	    /* =========================== */

	    /** Number of voices */

	  }, {
	    key: 'setNumVoices',
	    value: function setNumVoices(newNumVoices) {
	      this.numVoices = newNumVoices;
	    }

	    /** Number of overtones */

	  }, {
	    key: 'setNumOvertones',
	    value: function setNumOvertones(newNumOvertones) {
	      this.numOvertones = newNumOvertones;
	    }

	    /** Gain */

	  }, {
	    key: 'setGain',
	    value: function setGain(newGain) {
	      this.gain = newGain;
	    }

	    /** Pan */

	  }, {
	    key: 'setPan',
	    value: function setPan(newPan) {
	      this.pan = newPan;
	    }

	    /** Get overtone amplitude */

	  }, {
	    key: 'getOvertoneAmplitude',
	    value: function getOvertoneAmplitude(voiceNum, otNum) {
	      this._voices[voiceNum].getOvertoneAmplitude(otNum);
	      return this;
	    }

	    /** Overtone amplitude */

	  }, {
	    key: 'setOvertoneAmplitude',
	    value: function setOvertoneAmplitude(voiceNum, otNum, newAmp) {
	      this._voices[voiceNum].setOvertoneAmplitude(otNum, newAmp);
	      return this;
	    }

	    /* ========================= */
	    /* --- Envelope controls --- */
	    /* ========================= */

	    /** Attack envelope */

	  }, {
	    key: 'setOvertoneAttackEnvelope',


	    /** Set the attack envelope for an overtone
	     *  @param {number} otNum - Number of overtone for which to set envelope
	     *  @param {array} newEnv - 2D array representing the new envelope
	     */
	    value: function setOvertoneAttackEnvelope(otNum, newEnv) {
	      this._voices.forEach(function (voice) {
	        voice.setOvertoneAttackEnvelope(otNum, newEnv);
	      });
	      return this;
	    }

	    /** Set the release envelope for an overtone
	     *  @param {number} otNum - Number of overtone for which to set envelope
	     *  @param {array} newEnv - 2D array representing the new envelope
	     */

	  }, {
	    key: 'setOvertoneReleaseEnvelope',
	    value: function setOvertoneReleaseEnvelope(otNum, newEnv) {
	      this._voices.forEach(function (voice) {
	        voice.setOvertoneReleaseEnvelope(otNum, newEnv);
	      });
	      return this;
	    }

	    /**
	     * Play a note using the current attack envelope
	     * @param {(number|string)} note - MIDI pitch value or note name (i.e. A0 or F#8)
	     */

	  }, {
	    key: 'playNote',
	    value: function playNote(note) {
	      var noteNameFormat = /^([a-g]|[A-G])(#|b)?([0-9]|10)$/;
	      var selectedVoice = -1;
	      var freq = -1;

	      // check for correct note format and convert to freq
	      if (typeof note === 'number' && note >= 0 && note <= 127) {
	        freq = _util2.default.midiToFreq(note);
	      } else if (typeof note === 'string' && noteNameFormat.test(note) === true) {
	        note = _util2.default.noteNameToMidi(note); // convert to MIDI so we can keep track of active note in _busyVoices
	        freq = _util2.default.midiToFreq(note);
	      }

	      // if the correct format for note was received
	      if (freq !== -1) {
	        //pick a voice
	        if (this._availableVoices.length > 0) {
	          selectedVoice = this._availableVoices.shift();
	        } else {
	          selectedVoice = this._busyVoices.shift().voiceNum;
	          this.releaseVoice(selectedVoice);
	        }
	        this._busyVoices.push({ voiceNum: selectedVoice, note: note });

	        this.attackVoice(selectedVoice, freq);
	      }
	    }

	    /**
	     * Release a currently playing note
	     * @param {(number|string)} note - MIDI pitch value or note name (i.e. A0 or F#8)
	     */

	  }, {
	    key: 'releaseNote',
	    value: function releaseNote(note) {
	      var noteNameFormat = /^([a-g]|[A-G])(#|b)?([0-9]|10)$/;
	      var selectedVoice = -1;

	      // check for correct note format and convert to freq
	      if (typeof note === 'number' && note >= 0 && note <= 127) {} else if (typeof note === 'string' && noteNameFormat.test(note) === true) {
	        note = _util2.default.noteNameToMidi(note);
	      } else {
	        note = -1;
	      }

	      if (note !== -1) {
	        var selectedBusyNodeIndex = this._busyVoices.findIndex(function (busyVoice) {
	          return busyVoice.note === note;
	        });

	        if (selectedBusyNodeIndex !== -1) {
	          selectedVoice = this._busyVoices[selectedBusyNodeIndex].voiceNum;

	          this._availableVoices.push(selectedVoice);
	          this._busyVoices.splice(selectedBusyNodeIndex, 1);
	        }
	      }

	      if (selectedVoice !== -1) {
	        this.releaseVoice(selectedVoice);
	      } else return this;
	    }

	    /**
	     * Execute the attack for a given voice with a given frequency
	     **/

	  }, {
	    key: 'attackVoice',
	    value: function attackVoice(voiceNum, freq) {
	      this._voices[voiceNum].setFrequency(freq);
	      this._voices[voiceNum].attack();
	    }

	    /**
	     * Execute the release for a given voice
	     **/

	  }, {
	    key: 'releaseVoice',
	    value: function releaseVoice(voiceNum) {
	      this._voices[voiceNum].release();
	    }
	  }, {
	    key: 'numVoices',
	    get: function get() {
	      return this._voices.length;
	    },
	    set: function set(newNumVoices) {
	      var _this = this;

	      // if the new number of voices is more than previous number, we add voices
	      if (newNumVoices > this.numVoices) {
	        for (var i = this.numVoices; i < newNumVoices; i++) {
	          this._voices.push(new _AdditiveSynthVoice2.default({
	            audioCtx: this._audioCtx,
	            numOvertones: this._numOvertones
	          }));
	          this._voices[i].connect(this._channelStrip.input);
	          this._availableVoices.push(i);
	        }

	        // if the new number is less than previous, remove voices
	      } else if (newNumVoices < this.numVoices) {
	        var _deleteAvailableVoices = function _deleteAvailableVoices(numVoicesToDelete) {
	          var _loop = function _loop(_i) {
	            var voiceToDelete = _this._availableVoices[_i];

	            _this._voices.splice(voiceToDelete, 1);
	            _this._availableVoices.splice(_i, 1);

	            // remap the available and busy voices because we modified the voices stack
	            _this._availableVoices = _this._availableVoices.map(function (voice) {
	              return voice > voiceToDelete ? voice - 1 : voice;
	            });
	            _this._busyVoices = _this._busyVoices.map(function (voice) {
	              return {
	                voiceNum: voice.voiceNum > voiceToDelete ? voice.voiceNum - 1 : voice.voiceNum,
	                pitch: voice.pitch
	              };
	            });
	          };

	          for (var _i = 0; _i < numVoicesToDelete; _i++) {
	            _loop(_i);
	          }
	        };

	        var _deleteBusyVoices = function _deleteBusyVoices(numBusyVoicesToDelete) {
	          var _loop2 = function _loop2(_i2) {
	            var voiceToDelete = _this._busyVoices[_i2].voiceNum;

	            _this.releaseVoice(voiceToDelete);
	            _this._voices.splice(voiceToDelete, 1);
	            _this._busyVoices.splice(_i2, 1);

	            // remap the busy voices pointer stack because we modified the voices stack
	            _this._busyVoices = _this._busyVoices.map(function (voice) {
	              return {
	                voiceNum: voice.voiceNum > voiceToDelete ? voice.voiceNum - 1 : voice.voiceNum,
	                pitch: voice.pitch
	              };
	            });
	          };

	          // delete the required number of busy voices
	          for (var _i2 = 0; _i2 < numBusyVoicesToDelete; _i2++) {
	            _loop2(_i2);
	          }
	        };

	        var numVoicesToDelete = this.numVoices - newNumVoices;
	        var numAvailableVoices = this._availableVoices.length;

	        // if the number of voices to delete is less then or equal to the number of available (inactive) voices, delete these voices
	        if (numVoicesToDelete <= numAvailableVoices) {
	          _deleteAvailableVoices(numVoicesToDelete);
	        }

	        // else delete all available (inactive) voices and also required number of busy voices
	        else {
	            var numBusyVoicesToDelete = numVoicesToDelete - numAvailableVoices;

	            _deleteAvailableVoices(numAvailableVoices);
	            _deleteBusyVoices(numBusyVoicesToDelete);
	          }
	      }
	      console.log('newNumVoices: ' + this.numVoices);
	      return this;
	    }
	  }, {
	    key: 'numOvertones',
	    get: function get() {
	      return this._numOvertones;
	    },
	    set: function set(newNumOvertones) {
	      this._voices.forEach(function (voice) {
	        voice.numOvertones = newNumOvertones;
	      });
	      this._numOvertones = newNumOvertones;
	      return this;
	    }
	  }, {
	    key: 'gain',
	    get: function get() {
	      return this._channelStrip.outputGain;
	    },
	    set: function set(newGain) {
	      this._channelStrip.outputGain = newGain;
	      return this;
	    }
	  }, {
	    key: 'pan',
	    get: function get() {
	      return this._channelStrip.pan;
	    },
	    set: function set(newPan) {
	      this._channelStrip.pan = newPan;
	      return this;
	    }
	  }, {
	    key: 'attackEnvelope',
	    set: function set(newEnv) {
	      this._voices.forEach(function (voice) {
	        voice.attackEnvelope = newEnv;
	      });
	    }

	    /** Release envelope */

	  }, {
	    key: 'releaseEnvelope',
	    set: function set(newEnv) {
	      this._voices.forEach(function (voice) {
	        voice.releaseEnvelope = newEnv;
	      });
	    }
	  }]);

	  return AdditiveSynth;
	}();

	exports.default = AdditiveSynth;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _ChannelStrip = __webpack_require__(2);

	var _ChannelStrip2 = _interopRequireDefault(_ChannelStrip);

	var _Envelope = __webpack_require__(6);

	var _Envelope2 = _interopRequireDefault(_Envelope);

	var _Overtone = __webpack_require__(7);

	var _Overtone2 = _interopRequireDefault(_Overtone);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	'use strict';

	var AdditiveSynthVoice = function () {
	  function AdditiveSynthVoice(o) {
	    _classCallCheck(this, AdditiveSynthVoice);

	    o = o || {};

	    this._audioCtx = o.audioCtx || window.audioCtx || new AudioContext();

	    this._channelStrip = new _ChannelStrip2.default({ audioCtx: this._audioCtx });
	    this._envelope = new _Envelope2.default({ audioCtx: this._audioCtx });

	    var numOvertones = o.numOvertones || o.numberOfOvertones || 20;
	    this._overtones = [];
	    for (var i = 0; i < numOvertones; i++) {
	      this._overtones.push(new _Overtone2.default({ audioCtx: this._audioCtx }));
	      this._overtones[i].connect(this._envelope.input);
	      this._envelope.connect(this._channelStrip.input);
	      this._overtones[i].gain = 1 / numOvertones;
	    }

	    this.output = this._channelStrip.output;

	    // this.frequency = o.frequency || o.freq || 440;
	    // this.pan = o.pan || 0; // -1: hard left, 1: hard right
	    // this.gain = o.gain || 1;
	  }

	  /* =================== */
	  /* --- Audio setup --- */
	  /* =================== */

	  /**
	   * Connect this node to a destination
	   * @param {AudioNode} destination - The destination to connect to
	   */


	  _createClass(AdditiveSynthVoice, [{
	    key: 'connect',
	    value: function connect(destination) {
	      this.output.connect(destination);
	      return this;
	    }

	    /* =========================== */
	    /* --- Getters and setters --- */
	    /* =========================== */

	    /** Options */

	  }, {
	    key: 'setOptions',
	    value: function setOptions(o) {
	      o = o || {};
	      this.options = o;
	    }

	    /** Number of overtones (including the fundamental) */

	  }, {
	    key: 'setNumOvertones',
	    value: function setNumOvertones(newNumOvertones) {
	      this.numOvertones = newNumOvertones;
	    }

	    /** Fundamental frequency */

	  }, {
	    key: 'setFrequency',
	    value: function setFrequency(newFreq) {
	      this.frequency = newFreq;
	    }

	    /** Gain */

	  }, {
	    key: 'setGain',
	    value: function setGain(newGain) {
	      this.gain = newGain;
	    }

	    /** Pan */

	  }, {
	    key: 'setPan',
	    value: function setPan(newPan) {
	      this.pan = newPan;
	    }

	    /** Get overtone amplitude
	     * @param {number} otNum - Overtone number (0 for the fundamental).
	     */

	  }, {
	    key: 'getOvertoneAmplitude',
	    value: function getOvertoneAmplitude(otNum) {
	      return this._overtones[otNum].amplitude;
	    }
	    /** Set overtone amplitude
	     * @param {number} otNum - Overtone number (0 for the fundamental).
	     * @param {number} newAmp - New amplitude (useful range: 0.0 - 1.0).
	     */

	  }, {
	    key: 'setOvertoneAmplitude',
	    value: function setOvertoneAmplitude(otNum, newAmp) {
	      this._overtones[otNum].amplitude = newAmp;
	      return this;
	    }

	    /** Set overtone amplitudes by a formula function
	     * @param {function} func - The function specifying the amplitude of each overtone number n.
	     */

	  }, {
	    key: 'setOvertoneAmplitudesByFormula',
	    value: function setOvertoneAmplitudesByFormula(func) {
	      for (var n = this.numOvertones - 1; n >= 0; n--) {
	        this.setOvertoneAmplitude(n, func(n + 1));
	      }
	      return this;
	    }

	    /** Attack envelope */

	  }, {
	    key: 'setAttackEnvelope',
	    value: function setAttackEnvelope(newEnv) {
	      this.attackEnvelope = newEnv;
	    }

	    /** Release envelope */

	  }, {
	    key: 'setReleaseEnvelope',
	    value: function setReleaseEnvelope(newEnv) {
	      this.releaseEnvelope = newEnv;
	    }

	    /** Set the attack envelope for an overtone
	     *  @param {number} otNum - Number of overtone for which to set envelope
	     *  @param {array} newEnv - 2D array representing the new envelope
	     */

	  }, {
	    key: 'setOvertoneAttackEnvelope',
	    value: function setOvertoneAttackEnvelope(otNum, newEnv) {
	      this._overtones[otNum].attackEnvelope = newEnv;
	      return this;
	    }

	    /** Set the release envelope for an overtone
	     *  @param {number} otNum - Number of overtone for which to set envelope
	     *  @param {array} newEnv - 2D array representing the new envelope
	     */

	  }, {
	    key: 'setOvertoneReleaseEnvelope',
	    value: function setOvertoneReleaseEnvelope(otNum, newEnv) {
	      this._overtones[otNum].releaseEnvelope = newEnv;
	      return this;
	    }

	    /* ========================= */
	    /* --- Envelope controls --- */
	    /* ========================= */

	    /**
	     * Execute the attack envelope.
	     * Individual envelopes are executed for each overtone, and the envelope for this voice is executed.
	     */

	  }, {
	    key: 'attack',
	    value: function attack(o) {
	      if (o) this.options = o;

	      for (var i = this.numOvertones - 1; i >= 0; i--) {
	        this._overtones[i].attack();
	      }
	      this._envelope.attack();
	    }

	    /**
	     * Execute the release envelope
	     * Individual envelopes are executed for each overtone, and the envelope for this voice is executed.
	     */

	  }, {
	    key: 'release',
	    value: function release() {
	      for (var i = this.numOvertones - 1; i >= 0; i--) {
	        this._overtones[i].release();
	      }
	      this._envelope.release();
	    }
	  }, {
	    key: 'options',
	    get: function get() {
	      return {
	        numOvertones: this.numOvertones,
	        frequency: this.frequency,
	        gain: this.gain,
	        pan: this.pan
	      };
	    },
	    set: function set(o) {
	      o = o || {};

	      if (o.numOvertones) this.numOvertones = o.numOvertones;
	      if (o.frequency) this.frequency = o.frequency;
	      if (o.gain) this.gain = o.gain;
	      if (o.pan) this.pan = o.pan;

	      return this;
	    }
	  }, {
	    key: 'numOvertones',
	    get: function get() {
	      return this._overtones.length;
	    },
	    set: function set(newNumOvertones) {
	      if (newNumOvertones > this.numOvertones) {
	        var fundFreq = this.frequency;
	        for (var i = this.numOvertones; i < newNumOvertones && (i + 1) * fundFreq < this._audioCtx.sampleRate / 2; i++) {
	          this._overtones.push(new _Overtone2.default({ audioCtx: this._audioCtx }));
	          this._overtones[i].frequency = (i + 1) * fundFreq;
	          this._overtones[i].gain = 1 / newNumOvertones;
	        }
	      } else if (newNumOvertones < this.numOvertones) {
	        for (var i = this.numOvertones; i > this.newNumOvertones; i--) {
	          this._overtones.pop();
	          this._overtones[i].gain = 1 / newNumOvertones;
	        }
	      }
	      return this;
	    }
	  }, {
	    key: 'frequency',
	    get: function get() {
	      return this._overtones[0].frequency;
	    },
	    set: function set(newFreq) {
	      var freqCeil = this._audioCtx.sampleRate / 2;
	      var numOvertones = this.numOvertones;

	      for (var i = this.numOvertones - 1; i >= 0; i--) {
	        if ((i + 1) * newFreq < freqCeil) {
	          this._overtones[i].frequency = (i + 1) * newFreq;
	          this._overtones[i].gain = 1 / numOvertones;
	        } else {
	          this._overtones[i].gain = 0;
	        }
	      }
	      return this;
	    }
	  }, {
	    key: 'gain',
	    get: function get() {
	      return this._channelStrip.outputGain;
	    },
	    set: function set(newGain) {
	      this._channelStrip.outputGain = newGain;
	      return this;
	    }
	  }, {
	    key: 'pan',
	    get: function get() {
	      return this._channelStrip.pan;
	    },
	    set: function set(newPan) {
	      this._channelStrip.pan = newPan;
	      return this;
	    }
	  }, {
	    key: 'attackEnvelope',
	    get: function get() {
	      return this._envelope.attackEnvelope;
	    },
	    set: function set(newEnv) {
	      this._envelope.attackEnvelope = newEnv;
	      return this;
	    }
	  }, {
	    key: 'releaseEnvelope',
	    get: function get() {
	      return this._envelope.releaseEnvelope;
	    },
	    set: function set(newEnv) {
	      this._envelope.releaseEnvelope = newEnv;
	      return this;
	    }
	  }]);

	  return AdditiveSynthVoice;
	}();

	exports.default = AdditiveSynthVoice;

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Envelope = function () {

	  /**
	   * Envelope
	   * <p>
	   * Envelope values are specified as 2D arrays in the form
	   * <b>[ [t(0), a(0)], [t(1), a(1)], ... [t(i), a(i)] ]</b>,
	   * where <b>t(i)</b> specifies the time, in seconds,
	   * and <b>a(i)</b> specifies the amplitude of the envelope at the vertex <b>i</b>.
	   * </p>
	   * @param {object} o - Options
	   * @param {AudioContext} o.audioCtx - The audio context to be used.
	   * @param {array} o.attackEnvelope - 2D array specifying the attack envelope
	   * @param {array} o.releaseEnvelope - 2D array specifying the release envelope
	   */
	  function Envelope(o) {
	    _classCallCheck(this, Envelope);

	    o = o || {};

	    this._audioCtx = o.audioCtx || window.audioCtx || new AudioContext();

	    this._envGain = this._audioCtx.createGain();
	    this._envGain.gain.value = 0;

	    this.input = this._envGain;
	    this.output = this._envGain;

	    this._aEnv = o.aEnv || o.attackEnv || o.attackEnvelope || o.aEnvelope || [[0, 0], [0.05, 1], [1, 1]];
	    this._rEnv = o.rEnv || o.releaseEnv || o.releaseEnvelope || o.rEnvelope || [[0, 1], [0.5, 1], [1, 0]];
	  }

	  /* =================== */
	  /* --- Audio setup --- */
	  /* =================== */

	  /**
	   * Connect this node to a destination
	   * @param {AudioNode} destination - The destination to connect to
	   */


	  _createClass(Envelope, [{
	    key: 'connect',
	    value: function connect(destination) {
	      this.output.connect(destination);
	      return this;
	    }

	    /* ============================= */
	    /* --- Get/set the envelopes --- */
	    /* ============================= */

	    /** The attack envelope */

	  }, {
	    key: 'attack',


	    /* ========================== */
	    /* --- Envelope execution --- */
	    /* ========================== */

	    /** Execute the attack envelope */
	    value: function attack() {
	      var startTime = this._audioCtx.currentTime;
	      var env = this._aEnv;
	      var envLength = env.length;

	      // ramp from 0 to the first value in the envelope
	      this._envGain.gain.setValueAtTime(0, startTime);
	      this._envGain.gain.linearRampToValueAtTime(env[0][1], startTime + env[0][0]);

	      // ramp to each subsequent value
	      for (var i = 0; i < envLength - 1; i++) {
	        this._envGain.gain.setValueAtTime(env[i][1], startTime + env[i][0]);
	        this._envGain.gain.linearRampToValueAtTime(env[i + 1][1], startTime + env[i + 1][0]);
	      }

	      // set the final value
	      this._envGain.gain.setValueAtTime(env[envLength - 1][1], startTime + env[envLength - 1][0]);
	    }

	    /** Execute the release envelope */

	  }, {
	    key: 'release',
	    value: function release() {
	      var startTime = this._audioCtx.currentTime;
	      var env = this._rEnv;
	      var envLength = env.length;

	      // cancel scheduled values in case attack is still happening
	      this._envGain.gain.cancelScheduledValues(startTime);

	      // ramp to each subsequent value
	      for (var i = 0; i < envLength - 1; i++) {
	        this._envGain.gain.setValueAtTime(env[i][1], startTime + env[i][0]);
	        this._envGain.gain.linearRampToValueAtTime(env[i + 1][1], startTime + env[i + 1][0]);
	      }

	      // if the gain value at the end is not 0, ramp it down to 0 in 1ms
	      if (env[envLength - 1][1] !== 0) {
	        this._envGain.gain.linearRampToValueAtTime(0, startTime + env[envLength - 1][0] + 0.001);
	      }
	    }
	  }, {
	    key: 'attackEnvelope',
	    get: function get() {
	      return this._aEnv;
	    },
	    set: function set(newEnv) {
	      this._aEnv = newEnv;
	      return this;
	    }

	    /** The release envelope */

	  }, {
	    key: 'releaseEnvelope',
	    get: function get() {
	      return this._rEnv;
	    },
	    set: function set(newEnv) {
	      this._rEnv = newEnv;
	      return this;
	    }
	  }]);

	  return Envelope;
	}();

	exports.default = Envelope;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _ChannelStrip = __webpack_require__(2);

	var _ChannelStrip2 = _interopRequireDefault(_ChannelStrip);

	var _Envelope = __webpack_require__(6);

	var _Envelope2 = _interopRequireDefault(_Envelope);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	'use strict';

	var Overtone = function () {
	  function Overtone(o) {
	    _classCallCheck(this, Overtone);

	    o = o || {};

	    this._audioCtx = o.audioCtx || window.audioCtx || new AudioContext();

	    this._oscillator = this._audioCtx.createOscillator();
	    this._envelope = new _Envelope2.default({ audioCtx: this._audioCtx });
	    this._channelStrip = new _ChannelStrip2.default({ audioCtx: this._audioCtx });

	    this._oscillator.connect(this._envelope.input);
	    this._envelope.connect(this._channelStrip.input);

	    this._oscillator.start();

	    this.output = this._channelStrip.output;

	    // this.frequency = o.frequency || 440;
	    // this.pan = o.pan || 1;
	    // this.amplitude = o.amplitude || 1;
	  }

	  /* =========================== */
	  /* --- Getters and setters --- */
	  /* =========================== */

	  _createClass(Overtone, [{
	    key: 'setOptions',
	    value: function setOptions(o) {
	      o = o || {};
	      this.options = o;
	    }
	  }, {
	    key: 'connect',


	    /* =================== */
	    /* --- Audio setup --- */
	    /* =================== */

	    /**
	     * Connect this node to a destination
	     * @param {AudioNode} destination - The destination to connect to
	     */
	    value: function connect(destination) {
	      this.output.connect(destination);
	      return this;
	    }

	    /* ========================= */
	    /* --- Envelope controls --- */
	    /* ========================= */

	    /** Execute the attack envelope */

	  }, {
	    key: 'attack',
	    value: function attack() {
	      this._envelope.attack();
	    }

	    /** Execute the release envelope */

	  }, {
	    key: 'release',
	    value: function release() {
	      this._envelope.release();
	    }
	  }, {
	    key: 'options',
	    get: function get() {
	      return {
	        audioCtx: audioCtx,
	        frequency: this.frequency,
	        pan: this.pan,
	        amplitude: this.amplitude,
	        attackEnvelope: this.attackEnvelope,
	        releaseEnvelope: this.releaseEnvelope
	      };
	    },
	    set: function set(o) {
	      o = o || {};

	      if (o.frequency) this.frequency = o.frequency;
	      if (o.pan) this.pan = o.pan;
	      if (o.amplitude) this.amplitude = o.amplitude;
	      if (o.attackEnvelope) this.attackEnvelope = o.attackEnvelope;
	      if (o.releaseEnvelope) this.releaseEnvelope = o.releaseEnvelope;

	      return this;
	    }
	  }, {
	    key: 'audioCtx',
	    get: function get() {
	      return this._audioCtx;
	    }

	    /** Oscillator frequency */

	  }, {
	    key: 'frequency',
	    get: function get() {
	      return this._oscillator.frequency;
	    },
	    set: function set(newFreq) {
	      var curTime = this._audioCtx.currentTime;
	      this._oscillator.frequency.value = newFreq;
	      return this;
	    }

	    /** Pan */

	  }, {
	    key: 'pan',
	    get: function get() {
	      return this._channelStrip.pan;
	    },
	    set: function set(newPan) {
	      this._channelStrip.pan = newPan;
	      return this;
	    }

	    /** Overtone amplitude */

	  }, {
	    key: 'amplitude',
	    get: function get() {
	      return this._channelStrip.inputGain;
	    },
	    set: function set(newAmp) {
	      this._channelStrip.inputGain = newAmp;
	      return this;
	    }

	    /** Overtone output gain (used for balancing volume when several overtones are used in a voice) */

	  }, {
	    key: 'gain',
	    get: function get() {
	      return this._channelStrip.outputGain;
	    },
	    set: function set(newGain) {
	      this._channelStrip.outputGain = newGain;
	      return this;
	    }

	    /** Attack envelope */

	  }, {
	    key: 'attackEnvelope',
	    get: function get() {
	      return this._envelope.attackEnvelope;
	    },
	    set: function set(newEnv) {
	      this._envelope.attackEnvelope = newEnv;
	      return this;
	    }

	    /** Release envelope */

	  }, {
	    key: 'releaseEnvelope',
	    get: function get() {
	      return this._envelope.releaseEnvelope;
	    },
	    set: function set(newEnv) {
	      this._envelope.releaseEnvelope = newEnv;
	      return this;
	    }
	  }]);

	  return Overtone;
	}();

	exports.default = Overtone;

/***/ },
/* 8 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var util = {};

	/**
	 * Convert MIDI pitch to frequency
	 * @param {number} midiPitch - The midi pitch number.
	 * @param {number} [a4tuning=440] - Tuning of the note A4 (midi pitch 69) in Hz, 440Hz by default.
	 * @return {number} freq - Frequency for the given MIDI pitch.
	 */
	util.midiToFreq = function (midiPitch, a4tuning) {
	  var a4tuning = a4tuning || 440;
	  var freq = -1;

	  if (midiPitch !== -1) freq = Math.pow(2, (midiPitch - 69) / 12) * 440;
	  return freq;
	};

	/**
	 * Convert note name to MIDI pitch
	 * @param {string} noteName - The note name to convert
	 * @return {number} midiPitch - MIDI pitch for the given note name. Return -1 if invalid argument format.
	 */
	util.noteNameToMidi = function (noteName) {
	  var noteNameFormat = /^([a-g]|[A-G])(#|b)?([0-9]|10)$/;

	  if (noteNameFormat.test(noteName) === false) {
	    console.log('util.noteNameToMidi: invalid note name format');
	    return -1;
	  } else {
	    var capture = noteNameFormat.exec(noteName);

	    var note = capture[1];
	    var accidental = capture[2];
	    var octave = capture[3];

	    var noteFundamentalMap = {
	      'A': 9,
	      'a': 9,
	      'B': 11,
	      'b': 11,
	      'C': 0,
	      'c': 0,
	      'D': 2,
	      'd': 2,
	      'E': 4,
	      'e': 4,
	      'F': 5,
	      'f': 5,
	      'G': 7,
	      'g': 7
	    };

	    var noteFundamental = noteFundamentalMap[note];

	    if (accidental === '#') {
	      noteFundamental++;
	    } else if (accidental === 'b') {
	      noteFundamental--;
	    }

	    var midiPitch = noteFundamental + 12 * octave;

	    return midiPitch;
	  }
	};

	/**
	 * Convert note name to frequency
	 * @param {string} noteName - The note name to convert
	 * @param {number} [a4tuning=440] - Tuning of the note A4 (midi pitch 69) in Hz, 440Hz by default.
	 * @return {number} freq - Frequency for the given MIDI pitch.
	 */
	util.noteNameToFreq = function (noteName, a4tuning) {
	  var a4tuning = a4tuning || 440;
	  return util.midiToFreq(util.noteNameToMidi(noteName), a4tuning);
	};

	exports.default = util;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _Histogram = __webpack_require__(10);

	var _Histogram2 = _interopRequireDefault(_Histogram);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	'use strict'; /* --------------------------- */
	/* --- Overtone controller --- */
	/* --------------------------- */

	var OvertoneCtrl = function OvertoneCtrl(adt) {

	    // create a new histogram UI element
	    adt.ot.histo = new _Histogram2.default({
	        container: document.querySelector('#additor .ot-ctrl .otHisto'),
	        numBins: adt.synth.node.numOvertones,
	        minValue: 0,
	        maxValue: 1,
	        backgroundColor: '#111',
	        barColor: '#f00'
	    });

	    // observe the histogram for changes
	    adt.ot.histo.subscribe(this, function (overtoneAmplitudes) {
	        var _loop = function _loop(voiceNum) {
	            overtoneAmplitudes.forEach(function (amplitude, overtoneNum) {
	                adt.synth.node.setOvertoneAmplitude(voiceNum, overtoneNum, amplitude);
	            });
	        };

	        // when the histogram changes, set the synth overtone amplitudes to match
	        for (var voiceNum = adt.synth.node.numVoices - 1; voiceNum >= 0; voiceNum--) {
	            _loop(voiceNum);
	        }
	    });

	    return adt.ot;
	};

	exports.default = OvertoneCtrl;

/***/ },
/* 10 */
/***/ function(module, exports) {

	'use strict';

	/** Class representing a histogram */

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Histogram = function () {

	  /**
	   * Create a Histogram
	   * @param {object} [o] - Options object.
	   * @param {object} [o.container=document.body] - The DOM element that wraps the widget canvas.
	   * @param {number} [o.numBins=10] - The number of bins (lines representing a chunk of data) in the histogram.
	   * @param {number} [o.minVal=0] - The minimum possible value of each bin.
	   * @param {number} [o.maxVal=100] - The maximum possible value of each bin.
	   * @param {string} [o.backgroundColor='#fff'] - The UI background color.
	   * @param {string} [o.barColor='#000'] - The color of the bars that represent the data bins.
	   */
	  function Histogram(o) {
	    _classCallCheck(this, Histogram);

	    o = o || {};

	    this._observers = [];

	    this._numBins = o.numBins || o.numBars || o.numberOfBins || 10;

	    this._dataBins = [];
	    for (var i = 0; i < this._numBins; i++) {
	      this._dataBins.push(0);
	    }

	    this._minVal = o.minVal || o.minValue || 0;
	    this._maxVal = o.maxVal || o.maxValue || 100;

	    this._UIBackgroundColor = o.backgroundColor || o.UIBackgroundColor || '#FFF';
	    this._UIBarColor = o.barColor || o.UIBarColor || '#000';

	    // create the canvas
	    this._container = o.container || document.body;
	    this._container.style.position = 'relative';
	    this._canvas = document.createElement('canvas');
	    this._canvas.width = this._container.clientWidth;
	    this._canvas.height = this._container.clientHeight;
	    this._container.appendChild(this._canvas);
	    this._canvas.style.position = 'absolute';
	    this._canvas.style.left = '0px';
	    this._canvas.style.top = '0px';
	    this._ctx = this._canvas.getContext('2d');

	    this.init();

	    return this;
	  }

	  _createClass(Histogram, [{
	    key: 'init',
	    value: function init() {
	      this.assignListeners();
	      this.drawUI();
	      this._listenForResize();
	    }

	    /* --- Options --- */

	  }, {
	    key: 'setOptions',
	    value: function setOptions(o) {
	      o = o || {};
	      this.options = o;
	    }

	    /* --- Getters and setters --- */

	  }, {
	    key: 'setCanvasWidth',
	    value: function setCanvasWidth(newWidth) {
	      this.canvasWidth = newWidth;
	    }
	  }, {
	    key: 'setCanvasHeight',
	    value: function setCanvasHeight(newHeight) {
	      this.canvasHeight = newHeight;
	    }
	  }, {
	    key: 'setUpNewDataBins',
	    value: function setUpNewDataBins(newNum) {
	      if (newNum > this._numBins) {
	        for (var i = this._numBins; i < newNum; i++) {
	          this._dataBins.push(0);
	        }
	      } else if (newNum < this._numBins) {
	        for (var i = this._numBins; i > newNum; i--) {
	          this._dataBins.pop();
	        }
	      }
	      return this;
	    }
	  }, {
	    key: 'setBinVal',
	    value: function setBinVal(binNum, val) {
	      this._dataBins[binNum] = val;
	      this.drawUI();
	      return this;
	    }
	  }, {
	    key: 'subscribe',


	    /* --- Observer methods --- */
	    value: function subscribe(context, func) {
	      this._observers.push({
	        context: context,
	        func: func
	      });
	      return this;
	    }
	  }, {
	    key: 'unsubscribe',
	    value: function unsubscribe(context, func) {
	      this._observers = this._observers.filter(function (observer) {
	        return observer.context !== context || observer.func !== func;
	      });
	      return this;
	    }
	  }, {
	    key: 'notifyObservers',
	    value: function notifyObservers() {
	      var _this = this;
	      this._observers.forEach(function (observer) {
	        observer.func.call(observer.context, _this._dataBins);
	      });
	      return this;
	    }

	    /* --- Utility methods --- */

	  }, {
	    key: 'setDataPointByCanvasPos',
	    value: function setDataPointByCanvasPos(x, y) {
	      var binNum = Math.floor(x / this._canvas.width * this._numBins);
	      var invY = this._canvas.height - y;
	      var binVal = (this._maxVal - this._minVal) * (invY / this._canvas.height) + this._minVal;

	      this._dataBins[binNum] = binVal;

	      this.notifyObservers();
	      this.drawUI();
	    }
	  }, {
	    key: 'binXPos',
	    value: function binXPos(binNum) {
	      return binNum * this.binWidth;
	    }
	  }, {
	    key: 'binYPos',
	    value: function binYPos(binNum) {
	      var binYPos = this._canvas.height - (this._dataBins[binNum] - this._minVal) / (this._maxVal - this._minVal) * this._canvas.height;
	      return binYPos;
	    }

	    /* --- UI drawing --- */

	  }, {
	    key: 'drawUI',
	    value: function drawUI() {
	      var binXPos = void 0,
	          binYPos = void 0;

	      this._ctx.fillStyle = this._UIBackgroundColor;
	      this._ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);

	      for (var i = 0; i < this._numBins; i++) {
	        binXPos = this.binXPos(i) + 1;
	        binYPos = this.binYPos(i);

	        this._ctx.fillStyle = this._UIBarColor;
	        this._ctx.fillRect(binXPos, binYPos, this.binWidth - 2, this._canvas.height - binYPos);
	      }
	    }

	    /* --- UI interaction --- */

	  }, {
	    key: 'assignListeners',
	    value: function assignListeners() {
	      var _this = this;

	      var boundingClientRect = void 0;
	      var canvasX = void 0,
	          canvasY = void 0;

	      this._canvas.addEventListener('mousedown', mouseDownListener);
	      this._canvas.addEventListener('touchstart', mouseDownListener);

	      function mouseDownListener(e) {
	        e.preventDefault();

	        boundingClientRect = _this._canvas.getBoundingClientRect();

	        if (e.type === 'touchstart') {
	          e.clientX = e.touches[0].clientX;
	          e.clientY = e.touches[0].clientY;
	        }

	        canvasX = e.clientX - boundingClientRect.left;
	        canvasY = e.clientY - boundingClientRect.top;
	        _this.setDataPointByCanvasPos(canvasX, canvasY);

	        _this._canvas.addEventListener('mousemove', mouseMoveListener);
	        _this._canvas.addEventListener('touchmove', mouseMoveListener);
	      }

	      function mouseMoveListener(e) {
	        if (e.type === 'touchmove') {
	          e.clientX = e.touches[0].clientX;
	          e.clientY = e.touches[0].clientY;
	        }

	        canvasX = e.clientX - boundingClientRect.left;
	        canvasY = e.clientY - boundingClientRect.top;
	        _this.setDataPointByCanvasPos(canvasX, canvasY);

	        document.addEventListener('mouseup', mouseUpListener);
	        document.addEventListener('touchend', mouseUpListener);
	      }

	      function mouseUpListener() {
	        _this._canvas.removeEventListener('mousemove', mouseMoveListener);
	        _this._canvas.removeEventListener('touchmove', mouseMoveListener);
	      }
	    }

	    /**
	     * Listens for whether the container's dimensions changed and resize the canvas if they did
	     */

	  }, {
	    key: '_listenForResize',
	    value: function _listenForResize() {
	      var _this = this;

	      // on window resize, adjust the canvas size in case the container size changes
	      window.addEventListener('resize', windowResizeThrottle);

	      function windowResizeThrottle() {
	        window.requestAnimationFrame(windowResize);
	      }

	      function windowResize() {
	        _this._canvas.width = _this._container.clientWidth;
	        _this._canvas.height = _this._container.clientHeight;

	        _this.drawUI();
	      }
	    }
	  }, {
	    key: 'options',
	    set: function set(o) {
	      o = o || {};

	      if (o.canvasWidth) this.canvasWidth = o.canvasWidth;
	      if (o.canvasHeight) this.canvasHeight = o.canvasHeight;

	      if (o.numBins || o.numberOfBins) {
	        this.setUpNewDataBins(o.numBins);
	        this._numBins = o.numBins || o.numberOfBins || this.numBins;
	      }

	      if (o.minVal || o.minValue) this.minVal = o.minVal || o.minValue;
	      if (o.maxVal || o.maxValue) this.maxVal = o.maxVal || o.maxValue;

	      if (o.backgroundColor || o.UIBackgroundColor) this.UIBackgroundColor = o.backgroundColor || o.UIBackgroundColor;
	      if (o.barColor || o.UIBarColor) this.UIBarColor = o.barColor || o.UIBarColor;

	      this.notifyObservers();
	      this.drawUI();
	    }
	  }, {
	    key: 'canvasWidth',
	    set: function set(newWidth) {
	      this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
	      this._canvas.width = newWidth;
	      this.drawUI();
	      return this;
	    }
	  }, {
	    key: 'canvasHeight',
	    set: function set(newHeight) {
	      this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
	      this._canvas.height = newHeight;
	      this.drawUI();
	      return this;
	    }
	  }, {
	    key: 'numBins',
	    get: function get() {
	      return this._numBins;
	    },
	    set: function set(newNum) {
	      this.setUpNewDataBins(newNum);
	      this._numBins = newNum;

	      this.notifyObservers();
	      this.drawUI();
	      return this;
	    }
	  }, {
	    key: 'binWidth',
	    get: function get() {
	      var binWidth = this._canvas.width / this.numBins;
	      return binWidth;
	    }
	  }, {
	    key: 'dataBins',
	    get: function get() {
	      return this._dataBins;
	    },
	    set: function set(newdataBins) {
	      this._dataBins = newdataBins;
	      this.notifyObservers();
	      this.drawUI();
	      return this;
	    }
	  }, {
	    key: 'minVal',
	    get: function get() {
	      return this._minVal;
	    },
	    set: function set(newVal) {
	      this._minVal = newVal;
	      this.drawUI();
	      this.notifyObservers();
	      return this;
	    }
	  }, {
	    key: 'maxVal',
	    get: function get() {
	      return this._maxVal;
	    },
	    set: function set(newVal) {
	      this._maxVal = newVal;
	      this.drawUI();
	      this.notifyObservers();
	      return this;
	    }
	  }, {
	    key: 'UIBackgroundColor',
	    get: function get() {
	      return this._UIBackgroundColor;
	    },
	    set: function set(newColor) {
	      this._UIBackgroundColor = newColor;
	      this.drawUI();
	      return this;
	    }
	  }, {
	    key: 'UIBarColor',
	    get: function get() {
	      return this._UIBarColor;
	    },
	    set: function set(newColor) {
	      this._UIBarColor = newColor;
	      this.drawUI();
	      return this;
	    }
	  }]);

	  return Histogram;
	}();

	exports.default = Histogram;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _EnvelopeGraph = __webpack_require__(12);

	var _EnvelopeGraph2 = _interopRequireDefault(_EnvelopeGraph);

	var _DropMenu = __webpack_require__(13);

	var _DropMenu2 = _interopRequireDefault(_DropMenu);

	var _Numberbox = __webpack_require__(14);

	var _Numberbox2 = _interopRequireDefault(_Numberbox);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	'use strict'; /* --------------------------- */
	/* --- Envelope controller --- */
	/* --------------------------- */

	var EnvelopeCtrl = function EnvelopeCtrl(adt) {
	    var _this = this;

	    // references to the copy and paste buttons
	    var envCopyBtn = document.querySelector('#additor .env-ctrl .btn.copy');
	    var envPasteBtn = document.querySelector('#additor .env-ctrl .btn.paste');
	    var envResetBtn = document.querySelector('#additor .env-ctrl .btn.reset');

	    adt.env = {
	        main: {}, // container for the main envelope controllers
	        ot: [] // container for the overtone envelopes
	    };

	    adt.env.selectedOtIndex = 0;

	    // envelope currently saved to the clipboard
	    adt.env.clipboard = {
	        attackGraph: {
	            vertices: []
	        },
	        sustainGraph: {
	            vertices: []
	        },
	        releaseGraph: {
	            vertices: []
	        }
	    };

	    // shared envelope properties
	    var envSharedProperties = {
	        backgroundColor: 'hsla(0, 0%, 0%, 0)', // transparent background
	        vertexColor: '#0f0',
	        lineColor: '#f00',
	        hasFixedStartPoint: true,
	        hasFixedEndPoint: true,
	        isEditable: true,
	        minXValue: 0,
	        maxXValue: 1,
	        quantizeX: 0.01,
	        minYValue: 0,
	        maxYValue: 1,
	        quantizeY: 0.01
	    };

	    /**
	     * Create the main envelope graph
	     */
	    adt.env.main.attackGraph = new _EnvelopeGraph2.default(Object.assign({}, envSharedProperties, {
	        container: document.querySelector('#additor .env-ctrl .env .attack .graph'),
	        fixedStartPointY: 0
	    })).subscribe(this, function (env) {
	        // get the attack, sustain, and release end points to match
	        adt.env.main.sustainGraph.fixedStartPointY = env[env.length - 1][1];
	        adt.env.main.sustainGraph.fixedEndPointY = env[env.length - 1][1];
	        adt.env.main.releaseGraph.fixedStartPointY = env[env.length - 1][1];
	        adt.synth.node.attackEnvelope = env;
	    });

	    adt.env.main.sustainGraph = new _EnvelopeGraph2.default(Object.assign({}, envSharedProperties, {
	        container: document.querySelector('#additor .env-ctrl .env .sustain .graph'),
	        fixedStartPointY: 1,
	        fixedEndPointY: 1,
	        maxNumVertices: 2
	    })).subscribe(this, function (env) {
	        // get the attack, sustain, and release end points to match
	        adt.env.main.attackGraph.fixedEndPointY = env[0][1];
	        adt.env.main.releaseGraph.fixedStartPointY = env[1][1];
	        adt.synth.node.releaseEnvelope = env;
	    });

	    adt.env.main.releaseGraph = new _EnvelopeGraph2.default(Object.assign({}, envSharedProperties, {
	        container: document.querySelector('#additor .env-ctrl .env .release .graph'),
	        fixedEndPointY: 1
	    })).subscribe(this, function (env) {
	        // get the attack, sustain, and release end points to match
	        adt.env.main.sustainGraph.fixedStartPointY = env[0][1];
	        adt.env.main.sustainGraph.fixedEndPointY = env[0][1];
	        adt.env.main.attackGraph.fixedEndPointY = env[0][1];
	        adt.env.main.releaseGraph.fixedEndPointY = 0;
	        adt.synth.node.releaseEnvelope = env;
	    });

	    /**
	     * Create envelope graphs for each overtone
	     */

	    var _loop = function _loop(i) {
	        var otEnv = {};

	        otEnv.attackGraph = new _EnvelopeGraph2.default({
	            container: document.querySelector('#additor .env-ctrl .env .attack .graph'),
	            backgroundColor: 'hsla(0, 0%, 0%, 0)',
	            lineColor: 'hsla(' + i * 91 % 360 + ', 50%, 50%, 0)',
	            vertexColor: 'hsla(' + i * 91 % 360 + ', 50%, 50%, 0)',
	            isEditable: 'false',
	            hasFixedStartPoint: true,
	            hasFixedEndPoint: true,
	            fixedStartPointY: 0,
	            fixedEndPointY: 0,
	            minXValue: 0,
	            maxXValue: 1,
	            quantizeX: 0.01,
	            minYValue: 0,
	            maxYValue: 1,
	            quantizeY: 0.01
	        }).subscribe(_this, function (env) {
	            // ensure the fixed start and end points are all in the right place
	            otEnv.attackGraph.fixedEndPointY = env[env.length - 2][1];
	            otEnv.sustainGraph.fixedStartPointY = otEnv.attackGraph.fixedEndPointY;
	            otEnv.sustainGraph.fixedEndPointY = otEnv.sustainGraph.fixedStartPointY;
	            otEnv.releaseGraph.fixedStartPointY = otEnv.sustainGraph.fixedEndPointY;
	            adt.synth.node.setOvertoneAttackEnvelope(i, env);
	        });
	        otEnv.sustainGraph = new _EnvelopeGraph2.default({
	            container: document.querySelector('#additor .env-ctrl .env .sustain .graph'),
	            backgroundColor: 'hsla(0, 0%, 0%, 0)',
	            lineColor: 'hsla(' + i * 91 % 360 + ', 50%, 50%, 0)',
	            vertexColor: 'hsla(' + i * 91 % 360 + ', 50%, 50%, 0)',
	            isEditable: 'false',
	            maxNumVertices: 2,
	            hasFixedStartPoint: true,
	            hasFixedEndPoint: true,
	            fixedStartPointY: 0,
	            fixedEndPointY: 0,
	            minXValue: 0,
	            maxXValue: 1,
	            quantizeX: 0.01,
	            minYValue: 0,
	            maxYValue: 1,
	            quantizeY: 0.01
	        }).subscribe(_this, function (env) {
	            // ensure the fixed start and end points are all in the right place
	            otEnv.sustainGraph.fixedStartPointY = env[0][1];
	            otEnv.sustainGraph.fixedEndPointY = otEnv.sustainGraph.fixedStartPointY;
	            otEnv.attackGraph.fixedEndPointY = otEnv.sustainGraph.fixedStartPointY;
	            otEnv.releaseGraph.fixedStartPointY = otEnv.sustainGraph.fixedEndPointY;
	        });
	        otEnv.releaseGraph = new _EnvelopeGraph2.default({
	            container: document.querySelector('#additor .env-ctrl .env .release .graph'),
	            backgroundColor: 'hsla(0, 0%, 0%, 0)',
	            lineColor: 'hsla(' + i * 91 % 360 + ', 50%, 50%, 0)',
	            vertexColor: 'hsla(' + i * 91 % 360 + ', 50%, 50%, 0)',
	            isEditable: 'false',
	            hasFixedStartPoint: true,
	            hasFixedEndPoint: true,
	            fixedStartPointY: 0,
	            fixedEndPointY: 0,
	            minXValue: 0,
	            maxXValue: 1,
	            quantizeX: 0.01,
	            minYValue: 0,
	            maxYValue: 1,
	            quantizeY: 0.01
	        }).subscribe(_this, function (env) {
	            // ensure the fixed start and end points are all in the right place
	            otEnv.releaseGraph.fixedStartPointY = env[1][1];
	            otEnv.sustainGraph.fixedEndPointY = otEnv.releaseGraph.fixedStartPointY;
	            otEnv.sustainGraph.fixedStartPointY = otEnv.sustainGraph.fixedEndPointY;
	            otEnv.attackGraph.fixedEndPointY = otEnv.sustainGraph.fixedStartPointY;
	            adt.synth.node.setOvertoneReleaseEnvelope(i, env);
	        });

	        adt.env.ot[i] = otEnv;
	    };

	    for (var i = 0; i < adt.synth.node.numOvertones; i++) {
	        _loop(i);
	    }

	    // dropMenu - select which envelope to edit
	    adt.env.graphSelectMenu = new _DropMenu2.default({
	        container: document.querySelector('#additor .env-ctrl .select-overtone .dropMenu'),
	        menuItemFontSize: '6px',
	        menuItems: function () {
	            var overtones = ['main envelope'];
	            for (var _i = 0; _i < adt.synth.node.numOvertones; _i++) {
	                overtones.push('overtone ' + _i);
	            }
	            return overtones;
	        }()
	    }).subscribe(this, function (menuIndex) {
	        adt.env.menuIndex = menuIndex;

	        // if menu index is 0, the main envelope is selected
	        if (menuIndex === 0) {
	            // make the main envelope editable
	            adt.env.main.attackGraph.isEditable = true;
	            adt.env.main.sustainGraph.isEditable = true;
	            adt.env.main.releaseGraph.isEditable = true;

	            // make the main envelope color bright
	            adt.env.main.attackGraph.lineColor = 'hsla(0, 100%, 50%, 1)';
	            adt.env.main.attackGraph.vertexColor = 'hsla(120, 100%, 50%, 1)';
	            adt.env.main.sustainGraph.lineColor = 'hsla(0, 100%, 50%, 1)';
	            adt.env.main.sustainGraph.vertexColor = 'hsla(120, 100%, 50%, 1)';
	            adt.env.main.releaseGraph.lineColor = 'hsla(0, 100%, 50%, 1)';
	            adt.env.main.releaseGraph.vertexColor = 'hsla(120, 100%, 50%, 1)';

	            // make the overtone envelopes not editable and dim their colors
	            adt.env.ot.forEach(function (otEnv, otIndex) {
	                otEnv.attackGraph.isEditable = false;
	                otEnv.sustainGraph.isEditable = false;
	                otEnv.releaseGraph.isEditable = false;

	                otEnv.attackGraph.lineColor = 'hsla(' + otIndex * 23 % 360 + ', 50%, 50%, 0.15)';
	                otEnv.attackGraph.vertexColor = 'hsla(' + otIndex * 23 % 360 + ', 50%, 50%, 0.15)';
	                otEnv.sustainGraph.lineColor = 'hsla(' + otIndex * 23 % 360 + ', 50%, 50%, 0.15)';
	                otEnv.sustainGraph.vertexColor = 'hsla(' + otIndex * 23 % 360 + ', 50%, 50%, 0.15)';
	                otEnv.releaseGraph.lineColor = 'hsla(' + otIndex * 23 % 360 + ', 50%, 50%, 0.15)';
	                otEnv.releaseGraph.vertexColor = 'hsla(' + otIndex * 23 % 360 + ', 50%, 50%, 0.15)';

	                otEnv.attackGraph.redraw();
	                otEnv.sustainGraph.redraw();
	                otEnv.releaseGraph.redraw();
	            });

	            // redraw the main envelope
	            adt.env.main.attackGraph.redraw();
	            adt.env.main.sustainGraph.redraw();
	            adt.env.main.releaseGraph.redraw();

	            // else, one of the overtone envelope graphs is selected
	        } else {
	            // index of the selected overtone
	            adt.env.selectedOtIndex = menuIndex - 1;

	            // make the main envelope not editable
	            adt.env.main.attackGraph.isEditable = false;
	            adt.env.main.sustainGraph.isEditable = false;
	            adt.env.main.releaseGraph.isEditable = false;

	            // make the main envelope's color greyed out
	            adt.env.main.attackGraph.lineColor = 'hsla(0, 100%, 50%, 0.15)';
	            adt.env.main.attackGraph.vertexColor = 'hsla(120, 100%, 50%, 0.15)';
	            adt.env.main.sustainGraph.lineColor = 'hsla(0, 100%, 50%, 0.15)';
	            adt.env.main.sustainGraph.vertexColor = 'hsla(120, 100%, 50%, 0.15)';
	            adt.env.main.releaseGraph.lineColor = 'hsla(0, 100%, 50%, 0.15)';
	            adt.env.main.releaseGraph.vertexColor = 'hsla(120, 100%, 50%, 0.15)';

	            adt.env.ot.forEach(function (otEnv, otIndex) {
	                // decide whether they are editable
	                otEnv.attackGraph.isEditable = otIndex === adt.env.selectedOtIndex ? true : false;
	                otEnv.sustainGraph.isEditable = otIndex === adt.env.selectedOtIndex ? true : false;
	                otEnv.releaseGraph.isEditable = otIndex === adt.env.selectedOtIndex ? true : false;

	                // change line and vertex colors
	                otEnv.attackGraph.lineColor = otIndex === adt.env.selectedOtIndex ? 'hsla(' + otIndex * 23 % 360 + ', 50%, 50%, 1)' // selected for editing
	                : 'hsla(' + otIndex * 23 % 360 + ', 50%, 50%, 0.22)'; // inactive
	                otEnv.attackGraph.vertexColor = otIndex === adt.env.selectedOtIndex ? '#0f0' // selected for editing
	                : 'hsla(' + otIndex * 23 % 360 + ', 50%, 50%, 0.22)'; // incative
	                otEnv.sustainGraph.lineColor = otIndex === adt.env.selectedOtIndex ? 'hsla(' + otIndex * 23 % 360 + ', 50%, 50%, 1)' // selected for editing
	                : 'hsla(' + otIndex * 23 % 360 + ', 50%, 50%, 0.22)'; // inactive
	                otEnv.sustainGraph.vertexColor = otIndex === adt.env.selectedOtIndex ? '#0f0' // selected for editing
	                : 'hsla(' + otIndex * 23 % 360 + ', 50%, 50%, 0.22)'; // inactive
	                otEnv.releaseGraph.lineColor = otIndex === adt.env.selectedOtIndex ? 'hsla(' + otIndex * 23 % 360 + ', 50%, 50%, 1)' // selected for editing
	                : 'hsla(' + otIndex * 23 % 360 + ', 50%, 50%, 0.22)'; // inactive
	                otEnv.releaseGraph.vertexColor = otIndex === adt.env.selectedOtIndex ? '#0f0' // selected for editing
	                : 'hsla(' + otIndex * 23 % 360 + ', 50%, 50%, 0.22)'; // inactive

	                otEnv.attackGraph.redraw();
	                otEnv.sustainGraph.redraw();
	                otEnv.releaseGraph.redraw();
	            });
	        }
	    });

	    // copy/paste/reset envelopes
	    envCopyBtn.addEventListener('mousedown', function () {
	        if (adt.env.menuIndex === 0) {
	            adt.env.clipboard.attackGraph.vertices = adt.env.main.attackGraph.vertices.map(function (vertex) {
	                return vertex.slice();
	            });
	            adt.env.clipboard.sustainGraph.vertices = adt.env.main.sustainGraph.vertices.map(function (vertex) {
	                return vertex.slice();
	            });
	            adt.env.clipboard.releaseGraph.vertices = adt.env.main.releaseGraph.vertices.map(function (vertex) {
	                return vertex.slice();
	            });
	        } else {
	            var selectedOtIndex = adt.env.menuIndex - 1;
	            adt.env.clipboard.attackGraph.vertices = adt.env.ot[selectedOtIndex].attackGraph.vertices.map(function (vertex) {
	                return vertex.slice();
	            });
	            adt.env.clipboard.sustainGraph.vertices = adt.env.ot[selectedOtIndex].sustainGraph.vertices.map(function (vertex) {
	                return vertex.slice();
	            });
	            adt.env.clipboard.releaseGraph.vertices = adt.env.ot[selectedOtIndex].releaseGraph.vertices.map(function (vertex) {
	                return vertex.slice();
	            });
	        }
	    });

	    envPasteBtn.addEventListener('mousedown', function () {
	        if (adt.env.menuIndex === 0) {
	            adt.env.main.attackGraph.vertices = adt.env.clipboard.attackGraph.vertices.map(function (vertex) {
	                return vertex.slice();
	            });
	            adt.env.main.sustainGraph.vertices = adt.env.clipboard.sustainGraph.vertices.map(function (vertex) {
	                return vertex.slice();
	            });
	            adt.env.main.releaseGraph.vertices = adt.env.clipboard.releaseGraph.vertices.map(function (vertex) {
	                return vertex.slice();
	            });

	            adt.synth.node.attackEnvelope = adt.env.main.attackGraph.vertices;
	            adt.synth.node.releaseEnvelope = adt.env.main.releaseGraph.vertices;
	        } else {
	            var selectedOtIndex = adt.env.menuIndex - 1;
	            adt.env.ot[selectedOtIndex].attackGraph.vertices = adt.env.clipboard.attackGraph.vertices.map(function (vertex) {
	                return vertex.slice();
	            });
	            adt.env.ot[selectedOtIndex].sustainGraph.vertices = adt.env.clipboard.sustainGraph.vertices.map(function (vertex) {
	                return vertex.slice();
	            });
	            adt.env.ot[selectedOtIndex].releaseGraph.vertices = adt.env.clipboard.releaseGraph.vertices.map(function (vertex) {
	                return vertex.slice();
	            });

	            adt.synth.node.setOvertoneAttackEnvelope(selectedOtIndex, adt.env.ot[selectedOtIndex].attackGraph.vertices);
	            adt.synth.node.setOvertoneReleaseEnvelope(selectedOtIndex, adt.env.ot[selectedOtIndex].releaseGraph.vertices);
	        }
	    });

	    envResetBtn.addEventListener('mousedown', function () {
	        if (adt.env.menuIndex === 0) {
	            adt.env.main.attackGraph.vertices = [[0, 0], [adt.env.main.attackGraph.maxXValue, 0]];
	            adt.env.main.sustainGraph.vertices = [[0, 0], [adt.env.main.sustainGraph.maxXValue, 0]];
	            adt.env.main.releaseGraph.vertices = [[0, 0], [adt.env.main.releaseGraph.maxXValue, 0]];
	        } else {
	            var selectedOtIndex = adt.env.menuIndex - 1;
	            adt.env.ot[selectedOtIndex].attackGraph.vertices = [[0, 0], [adt.env.ot[selectedOtIndex].attackGraph.maxXValue, 0]];
	            adt.env.ot[selectedOtIndex].sustainGraph.vertices = [[0, 0], [adt.env.ot[selectedOtIndex].sustainGraph.maxXValue, 0]];
	            adt.env.ot[selectedOtIndex].releaseGraph.vertices = [[0, 0], [adt.env.ot[selectedOtIndex].releaseGraph.maxXValue, 0]];
	        }
	    });

	    // envelope length number boxes
	    adt.env.attackLengthNumbox = new _Numberbox2.default({
	        container: document.querySelector('#additor .env-ctrl .attack .numbox'),
	        minValue: 0,
	        maxValue: 10000,
	        appendString: ' ms',
	        value: 1000
	    }).subscribe(this, function (val) {
	        adt.env.main.attackGraph.maxXValue = val / 1000;
	        adt.env.main.attackGraph.redraw();
	        adt.synth.node.attackEnvelope = adt.env.main.attackGraph.vertices;

	        adt.env.ot.forEach(function (otEnv, index) {
	            otEnv.attackGraph.maxXValue = val / 1000;
	            otEnv.attackGraph.redraw();
	        });
	    });

	    adt.env.releaseLengthNumbox = new _Numberbox2.default({
	        container: document.querySelector('#additor .env-ctrl .release .numbox'),
	        minValue: 0,
	        maxValue: 10000,
	        appendString: ' ms',
	        value: 1000
	    }).subscribe(this, function (val) {
	        adt.env.main.releaseGraph.maxXValue = val / 1000;
	        adt.env.main.releaseGraph.redraw();
	        adt.synth.node.releaseEnvelope = adt.env.main.releaseGraph.vertices;

	        adt.env.ot.forEach(function (otEnv, index) {
	            otEnv.releaseGraph.maxXValue = val / 1000;
	            otEnv.releaseGraph.redraw();
	        });
	    });

	    // initial values for envelope controls
	    adt.env.graphSelectMenu.value = 0;

	    adt.env.updateUI = function () {
	        adt.env.main.attackGraph.vertices = adt.synth.node._voices[0].attackEnvelope.map(function (vertex) {
	            return vertex.slice();
	        });
	        adt.env.main.releaseGraph.vertices = adt.synth.node._voices[0].releaseEnvelope.map(function (vertex) {
	            return vertex.slice();
	        });

	        adt.env.ot.forEach(function (otEnv, otIndex) {
	            otEnv.attackGraph.vertices = adt.synth.node._voices[0]._overtones[otIndex].attackEnvelope.map(function (vertex) {
	                return vertex.slice();
	            });
	            otEnv.releaseGraph.vertices = adt.synth.node._voices[0]._overtones[otIndex].releaseEnvelope.map(function (vertex) {
	                return vertex.slice();
	            });
	            otEnv.sustainGraph.fixedStartPointY = otEnv.attackGraph.fixedEndPointY;
	            otEnv.sustainGraph.fixedEndPointY = otEnv.sustainGraph.fixedStartPointY;

	            otEnv.attackGraph.redraw();
	            otEnv.sustainGraph.redraw();
	            otEnv.releaseGraph.redraw();
	        });
	    }();

	    return adt.env;
	};

	exports.default = EnvelopeCtrl;

/***/ },
/* 12 */
/***/ function(module, exports) {

	'use strict';

	/** Class representing an editable line graph */

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var EnvelopeGraph = function () {

	  /**
	   * Create an Envelope Graph
	   * @param {object} [o] - Options object.
	   * @param {object} [o.container=document.body] - The DOM element that wraps the widget canvas.
	   * @param {object} [canvas] - The canvas to contain the UI. If not specified, a new canvas will be created within the container.
	   * @param {number} [o.minXValue=0] - Minimum X value.
	   * @param {number} [o.maxXValue=100] - Maximum X value.
	   * @param {number} [o.minYValue=0] - Minimum Y value.
	   * @param {number} [o.maxYValue=100] - Maximum Y value.
	   * @param {number} [o.quantizeX] - X quantization (the smallest grid interval between X values, to which vertices will snap).
	   * @param {number} [o.quantizeY] - Y quantization (the smallest grid interval between Y values, to which vertices will snap).
	   * @param {boolean} [o.hasFixedStartPoint=false] - Boolean value specifying whether the graph has a fixed vertex at the minimum X value.
	   * @param {boolen} [o.hasFixedEndPoint=false] - Boolean value specifying whether the graph has a fixed vertex at the maximum X value.
	   * @param {number} [o.fixedStartPointY=0] - Y value for the fixed starting vertex, if used.
	   * @param {number} [o.fixedEndPointY=0] - Y value for the fixed ending vertex, if used.
	   * @param {number} [o.maxNumVertices=-1] - The maximum number of allowed vertices. A value of -1 means no maximum number.
	   * @param {boolean} [o.isEditable=true] - Boolean value specifying whether the user can edit the graph via the UI.
	   * @param {string} [o.vertexColor='#000'] - Color of the vertex points.
	   * @param {string} [o.lineColor='#000'] - Color of lines connecting the vertices.
	   * @param {string} [o.backgroundColor='#fff'] - Background color.
	   * @param {number} [vertexRadius=3px] - Radius of the vertex points.
	   */
	  function EnvelopeGraph(o) {
	    _classCallCheck(this, EnvelopeGraph);

	    o = o || {};

	    this._observers = [];

	    this._vertices = [];

	    this._minXValue = o.minXValue || 0;
	    this._maxXValue = o.maxXValue || 100;
	    this._minYValue = o.minYValue || 0;
	    this._maxYValue = o.maxYValue || 100;

	    // quantize is the smallest incremental interval for data points
	    this._quantizeX = o.quantizeX || (this._maxXValue - this._minXValue) / 1000;
	    this._quantizeY = o.quantizeY || (this._maxYValue - this._minYValue) / 1000;

	    // fixed start and end points
	    this._hasFixedStartPoint = o.hasFixedStartPoint || false;
	    this._hasFixedEndPoint = o.hasFixedEndPoint || false;

	    this._fixedStartPointY = o.fixedStartPointY || o.fixedStartPoint || 0;
	    this._fixedEndPointY = o.fixedEndPointY || o.fixedEndPoint || 0;

	    // maximum number of vertices, -1 means no maximum
	    this._maxNumVertices = o.maxNumVertices || -1;

	    // can you edit by clicking?
	    this._isEditable = o.isEditable || true;

	    // create fixed start and end points, if used
	    if (this._hasFixedStartPoint === true) {
	      this._vertices.push([this._minXValue, this._fixedStartPointY]);
	    }
	    if (this._hasFixedEndPoint === true) {
	      this._vertices.push([this._maxXValue, this._fixedEndPointY]);
	    }

	    this._UIVertexColor = o.vertexColor || o.UIVertexColor || '#000';
	    this._UILineColor = o.lineColor || o.UILineColor || '#000';
	    this._UIBackgroundColor = o.backgroundColor || o.UIBackgroundColor || '#FFF';
	    this._UIVertexRadius = o.vertexRadius || o.UIVertexRadius || 3;

	    this._canvas = o.canvas || window.document.createElement('canvas');

	    if (o.canvas !== undefined) {
	      this._canvas = o.canvas;
	      this._container = this._canvas.parentElement;
	    } else {
	      this._container = o.container || window.document.body;
	      this._canvas.width = this._container.clientWidth;
	      this._canvas.height = this._container.clientHeight;
	      this._canvas.style.position = 'absolute';
	      this._canvas.style.left = '0px';
	      this._canvas.style.top = '0px';
	      this._canvas.style.width = this._container.clientWidth;
	      this._canvas.style.height = this._container.clientHeight;
	      this._container.appendChild(this._canvas);
	    }
	    this._ctx = this._canvas.getContext('2d');

	    this.assignListeners();
	    this._listenForResize();
	    this._drawUI();

	    return this;
	  }

	  /* =============== */
	  /* --- Options --- */
	  /* =============== */

	  _createClass(EnvelopeGraph, [{
	    key: 'setOptions',
	    value: function setOptions(o) {
	      o = o || {};
	      this.options = o;
	      return this;
	    }

	    /* =========================== */
	    /* --- Getters and setters --- */
	    /* =========================== */

	    /** Background color */

	  }, {
	    key: 'setCanvasHeight',
	    value: function setCanvasHeight(newHeight) {
	      this.canvasHeight = newHeight;
	    }

	    /** Canvas width */

	  }, {
	    key: 'setCanvasWidth',
	    value: function setCanvasWidth(newWidth) {
	      this.canvasWidth = newWidth;
	    }

	    /** Domain */

	  }, {
	    key: 'setFixedStartPointY',
	    value: function setFixedStartPointY(newY) {
	      this.fixedStartPointY = newY;
	      return this;
	    }

	    /** Y-value of the fixed end point */

	  }, {
	    key: 'setFixedEndPointY',
	    value: function setFixedEndPointY(newY) {
	      this.fixedEndPointY = newY;
	      return this;
	    }

	    /** Color of the lines connecting the vertices */

	  }, {
	    key: 'subscribe',


	    /* ======================== */
	    /* --- Observer support --- */
	    /* ======================== */

	    /**
	     * Subscribe an observer function
	     * @param {object} context
	     * @param {function} function
	     */
	    value: function subscribe(context, func) {
	      this._observers.push({
	        context: context,
	        func: func
	      });
	      return this;
	    }

	    /**
	     * Unsubscribe an observer function
	     * @param {object} context
	     * @param {function} function
	     */

	  }, {
	    key: 'unsubscribe',
	    value: function unsubscribe(context, func) {
	      this.observers = this.observers.filter(function (observer) {
	        return observer.context !== context || observer.func !== func;
	      });
	      return this;
	    }

	    /**
	     * Notify the subscribed observers of the current vertices array
	     */

	  }, {
	    key: 'notifyObservers',
	    value: function notifyObservers() {
	      var _this = this;
	      this._observers.forEach(function (observer) {
	        observer.func.call(observer.context, _this._vertices.slice());
	      });
	      return this;
	    }

	    /* ========================= */
	    /* --- Data manipulation --- */
	    /* ========================= */

	    /**
	     * Add a vertex
	     * @param {number} x
	     * @param {number} y
	     */

	  }, {
	    key: 'addVertex',
	    value: function addVertex(x, y) {
	      if ((this._vertices.length < this._maxNumVertices || this._maxNumVertices === -1) && (this._hasFixedStartPoint === false || x > this._minXValue) && (this._hasFixedEndPoint === false || x < this._maxXValue)) {

	        this._vertices.push([x, y]);
	        this.sortVertices();
	        this.notifyObservers();
	      }
	    }

	    /**
	     * Sort the vertices
	     */

	  }, {
	    key: 'sortVertices',
	    value: function sortVertices() {
	      this._vertices.sort(function (a, b) {
	        var retVal = a[0] - b[0];
	        if (retVal === 0) {
	          var retVal = a[1] - b[1];
	        }
	        return retVal;
	      });
	    }

	    /**
	     * Delete a vertices
	     * @param {number} vertexIndex
	     */

	  }, {
	    key: 'deleteVertex',
	    value: function deleteVertex(vertexIndex) {
	      this._vertices.splice(vertexIndex, 1);
	      this.sortVertices();
	      this._drawUI();
	    }

	    /* =============== */
	    /* --- Utility --- */
	    /* =============== */

	  }, {
	    key: 'quantizeNum',
	    value: function quantizeNum(rawVal, qFactor) {
	      var lBoundRemainder = rawVal % qFactor;
	      var uBoundRemainder = rawVal - rawVal % qFactor + qFactor - rawVal;
	      var result;

	      function numFixedDigits(a) {
	        if (!isFinite(a)) return 0;
	        var e = 1,
	            p = 0;
	        while (Math.round(a * e) / e !== a) {
	          e *= 10;p++;
	        }
	        return p;
	      }

	      if (lBoundRemainder < uBoundRemainder) {
	        result = rawVal - rawVal % qFactor;
	      } else {
	        result = rawVal - rawVal % qFactor + qFactor;
	      }

	      result = +result.toFixed(numFixedDigits(qFactor));

	      return result;
	    }
	  }, {
	    key: '_dataToCanvasX',
	    value: function _dataToCanvasX(x) {
	      var canvasX = (x - this._minXValue) / this.domain * this._canvas.width;
	      return canvasX;
	    }
	  }, {
	    key: '_dataToCanvasY',
	    value: function _dataToCanvasY(y) {
	      var canvasY = this._canvas.height - (y - this._minYValue) / this.range * this._canvas.height;
	      return canvasY;
	    }
	  }, {
	    key: '_canvasToDataX',
	    value: function _canvasToDataX(canvasX) {
	      var dataX = canvasX / this._canvas.width * this.domain + this._minXValue;
	      dataX = this.quantizeNum(dataX, this.quantizeX);
	      return dataX;
	    }
	  }, {
	    key: '_canvasToDataY',
	    value: function _canvasToDataY(canvasY) {
	      var canvasYinv = this._canvas.height - canvasY;

	      var dataY = canvasYinv / this._canvas.height * this.range + this._minYValue;
	      dataY = this.quantizeNum(dataY, this.quantizeY);
	      return dataY;
	    }

	    /* Which point (vertex) is clicked on? */

	  }, {
	    key: '_whichPointIsSelected',
	    value: function _whichPointIsSelected(dataX, dataY, xBuffer, yBuffer) {
	      var dataPointIndex = -1; // -1 means not found

	      dataPointIndex = this._vertices.findIndex(function (vertex) {
	        if (vertex[0] < dataX + xBuffer && vertex[0] > dataX - xBuffer && vertex[1] < dataY + yBuffer && vertex[1] > dataY - yBuffer) {
	          return true;
	        } else {
	          return false;
	        }
	      });

	      return dataPointIndex;
	    }

	    /* Which line connecting vertices is clicked on? */

	  }, {
	    key: '_whichLineIsSelected',
	    value: function _whichLineIsSelected(dataX, dataY, xBuffer, yBuffer) {
	      var _this = this;

	      var lineIndex = -1;

	      // line is between which two points?
	      var lowerBoundIndex = this._vertices.findIndex(function (vertex, i, vertices) {
	        if (vertices[i][0] < dataX && vertices[i + 1][0] > dataX) {
	          return true;
	        } else {
	          return false;
	        }
	      });
	      var upperBoundIndex = lowerBoundIndex + 1;

	      // if lower bound was not found, return -1 - we're done
	      if (lowerBoundIndex === -1) {
	        return -1;
	      }

	      // what should the value of y be at point x, calculated from the slope?
	      var yValueAtDataX = function () {
	        var x1 = _this._vertices[lowerBoundIndex][0];
	        var x2 = _this._vertices[upperBoundIndex][0];
	        var y1 = _this._vertices[lowerBoundIndex][1];
	        var y2 = _this._vertices[upperBoundIndex][1];

	        var slope = (y2 - y1) / (x2 - x1);

	        return slope * (dataX - x1) + y1;
	      }();

	      // is the y being clicked on (dataY) the same as calculated by yValueAtDataX (within the allowed buffer)?
	      if (lowerBoundIndex !== -1 && dataY > yValueAtDataX - yBuffer && dataY < yValueAtDataX + yBuffer) {
	        lineIndex = lowerBoundIndex;
	      }

	      return lineIndex;
	    }

	    /* ================== */
	    /* --- UI drawing --- */
	    /* ================== */

	    /**
	     * Force a redraw
	     */

	  }, {
	    key: 'redraw',
	    value: function redraw() {
	      this._drawUI();
	    }
	  }, {
	    key: '_drawUI',
	    value: function _drawUI() {
	      this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
	      this._ctx.fillStyle = this._UIBackgroundColor;
	      this._ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);

	      for (var i = this._vertices.length - 1; i > 0; i--) {
	        this._drawLineBetweenPoints(this.vertices[i][0], this.vertices[i][1], this.vertices[i - 1][0], this.vertices[i - 1][1]);
	      }
	      for (var _i = this._vertices.length - 1; _i > 0; _i--) {
	        this._drawPoint(this.vertices[_i][0], this.vertices[_i][1]);
	      }
	      if (this.vertices.length > 0) {
	        this._drawPoint(this.vertices[0][0], this.vertices[0][1]);
	      }
	    }
	  }, {
	    key: '_drawPoint',
	    value: function _drawPoint(x, y) {
	      var canvasX = this._dataToCanvasX(x);
	      var canvasY = this._dataToCanvasY(y);

	      this._ctx.beginPath();
	      this._ctx.arc(canvasX, canvasY, this.vertexRadius, 0, 2 * Math.PI);
	      this._ctx.fillStyle = this._UIVertexColor;
	      this._ctx.fill();
	    }
	  }, {
	    key: '_drawLineBetweenPoints',
	    value: function _drawLineBetweenPoints(x1, y1, x2, y2) {
	      var canvasX1 = this._dataToCanvasX(x1);
	      var canvasX2 = this._dataToCanvasX(x2);
	      var canvasY1 = this._dataToCanvasY(y1);
	      var canvasY2 = this._dataToCanvasY(y2);

	      this._ctx.beginPath();
	      this._ctx.moveTo(canvasX1, canvasY1);
	      this._ctx.lineTo(canvasX2, canvasY2);
	      this._ctx.strokeStyle = this._UILineColor;
	      this._ctx.stroke();
	    }

	    /* ====================== */
	    /* --- UI interaction --- */
	    /* ====================== */

	  }, {
	    key: 'assignListeners',
	    value: function assignListeners() {
	      var _this = this;

	      var canvasBoundingRect = _this._container.getBoundingClientRect();
	      var mouseX = void 0,
	          mouseY = void 0; // mouse X and Y on the canvasY
	      var dataX = void 0,
	          dataY = void 0; // value of mouse X and Y
	      var vertexIndex = void 0,
	          lineIndex = void 0; // index of vertex or line being clicked on
	      var linePrevY = void 0,
	          lineDeltaY = void 0; // coordinates used for moving a line

	      // listen for a mousedown
	      _this._container.addEventListener('mousedown', mouseDownListener);
	      _this._container.addEventListener('touchstart', mouseDownListener);

	      function mouseDownListener(e) {
	        if (_this._isEditable === true) {
	          (function () {
	            var deleteVertex = function deleteVertex(e) {
	              _this.deleteVertex(vertexIndex);
	              _this._container.removeEventListener('mouseup', deleteVertex);
	              _this._container.removeEventListener('touchend', deleteVertex);
	              _this._container.removeEventListener('mousemove', moveVertex);
	              _this._container.removeEventListener('touchmove', moveVertex);
	            };

	            var moveVertex = function moveVertex(e) {
	              // do not delete it when mouse is up, we are moving it
	              _this._container.removeEventListener('mouseup', deleteVertex);
	              _this._container.removeEventListener('touchend', deleteVertex);

	              var verticesLength = _this._vertices.length;

	              if (e.type === 'touchmove') {
	                e.clientX = e.touches[0].clientX;
	                e.clientY = e.touches[0].clientY;
	              }

	              // calculate where we are moving the mouse
	              mouseX = e.clientX - canvasBoundingRect.left;
	              mouseY = e.clientY - canvasBoundingRect.top;
	              dataX = Math.max(Math.min(_this._canvasToDataX(mouseX), _this.maxXValue), _this.minXValue);
	              dataY = Math.max(Math.min(_this._canvasToDataY(mouseY), _this.maxYValue), _this.minYValue);

	              // move the vertex to where we moved the mouse
	              _this._vertices[vertexIndex] = [dataX, dataY];

	              // Reorder the vertices in _this._vertices[] if necessary
	              var tempDataPoint = void 0; // used for temporary storage when reordering
	              // if it's moved beyond the vertex directly to its right
	              if (_this._vertices[vertexIndex + 1] && _this._vertices[vertexIndex][0] > _this._vertices[vertexIndex + 1][0]) {
	                tempDataPoint = _this._vertices[vertexIndex + 1];
	                _this._vertices[vertexIndex + 1] = _this._vertices[vertexIndex];
	                _this._vertices[vertexIndex] = tempDataPoint;
	                vertexIndex = vertexIndex + 1;
	                // if it's moved beyond the vertex directly to its left
	              } else if (_this._vertices[vertexIndex - 1] && _this._vertices[vertexIndex][0] < _this._vertices[vertexIndex - 1][0]) {
	                tempDataPoint = _this._vertices[vertexIndex];
	                _this._vertices[vertexIndex] = _this._vertices[vertexIndex - 1];
	                _this._vertices[vertexIndex - 1] = tempDataPoint;
	                vertexIndex = vertexIndex - 1;
	              }

	              _this._drawUI();

	              document.addEventListener('mouseup', mouseUpListener);
	              document.addEventListener('touchend', mouseUpListener);
	            };

	            var moveLine = function moveLine(e) {
	              if (e.type === 'touchmove') {
	                e.clientY = e.touches[0].clientY;
	              }

	              // current mouse position
	              mouseY = e.clientY - canvasBoundingRect.top;
	              dataY = _this._canvasToDataY(mouseY);

	              // how much has the line been moved?
	              lineDeltaY = dataY - linePrevY;
	              linePrevY = dataY;

	              // move the apex vertices of the line by however much it moved, if not outside the max or min y value limits
	              if (_this._vertices[lineIndex][1] + lineDeltaY < _this.maxYValue && _this._vertices[lineIndex + 1][1] + lineDeltaY < _this.maxYValue && _this._vertices[lineIndex][1] + lineDeltaY > _this.minYValue && _this._vertices[lineIndex + 1][1] + lineDeltaY > _this.minYValue) {
	                _this._vertices[lineIndex][1] = Math.max(Math.min(_this._vertices[lineIndex][1] + lineDeltaY, _this.maxYValue), _this.minYValue);
	                _this._vertices[lineIndex + 1][1] = Math.max(Math.min(_this._vertices[lineIndex + 1][1] + lineDeltaY, _this.maxYValue), _this.minYValue);
	              }

	              _this.notifyObservers();
	              _this._drawUI();

	              document.addEventListener('mouseup', mouseUpListener);
	              document.addEventListener('touchend', mouseUpListener);
	            };

	            var mouseUpListener = function mouseUpListener() {
	              _this._container.removeEventListener('mousemove', moveLine);
	              _this._container.removeEventListener('touchmove', moveLine);
	              _this._container.removeEventListener('mousemove', moveVertex);
	              _this._container.removeEventListener('touchmove', moveVertex);
	            };

	            e.preventDefault();

	            canvasBoundingRect = _this._container.getBoundingClientRect();

	            if (e.type === 'touchstart') {
	              e.clientX = e.touches[0].clientX;
	              e.clientY = e.touches[0].clientY;
	            }

	            mouseX = e.clientX - canvasBoundingRect.left;
	            mouseY = e.clientY - canvasBoundingRect.top;
	            dataX = _this._canvasToDataX(mouseX);
	            dataY = _this._canvasToDataY(mouseY);

	            vertexIndex = _this._whichPointIsSelected(dataX, dataY, _this._quantizeX * 10, _this._quantizeY * 10);
	            lineIndex = _this._whichLineIsSelected(dataX, dataY, _this._quantizeX, _this._quantizeY * 5);

	            // if a vertex has been clicked on, we delete it if mouse is up without being moved, or move it if mouse moves
	            if (vertexIndex !== -1) {
	              // if the vertex is not a fixed start or end point
	              if ((_this._hasFixedStartPoint === false || vertexIndex > 0) && (_this._hasFixedEndPoint === false || vertexIndex < _this._vertices.length - 1)) {
	                // if the mouse is up without being moved first, delete the vertex
	                _this._container.addEventListener('mouseup', deleteVertex);
	                _this._container.addEventListener('touchend', deleteVertex);
	                // if no mouse up occurs, we are moving (dragging) the vertex
	                _this._container.addEventListener('mousemove', moveVertex);
	                _this._container.addEventListener('touchmove', moveVertex);
	              }
	            }
	            // if a line connecting vertices is being clicked on
	            else if (lineIndex !== -1) {
	                linePrevY = dataY;
	                _this._container.addEventListener('mousemove', moveLine);
	                _this._container.addEventListener('touchmove', moveLine);
	              }
	              // if we're not clicking on an existing vertex or a line, we add a new vertex
	              else {
	                  _this.addVertex(dataX, dataY);
	                }

	            _this._drawUI();
	          })();
	        }
	      }
	    }

	    /**
	     * Listens for whether the container's dimensions changed and resize the canvas if they did
	     */

	  }, {
	    key: '_listenForResize',
	    value: function _listenForResize() {
	      var _this = this;

	      // on window resize, adjust the canvas size in case the container size changes
	      window.addEventListener('resize', windowResizeThrottle);

	      function windowResizeThrottle() {
	        window.requestAnimationFrame(windowResize);
	      }

	      function windowResize() {
	        _this._canvas.width = _this._container.clientWidth;
	        _this._canvas.height = _this._container.clientHeight;
	        _this._canvas.style.position = 'absolute';
	        _this._canvas.style.left = '0px';
	        _this._canvas.style.top = '0px';

	        _this._drawUI();
	      }
	    }
	  }, {
	    key: 'options',
	    set: function set(o) {
	      o = o || {};

	      if (o.canvasWidth) this.canvasWidth = o.canvasWidth;
	      if (o.canvasHeight) this.canvasHeight = o.canvasHeight;

	      if (o.container) this.container = o.container;

	      if (o.minXValue) this.minXValue = o.minXValue;
	      if (o.maxXValue) this.maxXValue = o.maxXValue;
	      if (o.minYValue) this.minYValue = o.minYValue;
	      if (o.maxYValue) this.maxYValue = o.maxYValue;

	      if (o.fixedStartPointY) this.fixedStartPointY = o.fixedStartPointY;
	      if (o.fixedEndPointY) this.fixedEndPointY = o.fixedEndPointY;
	      if (o.hasFixedStartPoint) this.hasFixedStartPoint = o.hasFixedStartPoint;
	      if (o.hasFixedEndPoint) this.hasFixedEndPoint = o.hasFixedEndPoint;

	      if (o.vertexColor || o.UIVertexColor) this._UIVertexColor = o.vertexColor || o.UIVertexColor;
	      if (o.lineColor || o.UILineColor) this._UILineColor = o.lineColor || o.UILineColor;
	      if (o.backgroundColor || o.UIBackgroundColor) this._UIBackgroundColor = o.backgroundColor || o.UIBackgroundColor;
	      if (o.vertexRadius || o.UIVertexRadius) this.UIVertexRadius = o.vertexRadius || o.UIVertexRadius;

	      this.notifyObservers();
	      this._drawUI();

	      return this;
	    }
	  }, {
	    key: 'backgroundColor',
	    get: function get() {
	      return this._UIBackgroundColor;
	    },
	    set: function set(newColor) {
	      this._UIBackgroundColor = newColor;
	      this._drawUI();
	      return this;
	    }

	    /** Canvas */

	  }, {
	    key: 'canvas',
	    get: function get() {
	      return this._canvas;
	    },
	    set: function set(newCanvas) {
	      this._canvas = newCanvas;
	      this._drawUI();
	      return this;
	    }

	    /** Canvas height */

	  }, {
	    key: 'canvasHeight',
	    set: function set(newHeight) {
	      this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
	      this._canvas.height = newHeight;
	      this._drawUI();
	      return this;
	    }
	  }, {
	    key: 'canvasWidth',
	    set: function set(newWidth) {
	      this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
	      this._canvas.width = newWidth;
	      this._drawUI();
	      return this;
	    }
	  }, {
	    key: 'domain',
	    get: function get() {
	      return this._maxXValue - this._minXValue;
	    }

	    /** Boolean specifying whether graph has a fixed start point */

	  }, {
	    key: 'hasFixedStartPoint',
	    set: function set(isTrue) {
	      if (this._hasFixedStartPoint === false && isTrue === true) {
	        this._hasFixedStartPoint = true;
	        this._vertices.push([this._minXValue, this._fixedStartPointY]);
	        this.sortVertices();
	        this.notifyObservers();
	        this._drawUI();
	      } else if (this._hasFixedStartPoint === true && isTrue === false) {
	        this._hasFixedStartPoint = false;
	        this._vertices.splice(0, 1);
	        this.notifyObservers();
	        this._drawUI();
	      }
	    }

	    /** Boolean specifying whether graph has a fixed end point */

	  }, {
	    key: 'hasFixedEndPoint',
	    set: function set(isTrue) {
	      if (this._hasFixedEndPoint === false && isTrue === true) {
	        this._hasFixedEndPoint = true;
	        this._vertices.push([this._maxXValue, this._fixedEndPointY]);
	        this.sortVertices();
	        this.notifyObservers();
	        this._drawUI();
	      } else if (this._hasFixedEndPoint === true && isTrue === false) {
	        this._hasFixedEndPoint = false;
	        this._vertices.splice(this._vertices.length - 1, 1);
	        this.notifyObservers();
	        this._drawUI();
	      }
	    }

	    /** Editable */

	  }, {
	    key: 'isEditable',
	    get: function get() {
	      return this._isEditable;
	    },
	    set: function set(isEditable) {
	      this._isEditable = isEditable;
	      return this;
	    }

	    /** Y-value of the fixed start point */

	  }, {
	    key: 'fixedStartPointY',
	    get: function get() {
	      return this._fixedStartPointY;
	    },
	    set: function set(newY) {
	      this._fixedStartPointY = newY;

	      if (this._hasFixedStartPoint === true) {
	        this._vertices[0] = [this._minXValue, this._fixedStartPointY];
	      }

	      this._drawUI();
	      return this;
	    }
	  }, {
	    key: 'fixedEndPointY',
	    get: function get() {
	      return this._fixedEndPointY;
	    },
	    set: function set(newY) {
	      this._fixedEndPointY = newY;

	      if (this._hasFixedEndPoint === true) {
	        this._vertices[this._vertices.length - 1] = [this._maxXValue, this._fixedEndPointY];
	      }

	      this._drawUI();
	      return this;
	    }
	  }, {
	    key: 'lineColor',
	    get: function get() {
	      return this._UILineColor;
	    },
	    set: function set(newColor) {
	      this._UILineColor = newColor;
	      this._drawUI();
	      return this;
	    }

	    /** Maximum X Value */

	  }, {
	    key: 'maxXValue',
	    get: function get() {
	      return this._maxXValue;
	    },
	    set: function set(newVal) {
	      this._maxXValue = newVal;

	      // update the fixed end point, if present
	      if (this._hasFixedEndPoint === true) {
	        this._vertices[this._vertices.length - 1][0] = this._maxXValue;
	      }

	      // get rid of points that fall outside the new range
	      for (var i = this._vertices.length - 1; i > 0; i--) {
	        if (this._vertices[i][0] > this._maxXValue) {
	          this._vertices.splice(i, 1);
	        }
	      }

	      return this;
	    }

	    /** Maximum Y Value */

	  }, {
	    key: 'maxYValue',
	    get: function get() {
	      return this._maxYValue;
	    },
	    set: function set(newVal) {
	      this._maxYValue = newVal;
	      return this;
	    }

	    /** Minimum X Value */

	  }, {
	    key: 'minXValue',
	    get: function get() {
	      return this._minXValue;
	    },
	    set: function set(newVal) {
	      this._minXValue = newVal;
	      return this;
	    }

	    /** Minimum Y Value */

	  }, {
	    key: 'minYValue',
	    get: function get() {
	      return this._minYValue;
	    },
	    set: function set(newVal) {
	      this._minYValue = newVal;
	      return this;
	    }

	    /** X quantization (smallest interval between points) value */

	  }, {
	    key: 'quantizeX',
	    get: function get() {
	      return this._quantizeX;
	    },
	    set: function set(newVal) {
	      this._quantizeX = newVal;
	      return this;
	    }

	    /** Y quantization quantization (smallest interval between points) value */

	  }, {
	    key: 'quantizeY',
	    get: function get() {
	      return this._quantizeY;
	    },
	    set: function set(newVal) {
	      this._quantizeY = newVal;
	      return this;
	    }

	    /** Range */

	  }, {
	    key: 'range',
	    get: function get() {
	      return this._maxYValue - this._minYValue;
	    }

	    /** Vertex color */

	  }, {
	    key: 'vertexColor',
	    get: function get() {
	      return this._UIVertexColor;
	    },
	    set: function set(newColor) {
	      this._UIVertexColor = newColor;
	      this._drawUI();
	      return this;
	    }

	    /** Radius of the circle representing a vertex */

	  }, {
	    key: 'vertexRadius',
	    get: function get() {
	      var UIVertexRadius = Math.min(this._canvas.width, this._canvas.height) * 0.015;
	      this._UIVertexRadius = Math.max(UIVertexRadius, 2);
	      return this._UIVertexRadius;
	    },
	    set: function set(newRadius) {
	      this._UIVertexRadius = newRadius;
	      this._drawUI();
	      return this;
	    }

	    /** An array of [x,y] points representing the graph vertices */

	  }, {
	    key: 'vertices',
	    get: function get() {
	      return this._vertices;
	    },
	    set: function set(newVertices) {
	      this._vertices = newVertices;
	      this._drawUI();
	      this.notifyObservers();
	      return this;
	    }
	  }]);

	  return EnvelopeGraph;
	}();

	exports.default = EnvelopeGraph;

/***/ },
/* 13 */
/***/ function(module, exports) {

	'use strict';

	/** Class representing a drop-down menu */

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var DropMenu = function () {

	  /**
	   * Create a drop-down menu.
	   * @param {object} [o] - Options object.
	   * @param {object} [o.container=document.body] - The DOM element that wraps the widget canvas.
	   * @param {string} [o.backgroundColor='#fff'] - The UI background color.
	   * @param {string} [o.fontColor='#000'] - The UI font color.
	   * @param {string} [o.fontSize='12px'] - The font size.
	   * @param {string} [o.fontFamily='Arial'] - The font family.
	   * @param {string} [o.menuItemFontSize='12px'] - The font size for items in the opened drop-down menu.
	   * @param {string} [o.menuItemFontFamily='Arial'] - The font family for items in the opened drop-down menu.
	   * @param {string} [o.selectedItemBackgroundColor='#ccc'] - The background cover for the selected (hovered) item in the opened drop-down menu.
	   * @param {string} [o.selectedItemFontColor='#fff'] - The font color for the selected (hovered) item in the opened drop-down menu.
	   * @return {object} this - Returns a reference to the new object instance.
	   */
	  function DropMenu(o) {
	    _classCallCheck(this, DropMenu);

	    o = o || {};

	    // observers
	    this._observers = [];

	    // menu items
	    this._menuItems = o.menuItems || [];
	    this._selectedItemNum = 0;
	    this._hoverItemNum = -1;

	    // UI styling options
	    this._UIbackgroundColor = o.backgroundColor || o.UIbackgroundColor || '#555';
	    this._UIfontColor = o.fontColor || o.UIfontColor || '#bbb';
	    this._UIfontSize = o.fontSize || o.UIfontSize || '12px';
	    this._UIfontFamily = o.fontFamily || o.UIfontFamily || 'Arial';
	    this._UImenuItemFontSize = o.menuItemFontSize || o.UImenuItemFontSize || '12px';
	    this._UImenuItemFontFamily = o.menuItemFontFamily || o.UImenuItemFontFamily || 'Arial';
	    this._UIselectedItemBackgroundColor = o.selectedItemBackgroundColor || o.UIselectedItemBackgroundColor || '#ccc';
	    this._UIselectedItemFontColor = o.selectedItemFontColor || o.UIselectedItemBackgroundColor || '#fff';

	    // set up the main canvas
	    this._container = o.container || document.body;
	    this._canvas = document.createElement('canvas');
	    this._ctx = this._canvas.getContext('2d');
	    this._canvas.width = this._container.clientWidth;
	    this._canvas.height = this._container.clientHeight;
	    this._container.appendChild(this._canvas);

	    /* set up the drop-down canvas */
	    this._ddCanvas = document.createElement('canvas');
	    this._ddCtx = this._ddCanvas.getContext('2d');
	    this._ddCanvas.width = this._getDdCanvasDimensions().width;
	    this._ddCanvas.height = this._getDdCanvasDimensions().height;
	    document.body.appendChild(this._ddCanvas);
	    this._ddCanvas.style.position = 'absolute';
	    this._ddCanvas.style.visibility = 'hidden';
	    this._ddCanvas.style.left = this._canvas.getBoundingClientRect().left + 'px';
	    this._ddCanvas.style.top = this._canvas.getBoundingClientRect().bottom + 'px';

	    // draw the UI
	    this._drawUI();
	    this._assignListeners();
	    this._listenForResize();

	    return this;
	  }

	  /* =========================== */
	  /* --- Getters and setters --- */
	  /* =========================== */

	  /** An array of strings representing the items in the menu */


	  _createClass(DropMenu, [{
	    key: 'addMenuItem',


	    /* ========================== */
	    /* --- State manipulation --- */
	    /* ========================== */

	    /**
	     * Add a menu item
	     * @param {string} newItem - The new item to be added to the menu
	     */
	    value: function addMenuItem(newItem) {
	      this._menuItems.push(newItem);

	      var ddCanvasDims = this._getDdCanvasDimensions();

	      this._ddCanvas.height = ddCanvasDims.height;
	      this._ddCanvas.width = ddCanvasDims.width;

	      this._drawUI();
	      return this;
	    }

	    /* ================== */
	    /* --- UI drawing --- */
	    /* ================== */

	    /* Draw the UI */

	  }, {
	    key: '_drawUI',
	    value: function _drawUI() {
	      this._drawClosedMenuBox();
	      this._drawDropDownMenuBox();
	    }

	    /* Draw the closed menu box */

	  }, {
	    key: '_drawClosedMenuBox',
	    value: function _drawClosedMenuBox() {
	      // draw the box
	      this._ctx.fillStyle = this._UIbackgroundColor;
	      this._ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);

	      // draw the selected menu item text
	      this._ctx.font = this._UIfontSize + ' ' + this._UIfontFamily;
	      this._ctx.fillStyle = this._UIfontColor;
	      this._ctx.textBaseline = 'middle';
	      this._ctx.fillText(this._menuItems[this._selectedItemNum], 10, this._canvas.height / 2);
	    }

	    /* Draw the drop-down box */

	  }, {
	    key: '_drawDropDownMenuBox',
	    value: function _drawDropDownMenuBox() {
	      var _this = this;
	      var menuItemHeight = _this._getMenuItemHeight();

	      // fill the background box
	      this._ddCtx.fillStyle = this._UIbackgroundColor;
	      this._ddCtx.fillRect(0, 0, this._ddCanvas.width, this._ddCanvas.height);

	      // fill the menu items text
	      this._ddCtx.font = this._UIfontSize + ' ' + this._UIfontFamily;
	      for (var i = 0; i < this._menuItems.length; i++) {
	        this._ddCtx.fillStyle = this._UIfontColor;

	        // if item i is hovered, set the appropriate colors
	        if (i === _this._hoverItemNum) {
	          this._ddCtx.fillStyle = _this._UIselectedItemBackgroundColor;
	          this._ddCtx.fillRect(0, i * menuItemHeight, this._ddCanvas.width, menuItemHeight);
	          this._ddCtx.fillStyle = this._UIselectedItemFontColor;
	        }

	        this._ddCtx.textBaseline = 'middle';
	        this._ddCtx.fillText(this._menuItems[i], 10, (i + 1) * menuItemHeight - menuItemHeight / 2);
	      }
	    }

	    /* Get the dimensions for the drop-down canvas */

	  }, {
	    key: '_getDdCanvasDimensions',
	    value: function _getDdCanvasDimensions() {
	      var _this = this;

	      var width = function () {
	        var maxWidth = 0;
	        var itemWidth = 0;

	        _this._menuItems.forEach(function (item) {
	          itemWidth = _this._ddCtx.measureText(item).width;
	          maxWidth = itemWidth > maxWidth ? itemWidth : maxWidth;
	        });

	        return maxWidth + 20;
	      }();

	      var height = this._getMenuItemHeight() * this._menuItems.length;

	      return { width: width, height: height };
	    }

	    /* Get the height of each menu item */

	  }, {
	    key: '_getMenuItemHeight',
	    value: function _getMenuItemHeight() {
	      var menuItemHeight = parseInt(this._UImenuItemFontSize) * 2;
	      return menuItemHeight;
	    }

	    /* ====================== */
	    /* --- UI interaction --- */
	    /* ====================== */

	    /* Assign the listeners for UI interaction */

	  }, {
	    key: '_assignListeners',
	    value: function _assignListeners() {
	      var _this = this;

	      // when mouse down on the closed menu box
	      this._canvas.addEventListener('mousedown', mouseDownListener);

	      function mouseDownListener() {
	        // show the drop-down menu
	        _this._ddCanvas.style.visibility = 'visible';

	        _this._ddCanvas.addEventListener('mousemove', mouseMoveListener);
	        document.addEventListener('mousedown', secondMouseDownListener);
	      }

	      function secondMouseDownListener(e) {
	        if (e.target !== _this._canvas) {
	          document.addEventListener('mouseup', mouseUpListener);
	        }
	      }

	      function mouseMoveListener(e) {
	        var ddCanvasY = e.clientY - _this._ddCanvas.getBoundingClientRect().top;
	        _this._hoverItemNum = Math.trunc(ddCanvasY / _this._getMenuItemHeight());
	        _this._drawUI();
	      }

	      function mouseUpListener(e) {
	        // hide the drop-down menu
	        _this._ddCanvas.style.visibility = 'hidden';
	        if (_this._hoverItemNum !== -1 && e.target === _this._ddCanvas) {
	          _this._selectedItemNum = _this._hoverItemNum;
	          _this.notifyObservers();
	        }
	        _this._hoverItemNum = -1;

	        document.removeEventListener('mouseup', mouseUpListener);

	        _this._drawUI();
	      }
	    }

	    /* ======================== */
	    /* --- Observer support --- */
	    /* ======================== */

	    /**
	     * Subscribe an observer function
	     * @param {object} context
	     * @param {function} function
	     */

	  }, {
	    key: 'subscribe',
	    value: function subscribe(context, func) {
	      this._observers.push({ context: context, func: func });
	      return this;
	    }

	    /**
	     * Unsubscribe an observer function
	     * @param {object} context
	     * @param {function} function
	     */

	  }, {
	    key: 'unsubscribe',
	    value: function unsubscribe(context, func) {
	      this._observers = this.observers.filter(function (observer) {
	        return observer.context !== context || observer.func !== func;
	      });
	      return this;
	    }

	    /**
	     * Notify the subscribed observers of the current selected item number
	     */

	  }, {
	    key: 'notifyObservers',
	    value: function notifyObservers() {
	      var _this = this;
	      this._observers.forEach(function (observer) {
	        observer.func.call(observer.context, _this._selectedItemNum);
	      });
	      return this;
	    }

	    /**
	     * Listens for whether the container's dimensions changed and resize the canvas if they did
	     */

	  }, {
	    key: '_listenForResize',
	    value: function _listenForResize() {
	      var _this = this;

	      // on window resize, adjust the canvas size in case the container size changes
	      window.addEventListener('resize', windowResizeThrottle);

	      function windowResizeThrottle() {
	        window.requestAnimationFrame(windowResize);
	      }

	      function windowResize() {
	        _this._canvas.width = _this._container.clientWidth;
	        _this._canvas.height = _this._container.clientHeight;
	        _this._ddCanvas.style.left = _this._canvas.getBoundingClientRect().left + 'px';
	        _this._ddCanvas.style.top = _this._canvas.getBoundingClientRect().bottom + 'px';

	        _this._drawUI();
	      }
	    }
	  }, {
	    key: 'menuItems',
	    get: function get() {
	      return this._menuItems;
	    },
	    set: function set(newMenuItems) {
	      this._menuItems = newMenuItems;

	      var ddCanvasDims = this._getDdCanvasDimensions();

	      this._ddCanvas.height = ddCanvasDims.height;
	      this._ddCanvas.width = ddCanvasDims.width;

	      this._drawUI();
	      return this;
	    }

	    /** Value - the item number selected */

	  }, {
	    key: 'value',
	    get: function get() {
	      return this._selectedItemNum;
	    },
	    set: function set(newValue) {
	      this._selectedItemNum = newValue;
	      this.notifyObservers();
	      this._drawUI();
	      return this;
	    }
	  }]);

	  return DropMenu;
	}();

	exports.default = DropMenu;

/***/ },
/* 14 */
/***/ function(module, exports) {

	'use strict';

	/** Class representing a draggable numberbox */

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Numberbox = function () {

	  /**
	   * Create a number box
	   * @param {object} [o] - Options object.
	   * @param {object} [o.container=document.body] - The DOM element that wraps the widget canvas.
	   * @param {number} [o.value=0] - The initial value.
	   * @param {number} [o.minValue] - The minimum possible value if clamped. If unspecified, no clamping is used.
	   * @param {number} [o.maxValue] - The maximum possible value if clamped. If unspecified, no clamping is used.
	   * @param {string} [o.backgroundColor] - The UI background color. If unspecified, the color of the container's background is used.
	   * @param {string} [o.fontColor] - The UI font color. If unspecified, the color of the container's font is used.
	   * @param {string} [o.dragDelta=1] - The factor by which dragging affects the value decrease or increase.
	   * @param {string} [o.appendString] - A string to append after the value when displaying (useful to specify units, i.e. 'min', 'kg', 'oz').
	   */
	  function Numberbox(o) {
	    _classCallCheck(this, Numberbox);

	    o = o || {};

	    this._observers = [];

	    this._container = o.container || document.body;
	    this._containerStyle = window.getComputedStyle(this._container);

	    this._value = o.value || 0;
	    this._minValue = o.minValue;
	    this._maxValue = o.maxValue;

	    this._dragDelta = o.dragDelta || 1;

	    this._appendString = o.appendString || '';

	    this._UIBackgroundColor = o.backgroundColor || this._containerStyle.backgroundColor;
	    this._UIFontColor = o.fontColor || this._containerStyle.color;
	    this._UIFontFamily = o.fontFamily || this._containerStyle.fontFamily;
	    this._UIFtonSize = o.fontSize || this._containerStyle.fontSize;

	    this._canvas = o.canvas || window.document.createElement('canvas');
	    if (o.canvas === undefined) {
	      this._canvas.width = this._container.clientWidth;
	      this._canvas.height = this._container.clientHeight;
	      this._canvas.style.position = 'absolute';
	      this._canvas.style.left = '0px';
	      this._canvas.style.top = '0px';
	      this._canvas.style.width = this._container.clientWidth;
	      this._canvas.style.height = this._container.clientHeight;
	      this._container.appendChild(this._canvas);
	    }
	    this._ctx = this._canvas.getContext('2d');

	    this._drawUI();
	    this._assignListeners();

	    return this;
	  }

	  /* =========================== */
	  /* --- Getters and setters --- */
	  /* =========================== */

	  /** Append string */


	  _createClass(Numberbox, [{
	    key: 'subscribe',


	    /* ======================== */
	    /* --- Observer support --- */
	    /* ======================== */

	    value: function subscribe(context, func) {
	      this._observers.push({
	        context: context,
	        func: func
	      });
	      return this;
	    }
	  }, {
	    key: 'unsubscribe',
	    value: function unsubscribe(context, func) {
	      this.observers = this.observers.filter(function (observer) {
	        return observer.context !== context || observer.func !== func;
	      });
	      return this;
	    }
	  }, {
	    key: '_notifyObservers',
	    value: function _notifyObservers() {
	      var _this = this;
	      this._observers.forEach(function (observer) {
	        observer.func.call(observer.context, _this._value);
	      });
	      return this;
	    }

	    /* ================== */
	    /* --- UI drawing --- */
	    /* ================== */

	  }, {
	    key: '_drawUI',
	    value: function _drawUI() {
	      var textWidth = this._ctx.measureText(this._value + this._appendString).width;
	      var textHeight = 6;

	      this._ctx.fillStyle = this._UIBackgroundColor;
	      this._ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);

	      this._ctx.font = this._UIfontSize + ' ' + this._UIFontFamily;
	      this._ctx.fillStyle = this._UIFontColor;
	      this._ctx.fillText(this._value + this._appendString, this._canvas.width / 2 - textWidth / 2, this._canvas.height / 2 + textHeight / 2);
	    }

	    /* ====================== */
	    /* --- UI interaction --- */
	    /* ====================== */

	  }, {
	    key: '_assignListeners',
	    value: function _assignListeners() {
	      var _this = this;

	      var mousedownY = void 0;
	      var originalValue = void 0;

	      this._canvas.addEventListener('mousedown', mousedown);

	      function mousedown(e) {
	        e.preventDefault();

	        originalValue = _this._value;

	        mousedownY = e.clientY;

	        document.addEventListener('mousemove', continueDragging);
	      }

	      function continueDragging(e) {
	        var mouseDeltaY = mousedownY - e.clientY;

	        _this.value = originalValue + _this._dragDelta * mouseDeltaY;

	        _this._notifyObservers();
	        _this._drawUI();

	        document.addEventListener('mouseup', finishDragging);
	      }

	      function finishDragging() {
	        document.removeEventListener('mousemove', continueDragging);
	      }
	    }
	  }, {
	    key: 'appendString',
	    get: function get() {
	      return this._appendString;
	    },
	    set: function set(newString) {
	      this._appendString = newString;
	      this._drawUI();
	      return this;
	    }

	    /** Value */

	  }, {
	    key: 'value',
	    get: function get() {
	      return this._value;
	    },
	    set: function set(newVal) {

	      if (this._minValue !== undefined) {
	        newVal = Math.max(newVal, this._minValue);
	      }
	      if (this._maxValue !== undefined) {
	        newVal = Math.min(newVal, this._maxValue);
	      }

	      this._value = newVal;
	      this._drawUI();
	      return this;
	    }

	    /** Drag delta */

	  }, {
	    key: 'dragDelta',
	    get: function get() {
	      return this._dragDelta;
	    },
	    set: function set(newVal) {
	      this._dragDelta = newVal;
	      return this;
	    }
	  }]);

	  return Numberbox;
	}();

	exports.default = Numberbox;

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _DropMenu = __webpack_require__(13);

	var _DropMenu2 = _interopRequireDefault(_DropMenu);

	var _Dial = __webpack_require__(16);

	var _Dial2 = _interopRequireDefault(_Dial);

	var _Numberbox = __webpack_require__(14);

	var _Numberbox2 = _interopRequireDefault(_Numberbox);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	'use strict'; /* ---------------------------- */
	/* --- Filter UI controller --- */
	/* ---------------------------- */

	var FilterCtrl = function FilterCtrl(adt) {

	    // filter type menu
	    adt.filter.typeDropMenu = new _DropMenu2.default({
	        container: document.querySelector('#additor .filter-ctrl .type-ctrl .dropMenu'),
	        menuItems: ['lowpass', 'highpass', 'bandpass', 'lowshelf', 'highshelf', 'peaking', 'notch', 'allpass']
	    }).subscribe(this, function (selection) {
	        adt.filter.node.type = adt.filter.typeDropMenu.menuItems[selection];
	    });

	    // filter frequency dial
	    adt.filter.freqDial = new _Dial2.default({
	        container: document.querySelector('#additor .filter-ctrl .freq-ctrl .dial'),
	        minValue: 0,
	        maxValue: 20000
	    }).subscribe(this, function (freqDialVal) {
	        adt.filter.node.frequency.value = freqDialVal;
	        adt.filter.freqNumbox.value = adt.filter.node.frequency.value;
	    });

	    // filter frequency number box
	    adt.filter.freqNumbox = new _Numberbox2.default({
	        container: document.querySelector('#additor .filter-ctrl .freq-ctrl .numbox'),
	        value: adt.filter.node.frequency.value,
	        appendString: ' Hz',
	        minValue: 0,
	        maxValue: 20000
	    }).subscribe(this, function (freqNumboxVal) {
	        adt.filter.node.frequency.value = freqNumboxVal;
	        adt.filter.freqDial.value = adt.filter.node.frequency.value;
	    });

	    // filter Q dial
	    adt.filter.qDial = new _Dial2.default({
	        container: document.querySelector('#additor .filter-ctrl .q-ctrl .dial'),
	        value: adt.filter.node.Q.value,
	        minValue: 0,
	        maxValue: 100
	    }).subscribe(this, function (qDialVal) {
	        adt.filter.node.Q.value = qDialVal;
	        adt.filter.qNumbox.value = adt.filter.node.Q.value;
	    });

	    // filter Q number box
	    adt.filter.qNumbox = new _Numberbox2.default({
	        container: document.querySelector('#additor .filter-ctrl .q-ctrl .numbox'),
	        value: adt.filter.node.Q.value,
	        minValue: 0,
	        maxValue: 100
	    }).subscribe(this, function (qNumboxVal) {
	        adt.filter.node.Q.value = qNumboxVal;
	        adt.filter.qDial.value = adt.filter.node.Q.value;
	    });

	    // filter gain dial
	    adt.filter.gainDial = new _Dial2.default({
	        container: document.querySelector('#additor .filter-ctrl .gain-ctrl .dial'),
	        value: adt.filter.node.gain.value,
	        minValue: 0,
	        maxValue: 100
	    }).subscribe(this, function (val) {
	        adt.filter.node.gain.value = val / 100;
	        adt.filter.gainNumbox.value = val;
	    });

	    // filter gain numberbox
	    adt.filter.gainNumbox = new _Numberbox2.default({
	        container: document.querySelector('#additor .filter-ctrl .gain-ctrl .numbox'),
	        value: adt.filter.node.gain.value,
	        minValue: 0,
	        maxValue: 100,
	        appendString: ' %'
	    }).subscribe(this, function (val) {
	        adt.filter.node.gain.value = val / 100;
	        adt.filter.gainDial.value = val;
	    });

	    adt.filter.updateUI = function () {
	        adt.filter.typeDropMenu.value = adt.filter.typeDropMenu.menuItems.indexOf(adt.filter.node.type);
	        adt.filter.freqDial.value = adt.filter.node.frequency.value;
	        adt.filter.freqNumbox.value = adt.filter.node.frequency.value;
	        adt.filter.qDial.value = adt.filter.node.Q.value;
	        adt.filter.qNumbox.value = adt.filter.node.Q.value;
	        adt.filter.gainDial.value = Math.trunc(adt.filter.node.gain.value * 100);
	        adt.filter.gainNumbox.value = Math.trunc(adt.filter.node.gain.value * 100);
	    };

	    return adt.filter;
	};

	exports.default = FilterCtrl;

/***/ },
/* 16 */
/***/ function(module, exports) {

	'use strict';

	/** Class representing a dial widget */

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Dial = function () {

	  /**
	   * Create a dial
	   * @param {object} [o] - Options object.
	   * @param {object} [o.container=document.body] - The DOM element that wraps the widget canvas.
	   * @param {number} [o.value=0] - Inital value.
	   * @param {number} [o.minVal=0] - Minimum possible value.
	   * @param {number} [o.maxVal=127] - Maximum possible value.
	   * @param {string} [o.needleColor='#000'] - Dial needle color.
	   * @param {string} [o.activeColor='#f40'] - Color of the arc that shows the current dial value.
	   */
	  function Dial(o) {
	    _classCallCheck(this, Dial);

	    o = o || {};

	    this.observers = [];

	    // value
	    this._value = o.value || 0;
	    this._minValue = o.minVal || o.minValue || 0;
	    this._maxValue = o.maxVal || o.maxValue || 127;

	    // display options
	    this._needleColor = o.needleColor || '#000';
	    this._activeColor = o.activeColor || '#f40';

	    // set up the canvas
	    this._container = o.container || document.body;
	    this._canvas = document.createElement('canvas');
	    this._canvas.width = this._container.clientWidth;
	    this._canvas.height = this._container.clientHeight;
	    this._container.appendChild(this._canvas);
	    this._ctx = this._canvas.getContext('2d');

	    this.init();

	    return this;
	  }

	  _createClass(Dial, [{
	    key: 'init',
	    value: function init() {
	      this.drawUI();
	      this.assignListeners();
	    }

	    /* --- Observer methods --- */

	  }, {
	    key: 'subscribe',
	    value: function subscribe(context, func) {
	      this.observers.push({
	        func: func,
	        context: context
	      });
	      return this;
	    }
	  }, {
	    key: 'unsubscribe',
	    value: function unsubscribe(context, func) {
	      this.observers = this.observers.filter(function (observer) {
	        return observer.func !== func || observer.context !== context;
	      });
	      return this;
	    }
	  }, {
	    key: 'notify',
	    value: function notify() {
	      var _this = this;
	      this.observers.forEach(function (observer) {
	        observer.func.call(observer.context, _this._value);
	      });
	    }

	    /* --- Getters and setters --- */

	  }, {
	    key: 'setCanvasWidth',
	    value: function setCanvasWidth(newWidth) {
	      this.canvasWidth = newWidth;
	    }
	  }, {
	    key: 'setCanvasHeight',
	    value: function setCanvasHeight(newHeight) {
	      this.canvasHeight = newHeight;
	    }
	  }, {
	    key: 'setValue',
	    value: function setValue(newValue) {
	      this.value = newValue;
	    }
	  }, {
	    key: 'getValue',
	    value: function getValue() {
	      return this._value;
	    }

	    /* --- UI DRAWING --- */

	  }, {
	    key: 'drawUI',
	    value: function drawUI() {
	      this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);

	      var cX = this.cX;
	      var cY = this.cY;

	      var dialRadius = this.r;

	      // calculate the needle angle
	      var needleAngle = (this._value - this._minValue) / (this._maxValue - this._minValue) * 1.7 * Math.PI + 1.15 * Math.PI;
	      var needleEndX = cX + Math.sin(needleAngle) * dialRadius;
	      var needleEndY = cY - Math.cos(needleAngle) * dialRadius;

	      // draw the background circle
	      this._ctx.beginPath();
	      this._ctx.arc(cX, cY, dialRadius, 0.65 * Math.PI, 2.35 * Math.PI);
	      this._ctx.lineWidth = dialRadius / 5;
	      this._ctx.strokeStyle = this._needleColor;
	      this._ctx.stroke();

	      // draw the active circle
	      this._ctx.beginPath();
	      this._ctx.arc(cX, cY, dialRadius, 0.64 * Math.PI, needleAngle - 0.51 * Math.PI);
	      this._ctx.lineWidth = dialRadius / 5;
	      this._ctx.strokeStyle = this._activeColor;
	      this._ctx.stroke();

	      // draw the needle
	      this._ctx.beginPath();
	      this._ctx.moveTo(cX, cY);
	      this._ctx.lineTo(needleEndX, needleEndY);
	      this._ctx.lineCap = 'round';
	      this._ctx.lineWidth = dialRadius / 5;
	      this._ctx.strokeStyle = this._needleColor;
	      this._ctx.stroke();
	    }

	    /* --- UI INTERACTION --- */

	    /** Leeway threshold (in px) for which a click is considered to be within boundary */

	  }, {
	    key: 'assignListeners',
	    value: function assignListeners() {
	      var _this = this;

	      var canvasBoundingClientRect = this._canvas.getBoundingClientRect();
	      var turnStartVal = void 0,
	          turnStartY = void 0,
	          turnDelta = void 0,
	          newVal = void 0;

	      this._canvas.addEventListener('mousedown', beginTurningListener);
	      this._canvas.addEventListener('touchstart', beginTurningListener);

	      function beginTurningListener(e) {
	        var canvasX = e.clientX - canvasBoundingClientRect.left;
	        var canvasY = e.clientY - canvasBoundingClientRect.top;
	        var clickRadius = Math.hypot(canvasX - _this.cX, canvasY - _this.cY);

	        // if the click is within radius from the center
	        if (clickRadius < _this.r + _this.clickThresh && clickRadius > _this.r - _this.clickThresh) {
	          console.log('click on dial radius');
	        }

	        if (e.type === 'touchstart') {
	          e.clientY = e.touches[0].clientY;
	        }

	        turnStartY = e.clientY;
	        turnStartVal = _this._value;

	        document.addEventListener('mousemove', continueTurningListener);
	        document.addEventListener('touchmove', continueTurningListener);
	      }

	      function continueTurningListener(e) {
	        e.preventDefault();

	        if (e.type === 'touchmove') {
	          e.clientY = e.touches[0].clientY;
	        }

	        turnDelta = Math.trunc((turnStartY - e.clientY) * (_this._maxValue - _this._minValue) / 200);

	        if (turnStartVal + turnDelta > _this._maxValue || turnStartVal + turnDelta < _this._minValue) {
	          turnStartY = e.clientY;
	          turnStartVal = _this._value;
	        } else {
	          _this.setValue(turnStartVal + turnDelta);
	        }

	        document.addEventListener('mouseup', endTurningListener);
	        document.addEventListener('touchend', endTurningListener);
	      }

	      function endTurningListener(e) {
	        document.removeEventListener('mousemove', continueTurningListener);
	        document.removeEventListener('touchmove', continueTurningListener);
	        document.removeEventListener('mouseup', endTurningListener);
	        document.removeEventListener('touchend', endTurningListener);
	      }
	    }
	  }, {
	    key: 'canvasWidth',
	    set: function set(newWidth) {
	      this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
	      this._canvas.width = newWidth;
	      this.drawUI();
	      return this;
	    }
	  }, {
	    key: 'canvasHeight',
	    set: function set(newHeight) {
	      this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
	      this._canvas.height = newHeight;
	      this.drawUI();
	      return this;
	    }
	  }, {
	    key: 'value',
	    set: function set(newValue) {
	      this._value = Math.max(Math.min(newValue, this._maxValue), this._minValue);
	      this.drawUI();
	      this.notify();
	      return this;
	    },
	    get: function get() {
	      return this._value;
	    }
	  }, {
	    key: 'r',
	    get: function get() {
	      return Math.trunc(Math.min(this.cX, this.cY) * 0.9);
	    }
	  }, {
	    key: 'cX',
	    get: function get() {
	      return Math.trunc(this._canvas.width / 2);
	    }
	  }, {
	    key: 'cY',
	    get: function get() {
	      return Math.trunc(this._canvas.height / 2);
	    }
	  }, {
	    key: 'clickThresh',
	    get: function get() {
	      return 3;
	    }
	  }]);

	  return Dial;
	}();

	exports.default = Dial;

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _DropMenu = __webpack_require__(13);

	var _DropMenu2 = _interopRequireDefault(_DropMenu);

	var _Dial = __webpack_require__(16);

	var _Dial2 = _interopRequireDefault(_Dial);

	var _Numberbox = __webpack_require__(14);

	var _Numberbox2 = _interopRequireDefault(_Numberbox);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	'use strict'; /* ---------------------------- */
	/* --- Delay UI controller --- */
	/* ---------------------------- */

	var DelayCtrl = function DelayCtrl(adt) {
	    var delay = {};

	    adt.delay.delayTimeLDial = new _Dial2.default({
	        container: document.querySelector('#additor .delay-ctrl .delayTime-ctrl .L .dial'),
	        value: Math.trunc(adt.delay.node.delayTimeL.value * 10),
	        minValue: 0,
	        maxValue: 1000
	    }).subscribe(this, function (val) {
	        adt.delay.node.delayTimeL.value = val / 100;
	        adt.delay.delayTimeLNumbox.value = val * 10;
	    });

	    adt.delay.delayTimeLNumbox = new _Numberbox2.default({
	        container: document.querySelector('#additor .delay-ctrl .delayTime-ctrl .L .numbox'),
	        value: adt.delay.node.delayTimeL.value,
	        minValue: 0,
	        maxValue: 10000,
	        appendString: ' ms'
	    }).subscribe(this, function (val) {
	        adt.delay.node.delayTimeL.value = val / 1000;
	        adt.delay.delayTimeLDial.value = val / 10;
	    });

	    adt.delay.delayTimeRDial = new _Dial2.default({
	        container: document.querySelector('#additor .delay-ctrl .delayTime-ctrl .R .dial'),
	        value: adt.delay.node.delayTimeR.value,
	        minValue: 0,
	        maxValue: 1000
	    }).subscribe(this, function (val) {
	        adt.delay.node.delayTimeR.value = val / 100;
	        adt.delay.delayTimeRNumbox.value = val * 10;
	    });

	    adt.delay.delayTimeRNumbox = new _Numberbox2.default({
	        container: document.querySelector('#additor .delay-ctrl .delayTime-ctrl .R .numbox'),
	        value: adt.delay.node.delayTimeR.value,
	        minValue: 0,
	        maxValue: 10000,
	        appendString: ' ms'
	    }).subscribe(this, function (val) {
	        adt.delay.node.delayTimeR.value = val / 1000;
	        adt.delay.delayTimeRDial.value = val / 10;
	    });

	    adt.delay.feedbackLDial = new _Dial2.default({
	        container: document.querySelector('#additor .delay-ctrl .feedback-ctrl .L .dial'),
	        value: Math.trunc(adt.delay.node.feedbackL.value * 100),
	        minValue: 0,
	        maxValue: 100
	    }).subscribe(this, function (val) {
	        adt.delay.node.feedbackL.value = val / 100;
	        adt.delay.feedbackLNumbox.value = val;
	    });

	    adt.delay.feedbackLNumbox = new _Numberbox2.default({
	        container: document.querySelector('#additor .delay-ctrl .feedback-ctrl .L .numbox'),
	        value: Math.trunc(adt.delay.node.feedbackL.value * 100),
	        minValue: 0,
	        maxValue: 100,
	        appendString: ' %'
	    }).subscribe(this, function (val) {
	        adt.delay.node.feedbackL.value = val / 100;
	        adt.delay.feedbackLDial.value = val;
	    });

	    adt.delay.feedbackRDial = new _Dial2.default({
	        container: document.querySelector('#additor .delay-ctrl .feedback-ctrl .R .dial'),
	        value: Math.trunc(adt.delay.node.feedbackL.value * 100),
	        minValue: 0,
	        maxValue: 100
	    }).subscribe(this, function (val) {
	        adt.delay.node.feedbackR.value = val / 100;
	        adt.delay.feedbackRNumbox.value = val;
	    });

	    adt.delay.feedbackRNumbox = new _Numberbox2.default({
	        container: document.querySelector('#additor .delay-ctrl .feedback-ctrl .R .numbox'),
	        value: Math.trunc(adt.delay.node.feedbackL.value * 100),
	        minValue: 0,
	        maxValue: 100,
	        appendString: ' %'
	    }).subscribe(this, function (val) {
	        adt.delay.node.feedbackR.value = val;
	        adt.delay.feedbackRDial.value = val;
	    });

	    adt.delay.dryMixLDial = new _Dial2.default({
	        container: document.querySelector('#additor .delay-ctrl .dryMix-ctrl .L .dial'),
	        value: Math.trunc(adt.delay.node.dryMixL.value * 100),
	        minValue: 0,
	        maxValue: 100
	    }).subscribe(this, function (val) {
	        adt.delay.node.dryMixL.value = val / 100;
	        adt.delay.dryMixLNumbox.value = val;
	    });

	    adt.delay.dryMixLNumbox = new _Numberbox2.default({
	        container: document.querySelector('#additor .delay-ctrl .dryMix-ctrl .L .numbox'),
	        value: Math.trunc(adt.delay.node.dryMixL.value * 100),
	        minValue: 0,
	        maxValue: 100,
	        appendString: ' %'
	    }).subscribe(this, function (val) {
	        adt.delay.node.dryMixL.value = val / 100;
	        adt.delay.dryMixLDial.value = val;
	    });

	    adt.delay.dryMixRDial = new _Dial2.default({
	        container: document.querySelector('#additor .delay-ctrl .dryMix-ctrl .R .dial'),
	        value: Math.trunc(adt.delay.node.dryMixR.value * 100),
	        minValue: 0,
	        maxValue: 100
	    }).subscribe(this, function (val) {
	        adt.delay.node.dryMixR.value = val / 100;
	        adt.delay.dryMixRNumbox.value = val;
	    });

	    adt.delay.dryMixRNumbox = new _Numberbox2.default({
	        container: document.querySelector('#additor .delay-ctrl .dryMix-ctrl .R .numbox'),
	        value: Math.trunc(adt.delay.node.dryMixR.value * 100),
	        minValue: 0,
	        maxValue: 100,
	        appendString: ' %'
	    }).subscribe(this, function (val) {
	        adt.delay.node.dryMixR.value = val / 100;
	        adt.delay.dryMixRDial.value = val;
	    });

	    adt.delay.wetMixLDial = new _Dial2.default({
	        container: document.querySelector('#additor .delay-ctrl .wetMix-ctrl .L .dial'),
	        value: Math.trunc(adt.delay.node.wetMixL.value * 100),
	        minValue: 0,
	        maxValue: 100
	    }).subscribe(this, function (val) {
	        adt.delay.node.wetMixL.value = val / 100;
	        adt.delay.wetMixLNumbox.value = val;
	    });

	    adt.delay.wetMixLNumbox = new _Numberbox2.default({
	        container: document.querySelector('#additor .delay-ctrl .wetMix-ctrl .L .numbox'),
	        value: Math.trunc(adt.delay.node.wetMixL.value * 100),
	        minValue: 0,
	        maxValue: 100,
	        appendString: ' %'
	    }).subscribe(this, function (val) {
	        adt.delay.node.wetMixL.value = val / 100;
	        adt.delay.wetMixLDial.value = val;
	    });

	    adt.delay.wetMixRDial = new _Dial2.default({
	        container: document.querySelector('#additor .delay-ctrl .wetMix-ctrl .R .dial'),
	        value: Math.trunc(adt.delay.node.wetMixR.value * 100),
	        minValue: 0,
	        maxValue: 100
	    }).subscribe(this, function (val) {
	        adt.delay.node.wetMixR.value = val / 100;
	        adt.delay.wetMixRNumbox.value = val;
	    });

	    adt.delay.wetMixRNumbox = new _Numberbox2.default({
	        container: document.querySelector('#additor .delay-ctrl .wetMix-ctrl .R .numbox'),
	        value: Math.trunc(adt.delay.node.wetMixR.value * 100),
	        minValue: 0,
	        maxValue: 100,
	        appendString: ' %'
	    }).subscribe(this, function (val) {
	        adt.delay.node.wetMixR.value = val / 100;
	        adt.delay.wetMixRDial.value = val;
	    });

	    adt.delay.updateUI = function () {
	        adt.delay.delayTimeLDial.value = Math.trunc(adt.delay.node.delayTimeL.value * 100);
	        adt.delay.delayTimeLNumbox.value = Math.trunc(adt.delay.node.delayTimeL.value * 1000);
	        adt.delay.delayTimeRDial.value = Math.trunc(adt.delay.node.delayTimeR.value * 100);
	        adt.delay.delayTimeRNumbox.value = Math.trunc(adt.delay.node.delayTimeR.value * 1000);
	        adt.delay.feedbackLDial.value = Math.trunc(adt.delay.node.feedbackL.value * 100);
	        adt.delay.feedbackLNumbox.value = Math.trunc(adt.delay.node.feedbackL.value * 100);
	        adt.delay.feedbackRDial.value = Math.trunc(adt.delay.node.feedbackR.value * 100);
	        adt.delay.feedbackRNumbox.value = Math.trunc(adt.delay.node.feedbackR.value * 100);
	        adt.delay.dryMixLDial.value = Math.trunc(adt.delay.node.dryMixL.value * 100);
	        adt.delay.dryMixLNumbox.value = Math.trunc(adt.delay.node.dryMixL.value * 100);
	        adt.delay.dryMixRDial.value = Math.trunc(adt.delay.node.dryMixR.value * 100);
	        adt.delay.dryMixRNumbox.value = Math.trunc(adt.delay.node.dryMixR.value * 100);
	        adt.delay.wetMixLDial.value = Math.trunc(adt.delay.node.wetMixL.value * 100);
	        adt.delay.wetMixLNumbox.value = Math.trunc(adt.delay.node.wetMixL.value * 100);
	        adt.delay.wetMixRDial.value = Math.trunc(adt.delay.node.wetMixR.value * 100);
	        adt.delay.wetMixRNumbox.value = Math.trunc(adt.delay.node.wetMixR.value * 100);
	    };

	    return adt.delay;
	};

	exports.default = DelayCtrl;

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _DropMenu = __webpack_require__(13);

	var _DropMenu2 = _interopRequireDefault(_DropMenu);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	'use strict'; /* --------------------------- */
	/* --- Overtone controller --- */
	/* --------------------------- */

	var VoicesCtrl = function VoicesCtrl(adt) {
	  var voices = {};

	  voices.polyModeMenu = new _DropMenu2.default({
	    container: document.querySelector('#additor .synth-ctrl .poly-mode-menu'),
	    menuItems: ['polyphonic', 'monophonic']
	  }).subscribe(this, function (selectionIndex) {
	    if (selectionIndex === 0) {
	      adt.kbd.mode = 'polyphonic';
	      adt.synth.node.numberOfVoices = 1;
	    } else {
	      adt.kbd.mode = 'monophonic';
	      adt.synth.node.numberOfVoices = numVoices;
	    }
	  });

	  voices.numVoicesNumbox = document.querySelector('#additor .synth-ctrl #number-of-voices');
	  voices.numVoicesNumbox.value = adt.synth.node.numVoices;
	  voices.numVoicesNumbox.addEventListener('blur', changeNumVoices);
	  voices.numVoicesNumbox.addEventListener('keyup', function (e) {
	    if (e.key === 'Enter') {
	      changeNumVoices();
	    }
	  });
	  function changeNumVoices() {
	    adt.synth.node.numVoices = adt.voices.numVoicesNumbox.value;
	  }

	  voices.numOtNumbox = document.querySelector('#additor .synth-ctrl #number-of-overtones');
	  voices.numOtNumbox.value = adt.synth.node.numOvertones;
	  voices.numOtNumbox.addEventListener('blur', changeNumOvertones);
	  voices.numOtNumbox.addEventListener('keyup', function (e) {
	    if (e.key === 'Enter') {
	      changeNumOvertones();
	    }
	  });
	  function changeNumOvertones() {
	    adt.synth.node.numOvertones = adt.voices.numOtNumbox.value;
	    adt.synth.node.numBins = adt.voices.numOtNumbox.value;
	  }

	  return voices;
	};

	exports.default = VoicesCtrl;

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _DropMenu = __webpack_require__(13);

	var _DropMenu2 = _interopRequireDefault(_DropMenu);

	var _presets = __webpack_require__(20);

	var _presets2 = _interopRequireDefault(_presets);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/* -------------------------- */
	/* --- Presets controller --- */
	/* -------------------------- */

	'use strict';

	var PresetsCtrl = function PresetsCtrl(adt) {
	  var presets = {};

	  // preset dropmenu
	  adt.presets.selectPresetMenu = new _DropMenu2.default({
	    container: document.querySelector("#additor .main-header .select-preset .select-preset-menu")
	  }).subscribe(this, function (menuIndex) {
	    adt.presets.loadPreset(adt.presets.data[menuIndex]);
	  });

	  function loadAllPresets() {
	    var url = '/presets/all_presets.json';

	    var xhr = new XMLHttpRequest();

	    xhr.open('GET', url, true);
	    xhr.onreadystatechange = function () {
	      console.log('XHR loadAllPresets status is ' + xhr.status);
	      if (xhr.status.toString().match(/^2\d\d$/) !== null) {
	        parsePresets(JSON.parse(xhr.response).preset_data);
	        adt.presets.loadPreset(adt.presets.data[0]);
	      }
	    };
	    xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
	    xhr.send();
	  }

	  function parsePresets(rawPresetData) {
	    adt.presets.data = rawPresetData;

	    rawPresetData.forEach(function (preset) {
	      adt.presets.selectPresetMenu.addMenuItem(preset.name);
	    });

	    adt.presets.loadPreset(adt.presets.data[0]);
	  }

	  adt.presets.loadPreset = function (preset) {
	    // load overtone histo
	    adt.ot.histo.dataBins = preset.ot.histo.dataBins;

	    // load envelopes
	    adt.env.main.attackGraph.vertices = preset.env.main.attackGraph.vertices.map(function (vertex) {
	      return vertex.slice();
	    });
	    adt.env.main.sustainGraph.vertices = preset.env.main.sustainGraph.vertices.map(function (vertex) {
	      return vertex.slice();
	    });
	    adt.env.main.releaseGraph.vertices = preset.env.main.releaseGraph.vertices.map(function (vertex) {
	      return vertex.slice();
	    });
	    adt.synth.node.attackEnvelope = adt.env.main.attackGraph.vertices;
	    adt.synth.node.releaseEnvelope = adt.env.main.releaseGraph.vertices;

	    adt.env.ot.forEach(function (otEnv, otIndex) {
	      otEnv.attackGraph.vertices = preset.env.ot[otIndex].attackGraph.vertices.map(function (vertex) {
	        return vertex.slice();
	      });
	      otEnv.sustainGraph.vertices = preset.env.ot[otIndex].sustainGraph.vertices.map(function (vertex) {
	        return vertex.slice();
	      });
	      otEnv.releaseGraph.vertices = preset.env.ot[otIndex].releaseGraph.vertices.map(function (vertex) {
	        return vertex.slice();
	      });
	      adt.synth.node.setOvertoneAttackEnvelope(otIndex, otEnv.attackGraph.vertices);
	      adt.synth.node.setOvertoneReleaseEnvelope(otIndex, otEnv.releaseGraph.vertices);
	    });

	    // load filter
	    adt.filter.node.type = preset.filter.type;
	    adt.filter.node.frequency.value = preset.filter.freq;
	    adt.filter.node.Q.value = preset.filter.Q;
	    adt.filter.node.gain.value = preset.filter.gain;
	    adt.filter.updateUI();

	    // load delay
	    adt.delay.node.delayTimeL.value = preset.delay.delayTimeL;
	    adt.delay.node.delayTimeR.value = preset.delay.delayTimeR;
	    adt.delay.node.feedbackL.value = preset.delay.feedbackL;
	    adt.delay.node.feedbackR.value = preset.delay.feedbackR;
	    adt.delay.node.dryMixL.value = preset.delay.dryMixL;
	    adt.delay.node.dryMixR.value = preset.delay.dryMixR;
	    adt.delay.node.wetMixL.value = preset.delay.wetMixL;
	    adt.delay.node.wetMixR.value = preset.delay.wetMixR;
	    adt.delay.updateUI();
	  };

	  parsePresets(_presets2.default.preset_data);

	  /* Preset saving */
	  /*
	  const presetNameInput = document.querySelector('#preset-name');
	  const savePresetBtn = document.querySelector('#additor .main-header .btn.save-preset');
	   savePresetBtn.addEventListener('mouseup', savePreset);
	  function savePreset () {
	    let preset = {
	      name: presetNameInput.value,
	      ot: {
	        histo: {
	          dataBins: adt.ot.histo.dataBins
	        }
	      },
	      env: {
	        main: {
	          attackGraph: {
	            vertices: adt.env.main.attackGraph.vertices,
	            maxXValue: adt.env.main.attackGraph.maxXValue
	          },
	          sustainGraph: {
	            vertices: adt.env.main.sustainGraph.vertices,
	            maxXValue: adt.env.main.sustainGraph.maxXValue
	          },
	          releaseGraph: {
	            vertices: adt.env.main.releaseGraph.vertices,
	            maxXValue: adt.env.main.releaseGraph.maxXValue
	          }
	        },
	        ot: (function () {
	          let otEnvPresets = [];
	           adt.env.ot.forEach((otEnv, otIndex) => {
	            let newOtEnvPreset = {
	              attackGraph: {
	                vertices: otEnv.attackGraph.vertices
	              },
	              sustainGraph: {
	                vertices: otEnv.sustainGraph.vertices
	              },
	              releaseGraph: {
	                vertices: otEnv.releaseGraph.vertices
	              }
	            };
	            otEnvPresets.push(newOtEnvPreset);
	          });
	           return otEnvPresets;
	        })()
	      },
	      filter: {
	        type: adt.filter.node.type,
	        freq: adt.filter.node.frequency.value,
	        Q: adt.filter.node.Q.value,
	        gain: adt.filter.node.gain.value
	      },
	      delay: {
	        delayTimeL: adt.delay.node.delayTimeL.value,
	        delayTimeR: adt.delay.node.delayTimeR.value,
	        feedbackL: adt.delay.node.feedbackL.value,
	        feedbackR: adt.delay.node.feedbackR.value,
	        dryMixL: adt.delay.node.dryMixL.value,
	        dryMixR: adt.delay.node.dryMixR.value,
	        wetMixL: adt.delay.node.wetMixL.value,
	        wetMixR: adt.delay.node.wetMixR.value
	      }
	    };
	    savePresetXHR(preset);
	  }
	   function savePresetXHR (preset) {
	    const url = 'http://127.0.0.1:5984/additor_presets/all_presets';
	     let getXHR = new XMLHttpRequest();
	    let putReqBody = {};
	    let _rev = '';
	    let preset_data = [];
	     getXHR.open('GET', url, true);
	    getXHR.onreadystatechange = function () {
	      // if getXHR successfully returns something, store it so we can add to it
	      if(getXHR.status.toString().match(/^2\d\d$/) !== null) {
	        let parsedData = JSON.parse(getXHR.response);
	        _rev = parsedData._rev;
	        preset_data = parsedData.preset_data;
	        putReqBody._rev = _rev;
	      }
	      putData();
	    };
	    getXHR.send();
	     function putData () {
	      let timesfired = 0;
	      preset_data.push(preset);
	      putReqBody.preset_data = preset_data;
	       let putXHR = new XMLHttpRequest();
	       putXHR.open('PUT', url, true);
	      putXHR.onreadystatechange = function () {
	        timesfired++;
	        console.log('timesfired: ' + timesfired);
	        console.log(putXHR.response);
	      }
	      putXHR.setRequestHeader("Content-Type", "application/json");
	      putXHR.send(JSON.stringify(putReqBody));
	    }
	  }
	  */

	  return adt.presets;
	};

	exports.default = PresetsCtrl;

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;"use strict";

	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__], __WEBPACK_AMD_DEFINE_RESULT__ = function (require) {

	  var additorPresets = { "_id": "all_presets", "_rev": "33-78d88b228043e833cab575e67abf564c", "preset_data": [{ "name": "Electric Horn", "ot": { "histo": { "dataBins": [2.2, 0.513244622053004, 0.7592945561539101, 0.5332291666666666, 0.7065625, 0.5198958333333333, 0.47322916666666665, 0.4665625, 0.4398958333333333, 0.3932291666666667, 0.4998958333333333, 0.3865625, 0.6532291666666666, 0.3665625, 0.47989583333333335, 0.5065625, 0.6398958333333333, 0.5532291666666667, 0.4398958333333333, 0.6798958333333334, 0.5065625, 0.5198958333333333, 0.5265625, 0.6198958333333333, 0.6532291666666666, 0.5198958333333333, 0.5132291666666666, 0.6332291666666666, 0.49322916666666666, 0.43322916666666667, 0.47322916666666665, 0.4865625, 0.5265625, 0.5598958333333334, 0.5198958333333333, 0.5598958333333334, 0.5332291666666666, 0.6532291666666666, 0.6065625, 0.7198958333333333] } }, "env": { "main": { "attackGraph": { "vertices": [[0, 0], [0.05, 1], [1, 1]], "maxXValue": 1 }, "sustainGraph": { "vertices": [[0, 1], [1, 1]], "maxXValue": 1 }, "releaseGraph": { "vertices": [[0, 1], [0.5, 1], [1, 0]], "maxXValue": 1 } }, "ot": [{ "attackGraph": { "vertices": [[0, 0], [0.05, 1], [1, 1]] }, "sustainGraph": { "vertices": [[0, 1], [1, 1]] }, "releaseGraph": { "vertices": [[0, 1], [0.5, 1], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0.1, 0.91], [0.52, 0.71], [1, 0.81]] }, "sustainGraph": { "vertices": [[0, 0.81], [1, 0.81]] }, "releaseGraph": { "vertices": [[0, 0.81], [0.36, 0.81], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0.15, 0.77], [1, 0.83]] }, "sustainGraph": { "vertices": [[0, 0.83], [1, 0.83]] }, "releaseGraph": { "vertices": [[0, 0.83], [0.48, 0.83], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0.15, 0.89], [1, 0.83]] }, "sustainGraph": { "vertices": [[0, 0.83], [1, 0.83]] }, "releaseGraph": { "vertices": [[0, 0.83], [0.48, 0.83], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0.23, 0.85], [1, 0.72]] }, "sustainGraph": { "vertices": [[0, 0.72], [1, 0.72]] }, "releaseGraph": { "vertices": [[0, 0.72], [0.34, 0.72], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0.21, 0.94], [1, 0.83]] }, "sustainGraph": { "vertices": [[0, 0.83], [1, 0.83]] }, "releaseGraph": { "vertices": [[0, 0.83], [0.48, 0.83], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0.11, 0.86], [1, 0.83]] }, "sustainGraph": { "vertices": [[0, 0.83], [1, 0.83]] }, "releaseGraph": { "vertices": [[0, 0.83], [0.48, 0.83], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0.23, 0.69], [1, 0.83]] }, "sustainGraph": { "vertices": [[0, 0.83], [1, 0.83]] }, "releaseGraph": { "vertices": [[0, 0.83], [0.48, 0.83], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0.16, 0.81], [1, 0.83]] }, "sustainGraph": { "vertices": [[0, 0.83], [1, 0.83]] }, "releaseGraph": { "vertices": [[0, 0.83], [0.48, 0.83], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0.19, 0.75], [1, 0.74]] }, "sustainGraph": { "vertices": [[0, 0.74], [1, 0.74]] }, "releaseGraph": { "vertices": [[0, 0.74], [0.48, 0.74], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0.68, 0.08], [0.86, 0.33], [1, 0.25]] }, "sustainGraph": { "vertices": [[0, 0.25], [1, 0.25]] }, "releaseGraph": { "vertices": [[0, 0.25], [0.17, 0.25], [0.31, 0.12], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0.68, 0.08], [0.86, 0.33], [1, 0.25]] }, "sustainGraph": { "vertices": [[0, 0.25], [1, 0.25]] }, "releaseGraph": { "vertices": [[0, 0.25], [0.17, 0.25], [0.31, 0.12], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0.64, 0.12], [0.82, 0.37], [1, 0.31]] }, "sustainGraph": { "vertices": [[0, 0.31], [1, 0.31]] }, "releaseGraph": { "vertices": [[0, 0.31], [0.2, 0.31], [0.34, 0.17], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0.64, 0.24], [0.86, 0.33], [1, 0.32]] }, "sustainGraph": { "vertices": [[0, 0.32], [1, 0.32]] }, "releaseGraph": { "vertices": [[0, 0.32], [0.24, 0.32], [0.36, 0.2], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0.68, 0.08], [0.8, 0.19], [0.86, 0.33], [1, 0.25]] }, "sustainGraph": { "vertices": [[0, 0.25], [1, 0.25]] }, "releaseGraph": { "vertices": [[0, 0.25], [0.17, 0.25], [0.31, 0.12], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0.68, 0.08], [0.86, 0.33], [1, 0.25]] }, "sustainGraph": { "vertices": [[0, 0.25], [1, 0.25]] }, "releaseGraph": { "vertices": [[0, 0.25], [0.17, 0.25], [0.31, 0.12], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0.64, 0.21], [0.8, 0.44], [1, 0.25]] }, "sustainGraph": { "vertices": [[0, 0.25], [1, 0.25]] }, "releaseGraph": { "vertices": [[0, 0.25], [0.17, 0.25], [0.31, 0.12], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0.68, 0.08], [0.9, 0.29], [1, 0.25]] }, "sustainGraph": { "vertices": [[0, 0.25], [1, 0.25]] }, "releaseGraph": { "vertices": [[0, 0.25], [0.17, 0.25], [0.31, 0.12], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0.68, 0.08], [0.86, 0.33], [1, 0.36]] }, "sustainGraph": { "vertices": [[0, 0.36], [1, 0.36]] }, "releaseGraph": { "vertices": [[0, 0.36], [0.25, 0.36], [0.31, 0.12], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0.68, 0.08], [0.86, 0.33], [1, 0.25]] }, "sustainGraph": { "vertices": [[0, 0.25], [1, 0.25]] }, "releaseGraph": { "vertices": [[0, 0.25], [0.17, 0.25], [0.31, 0.12], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0.68, 0.08], [0.86, 0.33], [1, 0.25]] }, "sustainGraph": { "vertices": [[0, 0.25], [1, 0.25]] }, "releaseGraph": { "vertices": [[0, 0.25], [0.17, 0.25], [0.31, 0.12], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0.68, 0.01], [0.86, 0.33], [1, 0.25]] }, "sustainGraph": { "vertices": [[0, 0.25], [1, 0.25]] }, "releaseGraph": { "vertices": [[0, 0.25], [0.17, 0.25], [0.31, 0.12], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0.68, 0.01], [0.86, 0.33], [1, 0.25]] }, "sustainGraph": { "vertices": [[0, 0.25], [1, 0.25]] }, "releaseGraph": { "vertices": [[0, 0.25], [0.17, 0.25], [0.31, 0.12], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0.68, 0.01], [0.86, 0.33], [1, 0.25]] }, "sustainGraph": { "vertices": [[0, 0.25], [1, 0.25]] }, "releaseGraph": { "vertices": [[0, 0.25], [0.17, 0.25], [0.31, 0.12], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0.68, 0.01], [0.86, 0.33], [1, 0.25]] }, "sustainGraph": { "vertices": [[0, 0.25], [1, 0.25]] }, "releaseGraph": { "vertices": [[0, 0.25], [0.17, 0.25], [0.31, 0.12], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0.76, 0.02], [0.95, 0.25], [1, 0.25]] }, "sustainGraph": { "vertices": [[0, 0.25], [1, 0.25]] }, "releaseGraph": { "vertices": [[0, 0.25], [0.17, 0.25], [0.31, 0.12], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0.68, 0.01], [0.86, 0.33], [1, 0.25]] }, "sustainGraph": { "vertices": [[0, 0.25], [1, 0.25]] }, "releaseGraph": { "vertices": [[0, 0.25], [0.17, 0.25], [0.31, 0.12], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0.68, 0.01], [0.86, 0.33], [1, 0.25]] }, "sustainGraph": { "vertices": [[0, 0.25], [1, 0.25]] }, "releaseGraph": { "vertices": [[0, 0.25], [0.17, 0.25], [0.31, 0.12], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0.68, 0.01], [0.86, 0.33], [1, 0.25]] }, "sustainGraph": { "vertices": [[0, 0.25], [1, 0.25]] }, "releaseGraph": { "vertices": [[0, 0.25], [0.17, 0.25], [0.31, 0.12], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0.68, 0.01], [0.86, 0.33], [1, 0.25]] }, "sustainGraph": { "vertices": [[0, 0.25], [1, 0.25]] }, "releaseGraph": { "vertices": [[0, 0.25], [0.17, 0.25], [0.31, 0.12], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0.68, 0.01], [0.86, 0.33], [1, 0.25]] }, "sustainGraph": { "vertices": [[0, 0.25], [1, 0.25]] }, "releaseGraph": { "vertices": [[0, 0.25], [0.17, 0.25], [0.31, 0.12], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0.09, 0.92], [0.85, 0.9], [1, 0.25]] }, "sustainGraph": { "vertices": [[0, 0.25], [1, 0.25]] }, "releaseGraph": { "vertices": [[0, 0.25], [0.17, 0.25], [0.31, 0.12], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0.19, 0.71], [0.85, 0.9], [1, 0.25]] }, "sustainGraph": { "vertices": [[0, 0.25], [1, 0.25]] }, "releaseGraph": { "vertices": [[0, 0.25], [0.17, 0.25], [0.31, 0.12], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0.09, 0.92], [0.85, 0.9], [1, 0.25]] }, "sustainGraph": { "vertices": [[0, 0.25], [1, 0.25]] }, "releaseGraph": { "vertices": [[0, 0.25], [0.17, 0.25], [0.31, 0.12], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0.09, 0.92], [0.91, 0.93], [1, 0.25]] }, "sustainGraph": { "vertices": [[0, 0.25], [1, 0.25]] }, "releaseGraph": { "vertices": [[0, 0.25], [0.17, 0.25], [0.31, 0.12], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0.09, 0.92], [0.85, 0.78], [1, 0.25]] }, "sustainGraph": { "vertices": [[0, 0.25], [1, 0.25]] }, "releaseGraph": { "vertices": [[0, 0.25], [0.17, 0.25], [0.31, 0.12], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0.09, 0.92], [0.83, 0.81], [1, 0.25]] }, "sustainGraph": { "vertices": [[0, 0.25], [1, 0.25]] }, "releaseGraph": { "vertices": [[0, 0.25], [0.17, 0.25], [0.31, 0.12], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0.09, 0.92], [0.82, 0.84], [1, 0.07]] }, "sustainGraph": { "vertices": [[0, 0.07], [1, 0.07]] }, "releaseGraph": { "vertices": [[0, 0.07], [0.17, 0.07], [0.3, 0.01], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0.08, 0.98], [0.85, 0.9], [1, 0.25]] }, "sustainGraph": { "vertices": [[0, 0.25], [1, 0.25]] }, "releaseGraph": { "vertices": [[0, 0.25], [0.17, 0.25], [0.31, 0.12], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0.24, 0.64], [1, 0.8]] }, "sustainGraph": { "vertices": [[0, 0.8], [1, 0.8]] }, "releaseGraph": { "vertices": [[0, 0.8], [0.39, 0.8], [0.56, 0.52], [1, 0]] } }] }, "filter": { "type": "lowpass", "freq": 400, "Q": 1, "gain": 0 }, "delay": { "delayTimeL": 0.800000011920929, "delayTimeR": 1.600000023841858, "feedbackL": 0.10000000149011612, "feedbackR": 0.10000000149011612, "dryMixL": 1, "dryMixR": 1, "wetMixL": 0.3700000047683716, "wetMixR": 0.3400000035762787 } }, { "name": "Sweep In", "ot": { "histo": { "dataBins": [1.0065625, 0.9532291666666667, 0.8732291666666666, 0.8198958333333334, 0.7532291666666666, 0.6732291666666667, 0.5798958333333334, 0.4532291666666667, 0.3865625, 0.35322916666666665, 0.33989583333333334, 0.3265625, 0.31322916666666667, 0.31322916666666667, 0.31322916666666667, 0.3198958333333333, 0.3265625, 0.33989583333333334, 0.3665625, 0.3798958333333333, 0.3932291666666667, 0.43322916666666667, 0.47322916666666665, 0.4865625, 0.5332291666666666, 0.5732291666666667, 0.5998958333333333, 0.6398958333333333, 0.6865625, 0.7332291666666667, 0.7998958333333334, 0.8398958333333333, 0.8932291666666666, 0.9532291666666667, 0.9865625, 1.0065625, 1.0065625, 1.0065625, 0.9998958333333333, 1.0065625] } }, "env": { "main": { "attackGraph": { "vertices": [[0, 0], [0.52, 0.98], [0.65, 0.66], [0.81, 0.52], [1.02, 0.53], [1.29, 0.63], [1.59, 0.92], [1.81, 0.97], [2, 0.98]], "maxXValue": 2 }, "sustainGraph": { "vertices": [[0, 0.98], [1, 0.98]], "maxXValue": 1 }, "releaseGraph": { "vertices": [[0, 0.98], [0.13, 0.96], [0.18, 0.66], [0.29, 0.46], [0.39, 0.29], [0.51, 0.11], [0.71, 0.06], [1, 0]], "maxXValue": 1 } }, "ot": [{ "attackGraph": { "vertices": [[0, 0], [0.51, 1], [0.72, 0.9900000000000001], [1, 0.99], [2, 0.99]] }, "sustainGraph": { "vertices": [[0, 0.99], [1, 0.99]] }, "releaseGraph": { "vertices": [[0, 0.99], [0.29, 0.46], [0.49, 0.2], [0.57, 0.08], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0.029999999999999985], [0.88, 0.01], [1.23, 0.08], [1.66, 0.4], [1.83, 0.6], [1.9, 0.8], [2, 0.95]] }, "sustainGraph": { "vertices": [[0, 0.95], [1, 0.95]] }, "releaseGraph": { "vertices": [[0, 0.95], [0.17, 0.25], [0.31, 0.12], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0.029999999999999985], [0.88, 0.01], [1.23, 0.08], [1.66, 0.4], [1.83, 0.6], [1.9, 0.8], [2, 0.9500000000000001]] }, "sustainGraph": { "vertices": [[0, 0.9500000000000001], [1, 0.9500000000000001]] }, "releaseGraph": { "vertices": [[0, 0.9500000000000001], [0.17, 0.25], [0.31, 0.12], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0.029999999999999985], [0.88, 0.01], [1.23, 0.08], [1.66, 0.4], [1.83, 0.6], [1.9, 0.8], [2, 0.9299999999999999]] }, "sustainGraph": { "vertices": [[0, 0.9299999999999999], [1, 0.9299999999999999]] }, "releaseGraph": { "vertices": [[0, 0.9299999999999999], [0.17, 0.25], [0.31, 0.12], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0.029999999999999985], [0.88, 0.01], [1.23, 0.08], [1.66, 0.4], [1.83, 0.6], [1.9, 0.8], [2, 0.98]] }, "sustainGraph": { "vertices": [[0, 0.98], [1, 0.98]] }, "releaseGraph": { "vertices": [[0, 0.98], [0.17, 0.25], [0.31, 0.12], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0.029999999999999985], [0.88, 0.01], [1.23, 0.08], [1.66, 0.4], [1.83, 0.6], [1.9, 0.8], [2, 0.97]] }, "sustainGraph": { "vertices": [[0, 0.97], [1, 0.97]] }, "releaseGraph": { "vertices": [[0, 0.97], [0.17, 0.25], [0.31, 0.12], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0.51, 1], [0.72, 0.9900000000000001], [1, 0.99], [1.87, 1], [2, 0.98]] }, "sustainGraph": { "vertices": [[0, 0.98], [1, 0.98]] }, "releaseGraph": { "vertices": [[0, 0.98], [0.29, 0.46], [0.49, 0.2], [0.57, 0.08], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0.51, 1], [0.72, 0.9900000000000001], [1, 0.99], [1.87, 1], [2, 0.99]] }, "sustainGraph": { "vertices": [[0, 0.99], [1, 0.99]] }, "releaseGraph": { "vertices": [[0, 0.99], [0.29, 0.46], [0.49, 0.2], [0.57, 0.08], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0.51, 1], [0.72, 0.9900000000000001], [1, 0.99], [1.87, 1], [2, 0.99]] }, "sustainGraph": { "vertices": [[0, 0.99], [1, 0.99]] }, "releaseGraph": { "vertices": [[0, 0.99], [0.29, 0.46], [0.49, 0.2], [0.57, 0.08], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0.51, 1], [0.72, 0.9900000000000001], [1, 0.99], [1.87, 1], [2, 0.98]] }, "sustainGraph": { "vertices": [[0, 0.98], [1, 0.98]] }, "releaseGraph": { "vertices": [[0, 0.98], [0.29, 0.46], [0.49, 0.2], [0.57, 0.08], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0.51, 1], [0.72, 0.9900000000000001], [1, 0.99], [1.87, 1], [2, 0.98]] }, "sustainGraph": { "vertices": [[0, 0.98], [1, 0.98]] }, "releaseGraph": { "vertices": [[0, 0.98], [0.29, 0.46], [0.49, 0.2], [0.57, 0.08], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0.51, 1], [0.72, 0.9900000000000001], [1, 0.99], [1.87, 1], [2, 0.97]] }, "sustainGraph": { "vertices": [[0, 0.97], [1, 0.97]] }, "releaseGraph": { "vertices": [[0, 0.97], [0.29, 0.46], [0.49, 0.2], [0.57, 0.08], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0.64, 0.12], [0.82, 0.37], [2, 0.31]] }, "sustainGraph": { "vertices": [[0, 0.31], [1, 0.31]] }, "releaseGraph": { "vertices": [[0, 0.31], [0.2, 0.31], [0.34, 0.17], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0.64, 0.24], [0.86, 0.33], [1.25, 0.66], [1.52, 0.9], [1.71, 1], [2, 0.97]] }, "sustainGraph": { "vertices": [[0, 0.97], [1, 0.97]] }, "releaseGraph": { "vertices": [[0, 0.97], [0.24, 0.32], [0.36, 0.2], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0.64, 0.24], [0.86, 0.33], [1.25, 0.66], [1.52, 0.9], [1.71, 1], [2, 0.96]] }, "sustainGraph": { "vertices": [[0, 0.96], [1, 0.96]] }, "releaseGraph": { "vertices": [[0, 0.96], [0.24, 0.32], [0.36, 0.2], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0.64, 0.24], [0.86, 0.33], [1.25, 0.66], [1.52, 0.9], [1.71, 1], [2, 0.99]] }, "sustainGraph": { "vertices": [[0, 0.99], [1, 0.99]] }, "releaseGraph": { "vertices": [[0, 0.99], [0.03, 0.89], [0.24, 0.2700000000000001], [0.36, 0.2], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0.64, 0.24], [0.86, 0.33], [1.25, 0.66], [1.52, 0.9], [1.71, 1], [2, 0.97]] }, "sustainGraph": { "vertices": [[0, 0.97], [1, 0.97]] }, "releaseGraph": { "vertices": [[0, 0.97], [0.03, 0.89], [0.24, 0.2700000000000001], [0.36, 0.2], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0.64, 0.24], [0.86, 0.33], [1.25, 0.66], [1.52, 0.9], [1.71, 1], [2, 0.89]] }, "sustainGraph": { "vertices": [[0, 0.89], [1, 0.89]] }, "releaseGraph": { "vertices": [[0, 0.89], [0.03, 0.89], [0.24, 0.2700000000000001], [0.36, 0.2], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0.64, 0.24], [0.86, 0.33], [1.25, 0.66], [1.52, 0.9], [1.71, 1], [2, 0.89]] }, "sustainGraph": { "vertices": [[0, 0.89], [1, 0.89]] }, "releaseGraph": { "vertices": [[0, 0.89], [0.03, 0.89], [0.24, 0.2700000000000001], [0.36, 0.2], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0.64, 0.24], [0.86, 0.33], [1.25, 0.66], [1.52, 0.9], [1.71, 1], [2, 0.89]] }, "sustainGraph": { "vertices": [[0, 0.89], [1, 0.89]] }, "releaseGraph": { "vertices": [[0, 0.89], [0.03, 0.89], [0.24, 0.2700000000000001], [0.36, 0.2], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0.64, 0.24], [0.86, 0.33], [1.25, 0.66], [1.52, 0.9], [1.71, 1], [2, 0.89]] }, "sustainGraph": { "vertices": [[0, 0.89], [1, 0.89]] }, "releaseGraph": { "vertices": [[0, 0.89], [0.03, 0.89], [0.24, 0.2700000000000001], [0.36, 0.2], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0.029999999999999985], [0.88, 0.01], [1.23, 0.08], [1.66, 0.4], [1.83, 0.6], [1.9, 0.8], [2, 0.9900000000000001]] }, "sustainGraph": { "vertices": [[0, 0.9900000000000001], [1, 0.9900000000000001]] }, "releaseGraph": { "vertices": [[0, 0.9900000000000001], [0.17, 0.25], [0.31, 0.12], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0.029999999999999985], [0.88, 0.01], [1.23, 0.08], [1.66, 0.4], [1.83, 0.6], [1.9, 0.8], [2, 0.94]] }, "sustainGraph": { "vertices": [[0, 0.94], [1, 0.94]] }, "releaseGraph": { "vertices": [[0, 0.94], [0.17, 0.25], [0.31, 0.12], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0.029999999999999985], [0.88, 0.01], [1.23, 0.08], [1.66, 0.4], [1.83, 0.6], [1.9, 0.8], [2, 0.9500000000000001]] }, "sustainGraph": { "vertices": [[0, 0.9500000000000001], [1, 0.9500000000000001]] }, "releaseGraph": { "vertices": [[0, 0.9500000000000001], [0.17, 0.25], [0.31, 0.12], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0.029999999999999985], [0.88, 0.01], [1.23, 0.08], [1.66, 0.4], [1.83, 0.6], [1.9, 0.8], [2, 0.92]] }, "sustainGraph": { "vertices": [[0, 0.92], [1, 0.92]] }, "releaseGraph": { "vertices": [[0, 0.92], [0.17, 0.25], [0.31, 0.12], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0.029999999999999985], [0.88, 0.01], [1.23, 0.08], [1.66, 0.4], [1.83, 0.6], [1.9, 0.8], [2, 0.9400000000000001]] }, "sustainGraph": { "vertices": [[0, 0.9400000000000001], [1, 0.9400000000000001]] }, "releaseGraph": { "vertices": [[0, 0.9400000000000001], [0.17, 0.25], [0.31, 0.12], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0.029999999999999985], [0.88, 0.01], [1.23, 0.08], [1.66, 0.4], [1.83, 0.6], [1.9, 0.8], [2, 0.98]] }, "sustainGraph": { "vertices": [[0, 0.98], [1, 0.98]] }, "releaseGraph": { "vertices": [[0, 0.98], [0.17, 0.25], [0.31, 0.12], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0.029999999999999985], [0.88, 0.01], [1.23, 0.08], [1.66, 0.4], [1.83, 0.6], [1.9, 0.8], [2, 0.98]] }, "sustainGraph": { "vertices": [[0, 0.98], [1, 0.98]] }, "releaseGraph": { "vertices": [[0, 0.98], [0.17, 0.25], [0.31, 0.12], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0.029999999999999985], [0.88, 0.01], [1.23, 0.08], [1.66, 0.4], [1.83, 0.6], [1.9, 0.8], [2, 0.99]] }, "sustainGraph": { "vertices": [[0, 0.99], [1, 0.99]] }, "releaseGraph": { "vertices": [[0, 0.99], [0.17, 0.25], [0.31, 0.12], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0.029999999999999985], [0.88, 0.01], [1.23, 0.08], [1.66, 0.4], [1.83, 0.6], [1.9, 0.8], [2, 0.97]] }, "sustainGraph": { "vertices": [[0, 0.97], [1, 0.97]] }, "releaseGraph": { "vertices": [[0, 0.97], [0.17, 0.25], [0.31, 0.12], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0.029999999999999985], [0.88, 0.01], [1.23, 0.08], [1.66, 0.4], [1.83, 0.6], [1.9, 0.8], [2, 0.9]] }, "sustainGraph": { "vertices": [[0, 0.9], [1, 0.9]] }, "releaseGraph": { "vertices": [[0, 0.9], [0.17, 0.25], [0.31, 0.12], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0.029999999999999985], [0.88, 0.01], [1.23, 0.08], [1.66, 0.4], [1.83, 0.6], [1.9, 0.8], [2, 0.92]] }, "sustainGraph": { "vertices": [[0, 0.92], [1, 0.92]] }, "releaseGraph": { "vertices": [[0, 0.92], [0.17, 0.25], [0.31, 0.12], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0.029999999999999985], [0.88, 0.01], [1.23, 0.08], [1.66, 0.4], [1.83, 0.6], [1.9, 0.8], [2, 0.99]] }, "sustainGraph": { "vertices": [[0, 0.99], [1, 0.99]] }, "releaseGraph": { "vertices": [[0, 0.99], [0.17, 0.25], [0.31, 0.12], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0.029999999999999985], [0.88, 0.01], [1.23, 0.08], [1.66, 0.4], [1.83, 0.6], [1.9, 0.8], [2, 0.95]] }, "sustainGraph": { "vertices": [[0, 0.95], [1, 0.95]] }, "releaseGraph": { "vertices": [[0, 0.95], [0.17, 0.25], [0.31, 0.12], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0.029999999999999985], [0.88, 0.01], [1.23, 0.08], [1.66, 0.4], [1.83, 0.6], [1.9, 0.8], [2, 0.99]] }, "sustainGraph": { "vertices": [[0, 0.99], [1, 0.99]] }, "releaseGraph": { "vertices": [[0, 0.99], [0.17, 0.25], [0.31, 0.12], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0.029999999999999985], [0.88, 0.01], [1.23, 0.08], [1.66, 0.4], [1.83, 0.6], [1.9, 0.8], [2, 0.9400000000000001]] }, "sustainGraph": { "vertices": [[0, 0.9400000000000001], [1, 0.9400000000000001]] }, "releaseGraph": { "vertices": [[0, 0.9400000000000001], [0.17, 0.25], [0.31, 0.12], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0.029999999999999985], [0.88, 0.01], [1.23, 0.08], [1.66, 0.4], [1.83, 0.6], [1.9, 0.8], [2, 0.9400000000000001]] }, "sustainGraph": { "vertices": [[0, 0.9400000000000001], [1, 0.9400000000000001]] }, "releaseGraph": { "vertices": [[0, 0.9400000000000001], [0.17, 0.25], [0.31, 0.12], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0.029999999999999985], [0.88, 0.01], [1.23, 0.08], [1.66, 0.4], [1.83, 0.6], [1.9, 0.8], [2, 0.95]] }, "sustainGraph": { "vertices": [[0, 0.95], [1, 0.95]] }, "releaseGraph": { "vertices": [[0, 0.95], [0.17, 0.25], [0.31, 0.12], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0.029999999999999985], [0.88, 0.01], [1.23, 0.08], [1.66, 0.4], [1.83, 0.6], [1.9, 0.8], [2, 0.99]] }, "sustainGraph": { "vertices": [[0, 0.99], [1, 0.99]] }, "releaseGraph": { "vertices": [[0, 0.99], [0.17, 0.25], [0.31, 0.12], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0.24, 0.64], [2, 0.8]] }, "sustainGraph": { "vertices": [[0, 0.8], [1, 0.8]] }, "releaseGraph": { "vertices": [[0, 0.8], [0.39, 0.8], [0.56, 0.52], [1, 0]] } }] }, "filter": { "type": "lowpass", "freq": 657, "Q": 9, "gain": 0 }, "delay": { "delayTimeL": 0.44999998807907104, "delayTimeR": 0.30000001192092896, "feedbackL": 0.3700000047683716, "feedbackR": 0.3400000035762787, "dryMixL": 1, "dryMixR": 1, "wetMixL": 0.3700000047683716, "wetMixR": 0.3400000035762787 } }, { "name": "Pulse Pattern", "ot": { "histo": { "dataBins": [1.0065625, 0.9532291666666667, 0.9198958333333334, 0.8998958333333333, 0.8398958333333333, 0.8132291666666667, 0.8065625, 0.7665625, 0.7398958333333333, 0.7065625, 0.6932291666666667, 0.6532291666666666, 0.6398958333333333, 0.6332291666666666, 0.6065625, 0.5932291666666667, 0.5865625, 0.5665625, 0.5398958333333334, 0.5265625, 0.5198958333333333, 0.47989583333333335, 0.4398958333333333, 0.37322916666666667, 0.31322916666666667, 0.25322916666666667, 0.21989583333333335, 0.1465625, 0.0865625, 0.03989583333333333, 0.013229166666666667, 0.013229166666666667, 0.013229166666666667, 0.013229166666666667, 0.013229166666666667, 0.013229166666666667, 0.013229166666666667, 0.013229166666666667, 0.013229166666666667, 0.019895833333333335] } }, "env": { "main": { "attackGraph": { "vertices": [[0, 0], [0.04, 1], [0.16, 1], [0.17, 0.01], [0.28, 0.01], [0.28, 1], [0.42, 1], [0.45, 0.01], [0.61, 0.01], [0.61, 0.99], [0.72, 1], [0.72, 0.01], [0.92, 0.01], [0.93, 1], [1.08, 1], [1.08, 0.01], [1.29, 3.469446951953614e-18], [1.29, 0.99], [1.41, 1], [1.44, 0.01], [1.535, 0.99]], "maxXValue": 1.535 }, "sustainGraph": { "vertices": [[0, 0.99], [1, 0.99]], "maxXValue": 1 }, "releaseGraph": { "vertices": [[0, 0.99], [1, 0]], "maxXValue": 1 } }, "ot": [{ "attackGraph": { "vertices": [[0, 0], [0.04, 1], [0.16, 1], [0.17, 0.01], [0.61, 0.01], [0.61, 0.99], [0.72, 1], [0.73, 0.01], [0.93, 0.01], [1.29, 3.469446951953614e-18], [1.29, 0.99], [1.41, 1], [1.44, 0.01], [1.535, 0.01]] }, "sustainGraph": { "vertices": [[0, 0.01], [1, 0.01]] }, "releaseGraph": { "vertices": [[0, 0.01], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0.04, 1], [0.16, 1], [0.17, 0.01], [0.61, 0.01], [0.61, 0.99], [0.72, 1], [0.73, 0.01], [0.93, 0.01], [1.29, 3.469446951953614e-18], [1.29, 0.99], [1.41, 1], [1.44, 0.01], [1.535, 0]] }, "sustainGraph": { "vertices": [[0, 0], [1, 0]] }, "releaseGraph": { "vertices": [[0, 0], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0.04, 1], [0.16, 1], [0.17, 0.01], [0.61, 0.01], [0.61, 0.99], [0.72, 1], [0.73, 0.01], [0.93, 0.01], [1.29, 3.469446951953614e-18], [1.29, 0.99], [1.41, 1], [1.44, 0.01], [1.535, 0]] }, "sustainGraph": { "vertices": [[0, 0], [1, 0]] }, "releaseGraph": { "vertices": [[0, 0], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0.04, 1], [0.16, 1], [0.17, 0.01], [0.61, 0.01], [0.61, 0.99], [0.72, 1], [0.73, 0.01], [0.93, 0.01], [1.29, 3.469446951953614e-18], [1.29, 0.99], [1.41, 1], [1.44, 0.01], [1.535, 0]] }, "sustainGraph": { "vertices": [[0, 0], [1, 0]] }, "releaseGraph": { "vertices": [[0, 0], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0.04, 1], [0.16, 1], [0.17, 0.01], [0.61, 0.01], [0.61, 0.99], [0.72, 1], [0.73, 0.01], [0.93, 0.01], [1.29, 3.469446951953614e-18], [1.29, 0.99], [1.41, 1], [1.44, 0.01], [1.535, 0]] }, "sustainGraph": { "vertices": [[0, 0], [1, 0]] }, "releaseGraph": { "vertices": [[0, 0], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0.04, 1], [0.16, 1], [0.17, 0.01], [0.61, 0.01], [0.61, 0.99], [0.72, 1], [0.73, 0.01], [0.93, 0.01], [1.29, 3.469446951953614e-18], [1.29, 0.99], [1.41, 1], [1.44, 0.01], [1.535, 0]] }, "sustainGraph": { "vertices": [[0, 0], [1, 0]] }, "releaseGraph": { "vertices": [[0, 0], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0.04, 1], [0.16, 1], [0.17, 0.01], [0.61, 0.01], [0.61, 0.99], [0.72, 1], [0.73, 0.01], [0.93, 0.01], [1.29, 3.469446951953614e-18], [1.29, 0.99], [1.41, 1], [1.44, 0.01], [1.535, 0]] }, "sustainGraph": { "vertices": [[0, 0], [1, 0]] }, "releaseGraph": { "vertices": [[0, 0], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0.04, 1], [0.16, 1], [0.17, 0.01], [0.61, 0.01], [0.61, 0.99], [0.72, 1], [0.73, 0.01], [0.93, 0.01], [1.29, 3.469446951953614e-18], [1.29, 0.99], [1.41, 1], [1.44, 0.01], [1.535, 0]] }, "sustainGraph": { "vertices": [[0, 0], [1, 0]] }, "releaseGraph": { "vertices": [[0, 0], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [1.535, 0]] }, "sustainGraph": { "vertices": [[0, 0], [1, 0]] }, "releaseGraph": { "vertices": [[0, 0], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0.17, 0.01], [0.28, 0.01], [0.28, 1], [0.42, 1], [0.45, 0.01], [0.61, 0.01], [0.72, 0.01], [0.92, 0.01], [0.93, 1], [1.07, 1], [1.08, 0.01], [1.29, 3.469446951953614e-18], [1.44, 0.01], [1.535, 0]] }, "sustainGraph": { "vertices": [[0, 0], [1, 0]] }, "releaseGraph": { "vertices": [[0, 0], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0.17, 0.01], [0.28, 0.01], [0.28, 1], [0.42, 1], [0.45, 0.01], [0.61, 0.01], [0.72, 0.01], [0.92, 0.01], [0.93, 1], [1.07, 1], [1.08, 0.01], [1.29, 3.469446951953614e-18], [1.44, 0.01], [1.535, 0]] }, "sustainGraph": { "vertices": [[0, 0], [1, 0]] }, "releaseGraph": { "vertices": [[0, 0], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0.17, 0.01], [0.28, 0.01], [0.28, 1], [0.42, 1], [0.45, 0.01], [0.61, 0.01], [0.72, 0.01], [0.92, 0.01], [0.93, 1], [1.07, 1], [1.08, 0.01], [1.29, 3.469446951953614e-18], [1.44, 0.01], [1.535, 0]] }, "sustainGraph": { "vertices": [[0, 0], [1, 0]] }, "releaseGraph": { "vertices": [[0, 0], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0.17, 0.01], [0.28, 0.01], [0.28, 1], [0.42, 1], [0.45, 0.01], [0.61, 0.01], [0.72, 0.01], [0.92, 0.01], [0.93, 1], [1.07, 1], [1.08, 0.01], [1.29, 3.469446951953614e-18], [1.44, 0.01], [1.535, 0]] }, "sustainGraph": { "vertices": [[0, 0], [1, 0]] }, "releaseGraph": { "vertices": [[0, 0], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0.17, 0.01], [0.28, 0.01], [0.28, 1], [0.42, 1], [0.45, 0.01], [0.61, 0.01], [0.72, 0.01], [0.92, 0.01], [0.93, 1], [1.07, 1], [1.08, 0.01], [1.29, 3.469446951953614e-18], [1.44, 0.01], [1.535, 0]] }, "sustainGraph": { "vertices": [[0, 0], [1, 0]] }, "releaseGraph": { "vertices": [[0, 0], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0.17, 0.01], [0.28, 0.01], [0.28, 1], [0.42, 1], [0.45, 0.01], [0.61, 0.01], [0.72, 0.01], [0.92, 0.01], [0.93, 1], [1.07, 1], [1.08, 0.01], [1.29, 3.469446951953614e-18], [1.44, 0.01], [1.535, 0]] }, "sustainGraph": { "vertices": [[0, 0], [1, 0]] }, "releaseGraph": { "vertices": [[0, 0], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0.17, 0.01], [0.28, 0.01], [0.28, 1], [0.42, 1], [0.45, 0.01], [0.61, 0.01], [0.72, 0.01], [0.92, 0.01], [0.93, 1], [1.07, 1], [1.08, 0.01], [1.29, 3.469446951953614e-18], [1.44, 0.01], [1.535, 0]] }, "sustainGraph": { "vertices": [[0, 0], [1, 0]] }, "releaseGraph": { "vertices": [[0, 0], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0.17, 0.01], [0.28, 0.01], [0.28, 1], [0.42, 1], [0.45, 0.01], [0.61, 0.01], [0.72, 0.01], [0.92, 0.01], [0.93, 1], [1.07, 1], [1.08, 0.01], [1.29, 3.469446951953614e-18], [1.44, 0.01], [1.535, 0]] }, "sustainGraph": { "vertices": [[0, 0], [1, 0]] }, "releaseGraph": { "vertices": [[0, 0], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [1.535, 0]] }, "sustainGraph": { "vertices": [[0, 0], [1, 0]] }, "releaseGraph": { "vertices": [[0, 0], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [1.535, 0]] }, "sustainGraph": { "vertices": [[0, 0], [1, 0]] }, "releaseGraph": { "vertices": [[0, 0], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [1.535, 0]] }, "sustainGraph": { "vertices": [[0, 0], [1, 0]] }, "releaseGraph": { "vertices": [[0, 0], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [1.535, 0]] }, "sustainGraph": { "vertices": [[0, 0], [1, 0]] }, "releaseGraph": { "vertices": [[0, 0], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [1.535, 0]] }, "sustainGraph": { "vertices": [[0, 0], [1, 0]] }, "releaseGraph": { "vertices": [[0, 0], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [1.535, 0]] }, "sustainGraph": { "vertices": [[0, 0], [1, 0]] }, "releaseGraph": { "vertices": [[0, 0], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [1.535, 0]] }, "sustainGraph": { "vertices": [[0, 0], [1, 0]] }, "releaseGraph": { "vertices": [[0, 0], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [1.535, 0]] }, "sustainGraph": { "vertices": [[0, 0], [1, 0]] }, "releaseGraph": { "vertices": [[0, 0], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [1.535, 0]] }, "sustainGraph": { "vertices": [[0, 0], [1, 0]] }, "releaseGraph": { "vertices": [[0, 0], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [1.535, 0]] }, "sustainGraph": { "vertices": [[0, 0], [1, 0]] }, "releaseGraph": { "vertices": [[0, 0], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [1.535, 0]] }, "sustainGraph": { "vertices": [[0, 0], [1, 0]] }, "releaseGraph": { "vertices": [[0, 0], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [1.535, 0]] }, "sustainGraph": { "vertices": [[0, 0], [1, 0]] }, "releaseGraph": { "vertices": [[0, 0], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [1.535, 0]] }, "sustainGraph": { "vertices": [[0, 0], [1, 0]] }, "releaseGraph": { "vertices": [[0, 0], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [1.535, 0]] }, "sustainGraph": { "vertices": [[0, 0], [1, 0]] }, "releaseGraph": { "vertices": [[0, 0], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [1.535, 0]] }, "sustainGraph": { "vertices": [[0, 0], [1, 0]] }, "releaseGraph": { "vertices": [[0, 0], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [1.535, 0]] }, "sustainGraph": { "vertices": [[0, 0], [1, 0]] }, "releaseGraph": { "vertices": [[0, 0], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [1.535, 0]] }, "sustainGraph": { "vertices": [[0, 0], [1, 0]] }, "releaseGraph": { "vertices": [[0, 0], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [1.535, 0]] }, "sustainGraph": { "vertices": [[0, 0], [1, 0]] }, "releaseGraph": { "vertices": [[0, 0], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [1.535, 0]] }, "sustainGraph": { "vertices": [[0, 0], [1, 0]] }, "releaseGraph": { "vertices": [[0, 0], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [1.535, 0]] }, "sustainGraph": { "vertices": [[0, 0], [1, 0]] }, "releaseGraph": { "vertices": [[0, 0], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [1.535, 0]] }, "sustainGraph": { "vertices": [[0, 0], [1, 0]] }, "releaseGraph": { "vertices": [[0, 0], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [1.535, 0]] }, "sustainGraph": { "vertices": [[0, 0], [1, 0]] }, "releaseGraph": { "vertices": [[0, 0], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [1.535, 0]] }, "sustainGraph": { "vertices": [[0, 0], [1, 0]] }, "releaseGraph": { "vertices": [[0, 0], [1, 0]] } }] }, "filter": { "type": "lowpass", "freq": 657, "Q": 0, "gain": 0 }, "delay": { "delayTimeL": 1.534999966621399, "delayTimeR": 0.7580000162124634, "feedbackL": 0.28999999165534973, "feedbackR": 0.20000000298023224, "dryMixL": 1, "dryMixR": 1, "wetMixL": 0.47999998927116394, "wetMixR": 0.49000000953674316 } }, { "name": "Gradual Sweep", "ot": { "histo": { "dataBins": [0.9332291666666667, 0.8398958333333333, 0.7665625, 0.6665625, 0.6332291666666666, 0.6065625, 0.5798958333333334, 0.5598958333333334, 0.5265625, 0.5065625, 0.4865625, 0.4465625, 0.3798958333333333, 0.3865625, 0.3865625, 0.3865625, 0.3865625, 0.3865625, 0.3865625, 0.3865625, 0.3865625, 0.3865625, 0.3865625, 0.3932291666666667, 0.39989583333333334, 0.39989583333333334, 0.39989583333333334, 0.39989583333333334, 0.39989583333333334, 0.39989583333333334, 0.39989583333333334, 0.41322916666666665, 0.41322916666666665, 0.4065625, 0.4065625, 0.4065625, 0.4065625, 0.4265625, 0.4265625, 0.4265625] } }, "env": { "main": { "attackGraph": { "vertices": [[0, 0], [0.1, 0.07], [0.21, 0.26], [0.37, 0.4], [0.51, 0.53], [0.65, 0.57], [0.8, 0.68], [1.01, 0.84], [1.13, 0.91], [1.3, 0.99], [1.38, 1], [1.45, 1], [5, 0.99]], "maxXValue": 5 }, "sustainGraph": { "vertices": [[0, 0.99], [1, 0.99]], "maxXValue": 1 }, "releaseGraph": { "vertices": [[0, 0.99], [0.05, 0.65], [0.11, 0.3], [0.23, 0.15], [1, 0]], "maxXValue": 1 } }, "ot": [{ "attackGraph": { "vertices": [[0, 0], [0.1, 0.07], [0.21, 0.26], [0.37, 0.4], [0.51, 0.53], [0.65, 0.57], [0.8, 0.68], [1.01, 0.84], [1.13, 0.91], [1.3, 0.99], [1.38, 1], [1.45, 1], [5, 0.97]] }, "sustainGraph": { "vertices": [[0, 0.97], [1, 0.97]] }, "releaseGraph": { "vertices": [[0, 0.97], [0.05, 0.65], [0.14, 0.52], [0.37, 0.37], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [1.97, 0.19999999999999996], [2.89, 0.31999999999999995], [3.28, 0.67], [3.38, 0.78], [3.59, 1], [5, 0.9600000000000001]] }, "sustainGraph": { "vertices": [[0, 0.9600000000000001], [1, 0.9600000000000001]] }, "releaseGraph": { "vertices": [[0, 0.9600000000000001], [0.12, 0.8], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [1.97, 0.19999999999999996], [2.89, 0.31999999999999995], [3.28, 0.67], [3.38, 0.78], [3.59, 1], [5, 0.97]] }, "sustainGraph": { "vertices": [[0, 0.97], [1, 0.97]] }, "releaseGraph": { "vertices": [[0, 0.97], [0.12, 0.8], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [1.97, 0.19999999999999996], [2.89, 0.31999999999999995], [3.28, 0.67], [3.38, 0.78], [3.59, 1], [5, 0.99]] }, "sustainGraph": { "vertices": [[0, 0.99], [1, 0.99]] }, "releaseGraph": { "vertices": [[0, 0.99], [0.12, 0.8], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [1.97, 0.19999999999999996], [2.89, 0.31999999999999995], [3.28, 0.67], [3.38, 0.78], [3.59, 1], [5, 0.9900000000000001]] }, "sustainGraph": { "vertices": [[0, 0.9900000000000001], [1, 0.9900000000000001]] }, "releaseGraph": { "vertices": [[0, 0.9900000000000001], [0.12, 0.8], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [1.97, 0.19999999999999996], [2.89, 0.31999999999999995], [3.28, 0.67], [3.38, 0.78], [3.59, 1], [5, 0.99]] }, "sustainGraph": { "vertices": [[0, 0.99], [1, 0.99]] }, "releaseGraph": { "vertices": [[0, 0.99], [0.12, 0.8], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [1.97, 0.19999999999999996], [2.89, 0.31999999999999995], [3.28, 0.67], [3.38, 0.78], [3.59, 1], [5, 0.99]] }, "sustainGraph": { "vertices": [[0, 0.99], [1, 0.99]] }, "releaseGraph": { "vertices": [[0, 0.99], [0.12, 0.8], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [1.97, 0.19999999999999996], [2.89, 0.31999999999999995], [3.28, 0.67], [3.38, 0.78], [3.59, 1], [5, 0.98]] }, "sustainGraph": { "vertices": [[0, 0.98], [1, 0.98]] }, "releaseGraph": { "vertices": [[0, 0.98], [0.12, 0.8], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [5, 0]] }, "sustainGraph": { "vertices": [[0, 0], [1, 0]] }, "releaseGraph": { "vertices": [[0, 0], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [1.97, 0.19999999999999996], [2.89, 0.31999999999999995], [3.28, 0.67], [3.38, 0.78], [3.59, 1], [5, 0.9900000000000001]] }, "sustainGraph": { "vertices": [[0, 0.9900000000000001], [1, 0.9900000000000001]] }, "releaseGraph": { "vertices": [[0, 0.9900000000000001], [0.12, 0.8], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [1.97, 0.19999999999999996], [2.89, 0.31999999999999995], [3.28, 0.67], [3.38, 0.78], [3.59, 1], [5, 0.98]] }, "sustainGraph": { "vertices": [[0, 0.98], [1, 0.98]] }, "releaseGraph": { "vertices": [[0, 0.98], [0.12, 0.8], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [1.97, 0.19999999999999996], [2.89, 0.31999999999999995], [3.28, 0.67], [3.38, 0.78], [3.59, 1], [5, 0.9600000000000001]] }, "sustainGraph": { "vertices": [[0, 0.9600000000000001], [1, 0.9600000000000001]] }, "releaseGraph": { "vertices": [[0, 0.9600000000000001], [0.12, 0.8], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [1.97, 0.19999999999999996], [2.89, 0.31999999999999995], [3.28, 0.67], [3.38, 0.78], [3.59, 1], [5, 0.9900000000000001]] }, "sustainGraph": { "vertices": [[0, 0.9900000000000001], [1, 0.9900000000000001]] }, "releaseGraph": { "vertices": [[0, 0.9900000000000001], [0.12, 0.8], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [1.97, 0.19999999999999996], [2.89, 0.31999999999999995], [3.28, 0.67], [3.38, 0.78], [3.59, 1], [5, 0.98]] }, "sustainGraph": { "vertices": [[0, 0.98], [1, 0.98]] }, "releaseGraph": { "vertices": [[0, 0.98], [0.12, 0.8], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [1.97, 0.19999999999999996], [2.89, 0.31999999999999995], [3.28, 0.67], [3.38, 0.78], [3.59, 1], [5, 0.9700000000000001]] }, "sustainGraph": { "vertices": [[0, 0.9700000000000001], [1, 0.9700000000000001]] }, "releaseGraph": { "vertices": [[0, 0.9700000000000001], [0.12, 0.8], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [1.97, 0.19999999999999996], [2.89, 0.31999999999999995], [3.28, 0.67], [3.38, 0.78], [3.59, 1], [5, 0.99]] }, "sustainGraph": { "vertices": [[0, 0.99], [1, 0.99]] }, "releaseGraph": { "vertices": [[0, 0.99], [0.12, 0.8], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [1.97, 0.19999999999999996], [2.89, 0.31999999999999995], [3.59, 0.98], [5, 0.98]] }, "sustainGraph": { "vertices": [[0, 0.98], [1, 0.98]] }, "releaseGraph": { "vertices": [[0, 0.98], [0.12, 0.8], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [2.42, 0.29], [3.93, 0.45], [4.27, 0.64], [4.34, 0.84], [4.5, 0.97], [5, 0.98]] }, "sustainGraph": { "vertices": [[0, 0.98], [1, 0.98]] }, "releaseGraph": { "vertices": [[0, 0.98], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [5, 0]] }, "sustainGraph": { "vertices": [[0, 0], [1, 0]] }, "releaseGraph": { "vertices": [[0, 0], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [2.42, 0.29], [3.93, 0.45], [4.27, 0.64], [4.34, 0.84], [4.5, 0.97], [5, 0.98]] }, "sustainGraph": { "vertices": [[0, 0.98], [1, 0.98]] }, "releaseGraph": { "vertices": [[0, 0.98], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [2.42, 0.29], [3.93, 0.45], [4.27, 0.64], [4.34, 0.84], [4.5, 0.97], [5, 0.99]] }, "sustainGraph": { "vertices": [[0, 0.99], [1, 0.99]] }, "releaseGraph": { "vertices": [[0, 0.99], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [2.42, 0.29], [3.93, 0.45], [4.27, 0.64], [4.34, 0.84], [4.5, 0.97], [5, 0.98]] }, "sustainGraph": { "vertices": [[0, 0.98], [1, 0.98]] }, "releaseGraph": { "vertices": [[0, 0.98], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [2.42, 0.29], [3.93, 0.45], [4.27, 0.64], [4.34, 0.84], [4.5, 0.97], [5, 0.9900000000000001]] }, "sustainGraph": { "vertices": [[0, 0.9900000000000001], [1, 0.9900000000000001]] }, "releaseGraph": { "vertices": [[0, 0.9900000000000001], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [2.42, 0.29], [3.93, 0.45], [4.27, 0.64], [4.34, 0.84], [4.5, 0.97], [5, 0.98]] }, "sustainGraph": { "vertices": [[0, 0.98], [1, 0.98]] }, "releaseGraph": { "vertices": [[0, 0.98], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [2.42, 0.29], [3.93, 0.45], [4.27, 0.64], [4.34, 0.84], [4.5, 0.97], [5, 0.97]] }, "sustainGraph": { "vertices": [[0, 0.97], [1, 0.97]] }, "releaseGraph": { "vertices": [[0, 0.97], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [2.42, 0.29], [3.93, 0.45], [4.27, 0.64], [4.34, 0.84], [4.5, 0.97], [5, 0.98]] }, "sustainGraph": { "vertices": [[0, 0.98], [1, 0.98]] }, "releaseGraph": { "vertices": [[0, 0.98], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [2.42, 0.29], [3.93, 0.45], [4.27, 0.64], [4.34, 0.84], [4.5, 0.97], [5, 0.96]] }, "sustainGraph": { "vertices": [[0, 0.96], [1, 0.96]] }, "releaseGraph": { "vertices": [[0, 0.96], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [2.42, 0.29], [3.93, 0.45], [4.27, 0.64], [4.34, 0.84], [4.5, 0.97], [5, 0.99]] }, "sustainGraph": { "vertices": [[0, 0.99], [1, 0.99]] }, "releaseGraph": { "vertices": [[0, 0.99], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [2.42, 0.29], [3.93, 0.45], [4.27, 0.64], [4.34, 0.84], [4.5, 0.97], [5, 0.9800000000000001]] }, "sustainGraph": { "vertices": [[0, 0.9800000000000001], [1, 0.9800000000000001]] }, "releaseGraph": { "vertices": [[0, 0.9800000000000001], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [2.42, 0.29], [3.93, 0.45], [4.27, 0.64], [4.34, 0.84], [4.5, 0.97], [5, 0.9700000000000001]] }, "sustainGraph": { "vertices": [[0, 0.9700000000000001], [1, 0.9700000000000001]] }, "releaseGraph": { "vertices": [[0, 0.9700000000000001], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [2.42, 0.29], [3.93, 0.45], [4.27, 0.64], [4.34, 0.84], [4.5, 0.97], [5, 0.97]] }, "sustainGraph": { "vertices": [[0, 0.97], [1, 0.97]] }, "releaseGraph": { "vertices": [[0, 0.97], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [2.42, 0.29], [3.93, 0.45], [4.27, 0.64], [4.34, 0.84], [4.5, 0.97], [5, 0.98]] }, "sustainGraph": { "vertices": [[0, 0.98], [1, 0.98]] }, "releaseGraph": { "vertices": [[0, 0.98], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [2.42, 0.29], [3.93, 0.45], [4.27, 0.64], [4.34, 0.84], [4.5, 0.97], [5, 0.99]] }, "sustainGraph": { "vertices": [[0, 0.99], [1, 0.99]] }, "releaseGraph": { "vertices": [[0, 0.99], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [2.42, 0.29], [3.93, 0.45], [4.27, 0.64], [4.34, 0.84], [4.5, 0.97], [5, 0.99]] }, "sustainGraph": { "vertices": [[0, 0.99], [1, 0.99]] }, "releaseGraph": { "vertices": [[0, 0.99], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [2.42, 0.29], [3.93, 0.45], [4.27, 0.64], [4.34, 0.84], [4.5, 0.97], [5, 0.9999999999999999]] }, "sustainGraph": { "vertices": [[0, 0.9999999999999999], [1, 0.9999999999999999]] }, "releaseGraph": { "vertices": [[0, 0.9999999999999999], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [2.42, 0.29], [3.93, 0.45], [4.27, 0.64], [4.34, 0.84], [4.5, 0.97], [5, 0.97]] }, "sustainGraph": { "vertices": [[0, 0.97], [1, 0.97]] }, "releaseGraph": { "vertices": [[0, 0.97], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [2.42, 0.29], [3.93, 0.45], [4.27, 0.64], [4.34, 0.84], [4.5, 0.97], [5, 0.97]] }, "sustainGraph": { "vertices": [[0, 0.97], [1, 0.97]] }, "releaseGraph": { "vertices": [[0, 0.97], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [2.42, 0.29], [3.93, 0.45], [4.27, 0.64], [4.34, 0.84], [4.5, 0.97], [5, 0.99]] }, "sustainGraph": { "vertices": [[0, 0.99], [1, 0.99]] }, "releaseGraph": { "vertices": [[0, 0.99], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [2.42, 0.29], [3.93, 0.45], [4.27, 0.64], [4.34, 0.84], [4.5, 0.97], [5, 0.9700000000000001]] }, "sustainGraph": { "vertices": [[0, 0.9700000000000001], [1, 0.9700000000000001]] }, "releaseGraph": { "vertices": [[0, 0.9700000000000001], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [2.42, 0.29], [3.93, 0.45], [4.27, 0.64], [4.34, 0.84], [4.5, 0.97], [5, 0.9899999999999999]] }, "sustainGraph": { "vertices": [[0, 0.9899999999999999], [1, 0.9899999999999999]] }, "releaseGraph": { "vertices": [[0, 0.9899999999999999], [1, 0]] } }] }, "filter": { "type": "lowpass", "freq": 357, "Q": 0, "gain": 0 }, "delay": { "delayTimeL": 1.0850000381469727, "delayTimeR": 0.9079999923706055, "feedbackL": 0.7699999809265137, "feedbackR": 0.8100000023841858, "dryMixL": 1, "dryMixR": 1, "wetMixL": 0.550000011920929, "wetMixR": 0.5699999928474426 } }, { "name": "Buzzy Overtones", "ot": { "histo": { "dataBins": [0.9998958333333333, 0.11322916666666667, 0.11322916666666667, 0.11322916666666667, 0.11322916666666667, 0.11322916666666667, 0.1065625, 0.09989583333333334, 0.09989583333333334, 0.09989583333333334, 0.09989583333333334, 0.09989583333333334, 0.09989583333333334, 0.09989583333333334, 0.09989583333333334, 0.09989583333333334, 0.09989583333333334, 0.09989583333333334, 1.0065625, 0.9998958333333333, 0.9998958333333333, 0.9998958333333333, 0.9998958333333333, 1.0065625, 1.0065625, 0.9998958333333333, 0.9998958333333333, 0.9998958333333333, 1.0065625, 1.0065625, 1.0065625, 0.9998958333333333, 0.9998958333333333, 0.9998958333333333, 0.9998958333333333, 0.9998958333333333, 0.9998958333333333, 0.9998958333333333, 0.9998958333333333, 1.0065625] } }, "env": { "main": { "attackGraph": { "vertices": [[0, 0], [0.12, 1], [1, 0.98]], "maxXValue": 1 }, "sustainGraph": { "vertices": [[0, 0.98], [1, 0.98]], "maxXValue": 1 }, "releaseGraph": { "vertices": [[0, 0.98], [1, 0]], "maxXValue": 1 } }, "ot": [{ "attackGraph": { "vertices": [[0, 0], [0.12, 1], [1, 0.99]] }, "sustainGraph": { "vertices": [[0, 0.99], [1, 0.99]] }, "releaseGraph": { "vertices": [[0, 0.99], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0.12, 1], [1, 0.9700000000000001]] }, "sustainGraph": { "vertices": [[0, 0.9700000000000001], [1, 0.9700000000000001]] }, "releaseGraph": { "vertices": [[0, 0.9700000000000001], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [1, 0.97]] }, "sustainGraph": { "vertices": [[0, 0.97], [1, 0.97]] }, "releaseGraph": { "vertices": [[0, 0.97], [0.12, 0.8], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0.12, 1], [1, 0.9899999999999999]] }, "sustainGraph": { "vertices": [[0, 0.9899999999999999], [1, 0.9899999999999999]] }, "releaseGraph": { "vertices": [[0, 0.9899999999999999], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0.12, 1], [1, 0.99]] }, "sustainGraph": { "vertices": [[0, 0.99], [1, 0.99]] }, "releaseGraph": { "vertices": [[0, 0.99], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0.12, 1], [1, 0.9700000000000001]] }, "sustainGraph": { "vertices": [[0, 0.9700000000000001], [1, 0.9700000000000001]] }, "releaseGraph": { "vertices": [[0, 0.9700000000000001], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0.12, 1], [1, 0.99]] }, "sustainGraph": { "vertices": [[0, 0.99], [1, 0.99]] }, "releaseGraph": { "vertices": [[0, 0.99], [0.12, 0.77], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [1, 0.98]] }, "sustainGraph": { "vertices": [[0, 0.98], [1, 0.98]] }, "releaseGraph": { "vertices": [[0, 0.98], [0.12, 0.8], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [1, 0]] }, "sustainGraph": { "vertices": [[0, 0], [1, 0]] }, "releaseGraph": { "vertices": [[0, 0], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [1, 0.9900000000000001]] }, "sustainGraph": { "vertices": [[0, 0.9900000000000001], [1, 0.9900000000000001]] }, "releaseGraph": { "vertices": [[0, 0.9900000000000001], [0.12, 0.8], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [1, 0.98]] }, "sustainGraph": { "vertices": [[0, 0.98], [1, 0.98]] }, "releaseGraph": { "vertices": [[0, 0.98], [0.12, 0.8], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [1, 0.9600000000000001]] }, "sustainGraph": { "vertices": [[0, 0.9600000000000001], [1, 0.9600000000000001]] }, "releaseGraph": { "vertices": [[0, 0.9600000000000001], [0.12, 0.8], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [1, 0.9900000000000001]] }, "sustainGraph": { "vertices": [[0, 0.9900000000000001], [1, 0.9900000000000001]] }, "releaseGraph": { "vertices": [[0, 0.9900000000000001], [0.12, 0.8], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [1, 0.98]] }, "sustainGraph": { "vertices": [[0, 0.98], [1, 0.98]] }, "releaseGraph": { "vertices": [[0, 0.98], [0.12, 0.8], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [1, 0.9700000000000001]] }, "sustainGraph": { "vertices": [[0, 0.9700000000000001], [1, 0.9700000000000001]] }, "releaseGraph": { "vertices": [[0, 0.9700000000000001], [0.12, 0.8], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [1, 0.99]] }, "sustainGraph": { "vertices": [[0, 0.99], [1, 0.99]] }, "releaseGraph": { "vertices": [[0, 0.99], [0.12, 0.8], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [1, 0.98]] }, "sustainGraph": { "vertices": [[0, 0.98], [1, 0.98]] }, "releaseGraph": { "vertices": [[0, 0.98], [0.12, 0.8], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [1, 0.98]] }, "sustainGraph": { "vertices": [[0, 0.98], [1, 0.98]] }, "releaseGraph": { "vertices": [[0, 0.98], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [1, 0]] }, "sustainGraph": { "vertices": [[0, 0], [1, 0]] }, "releaseGraph": { "vertices": [[0, 0], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [1, 0.98]] }, "sustainGraph": { "vertices": [[0, 0.98], [1, 0.98]] }, "releaseGraph": { "vertices": [[0, 0.98], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [1, 0.99]] }, "sustainGraph": { "vertices": [[0, 0.99], [1, 0.99]] }, "releaseGraph": { "vertices": [[0, 0.99], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [1, 0.98]] }, "sustainGraph": { "vertices": [[0, 0.98], [1, 0.98]] }, "releaseGraph": { "vertices": [[0, 0.98], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [1, 0.9900000000000001]] }, "sustainGraph": { "vertices": [[0, 0.9900000000000001], [1, 0.9900000000000001]] }, "releaseGraph": { "vertices": [[0, 0.9900000000000001], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [1, 0.98]] }, "sustainGraph": { "vertices": [[0, 0.98], [1, 0.98]] }, "releaseGraph": { "vertices": [[0, 0.98], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [1, 0.97]] }, "sustainGraph": { "vertices": [[0, 0.97], [1, 0.97]] }, "releaseGraph": { "vertices": [[0, 0.97], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [1, 0.98]] }, "sustainGraph": { "vertices": [[0, 0.98], [1, 0.98]] }, "releaseGraph": { "vertices": [[0, 0.98], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [1, 0.96]] }, "sustainGraph": { "vertices": [[0, 0.96], [1, 0.96]] }, "releaseGraph": { "vertices": [[0, 0.96], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [1, 0.99]] }, "sustainGraph": { "vertices": [[0, 0.99], [1, 0.99]] }, "releaseGraph": { "vertices": [[0, 0.99], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [1, 0.9800000000000001]] }, "sustainGraph": { "vertices": [[0, 0.9800000000000001], [1, 0.9800000000000001]] }, "releaseGraph": { "vertices": [[0, 0.9800000000000001], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [1, 0.9700000000000001]] }, "sustainGraph": { "vertices": [[0, 0.9700000000000001], [1, 0.9700000000000001]] }, "releaseGraph": { "vertices": [[0, 0.9700000000000001], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [1, 0.97]] }, "sustainGraph": { "vertices": [[0, 0.97], [1, 0.97]] }, "releaseGraph": { "vertices": [[0, 0.97], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [1, 0.98]] }, "sustainGraph": { "vertices": [[0, 0.98], [1, 0.98]] }, "releaseGraph": { "vertices": [[0, 0.98], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [1, 0.99]] }, "sustainGraph": { "vertices": [[0, 0.99], [1, 0.99]] }, "releaseGraph": { "vertices": [[0, 0.99], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [1, 0.99]] }, "sustainGraph": { "vertices": [[0, 0.99], [1, 0.99]] }, "releaseGraph": { "vertices": [[0, 0.99], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [1, 0.9999999999999999]] }, "sustainGraph": { "vertices": [[0, 0.9999999999999999], [1, 0.9999999999999999]] }, "releaseGraph": { "vertices": [[0, 0.9999999999999999], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [1, 0.97]] }, "sustainGraph": { "vertices": [[0, 0.97], [1, 0.97]] }, "releaseGraph": { "vertices": [[0, 0.97], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [1, 0.97]] }, "sustainGraph": { "vertices": [[0, 0.97], [1, 0.97]] }, "releaseGraph": { "vertices": [[0, 0.97], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [1, 0.99]] }, "sustainGraph": { "vertices": [[0, 0.99], [1, 0.99]] }, "releaseGraph": { "vertices": [[0, 0.99], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [1, 0.9700000000000001]] }, "sustainGraph": { "vertices": [[0, 0.9700000000000001], [1, 0.9700000000000001]] }, "releaseGraph": { "vertices": [[0, 0.9700000000000001], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [1, 0.9899999999999999]] }, "sustainGraph": { "vertices": [[0, 0.9899999999999999], [1, 0.9899999999999999]] }, "releaseGraph": { "vertices": [[0, 0.9899999999999999], [1, 0]] } }] }, "filter": { "type": "highpass", "freq": 4657, "Q": 0, "gain": 0 }, "delay": { "delayTimeL": 1.0850000381469727, "delayTimeR": 0.9079999923706055, "feedbackL": 0.17000000178813934, "feedbackR": 0.18000000715255737, "dryMixL": 1, "dryMixR": 1, "wetMixL": 0.10999999940395355, "wetMixR": 0.17000000178813934 } }, { "name": "Chirps", "ot": { "histo": { "dataBins": [0.9998958333333333, 0.9798958333333333, 0.9665625, 0.9132291666666666, 0.8732291666666666, 0.8732291666666666, 0.8332291666666667, 0.8265625, 0.7998958333333334, 0.7732291666666666, 0.7398958333333333, 0.7198958333333333, 0.6998958333333334, 0.6798958333333334, 0.6332291666666666, 0.5998958333333333, 0.5732291666666667, 0.5398958333333334, 0.5132291666666666, 0.49322916666666666, 0.4532291666666667, 0.4465625, 0.4398958333333333, 0.4265625, 0.4065625, 0.3932291666666667, 0.3865625, 0.3798958333333333, 0.35322916666666665, 0.3465625, 0.3332291666666667, 0.3332291666666667, 0.3332291666666667, 0.31322916666666667, 0.27989583333333334, 0.2465625, 0.2465625, 0.2265625, 0.23989583333333334, 0.2265625] } }, "env": { "main": { "attackGraph": { "vertices": [[0, 0], [0, 1], [0.61, 0.01], [1, 0.01999999999999999]], "maxXValue": 1 }, "sustainGraph": { "vertices": [[0, 0.01999999999999999], [1, 0.01999999999999999]], "maxXValue": 1 }, "releaseGraph": { "vertices": [[0, 0.01999999999999999], [1, 0]], "maxXValue": 1 } }, "ot": [{ "attackGraph": { "vertices": [[0, 0], [0, 0.99], [0.09, 0.01], [1, 1.0408340855860843e-17]] }, "sustainGraph": { "vertices": [[0, 1.0408340855860843e-17], [1, 1.0408340855860843e-17]] }, "releaseGraph": { "vertices": [[0, 1.0408340855860843e-17], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0, 0.99], [0.12, 0.01], [1, 0]] }, "sustainGraph": { "vertices": [[0, 0], [1, 0]] }, "releaseGraph": { "vertices": [[0, 0], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0, 0.99], [0.14, 0.01], [1, 0]] }, "sustainGraph": { "vertices": [[0, 0], [1, 0]] }, "releaseGraph": { "vertices": [[0, 0], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0, 0.99], [0.17, 0.01], [1, 0]] }, "sustainGraph": { "vertices": [[0, 0], [1, 0]] }, "releaseGraph": { "vertices": [[0, 0], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0, 0.99], [0.19, 0.01], [1, 0]] }, "sustainGraph": { "vertices": [[0, 0], [1, 0]] }, "releaseGraph": { "vertices": [[0, 0], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0, 0.99], [0.21, 0.01], [1, 0]] }, "sustainGraph": { "vertices": [[0, 0], [1, 0]] }, "releaseGraph": { "vertices": [[0, 0], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0, 0.99], [0.23, 0.02], [1, 0]] }, "sustainGraph": { "vertices": [[0, 0], [1, 0]] }, "releaseGraph": { "vertices": [[0, 0], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0, 0.99], [0.26, 0.01], [1, 0]] }, "sustainGraph": { "vertices": [[0, 0], [1, 0]] }, "releaseGraph": { "vertices": [[0, 0], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0, 0.99], [0.28, 0.01], [1, 0]] }, "sustainGraph": { "vertices": [[0, 0], [1, 0]] }, "releaseGraph": { "vertices": [[0, 0], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0, 0.99], [0.29, 0.01], [1, 0]] }, "sustainGraph": { "vertices": [[0, 0], [1, 0]] }, "releaseGraph": { "vertices": [[0, 0], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0, 0.99], [0.31, 0.01], [1, 0]] }, "sustainGraph": { "vertices": [[0, 0], [1, 0]] }, "releaseGraph": { "vertices": [[0, 0], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0, 0.99], [0.31, 0.01], [1, 0]] }, "sustainGraph": { "vertices": [[0, 0], [1, 0]] }, "releaseGraph": { "vertices": [[0, 0], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0, 0.99], [0.32, 0.01], [1, 0]] }, "sustainGraph": { "vertices": [[0, 0], [1, 0]] }, "releaseGraph": { "vertices": [[0, 0], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0, 0.99], [0.34, 0.01], [1, 0]] }, "sustainGraph": { "vertices": [[0, 0], [1, 0]] }, "releaseGraph": { "vertices": [[0, 0], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0, 0.99], [0.35, 0.01], [1, 0]] }, "sustainGraph": { "vertices": [[0, 0], [1, 0]] }, "releaseGraph": { "vertices": [[0, 0], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0, 0.99], [0.37, 0.01], [1, 0]] }, "sustainGraph": { "vertices": [[0, 0], [1, 0]] }, "releaseGraph": { "vertices": [[0, 0], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0, 0.99], [0.36, 0.01], [1, 0]] }, "sustainGraph": { "vertices": [[0, 0], [1, 0]] }, "releaseGraph": { "vertices": [[0, 0], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0, 0.99], [0.38, 0.01], [1, 0]] }, "sustainGraph": { "vertices": [[0, 0], [1, 0]] }, "releaseGraph": { "vertices": [[0, 0], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0, 0.99], [0.37, 0.01], [1, 0]] }, "sustainGraph": { "vertices": [[0, 0], [1, 0]] }, "releaseGraph": { "vertices": [[0, 0], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0, 0.99], [0.39, 0.01], [1, 0]] }, "sustainGraph": { "vertices": [[0, 0], [1, 0]] }, "releaseGraph": { "vertices": [[0, 0], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0, 0.99], [0.38, 0.01], [1, 0]] }, "sustainGraph": { "vertices": [[0, 0], [1, 0]] }, "releaseGraph": { "vertices": [[0, 0], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0, 0.99], [0.39, 0.01], [1, 0]] }, "sustainGraph": { "vertices": [[0, 0], [1, 0]] }, "releaseGraph": { "vertices": [[0, 0], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0, 0.99], [0.4, 0.01], [1, 0]] }, "sustainGraph": { "vertices": [[0, 0], [1, 0]] }, "releaseGraph": { "vertices": [[0, 0], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0, 0.99], [0.41, 0.01], [1, 0]] }, "sustainGraph": { "vertices": [[0, 0], [1, 0]] }, "releaseGraph": { "vertices": [[0, 0], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0, 0.99], [0.43, 0.01], [1, 0]] }, "sustainGraph": { "vertices": [[0, 0], [1, 0]] }, "releaseGraph": { "vertices": [[0, 0], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0, 0.99], [0.44, 0.01], [1, 0]] }, "sustainGraph": { "vertices": [[0, 0], [1, 0]] }, "releaseGraph": { "vertices": [[0, 0], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0, 0.99], [0.42, 0.01], [1, 0]] }, "sustainGraph": { "vertices": [[0, 0], [1, 0]] }, "releaseGraph": { "vertices": [[0, 0], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0, 0.99], [0.43, 0.01], [1, 0]] }, "sustainGraph": { "vertices": [[0, 0], [1, 0]] }, "releaseGraph": { "vertices": [[0, 0], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0, 0.99], [0.45, 0.01], [1, 0]] }, "sustainGraph": { "vertices": [[0, 0], [1, 0]] }, "releaseGraph": { "vertices": [[0, 0], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0, 0.99], [0.46, 0.01], [1, 0]] }, "sustainGraph": { "vertices": [[0, 0], [1, 0]] }, "releaseGraph": { "vertices": [[0, 0], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0, 0.99], [0.44, 0.01], [1, 0]] }, "sustainGraph": { "vertices": [[0, 0], [1, 0]] }, "releaseGraph": { "vertices": [[0, 0], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0, 0.99], [0.48, 0.02], [1, 0]] }, "sustainGraph": { "vertices": [[0, 0], [1, 0]] }, "releaseGraph": { "vertices": [[0, 0], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0, 0.99], [0.48, 0.01], [1, 0]] }, "sustainGraph": { "vertices": [[0, 0], [1, 0]] }, "releaseGraph": { "vertices": [[0, 0], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0, 0.99], [0.5, 0.01], [1, 0]] }, "sustainGraph": { "vertices": [[0, 0], [1, 0]] }, "releaseGraph": { "vertices": [[0, 0], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0, 0.99], [0.52, 0.01], [1, 0]] }, "sustainGraph": { "vertices": [[0, 0], [1, 0]] }, "releaseGraph": { "vertices": [[0, 0], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0, 0.99], [0.58, 0.02], [1, 0]] }, "sustainGraph": { "vertices": [[0, 0], [1, 0]] }, "releaseGraph": { "vertices": [[0, 0], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0, 0.99], [0.55, 0.02], [1, 0]] }, "sustainGraph": { "vertices": [[0, 0], [1, 0]] }, "releaseGraph": { "vertices": [[0, 0], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0, 0.99], [0.58, 0.01], [1, 0]] }, "sustainGraph": { "vertices": [[0, 0], [1, 0]] }, "releaseGraph": { "vertices": [[0, 0], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0, 0.99], [0.39, 0.01], [1, 0]] }, "sustainGraph": { "vertices": [[0, 0], [1, 0]] }, "releaseGraph": { "vertices": [[0, 0], [1, 0]] } }, { "attackGraph": { "vertices": [[0, 0], [0, 0.99], [0.55, 0.01], [1, 0]] }, "sustainGraph": { "vertices": [[0, 0], [1, 0]] }, "releaseGraph": { "vertices": [[0, 0], [1, 0]] } }] }, "filter": { "type": "lowpass", "freq": 1757, "Q": 0, "gain": 0 }, "delay": { "delayTimeL": 1.0850000381469727, "delayTimeR": 0.9079999923706055, "feedbackL": 0.17000000178813934, "feedbackR": 0.18000000715255737, "dryMixL": 1, "dryMixR": 1, "wetMixL": 0.10999999940395355, "wetMixR": 0.17000000178813934 } }] };

	  return additorPresets;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _Slider = __webpack_require__(22);

	var _Slider2 = _interopRequireDefault(_Slider);

	var _Dial = __webpack_require__(16);

	var _Dial2 = _interopRequireDefault(_Dial);

	var _Numberbox = __webpack_require__(14);

	var _Numberbox2 = _interopRequireDefault(_Numberbox);

	var _Meter = __webpack_require__(23);

	var _Meter2 = _interopRequireDefault(_Meter);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/* ------------------------------ */
	/* --- Main output controller --- */
	/* ------------------------------ */

	'use strict';

	var MainOutputCtrl = function MainOutputCtrl(adt) {

	  // pan dial
	  adt.output.panDial = new _Dial2.default({
	    container: document.querySelector('#additor .main-output-ctrl .pan-ctrl .dial'),
	    value: Math.trunc(adt.output.node.pan * 100),
	    minValue: -100,
	    maxValue: 100
	  }).subscribe(this, function (val) {
	    adt.output.node.pan = val / 100;

	    if (val === 0) {
	      adt.output.panNumbox.appendString = ' (C)';
	    } else if (val < 0) {
	      adt.output.panNumbox.appendString = ' % L';
	      adt.output.panNumbox.value = Math.abs(val);
	    } else {
	      adt.output.panNumbox.appendString = ' % R';
	      adt.output.panNumbox.value = Math.abs(val);
	    }
	  });

	  // pan num box
	  adt.output.panNumbox = new _Numberbox2.default({
	    container: document.querySelector('#additor .main-output-ctrl .pan-ctrl .numbox'),
	    value: Math.trunc(adt.output.node.pan * 100),
	    minValue: -100,
	    maxValue: 100,
	    appendString: ' (C)'
	  }).subscribe(this, function (val) {
	    adt.output.node.pan = val / 100;
	    adt.output.panDial.value = val;
	  });

	  // volume slider
	  adt.output.volumeSlider = new _Slider2.default({
	    container: document.querySelector('#additor .main-output-ctrl .volume-ctrl .slider'),
	    value: adt.output.node.outputGain * 100,
	    minValue: 0,
	    maxValue: 127
	  }).subscribe(this, function (val) {
	    adt.output.node.outputGain = val / 100;
	    adt.output.volumeNumbox.value = val / 100 * 24 - 24;
	  });

	  // volume numbox
	  adt.output.volumeNumbox = new _Numberbox2.default({
	    container: document.querySelector('#additor .main-output-ctrl .volume-ctrl .numbox'),
	    value: adt.output.node.outputGain,
	    minValue: -24,
	    maxValue: 7,
	    appendString: ' dB'
	  }).subscribe(this, function (val) {});

	  // output meter
	  adt.output.meterL = new _Meter2.default({
	    audioCtx: adt.audioCtx,
	    container: document.querySelector('#additor .main-output-ctrl .volume-ctrl .meter:nth-child(1)')
	  });
	  adt.output.meterR = new _Meter2.default({
	    audioCtx: adt.audioCtx,
	    container: document.querySelector('#additor .main-output-ctrl .volume-ctrl .meter:nth-child(2)')
	  });
	  adt.output.splitter = adt.audioCtx.createChannelSplitter(2);
	  adt.output.node.connect(adt.output.splitter);
	  adt.output.splitter.connect(adt.output.meterL.input, 0);
	  adt.output.splitter.connect(adt.output.meterR.input, 1);

	  return adt.output;
	};

	exports.default = MainOutputCtrl;

/***/ },
/* 22 */
/***/ function(module, exports) {

	'use strict';

	/** Class representing a slider widget */

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Slider = function () {

	  /**
	   * Create a slider
	   * @param {object} [o] - Options object.
	   * @param {object} [o.container=document.body] - The DOM element that wraps the widget canvas.
	   * @param {number} [o.value=0] - The initial value for the slider.
	   * @param {number} [o.minVal=0] - The minimum possible value the slider can represent.
	   * @param {number} [o.maxVal=127] - The maximum possible value teh slider can represent.
	   * @param {string} [o.sliderBarColor='#000'] - The color of the slider bar.
	   * @param {string} [o.triangleBorderColor='#000'] - The color of the triangle used as the slider's needle.
	   * @param {string} [o.triangleFillColor='#000'] - The fill color for the slider's triangle needle.
	   */
	  function Slider(o) {
	    _classCallCheck(this, Slider);

	    o = o || {};

	    // observers get notified of changes to this.value
	    this.observers = [];

	    // value
	    this._value = o.value || 0;
	    this._minValue = o.minVal || o.minValue || 0;
	    this._maxValue = o.maxVal || o.maxValue || 127;

	    // display options
	    this._sliderBarColor = o.sliderBarColor || 'black';
	    this._triangleBorderColor = o.triangleBorderColor || 'black';
	    this._triangleFillColor = o.triangleFillColor || 'black';

	    // drawing context
	    this.container = o.container || document.body;
	    this.canvas = document.createElement('canvas');
	    this.canvas.height = this.container.clientHeight;
	    this.canvas.width = this.container.clientWidth;
	    this.container.appendChild(this.canvas);
	    this.ctx = this.canvas.getContext('2d');

	    // init
	    this.drawUI();
	    this.assignListeners();

	    return this;
	  }

	  /* --- Observer methods --- */


	  _createClass(Slider, [{
	    key: 'subscribe',
	    value: function subscribe(context, func) {
	      this.observers.push({
	        func: func,
	        context: context
	      });
	      return this;
	    }
	  }, {
	    key: 'unsubscribe',
	    value: function unsubscribe(context, func) {
	      this.observers = this.observers.filter(function (observer) {
	        return observer.func !== func || observer.context !== context;
	      });
	      return this;
	    }
	  }, {
	    key: 'notify',
	    value: function notify() {
	      var _this = this;
	      this.observers.forEach(function (observer) {
	        observer.func.call(observer.context, _this._value);
	      });
	    }

	    /* --- Getters and setters --- */

	  }, {
	    key: 'setCanvasWidth',
	    value: function setCanvasWidth(newWidth) {
	      this.canvasWidth = newWidth;
	    }
	  }, {
	    key: 'setCanvasHeight',
	    value: function setCanvasHeight(newHeight) {
	      this.canvasHeight = newHeight;
	    }
	  }, {
	    key: 'setValue',


	    // setter used if needed to bind setValue as an observer
	    value: function setValue(newValue) {
	      this.value = newValue;
	    }

	    /* --- UI DRAWING -- */

	  }, {
	    key: 'drawSliderBar',
	    value: function drawSliderBar() {
	      var cX = this.sliderBarXPos;

	      this.ctx.beginPath();
	      this.ctx.moveTo(cX, this.sliderBarYOffset);
	      this.ctx.lineTo(cX, this.canvas.height - this.sliderBarYOffset);
	      this.ctx.strokeStyle = this._sliderBarColor;
	      this.ctx.lineWidth = 2 * Math.round(this.sliderBarWidth / 2);
	      this.ctx.stroke();
	    }
	  }, {
	    key: 'drawSliderTriangle',
	    value: function drawSliderTriangle() {
	      var cX = this.sliderBarXPos;

	      var sliderBarWidth = this.sliderBarWidth;
	      var sliderBarHeight = this.sliderBarHeight;
	      var triangleMedian = this.triangleMedianLength;
	      var triangleYPos = this.triangleYPos;

	      this.ctx.beginPath();
	      this.ctx.moveTo(cX, triangleYPos);
	      this.ctx.lineTo(cX + triangleMedian, triangleYPos - this.triangleHeight * 0.5);
	      this.ctx.lineTo(cX + triangleMedian, triangleYPos + this.triangleHeight * 0.5);
	      this.ctx.lineTo(cX, triangleYPos);
	      this.ctx.strokeStyle = 'black';
	      this.ctx.lineWidth = 1;
	      this.ctx.stroke();
	      this.ctx.fill();
	    }
	  }, {
	    key: 'drawUI',
	    value: function drawUI() {
	      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	      this.drawSliderBar();
	      this.drawSliderTriangle();
	    }

	    /* --- UI INTERACTION --- */

	    /**
	     * Is (x, y) within the active area for the slider?
	     */

	  }, {
	    key: 'isWithinSliderBarActiveArea',
	    value: function isWithinSliderBarActiveArea(x, y) {
	      var xThreshold = 4;

	      if (y <= this.canvas.height - this.sliderBarYOffset && y >= this.sliderBarYOffset) {
	        if (x >= this.sliderBarXPos - xThreshold && x <= this.sliderBarXPos + xThreshold) {
	          return true;
	        }
	      }
	      return false;
	    }

	    /**
	     * Is (x, y) inside the triangle handle?
	     */

	  }, {
	    key: 'isWithinTriangle',
	    value: function isWithinTriangle(x, y) {
	      var _this = this;

	      var leftTriangleEdge = this.sliderBarXPos;
	      var rightTriangleEdge = leftTriangleEdge + this.triangleMedianLength;
	      var xWithinTriangle = x - leftTriangleEdge;

	      function triangleHypotenuseY(x) {
	        var angle = Math.atan(_this.triangleHeight * 0.5 / _this.triangleMedianLength);
	        var hypY = Math.tan(angle) * x;
	        return hypY;
	      }

	      if (x >= leftTriangleEdge && x <= rightTriangleEdge) {
	        if (y >= this.triangleYPos - triangleHypotenuseY(xWithinTriangle) && y <= this.triangleYPos + triangleHypotenuseY(xWithinTriangle)) {
	          return true;
	        }
	      }
	      return false;
	    }
	  }, {
	    key: 'assignListeners',
	    value: function assignListeners() {
	      var _this = this;

	      this.canvas.addEventListener('mousedown', mouseDownHandler);

	      function mouseDownHandler(e) {
	        var canvasBoundingClientRect = _this.canvas.getBoundingClientRect();
	        var x = e.clientX - canvasBoundingClientRect.left;
	        var y = e.clientY - canvasBoundingClientRect.top;

	        if (_this.isWithinSliderBarActiveArea(x, y)) {
	          setSliderValueByMousePos(e);
	        }

	        if (_this.isWithinTriangle(x, y)) {
	          document.addEventListener('mousemove', setSliderValueByMousePos);
	          document.addEventListener('mouseup', mouseUpHandler);
	        };
	      }

	      function setSliderValueByMousePos(e) {
	        e.preventDefault();

	        var canvasTop = _this.canvas.getBoundingClientRect().top;
	        var sliderBarHeight = _this.sliderBarHeight;
	        var sliderY = sliderBarHeight - (e.clientY - canvasTop - _this.sliderBarYOffset);
	        var newSliderValue = Math.trunc(sliderY / sliderBarHeight * (_this._maxValue - _this._minValue) + _this._minValue);

	        _this.value = newSliderValue;
	      }

	      function mouseUpHandler(e) {
	        document.removeEventListener('mousemove', setSliderValueByMousePos);
	      }
	    }
	  }, {
	    key: 'canvasWidth',
	    set: function set(newWidth) {
	      this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
	      this._canvas.width = newWidth;
	      this.drawUI();
	      return this;
	    }
	  }, {
	    key: 'canvasHeight',
	    set: function set(newHeight) {
	      this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
	      this._canvas.height = newHeight;
	      this.drawUI();
	      return this;
	    }
	  }, {
	    key: 'value',
	    get: function get() {
	      return this._value;
	    },
	    set: function set(newValue) {
	      this._value = Math.max(Math.min(newValue, this._maxValue), this._minValue);
	      this.drawUI();
	      this.notify();
	      return this;
	    }
	  }, {
	    key: 'sliderBarXPos',
	    get: function get() {
	      var cX = Math.trunc(this.sliderBarWidth);
	      return cX;
	    }
	  }, {
	    key: 'sliderBarWidth',
	    get: function get() {
	      var sliderBarWidth = Math.trunc(this.canvas.height * 0.02);
	      return sliderBarWidth;
	    }
	  }, {
	    key: 'sliderBarYOffset',
	    get: function get() {
	      var yOffset = 5;
	      return yOffset;
	    }
	  }, {
	    key: 'sliderBarHeight',
	    get: function get() {
	      var sliderBarHeight = Math.trunc(this.canvas.height - this.sliderBarYOffset * 2);
	      return sliderBarHeight;
	    }
	  }, {
	    key: 'triangleYPos',
	    get: function get() {
	      var valuePortion = (this._value - this._minValue) / (this._maxValue - this._minValue);
	      var valueScaledToSlider = valuePortion * this.sliderBarHeight;
	      var triangleYPos = this.canvas.height - valueScaledToSlider - this.sliderBarYOffset;
	      return triangleYPos;
	    }
	  }, {
	    key: 'triangleMedianLength',
	    get: function get() {
	      var triangleMedianLength = this.sliderBarHeight * 0.13;
	      return triangleMedianLength;
	    }
	  }, {
	    key: 'triangleHeight',
	    get: function get() {
	      var triangleHeight = this.triangleMedianLength;
	      return triangleHeight;
	    }
	  }]);

	  return Slider;
	}();

	exports.default = Slider;

/***/ },
/* 23 */
/***/ function(module, exports) {

	'use strict';

	/** A class representing a volume meter */

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Meter = function () {

	  /**
	   * Create a meter
	   * @param {object} [o] - Options object.
	   * @param {object} [o.container=document.body] - The DOM element that wraps the widget canvas.
	   * @param {object} [o.audioCtx=new AudioContext] - The audio context the meter is to be used in.
	   * @param {string} [o.borderColor='#000'] - The border color.
	   * @param {string} [o.backgroundColor='#000'] - The background color.
	   * @param {number} [o.initAmplitude=0] - The initial amplitude to be displayed (range of 0. - 1.)
	   */
	  function Meter(o) {
	    _classCallCheck(this, Meter);

	    var _this = this;

	    o = o || {};

	    this._audioCtx = o.audioCtx || this._audioCtx || new AudioContext();

	    // style options
	    this._borderColor = o.borderColor || 'black';
	    this._backgroundColor = o.backgroundColor || 'black';

	    // init amplitude values
	    this._amplitude = o.initAmplitude || 0;
	    this._peak = o.initPeak || -1;
	    this._prevAmplitude = 0;

	    // create the canvas context
	    this.container = o.container || document.body;
	    this.canvas = document.createElement('canvas');
	    this.container.appendChild(this.canvas);
	    this.canvas.width = this.container.clientWidth;
	    this.canvas.height = this.container.clientHeight;
	    this.ctx = this.canvas.getContext('2d');

	    this.drawMeter();

	    this.analyser = this._audioCtx.createAnalyser();
	    this.analyser.fftSize = 1024;

	    this.input = this.analyser;

	    this._peakSetTime = this._audioCtx.currentTime;

	    this.scriptProcessor = this._audioCtx.createScriptProcessor(2048, 1, 1);

	    this.analyser.connect(this.scriptProcessor);
	    this.scriptProcessor.connect(this._audioCtx.destination);

	    this.scriptProcessor.onaudioprocess = function () {
	      _this.calculateAmplitude();
	    };
	  }

	  /* =================== */
	  /* --- Audio setup --- */
	  /* =================== */

	  _createClass(Meter, [{
	    key: 'connectTo',
	    value: function connectTo(audioSource) {
	      audioSource.connect(this.analyser);
	      return this;
	    }
	  }, {
	    key: 'calculateAmplitude',
	    value: function calculateAmplitude() {
	      var _this = this;

	      var data = new Float32Array(1024);

	      _this.analyser.getFloatTimeDomainData(data);

	      // calculate the rms over the 1024 samples
	      _this._amplitude = Math.sqrt(data.reduce(function (prev, cur) {
	        return prev + cur * cur;
	      }, 0) / data.length);

	      // scale up
	      _this._amplitude = _this._amplitude * 5; // <-FIXTHIS

	      // calculate the peak position
	      // special cases - peak = -1 means peak expired and waiting for amplitude to rise
	      // peak = 0 means amplitude is rising, waiting for peak
	      if (_this._amplitude < _this._prevAmplitude && _this._peak < _this._prevAmplitude && _this._peak !== -1) {
	        _this._peak = _this._prevAmplitude;
	        _this._peakSetTime = _this._audioCtx.currentTime;
	      } else if (_this._amplitude > _this._prevAmplitude) {
	        _this._peak = 0;
	      }

	      // draw the peak for 2 seconds, then remove it
	      if (_this._audioCtx.currentTime - _this._peakSetTime > 2 && _this._peak !== 0) {
	        _this._peak = -1;
	      }

	      _this._prevAmplitude = _this._amplitude;

	      _this.drawMeter();
	    }

	    /* =========================== */
	    /* --- Getters and setters --- */
	    /* =========================== */

	  }, {
	    key: 'setCanvasWidth',
	    value: function setCanvasWidth(newWidth) {
	      this.canvasWidth = newWidth;
	    }
	  }, {
	    key: 'setCanvasHeight',
	    value: function setCanvasHeight(newHeight) {
	      this.canvasHeight = newHeight;
	    }

	    /* ================== */
	    /* --- UI Drawing --- */
	    /* ================== */

	  }, {
	    key: 'ledGradient',
	    value: function ledGradient() {
	      var gradient = this.ctx.createLinearGradient(0, this.canvas.height, 0, 0);
	      gradient.addColorStop(0, 'green');
	      gradient.addColorStop(0.6, 'lightgreen');
	      gradient.addColorStop(0.8, 'yellow');
	      gradient.addColorStop(1, 'red');

	      return gradient;
	    }
	  }, {
	    key: 'drawBorder',
	    value: function drawBorder() {
	      var width = this.canvas.width;
	      var height = this.canvas.height;
	      var yOffset = 5;

	      this.ctx.strokeStyle = this._borderColor;
	      this.ctx.fillStyle = this._backgroundColor;
	      this.ctx.fillRect(0, yOffset, width, height - 2 * yOffset);
	      this.ctx.strokeRect(0, yOffset, width, height - 2 * yOffset);
	    }
	  }, {
	    key: 'drawLed',
	    value: function drawLed(amplitude) {
	      var ledHeight = this.canvas.height * amplitude;

	      this.ctx.fillStyle = this.ledGradient();
	      this.ctx.fillRect(0, this.canvas.height - ledHeight, this.canvas.width, ledHeight);
	    }
	  }, {
	    key: 'drawPeak',
	    value: function drawPeak(amplitude) {
	      var ledHeight = this.canvas.height * amplitude;

	      this.ctx.fillStyle = this.ledGradient();
	      this.ctx.fillRect(0, this.canvas.height - ledHeight, this.canvas.width, 1);
	    }
	  }, {
	    key: 'drawMeter',
	    value: function drawMeter(amplitude) {
	      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	      this.drawBorder();
	      this.drawLed(this._amplitude);
	      this.drawPeak(this._peak);
	    }
	  }, {
	    key: 'canvasWidth',
	    set: function set(newWidth) {
	      this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
	      this._canvas.width = newWidth;
	      this.drawUI();
	      return this;
	    }
	  }, {
	    key: 'canvasHeight',
	    set: function set(newHeight) {
	      this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
	      this._canvas.height = newHeight;
	      this.drawUI();
	      return this;
	    }
	  }]);

	  return Meter;
	}();

	exports.default = Meter;

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _Keyboard = __webpack_require__(25);

	var _Keyboard2 = _interopRequireDefault(_Keyboard);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	'use strict'; /* --------------------------- */
	/* --- Keyboard controller --- */
	/* --------------------------- */

	var KeyboardCtrl = function KeyboardCtrl(adt) {

	  adt.kbd = new _Keyboard2.default({
	    container: document.querySelector('#additor .kbd-ctrl .kbd'),
	    bottomNote: 12,
	    topNote: 72,
	    mode: 'polyphonic',
	    blackKeyColor: '#242424'
	  }).subscribe(this, function (kbdNoteEvent) {
	    var pitch = kbdNoteEvent.pitch;
	    var vel = kbdNoteEvent.velocity;

	    if (vel === 0) {
	      adt.synth.node.releaseNote(pitch);
	    } else {
	      adt.synth.node.playNote(pitch);
	    }
	  });

	  return adt.kbd;
	};

	exports.default = KeyboardCtrl;

/***/ },
/* 25 */
/***/ function(module, exports) {

	'use strict';

	/** A class representing a piano keyboard widget */

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Keyboard = function () {

	  /**
	   * Create a keyboard
	   * @param {object} [o] - Options object.
	   * @param {object} [o.container=document.body] - The DOM element that wraps the widget canvas.
	   * @param {number} [o.bottomNote=48] - The bottom note (MIDI pitch) of the keyboard.
	   * @param {number} [o.topNote=71] - The top note (MIDI pitch) of the keyboard.
	   * @param {string} [o.keyBorderColor='#000'] - The color of the border separating the keys.
	   * @param {string} [o.blackKeyColor='#000'] - The color used for the black keys.
	   * @param {string} [o.whiteKeyColor='#fff'] - The color used for the white keys.
	   * @param {string} [o.blackKeyActiveColor='#555'] - The color used to represent an active black key.
	   * @param {string} [o.whiteKeyActiveColor='#333'] - The color used to represent an active white key.
	   * @param {string} [o.mode='monophonic'] - The polyphony mode. Possible values are 'monophonic' (only one active note at a time) or 'polyphonic' (can have several active notes at a time).
	   * @param {boolean} [o.editable=true] - Boolean specifying whether the keyboard is editable by the mouse or touch interactions. A non-editable keyboard may be used as a visual diagram, for example.
	   */
	  function Keyboard(o) {
	    _classCallCheck(this, Keyboard);

	    o = o || {};

	    this.observers = [];

	    // note range
	    this._bottomNote = o.bottomNote || 48; //C3
	    this._topNote = o.topNote || 71; //B4

	    // prevent bottom or top notes being black keys
	    this._bottomNote = this.isBlackKey(this._bottomNote) ? this._bottomNote - 1 : this._bottomNote;
	    this._topNote = this.isBlackKey(this._topNote) ? this._topNote + 1 : this._topNote;

	    this._numWhiteKeys = this.numWhiteKeys();

	    // colors
	    this.keyBorderColor = o.keyBorderColor || '#000';
	    this.blackKeyColor = o.blackKeyColor || '#000';
	    this.whiteKeyColor = o.whiteKeyColor || '#FFF';
	    this.whiteKeyActiveColor = o.whiteKeyActiveColor || o.keyActiveColor || '#555';
	    this.blackKeyActiveColor = o.blackKeyActiveColor || o.keyActiveColor || '#333';

	    this._mode = o.mode || 'monophonic'; // 'monophonic', 'polyphonic'
	    this._editable = typeof o.editable !== 'undefined' ? o.editable : true; // can you edit by clicking?

	    this._activeChord = [];
	    this.canvasKeyMap = [];

	    // keyboard canvas
	    this._container = o.container || document.body;
	    this._container.style.position = 'relative';
	    this.canvas = document.createElement('canvas');
	    this.canvas.style.position = 'absolute';
	    this.canvas.style.left = '0px';
	    this.canvas.style.top = '0px';
	    this.canvas.width = this._container.clientWidth;
	    this.canvas.height = this._container.clientHeight;
	    this._container.appendChild(this.canvas);
	    this.ctx = this.canvas.getContext('2d');

	    // overlay canvas
	    this.overlayCanvas = document.createElement('canvas');
	    this.overlayCanvas.width = this.canvas.width;
	    this.overlayCanvas.height = this.canvas.height;
	    this._container.appendChild(this.overlayCanvas);
	    this.overlayCanvas.style.position = 'absolute';
	    this.overlayCanvas.style.left = '0px';
	    this.overlayCanvas.style.top = '0px';
	    this.olCtx = this.overlayCanvas.getContext('2d');

	    this.init();

	    return this;
	  }

	  _createClass(Keyboard, [{
	    key: 'init',
	    value: function init() {
	      this.createKeyboard();
	      this.assignListeners();
	      this._listenForResize();
	    }

	    /* --- OBSERVER METHODS --- */

	  }, {
	    key: 'subscribe',
	    value: function subscribe(context, func) {
	      this.observers.push({
	        func: func,
	        context: context
	      });
	      return this;
	    }
	  }, {
	    key: 'unsubscribe',
	    value: function unsubscribe(context, func) {
	      this.observers = this.observers.filter(function (observer) {
	        return observer.func !== func || observer.context !== context;
	      });
	      return this;
	    }
	  }, {
	    key: 'notify',
	    value: function notify() {
	      var _this = this;
	      this.observers.forEach(function (observer) {
	        observer.func.call(observer.context, _this._activeChord);
	      });
	    }
	  }, {
	    key: 'notifyPitch',
	    value: function notifyPitch(midiPitchEvent) {
	      var _this = this;
	      this.observers.forEach(function (observer) {
	        observer.func.call(observer.context, midiPitchEvent);
	      });
	    }

	    /**
	     * Set the options
	     */

	  }, {
	    key: 'setOptions',
	    value: function setOptions(o) {
	      o = o || {};

	      // note range
	      this._bottomNote = o.bottomNote || this._bottomNote;
	      this._topNote = o.topNote || this._bottomNote;

	      // colors
	      this.keyBorderColor = o.keyBorderColor || this.keyBorderColor;
	      this.blackKeyColor = o.blackKeyColor || this.blackKeyColor;
	      this.whiteKeyColor = o.whiteKeyColor || this.whiteKeyColor;
	      this.whiteKeyActiveColor = o.whiteKeyActiveColor || o.keyActiveColor || this.whiteKeyActiveColor;
	      this.blackKeyActiveColor = o.blackKeyActiveColor || o.keyActiveColor || this.blackKeyActiveColor;

	      this._mode = o.mode || this.mode; // monophonic or polyphonic
	      this._editable = typeof o.editable !== 'undefined' ? o.editable : this.editable; // can you edit by clicking?

	      this.createKeyboard();
	      this.assignListeners();
	    }
	  }, {
	    key: 'setMode',
	    value: function setMode(newMode) {
	      this.mode = newMode;
	    }
	  }, {
	    key: 'setBottomNote',
	    value: function setBottomNote(note) {
	      this._bottomNote = note;
	    }
	  }, {
	    key: 'setTopNote',
	    value: function setTopNote(note) {
	      this._topNote = note;
	    }

	    /**
	     * Decide whether a given MIDI pitch is a black key
	     */

	  }, {
	    key: 'isBlackKey',
	    value: function isBlackKey(midiPitch) {
	      var midiPitchMod12 = midiPitch % 12;

	      if (midiPitchMod12 === 1 || midiPitchMod12 === 3 || midiPitchMod12 === 6 || midiPitchMod12 === 8 || midiPitchMod12 === 10) {
	        return true;
	      }

	      return false;
	    }

	    /**
	     * Get the number of white keys on the keyboard
	     */

	  }, {
	    key: 'numWhiteKeys',
	    value: function numWhiteKeys() {
	      var topNote = this._topNote;
	      var bottomNote = this._bottomNote;

	      var numberOfNotes = topNote - bottomNote;
	      var numberOfOctaves = Math.floor(numberOfNotes / 12);
	      var numberOfWhiteKeys = numberOfOctaves * 7 + 1;
	      var noteRemainderBottom;
	      var noteCache;

	      // if the keyboard divides into an integer number of octaves,
	      // the number of white keys is numberOfOctaves * 7 + 1, and we can return
	      if (numberOfNotes % 12 === 0) {
	        return numberOfWhiteKeys;
	      }

	      // otherwise count the remaining white keys that didn't divide into full octaves
	      noteRemainderBottom = bottomNote + numberOfOctaves * 12 + 1;
	      for (var i = noteRemainderBottom; i <= topNote; i++) {
	        if (!this.isBlackKey(i)) {
	          numberOfWhiteKeys++;
	        }
	      }

	      return numberOfWhiteKeys;
	    }

	    /**
	     * Decide which key is beneath a mouse event
	     */

	  }, {
	    key: 'whichKeyIsPressed',
	    value: function whichKeyIsPressed(e) {
	      var canvasX, canvasY, canvasKeyMapIndex, midiNote;

	      canvasX = e.clientX - this._container.getBoundingClientRect().left;
	      canvasY = e.clientY - this._container.getBoundingClientRect().top;

	      // which key was pressed
	      canvasKeyMapIndex = Math.trunc(canvasX / this.canvas.width * (this.canvas.width / (this.blackKeyWidth / 2)));

	      // decide which key is pressed
	      if (canvasY > this.blackKeyHeight) {
	        if (canvasKeyMapIndex % 3 === 0) {
	          midiNote = this.canvasKeyMap[canvasKeyMapIndex + 1];
	        } else if (canvasKeyMapIndex % 3 === 2) {
	          midiNote = this.canvasKeyMap[canvasKeyMapIndex - 1];
	        } else {
	          midiNote = this.canvasKeyMap[canvasKeyMapIndex];
	        }
	      } else {
	        midiNote = this.canvasKeyMap[canvasKeyMapIndex];
	      }

	      return { midiNote: midiNote, canvasKeyMapIndex: canvasKeyMapIndex };
	    }

	    /**
	     * Draw the static keyboard and assign the canvasKeyMap
	     * The canvasKeyMap maps the spatial distribution of the keys to midi note numbers
	     */

	  }, {
	    key: 'createKeyboard',
	    value: function createKeyboard() {
	      var _this = this;

	      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

	      // set the keyboard dimensions
	      this._numWhiteKeys = this.numWhiteKeys();
	      this.whiteKeyWidth = this.canvas.width / this._numWhiteKeys;
	      this.blackKeyWidth = this.whiteKeyWidth / 3 * 2;
	      this.whiteKeyHeight = this.whiteKeyWidth * 3.5;
	      this.blackKeyHeight = this.whiteKeyHeight / 3 * 1.8;

	      // change the canvas and overlay height to match the key height
	      this.canvas.height = this.whiteKeyHeight + 1;
	      this.overlayCanvas.height = this.canvas.height;

	      // change the container dims to match the canvas
	      this._container.style.height = this.canvas.height + 'px';

	      //draw the keys and change the keymap
	      var curXPos = 0;
	      var canvasKeyIndex = 0;
	      var prevKeyWasBlack = false;

	      for (var midiNote = this._bottomNote; midiNote <= this._topNote; midiNote++) {
	        if (!this.isBlackKey(midiNote)) {

	          // draw the white key
	          this.ctx.fillStyle = this.whiteKeyColor;
	          this.ctx.fillRect(curXPos, 0, this.whiteKeyWidth, this.whiteKeyHeight);
	          this.ctx.strokeStyle = this.keyBorderColor;
	          this.ctx.lineWidth = this.whiteKeyWidth * 0.08;
	          this.ctx.strokeRect(curXPos, 0, this.whiteKeyWidth, this.whiteKeyHeight);

	          // assign the key map
	          if (!prevKeyWasBlack) {
	            this.canvasKeyMap[canvasKeyIndex] = midiNote;
	          } else {

	            // draw the black key that comes before the current white key
	            this.ctx.fillStyle = this.blackKeyColor;
	            this.ctx.fillRect(curXPos - this.blackKeyWidth / 2, 0, this.blackKeyWidth, this.blackKeyHeight);
	          }

	          this.canvasKeyMap[canvasKeyIndex + 1] = midiNote;
	          this.canvasKeyMap[canvasKeyIndex + 2] = midiNote;
	          canvasKeyIndex += 3;
	          prevKeyWasBlack = false;

	          curXPos += this.whiteKeyWidth;
	        } else {
	          this.canvasKeyMap[canvasKeyIndex - 1] = midiNote;
	          this.canvasKeyMap[canvasKeyIndex] = midiNote;

	          //note: we don't need to advance the canvas key index here
	          prevKeyWasBlack = true;
	        }
	      }
	    }

	    /**
	     * Draw the active key overlay
	     */

	  }, {
	    key: 'drawKeyboardOverlay',
	    value: function drawKeyboardOverlay(midiNote, canvasKeyMapIndex, paintMethod) {
	      var _this = this;

	      var activeKeyXPos;

	      if (this._mode === 'monophonic' || this._mode === 'mono') {
	        this.olCtx.clearRect(0, 0, this.overlayCanvas.width, this.overlayCanvas.height);
	      }

	      // draw shadow for black keys
	      if (_this.isBlackKey(midiNote)) {
	        _this.olCtx.fillStyle = _this.blackKeyActiveColor;

	        if (canvasKeyMapIndex % 3 === 0) {
	          activeKeyXPos = Math.floor(canvasKeyMapIndex / 3) * _this.whiteKeyWidth - _this.blackKeyWidth / 2;
	        } else if (canvasKeyMapIndex % 3 === 2) {
	          activeKeyXPos = Math.floor(canvasKeyMapIndex / 3) * _this.whiteKeyWidth + _this.blackKeyWidth;
	        }

	        if (paintMethod === 'draw') {
	          _this.olCtx.fillRect(activeKeyXPos, 0, _this.blackKeyWidth, _this.blackKeyHeight);
	        } else if (paintMethod === 'erase') {
	          _this.olCtx.clearRect(activeKeyXPos, 0, _this.blackKeyWidth, _this.blackKeyHeight);
	        }

	        // draw shadow for white keys
	      } else {
	        activeKeyXPos = Math.floor(canvasKeyMapIndex / 3) * _this.whiteKeyWidth;
	        _this.olCtx.fillStyle = _this.whiteKeyActiveColor;

	        // if it's the first or last key on the keyboard, and if the key next to it is also a white key
	        if (Math.trunc(canvasKeyMapIndex / 3) === 0 && !_this.isBlackKey(_this.canvasKeyMap[3]) || Math.trunc(canvasKeyMapIndex / 3) === Math.trunc((_this.canvasKeyMap.length - 1) / 3) && !_this.isBlackKey(_this.canvasKeyMap[_this.canvasKeyMap.length - 3])) {

	          if (paintMethod === 'draw') {
	            _this.olCtx.fillRect(activeKeyXPos, 0, _this.whiteKeyWidth, _this.whiteKeyHeight);
	          } else if (paintMethod === 'erase') {
	            _this.olCtx.clearRect(activeKeyXPos, 0, _this.whiteKeyWidth, _this.whiteKeyHeight);
	          }

	          // TODO: needs to be refactored to only specify the draw and clear operations once
	          // if it's not the first or last key on the keyboard, or it is, but the one next to it is not
	        } else {
	          // top part of white keys

	          // if it's an E or a B
	          if (midiNote % 12 === 4 || midiNote % 12 === 11) {

	            if (paintMethod === 'draw') {
	              _this.olCtx.fillRect(activeKeyXPos, _this.blackKeyHeight, _this.whiteKeyWidth, _this.whiteKeyHeight - _this.blackKeyHeight);
	              _this.olCtx.fillRect(activeKeyXPos + _this.blackKeyWidth / 2, 0, _this.blackKeyWidth, _this.blackKeyHeight + 1);

	              // re-stroke the border, right side
	              _this.olCtx.beginPath();
	              _this.olCtx.moveTo(activeKeyXPos + _this.whiteKeyWidth, 0);
	              _this.olCtx.lineTo(activeKeyXPos + _this.whiteKeyWidth, _this.whiteKeyHeight);
	              _this.olCtx.strokeStyle = _this.keyBorderColor;
	              _this.olCtx.lineWidth = 1;
	              _this.olCtx.stroke();
	            } else if (paintMethod === 'erase') {
	              _this.olCtx.clearRect(activeKeyXPos, _this.blackKeyHeight, _this.whiteKeyWidth, _this.whiteKeyHeight - _this.blackKeyHeight);
	              _this.olCtx.clearRect(activeKeyXPos + _this.blackKeyWidth / 2, 0, _this.blackKeyWidth, _this.blackKeyHeight + 1);
	            }

	            // if it's a C or an F
	          } else if (midiNote % 12 === 0 || midiNote % 12 === 5) {

	            if (paintMethod === 'draw') {
	              _this.olCtx.fillRect(activeKeyXPos, _this.blackKeyHeight, _this.whiteKeyWidth, _this.whiteKeyHeight - _this.blackKeyHeight);
	              _this.olCtx.fillRect(activeKeyXPos, 0, _this.blackKeyWidth, _this.blackKeyHeight + 1);

	              // re-stroke the border, left side
	              _this.olCtx.beginPath();
	              _this.olCtx.moveTo(activeKeyXPos, 0);
	              _this.olCtx.lineTo(activeKeyXPos, _this.whiteKeyHeight);
	              _this.olCtx.strokeStyle = _this.keyBorderColor;
	              _this.olCtx.lineWidth = 1;
	              _this.olCtx.stroke();
	            } else if (paintMethod === 'erase') {
	              _this.olCtx.clearRect(activeKeyXPos, _this.blackKeyHeight, _this.whiteKeyWidth, _this.whiteKeyHeight - _this.blackKeyHeight);
	              _this.olCtx.clearRect(activeKeyXPos, 0, _this.blackKeyWidth, _this.blackKeyHeight + 1);
	            }
	          }

	          if (paintMethod === 'draw') {
	            _this.olCtx.fillRect(activeKeyXPos, _this.blackKeyHeight, _this.whiteKeyWidth, _this.whiteKeyHeight - _this.blackKeyHeight);
	            _this.olCtx.fillRect(activeKeyXPos + _this.blackKeyWidth / 2, 0, _this.blackKeyWidth / 2, _this.blackKeyHeight + 1);
	          } else if (paintMethod === 'erase') {
	            _this.olCtx.clearRect(activeKeyXPos, _this.blackKeyHeight, _this.whiteKeyWidth, _this.whiteKeyHeight - _this.blackKeyHeight);
	            _this.olCtx.clearRect(activeKeyXPos + _this.blackKeyWidth / 2, 0, _this.blackKeyWidth / 2, _this.blackKeyHeight + 1);
	          }

	          // re-stroke the border, right side
	          _this.olCtx.beginPath();
	          _this.olCtx.moveTo(activeKeyXPos + _this.whiteKeyWidth, _this.blackKeyHeight);
	          _this.olCtx.lineTo(activeKeyXPos + _this.whiteKeyWidth, _this.whiteKeyHeight);
	          _this.olCtx.strokeStyle = _this.keyBorderColor;
	          _this.olCtx.lineWidth = 1;
	          _this.olCtx.stroke();

	          // re-stroke the border, left side
	          _this.olCtx.beginPath();
	          _this.olCtx.moveTo(activeKeyXPos, _this.blackKeyHeight);
	          _this.olCtx.lineTo(activeKeyXPos, _this.whiteKeyHeight);
	          _this.olCtx.strokeStyle = _this.keyBorderColor;
	          _this.olCtx.lineWidth = 1;
	          _this.olCtx.stroke();
	        }
	      }
	    }
	  }, {
	    key: '_drawUI',
	    value: function _drawUI() {
	      this.createKeyboard();
	    }

	    /**
	     *
	     */

	  }, {
	    key: 'setActiveChord',
	    value: function setActiveChord(activeChord) {
	      this._activeChord = activeChord;
	    }

	    /**
	     * Update the active chord array
	     * If the new midi
	     * @param {Number} newMidiNote - The midi pitch value for the new note
	     */

	  }, {
	    key: 'updateActiveChord',
	    value: function updateActiveChord(newActiveKey) {
	      var newActiveNote = newActiveKey.midiNote;
	      var newActiveCanvasKeyMapIndex = newActiveKey.canvasKeyMapIndex;
	      var newActiveNoteIndex = this._activeChord.indexOf(newActiveNote);

	      // if the value is not found, add it to the array. If found, remove it
	      if (newActiveNoteIndex === -1) {
	        if (this._mode === 'polyphonic') {
	          this._activeChord.push(newActiveNote);
	        } else {
	          this._activeChord = [newActiveNote];
	        }
	        this.drawKeyboardOverlay(newActiveNote, newActiveCanvasKeyMapIndex, 'draw');

	        /* ======= FIXME FIXME FIXME ======== */
	        this.notifyPitch({ pitch: newActiveNote, velocity: 127 }); // <======= !!!!!!!!!
	        /*=================================== */
	      } else {
	        this._activeChord.splice(newActiveNoteIndex, 1);
	        this.drawKeyboardOverlay(newActiveNote, newActiveCanvasKeyMapIndex, 'erase');

	        /* ======= FIXME FIXME FIXME ======== */
	        this.notifyPitch({ pitch: newActiveNote, velocity: 0 }); // <======= !!!!!!!!!
	        /*=================================== */
	      }
	      // this.notify(); <======= !!!!!!!!!
	    }

	    /**
	     * Assign the mouse listeners
	     */

	  }, {
	    key: 'assignListeners',
	    value: function assignListeners() {
	      var _this = this;

	      var activeKey = void 0;
	      var activeMidiNote = void 0;
	      var activeCanvasKeyMapIndex = void 0;
	      var prevMidiNote = void 0;

	      if (this._editable) {
	        this.overlayCanvas.addEventListener('mousedown', mouseDownListener);
	      } else {
	        this.overlayCanvas.removeEventListener('mousedown', mouseDownListener);
	      }

	      function mouseDownListener(e) {
	        e.preventDefault();

	        drawActiveKeyWrap(e);

	        _this.overlayCanvas.addEventListener('mousemove', drawActiveKeyWrap);

	        _this.overlayCanvas.addEventListener('mouseup', function () {
	          _this.overlayCanvas.removeEventListener('mousemove', drawActiveKeyWrap);
	        });
	      }

	      function drawActiveKeyWrap(e) {
	        activeKey = _this.whichKeyIsPressed(e);
	        activeMidiNote = activeKey.midiNote;
	        activeCanvasKeyMapIndex = activeKey.canvasKeyMapIndex;

	        if (e.type === 'mousedown' || activeMidiNote !== prevMidiNote) {
	          _this.updateActiveChord(activeKey);
	          prevMidiNote = activeMidiNote;
	        }
	      }
	    }

	    /**
	     * Listens for whether the container's dimensions changed and resize the canvas if they did
	     */

	  }, {
	    key: '_listenForResize',
	    value: function _listenForResize() {
	      var _this = this;

	      // on window resize, adjust the canvas size in case the container size changes
	      window.addEventListener('resize', windowResizeThrottle);

	      function windowResizeThrottle() {
	        window.requestAnimationFrame(windowResize);
	      }

	      function windowResize() {
	        _this.canvas.width = _this._container.clientWidth;
	        _this.canvas.height = _this._container.clientHeight;
	        _this.overlayCanvas.width = _this.canvas.width;
	        _this.overlayCanvas.height = _this.canvas.height;

	        _this._drawUI();
	      }
	    }
	  }, {
	    key: 'mode',
	    get: function get() {
	      return this._mode;
	    },
	    set: function set(newMode) {
	      if (newMode === 'monophonic' || newMode === 'polyphonic') {
	        this._mode = newMode;
	      }
	      return this;
	    }
	  }]);

	  return Keyboard;
	}();

	exports.default = Keyboard;

/***/ }
/******/ ]);