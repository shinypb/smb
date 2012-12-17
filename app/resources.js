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
    this.currentTime = 0;
    this.play();
  };

  Array.prototype.slice.apply(document.querySelectorAll('#resources audio')).forEach(function(elem) {
    SMAudio[elem.id] = elem;
    elem.playFromStart = playFromStart;
  });
})();