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

    var x, y;
    for(x = 0; x < this.width; x++) {
      this.data[x] = [];
      for (y = 0; y < this.height; y++) {
        this.data[x][y] = rawMapData[y][x]; // yes, [y][x] -- data is stored by row
      }
    }

    this.playerStartBlock = rawMapData.playerStartBlock;
    this.goombaStartBlock = rawMapData.goombaStartBlock;
  },

  getBlockAt: function(x, y) {
    return SMBlockProperties[this.data[x][y]];
  },

  getBlockAtPx: function(xPx, yPx) {
    return this.getBlockAt(SMMetrics.PxToBlock(xPx), SMMetrics.PxToBlock(yPx));
  },

  renderFrame: function(canvas) {

    var viewport = canvas.viewport;
    var minX = SMMetrics.PxToBlock(viewport.x);
    var minY = SMMetrics.PxToBlock(viewport.y);
    var maxX = SMMetrics.PxToBlock(viewport.x + viewport.width);
    var maxY = SMMetrics.PxToBlock(viewport.y + viewport.height);

    canvas.context.fillStyle = kSMColorSkyBlue;
    canvas.fillRect(0, 0, viewport.width - 1, viewport.height - 1);

    var x, y, blockInfo, xPx, yPx;
    for(x = minX; x <= maxX; x++) {
      for(y = minY; y < maxY; y++) {

        xPx = SMMetrics.BlockToPx(x);
        yPx = SMMetrics.BlockToPx(y);

        blockInfo = this.getBlockAt(x, y);
        if (!blockInfo) {
          debugger;
        } else if (!blockInfo.color && !blockInfo.image) {
          //  Need one or the other
          console.log('Invalid block', x, y, this.data[x][y], blockInfo);
          throw new Error('Invalid block');
        }

        //  Note: can have both color and image
        if (blockInfo.color) {
          canvas.context.fillStyle = blockInfo.color;
          canvas.fillRect(xPx, yPx, kSMEngineBlockSize, kSMEngineBlockSize);
        }
        if (blockInfo.image) {
          canvas.drawImage(SMImages[blockInfo.image], xPx, yPx);
        }

      }
    }
  }

});