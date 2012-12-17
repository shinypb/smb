var kSMColorSkyBlue = '#A9FDF4';

var kSMEngineFPS = 60;
var kSMEngineBlockSize = 32;
var kSMFrameUnit = 1 / kSMEngineFPS;

//  TODO: rename these to kSMEngineViewportHeight/Width
var kSMEngineGameWidth = 16; // should be 16 once scrolling is available
var kSMEngineGameHeight = 12;

//  Map data values
var kSMBlockOutOfBounds = NaN;
var kSMBlockSky = ' ';
var kSMBlockWood = '#';
var kSMBlockQuestion = '?';
var kSMBlockBush = '%';

//  Map block characteristics
window.SMBlockProperties = {};
SMBlockProperties[kSMBlockOutOfBounds] = {
  color: '#000',
  isSolid: true,
  isTransparent: false
}
SMBlockProperties[kSMBlockSky] = {
  color: kSMColorSkyBlue,
  isTransparent: false
};
SMBlockProperties[kSMBlockWood] = {
  image: 'wood-block',
  isSolid: true,
  isTransparent: true
};
SMBlockProperties[kSMBlockQuestion] = {
  image: 'question-block',
  isSolid: true,
  isTransparent: false
};
SMBlockProperties[kSMBlockBush] = {
  image: 'bush',
  isSolid: false,
  isTransparent: true
};
Object.keys(SMBlockProperties).forEach(function(blockName) {
  //  Cross-reference
  SMBlockProperties[blockName].name = blockName;
});

//  Player
var kSMPlayerHeightPx = 32;
var kSMPlayerWidthPx = 32;
var kSMPlayerVerticalSpeed = 0;
var kSMPlayerHorizontalSpeed = 0;
var kSMPlayerStartWalkFrame = 0;
var kSMPlayerStartAlive = true;
var kSMPlayerDirectionString = {
  '1': 'right',
  '0': 'center',
  '-1': 'left'
};
var kSMPlayerDirectionRight = 1;
var kSMPlayerDirectionCenter = 0;
var kSMPlayerDirectionLeft = -1;
var kSMPlayerStartState = 'small';
var kSMPlayerImages = {
  small: {
    left: {
      walking: ['player-left', 'player-left-walk'],
      jumping: ['player-left-jump'],
      skidding: ['player-left-skid']
    },
    right: {
      walking: ['player-right', 'player-right-walk'],
      jumping: ['player-right-jump'],
      skidding: ['player-right-skid']
    },
    center: {
      dead: ['player-dead']
    }
  }
};
var kSMPlayerAudioLostLife = 'lost-life';
var kSMPlayerAudioJumpBig = 'jump-big';
var kSMPlayerAudioJumpSmall = 'jump-small';
var kSMAgentAudioSquish = 'squish';
var kSMEngineAudioBackgroundMusic1 = 'background-music-1';
/**
 * Player bounding constants. I have different bounding boxes for horizontal
 * and vertical movement at the moment. I got less "tweaky" behavior when
 * I separated them. Bounding is measured in pixels inwards from the edge of
 * the sprite, starting at the top and moving clockwise.
 */
var kSMPlayerHorizontalBounds = [4, 32, 28, 0];
var kSMPlayerVerticalBounds   = [0, 28, 32, 4];
var kSMAgentHitBounds = {
  player: [0, 28, 32, 4],
  goomba: [0, 28, 32, 4]
};
/**
 * Collisions above this height with downward velocity are considered squishes,
 * where collisions below will cause damage.
 */
var kSMAgentSquishOffset = 16;

//  Goomba
var kSMGoombaSpeed = 1;
var kSMGoombaStartingDirection = -1;
var kSMGoombaWalkFrameDuration = kSMEngineFPS * 5.83;
var kSMGoombaSquishFrameDuration = kSMEngineFPS * 11.6;
var kSMGoombaWalkImages = ['goomba-walk-1', 'goomba-walk-2'];
var kSMGoombaSquishImage = 'goomba-squish';

//  Keycodes
var kSMKeyAction = 90;
var kSMKeyJump = 88;
var kSMKeyLeft = 37;
var kSMKeyUp = 38;
var kSMKeyRight = 39;
var kSMKeyDown = 40;

/**
 * Physics
 * Speeds should be measured in blocks-per-second
 * Times should be measured in seconds
 */

/**
 * Sorry, I think my units aren't correct at the moment. I will try to fix them
 * once I get closer to mario-like movement.
 */

// Horizontal physics
var kSMPlayerDeceleration = 30;
var kSMPlayerSkidDeceleration = 20;
var kSMPlayerWalkAcceleration = 19;
var kSMPlayerRunAcceleration = 28;

// Vertical physics
var kSMPlayerGravity = 1.2;
var kSMPlayerJumpBoost = -12;
// This time is in milliseconds.
var kSMPlayerJumpBoostTime = 220;
var kSMPlayerSquishBoostTime = 120;

//  Times
var kSMPlayerMinimumWalkFrameDuration = 0.25;

//  Speeds, measured in blocks per second
var kSMPlayerWalkMaxBlocksPerSecond = 5.3;
var kSMPlayerRunMaxBlocksPerSecond = 12;