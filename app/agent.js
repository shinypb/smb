defineClass('SMAgent', function(engine) {
  this.engine = engine;
}, {
  tick: function() {
    console.log('agent tick');
  }
});

SMAgent.FromDefinition = function(engine, agentDefinition) {
  var className = agentDefinition[0], pos = agentDefinition[1];

  if (!window[className]) {
    throw new Error('Unknown agent type ' + className);
  }

  return new window[className](engine, pos.x, pos.y);
};