/**
 * Class representing an Audio Patch created by an Audio Module Manager.
 * @class 
 */
class AudioPatch {

  /**
   * @constructor
   * @param {Object} moduleMap
   * @param {AudioContext} audioCtx
   * @param {AudioModuleManager} audioModuleManager
   */
  constructor(moduleMap, audioCtx, audioModuleManager) {
    this.MODULE_MAP = moduleMap;
    this.AUDIO_CTX = audioCtx;
    this.AUDIO_MODULE_MANAGER = audioModuleManager;
    
    // a more consise alias
    this.modules = this.MODULE_MAP;
  }

  /**
   * Returns the Audio Context
   * @returns {AudioContext}
   */
  getAudioContext() {
    return this.AUDIO_CTX;
  }

  /**
   * Alias for {getAudioContext}.
   * @returns {AudioContext}
   */
  getAudioCtx() {
    return this.getAudioContext();
  }

  /**
   * Returns the module map.
   * @returns {object} - Object representing the module map.
   */
  getModuleMap() {
    return this.MODULE_MAP;
  }

  /**
   * Alias for {getModuleMap}. Returns the module map.
   * @returns {object} - Object representing the module map.
   */
  modules() {
    return this.MODULE_MAP;
  }

  /**
   * Returns the Audio Module Manager associated with this patch.
   * @returns {AudioModuleManager} - The Audio Module Manager associated with this patch.
   */
  getAudioModuleManager() {
    return this.AUDIO_MODULE_MANAGER;
  }
}

export default AudioPatch;
