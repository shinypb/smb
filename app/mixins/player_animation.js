'use strict';
defineMixin('SMPlayerAnimation', {
  chooseAnimationFrames: function() {
    /**
     *  Updates the player's horizontal state — that is, movement to the left or right from
     *  walking or running (and eventually, movement when jumping/falling).
     */
    if (!this.alive) {
      this.playerImageName = kSMPlayerImages['dead'][kSMPlayerDirectionString[kSMPlayerDirectionCenter]].dead[0];
      return;
    }

    // Choose animation frames.
    if (this.hSpeed === 0) {
      this.timeOfLastWalkFrame = this.engine.now;
      this.walkFrame = kSMPlayerStartWalkFrame;

    } else {
      var maxSpeed = this.engine.keyMap[kSMKeyAction] ? kSMPlayerRunMaxBlocksPerSecond : kSMPlayerWalkMaxBlocksPerSecond;
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

    this.playerImageName = kSMPlayerImages[this.state][kSMPlayerDirectionString[this.direction]].walking[this.walkFrame];

    if (this.hSpeed > 0 && this.engine.keyMap[kSMKeyLeft]) {
      // Player is moving right, but wants to go left; skid.
      this.playerImageName = kSMPlayerImages[this.state][kSMPlayerDirectionString[this.direction * -1]].skidding[0];

    } else if (this.hSpeed < 0 && this.engine.keyMap[kSMKeyRight]) {
      // Player is moving left, but wants to go right; skid.
      this.playerImageName = kSMPlayerImages[this.state][kSMPlayerDirectionString[this.direction * -1]].skidding[0];
    }

    if (!this.standing) {
      this.playerImageName = kSMPlayerImages[this.state][kSMPlayerDirectionString[this.direction]].jumping[0];
    }
  }
});