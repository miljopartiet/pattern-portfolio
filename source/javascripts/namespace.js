(function() {
  "use strict";
  var namespace = function(name) {
    if (! (name in window)) {
      return window[name] = {};
    }
  }
  window['namespace'] = namespace;
}(this));
