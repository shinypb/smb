'use strict';
defineClass(
  'SMQuestionBlock',
  'SMAgent',
  function(engine, startBlockX, startBlockY) {
    SMAgent.prototype.constructor.apply(this, arguments);

    this.pxPos = {
      x: SMMetrics.BlockToPx(startBlockX),
      y: SMMetrics.BlockToPx(startBlockY)
    };
  },

  //  Mixins
  WithBoundingBox,

  //  Properties
  {
    animationFrameCount: 4,
    bounds: kSMAgentHitBounds.block,
    image: SMImages['question-block'],
    animationFrameDuration: 125
  },

  //  Methods
  {
    draw: function() {
      var frameNumber = Math.ceil(this.engine.now / this.animationFrameDuration) % this.animationFrameCount;
      var srcY = kSMEngineBlockSize * frameNumber;
      this.engine.canvas.drawImageSlice(this.image, 0, srcY, this.pxPos.x, this.pxPos.y);
    },
    tick: function() {
      var playerBoundingBox = this.engine.player.boundingBox();
      var ourBoundingBox = this.boundingBox();

      var isUnderBlock = (playerBoundingBox.right >= ourBoundingBox.left)
                      && (playerBoundingBox.left <= ourBoundingBox.right);

      if (isUnderBlock && playerBoundingBox.top == ourBoundingBox.bottom) {
        //  Bonk!
        this.engine.removeAgent(this);
        return;
      }

      this.draw();
    }
  }
);