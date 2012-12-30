'use strict';

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

/*
      <img src="resources/big-block-white-bottom-left.png"    data-character="X">
      <img src="resources/big-block-white-bottom-right.png"   data-character="Y">
      <img src="resources/big-block-white-bottom.png"         data-character="Z">
      <img src="resources/big-block-white-left.png"           data-character="1">
      <img src="resources/big-block-white-middle.png"         data-character="2">
      <img src="resources/big-block-white-right.png"          data-character="3">
      <img src="resources/big-block-white-shadow-bottom.png"  data-character="4">
      <img src="resources/big-block-white-shadow-middle.png"  data-character="5">
      <img src="resources/big-block-white-shadow-top.png"     data-character="6">
      <img src="resources/big-block-white-top-left.png"       data-character="7" data-can-stand-on="true">
      <img src="resources/big-block-white-top-right.png"      data-character="8" data-can-stand-on="true">
      <img src="resources/big-block-white-top.png"            data-character="9" data-can-stand-on="true">

      <img src="resources/big-block-shadow-middle.png"        data-character="V">
      <img src="resources/big-block-shadow-top.png"           data-character="W">
*/

SMLevel([
'                                                                                                                                              []         bvvvvvvvvvvvvvvvvvvvvvvvv',
'                                                                                                                                              []         bvvvvvvvvvvvvvvvvvvvvvvvv',
'                                                                                                                                              []         bvvvvvvvvvvvvvvvvvvvvvvvv',
'                                                                                                                                              []         bvvvvvvvvvvvvvvvvvvvvvvvv',
'              ??                7998W                                                                                                         ##         bvvvvvvvvvvvvvvvvvvvvvvvv',
'                          ?     1223V                                                                                                                    bvvvvvvvvvvvvvvvvvvvvvvvv',
'                 -=_W        SUUT623V                                                                                                                    bvvvvvvvvvvvvvvvvvvvvvvvv',
'  ik       ??    $^&V        MNNO523V                                                                                                                    bvvvvvvvvvvvvvvvvvvvvvvvv',
' ijgikik       SUT)&V <> GIIIHNNO523V                                                               #   #           <>      oooo             ##          bvvvvvvvvvvvvvvvvvvvvvvvv',
' chjfgchk      MNO(&V [] DEEEFNNGIIIIH   ?%%%%%%                 %%                                ##   ##      <>  []     ooooo   o         []  <>      bvvvvvvvvvvvvvvvvvvvvvvvv',
' cfffhjfg %%%  JLK*!V [] ACCCBNNACCCCB qwwwwwwwwwwwwwwwwwwwwwwwwwwwe      %%%                     ###   ### %%% []  []    ooooooo  oo        []  []      bvvvvvvvvvvvvvvvvvvvvvvvv',
'qwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwweasssssssssssssssssssssssssssd    qwwwwwwwwwwwwwwwwwwwwe  qwwwe   qwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwe qwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwe'
], {
  id: 0,
  backgroundColor: kSMColorSkyBlue,
  agents: [
    ['SMPlayer', { x: 1.5, y: 10}],
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