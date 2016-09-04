(function() {
  var util = {};

  /**
   * Convert MIDI pitch to frequency
   * @param {number} midiPitch - The midi pitch number.
   * @param {number} [a4tuning=440] - Tuning of the note A4 (midi pitch 69) in Hz, 440Hz by default.
   * @return {number} freq - Frequency for the given MIDI pitch.
   */
  util.midiToFreq = function (midiPitch, a4tuning) {
    var a4tuning = a4tuning || 440;
    var freq = -1;
  
    if (midiPitch !== -1) freq = Math.pow(2, (midiPitch - 69) / 12) * 440;
    return freq;
  };

  /**
   * Convert note name to MIDI pitch
   * @param {string} noteName - The note name to convert
   * @return {number} midiPitch - MIDI pitch for the given note name. Return -1 if invalid argument format.
   */
  util.noteNameToMidi = function (noteName) {
    var noteNameFormat = /^([a-g]|[A-G])(#|b)?([0-9]|10)$/;

    if(noteNameFormat.test(noteName) === false) {
      console.log('util.noteNameToMidi: invalid note name format');
      return -1;
    } else {
      var capture = noteNameFormat.exec(noteName);

      var note = capture[1];
      var accidental = capture[2];
      var octave = capture[3];

      var noteFundamentalMap = {
        'A': 9,
        'a': 9,
        'B': 11,
        'b': 11,
        'C': 0,
        'c': 0,
        'D': 2,
        'd': 2,
        'E': 4,
        'e': 4,
        'F': 5,
        'f': 5,
        'G': 7,
        'g': 7
      };

      var noteFundamental = noteFundamentalMap[note];

      if(accidental === '#') {
        noteFundamental++;
      } else if (accidental === 'b') {
        noteFundamental--;
      }

      var midiPitch = noteFundamental + (12 * octave);

      return midiPitch;
    }
  };

  /**
   * Convert note name to frequency
   * @param {string} noteName - The note name to convert
   * @param {number} [a4tuning=440] - Tuning of the note A4 (midi pitch 69) in Hz, 440Hz by default.
   * @return {number} freq - Frequency for the given MIDI pitch.
   */
  util.noteNameToFreq = function (noteName, a4tuning) {
    var a4tuning = a4tuning || 440;
    return util.midiToFreq(util.noteNameToMidi(noteName), a4tuning);
  };

  window.util = util;
})();
