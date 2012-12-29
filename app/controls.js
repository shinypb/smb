window.addEventListener('deviceorientation', function (event) {
  return;
  document.getElementById('debug').innerHTML = 'gamma: ' + parseInt(event.gamma, 10) + ' // beta: ' + parseInt(event.beta, 10);

  if (event.beta < -8) {
    eng.keyMap[kSMKeyRight] = true;
  } else {
    eng.keyMap[kSMKeyRight] = false;
  }

  if (event.beta > 8) {
    eng.keyMap[kSMKeyLeft] = true;
  } else {
    eng.keyMap[kSMKeyLeft] = false;
  }

  if(Math.abs(event.beta) > 16) {
    eng.keyMap[kSMKeyAction] = true;
  } else {
    eng.keyMap[kSMKeyAction] = false;
  }

  document.getElementById('button').addEventListener('touchstart', function(event) {
    eng.keyMap[kSMKeyJump] = true;
  }, false);
  document.getElementById('button').addEventListener('touchend', function(event) {
    eng.keyMap[kSMKeyJump] = false;
  }, false);
}, false);

