'use strict';
defineMixin('WithBoundingBox', {

  //  TODO: Figure out a way to enforce subclasses overriding this
  pxPos: { x: Infinity, y: Infinity },
  bounds: [0, 0, 0, 0],

  isLazy: true,

  boundingBox: function() {
    return {
        left: this.pxPos.x + this.bounds[kSMLeft],
       right: this.pxPos.x + this.bounds[kSMRight],
         top: this.pxPos.y + this.bounds[kSMTop],
      bottom: this.pxPos.y + this.bounds[kSMBottom]
    }
  },

  intersectsWith: function(otherAgent) {
    return otherAgent.boundingBox && this.intersectsWithBoundingBox(otherAgent.boundingBox());
  },

  intersectsWithBoundingBox: function(otherBoundingBox) {
    var ourBoundingBox = this.boundingBox();

    var intersectsHorizontally = (ourBoundingBox.left <= otherBoundingBox.right)
                              && (ourBoundingBox.right >= otherBoundingBox.left);
    var intersectsVertically = (ourBoundingBox.top <= otherBoundingBox.bottom)
                            && (ourBoundingBox.bottom >= otherBoundingBox.top);

    return intersectsHorizontally && intersectsVertically;
  },

  isOnScreen: function() {
    //  This is a super broad check of whether we're on screen or not, because we don't
    //  want agents to stop ticking the instant they move off screen. This gives them
    //  a buffer of plus or minus one viewport width on either side.
    //  TODO: check whether we're vertically off screen, too.
    var minX = this.engine.viewportPx.x - this.engine.viewportPx.width;
    var maxX = this.engine.viewportPx.x + (2 * this.engine.viewportPx.width);

    return (this.pxPos.x > minX && this.pxPos.x < maxX);
  }
});