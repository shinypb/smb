var kSMLevelPropertyAgents = 'agents';
var kSMLevelPropertyBackgroundColor = 'backgroundColor';
var kSMLevelPropertyMapId = 'id';

window.SMLevel = function(mapData, properties) {
  window.SMLevels = window.SMLevels || {};

  if (typeof (properties.id) != 'number') {
    throw new Error("Must include 'id' in properties");
  }

  SMLevels[properties.id] = mapData;
  Object.keys(properties).forEach(function(key) {
    if (SMLevel.ValidProperties.indexOf(key) < 0) {
      throw new Error('Invalid property ' + key + ' in map definition');
    }
    console.log('setting', key, properties[key]);
    SMLevels[properties.id][key] = properties[key];
  });
}
SMLevel.ValidProperties = [kSMLevelPropertyAgents, kSMLevelPropertyBackgroundColor, kSMLevelPropertyMapId];

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
  agents: [
    ['SMPlayer', { x: 2, y: 0}],
    ['SMGoomba', { x: 14, y: 9 }],
    ['SMGoomba', { x: 8, y: 9}]
  ]
});