'use strict';

/**
 * The {@link DevicePixelRatioMonitor} monitors window.DevicePixel Ratio.
 * and Provides callback when it changes.
 */
class DevicePixelRatioMonitor {
  /**
   * Constructor.
   * @param {{matchMedia: function}} [options] - options
   */
  constructor(options) {
    options = Object.assign({
      matchMedia: matchMedia.bind(window)
    }, options);

    const listeners = [];
    Object.defineProperties(this, {
      _listeners: {
        value: listeners
      },
      _onPixelRatioChange: {
        value: () => {
          const devicePixelRatio = window.devicePixelRatio;
          listeners.forEach(callback => callback(devicePixelRatio));
        }
      },
      _matchMedia: {
        value: options.matchMedia
      }
    });

    const updateDevicePixelRatio = () => {
      const devicePixelRatio = window.devicePixelRatio;
      options.matchMedia(`(resolution: ${devicePixelRatio}dppx)`).addEventListener('change', this._onPixelRatioChange, { once: true });
    };
    updateDevicePixelRatio();
  }

  /**
   * Register's given function
   *  for receiving callbacks when device pixel ratio changes.
   * @param {function} callback
   * @returns {number} current device pixel ratio
   *
   */
  registerCallback(callback) {
    this._listeners.push(callback);

    return window.devicePixelRatio;
  }

  /**
   * Un-registers previously registered callback
   * @param {*} callback
   */
  unRegister(callback) {
    const index = this._listeners.indexOf(callback);
    if (index !== -1) {
      this._listeners.splice(index, 1);
    }
  }
}

module.exports = new DevicePixelRatioMonitor();
