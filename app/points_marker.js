'use strict';
defineClass(
  'SMPointsMarker',
  'SMAgent',
  function(engine, startPxX, startPxY) {
    SMAgent.prototype.constructor.apply(this, arguments);

    this.pxPos = {
      x: startPxX,
      y: startPxY
    };

    this.startTime = engine.now;
  },

  //  Mixins
  WithBoundingBox,

  //  Properties
  {
    isLazy: false,
    startTime: null,
    bounds: kSMAgentHitBounds.block,
    image: SMImages['sprite-misc'],
    isEmpty: false,
    yOffset: 0
  },

  //  Methods
  {
    draw: function () {
      var srcX = 0, srcY = 0;
      this.engine.canvas.drawImageSlice(this.image, 0, srcY, this.pxPos.x, this.pxPos.y - this.yOffset);
    },
    tick: function() {
      var t = this.engine.now - this.startTime;

      if (t > kSMPointsMarkerAnimationDuration) {
        this.engine.removeAgent(this);
      } else {
        this.yOffset = (t / kSMPointsMarkerAnimationDuration) * kSMPointsMarkerMaxOffset;
        this.draw();
      }
    }
  }
);