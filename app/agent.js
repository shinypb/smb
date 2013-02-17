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
    },
    requestSafeHorizontalPixel: function() {
      var delta_x = this.hSpeed * kSMEngineBlockSize * this.engine.secondsSincePreviousFrame;

      if (delta_x === 0) {
        return { collision: false, delta_x: 0 };
      }

      var actual_delta_x = 0;
      var sign = this.engine.getSign(delta_x);
      var collision = '';
      var p = {
        x: delta_x > 0 ? this.pxBounds.right : this.pxBounds.left,
        top: this.pxBounds.top + 1, // hack -- remove +/- 1
        bottom: this.pxBounds.bottom - 1
      };
      delta_x = Math.abs(delta_x);

      while (delta_x > 0) {
        if (this.engine.isPixelSolid(p.x + (actual_delta_x + Math.min(delta_x, kSMMinimumCollisionPixels)) * sign, p.top)) {
          collision = 'top';
        } else if (this.engine.isPixelSolid(p.x + (actual_delta_x + Math.min(delta_x, kSMMinimumCollisionPixels)) * sign, p.bottom)) {
          collision = 'bottom';
        }

        if (collision) {
          var middle = kSMMinimumCollisionPixels >> 1;

          while (middle > 0) {
            if (!this.engine.isPixelSolid(p.x + (actual_delta_x + middle) * sign, p[collision])) {
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

    requestSafeVerticalPixel: function() {
      var delta_y = this.vSpeed * kSMEngineBlockSize * this.engine.secondsSincePreviousFrame;

      if (delta_y === 0) {
        return { collision: false, delta_y: 0 };
      }

      var actual_delta_y = 0;
      var sign = this.engine.getSign(delta_y);
      var collision = null;
      var p = {
        y: delta_y > 0 ? this.pxBounds.bottom : this.pxBounds.top,
        left: this.pxBounds.left + 1, // hack -- remove +/- 1
        right: this.pxBounds.right - 1
      };

      delta_y = Math.abs(delta_y);

      while (delta_y > 0) {
        p.y_next = p.y + (actual_delta_y + Math.min(delta_y, kSMMinimumCollisionPixels)) * sign;
        if (this.engine.isPixelSolid(p.left, p.y_next)) {
          collision = 'left';
        } else if (this.engine.isPixelSolid(p.right, p.y_next)) {
          collision = 'right';
        } else if (sign == 1) {
          if (!this.engine.map.getBlockAtPx(p.left, p.y).canStandOn && this.engine.map.getBlockAtPx(p.left, p.y_next).canStandOn) {
            collision = 'left';
          } else if (!this.engine.map.getBlockAtPx(p.right, p.y).canStandOn && this.engine.map.getBlockAtPx(p.right, p.y_next).canStandOn) {
            collision = 'right';
          }
        }

        if (collision) {
          var middle = kSMMinimumCollisionPixels >> 1;

          while (middle > 0) {
            if (!this.engine.isPixelStandable(p[collision], p.y + (actual_delta_y + middle) * sign)) {
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