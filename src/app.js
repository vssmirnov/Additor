  define(['require',
        'Overtone',
        'Envelope',
        'ChannelStrip',
        'AdditiveSynthVoice',
        'AdditiveSynth',
        'util',
        'LiveKeyboard',
        'EnvelopeGraph',
        'LiveDial',
        'LiveSlider',
        'Histogram',
        'LiveMeter',
        'LiveDropMenu',
        'StereoFeedbackDelay',
        'DragNumberbox'],
function(require,
          Overtone,
          Envelope,
          ChannelStrip,
          AdditiveSynthVoice,
          AdditiveSynth,
          util,
          LiveKeyboard,
          EnvelopeGraph,
          LiveDial,
          LiveSlider,
          Histogram,
          LiveMeter,
          LiveDropMenu,
          StereoFeedbackDelay,
          DragNumberbox) {
  'use strict';

  var app = function () {

    // controllers
    const adt = {};
    adt.synth = {};   // additive synth controller
    adt.ot = {};      // overtone controller
    adt.env = {};     // envelope controller
    adt.filter = {};  // filter controller
    adt.delay = {};   // delay controller
    adt.output = {};  // output controller
    adt.voices = {}   // voices controller

    // envelope ctrl containers
    const otEnv_copyBtn = document.querySelector('#additor .env-ctrl .copy-env-btn');
    const otEnv_pasteBtn = document.querySelector('#additor .env-ctrl .paste-env-btn');

    /* ------------------- */
    /* --- Audio nodes --- */
    /* ------------------- */
    /* create the audio nodes and connect them within the audio context graph */
    /* .node means the object lives in the audio context graph */

    const audioCtx = new AudioContext();

    adt.output.node = new ChannelStrip({ audioCtx: audioCtx });
    adt.output.node.connect(audioCtx.destination);

    adt.delay.node = new StereoFeedbackDelay({
      audioCtx: audioCtx,
      maxDelayTime: 10
    });
    adt.delay.node.connect(adt.output.node.input);

    adt.filter.node = audioCtx.createBiquadFilter();
    adt.filter.node.connect(adt.delay.node.input);

    adt.synth.node = new AdditiveSynth({
      audioCtx: audioCtx,
      numVoices: 8,
      numOvertones: 40
    });
    adt.synth.node.connect(adt.filter.node);

    /* --------------------------- */
    /* --- Overtone controller --- */
    /* --------------------------- */
    /* the overtone controller (ot) controls the amplitudes of the synth's overtones */

    adt.ot.histo = new Histogram({
      container: document.querySelector('#additor .ot-ctrl .otHisto'),
      numBins: adt.synth.node.numOvertones,
      minValue: 0,
      maxValue: 1,
      backgroundColor: '#111',
      barColor: '#f00'
      })
      .subscribe(this, (overtoneAmplitudes) => {
        for(let voiceNum = adt.synth.node.numVoices - 1; voiceNum >= 0; voiceNum--) {
          overtoneAmplitudes.forEach((amplitude, overtoneNum) => {
            adt.synth.node.setOvertoneAmplitude(voiceNum, overtoneNum, amplitude);
          });
        }
    });

    // initialize to modified sawtooth wave
    for(let n = adt.synth.node.numOvertones - 1; n >= 0; n--) {
      let otAmp = (n % 2 === 0) ? 1 / ((n + 1) / 2.2) : 1 / (n + 1);

      adt.ot.histo.setBinVal(n, otAmp);

      for(let voiceNum = adt.synth.node.numVoices - 1; voiceNum >= 0; voiceNum--) {
        adt.synth.node.setOvertoneAmplitude(voiceNum, n, otAmp);
      }
    }

    /* ------------------------- */
    /* --- Envelope controls --- */
    /* ------------------------- */

    // main envelope graphs
    adt.env.main = {
      attackGraph: {},
      sustainGraph: {},
      releaseGraph: {}
    }

    // overtone envelope graphs
    adt.env.ot = [];

    adt.env.selectedOtIndex = 0;

    // envelope currently saved to the clipboard
    adt.env.clipboardEnv = {
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
    const envSharedProperties = {
      backgroundColor: 'hsla(0, 0%, 0%, 0)', // transparent background
      vertexColor: '#0f0',
      lineColor: '#f00',
      hasFixedStartPoint: true,
      hasFixedEndPoint: true,
      minXValue: 0,
      maxXValue: 1,
      quantizeX: 0.01,
      minYValue: 0,
      maxYValue: 1,
      quantizeY: 0.01
    }

    adt.env.main.attackGraph = new EnvelopeGraph(Object.assign({}, envSharedProperties, {
          container: document.querySelector('#additor .env-ctrl .aEnv'),
          fixedEndPointY: 1
      }))
      .subscribe(this, (env) => {
        // get the attack, sustain, and release end points to match
        adt.env.main.sustainGraph.fixedStartPointY = env[env.length-1][1];
        adt.env.main.sustainGraph.fixedEndPointY = env[env.length-1][1];
        adt.env.main.releaseGraph.fixedStartPointY = env[env.length-1][1];
        adt.synth.node.attackEnvelope = env;
    });

    adt.env.main.sustainGraph = new EnvelopeGraph(Object.assign({}, envSharedProperties, {
          container: document.querySelector('#additor .env-ctrl .sEnv'),
          fixedStartPointY: 1,
          fixedEndPointY: 1,
          maxNumVertices: 2
      }))
      .subscribe(this, (env) => {
        // get the attack, sustain, and release end points to match
        adt.env.main.attackGraph.fixedEndPointY = env[0][1];
        adt.env.main.releaseGraph.fixedStartPointY = env[1][1];
    });

    adt.env.main.releaseGraph = new EnvelopeGraph(Object.assign({}, envSharedProperties, {
          container: document.querySelector('#additor .env-ctrl .rEnv'),
          fixedStartPointY: 1
      }))
      .subscribe(this, (env) => {
        // get the attack, sustain, and release end points to match
        adt.env.main.sustainGraph.fixedStartPointY = env[0][1];
        adt.env.main.sustainGraph.fixedEndPointY = env[0][1];
        adt.env.main.attackGraph.fixedEndPointY = env[0][1];
        adt.env.main.releaseGraph.fixedEndPointY = 0;
        adt.synth.node.releaseEnvelope = env;
    });

    // initialize envelope graphs for each overtone
    for(let i = 0; i < adt.synth.node.numOvertones; i++) {
      let otEnv = {};

      otEnv.attackGraph = new EnvelopeGraph({
          container: document.querySelector('#additor .env-ctrl .aEnv'),
          backgroundColor: 'hsla(0, 0%, 0%, 0)',
          lineColor: 'hsla(' + (i * 91)%360 + ', 50%, 50%, 0)',
          vertexColor: 'hsla(' + (i * 91)%360 + ', 50%, 50%, 0)',
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
          })
          .subscribe(this, (env) => {
            // ensure the fixed start and end points are all in the right place
            otEnv.attackGraph.fixedEndPointY = env[env.length-2][1];
            otEnv.sustainGraph.fixedStartPointY = otEnv.attackGraph.fixedEndPointY;
            otEnv.sustainGraph.fixedEndPointY = otEnv.sustainGraph.fixedStartPointY;
            otEnv.releaseGraph.fixedStartPointY = otEnv.sustainGraph.fixedEndPointY;
            adt.synth.node.setOvertoneAttackEnvelope(i, env);
      });
      otEnv.sustainGraph = new EnvelopeGraph({
          container: document.querySelector('#additor .env-ctrl .sEnv'),
          backgroundColor: 'hsla(0, 0%, 0%, 0)',
          lineColor: 'hsla(' + (i * 91)%360 + ', 50%, 50%, 0)',
          vertexColor: 'hsla(' + (i * 91)%360 + ', 50%, 50%, 0)',
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
          quantizeY: 0.01,
          })
          .subscribe(this, (env) => {
            // ensure the fixed start and end points are all in the right place
            otEnv.sustainGraph.fixedStartPointY = env[0][1];
            otEnv.sustainGraph.fixedEndPointY = otEnv.sustainGraph.fixedStartPointY;
            otEnv.attackGraph.fixedEndPointY = otEnv.sustainGraph.fixedStartPointY;
            otEnv.releaseGraph.fixedStartPointY = otEnv.sustainGraph.fixedEndPointY;
      });
      otEnv.releaseGraph = new EnvelopeGraph({
          container: document.querySelector('#additor .env-ctrl .rEnv'),
          backgroundColor: 'hsla(0, 0%, 0%, 0)',
          lineColor: 'hsla(' + (i * 91)%360 + ', 50%, 50%, 0)',
          vertexColor: 'hsla(' + (i * 91)%360 + ', 50%, 50%, 0)',
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
          })
          .subscribe(this, (env) => {
            // ensure the fixed start and end points are all in the right place
            otEnv.releaseGraph.fixedStartPointY = env[1][1];
            otEnv.sustainGraph.fixedEndPointY = otEnv.releaseGraph.fixedStartPointY;
            otEnv.sustainGraph.fixedStartPointY = otEnv.sustainGraph.fixedEndPointY;
            otEnv.attackGraph.fixedEndPointY = otEnv.sustainGraph.fixedStartPointY;
            additorSynth.setOvertoneReleaseEnvelope(i, env);
      });

      adt.env.ot[i] = otEnv;
    }

    // dropMenu - select which envelope to edit
    adt.env.graphSelectMenu = new LiveDropMenu({
      container: document.querySelector('#additor .env-ctrl #ot-select-dropMenu'),
      menuItemFontSize: '6px',
      menuItems: (function(){
          let overtones = ['main envelope'];
          for(let i = 0; i < adt.synth.node.numOvertones; i++){
            overtones.push('overtone ' + i);
          }
          return overtones;
        }())
      })
      .subscribe(this, (menuIndex) => {

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
          adt.env.ot.forEach((otEnv, otIndex) => {
            otEnv.attackGraph.isEditable = false;
            otEnv.sustainGraph.isEditable = false;
            otEnv.releaseGraph.isEditable = false;

            otEnv.attackGraph.lineColor = 'hsla(' + (otIndex * 23)%360 + ', 50%, 50%, 0.15)';
            otEnv.attackGraph.vertexColor = 'hsla(' + (otIndex * 23)%360 + ', 50%, 50%, 0.15)';
            otEnv.sustainGraph.lineColor = 'hsla(' + (otIndex * 23)%360 + ', 50%, 50%, 0.15)';
            otEnv.sustainGraph.vertexColor = 'hsla(' + (otIndex * 23)%360 + ', 50%, 50%, 0.15)';
            otEnv.releaseGraph.lineColor = 'hsla(' + (otIndex * 23)%360 + ', 50%, 50%, 0.15)';
            otEnv.releaseGraph.vertexColor = 'hsla(' + (otIndex * 23)%360 + ', 50%, 50%, 0.15)';

            otEnv.attackGraph.redraw();
            otEnv.sustainGraph.redraw();
            otEnv.releaseGraph.redraw();
          });
        } else {
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

          adt.env.ot.forEach((otEnv, otIndex) => {
            // decide whether they are editable
            otEnv.attackGraph.isEditable = (otIndex === adt.env.selectedOtIndex) ? true : false;
            otEnv.sustainGraph.isEditable = (otIndex === adt.env.selectedOtIndex) ? true : false;
            otEnv.releaseGraph.isEditable = (otIndex === adt.env.selectedOtIndex) ? true : false;

            // change line and vertex colors
            otEnv.attackGraph.lineColor = (otIndex === menuIndex)
                                             ? 'hsla(' + (otIndex * 23)%360 + ', 50%, 50%, 1)'    // selected for editing
                                             : 'hsla(' + (otIndex * 23)%360 + ', 50%, 50%, 0.15)'; // inactive
            otEnv.attackGraph.vertexColor = (otIndex === menuIndex)
                                             ? '#0f0'                                             // selected for editing
                                             : 'hsla(' + (otIndex * 23)%360 + ', 50%, 50%, 0.15)'; // incative
            otEnv.sustainGraph.lineColor = (otIndex === menuIndex)
                                              ? 'hsla(' + (otIndex * 23)%360 + ', 50%, 50%, 1)'   // selected for editing
                                              : 'hsla(' + (otIndex * 23)%360 + ', 50%, 50%, 0.15)';// inactive
            otEnv.sustainGraph.vertexColor = (otIndex === menuIndex)
                                             ? '#0f0'                                             // selected for editing
                                             : 'hsla(' + (otIndex * 23)%360 + ', 50%, 50%, 0.15)'; // inactive
            otEnv.releaseGraph.lineColor = (otIndex === menuIndex)
                                              ? 'hsla(' + (otIndex * 23)%360 + ', 50%, 50%, 1)'   // selected for editing
                                              : 'hsla(' + (otIndex * 23)%360 + ', 50%, 50%, 0.15)';// inactive
            otEnv.releaseGraph.vertexColor = (otIndex === menuIndex)
                                             ? '#0f0'                                             // selected for editing
                                             : 'hsla(' + (otIndex * 23)%360 + ', 50%, 50%, 0.15)'; // inactive

            otEnv.attackGraph.redraw();
            otEnv.sustainGraph.redraw();
            otEnv.releaseGraph.redraw();
          });
        }
    });

    // copy/paste ot envelopes
    otEnv_copyBtn.addEventListener('mousedown', () => {
      clipboardOtEnvelope.attackEnvelope.vertices = overtoneEnvelopes[selectedOtIndex].attackEnvelope.vertices.map(vertex => { return vertex.slice(); });
      clipboardOtEnvelope.sustainEnvelope.vertices = overtoneEnvelopes[selectedOtIndex].sustainEnvelope.vertices.map(vertex => { return vertex.slice(); });
      clipboardOtEnvelope.releaseEnvelope.vertices = overtoneEnvelopes[selectedOtIndex].releaseEnvelope.vertices.map(vertex => { return vertex.slice(); });
    });
    otEnv_pasteBtn.addEventListener('mousedown', () => {
      overtoneEnvelopes[selectedOtIndex].releaseEnvelope.vertices = clipboardOtEnvelope.releaseEnvelope.vertices.map(vertex => { return vertex.slice(); });
      overtoneEnvelopes[selectedOtIndex].attackEnvelope.vertices = clipboardOtEnvelope.attackEnvelope.vertices.map(vertex => { return vertex.slice(); });
      overtoneEnvelopes[selectedOtIndex].sustainEnvelope.vertices = clipboardOtEnvelope.sustainEnvelope.vertices.map(vertex => { return vertex.slice(); });
    });

    // envelope length number boxes
    adt.env.attackLengthNumbox = new DragNumberbox({
        container: document.querySelector('#additor .env-ctrl .attack .numBox'),
        minValue: 0,
        maxValue: 10000,
        appendString: ' ms',
        value: 1000
      })
      .subscribe(this, (attackLengthNumboxVal) => {
    });

    adt.env.releaseLengthNumbox = new DragNumberbox({
      container: document.querySelector('#additor .env-ctrl .release .numBox'),
      minValue: 0,
      maxValue: 10000,
      appendString: ' ms',
      value: 1000
    });

    // initial values for envelope controls
    adt.env.graphSelectMenu.value = 0;

    /* ----------------------- */
    /* --- Filter controls --- */
    /* ----------------------- */

    // filter type menu
    adt.filter.typeDropMenu = new LiveDropMenu({
        container: document.querySelector('#additor .filter-ctrl .type-ctrl .dropMenu'),
        menuItems: ['lowpass', 'highpass', 'bandpass', 'lowshelf', 'highshelf', 'peaking', 'notch', 'allpass']
      })
      .subscribe(this, (selection) => {
        adt.filter.node.type = adt.filter.typeDropMenu.menuItems[selection];
    });

    // filter frequency dial
    adt.filter.freqDial = new LiveDial({
      container: document.querySelector('#additor .filter-ctrl .freq-ctrl .dial'),
      minValue: 0,
      maxValue: 20000
      })
      .subscribe(this, (freqDialVal) => {
        adt.filter.node.frequency.value = freqDialVal;
        adt.filter.freqNumbox.value = adt.filter.node.frequency.value;
    });

    // filter frequency number box
    adt.filter.freqNumbox = new DragNumberbox({
        container: document.querySelector('#additor .filter-ctrl .freq-ctrl .numBox'),
        value: adt.filter.node.frequency.value,
        appendString: ' Hz',
        minValue: 0,
        maxValue: 20000
      })
      .subscribe(this, (freqNumboxVal) => {
        adt.filter.node.frequency.value = freqNumboxVal;
        adt.filter.freqDial.value = adt.filter.node.frequency.value;
    });

    // filter Q dial
    adt.filter.qDial = new LiveDial({
        container: document.querySelector('#additor .filter-ctrl .q-ctrl .dial'),
        value: adt.filter.node.Q.value,
        minValue: 0,
        maxValue: 100
      })
      .subscribe(this, (qDialVal) => {
        adt.filter.node.Q.value = qDialVal;
        adt.filter.qNumbox.value = adt.filter.node.Q.value;
    });

    // filter Q number box
    adt.filter.qNumbox = new DragNumberbox({
        container: document.querySelector('#additor .filter-ctrl .q-ctrl .numBox'),
        value: adt.filter.node.Q.value,
        minValue: 0,
        maxValue: 100
      })
      .subscribe(this, (qNumboxVal) => {
        adt.filter.node.Q.value = qNumboxVal;
        adt.filter.qDial.value = adt.filter.node.Q.value;
    });

    // filter gain dial
    adt.filter.gainDial = new LiveDial({
        container: document.querySelector('#additor .filter-ctrl .gain-ctrl .dial'),
        value: adt.filter.node.gain.value,
        minValue: 0,
        maxValue: 100
      })
      .subscribe(this, (val) => {
        adt.filter.node.gain.value = val / 100;
        adt.filter.gainNumbox.value = val;
    });

    // filter gain numberbox
    adt.filter.gainNumbox = new DragNumberbox({
        container: document.querySelector('#additor .filter-ctrl .gain-ctrl .numBox'),
        value: adt.filter.node.gain.value,
        minValue: 0,
        maxValue: 100,
        appendString: ' %'
      })
      .subscribe(this, (val) => {
        adt.filter.node.gain.value = val / 100;
        adt.filter.gainDial.value = val;
    });

    /* ---------------------- */
    /* --- Delay controls --- */
    /* ---------------------- */

    adt.delay.delayTimeLDial = new LiveDial({
        container: document.querySelector('#additor .delay-ctrl .delayTime-ctrl .L .dial'),
        value: Math.trunc(adt.delay.node.delayTimeL.value * 10),
        minValue: 0,
        maxValue: 1000
      })
      .subscribe(this, (val) => {
        adt.delay.node.delayTimeL.value = val / 100;
        adt.delay.delayTimeLNumbox.value = val * 10;
    });

    adt.delay.delayTimeLNumbox = new DragNumberbox({
        container: document.querySelector('#additor .delay-ctrl .delayTime-ctrl .L .numBox'),
        value: adt.delay.node.delayTimeL.value,
        minValue: 0,
        maxValue: 10000,
        appendString: ' ms'
      })
      .subscribe(this, (val) => {
        adt.delay.node.delayTimeL.value = val / 1000;
        adt.delay.delayTimeLDial.value = val / 10;
    });

    adt.delay.delayTimeRDial = new LiveDial({
        container: document.querySelector('#additor .delay-ctrl .delayTime-ctrl .R .dial'),
        value: adt.delay.node.delayTimeR.value,
        minValue: 0,
        maxValue: 1000
      })
      .subscribe(this, (val) => {
        adt.delay.node.delayTimeR.value = val / 100;
        adt.delay.delayTimeRNumbox.value = val * 10;
    });

    adt.delay.delayTimeRNumbox = new DragNumberbox({
        container: document.querySelector('#additor .delay-ctrl .delayTime-ctrl .R .numBox'),
        value: adt.delay.node.delayTimeR.value,
        minValue: 0,
        maxValue: 10000,
        appendString: ' ms'
      })
      .subscribe(this, (val) => {
        adt.delay.node.delayTimeR.value = val / 1000;
        adt.delay.delayTimeRDial.value = val / 10;
    });

    adt.delay.feedbackLDial = new LiveDial({
        container: document.querySelector('#additor .delay-ctrl .feedback-ctrl .L .dial'),
        value: Math.trunc(adt.delay.node.feedbackL.value * 100),
        minValue: 0,
        maxValue: 100
      })
      .subscribe(this, (val) => {
        adt.delay.node.feedbackL.value = val / 100;
        adt.delay.feedbackLNumbox.value = val;
    });

    adt.delay.feedbackLNumbox = new DragNumberbox({
        container: document.querySelector('#additor .delay-ctrl .feedback-ctrl .L .numBox'),
        value: Math.trunc(adt.delay.node.feedbackL.value * 100),
        minValue: 0,
        maxValue: 100,
        appendString: ' %'
      })
      .subscribe(this, (val) => {
        adt.delay.node.feedbackL.value = val / 100;
        adt.delay.feedbackLDial.value = val;
    });

    adt.delay.feedbackRDial = new LiveDial({
        container: document.querySelector('#additor .delay-ctrl .feedback-ctrl .R .dial'),
        value: Math.trunc(adt.delay.node.feedbackL.value * 100),
        minValue: 0,
        maxValue: 100
      })
      .subscribe(this, (val) => {
        adt.delay.node.feedbackR.value = val / 100;
        adt.delay.feedbackRNumbox.value = val;
    });

    adt.delay.feedbackRNumbox = new DragNumberbox({
        container: document.querySelector('#additor .delay-ctrl .feedback-ctrl .R .numBox'),
        value: Math.trunc(adt.delay.node.feedbackL.value * 100),
        minValue: 0,
        maxValue: 100,
        appendString: ' %'
      })
      .subscribe(this, (val) => {
        adt.delay.node.feedbackR.value = val;
        adt.delay.feedbackRDial.value = val;
    });

    adt.delay.dryMixLDial = new LiveDial({
        container: document.querySelector('#additor .delay-ctrl .dryMix-ctrl .L .dial'),
        value: Math.trunc(adt.delay.node.dryMixL.value * 100),
        minValue: 0,
        maxValue: 100
      })
      .subscribe(this, (val) => {
        adt.delay.node.dryMixL.value = val / 100;
        adt.delay.dryMixLNumbox.value = val;
    });

    adt.delay.dryMixLNumbox = new DragNumberbox({
        container: document.querySelector('#additor .delay-ctrl .dryMix-ctrl .L .numBox'),
        value: Math.trunc(adt.delay.node.dryMixL.value * 100),
        minValue: 0,
        maxValue: 100,
        appendString: ' %'
      })
      .subscribe(this, (val) => {
        adt.delay.node.dryMixL.value = val / 100;
        adt.delay.dryMixLDial.value = val;
    });

    adt.delay.dryMixRDial = new LiveDial({
        container: document.querySelector('#additor .delay-ctrl .dryMix-ctrl .R .dial'),
        value: Math.trunc(adt.delay.node.dryMixR.value * 100),
        minValue: 0,
        maxValue: 100
      })
      .subscribe(this, (val) => {
        adt.delay.node.dryMixR.value = val / 100;
        adt.delay.dryMixRNumbox.value = val;
    });

    adt.delay.dryMixRNumbox = new DragNumberbox({
        container: document.querySelector('#additor .delay-ctrl .dryMix-ctrl .R .numBox'),
        value: Math.trunc(adt.delay.node.dryMixR.value * 100),
        minValue: 0,
        maxValue: 100,
        appendString: ' %'
      })
      .subscribe(this, (val) => {
        adt.delay.node.dryMixR.value = val / 100;
        adt.delay.dryMixRDial.value = val;
    });


    adt.delay.wetMixLDial = new LiveDial({
        container: document.querySelector('#additor .delay-ctrl .wetMix-ctrl .L .dial'),
        value: Math.trunc(adt.delay.node.wetMixL.value * 100),
        minValue: 0,
        maxValue: 100
      })
      .subscribe(this, (val) => {
        adt.delay.node.wetMixL.value = val / 100;
        adt.delay.wetMixLNumbox.value = val;
    });

    adt.delay.wetMixLNumbox = new DragNumberbox({
        container: document.querySelector('#additor .delay-ctrl .wetMix-ctrl .L .numBox'),
        value: Math.trunc(adt.delay.node.wetMixL.value * 100),
        minValue: 0,
        maxValue: 100,
        appendString: ' %'
      })
      .subscribe(this, (val) => {
        adt.delay.node.wetMixL.value = val / 100;
        adt.delay.wetMixLDial.value = val;
    });

    adt.delay.wetMixRDial = new LiveDial({
        container: document.querySelector('#additor .delay-ctrl .wetMix-ctrl .R .dial'),
        value: Math.trunc(adt.delay.node.wetMixR.value * 100),
        minValue: 0,
        maxValue: 100
      })
      .subscribe(this, (val) => {
        adt.delay.node.wetMixR.value = val / 100;
        adt.delay.wetMixRNumbox.value = val;
    });

    adt.delay.wetMixRNumbox = new DragNumberbox({
      container: document.querySelector('#additor .delay-ctrl .wetMix-ctrl .R .numBox'),
      value: Math.trunc(adt.delay.node.wetMixR.value * 100),
      minValue: 0,
      maxValue: 100,
      appendString: ' %'
      })
      .subscribe(this, (val) => {
        adt.delay.node.wetMixR.value = val / 100;
        adt.delay.wetMixRDial.value = val;
    });

    /* ---------------------------- */
    /* --- Main output controls --- */
    /* ---------------------------- */

    // pan dial
    adt.output.panDial = new LiveDial({
        container: document.querySelector('#additor .main-output-ctrl .pan-ctrl .dial'),
        value: Math.trunc(adt.output.node.pan * 100),
        minValue: -100,
        maxValue: 100
      })
      .subscribe(this, (val) => {
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
    adt.output.panNumbox = new DragNumberbox({
        container: document.querySelector('#additor .main-output-ctrl .pan-ctrl .numBox'),
        value: Math.trunc(adt.output.node.pan * 100),
        minValue: -100,
        maxValue: 100,
        appendString: ' (C)'
      })
      .subscribe(this, (val) => {
        adt.output.node.pan = val / 100;
        adt.output.panDial.value = val;
    });

    // volume slider
    adt.output.volumeSlider = new LiveSlider({
        container: document.querySelector('#additor .main-output-ctrl .volume-ctrl .slider'),
        value: adt.output.node.outputGain * 100,
        minValue: 0,
        maxValue: 127
      })
      .subscribe(this, (val) => {
        adt.output.node.outputGain = val / 100;
        adt.output.volumeNumbox.value = ((val / 100) * 24) - 24;
    });

    // volume numBox
    adt.output.volumeNumbox = new DragNumberbox({
        container: document.querySelector('#additor .main-output-ctrl .volume-ctrl .numBox'),
        value: adt.output.node.outputGain,
        minValue: -24,
        maxValue: 7,
        appendString: ' dB'
      })
      .subscribe(this, (val) => {

    });

    // output meter
    adt.output.meterL = new LiveMeter({
      audioCtx: audioCtx,
      container: document.querySelector('#additor .main-output-ctrl .volume-ctrl .meter:nth-child(1)')
    });
    adt.output.meterR = new LiveMeter({
      audioCtx: audioCtx,
      container: document.querySelector('#additor .main-output-ctrl .volume-ctrl .meter:nth-child(2)')
    });
    adt.output.splitter = audioCtx.createChannelSplitter(2);
    adt.output.node.connect(adt.output.splitter);
    adt.output.splitter.connect(adt.output.meterL.input, 0);
    adt.output.splitter.connect(adt.output.meterR.input, 1);

    /* --------------------------- */
    /* --- Main synth controls --- */
    /* --------------------------- */

    adt.voices.polyModeMenu = new LiveDropMenu({
        container: document.querySelector('#additor .synth-ctrl .poly-mode-menu'),
        menuItems: ['polyphonic', 'monophonic']
      })
      .subscribe(this, (selectionIndex) => {
        if (selectionIndex === 0) {
          adt.kbd.mode = 'polyphonic';
          adt.synth.node.numberOfVoices = 1;
        } else {
          adt.kbd.mode = 'monophonic';
          adt.synth.node.numberOfVoices = numVoices;
        }
    });

    adt.voices.numVoicesNumbox = document.querySelector('#additor .synth-ctrl #number-of-voices');
    adt.voices.numVoicesNumbox.value = adt.synth.node.numVoices;
    adt.voices.numVoicesNumbox.addEventListener('blur', changeNumVoices);
    adt.voices.numVoicesNumbox.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') {
        changeNumVoices();
      }
    });
    function changeNumVoices () {
      adt.synth.node.numVoices = adt.voices.numVoicesNumbox.value;
    }

    adt.voices.numOtNumbox = document.querySelector('#additor .synth-ctrl #number-of-overtones');
    adt.voices.numOtNumbox.value = adt.synth.node.numOvertones;
    adt.voices.numOtNumbox.addEventListener('blur', changeNumOvertones);
    adt.voices.numOtNumbox.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') {
        changeNumOvertones();
      }
    });
    function changeNumOvertones () {
      adt.synth.node.numOvertones = adt.voices.numOtNumbox.value;
      adt.synth.node.numBins = adt.voices.numOtNumbox.value;
    }

    /* ------------------------- */
    /* --- Keyboard controls --- */
    /* ------------------------- */

    adt.kbd = new LiveKeyboard({
        container: document.querySelector('#additor .kbd-ctrl .kbd'),
        bottomNote: 12,
        topNote: 72,
        mode: 'polyphonic',
        blackKeyColor: '#242424'
      })
      .subscribe(this, (kbdNoteEvent) => {
        var pitch = kbdNoteEvent.pitch;
        var vel = kbdNoteEvent.velocity;

        if(vel === 0) {
          adt.synth.node.releaseNote(pitch);
        } else {
          adt.synth.node.playNote(pitch);
        }
    });
  }


  return app;
});
