Additor
=======
An additive synth based on the Web Audio API
------------------------------------------------
![](https://vsm22.github.io/images/additor1_cropped.png)

Additor is an additive synth built with vanilla JS using the Web Audio API.

*note: Chrome is highly recommended for full Web Audio API support*

### Repo structure

The **src** folder is structured as follows:

**src/synth** contains modules pertaining to the audio synthesis engine

**src/widgets** contains classes for the canvas-based widgets

**src/controllers** contains controllers linking the UI with the synthesis engine

**Build entry**: *build/bundle.js*

**Source entry**: *src/app.js*

### Build

`$ npm install`

`$ webpack`

### Synthesis Implementation

The each voice in the synthesis engine implements a bank of oscillators that represent the overtones for that voice.

The ChannelStrip class represents a **inputGain -> pan -> outputGain**
Each of these parameters can be set i.e.
``` let ch = new ChannelStrip();
  ch.inputGain = 0.5;
  ch.pan = 0.1
  ch.outputGain = 0.8```

