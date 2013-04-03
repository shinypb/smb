'use strict';

var kSMLevelPropertyAgents = 'agents';
var kSMLevelPropertyBackgroundColor = 'backgroundColor';
var kSMLevelPropertyMapId = 'id';
var kSMLevelPropertyTilesetName = 'tilesetName';

window.SMLevel = function(mapData, properties) {
  window.SMLevels = window.SMLevels || {};

  if (typeof (properties.id) != 'number') {
    throw new Error("Must include 'id' in properties");
  }
  if (typeof (properties.tilesetName) != 'string') {
    throw new Error("Must include 'tileset' in properties");
  }
  if (!SMTilesets[properties.tilesetName]) {
    throw new Error("Unknown tileset '" + properties.tileset + "'");
  }

  SMLevels[properties.id] = mapData;
  Object.keys(properties).forEach(function(key) {
    if (SMLevel.ValidProperties.indexOf(key) < 0) {
      throw new Error('Invalid property ' + key + ' in map definition');
    }
    console.log('setting', key);
    SMLevels[properties.id][key] = properties[key];
  });
}
SMLevel.ValidProperties = [
  kSMLevelPropertyAgents,
  kSMLevelPropertyBackgroundColor,
  kSMLevelPropertyMapId,
  kSMLevelPropertyTilesetName
];

SMLevel([
/*
'                                                                                                                                                                                                                                                                                                          01      01  020303030303030303030303030303030303030303',
'                                                                                    04        01    04                                                                                                                                          05  04                                                                020303030303030303030303030303030303030303',
'              01                05        01                                                            05                                                                01                              01                                                                                                          020303030303030303030303030303030303030303',
'                                                                          0104                01                                                              01                                                                                                                                                      020303030303030303030303030303030303030303',
'                            04  05            01                                                                        05                                                                  04                    01    05                                                                                            020303030303030303030303030303030303030303',
'                                    0401                                                                                                                                                  01                                            05                                            01                              020303030303030303030303030303030303030303',
'                                                                                                                                                                                      01    04                                                                                                                        020303030303030303030303030303030303030303',
'                                                                                                                                          01                                                                                                                            05                0607                        020303030303030303030303030303030303030303',
'                                                                                                                                                    04  05                          08                                                                                                    090A                        020303030303030303030303030303030303030303',
'                                                                                                                                                                    0B0C0C0D0E01                                                                05                                        090A                01      020303030303030303030303030303030303030303',
'                                                                                                                                                                    0F0G0G0H0I                                                                                                            090A                        020303030303030303030303030303030303030303',
'                                                                                                                                                                    0J0K0K0K0L            0M0M0M0M0M0M0M0M0M0M0M0M0M                                                                      090A                        020303030303030303030303030303030303030303',
'                                                                                                                                                                                0M0M0M0M                                                                                                  090A                        020303030303030303030303030303030303030303',
'                                                                                                                                                                                                                                                                                          090A                        020303030303030303030303030303030303030303',
'                                                                                                                                                                                                                                                                                          090A                        020303030303030303030303030303030303030303',
*/
'                                                                                                                                                                                                                                                                                          090A                        020303030303030303030303030303030303030303',
'                                        0N0O0P                                                                                                                                                                                                                                            090A                        020303030303030303030303030303030303030303',
'              0N0O0O0P                  0Q0R0S                                  0N0O0P                                                            0N0O0P                                                      0N0O0O0O0P                                                        0T0U0V0E  090A                        020303030303030303030303030303030303030303',
'              0Q0R0R0S                                                          0Q0R0S                                                            0Q0R0S                                                      0Q0R0R0R0S                                                        0W0X0Y0I  090A    0N0O0P    0Z0a      020303030303030303030303030303030303030303',
'                            1V1V                                0c0d0d0e0E                0N0O0O0O0P                                                                                                                                                                            0W0X0Y0I  0f0f    0Q0R0S    0g0h0a    020303030303030303030303030303030303030303',
'                                                    1V          0i0j0j0k0I                0Q0R0R0R0S                                                                  0l0m0m0m0m0m0n0E                                                                                          0W0X0Y0I                    0g0o0p    020303030303030q0r0303030s0t0u030303030303',
'                                  0l0m0n0E                0B0C0C0D0v0j0k0I                                    0Z0a                                                    0w0x0x0x0x0x0y0I      0f0f                                                                                0W0X0Y0I                  0Z0z0o0p    020303030303031011030303120313030303030303',
'    0Z0a              1V1V        0w0x0y0I                14151516170j0k0I              1V              0Z0a0Z0z0p0Z0a  0Z0a                                      0B0C0C0C0C0C0D180y0I                                                                                          0W0X0Y0I                0Z0z0o0o0p    02030303030303100q0r0303191A1B030303030303',
'  0Z0z0p0Z0a0Z0a              0B0C0D180y0I  0607  0T0U0U0U0V1C1516170j0k0I                              0g0h0z0h0z0o0p  0g0h0a                                    141515151515161D0y0I  1V              0f      0f                      0607  0Z0a      08080808            0B0C0D1E0Y0I  0f0f          0g0o0o0o0p    0203030303030310031103030303030303030q0r03',
'  0g0h0z0o0p0g0h0a            1415161D0y0I  090A  0W0X0X0X0Y1F150T0U0U0U0U0V0E    1V1G1G1G1G1G1G      0Z0z0o0o0o0o0o0p0Z0z0o0p    1G1G                        0T0U0U0U0U0U0V1C161D0y0I                0f0f      0f0f            0607    090A  0g0h0a  0808080808      08    1415161H0Y0I  090A    0607  0g0o0o0o0h0a  0203030303030310030q0r03030303030303101103',
'  0g0o0o0o0h0z0o0p  1G1G1G    0F0G0H1I1J0I  090A  1K1L1L1L1M1N0G1K1L1L1L1L1M0I1O1P1P1P1P1P1P1P1P1P1P1P1P1P1P1P1P1P1P1P1P1P1P1P1P1P1P1P1Q            1G1G1G    1K1L1L1L1L1L1M1N0H1I1J0I              0f0f0f      0f0f0f  1G1G1G  090A    090A0Z0z0o0p08080808080808    0808  0F0G0H1R1M0I  090A    090A  0g0o0o0o0o0p  0203030303030q0r0303110303030303030q0r1103',
'1O1P1P1P1P1P1P1P1P1P1P1P1P1P1P1P1P1P1P1P1P1P1P1P1P1P1P1P1P1P1P1P1P1P1P1P1P1P1Q1S1T1T1T1T1T1T1T1T1T1T1T1T1T1T1T1T1T1T1T1T1T1T1T1T1T1T1T1U        1O1P1P1P1P1P1P1P1P1P1P1P1P1P1P1P1P1P1P1P1P1Q    1O1P1P1P1Q  0f  1O1P1P1P1P1P1P1P1P1P1P1P1P1P1P1P1P1P1P1P1P1P1P1P1P1P1P1P1P1P1P1P1P1P1P1Q  1O1P1P1P1P1P1P1P1P1P1P1P1P1P1P1P1P1P1P1P1P1P1P1P1P1P1P1P1P1P1P1P1P1P1Q'], {
  id: 0,
  tilesetName: 'grassland',
  backgroundColor: kSMColorSkyBlue,
  agents: [
    ['SMPlayer', { x: 1.5, y: 10 }],

    ['SMQuestionBlock', { x: 11, y: 7 }],
    ['SMQuestionBlock', { x: 12, y: 7 }],
    ['SMQuestionBlock', { x: 14, y: 4 }],
    ['SMQuestionBlock', { x: 15, y: 4 }],
    ['SMQuestionBlock', { x: 26, y: 5 }],
    ['SMQuestionBlock', { x: 41, y: 9 }],
    ['SMQuestionBlock', { x: 44, y: 7 }],
    ['SMQuestionBlock', { x: 92, y: 8 }],

    ['SMGoomba', { x: 17, y: 10 }],
    ['SMGoomba', { x: 16, y: 10 }],
    ['SMGoomba', { x: 15, y: 10 }],
    ['SMGoomba', { x: 13, y: 10 }],
    ['SMGoomba', { x: 12, y: 10 }],
    ['SMGoomba', { x: 11, y: 10 }],
    ['SMGoomba', { x: 10, y: 10 }],
    ['SMGoomba', { x:  9, y: 10 }],
    ['SMGoomba', { x:  8, y: 10 }],
    ['SMGoomba', { x:  7, y: 10 }],
    ['SMGoomba', { x:  6, y: 10 }],


    ['SMPiranhaPlant', { x: 2, y: 8 }],


    ['SMGoomba', { x: 14, y: 10 }],
    ['SMGoomba', { x: 33, y: 10 }],
    ['SMGoomba', { x: 52, y: 7 }],
    ['SMGoomba', { x: 55, y: 7 }],
    ['SMGoomba', { x: 59, y: 7 }]
  ]
});