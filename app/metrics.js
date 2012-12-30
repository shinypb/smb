'use strict';
window.SMMetrics = {
  BlockToPx: function(blockValue) {
    return blockValue * kSMEngineBlockSize;
  },
  PxToNearestBlockPx: function(pxValue) {
    return pxValue - (pxValue % kSMEngineBlockSize);
  },
  PxToBlock: function(pxValue) {
    return Math.floor(pxValue / kSMEngineBlockSize);
  },
  IsPointWithinRect: function(point, rect) {
    return (point.x >= rect.x && point.x <= (rect.x + rect.width)) &&
           (point.y >= rect.y && point.y <= (rect.y + rect.height));
  },
  IsRectWithinRect: function(innerRect, outerRect) {
    var innerX2 = innerRect.x + innerRect.width;
    var innerY2 = innerRect.y + innerRect.height;

    var innerCorners = [
      { x: innerRect.x, y: innerRect.y },
      { x: innerRect.x, y: innerY2 },
      { x: innerX2, y: innerRect.y },
      { x: innerX2, y: innerY2 }
    ];

    var i;
    for (i = 0; i < innerCorners.length; i++) {
      if (SMMetrics.IsPointWithinRect(innerCorners[i], outerRect)) {
        return true;
      }
    }

    return false;
  }
};
