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
        'LiveDropMenu'],
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
          LiveDropMenu) {
  'use strict';

  var app = function () {
    const audioCtx = new AudioContext();

    const kbd_wrap = document.querySelector('#additor .kbd');
    const overtoneHisto_wrap = document.querySelector('#additor .otHisto');
    const envelope_wrap = document.querySelector('#additor .envelope-ctrl');
    const attackEnv_wrap = document.querySelector('#additor .envelope-ctrl .main-env-ctrl .aEnv');
    const sustainEnv_wrap = document.querySelector('#additor .envelope-ctrl .main-env-ctrl .sEnv');
    const releaseEnv_wrap = document.querySelector('#additor .envelope-ctrl .main-env-ctrl .rEnv');
    const mainVolumeSlider_wrap = document.querySelector('#additor .main-output-ctrl .volume-ctrl .slider');
    const mainOutputMeterL_wrap = document.querySelector('#additor .main-output-ctrl .volume-ctrl .meter:nth-child(1)');
    const mainOutputMeterR_wrap = document.querySelector('#additor .main-output-ctrl .volume-ctrl .meter:nth-child(2)');
    const mainOutputPanDial_wrap = document.querySelector('#additor .main-output-ctrl .pan-ctrl .dial');
    const mainOutputPanValueDisplay_wrap = document.querySelector('#additor .main-output-ctrl .pan-ctrl .value-display');

    const outputChannelStrip = new ChannelStrip({
      audioCtx: audioCtx
    });
    outputChannelStrip.connect(audioCtx.destination);

    const additorSynth = new AdditiveSynth({
      audioCtx: audioCtx,
      numVoices: 8,
      numOvertones: 5
    });
    additorSynth.connect(outputChannelStrip.input);

    const additorKbd = new LiveKeyboard({
      container: kbd_wrap,
      bottomNote: 12,
      topNote: 72,
      mode: 'polyphonic'
    });

    /* --- Overtone controls --- */

    const additorOvertoneHisto = new Histogram({
      container: overtoneHisto_wrap,
      numBins: additorSynth.numOvertones,
      minValue: 0,
      maxValue: 1,
      backgroundColor: '#111',
      barColor: '#f00'
    });

    /* --- Envelope --- */
    const envOvertoneSelectMenu = new LiveDropMenu({
      container: document.getElementById('envOvertoneSelectMenu'),
      menuItemFontSize: '6px',
      menuItems: (function(){
        let overtones = [];
        for(let i = 0; i < additorSynth.numOvertones; i++){
          overtones.push(i);
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
      maxXValue: 10,
      quantizeX: 0.01,
      minYValue: 0,
      maxYValue: 1,
      quantizeY: 0.01
    }

    // set up the main envelope

    const attackEnvelope = new EnvelopeGraph(Object.assign({
      container: attackEnv_wrap,
      fixedEndPointY: 1
    }, envSharedProperties));
    const sustainEnvelope = new EnvelopeGraph(Object.assign({
      container: sustainEnv_wrap,
      fixedStartPointY: 1,
      fixedEndPointY: 1,
      maxNumVertices: 2
    }, envSharedProperties));
    const releaseEnvelope = new EnvelopeGraph(Object.assign({
      container: releaseEnv_wrap,
      fixedStartPointY: 1
    }, envSharedProperties));

    // set up the overtone envelopes
    let overtoneEnvelopes = [];

    for(let i = 0; i < additorSynth.numOvertones; i++) {
      overtoneEnvelopes[i] = {};

      overtoneEnvelopes[i].attackEnvelope = new EnvelopeGraph({
          container: attackEnv_wrap,
          backgroundColor: 'hsla(0, 0%, 0%, 0)',
          lineColor: 'hsla(' + (i * 23)%360 + ', 50%, 50%, 0)',
          vertexColor: 'hsla(' + (i * 23)%360 + ', 50%, 50%, 0)',
          isEditable: 'false',
          hasFixedStartPoint: true,
          hasFixedEndPoint: true,
          fixedStartPointY: 0,
          fixedEndPointY: 1,
          minXValue: 0,
          maxXValue: 10,
          quantizeX: 0.01,
          minYValue: 0,
          maxYValue: 1,
          quantizeY: 0.01
      });
      overtoneEnvelopes[i].sustainEnvelope = new EnvelopeGraph({
          container: sustainEnv_wrap,
          backgroundColor: 'hsla(0, 0%, 0%, 0)',
          lineColor: 'hsla(' + (i * 11)%360 + ', 50%, 50%, 0)',
          vertexColor: 'hsla(' + (i * 11)%360 + ', 50%, 50%, 0)',
          isEditable: 'false',
          hasFixedStartPoint: true,
          hasFixedEndPoint: true,
          fixedStartPointY: 1,
          fixedEndPointY: 1,
          minXValue: 0,
          maxXValue: 10,
          quantizeX: 0.01,
          minYValue: 0,
          maxYValue: 1,
          quantizeY: 0.01
      });
      overtoneEnvelopes[i].releaseEnvelope = new EnvelopeGraph({
          container: releaseEnv_wrap,
          backgroundColor: 'hsla(0, 0%, 0%, 0)',
          lineColor: 'hsla(' + (i * 23)%360 + ', 50%, 50%, 0)',
          vertexColor: 'hsla(' + (i * 23)%360 + ', 50%, 50%, 0)',
          isEditable: 'false',
          hasFixedStartPoint: true,
          hasFixedEndPoint: true,
          fixedStartPointY: 1,
          fixedEndPointY: 0,
          minXValue: 0,
          maxXValue: 10,
          quantizeX: 0.01,
          minYValue: 0,
          maxYValue: 1,
          quantizeY: 0.01
      });

      // when the envelope changes for each overtone
      overtoneEnvelopes[i].attackEnvelope.subscribe(this, (env) => {
        overtoneEnvelopes[i].sustainEnvelope.fixedStartPointY = env[env.length-1][1];
        overtoneEnvelopes[i].sustainEnvelope.fixedEndPointY = env[env.length-1][1];
        overtoneEnvelopes[i].releaseEnvelope.fixedStartPointY = env[env.length-1][1];

        additorSynth.setOvertoneAttackEnvelope(i, env);
      });
    }

    // select an overtone envelope to edit
    envOvertoneSelectMenu.subscribe(this, (menuIndex) => {
      if (menuIndex === 0) {
        attackEnvelope.isEditable = true;
        sustainEnvelope.isEditable = true;
        releaseEnvelope.isEditable = true;
      } else {
        attackEnvelope.isEditable = false;
        sustainEnvelope.isEditable = false;
        releaseEnvelope.isEditable = false;
      }

      overtoneEnvelopes.forEach((otEnv, otIndex) => {
        // decide whether they are editable
        otEnv.attackEnvelope.isEditable = (otIndex === menuIndex) ? true : false;
        otEnv.sustainEnvelope.isEditable = (otIndex === menuIndex) ? true : false;
        otEnv.releaseEnvelope.isEditable = (otIndex === menuIndex) ? true : false;

        // change line and vertex colors
        otEnv.attackEnvelope.lineColor = (otIndex === menuIndex)
                                         ? 'hsla(' + (otIndex * 23)%360 + ', 50%, 50%, 1)'
                                         : 'hsla(' + (otIndex * 23)%360 + ', 50%, 50%, 0.2)';
        otEnv.attackEnvelope.vertexColor = (otIndex === menuIndex)
                                         ? 'hsla(' + (otIndex * 23)%360 + ', 50%, 50%, 1)'
                                         : 'hsla(' + (otIndex * 23)%360 + ', 50%, 50%, 0.2)';
        otEnv.sustainEnvelope.lineColor = (otIndex === menuIndex)
                                          ? 'hsla(' + (otIndex * 23)%360 + ', 50%, 50%, 1)'
                                          : 'hsla(' + (otIndex * 23)%360 + ', 50%, 50%, 0.2)';
        otEnv.sustainEnvelope.vertexColor = (otIndex === menuIndex)
                                         ? 'hsla(' + (otIndex * 23)%360 + ', 50%, 50%, 1)'
                                         : 'hsla(' + (otIndex * 23)%360 + ', 50%, 50%, 0.2)';
        otEnv.releaseEnvelope.lineColor = (otIndex === menuIndex)
                                          ? 'hsla(' + (otIndex * 23)%360 + ', 50%, 50%, 1)'
                                          : 'hsla(' + (otIndex * 23)%360 + ', 50%, 50%, 0.2)';
        otEnv.releaseEnvelope.vertexColor = (otIndex === menuIndex)
                                         ? 'hsla(' + (otIndex * 23)%360 + ', 50%, 50%, 1)'
                                         : 'hsla(' + (otIndex * 23)%360 + ', 50%, 50%, 0.2)';

        otEnv.attackEnvelope.redraw();
        otEnv.sustainEnvelope.redraw();
        otEnv.releaseEnvelope.redraw();
      });
    });

    /* --- Pan dial --- */
    const additorMainOutputPanDial = new LiveDial({
      container: mainOutputPanDial_wrap,
      minValue: -100,
      maxValue: 100
    });

    /* --- Volume slider --- */
    const additorMainVolumeSlider = new LiveSlider({
      container: mainVolumeSlider_wrap,
      minValue: 0,
      maxValue: 127
    });

    /* --- Output meter --- */
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

    /* === Initial values ======================================= */

    mainOutputPanValueDisplay_wrap.value = outputChannelStrip.pan;

    /* ========================================================== */

    // change the envelope
    attackEnvelope.subscribe(this, (env) => {
      // get the attack, sustain, and release end points to match
      sustainEnvelope.fixedStartPointY = env[env.length-1][1];
      sustainEnvelope.fixedEndPointY = env[env.length-1][1];
      releaseEnvelope.fixedStartPointY = env[env.length-1][1];

      additorSynth.attackEnvelope = env;
    });

    sustainEnvelope.subscribe(this, (env) => {
      // get the attack, sustain, and release end points to match
      attackEnvelope.fixedEndPointY = env[0][1];
      releaseEnvelope.fixedStartPointY = env[1][1];
    });

    releaseEnvelope.subscribe(this, (env) => {
      // get the attack, sustain, and release end points to match
      sustainEnvelope.fixedStartPointY = env[0][1];
      sustainEnvelope.fixedEndPointY = env[0][1];
      attackEnvelope.fixedEndPointY = env[0][1];
      releaseEnvelope.fixedEndPointY = 0;

      additorSynth.releaseEnvelope = env;
    });

    // change the pan
    additorMainOutputPanDial.subscribe(this, (pan) => {
      mainOutputPanValueDisplay_wrap.value = pan / 100;
      outputChannelStrip.pan = pan / 100;
    });

    // change the main volume
    additorMainVolumeSlider.subscribe(this, (volume) => {
      outputChannelStrip.outputGain = volume / 100;
    });

    // change overtone amplitudes based on the histogram
    additorOvertoneHisto.subscribe(this, (overtoneAmplitudes) => {
      for(var voiceNum = additorSynth.numVoices - 1; voiceNum >= 0; voiceNum--) {
        overtoneAmplitudes.forEach((amplitude, overtoneNum) => {
          additorSynth.setOvertoneAmplitude(voiceNum, overtoneNum, amplitude);
        });
      }
    });

    additorKbd.subscribe(this, (kbdNoteEvent) => {
      var pitch = kbdNoteEvent.pitch;
      var vel = kbdNoteEvent.velocity;

      if(vel === 0) {
        additorSynth.releaseNote(pitch);
      } else {
        additorSynth.playNote(pitch);
      }
    });
  }

  return app;
});
