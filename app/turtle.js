defineClass('SMTurtle', 'SMAgent', function(engine, startBlockX, startBlockY) {
  SMAgent.prototype.constructor.apply(this, arguments);
  this.alive = true;

  this.pxPos = {
    x: SMMetrics.BlockToPx(startBlockX),
    y: SMMetrics.BlockToPx(startBlockY)
  };
}, {
  draw: function() {
    this.engine.canvas.drawImage(SMImages[this.goombaImageName], this.pxPos.x, this.pxPos.y);
  },
  updateHState: function() {
  },
  updateVState: function() {
  },
  squish: function() {
    SMAudio[kSMAgentAudioSquish].playFromStart();
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