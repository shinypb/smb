var kSMColorSkyBlue = '#A9FDF4';

var kSMEngineFPS = 60;
var kSMEngineBlockSize = 32;
var kSMFrameUnit = 1 / kSMEngineFPS;

//  TODO: rename these to kSMEngineViewportHeight/Width
var kSMEngineGameWidth = 16; // should be 16 once scrolling is available
var kSMEngineGameHeight = 12;


//  Map data values
var kSMBlockSky = ' ';
var kSMBlockWood = '#';
var kSMBlockQuestion = '?';
var kSMBlockBush = '%';

//  Map block characteristics
window.SMBlockProperties = {};
SMBlockProperties[kSMBlockSky] = {
  color: kSMColorSkyBlue
};
SMBlockProperties[kSMBlockWood] = {
  image: 'wood-block',
  isSolid: true
};
SMBlockProperties[kSMBlockQuestion] = {
  image: 'question-block',
  isSolid: true
};
SMBlockProperties[kSMBlockBush] = {
  image: 'bush',
  isSolid: false
};

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
var kSMPlayerImages = {
	left: {
		small: {
			walking: ["player-left", "player-left-walk"],
			jumping: ["player-left-jump"],
			skidding: ["player-left-skid"]
		}
	},
	right: {
		small: {
			walking: ["player-right", "player-right-walk"],
			jumping: ["player-right-jump"],
			skidding: ["player-right-skid"]
		}
	},
	center: {
		small: {
			dead: ["player-dead"]
		}
	}
};

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

//  Times
var kSMPlayerSkidDurationInSeconds = 0.25;
var kSMPlayerMinimumWalkFrameDuration = 0.25;

//  Speed coefficients
var kSMPlayerWalkAcceleration = 1.0912;
var kSMPlayerDeceleration = 0.95;
var kSMPlayerDecelerationFromRunToWalk = 0.9825;
var kSMPlayerRunAcceleration = 1.0925;
var kSMPlayerChangedDirectionPenalty = 0.125;

//  Speeds, measured in blocks per second
var kSMPlayerInitialSpeed = 0.25;
var kSMPlayerWalkMaxBlocksPerSecond = 5.3;
var kSMPlayerRunMaxBlocksPerSecond = 12;
var kSMPlayerSpeedAfterSkidFinishes = 3;