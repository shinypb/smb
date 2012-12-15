defineClass('SMPlayer', 'SMAgent', function(engine, startBlockX, startBlockY) {
  SMAgent.prototype.constructor.apply(this, arguments);
  this.direction = 1;
  this.directionSprite = {
    "1": "right",
    "-1": "left"
  };
  this.state = "small";
  this.hSpeed = 0;
  this.vSpeed = 0;
  this.walkState = 0;
  this.standing = true;

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
    var now = new Date();

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
      this.reduceHSpeedTo(0, 30);
    }

    // Choose animation frames.
    if (this.hSpeed === 0) {
      this.timeOfLastWalkFrame = now;
      this.walkState = 0;
    } else {
      var fractionOfFullSpeed = this.hSpeed / maxSpeed;
      var frameDuration = Math.max((1 / fractionOfFullSpeed) * (kSMPlayerMinimumWalkFrameDuration * kSMEngineFPS), kSMEngineFPS);

      this.timeOfLastWalkFrame = this.timeOfLastWalkFrame || now;
      if (now - this.timeOfLastWalkFrame > frameDuration) {
        this.timeOfLastWalkFrame = now;
        this.walkState = (this.walkState + 1) % kSMPlayerImages[this.directionSprite[this.direction]][this.state].walking.length;
      }
    }

    this.playerImageName = kSMPlayerImages[this.directionSprite[this.direction]][this.state].walking[this.walkState];

    if (this.hSpeed > 0 && this.engine.keyMap[kSMKeyLeft]) {
      // Player is moving right, but wants to go left; skid.
      this.playerImageName = kSMPlayerImages[this.directionSprite[this.direction * -1]][this.state].skidding[0];
      this.reduceHSpeedTo(0, 20);
    } else if (this.hSpeed < 0 && this.engine.keyMap[kSMKeyRight]) {
      // Player is moving left, but wants to go right; skid.
      this.playerImageName = kSMPlayerImages[this.directionSprite[this.direction * -1]][this.state].skidding[0];
      this.reduceHSpeedTo(0, 20);
    }
    
    this.hSpeed += (this.direction * acceleration * kSMFrameUnit);
    this.reduceHSpeedTo(maxSpeed, 30);

    if (this.hSpeed !== 0) {
      this.pxPos.x += this.hSpeed * kSMEngineBlockSize * kSMFrameUnit;

      // Check upper left horizontal movement point (moving left)
      if (eng.map.rawMapData[SMMetrics.PxToBlock(this.pxPos.y + 4)][SMMetrics.PxToBlock(this.pxPos.x)] == kSMBlockWood) {
        this.pxPos.x = SMMetrics.BlockToPx(SMMetrics.PxToBlock(this.pxPos.x) + 1);
        this.hSpeed = 0;
      }

      // Check lower left horizontal movement point (moving left)
      if (eng.map.rawMapData[SMMetrics.PxToBlock(this.pxPos.y + 28)][SMMetrics.PxToBlock(this.pxPos.x)] == kSMBlockWood) {
        this.pxPos.x = SMMetrics.BlockToPx(SMMetrics.PxToBlock(this.pxPos.x) + 1);
        this.hSpeed = 0;
      }

      // Check upper right horizontal movement point (moving right)
      if (eng.map.rawMapData[SMMetrics.PxToBlock(this.pxPos.y + 4)][SMMetrics.PxToBlock(this.pxPos.x + 32)] == kSMBlockWood) {
        this.pxPos.x = SMMetrics.BlockToPx(SMMetrics.PxToBlock(this.pxPos.x + 32) - 1);
        this.hSpeed = 0;
      }

      // Check lower right horizontal movement point (moving right)
      if (eng.map.rawMapData[SMMetrics.PxToBlock(this.pxPos.y + 28)][SMMetrics.PxToBlock(this.pxPos.x + 32)] == kSMBlockWood) {
        this.pxPos.x = SMMetrics.BlockToPx(SMMetrics.PxToBlock(this.pxPos.x + 32) - 1);
        this.hSpeed = 0;
      }
    }
  },
  reduceHSpeedTo: function(value, decceleration) {
    if (this.hSpeed > value) {
      this.hSpeed = Math.max(0, this.hSpeed - (decceleration * kSMFrameUnit));
    }

    if (this.hSpeed < -value) {
      this.hSpeed = Math.min(0, this.hSpeed + (decceleration * kSMFrameUnit));
    }
  },
  updateVState: function() {
    var now = new Date().getTime();
    this.standing = false;
    this.vSpeed += 1.2;
    
    this.pxPos.y += (this.vSpeed * kSMEngineBlockSize * kSMFrameUnit);

    // Check upper left vertical movement point (moving up)
    if (eng.map.rawMapData[SMMetrics.PxToBlock(this.pxPos.y)][SMMetrics.PxToBlock(this.pxPos.x + 4)] == kSMBlockWood) {
      this.pxPos.y = SMMetrics.BlockToPx(SMMetrics.PxToBlock(this.pxPos.y) + 1);
      this.vSpeed = 0;
      this.jumpStarted -= 200;
    }

    // Check upper right vertical movement point (moving up)
    if (eng.map.rawMapData[SMMetrics.PxToBlock(this.pxPos.y)][SMMetrics.PxToBlock(this.pxPos.x + 28)] == kSMBlockWood) {
      this.pxPos.y = SMMetrics.BlockToPx(SMMetrics.PxToBlock(this.pxPos.y) + 1);
      this.vSpeed = 0;
      this.jumpStarted -= 200;
    }

    // Check lower left vertical movement point (moving down)
    if (eng.map.rawMapData[SMMetrics.PxToBlock(this.pxPos.y + 32)][SMMetrics.PxToBlock(this.pxPos.x + 4)] == kSMBlockWood) {
      this.pxPos.y  = SMMetrics.BlockToPx(SMMetrics.PxToBlock(this.pxPos.y + 32) - 1);
      this.vSpeed = 0;
      this.standing = true;
    }

    // Check lower right vertical movement point (moving down)
    if (eng.map.rawMapData[SMMetrics.PxToBlock(this.pxPos.y + 32)][SMMetrics.PxToBlock(this.pxPos.x + 28)] == kSMBlockWood) {
      this.pxPos.y  = SMMetrics.BlockToPx(SMMetrics.PxToBlock(this.pxPos.y + 32) - 1);
      this.vSpeed = 0;
      this.standing = true;
    }

    if (this.engine.keyMap[kSMKeyJump] && this.standing === true && !this.jumpStarted) {
      this.jumpStarted = now;
      this.standing = false;
    }

    if (now - this.jumpStarted < 200) {
      this.vSpeed = -12;
    }

    if (!this.engine.keyMap[kSMKeyJump]) {
      this.jumpStarted = null;
    }

    if (this.standing === false) {
      this.playerImageName = kSMPlayerImages[this.directionSprite[this.direction]][this.state].jumping[0];
    }
  },
  tick: function() {

    this.updateHState();
    this.updateVState();

    this.draw();
  }
});