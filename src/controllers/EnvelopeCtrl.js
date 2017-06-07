import EnvelopeGraph from '../widgets/EnvelopeGraph';
import DropMenu from '../widgets/DropMenu';
import Numberbox from '../widgets/Numberbox';

'use strict';

/**
 * Controller for the envelopes
 * @param {object} dependencies
 *  Required Dependencies:
 *    Audio Module:
 *      "synth-audio-module"
 *    DOM Containers:
 *      "envelope-copy-button"
 *      "envelope-paste-button"
 *      "envelope-reset-button"
 *      "envelope-attack-graph-container"
 *      "envelope-sustain-graph-container"
 *      "envelope-release-graph-container"
 *      "envelope-select-dropmenu-container"
 */
let EnvelopeCtrl = function EnvelopeCtrl(dependencies) {
    const SYNTH_AUDIO_MODULE = dependencies["synth-audio-module"];

    // references to the copy and paste buttons
    const ENVELOPE_COPY_BUTTON = dependencies["envelope-copy-button"];
    const ENVELOPE_PASTE_BUTTON = dependencies["envelope-paste-button"];
    const ENVELOPE_RESET_BUTTON = dependencies["envelope-reset-button"];

    // references to envelope graph DOM containers
    const ENVELOPE_ATTACK_GRAPH_CONTAINER = dependencies["envelope-attack-graph-container"];
    const ENVELOPE_SUSTAIN_GRAPH_CONTAINER = dependencies["envelope-sustain-graph-container"];
    const ENVELOPE_RELEASE_GRAPH_CONTAINER = dependencies["envelope-release-graph-container"];

    // reference to the DOM container for the drop-down menu for selecting which envelope to edit
    const ENVELOPE_SELECT_DROPMENU_CONTAINER = dependencies["envelope-select-dropmenu-container"];

    // references to the DOM containers for the attack and release length number boxes
    const ENVELOPE_ATTACK_LENGTH_NUMBOX_CONTAINER = dependencies["envelope-attack-length-numbox-container"];
    const ENVELOPE_RELEASE_LENGTH_NUMBOX_CONTAINER = dependencies["envelope-release-length-numbox-container"];

    // placeholder object for the envelope controller
    let envelopeCtrl = {
      main: {}, // main envelope
      ot: []    // overtone envelopes
    };

    // the envelope currently selected for editing using the drop menu
    envelopeCtrl.selectedOtIndex = 0;

    // envelope currently saved to the clipboard
    envelopeCtrl.clipboard = {
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

    /**
     * Create the main envelope graph
     */
    envelopeCtrl.main.attackGraph = new EnvelopeGraph(Object.assign({}, envSharedProperties, {
            container: ENVELOPE_ATTACK_GRAPH_CONTAINER,
            fixedStartPointY: 0
        }))
        .subscribe(this, (env) => {
            // get the attack, sustain, and release end points to match
            envelopeCtrl.main.sustainGraph.fixedStartPointY = env[env.length - 1][1];
            envelopeCtrl.main.sustainGraph.fixedEndPointY = env[env.length - 1][1];
            envelopeCtrl.main.releaseGraph.fixedStartPointY = env[env.length - 1][1];
            SYNTH_AUDIO_MODULE.attackEnvelope = env;
        });

    envelopeCtrl.main.sustainGraph = new EnvelopeGraph(Object.assign({}, envSharedProperties, {
            container: ENVELOPE_SUSTAIN_GRAPH_CONTAINER,
            fixedStartPointY: 1,
            fixedEndPointY: 1,
            maxNumVertices: 2
        }))
        .subscribe(this, (env) => {
            // get the attack, sustain, and release end points to match
            envelopeCtrl.main.attackGraph.fixedEndPointY = env[0][1];
            envelopeCtrl.main.releaseGraph.fixedStartPointY = env[1][1];
            SYNTH_AUDIO_MODULE.releaseEnvelope = env;
        });

    envelopeCtrl.main.releaseGraph = new EnvelopeGraph(Object.assign({}, envSharedProperties, {
            container: ENVELOPE_RELEASE_GRAPH_CONTAINER,
            fixedEndPointY: 1
        }))
        .subscribe(this, (env) => {
            // get the attack, sustain, and release end points to match
            envelopeCtrl.main.sustainGraph.fixedStartPointY = env[0][1];
            envelopeCtrl.main.sustainGraph.fixedEndPointY = env[0][1];
            envelopeCtrl.main.attackGraph.fixedEndPointY = env[0][1];
            envelopeCtrl.main.releaseGraph.fixedEndPointY = 0;
            SYNTH_AUDIO_MODULE.releaseEnvelope = env;
        });

    /**
     * Create envelope graphs for each overtone
     */
    for (let i = 0; i < SYNTH_AUDIO_MODULE.numOvertones; i++) {
        let otEnv = {};

        otEnv.attackGraph = new EnvelopeGraph({
                container: ENVELOPE_ATTACK_GRAPH_CONTAINER,
                backgroundColor: 'hsla(0, 0%, 0%, 0)',
                lineColor: 'hsla(' + (i * 91) % 360 + ', 50%, 50%, 0)',
                vertexColor: 'hsla(' + (i * 91) % 360 + ', 50%, 50%, 0)',
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
                otEnv.attackGraph.fixedEndPointY = env[env.length - 2][1];
                otEnv.sustainGraph.fixedStartPointY = otEnv.attackGraph.fixedEndPointY;
                otEnv.sustainGraph.fixedEndPointY = otEnv.sustainGraph.fixedStartPointY;
                otEnv.releaseGraph.fixedStartPointY = otEnv.sustainGraph.fixedEndPointY;
                SYNTH_AUDIO_MODULE.setOvertoneAttackEnvelope(i, env);
            });
        otEnv.sustainGraph = new EnvelopeGraph({
                container: ENVELOPE_SUSTAIN_GRAPH_CONTAINER,
                backgroundColor: 'hsla(0, 0%, 0%, 0)',
                lineColor: 'hsla(' + (i * 91) % 360 + ', 50%, 50%, 0)',
                vertexColor: 'hsla(' + (i * 91) % 360 + ', 50%, 50%, 0)',
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
                container: ENVELOPE_RELEASE_GRAPH_CONTAINER,
                backgroundColor: 'hsla(0, 0%, 0%, 0)',
                lineColor: 'hsla(' + (i * 91) % 360 + ', 50%, 50%, 0)',
                vertexColor: 'hsla(' + (i * 91) % 360 + ', 50%, 50%, 0)',
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
                SYNTH_AUDIO_MODULE.setOvertoneReleaseEnvelope(i, env);
            });

        envelopeCtrl.ot[i] = otEnv;
    }

    // dropMenu - select which envelope to edit
    envelopeCtrl.graphSelectMenu = new DropMenu({
            container: ENVELOPE_SELECT_DROPMENU_CONTAINER,
            menuItemFontSize: '6px',
            menuItems: (function() {
                let overtones = ['main envelope'];
                for (let i = 0; i < SYNTH_AUDIO_MODULE.numOvertones; i++) {
                    overtones.push('overtone ' + i);
                }
                return overtones;
            }())
        })
        .subscribe(this, (menuIndex) => {
            envelopeCtrl.menuIndex = menuIndex;

            // if menu index is 0, the main envelope is selected
            if (menuIndex === 0) {
                // make the main envelope editable
                envelopeCtrl.main.attackGraph.isEditable = true;
                envelopeCtrl.main.sustainGraph.isEditable = true;
                envelopeCtrl.main.releaseGraph.isEditable = true;

                // make the main envelope color bright
                envelopeCtrl.main.attackGraph.lineColor = 'hsla(0, 100%, 50%, 1)';
                envelopeCtrl.main.attackGraph.vertexColor = 'hsla(120, 100%, 50%, 1)';
                envelopeCtrl.main.sustainGraph.lineColor = 'hsla(0, 100%, 50%, 1)';
                envelopeCtrl.main.sustainGraph.vertexColor = 'hsla(120, 100%, 50%, 1)';
                envelopeCtrl.main.releaseGraph.lineColor = 'hsla(0, 100%, 50%, 1)';
                envelopeCtrl.main.releaseGraph.vertexColor = 'hsla(120, 100%, 50%, 1)';

                // make the overtone envelopes not editable and dim their colors
                envelopeCtrl.ot.forEach((otEnv, otIndex) => {
                    otEnv.attackGraph.isEditable = false;
                    otEnv.sustainGraph.isEditable = false;
                    otEnv.releaseGraph.isEditable = false;

                    otEnv.attackGraph.lineColor = 'hsla(' + (otIndex * 23) % 360 + ', 50%, 50%, 0.15)';
                    otEnv.attackGraph.vertexColor = 'hsla(' + (otIndex * 23) % 360 + ', 50%, 50%, 0.15)';
                    otEnv.sustainGraph.lineColor = 'hsla(' + (otIndex * 23) % 360 + ', 50%, 50%, 0.15)';
                    otEnv.sustainGraph.vertexColor = 'hsla(' + (otIndex * 23) % 360 + ', 50%, 50%, 0.15)';
                    otEnv.releaseGraph.lineColor = 'hsla(' + (otIndex * 23) % 360 + ', 50%, 50%, 0.15)';
                    otEnv.releaseGraph.vertexColor = 'hsla(' + (otIndex * 23) % 360 + ', 50%, 50%, 0.15)';

                    otEnv.attackGraph.redraw();
                    otEnv.sustainGraph.redraw();
                    otEnv.releaseGraph.redraw();
                });

                // redraw the main envelope
                envelopeCtrl.main.attackGraph.redraw();
                envelopeCtrl.main.sustainGraph.redraw();
                envelopeCtrl.main.releaseGraph.redraw();

                // else, one of the overtone envelope graphs is selected
            } else {
                // index of the selected overtone
                envelopeCtrl.selectedOtIndex = menuIndex - 1;

                // make the main envelope not editable
                envelopeCtrl.main.attackGraph.isEditable = false;
                envelopeCtrl.main.sustainGraph.isEditable = false;
                envelopeCtrl.main.releaseGraph.isEditable = false;

                // make the main envelope's color greyed out
                envelopeCtrl.main.attackGraph.lineColor = 'hsla(0, 100%, 50%, 0.15)';
                envelopeCtrl.main.attackGraph.vertexColor = 'hsla(120, 100%, 50%, 0.15)';
                envelopeCtrl.main.sustainGraph.lineColor = 'hsla(0, 100%, 50%, 0.15)';
                envelopeCtrl.main.sustainGraph.vertexColor = 'hsla(120, 100%, 50%, 0.15)';
                envelopeCtrl.main.releaseGraph.lineColor = 'hsla(0, 100%, 50%, 0.15)';
                envelopeCtrl.main.releaseGraph.vertexColor = 'hsla(120, 100%, 50%, 0.15)';

                envelopeCtrl.ot.forEach((otEnv, otIndex) => {
                    // decide whether they are editable
                    otEnv.attackGraph.isEditable = (otIndex === envelopeCtrl.selectedOtIndex) ? true : false;
                    otEnv.sustainGraph.isEditable = (otIndex === envelopeCtrl.selectedOtIndex) ? true : false;
                    otEnv.releaseGraph.isEditable = (otIndex === envelopeCtrl.selectedOtIndex) ? true : false;

                    // change line and vertex colors
                    otEnv.attackGraph.lineColor = (otIndex === envelopeCtrl.selectedOtIndex) ?
                        'hsla(' + (otIndex * 23) % 360 + ', 50%, 50%, 1)' // selected for editing
                        :
                        'hsla(' + (otIndex * 23) % 360 + ', 50%, 50%, 0.22)'; // inactive
                    otEnv.attackGraph.vertexColor = (otIndex === envelopeCtrl.selectedOtIndex) ?
                        '#0f0' // selected for editing
                        :
                        'hsla(' + (otIndex * 23) % 360 + ', 50%, 50%, 0.22)'; // incative
                    otEnv.sustainGraph.lineColor = (otIndex === envelopeCtrl.selectedOtIndex) ?
                        'hsla(' + (otIndex * 23) % 360 + ', 50%, 50%, 1)' // selected for editing
                        :
                        'hsla(' + (otIndex * 23) % 360 + ', 50%, 50%, 0.22)'; // inactive
                    otEnv.sustainGraph.vertexColor = (otIndex === envelopeCtrl.selectedOtIndex) ?
                        '#0f0' // selected for editing
                        :
                        'hsla(' + (otIndex * 23) % 360 + ', 50%, 50%, 0.22)'; // inactive
                    otEnv.releaseGraph.lineColor = (otIndex === envelopeCtrl.selectedOtIndex) ?
                        'hsla(' + (otIndex * 23) % 360 + ', 50%, 50%, 1)' // selected for editing
                        :
                        'hsla(' + (otIndex * 23) % 360 + ', 50%, 50%, 0.22)'; // inactive
                    otEnv.releaseGraph.vertexColor = (otIndex === envelopeCtrl.selectedOtIndex) ?
                        '#0f0' // selected for editing
                        :
                        'hsla(' + (otIndex * 23) % 360 + ', 50%, 50%, 0.22)'; // inactive

                    otEnv.attackGraph.redraw();
                    otEnv.sustainGraph.redraw();
                    otEnv.releaseGraph.redraw();
                });
            }
        });

    // copy/paste/reset envelopes
    ENVELOPE_COPY_BUTTON.addEventListener('mousedown', () => {
        if (envelopeCtrl.menuIndex === 0) {
            envelopeCtrl.clipboard.attackGraph.vertices = envelopeCtrl.main.attackGraph.vertices.map(vertex => {
                return vertex.slice();
            });
            envelopeCtrl.clipboard.sustainGraph.vertices = envelopeCtrl.main.sustainGraph.vertices.map(vertex => {
                return vertex.slice();
            });
            envelopeCtrl.clipboard.releaseGraph.vertices = envelopeCtrl.main.releaseGraph.vertices.map(vertex => {
                return vertex.slice();
            });
        } else {
            let selectedOtIndex = envelopeCtrl.menuIndex - 1;
            envelopeCtrl.clipboard.attackGraph.vertices = envelopeCtrl.ot[selectedOtIndex].attackGraph.vertices.map(vertex => {
                return vertex.slice();
            });
            envelopeCtrl.clipboard.sustainGraph.vertices = envelopeCtrl.ot[selectedOtIndex].sustainGraph.vertices.map(vertex => {
                return vertex.slice();
            });
            envelopeCtrl.clipboard.releaseGraph.vertices = envelopeCtrl.ot[selectedOtIndex].releaseGraph.vertices.map(vertex => {
                return vertex.slice();
            });
        }
    });

    ENVELOPE_PASTE_BUTTON.addEventListener('mousedown', () => {
        if (envelopeCtrl.menuIndex === 0) {
            envelopeCtrl.main.attackGraph.vertices = envelopeCtrl.clipboard.attackGraph.vertices.map(vertex => {
                return vertex.slice();
            });
            envelopeCtrl.main.sustainGraph.vertices = envelopeCtrl.clipboard.sustainGraph.vertices.map(vertex => {
                return vertex.slice();
            });
            envelopeCtrl.main.releaseGraph.vertices = envelopeCtrl.clipboard.releaseGraph.vertices.map(vertex => {
                return vertex.slice();
            });

            SYNTH_AUDIO_MODULE.attackEnvelope = envelopeCtrl.main.attackGraph.vertices;
            SYNTH_AUDIO_MODULE.releaseEnvelope = envelopeCtrl.main.releaseGraph.vertices;
        } else {
            let selectedOtIndex = envelopeCtrl.menuIndex - 1;
            envelopeCtrl.ot[selectedOtIndex].attackGraph.vertices = envelopeCtrl.clipboard.attackGraph.vertices.map(vertex => {
                return vertex.slice();
            });
            envelopeCtrl.ot[selectedOtIndex].sustainGraph.vertices = envelopeCtrl.clipboard.sustainGraph.vertices.map(vertex => {
                return vertex.slice();
            });
            envelopeCtrl.ot[selectedOtIndex].releaseGraph.vertices = envelopeCtrl.clipboard.releaseGraph.vertices.map(vertex => {
                return vertex.slice();
            });

            SYNTH_AUDIO_MODULE.setOvertoneAttackEnvelope(selectedOtIndex, envelopeCtrl.ot[selectedOtIndex].attackGraph.vertices);
            SYNTH_AUDIO_MODULE.setOvertoneReleaseEnvelope(selectedOtIndex, envelopeCtrl.ot[selectedOtIndex].releaseGraph.vertices);
        }
    });

    ENVELOPE_RESET_BUTTON.addEventListener('mousedown', () => {
        if (envelopeCtrl.menuIndex === 0) {
            envelopeCtrl.main.attackGraph.vertices = [
                [0, 0],
                [envelopeCtrl.main.attackGraph.maxXValue, 0]
            ];
            envelopeCtrl.main.sustainGraph.vertices = [
                [0, 0],
                [envelopeCtrl.main.sustainGraph.maxXValue, 0]
            ];
            envelopeCtrl.main.releaseGraph.vertices = [
                [0, 0],
                [envelopeCtrl.main.releaseGraph.maxXValue, 0]
            ];
        } else {
            let selectedOtIndex = envelopeCtrl.menuIndex - 1;
            envelopeCtrl.ot[selectedOtIndex].attackGraph.vertices = [
                [0, 0],
                [envelopeCtrl.ot[selectedOtIndex].attackGraph.maxXValue, 0]
            ];
            envelopeCtrl.ot[selectedOtIndex].sustainGraph.vertices = [
                [0, 0],
                [envelopeCtrl.ot[selectedOtIndex].sustainGraph.maxXValue, 0]
            ];
            envelopeCtrl.ot[selectedOtIndex].releaseGraph.vertices = [
                [0, 0],
                [envelopeCtrl.ot[selectedOtIndex].releaseGraph.maxXValue, 0]
            ];
        }
    });

    // envelope length number boxes
    envelopeCtrl.attackLengthNumbox = new Numberbox({
            container: ENVELOPE_ATTACK_LENGTH_NUMBOX_CONTAINER,
            minValue: 0,
            maxValue: 10000,
            appendString: ' ms',
            value: 1000
        })
        .subscribe(this, (val) => {
            envelopeCtrl.main.attackGraph.maxXValue = val / 1000;
            envelopeCtrl.main.attackGraph.redraw();
            SYNTH_AUDIO_MODULE.attackEnvelope = envelopeCtrl.main.attackGraph.vertices;

            envelopeCtrl.ot.forEach((otEnv, index) => {
                otEnv.attackGraph.maxXValue = val / 1000;
                otEnv.attackGraph.redraw();
            });
        });

    envelopeCtrl.releaseLengthNumbox = new Numberbox({
            container: ENVELOPE_RELEASE_LENGTH_NUMBOX_CONTAINER,
            minValue: 0,
            maxValue: 10000,
            appendString: ' ms',
            value: 1000
        })
        .subscribe(this, (val) => {
            envelopeCtrl.main.releaseGraph.maxXValue = val / 1000;
            envelopeCtrl.main.releaseGraph.redraw();
            SYNTH_AUDIO_MODULE.releaseEnvelope = envelopeCtrl.main.releaseGraph.vertices;

            envelopeCtrl.ot.forEach((otEnv, index) => {
                otEnv.releaseGraph.maxXValue = val / 1000;
                otEnv.releaseGraph.redraw();
            });
        });

    // initial values for envelope controls
    envelopeCtrl.graphSelectMenu.value = 0;

    envelopeCtrl.updateUI = (function() {
        envelopeCtrl.main.attackGraph.vertices = SYNTH_AUDIO_MODULE._voices[0].attackEnvelope.map(vertex => {
            return vertex.slice()
        });
        envelopeCtrl.main.releaseGraph.vertices = SYNTH_AUDIO_MODULE._voices[0].releaseEnvelope.map(vertex => {
            return vertex.slice()
        });

        envelopeCtrl.ot.forEach((otEnv, otIndex) => {
            otEnv.attackGraph.vertices = SYNTH_AUDIO_MODULE._voices[0]._overtones[otIndex].attackEnvelope.map(vertex => {
                return vertex.slice()
            });
            otEnv.releaseGraph.vertices = SYNTH_AUDIO_MODULE._voices[0]._overtones[otIndex].releaseEnvelope.map(vertex => {
                return vertex.slice()
            });
            otEnv.sustainGraph.fixedStartPointY = otEnv.attackGraph.fixedEndPointY;
            otEnv.sustainGraph.fixedEndPointY = otEnv.sustainGraph.fixedStartPointY;

            otEnv.attackGraph.redraw();
            otEnv.sustainGraph.redraw();
            otEnv.releaseGraph.redraw();
        });
    })();

    return envelopeCtrl;
};

export default EnvelopeCtrl
