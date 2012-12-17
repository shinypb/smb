defineClass('SMEngine', function(aCanvas) {
  this.tickNumber = 0;

  this.canvas = new SMCanvas(aCanvas);
  this.registerEventListeners();
  this.agents = [];

  this.map = new SMMap(0);

  this.viewportPx = {
    x: 0,
    y: (this.map.height - kSMEngineGameHeight) * kSMEngineBlockSize,
    width: kSMEngineGameWidth * kSMEngineBlockSize,
    height: kSMEngineGameHeight * kSMEngineBlockSize
  }

  this.map.agents.forEach(function(agentDefinition) {
    var newAgent = SMAgent.FromDefinition(this, agentDefinition);
    this.addAgent(newAgent);

    if (newAgent instanceof SMPlayer) {
      this.player = newAgent;
    }
  }.bind(this));

  if (!this.player) {
    throw new Error('Map did not specify a player starting position');
  }

}, {
  addAgent: function(anAgent) {
    this.agents.push(anAgent);
  },

  registerEventListeners: function() {
    this.keyMap = {};
    document.addEventListener('keydown', this.onKeyPress.bind(this, true), false);
    document.addEventListener('keyup', this.onKeyPress.bind(this, false), false);

    window.addEventListener('blur', this.onWindowBlur.bind(this), false);
    window.addEventListener('focus', this.onWindowFocus.bind(this), false);
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
    this.keyMap[e.keyCode] = keyState;
  },

  tick: function() {
    try {
      this.tickNumber++;

      this.canvas.clear(); // TODO: stop doing this once we can do incremental draws
      this.updateViewport();
      this.canvas.setViewport(this.viewportPx);
      this.map.renderFrame(this.canvas);

      this.agents.forEach(function(agent) {
        agent.tick();
      });
    } catch (e) {
      console.log('Uncaught exception; halting run loop :(');
      this.stopRunLoop();

      throw e;
    }
  },

  updateViewport: function() {
    //  TODO: follow player's position;
    if (this.tickNumber % 4 == 0 && document.getElementById('auto-scroll').checked) {
      this.viewportPx.x = Math.min(this.map.widthPx - this.viewportPx.width, this.viewportPx.x + 1);
    }
  },

  startRunLoop: function() {
    console.log('Starting run loop');
    if (this.runTimer) {
      return;
    }

    this.runTimer = setInterval(this.tick.bind(this), 1000 / kSMEngineFPS);
  },

  stopRunLoop: function() {
    console.log('Stopping run loop');
    clearTimeout(this.runTimer);
    this.runTimer = null;
  }
});