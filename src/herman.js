
var herman = window.herman = {};    

require('./utils/polyfill');

herman.math = {};
herman.math.utils = require('./math/Vector');
herman.math.Vector = require('./math/Vector');
herman.math.Matrix = require('./math/Matrix');

herman.Node = require('./scene/Node');
herman.Sprite = require('./scene/Sprite');
herman.Text = require('./scene/Text');

herman.Renderer = require('./render/Renderer');

herman.audio = {};
herman.audio.AudioPlayer = require('./audio/AudioPlayer');
herman.audio.Sound = require('./audio/Sound');

herman.DomNode = require('./experimental/DomNode');
