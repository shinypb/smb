'use strict';
defineClass(
  'SMGoomba',
  'SMAgent',
  function(engine, startBlockX, startBlockY) {
    SMAgent.prototype.constructor.apply(this, arguments);

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
  },

  //  Mixins
  WithBoundingBox,

  //  Properties
  {
    speed: kSMGoombaSpeed,
    direction: kSMGoombaStartingDirection,
    vSpeed: kSMPlayerVerticalSpeed,
    alive: true,
    walkFrame: 0,
    squishTime: null,
    canHurtPlayer: true,
    bounds: kSMAgentHitBounds.goomba
  },

  //  Methods
  {
    draw: function() {
      this.engine.canvas.drawImage(SMImages[this.goombaImageName], this.pxPos.x, this.pxPos.y);
    },
    updateHState: function() {
      if (this.squishTime) {
        // Squished goomba!
        //  TODO: Consider replacing SMGoomba with SMSquishedGoomba when we are stomped, which would
        //        let us simplify the implementations of each.
        this.goombaImageName = this.animations.normal.squished.currentSprite;
        this.speed = 0;

        var squishDuration = kSMGoombaSquishFrameDuration * 1000;
        if (this.engine.now - this.timeOfLastWalkFrame > squishDuration) {
          this.alive = false;
        }
      } else {
        // Living goomba!
        this.timeOfLastWalkFrame = this.timeOfLastWalkFrame || this.engine.now;
        if (this.engine.now - this.timeOfLastWalkFrame > (kSMGoombaWalkFrameDuration * 1000)) {
          this.timeOfLastWalkFrame = this.engine.now;
          // Cycle through the array of animation frames.
          this.goombaImageName = this.animations.normal.walking.nextSprite();
        }
      }

      // Change direction if we're running into a solid block.
      if (this.direction == -1 && this.engine.map.getBlockAtPx(this.pxPos.x, this.pxPos.y).isSolid) {
        this.changeDirection();
      } else if (this.direction == 1 && this.engine.map.getBlockAtPx(this.pxPos.x + 32, this.pxPos.y).isSolid) {
        this.changeDirection();
      }

      this.pxPos.x += this.direction * this.speed * kSMEngineBlockSize * this.engine.secondsSincePreviousFrame;
    },
    updateVState: function() {
      this.vSpeed += kSMPlayerGravity;

      this.pxPos.y += (this.vSpeed * kSMEngineBlockSize * this.engine.secondsSincePreviousFrame);
      var top = this.pxPos.y + kSMAgentHitBounds.goomba.top,
        right = this.pxPos.x + kSMAgentHitBounds.goomba.right,
        bottom = this.pxPos.y + kSMAgentHitBounds.goomba.bottom,
        left = this.pxPos.x + kSMAgentHitBounds.goomba.left;

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
      //  TODO: move this down into a hypothetical SMSquishableAgent base class, shared with SMTurtle
      SMAudio.playFromStart(kSMAgentAudioSquish);
      this.squishTime = +new Date;
      this.canHurtPlayer = false;
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
  }
);