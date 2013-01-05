(function() {

  window.SMAudio = {
    playFromStart: function(id) {
      if (!eng.enableSounds) {
        return;
      }

      if (!SMAudioData[id]) {
        //  No such sound
        console.log("Attempt to play sound '" + id + "' that doesn't exist");
        return;
      }

      try {
        var sound = SMAudio[id];
        sound.currentTime = 0;
        sound.play();
      } catch(err) {
        // Audio probably not loaded yet?
        console.log('Audio error: ' + err);
      }
    },
    pause: function(id) {
      if (!eng.enableSounds) {
        return;
      }

      if (!SMAudioData[id]) {
        //  No such sound
        console.log("Attempt to play pause '" + id + "' that doesn't exist");
        return;
      }

      SMAudioData[id].pause();
    }
  };

})();