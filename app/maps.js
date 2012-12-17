window.SMLevel = function(mapData, properties) {
  window.SMLevels = window.SMLevels || {};

  if (typeof (properties.id) != 'number') {
    throw new Error("Must include 'id' in properties");
  }

  SMLevels[properties.id] = mapData;
  Object.keys(properties).forEach(function(key) {
    SMLevels[properties.id][key] = properties[key];
  });
}

SMLevel([
  '                                                ',
  '                                                ',
  '                                                ',
  '                                                ',
  '                                                ',
  '                           #                    ',
  '   #?#                                          ',
  '      #                                         ',
  '          #                    #                ',
  '#   %%%  ###                  ###               ',
  '################################################',
  '################################################'
], {
  id: 0,
  backgroundColor: kSMColorSkyBlue,
  playerStartBlock: { x: 2, y: 0 },
  goombas: [
    { x: 14, y: 9 },
    { x: 10, y: 7 },
    { x: 17, y: 9 },
    { x: 22, y: 9 },
  ]
});