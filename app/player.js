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
    /**
     *  Updates the player's horizontal state — that is, movement to the left or right from
     *  walking or running (and eventually, movement when jumping/falling).
     */

    this.prevHState = this.hState;
    var now = new Date;

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
        //  Player just started moving
        this.speed = kSMPlayerInitialSpeed;

        //  Always start out with the walking animation frame
        this.walkState = true;
        this.timeOfLastWalkFrame = now;
      } else if (this.hState != kSMPlayerHorizontalStateIdle && this.prevHState != kSMPlayerHorizontalStateIdle && this.hState != this.prevHState) {
        //  Just turned around; cut speed and start skidding
        this.skidStartedAt = this.engine.tickNumber;
        this.skidDuration = kSMPlayerSkidDurationInSeconds * (this.speed / maxSpeed);
        this.speed = Math.max(1, this.speed * kSMPlayerChangedDirectionPenalty);
      } else {

        if (!this.engine.keyMap[kSMKeyAction] && this.speed > kSMPlayerWalkMaxBlocksPerSecond) {
          //  Walking; if going faster than walking max speed, declerate gradually
          acceleration = kSMPlayerDecelerationFromRunToWalk;
          maxSpeed = kSMPlayerRunMaxBlocksPerSecond; // bump our max speed temporarily
        }

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

    //  Figure out which animation frame to draw -- walking, skidding, etc.
    this.playerImageName = (this.facingDirection == kSMPlayerFaceRight) ? kSMPlayerImageRight : kSMPlayerImageLeft;
    if (this.skidStartedAt) {
      //  Player is skidding; see how long it's been since we started
      var timeSinceSkidStarted = (this.engine.tickNumber - this.skidStartedAt) / kSMEngineFPS;

      if (timeSinceSkidStarted <= this.skidDuration) {
        //  Still skidding
        this.playerImageName = (this.facingDirection == kSMPlayerFaceRight) ? kSMPlayerImageLeftSkid : kSMPlayerImageRightSkid;
      } else {
        //  Done skidding
        this.skidStartedAt = null;
        this.speed = kSMPlayerSpeedAfterSkidFinishes;
      }
    } else if (this.speed) {
      //  Walking/running; see if we want to draw the alterate walk frame

      var fractionOfFullSpeed = this.speed / maxSpeed;
      var frameDuration = Math.max((1 / fractionOfFullSpeed) * (kSMPlayerMinimumWalkFrameDuration * kSMEngineFPS), kSMEngineFPS);

      this.timeOfLastWalkFrame = this.timeOfLastWalkFrame || now;
      if (now - this.timeOfLastWalkFrame > frameDuration) {
        this.timeOfLastWalkFrame = now;
        this.walkState = !this.walkState;
      }

      if (this.walkState) {
        //  Draw alternate animation frame of walking
        this.playerImageName = (this.facingDirection == kSMPlayerFaceRight) ? kSMPlayerImageRightWalk : kSMPlayerImageLeftWalk;
      }
    }

    if (this.speed != 0) {
      //  Move the player's position

      var magnitude = (this.hState == kSMPlayerHorizontalStateLeft) ? -1 : 1;

      this.pxPos.x += (magnitude * this.speed * kSMEngineBlockSize * kSMFrameUnit);
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