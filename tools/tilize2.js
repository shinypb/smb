#!/usr/bin/env node

var program = require('commander'),
    childProcess = require('child_process'),
    fs = require('fs'),
    Q = require('q');

var imageHeight,
    imageWidth,
    tileSize,
    cleanupKeys,
    transparencyString = '',
    chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    x = -1,
    y = 0,
    levelString = '',
    md5s = {},
    existingTiles = [],
    currentTile = '',
    currentMD5 = '',
    uniqueTileCount = 0,
    dateStr = +new Date + '-';

program
  .version('0.0.1')
  .option('-i, --image [image]', 'Specify an image file')
  .option('-s, --tileSize [tileSize]', 'Specify a tile size in pixels', 16)
  .option('-d, --outputDir [outputDir]', 'Specify a tile output directory', 'tiles')
  .option('-p, --outputFileName [outputFileName]', 'Specify a tile output prefix for images. (Make sure you\'re not overwriting other tiles!')
  .option('-t, --transparencyColor [transparencyColor]', 'Specify a tile transparency color as a hex color (Do not use a "#" -- ex: 9CFCF0)')
  .parse(process.argv);

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

if (!program.outputFileName) {
  console.log('No output file name was specified.');
  process.exit();
}

if (!fs.existsSync(program.outputDir) || !fs.statSync(program.outputDir).isDirectory()) {
  console.log('Output directory does not exist.');
  process.exit();
}


// Output errors.
function dumpError(error) {
  console.log('Error: ' + error);
}


function identifyImage() {
  var deferred = Q.defer();

  childProcess.exec('identify ' + program.image, function (error, stdout, stderr) {
    if (error) {
      deferred.reject(error);
    } else {
      var resolution = stdout.match(/[0-9]+x[0-9]+/);
      imageWidth = parseInt(resolution[0].split('x')[0], 10);
      imageHeight = parseInt(resolution[0].split('x')[1], 10);

      if ((imageHeight / tileSize) % 1 === 0 && (imageWidth / tileSize) % 1 === 0) {
        deferred.resolve();
      } else {
        deferred.reject('Image height and width are not multiples of ' + tileSize);
      }
    }
  });

  return deferred.promise;
}


function removeTile(filename) {
  var deferred = Q.defer();

  childProcess.exec('rm ' + program.outputDir + '/' + filename, function (error, stdout, stderr) {
    if (error) {
      deferred.reject(error);
    } else {
      deferred.resolve();
    }
  });

  return deferred.promise;
}


function moveTile(source_name, dest_name) {
  var deferred = Q.defer();

  childProcess.exec('mv ' + program.outputDir + '/' + source_name + ' ' + program.outputDir + '/' + dest_name, function (error, stdout, stderr) {
    if (error) {
      deferred.reject(error);
    } else {
      deferred.resolve();
    }
  });

  return deferred.promise;
}


function createTile() {
  var deferred = Q.defer();

  var convertCommand = 'convert '+ transparencyString + program.image + ' -strip -crop ' + tileSize + 'x' + tileSize + '+' + (x * tileSize) + '+' + (y * tileSize) + ' ' + program.outputDir + '/temp.png';
  childProcess.exec(convertCommand, function (error, stdout, stderr) {
    if (error) {
      deferred.reject(error);
    } else {
      deferred.resolve();
    }
  });

  return deferred.promise;
}


function getMD5() {
  var deferred = Q.defer();

  childProcess.exec('md5 -q ' + program.outputDir + '/temp.png', function (error, stdout, stderr) {
    if (error) {
      deferred.reject(error);
    } else {
      currentMD5 = stdout;
      deferred.resolve();
    }
  });

  return deferred.promise;
}


function inspectNextTile() {
  x++;
  if (x * tileSize >= imageWidth) {
    x = 0;
    y++;
    levelString += '\n';
  }

  if (y * tileSize < imageHeight) {
    createTile()
      .then(getMD5)
      .then(processTile)
      .then(inspectNextTile, dumpError);

  } else {
    // print out final stats
    console.log('Unique tiles: ' + uniqueTileCount);
    console.log(levelString);
    cleanupKeys = Object.keys(md5s);
    createMontage()
      .then(cleanup, dumpError);
    
  }
}


function processTile() {
  var deferred = Q.defer();

  if (!md5s[currentMD5]) {
    // Unique tile; add it to the indexes.
    md5s[currentMD5] = {
      encoding: chars.charAt(Math.floor(uniqueTileCount / chars.length)) + chars.charAt((uniqueTileCount % chars.length)),
      filename: dateStr + pad(uniqueTileCount, 4) + '.png'
    };
    uniqueTileCount++;

    moveTile('temp.png', md5s[currentMD5].filename)
      .then(deferred.resolve, dumpError);
  } else {
    // Non-unique tile; remove the temp file.
    removeTile('temp.png')
      .then(deferred.resolve, dumpError);
  }
  levelString += md5s[currentMD5].encoding;

  return deferred.promise;
}


function createMontage() {
  var deferred = Q.defer();

  var command = 'montage ' + program.outputDir + '/' + dateStr + '*.png -background transparent -tile ' + Math.min(62, uniqueTileCount) + 'x' + (Math.floor(uniqueTileCount / chars.length) + 1) + ' -geometry 16x16+0+0 ' + program.outputDir + '/' + program.outputFileName;
  childProcess.exec(command, function (error, stdout, stderr) {
    if (error) {
      deferred.reject(error);
    } else {
      deferred.resolve();
    }
  });

  return deferred.promise;
}

function cleanup() {
  if (cleanupKeys.length > 0) {
    var key = cleanupKeys.pop();
    removeTile(md5s[key].filename)
      .then(cleanup, dumpError);
  }
}


function pad(num, size) {
  var s = num + '';
  while (s.length < size) s = '0' + s;
  return s;
}


identifyImage()
  .then(inspectNextTile, dumpError);











