//  Load images
console.log('Loading images');
window.SMImages = {};
Array.prototype.slice.apply(document.querySelectorAll('#resources img')).forEach(function(elem) {
  SMImages[elem.id] = elem;
});
console.log('Images:', SMImages);