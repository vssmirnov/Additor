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
    const adt = {
      synth: {},

      ot: {
        histo: {}
      },

      env: {
        main: {
          attackGraph: {},
          sustainGraph: {},
          releaseGraph: {}
        },
        ot: [],
        clipboard: {}
      },

      filter: {},

      delay: {},

      output: {},

      voices: {},

      presets: {}
    };

    /*====================================== DEALING WITH PRESETS =====================================*/

    // preset dropmenu
    adt.presets.selectPresetMenu = new LiveDropMenu({
        container: document.querySelector("#additor .main-header .select-preset .select-preset-menu")
      })
      .subscribe(this, (menuIndex) => {
        adt.presets.loadPreset(adt.presets.data[menuIndex]);
    });

    (function loadAllPresets () {
        const url = '/presets/all_presets.json';

        let xhr = new XMLHttpRequest();

        xhr.open('GET', url, true);
        xhr.onreadystatechange = function () {
          if(xhr.status.toString().match(/^2\d\d$/) !== null) {
            parsePresets(JSON.parse(xhr.response).preset_data);
            adt.presets.loadPreset(adt.presets.data[0]);
          }
        }
        xhr.send();
    }());

    function parsePresets (rawPresetData) {
      adt.presets.data = rawPresetData;

      rawPresetData.forEach((preset) => {
        adt.presets.selectPresetMenu.addMenuItem(preset.name);
      });
    }

    adt.presets.loadPreset = function (preset) {
      // load overtone histo
      adt.ot.histo.dataBins = preset.ot.histo.dataBins;

      // load envelopes
      adt.env.main.attackGraph.vertices = preset.env.main.attackGraph.vertices.map(vertex => { return vertex.slice(); });
      adt.env.main.sustainGraph.vertices = preset.env.main.sustainGraph.vertices.map(vertex => { return vertex.slice(); });
      adt.env.main.releaseGraph.vertices = preset.env.main.releaseGraph.vertices.map(vertex => { return vertex.slice(); });
      adt.synth.node.attackEnvelope = adt.env.main.attackGraph.vertices;
      adt.synth.node.releaseEnvelope = adt.env.main.releaseGraph.vertices;

      adt.env.ot.forEach((otEnv, otIndex) => {
        otEnv.attackGraph.vertices = preset.env.ot[otIndex].attackGraph.vertices.map(vertex => { return vertex.slice(); });
        otEnv.sustainGraph.vertices = preset.env.ot[otIndex].sustainGraph.vertices.map(vertex => { return vertex.slice(); });
        otEnv.releaseGraph.vertices = preset.env.ot[otIndex].releaseGraph.vertices.map(vertex => { return vertex.slice(); });
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
    }

    /* Preset saving
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
    } */

    /* ====================================================================================*/

    const envCopyBtn = document.querySelector('#additor .env-ctrl .btn.copy');
    const envPasteBtn = document.querySelector('#additor .env-ctrl .btn.paste');
    const envResetBtn = document.querySelector('#additor .env-ctrl .btn.reset');

    /* ------------------- */
    /* --- Audio nodes --- */
    /* ------------------- */
    /* create the audio nodes and connect them within the audio context graph */
    /* .node means the object lives in the audio context graph */

    let audioCtx;

    if (typeof AudioContext !== 'undefined') {
      audioCtx = new AudioContext();
    } else if (typeof webkitAudioContext !== 'undefined') {
      audioCtx = new webkitAudioContext();
    } else {
      alert('No audio context available. Please use a different browser');
    }

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
      otAmp += Math.abs(Math.sin(n/5)/15);

      adt.ot.histo.setBinVal(n, otAmp);

      for(let voiceNum = adt.synth.node.numVoices - 1; voiceNum >= 0; voiceNum--) {
        adt.synth.node.setOvertoneAmplitude(voiceNum, n, otAmp);
      }
    }

    /* ------------------------- */
    /* --- Envelope controls --- */
    /* ------------------------- */

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
    const envSharedProperties = {
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
    }

    adt.env.main.attackGraph = new EnvelopeGraph(Object.assign({}, envSharedProperties, {
        container: document.querySelector('#additor .env-ctrl .env .attack .graph'),
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
        container: document.querySelector('#additor .env-ctrl .env .sustain .graph'),
        fixedStartPointY: 1,
        fixedEndPointY: 1,
        maxNumVertices: 2
      }))
      .subscribe(this, (env) => {
        // get the attack, sustain, and release end points to match
        adt.env.main.attackGraph.fixedEndPointY = env[0][1];
        adt.env.main.releaseGraph.fixedStartPointY = env[1][1];
        adt.synth.node.releaseEnvelope = env;
    });

    adt.env.main.releaseGraph = new EnvelopeGraph(Object.assign({}, envSharedProperties, {
        container: document.querySelector('#additor .env-ctrl .env .release .graph'),
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
          container: document.querySelector('#additor .env-ctrl .env .attack .graph'),
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
          container: document.querySelector('#additor .env-ctrl .env .sustain .graph'),
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
          container: document.querySelector('#additor .env-ctrl .env .release .graph'),
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
            adt.synth.node.setOvertoneReleaseEnvelope(i, env);
      });

      adt.env.ot[i] = otEnv;
    }

    // dropMenu - select which envelope to edit
    adt.env.graphSelectMenu = new LiveDropMenu({
      container: document.querySelector('#additor .env-ctrl .select-overtone .dropMenu'),
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

          adt.env.ot.forEach((otEnv, otIndex) => {
            // decide whether they are editable
            otEnv.attackGraph.isEditable = (otIndex === adt.env.selectedOtIndex) ? true : false;
            otEnv.sustainGraph.isEditable = (otIndex === adt.env.selectedOtIndex) ? true : false;
            otEnv.releaseGraph.isEditable = (otIndex === adt.env.selectedOtIndex) ? true : false;

            // change line and vertex colors
            otEnv.attackGraph.lineColor = (otIndex === adt.env.selectedOtIndex)
                                             ? 'hsla(' + (otIndex * 23)%360 + ', 50%, 50%, 1)'    // selected for editing
                                             : 'hsla(' + (otIndex * 23)%360 + ', 50%, 50%, 0.22)'; // inactive
            otEnv.attackGraph.vertexColor = (otIndex === adt.env.selectedOtIndex)
                                             ? '#0f0'                                             // selected for editing
                                             : 'hsla(' + (otIndex * 23)%360 + ', 50%, 50%, 0.22)'; // incative
            otEnv.sustainGraph.lineColor = (otIndex === adt.env.selectedOtIndex)
                                              ? 'hsla(' + (otIndex * 23)%360 + ', 50%, 50%, 1)'   // selected for editing
                                              : 'hsla(' + (otIndex * 23)%360 + ', 50%, 50%, 0.22)';// inactive
            otEnv.sustainGraph.vertexColor = (otIndex === adt.env.selectedOtIndex)
                                             ? '#0f0'                                             // selected for editing
                                             : 'hsla(' + (otIndex * 23)%360 + ', 50%, 50%, 0.22)'; // inactive
            otEnv.releaseGraph.lineColor = (otIndex === adt.env.selectedOtIndex)
                                              ? 'hsla(' + (otIndex * 23)%360 + ', 50%, 50%, 1)'   // selected for editing
                                              : 'hsla(' + (otIndex * 23)%360 + ', 50%, 50%, 0.22)';// inactive
            otEnv.releaseGraph.vertexColor = (otIndex === adt.env.selectedOtIndex)
                                             ? '#0f0'                                             // selected for editing
                                             : 'hsla(' + (otIndex * 23)%360 + ', 50%, 50%, 0.22)'; // inactive

            otEnv.attackGraph.redraw();
            otEnv.sustainGraph.redraw();
            otEnv.releaseGraph.redraw();
          });
        }
    });

    // copy/paste/reset envelopes
    envCopyBtn.addEventListener('mousedown', () => {
      if (adt.env.menuIndex === 0) {
        adt.env.clipboard.attackGraph.vertices = adt.env.main.attackGraph.vertices.map(vertex => { return vertex.slice(); });
        adt.env.clipboard.sustainGraph.vertices = adt.env.main.sustainGraph.vertices.map(vertex => { return vertex.slice(); });
        adt.env.clipboard.releaseGraph.vertices = adt.env.main.releaseGraph.vertices.map(vertex => { return vertex.slice(); });
      } else {
        let selectedOtIndex = adt.env.menuIndex - 1;
        adt.env.clipboard.attackGraph.vertices = adt.env.ot[selectedOtIndex].attackGraph.vertices.map(vertex => { return vertex.slice(); });
        adt.env.clipboard.sustainGraph.vertices = adt.env.ot[selectedOtIndex].sustainGraph.vertices.map(vertex => { return vertex.slice(); });
        adt.env.clipboard.releaseGraph.vertices = adt.env.ot[selectedOtIndex].releaseGraph.vertices.map(vertex => { return vertex.slice(); });
      }
    });

    envPasteBtn.addEventListener('mousedown', () => {
      if (adt.env.menuIndex === 0) {
        adt.env.main.attackGraph.vertices = adt.env.clipboard.attackGraph.vertices.map(vertex => { return vertex.slice(); });
        adt.env.main.sustainGraph.vertices = adt.env.clipboard.sustainGraph.vertices.map(vertex => { return vertex.slice(); });
        adt.env.main.releaseGraph.vertices = adt.env.clipboard.releaseGraph.vertices.map(vertex => { return vertex.slice(); });

        adt.synth.node.attackEnvelope = adt.env.main.attackGraph.vertices;
        adt.synth.node.releaseEnvelope = adt.env.main.releaseGraph.vertices;
      } else {
        let selectedOtIndex = adt.env.menuIndex - 1;
        adt.env.ot[selectedOtIndex].attackGraph.vertices = adt.env.clipboard.attackGraph.vertices.map(vertex => { return vertex.slice(); });
        adt.env.ot[selectedOtIndex].sustainGraph.vertices = adt.env.clipboard.sustainGraph.vertices.map(vertex => { return vertex.slice(); });
        adt.env.ot[selectedOtIndex].releaseGraph.vertices = adt.env.clipboard.releaseGraph.vertices.map(vertex => { return vertex.slice(); });

        adt.synth.node.setOvertoneAttackEnvelope(selectedOtIndex, adt.env.ot[selectedOtIndex].attackGraph.vertices);
        adt.synth.node.setOvertoneReleaseEnvelope(selectedOtIndex, adt.env.ot[selectedOtIndex].releaseGraph.vertices);
      }
    });

    envResetBtn.addEventListener('mousedown', () => {
      if (adt.env.menuIndex === 0) {
        adt.env.main.attackGraph.vertices = [[0,0], [adt.env.main.attackGraph.maxXValue, 0]];
        adt.env.main.sustainGraph.vertices = [[0,0], [adt.env.main.sustainGraph.maxXValue, 0]];
        adt.env.main.releaseGraph.vertices = [[0,0], [adt.env.main.releaseGraph.maxXValue, 0]];
      } else {
        let selectedOtIndex = adt.env.menuIndex - 1;
        adt.env.ot[selectedOtIndex].attackGraph.vertices = [[0,0], [adt.env.ot[selectedOtIndex].attackGraph.maxXValue, 0]];
        adt.env.ot[selectedOtIndex].sustainGraph.vertices = [[0,0], [adt.env.ot[selectedOtIndex].sustainGraph.maxXValue, 0]];
        adt.env.ot[selectedOtIndex].releaseGraph.vertices = [[0,0], [adt.env.ot[selectedOtIndex].releaseGraph.maxXValue, 0]];
      }
    });

    // envelope length number boxes
    adt.env.attackLengthNumbox = new DragNumberbox({
        container: document.querySelector('#additor .env-ctrl .attack .numbox'),
        minValue: 0,
        maxValue: 10000,
        appendString: ' ms',
        value: 1000
      })
      .subscribe(this, (val) => {
        adt.env.main.attackGraph.maxXValue = val / 1000;
        adt.env.main.attackGraph.redraw();
        adt.synth.node.attackEnvelope = adt.env.main.attackGraph.vertices;

        adt.env.ot.forEach((otEnv, index) => {
          otEnv.attackGraph.maxXValue = val / 1000;
          otEnv.attackGraph.redraw();
        });
    });

    adt.env.releaseLengthNumbox = new DragNumberbox({
        container: document.querySelector('#additor .env-ctrl .release .numbox'),
        minValue: 0,
        maxValue: 10000,
        appendString: ' ms',
        value: 1000
      })
      .subscribe(this, (val) => {
        adt.env.main.releaseGraph.maxXValue = val / 1000;
        adt.env.main.releaseGraph.redraw();
        adt.synth.node.releaseEnvelope = adt.env.main.releaseGraph.vertices;

        adt.env.ot.forEach((otEnv, index) => {
          otEnv.releaseGraph.maxXValue = val / 1000;
          otEnv.releaseGraph.redraw();
        });
    });

    // initial values for envelope controls
    adt.env.graphSelectMenu.value = 0;

    adt.env.updateUI = (function () {
      adt.env.main.attackGraph.vertices = adt.synth.node._voices[0].attackEnvelope.map(vertex => {return vertex.slice()});
      adt.env.main.releaseGraph.vertices = adt.synth.node._voices[0].releaseEnvelope.map(vertex => {return vertex.slice()});

      adt.env.ot.forEach((otEnv, otIndex) => {
        otEnv.attackGraph.vertices = adt.synth.node._voices[0]._overtones[otIndex].attackEnvelope.map(vertex => {return vertex.slice()});
        otEnv.releaseGraph.vertices = adt.synth.node._voices[0]._overtones[otIndex].releaseEnvelope.map(vertex => {return vertex.slice()});
        otEnv.sustainGraph.fixedStartPointY = otEnv.attackGraph.fixedEndPointY;
        otEnv.sustainGraph.fixedEndPointY = otEnv.sustainGraph.fixedStartPointY;

        otEnv.attackGraph.redraw();
        otEnv.sustainGraph.redraw();
        otEnv.releaseGraph.redraw();
      });
    })();

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
        container: document.querySelector('#additor .filter-ctrl .freq-ctrl .numbox'),
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
        container: document.querySelector('#additor .filter-ctrl .q-ctrl .numbox'),
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
        container: document.querySelector('#additor .filter-ctrl .gain-ctrl .numbox'),
        value: adt.filter.node.gain.value,
        minValue: 0,
        maxValue: 100,
        appendString: ' %'
      })
      .subscribe(this, (val) => {
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
    }

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
        container: document.querySelector('#additor .delay-ctrl .delayTime-ctrl .L .numbox'),
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
        container: document.querySelector('#additor .delay-ctrl .delayTime-ctrl .R .numbox'),
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
        container: document.querySelector('#additor .delay-ctrl .feedback-ctrl .L .numbox'),
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
        container: document.querySelector('#additor .delay-ctrl .feedback-ctrl .R .numbox'),
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
        container: document.querySelector('#additor .delay-ctrl .dryMix-ctrl .L .numbox'),
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
        container: document.querySelector('#additor .delay-ctrl .dryMix-ctrl .R .numbox'),
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
        container: document.querySelector('#additor .delay-ctrl .wetMix-ctrl .L .numbox'),
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
      container: document.querySelector('#additor .delay-ctrl .wetMix-ctrl .R .numbox'),
      value: Math.trunc(adt.delay.node.wetMixR.value * 100),
      minValue: 0,
      maxValue: 100,
      appendString: ' %'
      })
      .subscribe(this, (val) => {
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
    }

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
        container: document.querySelector('#additor .main-output-ctrl .pan-ctrl .numbox'),
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

    // volume numbox
    adt.output.volumeNumbox = new DragNumberbox({
        container: document.querySelector('#additor .main-output-ctrl .volume-ctrl .numbox'),
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
