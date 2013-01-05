'use strict';

defineClass('SMMap', function(mapId) {

  if (!SMLevels[mapId]) {
    throw new Error('Map does not exist');
  }

  this.loadMap(mapId);
}, {
  isValid: function(rawMapData) {
    rawMapData.forEach(function(row) {
      if (row.length != rawMapData[0].length) {
        return false;
      }
    }.bind(this));

    return true;
  },

  loadMap: function(mapId) {
    this.mapId = mapId;
    var rawMapData = SMLevels[mapId];

    if (!this.isValid(rawMapData)) {
      throw new Error('Invalid map');
    }

    SMLevel.ValidProperties.forEach(function(key) {
      this[key] = rawMapData[key];
    }.bind(this));

    if (rawMapData.length > kSMEngineGameHeight) {
      //  Taller than the viewport! Truncate the height of the map and nudge all of the
      //  agent's starting positions to compensate.
      //  Fix this! Vertical scrolling support required.
      var heightDifference = rawMapData.length - kSMEngineGameHeight;
      rawMapData = rawMapData.slice(heightDifference);
      this.agents.map(function(agent) {
        agent[1].y -= heightDifference;
        return agent;
      });
    }

    this.width = rawMapData[0].length;
    this.height = rawMapData.length;
    this.data = [];

    this.heightPx = this.height * kSMEngineBlockSize;
    this.widthPx = this.width * kSMEngineBlockSize;

    var x, y;
    for(x = 0; x < this.width; x++) {
      this.data[x] = [];
      for (y = 0; y < this.height; y++) {
        this.data[x][y] = rawMapData[y][x]; // yes, [y][x] -- data is stored by row
      }
    }
  },

  getBlockAt: function(x, y) {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
      return SMBlockProperties[kSMBlockOutOfBounds];
    }
    if (!this.data[x]) {
      debugger;
    }
    return SMBlockProperties[this.data[x][y]];
  },

  getBlockAtPx: function(xPx, yPx) {
    return this.getBlockAt(SMMetrics.PxToBlock(xPx), SMMetrics.PxToBlock(yPx));
  },

  getBlockBounds: function(x, y) {
    return [
      this.getBlockTopPx(),
      this.getBlockRightPx(),
      this.getBlockBottomPx(),
      this.getBlockLeftPx()
    ];
  },

  getBlockTopPx: function(y) {
    return SMMetrics.PxToBlock(y) * kSMEngineBlockSize;
  },

  getBlockRightPx: function(x) {
    return SMMetrics.PxToBlock(x) * kSMEngineBlockSize + kSMEngineBlockSize;
  },

  getBlockBottomPx: function(y) {
    return SMMetrics.PxToBlock(y) * kSMEngineBlockSize + kSMEngineBlockSize;
  },

  getBlockLeftPx: function(x) {
    return SMMetrics.PxToBlock(x) * kSMEngineBlockSize;
  },

  renderFrame: function(canvas) {
    var dirtyRects = canvas.dirtyRects;

    dirtyRects.forEach(function(dirtyRect) {
      if (!SMMetrics.IsRectWithinRect(dirtyRect, canvas.viewport)) {
        //  out of bounds, don't bother
        return;
      }

      window.pixelsDrawn.push(dirtyRect.width * dirtyRect.height);

      var minX = SMMetrics.PxToBlock(dirtyRect.x);
      var maxX = SMMetrics.PxToBlock(dirtyRect.x + dirtyRect.width) + 1;
      var minY = SMMetrics.PxToBlock(dirtyRect.y);
      var maxY = SMMetrics.PxToBlock(dirtyRect.y + dirtyRect.height) + 1;

      this.renderSubframe(canvas, minX, minY, maxX, maxY);

      if (false && dirtyRect) {
        canvas.context.strokeStyle = 'red';
        canvas.context.strokeRect(minX * kSMEngineBlockSize, minY * kSMEngineBlockSize, (maxX - minX) * kSMEngineBlockSize, (maxY - minY) * kSMEngineBlockSize);
      }

    }.bind(this));

    canvas.dirtyRects = [];
  },

  renderSubframe: function(canvas, minX, minY, maxX, maxY) {
    canvas.fillRect(
      this.backgroundColor,
      SMMetrics.BlockToPx(minX),
      SMMetrics.BlockToPx(minY),
      SMMetrics.BlockToPx(maxX - minX),
      SMMetrics.BlockToPx(maxY - minY)
    );

    var x, y, blockInfo, xPx, yPx;
    for(x = minX; x <= maxX; x++) {
      for(y = minY; y < maxY; y++) {

        xPx = SMMetrics.BlockToPx(x);
        yPx = SMMetrics.BlockToPx(y);

        blockInfo = this.getBlockAt(x, y);
        if (!blockInfo) {
          debugger
        }
        if (!blockInfo.color && !blockInfo.image) {
          //  Need one or the other
          console.log('Invalid block', x, y, this.data[x][y], blockInfo);
          throw new Error('Invalid block');
        }

        //  Note: can have both color and image
        if (blockInfo.color || blockInfo.isTransparent) {
          canvas.fillRect(blockInfo.color || this.backgroundColor, xPx, yPx, kSMEngineBlockSize, kSMEngineBlockSize);
        }
        if (blockInfo.image) {
          canvas.drawImage(SMImages[blockInfo.image], xPx, yPx);
        }
      }
    }
  }

});