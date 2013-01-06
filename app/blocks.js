'use strict';

var kSMBlockCharset = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
var kSMBlockIdBase = kSMBlockCharset.length;

window.SMBlocks = {
  DecimalToBlockId: function (num) {
    var digits = [], digit;
    while(true) {
      digit = num % kSMBlockIdBase;
      num = (num - digit) / kSMBlockIdBase;
      digits.unshift(digit);

      if (num == 0) {
        break;
      }
    }

    if (digits.length % 2 == 1) {
      digits.unshift(0);
    }

    return digits.reduce(function(output, digit) {
      return output + kSMBlockCharset[digit];
    }, '');
  },

  BlockIdToDecimal: function (blockId) {
    if (blockId == undefined) {
      debugger
    }
    var digits = blockId.toString().split('').map(function(character) {
      return kSMBlockCharset.indexOf(character);
    });

    return digits.reduce(function(value, digit) {
      return (value * kSMBlockIdBase) + digit;
    }, 0);
  }
};

var kSMBlockOutOfBounds = {
  color: '#000',
  isSolid: true,
  isTransparent: false
};

//  Properties for blocks within tilesets
SMTilesets['grassland'].blockProperties = {
  '00': {
    color: kSMColorSkyBlue
  },
  '06': {
    isSolid: true
  },
  '07': {
    isSolid: true
  },
  '08': {
    isSolid: true
  },
  '09': {
    isSolid: true
  },
  '0A': {
    isSolid: true
  },
  '0B': {
    canStandOn: true
  },
  '0C': {
    canStandOn: true
  },
  '0D': {
    canStandOn: true
  },
  '0T': {
    canStandOn: true
  },
  '0U': {
    canStandOn: true
  },
  '0V': {
    canStandOn: true
  },
  '0b': {
    isSolid: true
  },
  '0c': {
    canStandOn: true
  },
  '0d': {
    canStandOn: true
  },
  '0e': {
    canStandOn: true
  },
  '0f': {
    isSolid: true
  },
  '0l': {
    canStandOn: true
  },
  '0m': {
    canStandOn: true
  },
  '0n': {
    canStandOn: true
  },
  '1O': {
    isSolid: true
  },
  '1P': {
    isSolid: true
  },
  '1Q': {
    isSolid: true
  },
  '1S': {
    isSolid: true
  },
  '1T': {
    isSolid: true
  },
  '1U': {
    isSolid: true
  },
  '1V': {
    isSolid: true
  }
};
