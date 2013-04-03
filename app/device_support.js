'use strict';
(function () {
  //  Begin iOS support

  //  Prevent touches from scrolling
  document.body.addEventListener('touchmove', function(e) {
    e.preventDefault();
  });

  document.body.addEventListener('orientationchange', setOrientationClass);

  //  Set a class on the HTML element to indicate orientation
  //  We use this to show a message when the device is not in landscape mode
  function setOrientationClass() {
    if (window.orientation == 0) {
      document.documentElement.className = 'portrait';
    } else {
      document.documentElement.className = 'landscape';
    }
  }

  window.addEventListener('load', function() {
    setOrientationClass();

    setTimeout(function(){
      //  This hides the location bar
      window.scrollTo(0, 1);
    }, 0);
  });

  window.addEventListener('deviceorientation', function (event) {
    return;
    if (!window.eng) {
      //  eng hasn't been set yet
      return;
    }

    document.getElementById('controls-debug').innerHTML = 'gamma: ' + parseInt(event.gamma, 10) + ' // beta: ' + parseInt(event.beta, 10);

    eng.keyMap[kSMKeyRight] = (event.beta < -8);
    eng.keyMap[kSMKeyLeft] = (event.beta > 8);
    eng.keyMap[kSMKeyAction] = (Math.abs(event.beta) > 16);

  }, false);

})();
