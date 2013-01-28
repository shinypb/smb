'use strict';
defineMixin('SMCollisionDetection', {
  colliding: function(bounds1, bounds2) {
    if (bounds1[kSMBottom] < bounds2[kSMTop])    return false;
    if (bounds1[kSMTop]    > bounds2[kSMBottom]) return false;
    if (bounds1[kSMRight]  < bounds2[kSMLeft])   return false;
    if (bounds1[kSMLeft]   > bounds2[kSMRight])  return false;

    return true;
  },
  getSign: function(num) {
    return num && num / Math.abs(num);
  },
  isPixelSolid: function(x, y) {
    // For now, just checking the map; in the future, we will check agents too.
    return this.getBlockAt(x, y).isSolid;
  },
  requestSafeHorizontalPixel: function(agent, delta_x) {
    if (delta_x === 0) {
      return { collision: false, delta_x: delta_x };
    }

    var actual_delta_x = 0;
    var sign = this.getSign(delta_x);
    var delta_x = Math.abs(delta_x);
    var collision = false;

    while (delta_x > 0) {
      if (this.isPixelSolid(agent.pxPos.x + (actual_delta_x + kSMMinimumCollisionPixels) * sign, agent.pxPos.y)) {
        collision = true;

        var middle = kSMMinimumCollisionPixels >> 1;

        while (middle > 0) {
          if (!this.isPixelSolid(agent.pxPos.x + (actual_delta_x + middle) * sign, agent.pxPos.y)) {
            actual_delta_x += middle;
          }

          middle = middle >> 1;
        }

        delta_x = 0;
      } else {
        actual_delta_x += kSMMinimumCollisionPixels;
        delta_x -= kSMMinimumCollisionPixels;
      }
    }

    return { collision: collision, delta_x: (actual_delta_x * sign) };
  },

  requestSafeVerticalPixel: function(agent, delta_y) {
    if (delta_y === 0) {
      return { collision: false, delta_y: delta_y };
    }

    var actual_delta_y = 0;
    var sign = this.getSign(delta_y);
    var delta_y = Math.abs(delta_y);
    var collision = false;

    while (delta_y > 0) {
      if (this.isPixelSolid(agent.pxPos.x, agent.pxPos.y + (actual_delta_y + kSMMinimumCollisionPixels) * sign)) {
        collision = true;

        var middle = kSMMinimumCollisionPixels >> 1;

        while (middle > 0) {
          if (!this.isPixelSolid(agent.pxPos.x, agent.pxPos.y + (actual_delta_y + middle) * sign)) {
            actual_delta_y += middle;
          }

          middle = middle >> 1;
        }

        delta_y = 0;
      } else {
        actual_delta_y += kSMMinimumCollisionPixels;
        delta_y -= kSMMinimumCollisionPixels;
      }
    }

    return { collision: collision, delta_y: (actual_delta_y * sign) };
  }
});