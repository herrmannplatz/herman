import { fetchArrayBuffer } from '../util/helpers'

const AudioContext = window.AudioContext || window.webkitAudioContext
const context = new AudioContext()

export default class Sound {
  constructor (file, loop = false, volume = 1) {
    this.gainNode = undefined
    this.source = undefined
    this.buffer = undefined
    this.startOffset = 0
    this.startTime = 0
    this.volume = volume
    this.loop = loop
    this.file = file
    this.laoded = false
  }

  set volume (volume) {
    if (this.gainNode) {
      this.gainNode.gain.value = volume
    }
  }

  get volume () {
    if (this.gainNode) {
      return this.gainNode.gain.value
    }
  }

  load () {
    fetchArrayBuffer(this.file)
    .then((buffer) => context.decodeAudioData(buffer))
    .then((audioBuffer) => this.buffer = audioBuffer)
    .catch((error) => console.warn('Unable to load sound' + this.file + error.message))
  }

  get loaded () {
    return this.buffer !== undefined
  }

  play (offset) {
    if (this.source || this.isPlaying()) {
      return
    }

    Promise.resolve().then(() => {
      if (!this.loaded()) {
        return this.load()
      }
    }).then(() => {
      this.source = context.createBufferSource()
      this.source.buffer = this.buffer

      this.gainNode = context.createGain()
      this.source.connect(this.gainNode)
      this.gainNode.connect(context.destination)

      this.source.loop = this.loop
      this.gainNode.gain.value = this.volume

      this.startTime = context.currentTime
      this.source.start(0, offset || 0)
    })
  }

  pause () {
    this.stop()
    this.startOffset += context.currentTime - this.startTime
  }

  resume () {
    this.play(this.startOffset % this.buffer.duration)
  }

  rewind () {
    this.play(0)
  }

  stop () {
    if (this.source) {
      this.source.stop(0)
    }
  }

  isPlaying () {
    return this.source && this.source.playbackState === this.source.PLAYING_STATE
  }
}
