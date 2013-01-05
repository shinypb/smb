'use strict';
/**
 *  SMCanvas is an intermediary between the game and the HTML element that it draws into.
 *  It is used by SMAgents and SMMap in order to draw; they never draw directly onto the
 *  element.
 */
defineClass(
  'SMCanvas',
  function (aCanvas, viewport, engine) {
    this.element = aCanvas;
    this.context = aCanvas.getContext('2d');
    this.engine = engine;

    this.width = SMMetrics.BlockToPx(kSMEngineGameWidth);
    this.height = SMMetrics.BlockToPx(kSMEngineGameHeight);

    this.viewport = viewport;

    this.element.height = this.height;
    this.element.width = this.width;
    this.element.style.height = this.height + 'px';
    this.element.style.width = this.width + 'px';

    this.clear();
  },

  //  Properties
  {
    lastDrawnViewport: null
  },

  //  Methods
  {
    clear: function() {
      this.context.fillStyle = '#000';

      // note: intentionally not using our wrapper method; we want screen coordinations, not game coordinations
      this.context.fillRect(0, 0, this.width, this.height);

      //  Start by marking everything as dirty; this will cause map renderer to render the whole screen.
      var x = SMMetrics.PxToNearestBlockPx(this.viewport.x);
      var y = SMMetrics.PxToNearestBlockPx(this.viewport.y);
      this.dirtyRects = [{ x: x, y: y, width: this.width, height: this.height }];
    },
    fillRect: function(fillStyle, absoluteX, absoluteY, width, height) {
      if (!fillStyle) {
        debugger
      }
      this.context.fillStyle = fillStyle;

      var adjustedPos = this.adjustPos(absoluteX, absoluteY);
      if (adjustedPos.x > this.viewport.x + this.viewport.width || adjustedPos.y > this.viewport.y + this.viewport.height) {
        return;
      }

      var adjustedWidth = Math.min(this.width - adjustedPos.x, width);
      var adjustedHeight = Math.min(this.height - adjustedPos.y, height);

      this.markAbsoluteRectDirty(absoluteX, absoluteY, adjustedWidth, adjustedHeight);

      this.context.fillRect(adjustedPos.x, adjustedPos.y, adjustedWidth, adjustedHeight);
    },
    adjustPos: function(absoluteX, absoluteY) {
      return {
        x: absoluteX - this.viewport.x,
        y: absoluteY + this.viewport.y
      };
    },
    drawImage: function(image, absoluteX, absoluteY, fromPlayer) {
      absoluteX = parseInt(absoluteX);
      absoluteY = parseInt(absoluteY);

      var adjustedPos = this.adjustPos(absoluteX, absoluteY);

      if (adjustedPos.x > this.viewport.x + this.viewport.width || adjustedPos.y > this.viewport.y + this.viewport.height) {
        //  off screen; ignore
        return;
      }

      //  TODO: clip right-hand edge of image to edge of viewable area in canvas (only needed when canvas is wider than viewport)

      this.markAbsoluteRectDirty(absoluteX, absoluteY, kSMEngineBlockSize, kSMEngineBlockSize, !!fromPlayer);

      this.context.drawImage(image, adjustedPos.x, adjustedPos.y);
    },
    markAbsoluteRectDirty: function(x, y, width, height, fromPlayer) {
      this.dirtyRects.push({ x: x, y: y, width: width, height: height, fromPlayer: fromPlayer });
    },
    markRelativeRectDirty: function(x, y, width, height, fromPlayer) {
      this.markAbsoluteRectDirty(x + this.viewport.x, y + this.viewport.y, width, height, fromPlayer);
    },
    setViewport: function(newViewport) {
      //  Set the new viewport
      this.viewport = { x: newViewport.x, y: newViewport.y, width: newViewport.width, height: newViewport.height };

      //  See whether we can optimize the next redraw
      var enableOptimizedViewportMovement = true;
      if (!this.lastDrawnViewport || newViewport.height != this.lastDrawnViewport.height || newViewport.width != this.lastDrawnViewport.width) {
        //  Viewport changed size; must redraw the entire screen
        enableOptimizedViewportMovement = false;
      }

      if (enableOptimizedViewportMovement) {
        //  When changing the viewport, we must do two things:
        //  1. Move the existing contents of the canvas by the appropriate offset, so we don't redraw more than we have to
        //  2. Mark the newly revealed parts of the viewport as dirty so they are redrawn

        //  Step one: Copy graphics to new viewport
        //  e.g. if the new viewport is offset by 10px horizontally, move current contents over horizontally
        var destX = this.lastDrawnViewport.x - newViewport.x;
        var destY = this.lastDrawnViewport.y - newViewport.y;
        var destWidth = this.lastDrawnViewport.width;
        var destHeight = this.lastDrawnViewport.height;

        this.context.drawImage(this.element, 0, 0, destWidth, destHeight, destX, destY, destWidth, destHeight);

        //  Step two: The disjoint regions of these two viewports must be marked as dirty
        //  If we move horizontally, we need to redraw a tall, skinny rectangle on the left or right edge
        //  If we move vertically, we need to draw a wide, short rectangle on the top or bottom edge
        if (newViewport.x != this.lastDrawnViewport.x) {
          var hRectWidth = Math.abs(newViewport.x - this.lastDrawnViewport.x);
          var hRectX = (newViewport.x > this.lastDrawnViewport.x) ? (newViewport.width - hRectWidth) : 0;
          this.markRelativeRectDirty(hRectX, 0, hRectWidth, newViewport.height);
        }
        if (newViewport.y != newViewport.y) {
          var vRectHeight = Math.abs(newViewport.y - this.lastDrawnViewport.y);
          var vRectY = newViewport.height - vRectHeight;

          this.markRelativeRectDirty(0, vRectY, newViewport.width, vRectHeight);
        }
      } else {
        //  Brute-force; redraw the entire canvas
        this.clear();
      }

      this.lastDrawnViewport = this.viewport;
    }
  }
);