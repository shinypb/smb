var kSMLevelPropertyAgents = 'agents';
var kSMLevelPropertyBackgroundColor = 'backgroundColor';
var kSMLevelPropertyMapId = 'id';

window.SMLevel = function(mapData, properties) {
  window.SMLevels = window.SMLevels || {};

  if (typeof (properties.id) != 'number') {
    throw new Error("Must include 'id' in properties");
  }

  var validProperties = [
    'agents',
    'backgroundColor',
    'id'
  ];

  SMLevels[properties.id] = mapData;
  Object.keys(properties).forEach(function(key) {
    if (validProperties.indexOf(key) < 0) {
      throw new Error('Invalid property ' + key + ' in map definition');
    }
    SMLevels[properties.id][key] = properties[key];
  });
}

SMLevel([
'                                                                                                                                            []          vbbbbbbbbbbbbbbbbbbbbbbbb',
'                                                                                                                                            []          vbbbbbbbbbbbbbbbbbbbbbbbb',
'                                                                                                                                            []          vbbbbbbbbbbbbbbbbbbbbbbbb',
'             ??                                                                                                                             []          vbbbbbbbbbbbbbbbbbbbbbbbb',
'                                                                                                                                            ##          vbbbbbbbbbbbbbbbbbbbbbbbb',
'                          ?                                                                                                                             vbbbbbbbbbbbbbbbbbbbbbbbb',
'                                                                                                                                                        vbbbbbbbbbbbbbbbbbbbbbbbb',
'          ??                                                                                                                                            vbbbbbbbbbbbbbbbbbbbbbbbb',
'                     <>                                                                            #   #           <>      oooo             ##          vbbbbbbbbbbbbbbbbbbbbbbbb',
'                     []                 ?%%%%%%                 %%                                ##   ##      <>  []     ooooo   o         []  <>      vbbbbbbbbbbbbbbbbbbbbbbbb',
'         %%%         []               qwwwwwwwwwwwwwwwwwwwwwwwwwwwe      %%%                     ###   ### %%% []  []    ooooooo  oo        []  []      vbbbbbbbbbbbbbbbbbbbbbbbb',
'qwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwweasssssssssssssssssssssssssssd    qwwwwwwwwwwwwwwwwwwwwe  qwwwe   qwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwe qwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwe'
], {
  id: 0,
  backgroundColor: kSMColorSkyBlue,
  agents: [
    ['SMPlayer', { x: 2, y: 0}],
    ['SMGoomba', { x: 14, y: 9 }],
    ['SMGoomba', { x: 10, y: 7}],
    ['SMGoomba', { x: 17, y: 9 }],
    ['SMGoomba', { x: 22, y: 9}],
    ['SMGoomba', { x: 33, y: 9}],
    ['SMGoomba', { x: 52, y: 7}],
    ['SMGoomba', { x: 55, y: 7}],
    ['SMGoomba', { x: 59, y: 7}]
  ]
});