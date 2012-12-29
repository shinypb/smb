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

    SMLevel.ValidProperties.forEach(function(key) {
      this[key] = rawMapData[key];
    }.bind(this));
  },

  getBlockAt: function(x, y) {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
      return SMBlockProperties[kSMBlockOutOfBounds];
    }
    return SMBlockProperties[this.data[x][y]];
  },

  getBlockAtPx: function(xPx, yPx) {
    return this.getBlockAt(SMMetrics.PxToBlock(xPx), SMMetrics.PxToBlock(yPx));
  },

  renderFrame: function(canvas) {
    var dirtyRects = canvas.dirtyRects;

    dirtyRects.forEach(function(dirtyRect) {
      if (!SMMetrics.IsRectWithinRect(dirtyRect, canvas.viewport)) {
        //  out of bounds, don't bother
        return;
      }

      window.pixelsDrawn.push(dirtyRect.width * dirtyRect.height);

//       var minX = Math.floor(dirtyRect.x / kSMEngineBlockSize);
//       var minY = Math.floor(dirtyRect.y / kSMEngineBlockSize);
//       var maxX = minX + Math.ceil((dirtyRect.x + dirtyRect.width) / kSMEngineBlockSize);
//       var maxY = minY + Math.ceil((dirtyRect.y + dirtyRect.height) / kSMEngineBlockSize);

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
    canvas.context.fillStyle = this.backgroundColor;
    canvas.fillRect(
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
        if (!blockInfo.color && !blockInfo.image) {
          //  Need one or the other
          console.log('Invalid block', x, y, this.data[x][y], blockInfo);
          throw new Error('Invalid block');
        }

        //  Note: can have both color and image
        if (blockInfo.color || blockInfo.isTransparent) {
          canvas.context.fillStyle = blockInfo.color || this.backgroundColor;
          canvas.fillRect(xPx, yPx, kSMEngineBlockSize, kSMEngineBlockSize);
        }
        if (blockInfo.image) {
          canvas.drawImage(SMImages[blockInfo.image], xPx, yPx);
        }
      }
    }
  }

});