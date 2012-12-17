//  Load images
console.log('Loading images');
window.SMImages = {};
Array.prototype.slice.apply(document.querySelectorAll('#resources img')).forEach(function(elem) {
  SMImages[elem.id] = elem;
});
console.log('Images:', SMImages);

window.SMAudio = {};

(function() {
  var playFromStart = function() {
    try {
      if (eng.enableSounds) {
        this.currentTime = 0;
        this.play();
      }
    } catch(err) {
      // Audio probably not loaded yet?
      console.log('Audio error: ' + err);
    }
  };

  Array.prototype.slice.apply(document.querySelectorAll('#resources audio')).forEach(function(elem) {
    SMAudio[elem.id] = elem;
    elem.playFromStart = playFromStart;
  });
})();