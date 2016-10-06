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
        'StereoFeedbackDelay'],
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
          StereoFeedbackDelay) {
  'use strict';

  var app = function () {
    const audioCtx = new AudioContext();

    // main synth ctrl containers
    const poly_mode_dropMenu_wrap = document.querySelector('#additor .synth-ctrl .poly-mode-menu');
    const numVoices_input = document.querySelector('#additor .synth-ctrl #number-of-voices');
    const numOvertones_input = document.querySelector('#additor .synth-ctrl #number-of-overtones');

    // overtone ctrl containers
    const ot_formula_preset_dropMenu_wrap = document.querySelector('#additor .ot-preset-ctrl .dropMenu');
    const overtoneHisto_wrap = document.querySelector('#additor .ot-ctrl .otHisto');

    // envelope ctrl containers
    const attackEnv_wrap = document.querySelector('#additor .env-ctrl .aEnv');
    const sustainEnv_wrap = document.querySelector('#additor .env-ctrl .sEnv');
    const releaseEnv_wrap = document.querySelector('#additor .env-ctrl .rEnv');
    const ot_select_dropMenu_wrap = document.querySelector('#additor .env-ctrl #ot-select-dropMenu');
    const otEnv_copyBtn = document.querySelector('#additor .env-ctrl .copy-env-btn');
    const otEnv_pasteBtn = document.querySelector('#additor .env-ctrl .paste-env-btn');

    // filter ctrl containers
    const filter_type_dropMenu_wrap = document.querySelector('#additor .filter-ctrl .type-ctrl .dropMenu');
    const filter_freq_dial_wrap = document.querySelector('#additor .filter-ctrl .freq-ctrl .dial');
    const filter_q_dial_wrap = document.querySelector('#additor .filter-ctrl .q-ctrl .dial');
    const filter_gain_dial_wrap = document.querySelector('#additor .filter-ctrl .gain-ctrl .dial');

    // delay ctrl containers
    const delay_delayTimeL_dial_wrap = document.querySelector('#additor .delay-ctrl .L .delayTime-ctrl .dial');
    const delay_delayTimeR_dial_wrap = document.querySelector('#additor .delay-ctrl .R .delayTime-ctrl .dial');
    const delay_feedbackL_dial_wrap = document.querySelector('#additor .delay-ctrl .L .feedback-ctrl .dial');
    const delay_feedbackR_dial_wrap = document.querySelector('#additor .delay-ctrl .R .feedback-ctrl .dial');
    const delay_dryMixL_dial_wrap = document.querySelector('#additor .delay-ctrl .L .dryMix-ctrl .dial');
    const delay_dryMixR_dial_wrap = document.querySelector('#additor .delay-ctrl .R .dryMix-ctrl .dial');
    const delay_wetMixL_dial_wrap = document.querySelector('#additor .delay-ctrl .L .wetMix-ctrl .dial');
    const delay_wetMixR_dial_wrap = document.querySelector('#additor .delay-ctrl .R .wetMix-ctrl .dial');

    // output ctrl containers
    const mainVolumeSlider_wrap = document.querySelector('#additor .main-output-ctrl .volume-ctrl .slider');
    const mainOutputMeterL_wrap = document.querySelector('#additor .main-output-ctrl .volume-ctrl .meter:nth-child(1)');
    const mainOutputMeterR_wrap = document.querySelector('#additor .main-output-ctrl .volume-ctrl .meter:nth-child(2)');
    const mainOutputPanDial_wrap = document.querySelector('#additor .main-output-ctrl .pan-ctrl .dial');
    const mainOutputPanValueDisplay_wrap = document.querySelector('#additor .main-output-ctrl .pan-ctrl .value-display');

    // keyboard ctrl containers
    const kbd_wrap = document.querySelector('#additor .kbd-ctrl .kbd');

    /* ------------------- */
    /* --- Audio nodes --- */
    /* ------------------- */

    const outputChannelStrip = new ChannelStrip({
      audioCtx: audioCtx
    });
    outputChannelStrip.connect(audioCtx.destination);

    const delay = new StereoFeedbackDelay({
      audioCtx: audioCtx
    });
    delay.connect(outputChannelStrip.input);

    const filter = audioCtx.createBiquadFilter();
    filter.connect(delay.input);

    const additorSynth = new AdditiveSynth({
      audioCtx: audioCtx,
      numVoices: numVoices_input.value,
      numOvertones: numOvertones_input.value
    });
    additorSynth.connect(filter);

    /* --------------------------- */
    /* --- Main synth controls --- */
    /* --------------------------- */

    const polyModeDropMenu = new LiveDropMenu({
      container: poly_mode_dropMenu_wrap,
      menuItems: ['monophonic', 'polyphonic']
    });
    polyModeDropMenu.subscribe(this, (selectionIndex) => {
      if (selectionIndex === 0) {
        additorKbd.mode = 'monophonic';
        additorSynth.numberOfVoices = 1;
      } else {
        additorKbd.mode = 'polyphonic';
        additorSynth.numberOfVoices = numVoices;
      }
    });

    numVoices_input.addEventListener('blur', changeNumVoices);
    numVoices_input.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') {
        changeNumVoices();
      }
    });
    function changeNumVoices () {
      additorSynth.numVoices = numVoices_input.value;
    }

    numOvertones_input.addEventListener('blur', changeNumOvertones);
    numOvertones_input.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') {
        changeNumOvertones();
      }
    });
    function changeNumOvertones () {
      additorSynth.numOvertones = numOvertones_input.value;
      additorOvertoneHisto.numBins = numOvertones_input.value;
    }

    /* ----------------------- */
    /* --- Filter controls --- */
    /* ----------------------- */

    // filter type menu
    const filterTypeDropMenu = new LiveDropMenu({
      container: filter_type_dropMenu_wrap,
      menuItems: ['lowpass', 'highpass', 'bandpass', 'lowshelf', 'highshelf', 'peaking', 'notch', 'allpass']
      })
      .subscribe(this, (selection) => {
        filter.type = filterTypeDropMenu.menuItems[selection];
    });

    // filter frequency dial
    const filterFreqDial = new LiveDial({
      container: filter_freq_dial_wrap,
      minValue: 0,
      maxValue: 1000
      })
      .subscribe(this, (freqDialVal) => {
        filter.frequency.value = (freqDialVal / 1000) * 20000;
    });

    // filter Q dial
    const filterQDial = new LiveDial({
      container: filter_q_dial_wrap,
      minValue: 0,
      maxValue: 100
      })
      .subscribe(this, (qDialVal) => {
        filter.Q.value = (qDialVal / 100) * 50;
    });

    // filter gain
    const filterGainDial = new LiveDial({
      container: filter_gain_dial_wrap,
      minValue: 0,
      maxValue: 100
      })
      .subscribe(this, (gainDialVal) => {
        filter.gain.value = gainDialVal / 100;
    });

    /* ---------------------- */
    /* --- Delay controls --- */
    /* ---------------------- */

    const delayTimeLDial = new LiveDial({
      container: delay_delayTimeL_dial_wrap,
      minValue: 0,
      maxValue: 100
      })
      .subscribe(this, (delayTime) => {
        delay.delayTimeL = delayTime / 100;
    });

    const delayTimeRDial = new LiveDial({
      container: delay_delayTimeR_dial_wrap,
      minValue: 0,
      maxValue: 100
      })
      .subscribe(this, (delayTime) => {
        delay.delayTimeR = delayTime / 100;
    });

    const delayFeedbackLDial = new LiveDial({
      container: delay_feedbackL_dial_wrap,
      minValue: 0,
      maxValue: 100
      })
      .subscribe(this, (fdbk) => {
        delay.feedbackL = fdbk / 100;
    });

    const delayFeedbackRDial = new LiveDial({
      container: delay_feedbackR_dial_wrap,
      minValue: 0,
      maxValue: 100
      })
      .subscribe(this, (fdbk) => {
        delay.feedbackR = fdbk / 100;
    });

    const delayDryMixLDial = new LiveDial({
      container: delay_dryMixL_dial_wrap,
      minValue: 0,
      maxValue: 100
      })
      .subscribe(this, (gain) => {
        delay.dryGainL = gain / 100;
    });

    const delayDryMixRDial = new LiveDial({
      container: delay_dryMixR_dial_wrap,
      minValue: 0,
      maxValue: 100
      })
      .subscribe(this, (gain) => {
        delay.dryGainR = gain / 100;
    });

    const delayWetMixLDial = new LiveDial({
      container: delay_wetMixL_dial_wrap,
      minValue: 0,
      maxValue: 100
      })
      .subscribe(this, (gain) => {
        delay.wetGainL = gain / 100;
    });

    const delayWetMixRDial = new LiveDial({
      container: delay_wetMixR_dial_wrap,
      minValue: 0,
      maxValue: 100
      })
      .subscribe(this, (gain) => {
        delay.wetGainR = gain / 100;
    });

    /* ------------------------- */
    /* --- Keyboard controls --- */
    /* ------------------------- */

    const additorKbd = new LiveKeyboard({
      container: kbd_wrap,
      bottomNote: 12,
      topNote: 72,
      mode: 'polyphonic',
      blackKeyColor: '#242424'
      })
      .subscribe(this, (kbdNoteEvent) => {
        var pitch = kbdNoteEvent.pitch;
        var vel = kbdNoteEvent.velocity;

        if(vel === 0) {
          additorSynth.releaseNote(pitch);
        } else {
          additorSynth.playNote(pitch);
        }
    });

    /* ------------------------- */
    /* --- Overtone controls --- */
    /* ------------------------- */

    const otFormulaPresetDropMenu = new LiveDropMenu({
      container: ot_formula_preset_dropMenu_wrap,
      menuItems: ['saw', 'square']
      })
      .subscribe(selectionIndex => {
    });

    const additorOvertoneHisto = new Histogram({
      container: overtoneHisto_wrap,
      numBins: additorSynth.numOvertones,
      minValue: 0,
      maxValue: 1,
      backgroundColor: '#111',
      barColor: '#f00'
      })
      .subscribe(this, (overtoneAmplitudes) => {
        for(var voiceNum = additorSynth.numVoices - 1; voiceNum >= 0; voiceNum--) {
          overtoneAmplitudes.forEach((amplitude, overtoneNum) => {
            additorSynth.setOvertoneAmplitude(voiceNum, overtoneNum, amplitude);
          });
        }
    });

    /* ------------------------- */
    /* --- Envelope controls --- */
    /* ------------------------- */

    const envOvertoneSelectMenu = new LiveDropMenu({
      container: ot_select_dropMenu_wrap,
      menuItemFontSize: '6px',
      menuItems: (function(){
        let overtones = ['main envelope'];
        for(let i = 0; i < additorSynth.numOvertones; i++){
          overtones.push('overtone ' + i);
        }
        return overtones;
      }())
    });

    const envSharedProperties = {
      backgroundColor: 'hsla(0, 0%, 0%, 0)',
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

    // set up the main envelope
    const attackEnvelope = new EnvelopeGraph(Object.assign({
      container: attackEnv_wrap,
      fixedEndPointY: 1
    }, envSharedProperties))
    .subscribe(this, (env) => {
      // get the attack, sustain, and release end points to match
      sustainEnvelope.fixedStartPointY = env[env.length-1][1];
      sustainEnvelope.fixedEndPointY = env[env.length-1][1];
      releaseEnvelope.fixedStartPointY = env[env.length-1][1];

      additorSynth.attackEnvelope = env;
    });

    const sustainEnvelope = new EnvelopeGraph(Object.assign({
      container: sustainEnv_wrap,
      fixedStartPointY: 1,
      fixedEndPointY: 1,
      maxNumVertices: 2
    }, envSharedProperties))
    .subscribe(this, (env) => {
      // get the attack, sustain, and release end points to match
      attackEnvelope.fixedEndPointY = env[0][1];
      releaseEnvelope.fixedStartPointY = env[1][1];
    });

    const releaseEnvelope = new EnvelopeGraph(Object.assign({
      container: releaseEnv_wrap,
      fixedStartPointY: 1
    }, envSharedProperties))
    .subscribe(this, (env) => {
      // get the attack, sustain, and release end points to match
      sustainEnvelope.fixedStartPointY = env[0][1];
      sustainEnvelope.fixedEndPointY = env[0][1];
      attackEnvelope.fixedEndPointY = env[0][1];
      releaseEnvelope.fixedEndPointY = 0;

      additorSynth.releaseEnvelope = env;
    });

    // set up the overtone envelopes
    let overtoneEnvelopes = [];
    let selectedOtIndex = 0;
    let clipboardOtEnvelope = {
      attackEnvelope: {
        vertices: []
      },
      sustainEnvelope: {
        vertices: []
      },
      releaseEnvelope: {
        vertices: []
      }
    };

    // initialize envelope graphs for each overtone
    for(let i = 0; i < additorSynth.numOvertones; i++) {
      let otEnv = {};

      otEnv.attackEnvelope = new EnvelopeGraph({
          container: attackEnv_wrap,
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
      });
      otEnv.sustainEnvelope = new EnvelopeGraph({
          container: sustainEnv_wrap,
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
      });
      otEnv.releaseEnvelope = new EnvelopeGraph({
          container: releaseEnv_wrap,
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
      });

      // when the envelope changes for each overtone
      otEnv.attackEnvelope.subscribe(this, (env) => {
        // ensure the fixed start and end points are all in the right place
        otEnv.attackEnvelope.fixedEndPointY = env[env.length-2][1];
        otEnv.sustainEnvelope.fixedStartPointY = otEnv.attackEnvelope.fixedEndPointY;
        otEnv.sustainEnvelope.fixedEndPointY = otEnv.sustainEnvelope.fixedStartPointY;
        otEnv.releaseEnvelope.fixedStartPointY = otEnv.sustainEnvelope.fixedEndPointY;

        additorSynth.setOvertoneAttackEnvelope(i, env);
      });
      otEnv.sustainEnvelope.subscribe(this, (env) => {
        // ensure the fixed start and end points are all in the right place
        otEnv.sustainEnvelope.fixedStartPointY = env[0][1];
        otEnv.sustainEnvelope.fixedEndPointY = otEnv.sustainEnvelope.fixedStartPointY;
        otEnv.attackEnvelope.fixedEndPointY = otEnv.sustainEnvelope.fixedStartPointY;
        otEnv.releaseEnvelope.fixedStartPointY = otEnv.sustainEnvelope.fixedEndPointY;
      });
      otEnv.releaseEnvelope.subscribe(this, (env) => {
        // ensure the fixed start and end points are all in the right place
        otEnv.releaseEnvelope.fixedStartPointY = env[1][1];
        otEnv.sustainEnvelope.fixedEndPointY = otEnv.releaseEnvelope.fixedStartPointY;
        otEnv.sustainEnvelope.fixedStartPointY = otEnv.sustainEnvelope.fixedEndPointY;
        otEnv.attackEnvelope.fixedEndPointY = otEnv.sustainEnvelope.fixedStartPointY;

        additorSynth.setOvertoneReleaseEnvelope(i, env);
      });

      overtoneEnvelopes[i] = otEnv;
    }

    // select an overtone envelope to edit
    envOvertoneSelectMenu.subscribe(this, (menuIndex) => {
      selectedOtIndex = menuIndex;

      overtoneEnvelopes.forEach((otEnv, otIndex) => {
        // decide whether they are editable
        otEnv.attackEnvelope.isEditable = (otIndex === menuIndex) ? true : false;
        otEnv.sustainEnvelope.isEditable = (otIndex === menuIndex) ? true : false;
        otEnv.releaseEnvelope.isEditable = (otIndex === menuIndex) ? true : false;

        // change line and vertex colors
        otEnv.attackEnvelope.lineColor = (otIndex === menuIndex)
                                         ? 'hsla(' + (otIndex * 23)%360 + ', 50%, 50%, 1)'    // selected for editing
                                         : 'hsla(' + (otIndex * 23)%360 + ', 50%, 50%, 0.15)'; // inactive
        otEnv.attackEnvelope.vertexColor = (otIndex === menuIndex)
                                         ? '#0f0'                                             // selected for editing
                                         : 'hsla(' + (otIndex * 23)%360 + ', 50%, 50%, 0.15)'; // incative
        otEnv.sustainEnvelope.lineColor = (otIndex === menuIndex)
                                          ? 'hsla(' + (otIndex * 23)%360 + ', 50%, 50%, 1)'   // selected for editing
                                          : 'hsla(' + (otIndex * 23)%360 + ', 50%, 50%, 0.15)';// inactive
        otEnv.sustainEnvelope.vertexColor = (otIndex === menuIndex)
                                         ? '#0f0'                                             // selected for editing
                                         : 'hsla(' + (otIndex * 23)%360 + ', 50%, 50%, 0.15)'; // inactive
        otEnv.releaseEnvelope.lineColor = (otIndex === menuIndex)
                                          ? 'hsla(' + (otIndex * 23)%360 + ', 50%, 50%, 1)'   // selected for editing
                                          : 'hsla(' + (otIndex * 23)%360 + ', 50%, 50%, 0.15)';// inactive
        otEnv.releaseEnvelope.vertexColor = (otIndex === menuIndex)
                                         ? '#0f0'                                             // selected for editing
                                         : 'hsla(' + (otIndex * 23)%360 + ', 50%, 50%, 0.15)'; // inactive

        otEnv.attackEnvelope.redraw();
        otEnv.sustainEnvelope.redraw();
        otEnv.releaseEnvelope.redraw();
      });
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

    // initial values for envelope controls
    envOvertoneSelectMenu.value = 0;

    /* ---------------------------- */
    /* --- Main output controls --- */
    /* ---------------------------- */

    // pan dial
    const additorMainOutputPanDial = new LiveDial({
      container: mainOutputPanDial_wrap,
      minValue: -100,
      maxValue: 100
    })
    .subscribe(this, (pan) => {
      mainOutputPanValueDisplay_wrap.value = pan / 100;
      outputChannelStrip.pan = pan / 100;
    });

    // volume slider
    const additorMainVolumeSlider = new LiveSlider({
      container: mainVolumeSlider_wrap,
      minValue: 0,
      maxValue: 127
    })
    .subscribe(this, (volume) => {
      outputChannelStrip.outputGain = volume / 100;
    });

    // output meter
    const additorMainOutputMeterL = new LiveMeter({
      audioCtx: audioCtx,
      container: mainOutputMeterL_wrap
    });
    const additorMainOutputMeterR = new LiveMeter({
      audioCtx: audioCtx,
      container: mainOutputMeterR_wrap
    });
    const preOutputMeterChannelSplitter = audioCtx.createChannelSplitter(2);
    outputChannelStrip.connect(preOutputMeterChannelSplitter);
    preOutputMeterChannelSplitter.connect(additorMainOutputMeterL.input, 0);
    preOutputMeterChannelSplitter.connect(additorMainOutputMeterR.input, 1);
  }

  return app;
});
