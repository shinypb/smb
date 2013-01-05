'use strict';
defineClass('SMTurtle', 'SMAgent', function(engine, startBlockX, startBlockY) {
  SMAgent.prototype.constructor.apply(this, arguments);
  this.alive = true;
  this.animFrame = 0;
  this.turtleImageName = kSMTurtleWalkImages[this.animFrame];
  this.lastStep = +new Date;

  this.pxPos = {
    x: SMMetrics.BlockToPx(startBlockX),
    y: SMMetrics.BlockToPx(startBlockY) - 22
  };
}, {
  bounds: kSMAgentHitBounds.turtleGreen,
  draw: function() {
    this.now = +new Date;

    this.engine.canvas.drawImage(SMImages[this.turtleImageName], this.pxPos.x, this.pxPos.y);
  },
  updateHState: function() {
    if (this.now - this.lastStep > 300) {
      this.lastStep = +new Date;
      this.animFrame = (this.animFrame + 1) % kSMTurtleWalkImages.length;
      this.turtleImageName = kSMTurtleWalkImages[this.animFrame];
    }
  },
  updateVState: function() {
  },
  squish: function() {
//     SMAudio[kSMAgentAudioSquish].playFromStart();
    this.squishTime = +new Date;
  },
  changeDirection: function() {
    this.direction *= -1;
  },
  tick: function() {
    if (this.alive) {
      this.updateHState();
      this.updateVState();

      this.draw();
    } else {
      this.engine.removeAgent(this);
    }
  }
});