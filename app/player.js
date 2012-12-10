defineClass('SMPlayer', 'SMAgent', function(engine, startBlockX, startBlockY) {
  SMAgent.prototype.constructor.apply(this, arguments);

  this.playerImageName = 'player-right';
  this.facingDirection = kSMPlayerFaceRight;
  this.skidStartedAt = null;
  this.hState = kSMPlayerHorizontalStateIdle;
  this.vState = kSMPlayerVerticalStateIdle;
  this.speed = 0;

  this.pxPos = {
    x: SMMetrics.BlockToPx(startBlockX),
    y: SMMetrics.BlockToPx(startBlockY)
  };
}, {
  draw: function() {

    this.engine.canvas.clear();

    var c = this.engine.canvas.context;
    c.drawImage(SMImages[this.playerImageName], this.pxPos.x, this.pxPos.y);
  },
  updateHState: function() {

    this.playerImageName = (this.facingDirection == kSMPlayerFaceRight) ? 'player-right' : 'player-left';

    var acceleration = this.engine.keyMap[kSMKeyAction] ? kSMPlayerRunAcceleration : kSMPlayerWalkAcceleration;
    var maxSpeed = this.engine.keyMap[kSMKeyAction] ? kSMPlayerRunMaxBlocksPerSecond : kSMPlayerWalkMaxBlocksPerSecond;

    if (this.engine.keyMap[kSMKeyLeft] || this.engine.keyMap[kSMKeyRight]) {
      //  walking/running
      if (this.engine.keyMap[kSMKeyLeft]) {
        this.hState = kSMPlayerHorizontalStateLeft;
        this.facingDirection = kSMPlayerFaceLeft;
      } else {
        this.hState = kSMPlayerHorizontalStateRight;
        this.facingDirection = kSMPlayerFaceRight;
      }

      if (this.speed == 0) {
        this.speed = kSMPlayerInitialSpeed;

        //  Always start out with the walking animation frame
        this.walkState = true;
        this.timeOfLastWalkFrame = new Date;
      } else if (this.hState != kSMPlayerHorizontalStateIdle && this.prevHState != kSMPlayerHorizontalStateIdle && this.hState != this.prevHState) {
        //  Just turned around; cut speed
        this.skidStartedAt = this.engine.tickNumber;
        this.skidDuration = kSMPlayerSkidDurationInSeconds * (this.speed / maxSpeed);
        this.speed = Math.max(1, this.speed * kSMPlayerChangedDirectionPenalty);
      } else {
        this.speed = Math.min(this.speed * acceleration, maxSpeed);
      }

    } else if (this.speed > 0) {
      //  slowing down...
      console.log('slow down');
      this.skidStartedAt = null;

      this.speed = Math.max(0, this.speed * kSMPlayerDeceleration);
      if (this.speed < 1) {
        //  stopped.
        console.log('stopped');
        this.speed = 0;
        this.hState = kSMPlayerHorizontalStateIdle;
      }
    }

    if (this.skidStartedAt) {
      //  see how long it's been
      var timeSinceSkidStarted = (this.engine.tickNumber - this.skidStartedAt) / kSMEngineFPS;

      if (timeSinceSkidStarted <= this.skidDuration) {
        //  Still skidding
        this.playerImageName = (this.facingDirection == kSMPlayerFaceRight) ? 'player-left-skid' : 'player-right-skid';
      } else {
        this.skidStartedAt = null;
      }
    } else if (this.speed) {
      //  See if we want to draw the alterate walk frame

      //  slowest = 0.5 seconds per frame (0.5 * kSMEngineFPS ticks)
      //  fastest = 0.1 seconds per frame (0.1 * kSMEngineFPS ticks)
      var fractionOfFullSpeed = this.speed / kSMPlayerWalkMaxBlocksPerSecond;

      this.timeOfLastWalkFrame = this.timeOfLastWalkFrame || new Date;
      var frameDuration = Math.max((1 / fractionOfFullSpeed) * 15, 60);
      if (new Date - this.timeOfLastWalkFrame > frameDuration) {
        this.timeOfLastWalkFrame = new Date;
        this.walkState = !this.walkState;
      }

      if (this.walkState) {
        this.playerImageName = (this.facingDirection == kSMPlayerFaceRight) ? 'player-right-walk' : 'player-left-walk';
      }
    }

    if (this.speed != 0) {
      //  Move the player

      var magnitude = (this.hState == kSMPlayerHorizontalStateLeft) ? -1 : 1;

      this.pxPos.x += (magnitude * this.speed * kSMEngineBlockSize * kSMFrameUnit);
    }

    this.prevHState = this.hState;
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