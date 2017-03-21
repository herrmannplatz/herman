import Renderer from './render/Renderer'

import Node from './scene/node'
import Sprite from './scene/sprite'
import Text from './scene/text'

import * as utils from './math/utils'
import Vector from './math/vector'
import Matrix from './math/matrix'

import AudioPlayer from './audio/AudioPlayer'
import Sound from './audio/Sound'

import DomNode from './experimental/domnode'

var herman = window.herman = {}

herman.math = {}
herman.math.utils = utils
herman.math.Vector = Vector
herman.math.Matrix = Matrix

herman.Node = Node
herman.Sprite = Sprite
herman.Text = Text

herman.Renderer = Renderer

herman.audio = {}
herman.audio.AudioPlayer = AudioPlayer
herman.audio.Sound = Sound

herman.DomNode = DomNode
