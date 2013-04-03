'use strict';
var kSMPiranhaStateLurking = 'lurking';
var kSMPiranhaStateRaising = 'raising';
var kSMPiranhaStateBeforeSpit = 'beforeSpit';
var kSMPiranhaStateSpitting = 'spitting';
var kSMPiranhaStateLowering = 'lowering';

var kSMPiranhaSpriteWidth = 32;
var kSMPiranhaSpriteHeight = 64;

var kSMPiranhaFrameDuration = 128;
var kSMPiranhaStateDurations = {}
kSMPiranhaStateDurations[kSMPiranhaStateLurking] = 11;
kSMPiranhaStateDurations[kSMPiranhaStateRaising] = 4;
kSMPiranhaStateDurations[kSMPiranhaStateBeforeSpit] = 6;
kSMPiranhaStateDurations[kSMPiranhaStateSpitting] = 4;
kSMPiranhaStateDurations[kSMPiranhaStateLowering] = 5;

defineClass(
  'SMPiranhaPlant',
  'SMAgent',
  function(engine, startBlockX, startBlockY) {
    SMAgent.prototype.constructor.apply(this, arguments);

    this.pxPos = {
      x: SMMetrics.BlockToPx(startBlockX),
      y: SMMetrics.BlockToPx(startBlockY)
    };

    this.setState(kSMPiranhaStateLurking);
  },

  //  Mixins
  WithBoundingBox,

  //  Properties
  {
    alive: true,
    walkFrame: 0,
    canHurtPlayer: true,
    bounds: [0, 0, 0, 0], // see updateBoundingBox
    image: SMImages['sprite-piranha-plant'],
    spriteBaseOffsetX: 0,
    spriteBaseOffsetY: 0,
    spriteOffsetX: 0,
    spriteOffsetY: 0
  },

  //  Methods
  {
    setState: function(newState) {
      this.state = newState;
      this.stateChangeTime = this.engine.now;
      console.log('state change', this.state);
    },
    setSpriteOffsetX: function(offset) {
      this.spriteOffsetX = this.spriteBaseOffsetX + offset;
    },
    setSpriteOffsetY: function(offset) {
      this.spriteOffsetX = this.spriteBaseOffsetY + offset;
    },
    updateBoundingBox: function() {

    },
    draw: function() {
      console.log(this.spriteOffsetX, this.spriteOffsetY, 'at', this.pxPos.x, this.pxPos.y - kSMPiranhaSpriteHeight);
      this.engine.canvas.drawImageSlice(
        this.image,
        this.spriteOffsetX, this.spriteOffsetY,
        this.pxPos.x, this.pxPos.y - kSMPiranhaSpriteHeight,
        false,
        kSMPiranhaSpriteWidth, kSMPiranhaSpriteHeight
      );
    },
    tick: function() {
      this.frameNumber = Math.floor((this.engine.now - this.stateChangeTime) / kSMPiranhaFrameDuration);

      var tickFunctionName = 'tick' + this.state[0].toUpperCase() + this.state.substring(1);
      this[tickFunctionName]();

      this.draw();
    },
    tickLurking: function() {
      this.setSpriteOffsetX(0);

      if (this.frameNumber > kSMPiranhaStateDurations[this.state]) {
        //  Figure out which way we're going to face
        if (this.engine.player.pxPos.x < this.pxPos.x) {
          this.spriteBaseOffsetX = 0;
        } else {
          this.spriteBaseOffsetX = 5 * kSMPiranhaSpriteWidth;
        }
        if (this.engine.player.pxPos.y < this.pxPos.y) {
          this.spriteBaseOffsetY = 0;
        } else {
          this.spriteBaseOffsetY = kSMPiranhaSpriteHeight;
        }

        this.setState(kSMPiranhaStateRaising);
      }
    },
    tickRaising: function() {
      this.setSpriteOffsetX(this.frameNumber * kSMPiranhaSpriteWidth);
    },
    tickBeforeSpit: function() {
      this.setSpriteOffsetX(4 * kSMPiranhaSpriteWidth);
    },
    tickSpitting: function() {
    },
    tickLowering: function() {
      this.setSpriteOffsetX((kSMPiranhaStateDurations[this.state] - this.frameNumber) * kSMPiranhaSpriteWidth);
    }
  }
);