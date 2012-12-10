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

//  Keycodes
var kSMKeyAction = 90;
var kSMKeyJump = 88;
var kSMKeyLeft = 37;
var kSMKeyUp = 378
var kSMKeyRight = 39;
var kSMKeyDown = 39;

//  Physics
var kSMPlayerInitialSpeed = 0.25; // in blocks-per-second
var kSMPlayerWalkAcceleration = 1.0912;
var kSMPlayerDeceleration = 0.95;
var kSMPlayerWalkMaxBlocksPerSecond = 5;
var kSMPlayerRunAcceleration = 1.0925;
var kSMPlayerRunMaxBlocksPerSecond = 12;
var kSMPlayerChangedDirectionPenalty = 0.125;
var kSMPlayerSkidDurationInSeconds = 0.25;