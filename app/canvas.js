defineClass('SMCanvas', function (aCanvas) {
  this.element = aCanvas;
  this.context = aCanvas.getContext('2d');

  //  Eventually, we'll have an auto-scrolling play field, and we'll want this canvas
  //  to just be a small viewport into it. Until then, let's make it the size of
  //  the window so we have some room to move around.
  this.width = SMMetrics.BlockToPx(kSMEngineGameWidth);
  this.height = SMMetrics.BlockToPx(kSMEngineGameHeight);

  this.viewport = {
    x: 0,
    y: 0,
    width: this.width,
    height: this.height
  }

  this.element.height = this.height;
  this.element.width = this.width;
  this.element.style.height = this.height + 'px';
  this.element.style.width = this.width + 'px';

  this.clear();
}, {
  clear: function() {
    this.context.fillStyle = '#000';

    // note: intentionally not using our wrapper method; we want screen coordinations, not game coordinations
    this.context.fillRect(0, 0, this.width, this.height);

    //  Start by marking everything as dirty; this will cause map renderer to render the whole screen.
    this.dirtyRects = [{ x: 0, y: 0, width: this.width, height: this.height }];
  },
  fillRect: function(absoluteX, absoluteY, width, height) {
    var adjustedPos = this.adjustPos(absoluteX, absoluteY);
    if (adjustedPos.x > this.viewport.x + this.viewport.width || adjustedPos.y > this.viewport.y + this.viewport.height) {
      return;
    }

    var adjustedWidth = Math.min(this.width - adjustedPos.x, width);
    var adjustedHeight = Math.min(this.height - adjustedPos.y, height);

    this.dirtyRects.push({ x: absoluteX, y: absoluteY, width: adjustedWidth, height: adjustedHeight });

    this.context.fillRect(adjustedPos.x, adjustedPos.y, adjustedWidth, adjustedHeight);
  },
  adjustPos: function(absoluteX, absoluteY) {
    return {
      x: absoluteX - this.viewport.x,
      y: absoluteY + this.viewport.y
    };
  },
  drawImage: function(image, absoluteX, absoluteY, fromPlayer) {
    var adjustedPos = this.adjustPos(absoluteX, absoluteY);

    if (adjustedPos.x > this.viewport.x + this.viewport.width || adjustedPos.y > this.viewport.y + this.viewport.height) {
      //  off screen
      return;
    }

    //  TODO: clip right-hand edge of image to edge of viewable area in canvas (only needed when canvas is wider than viewport)

    this.dirtyRects.push({ x: absoluteX, y: absoluteY, width: kSMEngineBlockSize, height: kSMEngineBlockSize, fromPlayer: !!fromPlayer });

    this.context.drawImage(image, adjustedPos.x, adjustedPos.y);
  },
  setViewport: function(viewport) {
    //  Copy graphics to new viewport -- e.g. if the new viewport is offset by 10px horizontally, move current contents over horizontally
    //  We only want to adjust what we need
    this.viewport = viewport;
  }
});