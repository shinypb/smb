'use strict';
defineClass(
  'SMPointsMarker',
  'SMAgent',
  function(engine, consecutiveStomps, startPxX, startPxY) {
    SMAgent.prototype.constructor.apply(this, arguments);
    console.log(consecutiveStomps);

    this.pxPos = {
      x: startPxX,
      y: startPxY
    };

    this.spriteOffset = (Math.min(consecutiveStomps, kSMPointsAmounts.length) - 1) * this.bounds[1];
    console.log(this.spriteOffset + 'px');

    this.startTime = engine.now;
  },

  //  Mixins
  WithBoundingBox,

  //  Properties
  {
    isLazy: false,
    startTime: null,
    bounds: kSMAgentHitBounds.pointsMarker,
    image: SMImages['sprite-misc'],
    isEmpty: false,
    yOffset: 0
  },

  //  Methods
  {
    draw: function () {
      this.engine.canvas.drawImageSlice(
        this.image,
        this.spriteOffset, 0,
        this.pxPos.x, this.pxPos.y - this.yOffset,
        false,
        this.bounds[1], this.bounds[2]
      );
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