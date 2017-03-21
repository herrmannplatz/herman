import Node from './node'

export default class Text extends Node {
  constructor (text) {
    super()
    this.text = text
  }

  draw (context) {
    context.fillStyle = '#00F'
    context.font = 'italic 30pt Arial'
    context.fillText(this.text, 20, 50)
  }
}
