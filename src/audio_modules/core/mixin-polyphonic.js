/**
 * @mixin
 */
const Polyphonic = {
  /** Number of voices */
  get numVoices () {
    return this._voices.length;
  }
  set numVoices (newNumVoices) {
    const _this = this;

    // if the new number of voices is more than previous number, we add voices
    if (newNumVoices > this.numVoices) {
      for (var i = this.numVoices; i < newNumVoices; i++) {
        this._voices.push(new AdditiveSynthVoice(this._audioCtx, { numOvertones: this._numOvertones }));
        this._voices[i].connect(this._channelStrip.input);
        this._availableVoices.push(i);
      }

    // if the new number is less than previous, remove voices
    } else if (newNumVoices < this.numVoices) {
      let numVoicesToDelete = this.numVoices - newNumVoices;
      let numAvailableVoices = this._availableVoices.length;

      // if the number of voices to delete is less then or equal to the number of available (inactive) voices, delete these voices
      if (numVoicesToDelete <= numAvailableVoices) {
        deleteAvailableVoices(numVoicesToDelete);
      }

      // else delete all available (inactive) voices and also required number of busy voices
      else {
        let numBusyVoicesToDelete = numVoicesToDelete - numAvailableVoices;

        deleteAvailableVoices(numAvailableVoices);
        deleteBusyVoices(numBusyVoicesToDelete);
      }

      function deleteAvailableVoices (numVoicesToDelete) {
        for(let i = 0; i < numVoicesToDelete; i++) {
          let voiceToDelete = _this._availableVoices[i];

          _this._voices.splice(voiceToDelete, 1);
          _this._availableVoices.splice(i, 1);

          // remap the available and busy voices because we modified the voices stack
          _this._availableVoices = _this._availableVoices.map(voice => {
            return (voice > voiceToDelete) ? voice - 1 : voice;
          });
          _this._busyVoices = _this._busyVoices.map(voice => {
            return {
              voiceNum: (voice.voiceNum > voiceToDelete) ? voice.voiceNum - 1 : voice.voiceNum,
              pitch: voice.pitch
            };
          });
        }
      }

      function deleteBusyVoices (numBusyVoicesToDelete) {
        // delete the required number of busy voices
        for (let i = 0; i < numBusyVoicesToDelete; i++) {
          let voiceToDelete = _this._busyVoices[i].voiceNum;

          _this.releaseVoice(voiceToDelete);
          _this._voices.splice(voiceToDelete, 1);
          _this._busyVoices.splice(i, 1);

          // remap the busy voices pointer stack because we modified the voices stack
          _this._busyVoices = _this._busyVoices.map(voice => {
            return {
              voiceNum: (voice.voiceNum > voiceToDelete) ? voice.voiceNum - 1 : voice.voiceNum,
              pitch: voice.pitch
            };
          });
        }
      }
    }
    console.log('newNumVoices: ' + this.numVoices);
    return this;
  }
  setNumVoices (newNumVoices) {
    this.numVoices = newNumVoices;
  }
}

export default Polyphonic;