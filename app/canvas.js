defineClass('SMCanvas',  function (aCanvas) {
  this.element = aCanvas;
  this.context = aCanvas.getContext('2d');

  //  Eventually, we'll have an auto-scrolling play field, and we'll want this canvas
  //  to just be a small viewport into it. Until then, let's make it the size of
  //  the window so we have some room to move around.
  //  this.width = SMMetrics.BlockToPx(kSMEngineGameWidth);
  this.width = document.body.clientWidth - 20;
  this.height = SMMetrics.BlockToPx(kSMEngineGameHeight);

  this.element.height = this.height;
  this.element.width = this.width;
  this.element.style.height = this.height + 'px';
  this.element.style.width = this.width + 'px';

  this.clear();
}, {
  clear: function() {
    this.context.fillStyle = kSMColorSkyBlue;
    this.context.fillRect(0, 0, this.width, this.height);
  }
});