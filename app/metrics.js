window.SMMetrics = {
  BlockToPx: function(blockValue) {
    return blockValue * kSMEngineBlockSize;
  },
  PxToBlock: function(pxValue) {
    return Math.floor(pxValue / kSMEngineBlockSize);
  }
};
