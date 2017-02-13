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

### Notes on the Synthesis Engine Implementation

The synthesis engine implements an additive synthesis model.
The implementation is based on a hierarchy of components defined by the following classes:

The **AdditiveSynth** class represents an polyphonic additive synthesizer, which consists of a number of *Additive Synth Voices*. This top-level class is responsible for allocating voices as notes are held down or released.

The **AdditiveSynthVoice** class represents a single voice in the polyphonic synthesizer, consisting of a bank of *Overtones* connected to an *Envelope* and a *Channel Strip*

The **Envelope** class represents an amplitude envelope with an Attack, Sustain, and Release portions. The attack and release portions are defined by an arrays of [*Time*, *Amplitude*] pairs of arbitrary length, allowing for precise control of the envelope shape.

The **Channel Strip** class represents a channel strip with an *Input Gain*, a *Pan*, and an *Output Gain*.

The **Overtone** class implements a single oscillator representing one overtone in an *AdditiveSynthVoice*,connected to a *ChannelStrip*



