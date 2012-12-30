'use strict';
defineClass('SMSprite',  function (elem) {
  this.element = elem;
  this.width = elem.width;
  this.height = elem.height;
  this.spriteOffsetX = Math.round((elem.width - 32) / 2);
  this.spriteOffsetY = elem.height - 32;
}, {
  someFunction: function() {}
});