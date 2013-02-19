'use strict';
defineMixin('SMPlayerMovement', {
  reduceSpeedTo: function(speed, maxSpeed, deceleration) {
    if (speed > maxSpeed) {
      speed = Math.max(maxSpeed, speed - (deceleration * this.engine.secondsSincePreviousFrame));
    }

    if (speed < -maxSpeed) {
      speed = Math.min(-maxSpeed, speed + (deceleration * this.engine.secondsSincePreviousFrame));
    }
    return speed;
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
    this.sprinting = false;

    // If sprinting, increase max speed.
    if (this.ran && this.engine.now - this.ran > kSMPlayerSprintTime) {
      maxSpeed = kSMPlayerSprintMaxBlocksPerSecond;
      this.sprinting = true;
    }

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
      this.timeOfLastWalkFrame = this.engine.now;
      this.walkFrame = kSMPlayerStartWalkFrame;

    } else {
      var fractionOfFullSpeed = this.hSpeed / maxSpeed;
      var durationBasedOnCurrentVelocity = (1 / fractionOfFullSpeed) * kSMPlayerMinimumWalkFrameDuration;
      var minimumDuration = 64;
      var frameDuration = Math.max(minimumDuration, durationBasedOnCurrentVelocity);

      this.timeOfLastWalkFrame = this.timeOfLastWalkFrame || this.engine.now;

      if (this.engine.now - this.timeOfLastWalkFrame > frameDuration) {
        this.timeOfLastWalkFrame = this.engine.now;
        this.walkFrame = (this.walkFrame + 1) % kSMPlayerImages[this.state][kSMPlayerDirectionString[this.direction]].walking.length;
      }
    }

    if (this.hSpeed > 0 && this.engine.keyMap[kSMKeyLeft]) {
      // Player is moving right, but wants to go left; skid.
      this.hSpeed = this.reduceSpeedTo(this.hSpeed, 0, kSMPlayerSkidDeceleration);

    } else if (this.hSpeed < 0 && this.engine.keyMap[kSMKeyRight]) {
      // Player is moving left, but wants to go right; skid.
      this.hSpeed = this.reduceSpeedTo(this.hSpeed, 0, kSMPlayerSkidDeceleration);
    }

    this.hSpeed += (this.direction * acceleration * this.engine.secondsSincePreviousFrame);

    // Sprint detection
    if (!this.ran && Math.abs(this.hSpeed) >= kSMPlayerRunMaxBlocksPerSecond) {
      this.ran = +new Date;
    } else if (Math.abs(this.hSpeed) < kSMPlayerRunMaxBlocksPerSecond) {
      this.ran = null;
    }

    this.hSpeed = this.reduceSpeedTo(this.hSpeed, maxSpeed, kSMPlayerDeceleration);

    if (this.hSpeed) {
      var safePx = this.requestSafeHorizontalPixel();
      this.pxPos.x += safePx.delta_x;
      if (safePx.collision) {
        this.hSpeed = 0;
        this.pxPos.x = Math.floor(this.pxPos.x);
      }
    }
  },
  updateVState: function() {
    this.vSpeed += kSMPlayerGravity;

    if (!this.alive) {
      this.pxPos.y = Math.min(this.pxPos.y + (this.vSpeed * kSMEngineBlockSize * this.engine.secondsSincePreviousFrame), 388);
      return;
    }

    var maxSpeed = kSMPlayerFallMaxBlocksPerSecond;

    // Find out if the player is trying to jump.
    if (this.engine.keyMap[kSMKeyJump] && this.standing) {
      this.jumpStarted = this.engine.now;
      if (!this.ran) {
        this.jumpedBoostTime = kSMPlayerStandJumpBoostTime;
      } else if (!this.sprinting) {
        this.jumpedBoostTime = kSMPlayerRunJumpBoostTime;
      } else {
        this.jumpedBoostTime = kSMPlayerSprintJumpBoostTime;
      }

      SMAudio.playFromStart(kSMPlayerAudioJumpSmall);
    }

    var safePx = this.requestSafeVerticalPixel();

    this.standing = this.vSpeed >= 0 && safePx.collision;

    if (this.vSpeed < 0 && safePx.collision) {
      // moving up with a collision
      this.vSpeed = 0;
      this.jumpStarted -= this.jumpedBoostTime;
    } else if (this.vSpeed >= 0 && safePx.collision) {
      // moving down with a collision
      this.vSpeed = 0;
    }

    if (this.engine.now - this.jumpStarted < this.jumpedBoostTime) {
      //  Still jumping upwards
      this.vSpeed = kSMPlayerJumpBoost;
    }

    if (!this.engine.keyMap[kSMKeyJump]) {
      this.jumpStarted = null;
    }

    this.pxPos.y += safePx.delta_y;
    if (safePx.collision) {
      this.pxPos.y = Math.floor(this.pxPos.y);
    }
  }
});