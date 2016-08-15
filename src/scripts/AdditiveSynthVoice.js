define(function(require) {
    'use strict';

    var GeneratorVoice = require('./GeneratorVoice');

    /**
     * An AdditiveSynthVoice represents one voice of an additive synthesizer
     */
    class AdditiveSynthVoice extends GeneratorVoice {
      constructor (o) {
        o = o || {};

        GeneratorVoice.call(this, o);

        this.output.gain.value = o.gain || 1;

        this._rootFrequency = o.rootFrequency || 220;

        // a bank of oscillators representing the harmonics for the the given voice
        // each node of the array will contain an oscillator connected to an overtone gain, output gain and a panner
        this.harmonics = [];
        this._numberOfHarmonics = o.numberOfHarmonics || 1;
        this.createHarmonics();
      }

      getFrequency () {
          return this._rootFrequency;
      }

      setFrequency (freq) {
          var _this = this;

          var currentTime = audioCtx.currentTime;

          this._rootFrequency = freq;

          this.harmonics.forEach(function(harmonic) {
              harmonic.oscillator.frequency.setValueAtTime(harmonic.harmonicity * _this._rootFrequency, currentTime);
          });

          return this;
      }

      getNumberOfHarmonics {
          return this._numberOfHarmonics;
      }

      setNumberOfHarmonics (numberOfHarmonics) {
          this._numberOfHarmonics = numberOfHarmonics;
          this.createHarmonics();
          return this;
      }

      // FIXME: possible memory leak when resetting the number of harmonics because old oscillators would not be deleted
      /**
       * Create the oscillator nodes which represent the harmonics of this voice
       */
      createHarmonics () {
          for(var i = 0; i < this._numberOfHarmonics; i++) {
              // create a new oscillator, gain, and panner
              var newOscillator = audioCtx.createOscillator();
              var newHarmonicGain = audioCtx.createGain();
              var newGain = audioCtx.createGain();
              var newPanner = audioCtx.createStereoPanner();

              // connect oscillator --> amplitude --> gain --> panner --> this.output
              newOscillator.connect(newHarmonicGain);
              newHarmonicGain.connect(newGain);
              newGain.connect(newPanner);
              newPanner.connect(this.output);

              var newHarmonicNode = {
                  oscillator: newOscillator,
                  amplitude: newHarmonicGain,
                  output: newGain,
                  panner: newPanner,
                  harmonicity: i + 1,
                  adsr: {
                      a: 0,
                      d: 0,
                      s: 1,
                      r: 0
                  }
              };

              newHarmonicNode.oscillator.frequency.value = this._rootFrequency * newHarmonicNode.harmonicity;
              newHarmonicNode.output.gain.value = 0;
              newHarmonicNode.oscillator.start();

              this.harmonics.push(newHarmonicNode);
          }
      }

      setHarmonicitiesByFunction (freqFunc) {
          var _this = this;

          this.harmonics.forEach(function(harmonic, n) {
              _this.harmonics[n].harmonicity = freqFunc(n);
          });

          // update the oscillator frequencies to match new harmonicities
          this.setFrequency(this._rootFrequency);
      }

      setHarmonicAmplitudesByFunction (ampFunc) {
          var thisVoice = this;

          this.harmonics.forEach(function(harmonic, n) {
              thisVoice.harmonics[n].amplitude.gain.value = ampFunc(n);
          });
      }

      setOutputGain (gain) {
          this.output.gain.value = gain;
          return this;
      }

      // FIXME: which level should the ADSR address? The voice? The poly? Each harmonic?
      /**
       * Execute an ADSR (attack, decay, sustain, release) envelope on the given voice
       * If a duration parameter is given, time the envelope according to the duration
       * If no duration parameter given, remain in the sustain phase until the stop function is invoked
       * @param {Object} o - Options
       * @param {Number} o.attack - Attack duration (ms)
       * @param {Number} o.decay - Decay duration (ms)
       * @param {Number} o.sustain - Sustain amplitude (gain value, 0. - 1.)
       * @param {Number} o.release - release duration (ms)
       * @param {Number} o.duration - total envelope duration
       * @param {Number | String} o.targetHarmonic - the number of the harmonic to be targeted (0 is the fundamental, 'all' targets all harmonics)
       */
      playADSR (o) {
          o = o || {};

          var startTime = audioCtx.currentTime;

          // note: these values are in ms, and are divided by 1000 to convert to s
          var attack = (o.attack || o.a || o.A || this.attack || 0) / 1000;
          var decay = (o.decay || o.d || o.D || this.decay || 0) / 1000;
          var sustain = o.sustain || o.s || o.S || this.sustain || 1000;
          var release = (o.release || o.r || o.R || this.release || 0) / 1000;
          var duration = o.duration / 1000;

          // which harmonic are we targeting?
          var targetHarmonic = o.targetHarmonic || 'all';

          if(typeof targetHarmonic === 'number'
             && targetHarmonic >= 0 && targetHarmonic < this._numberOfHarmonics) {
                  executeADSR(this.harmonics[targetOscillator]);
          } else if (targetHarmonic === 'all') {
              this.harmonics.forEach(function(harmonic) {
                  executeADSR(harmonic);
              });
          } else {
              console.log('AdditiveSynthVoice.playADSR: invalid oscillator target');
          }

          // applies the envelope to the selected generatorNode
          function executeADSR(harmonic) {

              // attack
              harmonic.output.gain.setValueAtTime(harmonic.output.gain.value, startTime);
              harmonic.output.gain.linearRampToValueAtTime(1, startTime + attack);

              // decay, sustain
              harmonic.output.gain.linearRampToValueAtTime(sustain, startTime + attack + decay);

              // release if a duration is supplied, otherwise remain in sustain
              if(duration) {
                  harmonic.output.gain.setValueAtTime(sustain, (startTime + duration) - release);
                  harmonic.output.gain.linearRampToValueAtTime(0, startTime + duration);
              }
          }
      }

      releaseADSR (o) {
          o = o || {};

          var startTime = audioCtx.currentTime;

          var release = (o.release || o.r || o.R || 0) / 1000;

          var targetHarmonic = o.targetHarmonic || 'all';

          if(typeof targetHarmonic === 'number'
             && targetHarmonic >= 0 && targetHarmonic < this._numberOfHarmonics) {
                  executeRelease(this.harmonics[targetOscillator]);
          } else if (targetHarmonic === 'all') {
              this.harmonics.forEach(function(harmonic) {
                  executeRelease(harmonic);
              });
          } else {
              console.log('AdditiveSynthVoice.playADSR: invalid oscillator target');
          }

          function executeRelease(harmonic) {

              // the first line prevents clicks that result from the discrepancy of the two clocks
              harmonic.output.gain.setValueAtTime(harmonic.output.gain.value, startTime);
              harmonic.output.gain.cancelScheduledValues(startTime + release);
              harmonic.output.gain.linearRampToValueAtTime(0, startTime + release);
          }
      }
    } /* --- end AdditiveSynthVoice class definition --- */


    return AdditiveSynthVoice;
});
