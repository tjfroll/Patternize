const canvas = document.getElementById('canvas')

const canvasX = window.innerWidth - 9
const canvasY = window.innerHeight - 9
canvas.width = canvasX
canvas.height = canvasY

const ctx = canvas.getContext('2d')

const random = (factor) => parseInt(Math.random() * factor)

const run = () => {
  window.requestAnimationFrame( () => {
    randomRect(random(255))
    randomRect(random(255))
    run()
  })
}

document.body.onkeypress = (e) => {
  const code = e.keyCode
  randomRect(e.keyCode)
}

const randomRect = (code) => {
  let r = random(code)
  let g = 255 - random(code)
  let b = 128 + random(code) - (random(128))
  ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.8)`

  let x = random(canvasX) - random(100)
  let y = random(canvasY) - random(100)
  let w = random(code) * 2
  let h = random(code) * 2
  ctx.fillRect(x, y, w, h)
}

run()