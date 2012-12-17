defineClass('SMPlayer', 'SMAgent', function(engine, startBlockX, startBlockY) {
  SMAgent.prototype.constructor.apply(this, arguments);
  this.direction = kSMPlayerDirectionRight;
  this.state = kSMPlayerStartState;
  this.hSpeed = kSMPlayerHorizontalSpeed;
  this.vSpeed = kSMPlayerVerticalSpeed;
  this.walkFrame = kSMPlayerStartWalkFrame;

  this.pxPos = {
    x: SMMetrics.BlockToPx(startBlockX),
    y: SMMetrics.BlockToPx(startBlockY)
  };
}, {
  draw: function() {
    this.engine.canvas.drawImage(SMImages[this.playerImageName], this.pxPos.x, this.pxPos.y, true);
  },
  updateHState: function() {
    /**
     *  Updates the player's horizontal state — that is, movement to the left or right from
     *  walking or running (and eventually, movement when jumping/falling).
     */
    var acceleration = this.engine.keyMap[kSMKeyAction] ? kSMPlayerRunAcceleration : kSMPlayerWalkAcceleration;
    var maxSpeed = this.engine.keyMap[kSMKeyAction] ? kSMPlayerRunMaxBlocksPerSecond : kSMPlayerWalkMaxBlocksPerSecond;

    if (this.engine.keyMap[kSMKeyLeft]) {
      // Player pushing left
      this.direction = kSMPlayerDirectionLeft;
    } else if (this.engine.keyMap[kSMKeyRight]) {
      // Player pushing right
      this.direction = kSMPlayerDirectionRight;
    } else {
      // No input
      acceleration = 0;
      this.hSpeed = this.reduceSpeedTo(this.hSpeed, 0, kSMPlayerDeceleration);
    }

    // Choose animation frames.
    if (this.hSpeed === 0) {
      this.timeOfLastWalkFrame = this.now;
      this.walkFrame = kSMPlayerStartWalkFrame;

    } else {
      var fractionOfFullSpeed = this.hSpeed / maxSpeed;
      var frameDuration = Math.max((1 / fractionOfFullSpeed) * (kSMPlayerMinimumWalkFrameDuration * kSMEngineFPS), kSMEngineFPS);

      this.timeOfLastWalkFrame = this.timeOfLastWalkFrame || this.now;

      if (this.now - this.timeOfLastWalkFrame > frameDuration) {
        this.timeOfLastWalkFrame = this.now;
        this.walkFrame = (this.walkFrame + 1) % kSMPlayerImages[this.state][kSMPlayerDirectionString[this.direction]].walking.length;
      }
    }

    this.playerImageName = kSMPlayerImages[this.state][kSMPlayerDirectionString[this.direction]].walking[this.walkFrame];

    if (this.hSpeed > 0 && this.engine.keyMap[kSMKeyLeft]) {
      // Player is moving right, but wants to go left; skid.
      this.playerImageName = kSMPlayerImages[this.state][kSMPlayerDirectionString[this.direction * -1]].skidding[0];
      this.hSpeed = this.reduceSpeedTo(this.hSpeed, 0, kSMPlayerSkidDeceleration);

    } else if (this.hSpeed < 0 && this.engine.keyMap[kSMKeyRight]) {
      // Player is moving left, but wants to go right; skid.
      this.playerImageName = kSMPlayerImages[this.state][kSMPlayerDirectionString[this.direction * -1]].skidding[0];
      this.hSpeed = this.reduceSpeedTo(this.hSpeed, 0, kSMPlayerSkidDeceleration);
    }

    this.hSpeed += (this.direction * acceleration * kSMFrameUnit);
    this.hSpeed = this.reduceSpeedTo(this.hSpeed, maxSpeed, kSMPlayerDeceleration);

    if (this.hSpeed !== 0) {
      this.pxPos.x += this.hSpeed * kSMEngineBlockSize * kSMFrameUnit;

      var ly = this.pxPos.y + kSMPlayerHorizontalBounding[0],
        rx = this.pxPos.x + kSMPlayerHorizontalBounding[1],
        ry = this.pxPos.y + kSMPlayerHorizontalBounding[2],
        lx = this.pxPos.x + kSMPlayerHorizontalBounding[3];

      if (eng.map.getBlockAtPx(lx, ly).isSolid) {
        // Check upper left horizontal movement point (moving left)
        this.pxPos.x = SMMetrics.BlockToPx(SMMetrics.PxToBlock(lx) + 1);
        this.hSpeed = 0;
      } else if (eng.map.getBlockAtPx(lx, ry).isSolid) {
        // Check lower left horizontal movement point (moving left)
        this.pxPos.x = SMMetrics.BlockToPx(SMMetrics.PxToBlock(lx) + 1);
        this.hSpeed = 0;
      } else if (eng.map.getBlockAtPx(rx, ly).isSolid) {
        // Check upper right horizontal movement point (moving right)
        this.pxPos.x = SMMetrics.BlockToPx(SMMetrics.PxToBlock(rx) - 1);
        this.hSpeed = 0;
      } else if (eng.map.getBlockAtPx(rx, ry).isSolid) {
        // Check lower right horizontal movement point (moving right)
        this.pxPos.x = SMMetrics.BlockToPx(SMMetrics.PxToBlock(rx) - 1);
        this.hSpeed = 0;
      }
    }
  },
  reduceSpeedTo: function(speed, maxSpeed, deceleration) {
    if (speed > maxSpeed) {
      speed = Math.max(0, speed - (deceleration * kSMFrameUnit));
    }

    if (speed < -maxSpeed) {
      speed = Math.min(0, speed + (deceleration * kSMFrameUnit));
    }
    return speed;
  },
  updateVState: function() {
    this.standing = false;
    this.vSpeed += kSMPlayerGravity;

    this.pxPos.y += (this.vSpeed * kSMEngineBlockSize * kSMFrameUnit);
    var ly = this.pxPos.y + kSMPlayerVerticalBounding[0],
      rx = this.pxPos.x + kSMPlayerVerticalBounding[1],
      ry = this.pxPos.y + kSMPlayerVerticalBounding[2],
      lx = this.pxPos.x + kSMPlayerVerticalBounding[3];

    if (eng.map.getBlockAtPx(lx, ly).isSolid) {
      // Check upper left vertical movement point (moving up)
      this.pxPos.y = SMMetrics.BlockToPx(SMMetrics.PxToBlock(ly) + 1);
      this.vSpeed = 0;
      this.jumpStarted -= kSMPlayerJumpBoostTime;
    } else if (eng.map.getBlockAtPx(rx, ly).isSolid) {
      // Check upper right vertical movement point (moving up)
      this.pxPos.y = SMMetrics.BlockToPx(SMMetrics.PxToBlock(ly) + 1);
      this.vSpeed = 0;
      this.jumpStarted -= kSMPlayerJumpBoostTime;
    } else if (eng.map.getBlockAtPx(lx, ry).isSolid) {
      // Check lower left vertical movement point (moving down)
      this.pxPos.y  = SMMetrics.BlockToPx(SMMetrics.PxToBlock(ry) - 1);
      this.vSpeed = 0;
      this.standing = true;
    } else if (eng.map.getBlockAtPx(rx, ry).isSolid) {
      // Check lower right vertical movement point (moving down)
      this.pxPos.y  = SMMetrics.BlockToPx(SMMetrics.PxToBlock(ry) - 1);
      this.vSpeed = 0;
      this.standing = true;
    }

    if (this.engine.keyMap[kSMKeyJump] && this.standing && !this.jumpStarted) {
      this.jumpStarted = this.now;
      this.standing = false;
    }

    if (this.now - this.jumpStarted < kSMPlayerJumpBoostTime) {
      this.vSpeed = kSMPlayerJumpBoost;
    }

    if (!this.engine.keyMap[kSMKeyJump]) {
      this.jumpStarted = null;
    }

    if (!this.standing) {
      this.playerImageName = kSMPlayerImages[this.state][kSMPlayerDirectionString[this.direction]].jumping[0];
    }
  },
  tick: function() {
    this.now = +new Date;

    this.updateHState();
    this.updateVState();

    this.draw();
  }
});