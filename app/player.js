defineClass('SMPlayer', 'SMAgent', function(engine, startBlockX, startBlockY) {
  SMAgent.prototype.constructor.apply(this, arguments);

  this.playerImageName = 'player-right';
  this.facingDirection = kSMPlayerFaceRight;
  this.direction = 1;
  this.skidStartedAt = null;
  this.hState = kSMPlayerHorizontalStateIdle;
  this.vState = kSMPlayerVerticalStateIdle;
  this.speed = 0;
  this.acceleration = 1;

  this.pxPos = {
    x: SMMetrics.BlockToPx(startBlockX),
    y: SMMetrics.BlockToPx(startBlockY)
  };
}, {
  draw: function() {
    this.engine.canvas.drawImage(SMImages[this.playerImageName], this.pxPos.x, this.pxPos.y);
  },
  updateHState: function() {
    /**
     *  Updates the player's horizontal state — that is, movement to the left or right from
     *  walking or running (and eventually, movement when jumping/falling).
     */

    var now = new Date;

    var acceleration = this.engine.keyMap[kSMKeyAction] ? 28 : 19;
    var maxSpeed = this.engine.keyMap[kSMKeyAction] ? kSMPlayerRunMaxBlocksPerSecond : kSMPlayerWalkMaxBlocksPerSecond;

    if (this.engine.keyMap[kSMKeyLeft]) {
      // Player pushing left
      this.direction = -1;
    } else if (this.engine.keyMap[kSMKeyRight]) {
      // Player pushing right
      this.direction = 1;
    } else {
      // No input
      acceleration = 0;
      this.reduceSpeedTo(0, 30);
    }

    // Choose animation frames.
    if (this.speed === 0) {
      this.timeOfLastWalkFrame = now;
      this.walkState = false;
    } else {
      var fractionOfFullSpeed = this.speed / maxSpeed;
      var frameDuration = Math.max((1 / fractionOfFullSpeed) * (kSMPlayerMinimumWalkFrameDuration * kSMEngineFPS), kSMEngineFPS);

      this.timeOfLastWalkFrame = this.timeOfLastWalkFrame || now;
      if (now - this.timeOfLastWalkFrame > frameDuration) {
        this.timeOfLastWalkFrame = now;
        this.walkState = !this.walkState;
      }
    }

    if (this.walkState) {
      this.playerImageName = (this.direction == 1) ? kSMPlayerImageRightWalk : kSMPlayerImageLeftWalk;
    } else {
      this.playerImageName = (this.direction == 1) ? kSMPlayerImageRight : kSMPlayerImageLeft;
    }
    

    if (this.speed > 0 && this.engine.keyMap[kSMKeyLeft]) {
      // Player is moving right, but wants to go left; skid.
      this.playerImageName = kSMPlayerImageRightSkid;
      this.reduceSpeedTo(0, 15);
    } else if (this.speed < 0 && this.engine.keyMap[kSMKeyRight]) {
      // Player is moving left, but wants to go right; skid.
      this.playerImageName = kSMPlayerImageLeftSkid;
      this.reduceSpeedTo(0, 15);
    }
    
    this.speed += (this.direction * acceleration * kSMFrameUnit);
    this.reduceSpeedTo(maxSpeed, 30);

    if (this.speed !== 0) {
      this.pxPos.x += (this.speed * kSMEngineBlockSize * kSMFrameUnit);
    }
  },
  reduceSpeedTo: function(value, decceleration) {
    if (this.speed > value) {
      this.speed = Math.max(0, this.speed - (decceleration * kSMFrameUnit));
    }

    if (this.speed < -value) {
      this.speed = Math.min(0, this.speed + (decceleration * kSMFrameUnit));
    }
  },
  updateVState: function() {
    //  TODO: falling/jumping
  },
  tick: function() {

    this.updateHState();
    this.updateVState();

    this.draw();
  }
});