'use strict';

var kSMColorSkyBlue = '#A9FDF4';

var kSMEngineTickTimeHistoryLength = 100;
var kSMEnginePixelsPerFrameHistoryLength = 100;
var kSMEngineBlockSize = 32;

//  TODO: rename these to kSMEngineViewportHeight/Width
var kSMEngineViewportWidth = 16;
var kSMEngineViewportHeight = 12;

//  Shrink the viewport in smaller windows
kSMEngineViewportWidth = Math.min(Math.floor(window.innerWidth / kSMEngineBlockSize), kSMEngineViewportWidth);
kSMEngineViewportHeight = Math.min(Math.floor(window.innerHeight / kSMEngineBlockSize), kSMEngineViewportHeight);

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
  },
  tanooki: {
    left: {
      duck: [[4, 0]],
      float: [[6, 0], [2, 1], [5, 0], [2, 1]],
      fly: [[0, 1], [8, 0], [7, 0], [8, 0]],
      jump: [[1, 1], [2, 1]],
      kick: [[3, 1]],
      run: [[4, 1], [5, 1]],
      shellJump: [[6, 1]],
      shellStand: [[7, 1]],
      shellWalk: [[8, 1], [7, 1]],
      skid: [[0, 2]],
      slide: [[1, 2]],
      spin: [[5, 1], [3, 0], [5, 4], [0, 0], [5, 1]],
      sprint: [[2, 2], [2, 3], [2, 4], [2, 3]],
      sprintJump: [[7, 0], [8, 0]],
      stand: [[5, 2]],
      starJump: [[6, 2], [7, 2], [8, 2], [0, 3]],
      statue: [[1, 3]],
      swim: [[3, 3], [2, 3], [8, 0], [2, 3]]
    },
    right: {
      duck: [[4, 3]],
      float: [[6, 3], [2, 4], [5, 3], [2, 4]],
      fly: [[0, 4], [8, 3], [7, 3], [8, 3]],
      jump: [[1, 4], [2, 4]],
      kick: [[3, 4]],
      run: [[4, 4], [5, 4]],
      shellJump: [[6, 4]],
      shellStand: [[7, 4]],
      shellWalk: [[8, 4], [7, 4]],
      skid: [[0, 5]],
      slide: [[1, 5]],
      spin: [[5, 4], [3, 0], [5, 1], [0, 0], [5, 4]],
      sprint: [[2, 5], [3, 5], [4, 5], [3, 5]],
      sprintJump: [[7, 3], [8, 3]],
      stand: [[5, 5]],
      starJump: [[6, 5], [7, 5], [8, 5], [0, 6]],
      statue: [[1, 6]],
      swim: [[3, 6], [2, 6], [8, 3], [2, 6]]
    },
    center: {
      back: [[0, 0]],
      climb: [[1, 0], [2, 0]],
      front: [[3, 0]]
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
var kSMPlayerHorizontalBounds = {top: 4, right: 32, bottom: 28, left: 0};
var kSMPlayerVerticalBounds   = {top: 0, right: 28, bottom: 32, left: 4};
var kSMAgentHitBounds = {
  player:      {top: 0, right: 48, bottom: 62, left: 16},
  goomba:      {top: 0, right: 28, bottom: 32, left: 4},
  turtleGreen: {top: 0, right: 28, bottom: 32, left: 4},
  block:       {top: 0, right: 32, bottom: 32, left: 0}
};
var kSMAgentData = {
  goomba: {
    normal: {
      walking: ['goomba-walk-1', 'goomba-walk-2'],
      squished: ['goomba-squish']
    }
  },
  turtle: {
    green: {
      walk: ['turtle-green-walk-1', 'turtle-green-walk-2'],
      shell: ['turtle-green-shell-1', 'turtle-green-shell-2', 'turtle-green-shell-3', 'turtle-green-shell-4']
    }
  }
};

/**
 * Collisions above this height with downward velocity are considered squishes,
 * where collisions below will cause damage.
 */
var kSMAgentSquishOffset = 16;

//  Goomba
var kSMGoombaSpeed = 1.75;
var kSMGoombaStartingDirection = -1;
var kSMGoombaWalkFrameDuration = 0.349;
var kSMGoombaSquishFrameDuration = 1.16;

//  Question block
var kSMQuestionBlockBounceDuration = 110;
var kSMQuestionBlockBounceAmount = kSMEngineBlockSize * 0.75;

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
 * TODO: should we switch to using milliseconds instead of seconds?
 */

/**
 * Sorry, I think my units aren't correct at the moment. I will try to fix them
 * once I get closer to mario-like movement.
 */

// Minimum height/width for a collision detection on an object.
var kSMMinimumCollisionPixels = 32;
// Horizontal physics
var kSMPlayerDeceleration = 30;
var kSMPlayerSkidDeceleration = 20;
var kSMPlayerWalkAcceleration = 19;
var kSMPlayerRunAcceleration = 28;
var kSMPlayerScreenEdgePushRight = 250;
var kSMPlayerScreenEdgePushLeft = 150;

// Vertical physics
var kSMPlayerGravity = 1.2;
var kSMPlayerJumpBoost = -12;
var kSMPlayerJumpBoostDeath = kSMPlayerJumpBoost * 1.5;
var kSMPlayerJumpBoostAfterSquish = kSMPlayerJumpBoost * 1.75;

// This time is in milliseconds.
var kSMPlayerStandJumpBoostTime = 200;
var kSMPlayerRunJumpBoostTime = 600;
var kSMPlayerSprintJumpBoostTime = 1200;
var kSMPlayerSquishBoostTime = 120;
var kSMPlayerSprintTime = 4000;

//  Times
var kSMPlayerMinimumWalkFrameDuration = 0.25;

//  Speeds, measured in blocks per second
var kSMPlayerMinimumJumpBoostBlocksPerSecond = 2.0;
var kSMPlayerWalkMaxBlocksPerSecond = 5.3;
var kSMPlayerRunMaxBlocksPerSecond = 12;
var kSMPlayerSprintMaxBlocksPerSecond = 15;
var kSMPlayerFallMaxBlocksPerSecond = 12;
