/**
 *  SMCanvas is an intermediary between the game and the HTML element that it draws into.
 *  It is used by SMAgents and SMMap in order to draw; they never draw directly onto the
 *  element.
 */
defineClass('SMCanvas', function (aCanvas, engine) {
  this.element = aCanvas;
  this.context = aCanvas.getContext('2d');
  this.engine = engine;

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
    var x = SMMetrics.PxToNearestBlockPx(this.viewport.x);
    var y = SMMetrics.PxToNearestBlockPx(this.viewport.y);
    this.dirtyRects = [{ x: x, y: y, width: this.width, height: this.height }];
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
  setViewport: function(newViewport) {

    var enableOptimizedViewportMovement = false; // not ready yet
    if (enableOptimizedViewportMovement) {
      //  When changing the viewport, we must do two things:
      //  1. Move the existing contents of the canvas by the appropriate offset, so we don't redraw more than we have to
      //  2. Mark the newly revealed parts of the viewport as dirty so they are redrawn

      var prevViewport = this.viewport;

      //  Copy graphics to new viewport -- e.g. if the new viewport is offset by 10px horizontally, move current contents over horizontally

      //  The disjoint regions of these two viewports must be marked as dirty
      if (newViewport.x != prevViewport.x) {

      }
      if (newViewport.y != newViewport.y) {
      }
    } else {
      //  Brute-force; redraw the entire canvas
      this.clear();
    }

    //  Set the new viewport
    this.viewport = newViewport;
  }
});