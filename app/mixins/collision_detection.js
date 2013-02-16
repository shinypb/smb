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
  requestSafeHorizontalPixel: function(agent) {
    var delta_x = agent.hSpeed * kSMEngineBlockSize * this.secondsSincePreviousFrame;

    if (delta_x === 0) {
      return { collision: false, delta_x: 0 };
    }

    var actual_delta_x = 0;
    var sign = this.getSign(delta_x);
    var collision = '';
    var p = {
      x: delta_x > 0 ? agent.pxBounds.right : agent.pxBounds.left,
      top: agent.pxBounds.top + 1, // hack -- remove +/- 1
      bottom: agent.pxBounds.bottom - 1
    };
    delta_x = Math.abs(delta_x);

    while (delta_x > 0) {
      if (this.isPixelSolid(p.x + (actual_delta_x + Math.min(delta_x, kSMMinimumCollisionPixels)) * sign, p.top)) {
        collision = 'top';
      } else if (this.isPixelSolid(p.x + (actual_delta_x + Math.min(delta_x, kSMMinimumCollisionPixels)) * sign, p.bottom)) {
        collision = 'bottom';
      }

      if (collision) {
        var middle = kSMMinimumCollisionPixels >> 1;

        while (middle > 0) {
          if (!this.isPixelSolid(p.x + (actual_delta_x + middle) * sign, p[collision])) {
            actual_delta_x += middle;
          }

          middle = middle >> 1;
        }

        delta_x = 0;
      } else {
        actual_delta_x += delta_x > kSMMinimumCollisionPixels ? kSMMinimumCollisionPixels : delta_x;
        delta_x -= delta_x > kSMMinimumCollisionPixels ? kSMMinimumCollisionPixels : delta_x;
      }
    }

    return { collision: !!collision, delta_x: (actual_delta_x * sign) };
  },

  requestSafeVerticalPixel: function(agent) {
    var delta_y = agent.vSpeed * kSMEngineBlockSize * this.secondsSincePreviousFrame;

    if (delta_y === 0) {
      return { collision: false, delta_y: 0 };
    }

    var actual_delta_y = 0;
    var sign = this.getSign(delta_y);
    var collision = '';
    var p = {
      y: delta_y > 0 ? agent.pxBounds.bottom : agent.pxBounds.top,
      left: agent.pxBounds.left + 1, // hack -- remove +/- 1
      right: agent.pxBounds.right - 1
    };
    delta_y = Math.abs(delta_y);

    while (delta_y > 0) {
      if (this.isPixelSolid(p.left, p.y + (actual_delta_y + Math.min(delta_y, kSMMinimumCollisionPixels)) * sign)) {
        collision = 'left';
      } else if (this.isPixelSolid(p.right, p.y + (actual_delta_y + Math.min(delta_y, kSMMinimumCollisionPixels)) * sign)) {
        collision = 'right';
      }

      if (collision) {
        var middle = kSMMinimumCollisionPixels >> 1;

        while (middle > 0) {
          if (!this.isPixelSolid(p[collision], p.y + (actual_delta_y + middle) * sign)) {
            actual_delta_y += middle;
          }

          middle = middle >> 1;
        }

        delta_y = 0;
      } else {
        actual_delta_y += delta_y > kSMMinimumCollisionPixels ? kSMMinimumCollisionPixels : delta_y;
        delta_y -= delta_y > kSMMinimumCollisionPixels ? kSMMinimumCollisionPixels : delta_y;
      }
    }

    return { collision: !!collision, delta_y: (actual_delta_y * sign) };
  }
});