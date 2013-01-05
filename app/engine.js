'use strict';
defineClass('SMEngine', function(canvasElement) {
  this.tickNumber = 0;
  this.tickDurations = [];
  this.secondsSincePreviousFrame = 0;
  this.now = new Date;

  this.canvasElement = canvasElement;

  this.registerEventListeners();
  this.enableSounds = (document.getElementById('background-music-1') || {})['autoplay'];

  this.map = new SMMap(0);

  this.viewportPx = {
    x: 0,
    y: (this.map.height - kSMEngineGameHeight) * kSMEngineBlockSize,
    width: kSMEngineGameWidth * kSMEngineBlockSize,
    height: kSMEngineGameHeight * kSMEngineBlockSize
  };

  this.canvas = new SMCanvas(canvasElement, this.viewportPx, this.map);

  //  DEBUG
  window.pixelsDrawn = [];
  window.pixelsPerFrame = [];
  //  END DEBUG

  this.agents = this.map.agents.map(function(agentDefinition) {
    var newAgent = SMAgent.FromDefinition(this, agentDefinition);
    if (newAgent instanceof SMPlayer) {
      this.player = newAgent;
    }

    return newAgent;
  }.bind(this));

  if (!this.player) {
    throw new Error('Map did not specify a player starting position');
  }
}, SMCollisionDetection, {
  addAgent: function(anAgent) {
    this.agents.push(anAgent);
  },

  removeAgent: function(anAgent) {
    var index = this.agents.lastIndexOf(anAgent);
    var rest = this.agents.slice(index + 1 || this.agents.length);
    this.agents.length = index < 0 ? this.agents.length + index : index;
    this.agents.push.apply(this.agents, rest);
  },

  registerEventListeners: function() {
    this.keyMap = {};
    document.addEventListener('keydown', this.onKeyPress.bind(this, true), false);
    document.addEventListener('keyup', this.onKeyPress.bind(this, false), false);

    document.body.addEventListener('touchstart', this.onTouchStart.bind(this), false);
    document.body.addEventListener('touchend', this.onTouchEnd.bind(this), false);

    window.addEventListener('blur', this.onWindowBlur.bind(this), false);
    window.addEventListener('focus', this.onWindowFocus.bind(this), false);
  },

  onTouchStart: function(e) {
    this.keyMap[kSMKeyJump] = true;
  },

  onTouchEnd: function(e) {
    this.keyMap[kSMKeyJump] = false;
  },

  onWindowBlur: function() {
    this.keyMap = {};
    /*  Eventually, we'll want to pause the game when the window is unfocused
    if (this.runTimer) {
      this.wasRunning = true;
      this.stopRunLoop();
    }
    */
  },

  onWindowFocus: function() {
    /*  Eventually, we'll want to pause the game when the window is unfocused
    if (this.wasRunning) {
      this.startRunLoop();
    }
    */
  },

  onKeyPress: function(keyState, e) {
    if (e.keyCode >= 37 && e.keyCode <= 40) {
      e.preventDefault();
    }

    this.keyMap[e.keyCode] = keyState;
  },

  setDebugText: function(text) {
    document.getElementById('engine-debug').innerHTML = text;
  },

  updateDebugInfo: function(lastTickDuration) {
    function average(anArray) {
      var sum = anArray.reduce(function(a, b) {
        return a + b;
      }, 0);
      return sum / anArray.length;
    }

    var pixelsThisTick = 0;
    window.pixelsDrawn.forEach(function(pixelCount) {
      pixelsThisTick += pixelCount;
    });
    window.pixelsPerFrame.push(pixelsThisTick);
    if (window.pixelsPerFrame.length > kSMEnginePixelsPerFrameHistoryLength) {
      window.pixelsPerFrame = window.pixelsPerFrame.slice(window.pixelsPerFrame.length - kSMEnginePixelsPerFrameHistoryLength);
    }

    this.tickDurations.push(lastTickDuration);
    if (this.tickDurations.length > kSMEngineTickTimeHistoryLength) {
      this.tickDurations = this.tickDurations.slice(this.tickDurations.length - kSMEngineTickTimeHistoryLength);
    }

    var pixelsPerFrame = 'Pixels per tick: ' + parseInt(average(window.pixelsPerFrame));
    var frameCost = 'Tick duration: ' + parseInt(average(this.tickDurations) * 1000) + '&#181;s';

    this.setDebugText(pixelsPerFrame + '\t' + frameCost);

  },

  tick: function() {
    var tickStartTime;

    try {
      //  Update time info
      tickStartTime = new Date;
      this.secondsSincePreviousFrame = (tickStartTime - this.now) / 1000;
      this.now = tickStartTime;

      window.pixelsDrawn = [];

      this.updateViewport();

      this.map.renderFrame(this.canvas);

      //  We need to work with a copy of the agents array, because during their .tick method,
      //  some may choose to remove themselves. Mutating the array does weird things with
      //  iteration; the copy ensures that's not a problem.
      var copyOfAgents = Array.prototype.slice.apply(this.agents);

      copyOfAgents.forEach(function(agent) {
        agent.tick();
        if (this.player !== agent) {
          this.player.checkCollision(agent);
        }
      }.bind(this));
      this.player.draw();

      this.updateDebugInfo((new Date) - tickStartTime);

    } catch (e) {
      console.log('Uncaught exception; halting run loop :(');
      this.stopRunLoop();

      throw e;
    }

    this.nextFrame();
  },

  updateViewport: function() {
    var diff = this.player.pxPos.x - this.viewportPx.x;
    if (diff > kSMPlayerScreenEdgePushRight) {
      this.viewportPx.x = Math.ceil(Math.min(this.map.widthPx - this.viewportPx.width, this.viewportPx.x + diff - kSMPlayerScreenEdgePushRight));
      this.canvas.setViewport(this.viewportPx);
    } else if (diff < kSMPlayerScreenEdgePushLeft && this.viewportPx.x > 0) {
      this.viewportPx.x = Math.ceil(Math.max(0, this.viewportPx.x - (kSMPlayerScreenEdgePushLeft - diff)));
      this.canvas.setViewport(this.viewportPx);
    }
  },

  pauseFor: function(milliseconds) {
    this.pauseDuration = milliseconds;
    this.pauseTime = new Date;

    setTimeout(this.startRunLoop.bind(this), milliseconds);

    //  We need to explicitly tick one last time so agents have a chance to redraw
    //  themselves -- in particular, we pause when Mario dies, and this tick is when
    //  the "dead Mario facing forward" image is drawn.
    this.tick();
  },

  nextFrame: function() {
    var now = new Date;
    if (now - this.pauseTime < this.pauseDuration) {
      return;
    }

    var requestAnimationFrame = (window.requestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || webkitRequestAnimationFrame);

    requestAnimationFrame(this.tick.bind(this), this.canvasElement);
  },

  startRunLoop: function() {
    console.log('Starting run loop');

    this.now = new Date;
    this.nextFrame();
  },

  stopRunLoop: function() {
    console.log('Stopping run loop');
    this.runTimer = null;
  }
});