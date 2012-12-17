defineClass('SMGoomba', 'SMAgent', function(engine, startBlockX, startBlockY) {
  SMAgent.prototype.constructor.apply(this, arguments);

  this.speed = kSMGoombaSpeed;
  this.direction = kSMGoombaStartingDirection;
  this.alive = true;
  this.walkFrame = 0;
  this.squishTime = null;

  this.pxPos = {
    x: SMMetrics.BlockToPx(startBlockX),
    y: SMMetrics.BlockToPx(startBlockY)
  };
}, {
  draw: function() {
    this.engine.canvas.drawImage(SMImages[this.goombaImageName], this.pxPos.x, this.pxPos.y);
  },
  updateHState: function() {
    var now = +new Date;
    if (!this.squishTime) {
      // Living goomba!
      this.timeOfLastWalkFrame = this.timeOfLastWalkFrame || now;
      if (now - this.timeOfLastWalkFrame > kSMGoombaWalkFrameDuration) {
        this.timeOfLastWalkFrame = now;
        this.walkFrame = (this.walkFrame + 1) % kSMGoombaWalkImages.length;
      }

      // Cycle through the array of animation frames.
      this.goombaImageName = kSMGoombaWalkImages[this.walkFrame];


    } else {
      // Squished goomba!
      this.goombaImageName = kSMGoombaSquishImage;
      this.speed = 0;

      var squishDuration = kSMGoombaSquishFrameDuration;
      if (now - this.timeOfLastWalkFrame > squishDuration) {
        this.alive = false;
      }
    }

    // Change direction if we're running into a solid block.
    if (eng.map.getBlockAtPx(this.pxPos.x, this.pxPos.y).isSolid) {
      this.changeDirection();
    }

    this.pxPos.x += (this.direction * this.speed * kSMEngineBlockSize * kSMFrameUnit);
  },
  updateVState: function() {
    //  TODO: falling/jumping
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