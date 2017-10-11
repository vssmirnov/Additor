import DropMenu from '../widgets/DropMenu';
import additorPresets from '../../presets/presets';

'use strict';

/**
 * Presets controller manages loading presets
 * @param {object} dependencies
 *  Required Dependencies:
 *    DOM References:
 *      "select-preset-dropmenu-container"
 * @param {string} presetReqUrl - Url for requesting a JSON object specifying the presets
 */
let PresetsCtrl = function PresetsCtrl(dependencies, presetReqUrl) {

    const SELECT_PRESET_DROPMENU_CONTAINER = dependencies["select-preset-dropmenu-container"];
    const CONTROLLERS = dependencies["controllers"];
    const AUDIO_PATCH = dependencies["audio-patch"];

    let presets = {};
    let presetsCtrl = { data: [] };

    // preset dropmenu
    presetsCtrl.selectPresetMenu = new DropMenu({
      container: SELECT_PRESET_DROPMENU_CONTAINER
    })
    .subscribe(this, (menuIndex) => {
      presetsCtrl.loadPreset(presetsCtrl.data[menuIndex]);
    });

    function loadAllPresets () {
      let url = '/presets/all_presets.json';
      let xhr = new XMLHttpRequest();

      xhr.open('GET', url, true);
      xhr.onreadystatechange = function () {
        if(xhr.status.toString().match(/^2\d\d$/) !== null) {
          parsePresets(JSON.parse(xhr.response).preset_data);
          presetsCtrl.loadPreset(presetsCtrl.data[0]);
        }
      }
      xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
      xhr.send();
    }

    function parsePresets (rawPresetData) {
      presetsCtrl.data = rawPresetData;

      rawPresetData.forEach((preset) => {
        presetsCtrl.selectPresetMenu.addMenuItem(preset.name);
      });

      presetsCtrl.loadPreset(presetsCtrl.data[0]);
    }

    presetsCtrl.loadPreset = function(preset) {
      // LOAD OVERTONE HISTO
      CONTROLLERS["overtoneController"].histo.dataBins = preset.ot.histo.dataBins;

      // LOAD envelopes:

      //   1. Check if preset maxXValue exceeds maxXValues for envelope graphs
      let maxXAttack = 0;
      let maxXRelease = 0;

      preset.env.main.attackGraph.vertices.forEach(vertex => { maxXAttack = Math.max(maxXAttack, vertex[0]); });
      preset.env.main.releaseGraph.vertices.forEach(vertex => { maxXRelease = Math.max(maxXRelease, vertex[0]); });

      CONTROLLERS["envelopeController"].main.attackGraph.maxXValue = maxXAttack;
      CONTROLLERS["envelopeController"].attackLengthNumbox.value = maxXAttack;
      CONTROLLERS["envelopeController"].main.releaseGraph.maxXValue = maxXRelease;
      CONTROLLERS["envelopeController"].releaseLengthNumbox.value = maxXRelease;

      CONTROLLERS["envelopeController"].ot.forEach((otEnv, otIndex) => {
        preset.env.ot[otIndex].attackGraph.maxXValue = maxXAttack;
        preset.env.ot[otIndex].releaseGraph.maxXValue = maxXRelease;
      });

      //    2. Copy the vertices
      CONTROLLERS["envelopeController"].main.attackGraph.vertices = preset.env.main.attackGraph.vertices.map(vertex => { return vertex.slice(); });
      CONTROLLERS["envelopeController"].main.sustainGraph.vertices = preset.env.main.sustainGraph.vertices.map(vertex => { return vertex.slice(); });
      CONTROLLERS["envelopeController"].main.releaseGraph.vertices = preset.env.main.releaseGraph.vertices.map(vertex => { return vertex.slice(); });
      AUDIO_PATCH["synth"].attackEnvelope = CONTROLLERS["envelopeController"].main.attackGraph.vertices;
      AUDIO_PATCH["synth"].releaseEnvelope = CONTROLLERS["envelopeController"].main.releaseGraph.vertices;

      CONTROLLERS["envelopeController"].ot.forEach((otEnv, otIndex) => {
        otEnv.attackGraph.vertices = preset.env.ot[otIndex].attackGraph.vertices.map(vertex => { return vertex.slice(); });
        otEnv.sustainGraph.vertices = preset.env.ot[otIndex].sustainGraph.vertices.map(vertex => { return vertex.slice(); });
        otEnv.releaseGraph.vertices = preset.env.ot[otIndex].releaseGraph.vertices.map(vertex => { return vertex.slice(); });
        AUDIO_PATCH["synth"].setOvertoneAttackEnvelope(otIndex, otEnv.attackGraph.vertices);
        AUDIO_PATCH["synth"].setOvertoneReleaseEnvelope(otIndex, otEnv.releaseGraph.vertices);
      });

      // load filter
      AUDIO_PATCH["filter"].type = preset.filter.type;
      AUDIO_PATCH["filter"].frequency.value = preset.filter.freq;
      AUDIO_PATCH["filter"].Q.value = preset.filter.Q;
      AUDIO_PATCH["filter"].gain.value = preset.filter.gain;
      CONTROLLERS["filterController"].updateUI();

      // load delay
      AUDIO_PATCH["delay"].delayTimeL.value = preset.delay.delayTimeL;
      AUDIO_PATCH["delay"].delayTimeR.value = preset.delay.delayTimeR;
      AUDIO_PATCH["delay"].feedbackL.value = preset.delay.feedbackL;
      AUDIO_PATCH["delay"].feedbackR.value = preset.delay.feedbackR;
      AUDIO_PATCH["delay"].dryMixL.value = preset.delay.dryMixL;
      AUDIO_PATCH["delay"].dryMixR.value = preset.delay.dryMixR;
      AUDIO_PATCH["delay"].wetMixL.value = preset.delay.wetMixL;
      AUDIO_PATCH["delay"].wetMixR.value = preset.delay.wetMixR;
      CONTROLLERS["delayController"].updateUI();
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

    return presetsCtrl;
};

export default PresetsCtrl
