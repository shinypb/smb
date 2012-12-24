//  Load images
console.log('Loading images');
window.SMImages = {};

Array.prototype.slice.apply(document.querySelectorAll('#resources img')).forEach(function(elem) {
  SMImages[elem.id] = elem;
  if (elem.dataset.character) {
    // Load block properties from HTML data (and set defaults for missing properties.)
    window.SMBlockProperties[elem.dataset.character] = {
      element: elem,
      image: elem.id,
      isSolid: elem.dataset.isSolid || false,
      isTransparent: elem.dataset.isTransparent || true,
      color:  elem.dataset.isTransparent || kSMColorSkyBlue,
      canStandOn: elem.dataset.canStandOn || false
    };
  }
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