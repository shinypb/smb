defineClass('SMAgent', function(engine) {
  this.engine = engine;
}, {
  tick: function() {
    console.log('agent tick');
  }
});