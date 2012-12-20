defineClass('SMMovingAgent', 'SMAgent', function(engine) {
  this.engine = engine;
}, {
  tick: function() {
    console.log('movingAgent tick');
  }
});