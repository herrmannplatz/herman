export default class Renderer {
  /**
   * TODO: init with config
   * @param {HTMLCanvasElement} canvas
   */
  constructor (canvas) {
    this.canvas = canvas
    this.context = this.canvas.getContext('2d')
    this.width = canvas.width
    this.height = canvas.height
  }

  /**
   * trigger node update
   */
  update (node) {
    this.context.clearRect(0, 0, this.width, this.height)
    node.update(this.context)
  }
}
