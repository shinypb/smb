'use strict';
(function() {
  //  Load images
  console.log('Loading images');
  window.SMImages = {};
  window.SMBlockProperties = window.SMBlockProperties || {};

  var distinctCharacters = [];
  Array.prototype.slice.apply(document.querySelectorAll('#resources img')).forEach(function(elem) {
    if (!elem.id) {
      //  Give the image a unique ID based on its filename (e.g. resources/foo.png -> foo)
      elem.id = elem.src.match(/(\/([^/]+).png)$/)[2];
    }

    SMImages[elem.id] = elem;
    if (!elem.dataset.character) {
      return;
    }

    if (distinctCharacters.indexOf(elem.dataset.character) >= 0) {
      throw new Error('Duplicate data-character attribute "' + elem.dataset.character + '"');
    }
    distinctCharacters.push(elem.dataset.character);

    // Load block properties from HTML data (and set defaults for missing properties.)
    SMBlockProperties[elem.dataset.character] = {
      element: elem,
      image: elem.id,
      isSolid: !!elem.dataset.isSolid,
      isTransparent: !!elem.dataset.isTransparent,
      canStandOn: !!elem.dataset.canStandOn,
      color: elem.dataset.color
    };
  });

  //  Load images
  console.log('Loading audio');
  window.SMAudioData = {};
  Array.prototype.slice.apply(document.querySelectorAll('#resources audio')).forEach(function(elem) {
    SMAudioData[elem.id] = elem;
  });

})();