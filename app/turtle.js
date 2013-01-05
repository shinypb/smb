'use strict';
defineClass('SMTurtle', 'SMAgent', function(engine, startBlockX, startBlockY) {
  SMAgent.prototype.constructor.apply(this, arguments);
  this.turtleImageName = kSMTurtleWalkImages[this.animFrame];
  this.lastStep = +new Date;

  this.pxPos = {
    x: SMMetrics.BlockToPx(startBlockX),
    y: SMMetrics.BlockToPx(startBlockY) - 22
  };
}, {
  bounds: kSMAgentHitBounds.turtleGreen,
  canHurtPlayer: true,
  alive: true,
  animFrame: 0,

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
    //  TODO: move this down into a hypothetical SMSquishableAgent base class, shared with SMGoomba
    SMAudio.playFromStart(kSMAgentAudioSquish);
    this.squishTime = +new Date;
    this.canHurtPlayer = false;
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