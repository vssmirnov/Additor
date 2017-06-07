/**
 * A set of DOM containers for Additor synth widgets keyed by their names
 */
let AdditorContainers = {
  keyboard: {
    "keyboard-container": document.querySelector("#additor .kbd")
  },

  filter: {
    "type-drop-menu-container": document.querySelector("#additor .filter-ctrl .type-ctrl .dropMenu"),
    "freq-dial-container": document.querySelector("#additor .filter-ctrl .freq-ctrl .dial"),
    "freq-numbox-container": document.querySelector("#additor .filter-ctrl .freq-ctrl .numbox"),
    "q-dial-container": document.querySelector("#additor .filter-ctrl .q-ctrl .dial"),
    "q-numbox-container": document.querySelector("#additor .filter-ctrl .q-ctrl .numbox"),
    "gain-dial-container": document.querySelector("#additor .filter-ctrl .gain-ctrl .dial"),
    "gain-numbox-container": document.querySelector("#additor .filter-ctrl .gain-ctrl .numbox")
  },

  delay: {
    "delay-time-L-dial-container": document.querySelector("#additor .delay-ctrl .delayTime-ctrl .L .dial"),
    "delay-time-L-numbox-container": document.querySelector("#additor .delay-ctrl .delayTime-ctrl .L .numbox"),
    "delay-time-R-dial-container": document.querySelector("#additor .delay-ctrl .delayTime-ctrl .R .dial"),
    "delay-time-R-numbox-container": document.querySelector("#additor .delay-ctrl .delayTime-ctrl .R .numbox"),
    "feedback-L-dial-container": document.querySelector("#additor .delay-ctrl .feedback-ctrl .L .dial"),
    "feedback-L-numbox-container": document.querySelector("#additor .delay-ctrl .feedback-ctrl .L .numbox"),
    "feedback-R-dial-container": document.querySelector("#additor .delay-ctrl .feedback-ctrl .R .dial"),
    "feedback-R-numbox-container": document.querySelector("#additor .delay-ctrl .feedback-ctrl .R .numbox"),
    "dry-mix-L-dial-container": document.querySelector("#additor .delay-ctrl .dryMix-ctrl .L .dial"),
    "dry-mix-L-numbox-container": document.querySelector("#additor .delay-ctrl .dryMix-ctrl .L .numbox"),
    "dry-mix-R-dial-container": document.querySelector('#additor .delay-ctrl .dryMix-ctrl .R .dial'),
    "dry-mix-R-numbox-container": document.querySelector('#additor .delay-ctrl .dryMix-ctrl .R .numbox'),
    "wet-mix-L-dial-container": document.querySelector("#additor .delay-ctrl .wetMix-ctrl .L .dial"),
    "wet-mix-L-numbox-container": document.querySelector("#additor .delay-ctrl .wetMix-ctrl .L .numbox"),
    "wet-mix-R-dial-container": document.querySelector("#additor .delay-ctrl .wetMix-ctrl .R .dial"),
    "wet-mix-R-numbox-container": document.querySelector("#additor .delay-ctrl .wetMix-ctrl .R .numbox")
  },

  envelope: {
    "envelope-copy-button": document.querySelector('#additor .env-ctrl .btn.copy'),
    "envelope-paste-button": document.querySelector('#additor .env-ctrl .btn.paste'),
    "envelope-reset-button": document.querySelector('#additor .env-ctrl .btn.reset'),
    "envelope-attack-graph-container": document.querySelector('#additor .env-ctrl .env .attack .graph'),
    "envelope-sustain-graph-container": document.querySelector('#additor .env-ctrl .env .sustain .graph'),
    "envelope-release-graph-container": document.querySelector('#additor .env-ctrl .env .release .graph'),
    "envelope-select-dropmenu-container": document.querySelector('#additor .env-ctrl .select-overtone .dropMenu'),
    "envelope-attack-length-numbox-container": document.querySelector('#additor .env-ctrl .attack .numbox'),
    "envelope-release-length-numbox-container": document.querySelector('#additor .env-ctrl .release .numbox')
  },

  overtones: {
    "overtone-histogram-container": document.querySelector('#additor .ot-ctrl .otHisto')
  },

  output: {
    "pan-dial-container": document.querySelector('#additor .main-output-ctrl .pan-ctrl .dial'),
    "pan-numbox-container": document.querySelector('#additor .main-output-ctrl .pan-ctrl .numbox'),
    "volume-slider-container": document.querySelector('#additor .main-output-ctrl .volume-ctrl .slider'),
    "volume-numbox-container": document.querySelector('#additor .main-output-ctrl .volume-ctrl .numbox'),
    "output-meter-l-container": document.querySelector('#additor .main-output-ctrl .volume-ctrl .meter:nth-child(1)'),
    "output-meter-r-container": document.querySelector('#additor .main-output-ctrl .volume-ctrl .meter:nth-child(2)')

  }
}

export default AdditorContainers
