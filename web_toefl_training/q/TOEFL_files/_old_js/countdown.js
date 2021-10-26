(function(factory) {
  "use strict";
  if (typeof define === "function" && define.amd) {
    define(["jquery"], factory);
  }
  else {
    factory(jQuery);
  }
})(function($) {
  var settings = {
    seconds: 0,
    atfirst: 0,
    percent: 0,
    frequency: 1000,
    pause: false,
    timer: null,
    element: null,
    heartbeatCallback: null,
    timesupCallback: null,
  };

  $.fn.countdown = function(options) {
    console.log(options);
    settings.element = this;
    if (typeof options == 'undefined') {
      return methods['init'].apply(this, Array.prototype.slice.call(arguments, 1));
    }
    else if (methods[options]) {
      return methods[options].apply(this, Array.prototype.slice.call(arguments, 1));
    }
    return methods['init'].apply(this, Array.prototype.slice.call(arguments, options));
  };

  var methods = {
    start: function() {
      methods['stop'].apply(this, Array.prototype.slice.call(arguments, 1));
      if (!settings.timer) {
        settings.timer = setInterval(function() {

          if (settings.pause) {
            return;
          }

          updateElement();
          settings.percent = 100 - Math.floor((settings.seconds / settings.atfirst) * 100);
          if (typeof settings.heartbeatCallback == 'function') {
            settings.heartbeatCallback(methods['status'].apply(this, Array.prototype.slice.call(arguments, 1)));
          }

          if (settings.seconds <= 0) {
            if (typeof settings.timesupCallback == 'function') {
              settings.timesupCallback();
            }
            return;
          }
          settings.seconds--;
        }, settings.frequency);
      }
    },
    resume: function(options) {
      settings.pause = false;
    },
    pause: function(options) {
      settings.pause = true;
    },
    stop: function(options) {
      clearInterval(settings.timer);
      settings.timer = null;
      settings.percent = 0;
      settings.pause = false;
    },
    status: function(options) {
      return {
        seconds: settings.seconds,
        percent: settings.percent,
        pause: settings.pause,
      };
    },
    init: function(options) {
      settings = $.extend(settings, options);
      settings.atfirst = settings.seconds;
      updateElement();
    },
  };

  function updateElement() {
    settings.element.html(secondsToHMS(settings.seconds));
  }

  function secondsToHMS(s) {
    var h = Math.floor(s / 3600);
    s -= h * 3600;
    var m = Math.floor(s / 60);
    s -= m * 60;
    return (h < 10 ? '0' + h : h) + ":" + (m < 10 ? '0' + m : m) + ":" + (s < 10 ? '0' + s : s);
  }
});
