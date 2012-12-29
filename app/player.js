defineClass('SMPlayer', 'SMAgent', function(engine, startBlockX, startBlockY) {
  SMAgent.prototype.constructor.apply(this, arguments);
  this.direction = kSMPlayerDirectionRight;
  this.state = kSMPlayerStartState;
  this.hSpeed = kSMPlayerHorizontalSpeed;
  this.vSpeed = kSMPlayerVerticalSpeed;
  this.walkFrame = kSMPlayerStartWalkFrame;
  this.alive = kSMPlayerStartAlive;

  this.pxPos = {
    x: SMMetrics.BlockToPx(startBlockX),
    y: SMMetrics.BlockToPx(startBlockY)
  };
}, {
  bounds: kSMAgentHitBounds.player,

  draw: function() {
    this.engine.canvas.drawImage(SMImages[this.playerImageName], this.pxPos.x, this.pxPos.y, true);
  },
  updateHState: function() {
    /**
     *  Updates the player's horizontal state — that is, movement to the left or right from
     *  walking or running (and eventually, movement when jumping/falling).
     */
    if (!this.alive) {
      return;
    }

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

      var top = this.pxPos.y + this.bounds[kSMTop],
        right = this.pxPos.x + this.bounds[kSMRight],
        bottom = this.pxPos.y + this.bounds[kSMBottom],
        left = this.pxPos.x + this.bounds[kSMLeft];

      if ((eng.map.getBlockAtPx(left, top + 1).isSolid || eng.map.getBlockAtPx(left, bottom - 1).isSolid) && this.hSpeed < 0) {
        // Check upper left horizontal movement point (moving left)
        this.pxPos.x = eng.map.getBlockRightPx(left) - this.bounds[kSMLeft];
        this.hSpeed = 0;
      } else if ((eng.map.getBlockAtPx(right, top + 1).isSolid || eng.map.getBlockAtPx(right, bottom - 1).isSolid) && this.hSpeed > 0) {
        // Check upper right horizontal movement point (moving right)
        this.pxPos.x = eng.map.getBlockLeftPx(right) - this.bounds[kSMRight];
        this.hSpeed = 0;
      }
    }
  },
  updateVState: function() {
    this.vSpeed += kSMPlayerGravity;
    if (!this.alive) {
      this.pxPos.y = Math.min(this.pxPos.y + (this.vSpeed * kSMEngineBlockSize * kSMFrameUnit), 388);
      return;
    }

    this.standing = false;

    var delta = (this.vSpeed * kSMEngineBlockSize * kSMFrameUnit);
    this.pxPos.y += delta;
    var top = this.pxPos.y + this.bounds[kSMTop],
      right = this.pxPos.x + this.bounds[kSMRight],
      bottom = this.pxPos.y + this.bounds[kSMBottom],
      oldBottom = this.pxPos.y + this.bounds[kSMBottom] - delta - 1,
      left = this.pxPos.x + this.bounds[kSMLeft];

    if ((this.engine.map.getBlockAtPx(left + 1, top).isSolid || this.engine.map.getBlockAtPx(right - 1, top).isSolid) && this.vSpeed < 0) {
      // Check upper left vertical movement point (moving up)
      this.pxPos.y = eng.map.getBlockBottomPx(top) + this.bounds[kSMTop];
      this.vSpeed = 0;
      this.jumpStarted -= kSMPlayerJumpBoostTime;
    } else if (this.vSpeed >= 0 && (this.engine.map.getBlockAtPx(left + 1, bottom).isSolid || this.engine.map.getBlockAtPx(right - 1, bottom).isSolid ||
        (!this.engine.map.getBlockAtPx(left + 1, oldBottom).canStandOn && this.engine.map.getBlockAtPx(left + 1, bottom).canStandOn) || 
        (!this.engine.map.getBlockAtPx(right - 1, oldBottom).canStandOn && this.engine.map.getBlockAtPx(right - 1, bottom).canStandOn))) {
      // Check lower left vertical movement point (moving down)
      this.pxPos.y = eng.map.getBlockTopPx(bottom) - this.bounds[kSMBottom];
      this.vSpeed = 0;
      this.standing = true;
    }

    if (this.engine.keyMap[kSMKeyJump] && this.standing && !this.jumpStarted) {
      this.jumpStarted = this.now;
      SMAudio[kSMPlayerAudioJumpSmall].playFromStart();
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
  die: function() {
    this.alive = false;
    this.direction = kSMPlayerDirectionCenter;
    SMAudio[kSMEngineAudioBackgroundMusic1].pause();
    SMAudio[kSMPlayerAudioLostLife].playFromStart();
    this.playerImageName = kSMPlayerImages[this.state][kSMPlayerDirectionString[this.direction]].dead[0];
    eng.pauseFor(500);
    this.vSpeed = kSMPlayerJumpBoost;
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
  checkCollision: function(otherAgent) {
    if (!this.alive) {
      return;
    }
    if (otherAgent.squishTime) {
      return;
    }

    var ptop = this.pxPos.y + this.bounds[kSMTop],
        pright = this.pxPos.x + this.bounds[kSMRight],
        pbottom = this.pxPos.y + this.bounds[kSMBottom],
        pleft = this.pxPos.x + this.bounds[kSMLeft];

    var otop = otherAgent.pxPos.y + otherAgent.bounds[kSMTop],
        oright = otherAgent.pxPos.x + otherAgent.bounds[kSMRight],
        obottom = otherAgent.pxPos.y + otherAgent.bounds[kSMBottom],
        oleft = otherAgent.pxPos.x + otherAgent.bounds[kSMLeft],
        osquish = otherAgent.pxPos.y + kSMAgentSquishOffset;

    var playerHorizontal = pright > oleft && pleft < oright;
    var playerVertical = pbottom > otop && ptop < obottom;

    if (playerHorizontal && playerVertical) {
      // collision
      if (pbottom < osquish && this.vSpeed > 0) {
        // squish
        otherAgent.squish();
        this.vSpeed = kSMPlayerJumpBoost;
        this.jumpStarted = this.now + kSMPlayerSquishBoostTime;
        return false;
      } else if (pbottom < osquish && this.vSpeed <= 0) {
        // Player is in the squish zone, but is moving upwards; ignore.
        return false;
      } else {
        this.die();
      }
    }
  },
  tick: function() {
    this.now = +new Date;

    this.updateHState();
    this.updateVState();

    this.draw();
  }
});