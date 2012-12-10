(function() {
  function defineClass() {
    var kDefineClassMagicValue = 'defineClass_do_not_call_user_provided_constructor';
    var args = Array.prototype.slice.apply(arguments);
    var className, superClassName, constructor, properties;

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
    if (typeof args[0] == 'object') {
      properties = args.shift();
    } else {
      properties = {};
    }

    (function(className, superClassName, constructor, properties) {
      function theNewClass() {
        this.className = className;
        this.constructor = constructor;

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
    })(className, superClassName, constructor, properties);
  }
  window.defineClass = defineClass;
})();