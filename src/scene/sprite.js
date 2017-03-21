import Node from './node'

export default class Sprite extends Node {
  constructor (bitmap) {
    super()
    this.bitmap = bitmap
  }

  draw (context) {
    context.drawImage(this.bitmap, -this.bitmap.width / 2, -this.bitmap.height / 2)
  }
}
