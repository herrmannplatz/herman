export default class Tween {
  /**
   * flash like tweening object
   *
   * @example
   * var tween = new Tween(node, { x : 100 }, 1000);
   * tween.done = function() { console.log('tweening finished') }
   * tween.start();
   *
   * @param {herman.Node} target     [description]
   * @param {Object} properties [description]
   * @param {Number} duration   [description]
   */
  constructor (target, properties, duration) {
    // tween object
    const tween = {}

    // start time
    const start = new Date().getTime()

    // delta start current time
    let delta

    // normalized delta
    let progress

    // storage for start values
    let begin = {}

    // requestAnimationFrame ID
    let requestID

    // done callback
    let done = function () {}

    // store start values
    Object.keys(properties).forEach(function (property) {
      begin[property] = target[property]
    })

    tween.start = function () {
      (function update () {
        delta = new Date().getTime() - start

        progress = Math.min(delta / duration, 1)

        // TODO easing
        Object.keys(properties).forEach(function (property) {
          target[property] = begin[property] + ((properties[property] - begin[property]) * progress)
        })

        window.renderer.update(window.stage)

        if (progress < 1) {
          requestID = window.requestAnimationFrame(update)
        } else {
          if (done) {
            done()
          }
          window.cancelAnimationFrame(requestID)
        }
      })()
    }

    tween.stop = function () {
      window.cancelAnimationFrame(requestID)
    }

    tween.clone = function () {
      return new Tween(target, properties, duration)
    }

    tween.done = function (callback) {
      done = callback
      return this
    }

    return tween
  }
}
