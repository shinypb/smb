defineClass('SMEngine', function(aCanvas) {
  this.tickNumber = 0;

  this.canvas = new SMCanvas(aCanvas);
  this.registerEventListeners();
  this.agents = [];

  this.map = new SMMap();

  this.player = new SMPlayer(this, 4, 8);
  this.addAgent(this.player);
}, {
  addAgent: function(anAgent) {
    this.agents.push(anAgent);
  },

  registerEventListeners: function() {
    this.keyMap = {};
    document.addEventListener('keydown', this.onKeyPress.bind(this, true), false);
    document.addEventListener('keyup', this.onKeyPress.bind(this, false), false);

    //  Eventually, we'll want to pause the game when the window is unfocused
//           window.addEventListener('blur', this.onWindowBlur.bind(this), false);
//           window.addEventListener('focus', this.onWindowFocus.bind(this), false);
  },

  onWindowBlur: function() {
    if (this.runTimer) {
      this.wasRunning = true;
      this.stopRunLoop();
    }
  },

  onWindowFocus: function() {
    if (this.wasRunning) {
      this.startRunLoop();
    }
  },

  onKeyPress: function(keyState, e) {
    this.keyMap[e.keyCode] = keyState;
  },

  tick: function() {
    try {
      this.tickNumber++;

      this.agents.forEach(function(agent) {
        agent.tick();
      });
    } catch (e) {
      console.log('Uncaught exception; halting run loop :(');
      this.stopRunLoop();

      throw e;
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