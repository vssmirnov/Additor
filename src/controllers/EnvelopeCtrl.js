/* --------------------------- */
/* --- Envelope controller --- */
/* --------------------------- */

import EnvelopeGraph from '../widgets/EnvelopeGraph';
import DropMenu from '../widgets/DropMenu';
import Numberbox from '../widgets/Numberbox';

'use strict';

const EnvelopeCtrl = function EnvelopeCtrl(adt) {

    // references to the copy and paste buttons
    const envCopyBtn = document.querySelector('#additor .env-ctrl .btn.copy');
    const envPasteBtn = document.querySelector('#additor .env-ctrl .btn.paste');
    const envResetBtn = document.querySelector('#additor .env-ctrl .btn.reset');

    adt.env = {
      main: {}, // container for the main envelope controllers
      ot: []    // container for the overtone envelopes
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
    adt.env.main.attackGraph = new EnvelopeGraph(Object.assign({}, envSharedProperties, {
            container: document.querySelector('#additor .env-ctrl .env .attack .graph'),
            fixedStartPointY: 0
        }))
        .subscribe(this, (env) => {
            // get the attack, sustain, and release end points to match
            adt.env.main.sustainGraph.fixedStartPointY = env[env.length - 1][1];
            adt.env.main.sustainGraph.fixedEndPointY = env[env.length - 1][1];
            adt.env.main.releaseGraph.fixedStartPointY = env[env.length - 1][1];
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
            fixedEndPointY: 1
        }))
        .subscribe(this, (env) => {
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
    for (let i = 0; i < adt.synth.node.numOvertones; i++) {
        let otEnv = {};

        otEnv.attackGraph = new EnvelopeGraph({
                container: document.querySelector('#additor .env-ctrl .env .attack .graph'),
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
                adt.synth.node.setOvertoneAttackEnvelope(i, env);
            });
        otEnv.sustainGraph = new EnvelopeGraph({
                container: document.querySelector('#additor .env-ctrl .env .sustain .graph'),
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
                container: document.querySelector('#additor .env-ctrl .env .release .graph'),
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
                adt.synth.node.setOvertoneReleaseEnvelope(i, env);
            });

        adt.env.ot[i] = otEnv;
    }

    // dropMenu - select which envelope to edit
    adt.env.graphSelectMenu = new DropMenu({
            container: document.querySelector('#additor .env-ctrl .select-overtone .dropMenu'),
            menuItemFontSize: '6px',
            menuItems: (function() {
                let overtones = ['main envelope'];
                for (let i = 0; i < adt.synth.node.numOvertones; i++) {
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
                    otEnv.attackGraph.lineColor = (otIndex === adt.env.selectedOtIndex) ?
                        'hsla(' + (otIndex * 23) % 360 + ', 50%, 50%, 1)' // selected for editing
                        :
                        'hsla(' + (otIndex * 23) % 360 + ', 50%, 50%, 0.22)'; // inactive
                    otEnv.attackGraph.vertexColor = (otIndex === adt.env.selectedOtIndex) ?
                        '#0f0' // selected for editing
                        :
                        'hsla(' + (otIndex * 23) % 360 + ', 50%, 50%, 0.22)'; // incative
                    otEnv.sustainGraph.lineColor = (otIndex === adt.env.selectedOtIndex) ?
                        'hsla(' + (otIndex * 23) % 360 + ', 50%, 50%, 1)' // selected for editing
                        :
                        'hsla(' + (otIndex * 23) % 360 + ', 50%, 50%, 0.22)'; // inactive
                    otEnv.sustainGraph.vertexColor = (otIndex === adt.env.selectedOtIndex) ?
                        '#0f0' // selected for editing
                        :
                        'hsla(' + (otIndex * 23) % 360 + ', 50%, 50%, 0.22)'; // inactive
                    otEnv.releaseGraph.lineColor = (otIndex === adt.env.selectedOtIndex) ?
                        'hsla(' + (otIndex * 23) % 360 + ', 50%, 50%, 1)' // selected for editing
                        :
                        'hsla(' + (otIndex * 23) % 360 + ', 50%, 50%, 0.22)'; // inactive
                    otEnv.releaseGraph.vertexColor = (otIndex === adt.env.selectedOtIndex) ?
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
    envCopyBtn.addEventListener('mousedown', () => {
        if (adt.env.menuIndex === 0) {
            adt.env.clipboard.attackGraph.vertices = adt.env.main.attackGraph.vertices.map(vertex => {
                return vertex.slice();
            });
            adt.env.clipboard.sustainGraph.vertices = adt.env.main.sustainGraph.vertices.map(vertex => {
                return vertex.slice();
            });
            adt.env.clipboard.releaseGraph.vertices = adt.env.main.releaseGraph.vertices.map(vertex => {
                return vertex.slice();
            });
        } else {
            let selectedOtIndex = adt.env.menuIndex - 1;
            adt.env.clipboard.attackGraph.vertices = adt.env.ot[selectedOtIndex].attackGraph.vertices.map(vertex => {
                return vertex.slice();
            });
            adt.env.clipboard.sustainGraph.vertices = adt.env.ot[selectedOtIndex].sustainGraph.vertices.map(vertex => {
                return vertex.slice();
            });
            adt.env.clipboard.releaseGraph.vertices = adt.env.ot[selectedOtIndex].releaseGraph.vertices.map(vertex => {
                return vertex.slice();
            });
        }
    });

    envPasteBtn.addEventListener('mousedown', () => {
        if (adt.env.menuIndex === 0) {
            adt.env.main.attackGraph.vertices = adt.env.clipboard.attackGraph.vertices.map(vertex => {
                return vertex.slice();
            });
            adt.env.main.sustainGraph.vertices = adt.env.clipboard.sustainGraph.vertices.map(vertex => {
                return vertex.slice();
            });
            adt.env.main.releaseGraph.vertices = adt.env.clipboard.releaseGraph.vertices.map(vertex => {
                return vertex.slice();
            });

            adt.synth.node.attackEnvelope = adt.env.main.attackGraph.vertices;
            adt.synth.node.releaseEnvelope = adt.env.main.releaseGraph.vertices;
        } else {
            let selectedOtIndex = adt.env.menuIndex - 1;
            adt.env.ot[selectedOtIndex].attackGraph.vertices = adt.env.clipboard.attackGraph.vertices.map(vertex => {
                return vertex.slice();
            });
            adt.env.ot[selectedOtIndex].sustainGraph.vertices = adt.env.clipboard.sustainGraph.vertices.map(vertex => {
                return vertex.slice();
            });
            adt.env.ot[selectedOtIndex].releaseGraph.vertices = adt.env.clipboard.releaseGraph.vertices.map(vertex => {
                return vertex.slice();
            });

            adt.synth.node.setOvertoneAttackEnvelope(selectedOtIndex, adt.env.ot[selectedOtIndex].attackGraph.vertices);
            adt.synth.node.setOvertoneReleaseEnvelope(selectedOtIndex, adt.env.ot[selectedOtIndex].releaseGraph.vertices);
        }
    });

    envResetBtn.addEventListener('mousedown', () => {
        if (adt.env.menuIndex === 0) {
            adt.env.main.attackGraph.vertices = [
                [0, 0],
                [adt.env.main.attackGraph.maxXValue, 0]
            ];
            adt.env.main.sustainGraph.vertices = [
                [0, 0],
                [adt.env.main.sustainGraph.maxXValue, 0]
            ];
            adt.env.main.releaseGraph.vertices = [
                [0, 0],
                [adt.env.main.releaseGraph.maxXValue, 0]
            ];
        } else {
            let selectedOtIndex = adt.env.menuIndex - 1;
            adt.env.ot[selectedOtIndex].attackGraph.vertices = [
                [0, 0],
                [adt.env.ot[selectedOtIndex].attackGraph.maxXValue, 0]
            ];
            adt.env.ot[selectedOtIndex].sustainGraph.vertices = [
                [0, 0],
                [adt.env.ot[selectedOtIndex].sustainGraph.maxXValue, 0]
            ];
            adt.env.ot[selectedOtIndex].releaseGraph.vertices = [
                [0, 0],
                [adt.env.ot[selectedOtIndex].releaseGraph.maxXValue, 0]
            ];
        }
    });

    // envelope length number boxes
    adt.env.attackLengthNumbox = new Numberbox({
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

    adt.env.releaseLengthNumbox = new Numberbox({
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

    adt.env.updateUI = (function() {
        adt.env.main.attackGraph.vertices = adt.synth.node._voices[0].attackEnvelope.map(vertex => {
            return vertex.slice()
        });
        adt.env.main.releaseGraph.vertices = adt.synth.node._voices[0].releaseEnvelope.map(vertex => {
            return vertex.slice()
        });

        adt.env.ot.forEach((otEnv, otIndex) => {
            otEnv.attackGraph.vertices = adt.synth.node._voices[0]._overtones[otIndex].attackEnvelope.map(vertex => {
                return vertex.slice()
            });
            otEnv.releaseGraph.vertices = adt.synth.node._voices[0]._overtones[otIndex].releaseEnvelope.map(vertex => {
                return vertex.slice()
            });
            otEnv.sustainGraph.fixedStartPointY = otEnv.attackGraph.fixedEndPointY;
            otEnv.sustainGraph.fixedEndPointY = otEnv.sustainGraph.fixedStartPointY;

            otEnv.attackGraph.redraw();
            otEnv.sustainGraph.redraw();
            otEnv.releaseGraph.redraw();
        });
    })();

    return adt.env;
};

export default EnvelopeCtrl
