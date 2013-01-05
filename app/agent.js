'use strict';
defineClass(
  'SMAgent',
  function(engine) {
    this.engine = engine;
  },
  //  Methods
  {
    tick: function() {
      console.log('agent tick');
    }
  }
);

SMAgent.FromDefinition = function(engine, agentDefinition) {
  /**
   * Instantiates a given class based on an agent definition from a map.
   * Agent definitions are two-element arrays, consisting of:
   * 1. Class name (e.g. SMPlayer)
   * 2. Starting position ( { x: ..., y: ... } )
   */

  var className = agentDefinition[0], pos = agentDefinition[1];

  if (!window[className]) {
    throw new Error('Unknown agent type ' + className);
  }

  return new window[className](engine, pos.x, pos.y);
};