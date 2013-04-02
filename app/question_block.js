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
    hitTime: null,
    bounds: kSMAgentHitBounds.block,
    image: SMImages['question-block'],
    animationFrameDuration: 125,
    isEmpty: false
  },

  //  Methods
  {
    draw: function() {
      var frameNumber;
      if (this.isEmpty) {
        frameNumber = 4; // empty block
      } else {
        frameNumber = Math.ceil(this.engine.now / this.animationFrameDuration) % this.animationFrameCount;
      }
      var srcY = kSMEngineBlockSize * frameNumber;

      var yOffset = 0;
      if (this.hitTime) {
        var t = this.engine.now - this.hitTime;
        if (t < kSMQuestionBlockBounceDuration) {
          var frameDuration = kSMQuestionBlockBounceDuration / kSMQuestionBlockBounceDistances.length;
          var frameNumber = Math.floor(t / frameDuration);
          yOffset = kSMQuestionBlockBounceDistances[frameNumber];
        } else {
          this.hitTime = null;
        }
      }

      this.engine.canvas.drawImageSlice(this.image, 0, srcY, this.pxPos.x, this.pxPos.y - yOffset);
    },
    tick: function() {
      var playerBoundingBox = this.engine.player.boundingBox();
      var ourBoundingBox = this.boundingBox();

      var playerHitPoint = (playerBoundingBox.left + playerBoundingBox.right) / 2;

      var isUnderBlock = (playerHitPoint >= ourBoundingBox.left)
                      && (playerHitPoint <= ourBoundingBox.right);

      if (!this.isEmpty && isUnderBlock && playerBoundingBox.top == ourBoundingBox.bottom) {
        //  Bonk!
        this.isEmpty = true;
        this.hitTime = this.engine.now;
      }

      this.draw();
    }
  }
);