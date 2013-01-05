'use strict';
(function() {
  screen.mozLockOrientation && screen.mozLockOrientation('landscape');

  var eng = window.eng = new SMEngine(document.getElementById('c'));
  window.addEventListener('load', eng.startRunLoop.bind(eng));
})();