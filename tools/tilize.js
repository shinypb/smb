#!/usr/bin/env node

// Many thanks to Rick N. Bruns for his awesome NES maps at:
// http://nesmaps.com/maps/SuperMarioBrothers3/SuperMarioBrothers3.html
//
// Requires node commander: https://github.com/visionmedia/commander.js/
// Requires imagemagick: http://www.imagemagick.org/script/download.php

var program = require('commander'),
    childProcess = require('child_process'),
    assert = require('assert')
    fs = require('fs');

program
  .version('0.0.1')
  .option('-i, --image [image]', 'Specify an image file')
  .option('-s, --tileSize [tileSize]', 'Specify a tile size in pixels', 16)
  .option('-d, --outputDir [outputDir]', 'Specify a tile output directory', 'tiles')
  .option('-p, --outputPrefix [outputPrefix]', 'Specify a tile output prefix for images. (Make sure you\'re not overwriting other tiles!')
  .option('-t, --transparencyColor [transparencyColor]', 'Specify a tile transparency color as a hex color (Do not use a "#" -- ex: 9CFCF0)')
  .parse(process.argv);

var imageHeight,
    imageWidth,
    tileSize,
    md5s = {},
    existingTiles = [],
    levelString = '',
    transparencyString = '',
    x = 0,
    y = 0,
    currentTile = '',
    currentCh = 'a',
    currentMD5 = '';

tileSize = parseInt(program.tileSize);

if (program.transparencyColor && program.transparencyColor.length == 6) {
  transparencyString = '-transparent "#' + program.transparencyColor + '" ';
} else {
  console.log('Warning: No transparency color given (or given in an unrecognized format).');
}

if (!program.image) {
  console.log('No image to process.');
  process.exit();
}

if (!program.outputPrefix) {
  console.log('No output prefix was specified.');
  process.exit();
}

if (!fs.existsSync(program.outputDir) || !fs.statSync(program.outputDir).isDirectory()) {
  console.log('Output directory does not exist.');
  process.exit();
}

// All blocks must be a single character to encode properly.
// Increment character code skipping unprintable characters.
function incrementChar(ch) {
  var newCode = ch.charCodeAt(0) + 1;
  if (newCode == 126) { newCode = 161; }
  return String.fromCharCode(newCode);
}

// Output errors.
function dumpError(error) {
  console.log(error.stack);
  console.log('Error code: '+error.code);
  console.log('Signal received: '+error.signal);
}

// Removes a tile if it has been found to be a duplicate.
// The quit argument determines if tile processing should continue after
// this function completes.
// (quit will be true only on the last tile if that tile was a dupe.)
function removeTile(rmX, rmY, callback) {
  childProcess.exec('rm ' + program.outputDir + '/' + program.outputPrefix + rmX + '-' + rmY + '.png', function (error, stdout, stderr) {
    if (error) {
      dumpError(error);
    } else {
      if (callback) {
        callback();
      }
    }
  });
}

// Start the process by checking to make sure the image dimensions are a
// multiple of tileSize.
function identifyImage() {
  childProcess.exec('identify ' + program.image, function (error, stdout, stderr) {
    if (error) {
      dumpError(error);
    } else {
      try {
        var resolution = stdout.match(/[0-9]+x[0-9]+/);
        imageWidth = parseInt(resolution[0].split('x')[0]);
        imageHeight = parseInt(resolution[0].split('x')[1]);

        assert((imageHeight / tileSize) % 1 === 0 && (imageWidth / tileSize) % 1 === 0,
          'Image height and width are not multiples of ' + tileSize);

        createTile();
      } catch(err) {
        console.log('error: ' + err);
      }
    }
  });
}

// Create a tile with imagemagick.
// -strip remvoes all metadata; important for the md5 comparison and reduces file size.
// -crop 16x16 is the tile; +x+y is the offset
function createTile() {
  var convertCommand = 'convert '+ transparencyString + program.image + ' -strip -crop 16x16+' + (x * tileSize) + '+' + (y * tileSize) + ' ' + program.outputDir + '/' + program.outputPrefix + x + '-' + y + '.png';
  childProcess.exec(convertCommand, function (error, stdout, stderr) {
    if (error) {
      dumpError(error);
    } else {
      getMD5(program.outputPrefix + x + '-' + y + '.png', processCurrentTile);
    }
  });
}

// Perform an md5 on the file.
// This is a simple way to get a string hash for each file and detect duplicates.
// For each unique block, increment the character and add it to the index.
// For each duplicate character, delete that tile.
// Output the tile character into a level string.
function getMD5(filename, callback) {
  childProcess.exec('md5 -q ' + program.outputDir + '/' + filename, function (error, stdout, stderr) {
    if (error) {
      dumpError(error);
    } else {
      currentMD5 = stdout;
      callback(filename);
    }
  });
}

function registerCurrentTile(filename) {
  if (!md5s[currentMD5]) {
    // Unique tile; add it to the indexes.
    md5s[currentMD5] = {char: currentCh, file: filename};
    currentCh = incrementChar(currentCh);
  } else {
    console.log("Warning: Pre-existing tile has a conflicting md5. This probably shouldn't happen");
  }
  registerExistingTiles();
}

function processCurrentTile(filename) {
  var rmX = null, rmY = null;

  if (!md5s[currentMD5]) {
    // Unique tile; add it to the indexes.
    md5s[currentMD5] = {char: currentCh, file: filename};
    currentCh = incrementChar(currentCh);
  } else {
    // Duplicate tile; record the x and y coordinates so we can
    // insert a remove command before we build and test the next tile.
    rmX = x;
    rmY = y;
  }

  // Add the tile character to the level string.
  levelString += md5s[currentMD5].char;

  // Increment x; if x is greater than the image width, wrap to the next y.
  x++;
  if (x * tileSize >= imageWidth) {
    x = 0;
    y++;
    levelString += '\n';
  }

  // If y is less than image height, continue processing.
  if (y * tileSize < imageHeight) {
    if (rmX === null) {
      // Previous tile was unique, move to the next one.
      createTile();
    } else {
      // Previous tile was a dupe; delete it and move to the next one.
      removeTile(rmX, rmY, createTile);
    }
  } else {
    // We're off the end of the file.
    if (rmX !== null) {
      // If the last time was a dupe, delete it.
      removeTile(rmX, rmY);
    }

    // Output the text data.
    // This is where a node server would go to make this output prettier.
    console.log('\n');
    for (var t in md5s) {
      console.log(md5s[t].char + ': ' + md5s[t].file);
    }
    console.log('Level:\n' + levelString + '\n');
    console.log(md5s);
  }
}

function registerExistingTiles() {
  if (existingTiles.length) {
    var tile = existingTiles.pop();
    if (tile.split('.').reverse()[0] == 'png') {
      currentTile = tile;
      getMD5(tile, registerCurrentTile);
    } else {
      registerExistingTiles();
    }
  } else {
    identifyImage();
  }
}

var existingTiles = fs.readdirSync(program.outputDir);
registerExistingTiles();


































