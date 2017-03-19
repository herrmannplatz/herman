
var herman = window.herman = {};    

herman.math = {};
herman.math.utils = require('./math/utils');
herman.math.Vector = require('./math/vector');
herman.math.Matrix = require('./math/matrix');

herman.Node = require('./scene/node');
herman.Sprite = require('./scene/sprite');
herman.Text = require('./scene/text');

herman.Renderer = require('./render/Renderer');

herman.audio = {};
herman.audio.AudioPlayer = require('./audio/AudioPlayer');
herman.audio.Sound = require('./audio/Sound');

herman.DomNode = require('./experimental/domNode');
