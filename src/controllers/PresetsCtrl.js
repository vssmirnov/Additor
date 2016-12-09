/* -------------------------- */
/* --- Presets controller --- */
/* -------------------------- */

import DropMenu from '../widgets/DropMenu';
import additorPresets from '../../presets/presets';

'use strict';

const PresetsCtrl = function PresetsCtrl(adt) {
    let presets = {};

    // preset dropmenu
    adt.presets.selectPresetMenu = new DropMenu({
        container: document.querySelector("#additor .main-header .select-preset .select-preset-menu")
      })
      .subscribe(this, (menuIndex) => {
        adt.presets.loadPreset(adt.presets.data[menuIndex]);
    });

    function loadAllPresets () {
        const url = '/presets/all_presets.json';

        let xhr = new XMLHttpRequest();

        xhr.open('GET', url, true);
        xhr.onreadystatechange = function () {
          console.log('XHR loadAllPresets status is ' + xhr.status);
          if(xhr.status.toString().match(/^2\d\d$/) !== null) {
            parsePresets(JSON.parse(xhr.response).preset_data);
            adt.presets.loadPreset(adt.presets.data[0]);
          }
        }
        xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
        xhr.send();
    }

    function parsePresets (rawPresetData) {
      adt.presets.data = rawPresetData;

      rawPresetData.forEach((preset) => {
        adt.presets.selectPresetMenu.addMenuItem(preset.name);
      });

      adt.presets.loadPreset(adt.presets.data[0]);
    }

    adt.presets.loadPreset = function(preset) {
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

    parsePresets(additorPresets.preset_data);


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

export default PresetsCtrl
