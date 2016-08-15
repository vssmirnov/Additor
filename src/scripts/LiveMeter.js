define(function(require){
  'use strict';

  class LiveMeter {
    constructor(container, o) {
      var _this = this;

      o = o || {};

      // style options
      this._borderColor = o.borderColor || 'black';
      this._backgroundColor = o.backgroundColor || 'black';

      // init amplitude values
      this._amplitude = o.initAmplitude || 0;
      this._peak = o.initPeak || -1;
      this._prevAmplitude = 0;

      // create the canvas context
      this.container = container || document;
      this.canvas = document.createElement('canvas');
      this.container.appendChild(this.canvas);
      this.canvas.width = this.container.offsetWidth;
      this.canvas.height = this.container.offsetHeight;
      this.ctx = this.canvas.getContext('2d');

      this.drawLiveMeter();

      // create the audio context
      try {
        var AudioContext = window.AudioContext || window.webkitAudioContext;
        window.audioCtx = new AudioContext();
      } catch (e) {
        console.log('Err: no Web Audio support detected');
      }

      this.analyser = window.audioCtx.createAnalyser();
      this.analyser.fftSize = 1024;

      this.input = this.analyser;


      this._peakSetTime = window.audioCtx.currentTime;


      this.scriptProcessor = window.audioCtx.createScriptProcessor(2048, 1, 1);

      this.analyser.connect(this.scriptProcessor);
      this.scriptProcessor.connect(window.audioCtx.destination);

      this.scriptProcessor.onaudioprocess = function () {
        var data = new Float32Array(1024);

        _this.analyser.getFloatTimeDomainData(data);

        // use rms to calculate the average amplitude over the 1024 samples
        _this._amplitude = Math.sqrt(data.reduce((prev,cur) => {
          return prev + (cur * cur);
        }, 0) / data.length);

        // calculate the peak position
        // special cases - peak = -1 means peak expired and waiting for amplitude to rise
        // peak = 0 means amplitude is rising, waiting for peak
        if (_this._amplitude < _this._prevAmplitude && _this._peak < _this._prevAmplitude && _this._peak !== -1) {
          _this._peak = _this._prevAmplitude;
          _this._peakSetTime = window.audioCtx.currentTime;
        } else if (_this._amplitude > _this._prevAmplitude) {
          _this._peak = 0;
        }

        // draw the peak for 2 seconds, then remove it
        if (window.audioCtx.currentTime - _this._peakSetTime > 2 && _this._peak !== 0) {
          _this._peak = -1;
        }

        _this._prevAmplitude = _this._amplitude;

        _this.drawLiveMeter();
      }


    } // END CONSTRUCTOR ---

    // --- GUI DRAWING METHODS
    ledGradient () {
      var gradient = this.ctx.createLinearGradient(0, this.canvas.height, 0, 0);
      gradient.addColorStop(0, 'green');
      gradient.addColorStop(0.6, 'lightgreen');
      gradient.addColorStop(0.8, 'yellow');
      gradient.addColorStop(1, 'red');

      return gradient;
    }

    drawBorder() {
      var width = this.canvas.width;
      var height = this.canvas.height;

      this.ctx.strokeStyle = this._borderColor;
      this.ctx.fillStyle = this._backgroundColor;
      this.ctx.fillRect(0, 0, width, height);
      this.ctx.strokeRect(0, 0, width, height);
    }

    drawLed(amplitude) {
      var ledHeight = this.canvas.height * amplitude;

      this.ctx.fillStyle = this.ledGradient();
      this.ctx.fillRect(0, this.canvas.height - ledHeight, this.canvas.width, ledHeight);
    }

    drawPeak(amplitude) {
      var ledHeight = this.canvas.height * amplitude;

      this.ctx.fillStyle = this.ledGradient();
      this.ctx.fillRect(0, this.canvas.height - ledHeight, this.canvas.width, 1);
    }

    drawLiveMeter(amplitude) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.drawBorder();
      this.drawLed(this._amplitude);
      this.drawPeak(this._peak);
    }

    // --- AUDIO SETUP METHODS
    connectTo(audioSource) {
      audioSource.connect(this.analyser);
      return this;
    }

    getCurrentAmplitude() {

    }

  } /* --- end LiveMeter class definition --- */

  return LiveMeter;
});
