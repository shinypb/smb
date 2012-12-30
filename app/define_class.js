(function() {
  function defineClass() {
    var kDefineClassMagicValue = 'defineClass_do_not_call_user_provided_constructor';
    var args = Array.prototype.slice.apply(arguments);
    var className, superClassName, constructor, properties, propertiesToAdd;
    var mixins = [];

    className = args.shift();
    if (typeof args[0] == 'string') {
      superClassName = args.shift();
    }
    if (typeof args[0] == 'function') {
      constructor = args.shift();
    } else if(superClassName) {
      constructor = window[superClassName].prototype.constructor;
    } else {
      constructor = function() {};
    }
    properties = {};
    while (typeof args[0] == 'object') {
      propertiesToAdd = args.shift();
      if (propertiesToAdd.hasOwnProperty(defineMixin.kMixinNameKey)) {
        mixins.push(propertiesToAdd[defineMixin.kMixinNameKey]);
      }
      Object.keys(propertiesToAdd).forEach(function(key) {
        if (key != defineMixin.kMixinNameKey) {
          properties[key] = propertiesToAdd[key];
        }
      });
    }

    (function(className, superClassName, constructor, properties, mixins) {
      function theNewClass() {
        this.className = className;
        this.constructor = constructor;

        //  Keep track of the mixins on this instance
        //  We're concat'ing the existing value in case we're a superclass constructor --
        //  we don't want to clobber the existing this.mixins value.
        this.mixins = mixins.concat(this.mixins || []);

        if (arguments[0] != kDefineClassMagicValue) {
          this.constructor.apply(this, arguments);
        }
      }

      if (superClassName) {
        theNewClass.prototype = new window[superClassName](kDefineClassMagicValue);
      }
      theNewClass.constructor = constructor;

      theNewClass.className = className;
      Object.keys(properties).forEach(function(key) {
        theNewClass.prototype[key] = properties[key];
      }.bind(this));

      window[className] = theNewClass;
    })(className, superClassName, constructor, properties, mixins);
  }
  window.defineClass = defineClass;
})();