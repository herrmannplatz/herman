export function fetchArrayBuffer (file) {
  return new Promise((resolve, reject) => {
    const xhr = new window.XMLHttpRequest()
    xhr.open('GET', file, true)
    xhr.responseType = 'arraybuffer'
    xhr.onload = function () {
      if (this.status >= 200 && this.status < 300) {
        resolve(this.response)
      } else {
        reject(this.statusText)
      }
    }
    xhr.onerror = reject
    xhr.send()
  })
}
