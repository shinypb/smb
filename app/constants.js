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

var kSMTop = 0;
var kSMRight = 1;
var kSMBottom = 2;
var kSMLeft = 3;

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
  goomba: [0, 28, 32, 4],
  turtleGreen: [0, 28, 32, 4]
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
var kSMGoombaSpeed = 1;
var kSMGoombaStartingDirection = -1;
var kSMGoombaWalkFrameDuration = 0.349;
var kSMGoombaSquishFrameDuration = 1.16;

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
var kSMPlayerJumpBoostTime = 260;
var kSMPlayerSquishBoostTime = 120;

//  Times
var kSMPlayerMinimumWalkFrameDuration = 0.25;

//  Speeds, measured in blocks per second
var kSMPlayerWalkMaxBlocksPerSecond = 5.3;
var kSMPlayerRunMaxBlocksPerSecond = 12;