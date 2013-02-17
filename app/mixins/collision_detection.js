'use strict';
defineMixin('SMCollisionDetection', {
  colliding: function (bounds1, bounds2) {
    if (bounds1.bottom < bounds2.top) {
      return false;
    }

    if (bounds1.top > bounds2.bottom) {
      return false;
    }

    if (bounds1.right < bounds2.left) {
      return false;
    }

    if (bounds1.left > bounds2.right) {
      return false;
    }

    return true;
  },
  getSign: function(num) {
    return num && num / Math.abs(num);
  },
  isPixelSolid: function(x, y) {
    // For now, just checking the map; in the future, we will check solidity map too.
    return this.map.getBlockAtPx(x, y).isSolid;
  },
  isPixelStandable: function(x, y) {
    // For now, just checking the map; in the future, we will check solidity map too.
    return this.map.getBlockAtPx(x, y).isSolid || this.map.getBlockAtPx(x, y).canStandOn;
  }
});