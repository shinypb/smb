'use strict';
defineClass(
  'SMPlayer',
  'SMAgent',
  function(engine, startBlockX, startBlockY) {
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
  },

  //  Mixins
  SMPlayerMovement,
  WithBoundingBox,

  //  Properties
  {
    bounds: kSMAgentHitBounds.player
  },

  //  Methods
  {
    draw: function() {
      this.engine.canvas.drawImage(SMImages[this.playerImageName], this.pxPos.x, this.pxPos.y, true);
    },
    die: function() {
      this.alive = false;
      this.direction = kSMPlayerDirectionCenter;
      SMAudio.pause(kSMEngineAudioBackgroundMusic1);
      SMAudio.playFromStart(kSMPlayerAudioLostLife);
      this.playerImageName = kSMPlayerImages[this.state][kSMPlayerDirectionString[this.direction]].dead[0];
      eng.pauseFor(500);
      this.vSpeed = kSMPlayerJumpBoost;

      setTimeout(function() {
        //  This is a temporary measure until we have a lives system. It just reloads the
        //  window after a delay. (We need to wrap window.location.reload() in a function
        //  because we can't bind it as a timeout function directly in Chrome.)
        window.location.reload()
      }, 5000);
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
      if (!this.alive || !otherAgent.canHurtPlayer) {
        return;
      }

      if (!this.intersectsWith(otherAgent)) {
        //  No collision
        return;
      }

      var squishPos = otherAgent.pxPos.y + kSMAgentSquishOffset;

      if (this.boundingBox().bottom < squishPos) {
        //  We may be able to squish the other agent
        if (this.vSpeed > 0) {
          // Squish!
          otherAgent.squish();
          this.vSpeed = kSMPlayerJumpBoost;
          this.jumpStarted = this.engine.now + kSMPlayerSquishBoostTime;
        } else {
          // Player is in the squish zone, but is moving upwards; ignore.
        }
      } else {
        this.die();
      }
    },
    tick: function() {
      this.updateHState();
      this.updateVState();

      this.draw();
    }
  }
);