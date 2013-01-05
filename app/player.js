'use strict';
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
},
SMPlayerMovement,
{
  bounds: kSMAgentHitBounds.player,

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
    if (!this.alive) {
      return;
    }

    if (!otherAgent.canHurtPlayer) {
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

    if (!playerHorizontal || !playerVertical) {
      //  NO collision
      return;
    }

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
  },
  tick: function() {
    this.now = +new Date;

    this.updateHState();
    this.updateVState();

    this.draw();
  }
});