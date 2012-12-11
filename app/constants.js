var kSMColorSkyBlue = '#A9FDF4';

var kSMEngineFPS = 60;
var kSMEngineBlockSize = 32;
var kSMEngineGameWidth = 48; // should be 16 once scrolling is available
var kSMEngineGameHeight = 12;
var kSMFrameUnit = 1 / kSMEngineFPS;

//  Player
var kSMPlayerHeightPx = 32;
var kSMPlayerWidthPx = 32;
var kSMPlayerVerticalStateIdle = 'idle';
var kSMPlayerVerticalStateJumping = 'jumping';
var kSMPlayerVerticalStateFalling = 'falling';
var kSMPlayerVerticalSpeed = 0;
var kSMPlayerHorizontalStateIdle = 'idle';
var kSMPlayerHorizontalStateLeft = 'left';
var kSMPlayerHorizontalStateRight = 'right';
var kSMPlayerHorizontalSpeed = 0;
var kSMPlayerFaceLeft = 'left';
var kSMPlayerFaceRight = 'right';
var kSMPlayerImageLeft = 'player-left';
var kSMPlayerImageRight = 'player-right';
var kSMPlayerImageLeftSkid = 'player-left-skid';
var kSMPlayerImageRightSkid = 'player-right-skid';
var kSMPlayerImageLeftWalk = 'player-left-walk';
var kSMPlayerImageRightWalk = 'player-right-walk';


//  Keycodes
var kSMKeyAction = 90;
var kSMKeyJump = 88;
var kSMKeyLeft = 37;
var kSMKeyUp = 378
var kSMKeyRight = 39;
var kSMKeyDown = 39;


/**
 * Physics
 * Speeds should be measured in blocks-per-second
 * Times should be measured in seconds
 */

//  Times
var kSMPlayerSkidDurationInSeconds = 0.25;
var kSMPlayerMinimumWalkFrameDuration = 0.25;

//  Speed coefficients
var kSMPlayerWalkAcceleration = 1.0912;
var kSMPlayerDeceleration = 0.95;
var kSMPlayerDecelerationFromRunToWalk = 0.9825
var kSMPlayerRunAcceleration = 1.0925;
var kSMPlayerChangedDirectionPenalty = 0.125;

//  Speeds, measured in blocks per second
var kSMPlayerInitialSpeed = 0.25;
var kSMPlayerWalkMaxBlocksPerSecond = 5;
var kSMPlayerRunMaxBlocksPerSecond = 12;
