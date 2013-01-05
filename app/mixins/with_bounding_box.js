'use strict';
defineMixin('WithBoundingBox', {

  //  TODO: Figure out a way to enforce subclasses overriding this
  pxPos: { x: Infinity, y: Infinity },
  bounds: [0, 0, 0, 0],

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
  }
});