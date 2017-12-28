import AudioModule from "audio_modules/core/audio-module";
import StereoPannerShim from "audio_modules/stereo-panner-shim";

import Dial from "ui/dial";

var panDial = new Dial(document.getElementById("pan-dial"), {
  minVal: -1,
  maxVal: 1,
  stepInterval: 0.01
});

panDial.addObserver(val => {
  console.log(val);
});


