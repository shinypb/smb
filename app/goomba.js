'use strict';
defineClass('SMGoomba', 'SMAgent', function(engine, startBlockX, startBlockY) {
  SMAgent.prototype.constructor.apply(this, arguments);

  this.speed = kSMGoombaSpeed;
  this.direction = kSMGoombaStartingDirection;
  this.vSpeed = kSMPlayerVerticalSpeed;
  this.alive = true;
  this.walkFrame = 0;
  this.squishTime = null;

  this.animations = {};
  for (var type in kSMAgentData['goomba']) {
    this.animations[type] = {};
    for (var anim in kSMAgentData['goomba'][type]) {
      this.animations[type][anim] = new SMAnimation(kSMAgentData['goomba'][type][anim]);
    }
  }
  this.goombaImageName = this.animations.normal.walking.currentSprite;

  this.pxPos = {
    x: SMMetrics.BlockToPx(startBlockX),
    y: SMMetrics.BlockToPx(startBlockY)
  };
}, {
  bounds: kSMAgentHitBounds.goomba,
  draw: function() {
    this.engine.canvas.drawImage(SMImages[this.goombaImageName], this.pxPos.x, this.pxPos.y);
  },
  updateHState: function() {
    var now = +new Date;
    if (!this.squishTime) {
      // Living goomba!
      this.timeOfLastWalkFrame = this.timeOfLastWalkFrame || now;
      if (now - this.timeOfLastWalkFrame > kSMGoombaWalkFrameDuration) {
        this.timeOfLastWalkFrame = now;
        // Cycle through the array of animation frames.
        this.goombaImageName = this.animations.normal.walking.nextSprite();
      }


    } else {
      // Squished goomba!
      this.goombaImageName = this.animations.normal.squished.currentSprite;
      this.speed = 0;

      var squishDuration = kSMGoombaSquishFrameDuration;
      if (now - this.timeOfLastWalkFrame > squishDuration) {
        this.alive = false;
      }
    }

    // Change direction if we're running into a solid block.
    if (this.direction == -1 && this.engine.map.getBlockAtPx(this.pxPos.x, this.pxPos.y).isSolid) {
      this.changeDirection();
    } else if (this.direction == 1 && this.engine.map.getBlockAtPx(this.pxPos.x + 32, this.pxPos.y).isSolid) {
      this.changeDirection();
    }

    this.pxPos.x += this.direction * this.speed * kSMEngineBlockSize * kSMFrameUnit;
  },
  updateVState: function() {
    this.vSpeed += kSMPlayerGravity;

    this.pxPos.y += (this.vSpeed * kSMEngineBlockSize * kSMFrameUnit);
    var top = this.pxPos.y + kSMAgentHitBounds.goomba[0],
      right = this.pxPos.x + kSMAgentHitBounds.goomba[1],
      bottom = this.pxPos.y + kSMAgentHitBounds.goomba[2],
      left = this.pxPos.x + kSMAgentHitBounds.goomba[3];

    if (this.engine.map.getBlockAtPx(left, top).isSolid) {
      // Check upper left vertical movement point (moving up)
      this.pxPos.y = SMMetrics.BlockToPx(SMMetrics.PxToBlock(top) + 1);
      this.vSpeed = 0;
    } else if (this.engine.map.getBlockAtPx(right, top).isSolid) {
      // Check upper right vertical movement point (moving up)
      this.pxPos.y = SMMetrics.BlockToPx(SMMetrics.PxToBlock(top) + 1);
      this.vSpeed = 0;
    } else if (this.engine.map.getBlockAtPx(left, bottom).isSolid) {
      // Check lower left vertical movement point (moving down)
      this.pxPos.y  = SMMetrics.BlockToPx(SMMetrics.PxToBlock(bottom) - 1);
      this.vSpeed = 0;
    } else if (this.engine.map.getBlockAtPx(right, bottom).isSolid) {
      // Check lower right vertical movement point (moving down)
      this.pxPos.y  = SMMetrics.BlockToPx(SMMetrics.PxToBlock(bottom) - 1);
      this.vSpeed = 0;
    }
  },
  squish: function() {
//     SMAudio[kSMAgentAudioSquish].playFromStart();
    this.squishTime = +new Date;
  },
  changeDirection: function() {
    this.direction *= -1;
  },
  tick: function() {
    if (this.alive) {
      this.updateHState();
      this.updateVState();

      this.draw();
    } else {
      this.engine.removeAgent(this);
    }
  }
});