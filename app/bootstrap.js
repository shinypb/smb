'use strict';
(function() {
  console.log(+new Date);
  var eng = window.eng = new SMEngine(document.getElementById('c'));
  window.addEventListener('load', eng.startRunLoop.bind(eng));
})();