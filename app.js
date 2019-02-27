'use strict'
const canvas = document.getElementById('canvas')

let pause = false

const canvasX = window.innerWidth
const canvasY = window.innerHeight
canvas.width = canvasX
canvas.height = canvasY

let BEATS_PER_MINUTE = 133
const BEATS_PER_CYCLE = 4
const CYCLES_PER_REVOLUTION = 4
const BEATS_PER_SECOND = BEATS_PER_MINUTE / 60
const BEAT_INTERVAL = 1000 / BEATS_PER_SECOND
const CYCLE_INTERVAL = BEAT_INTERVAL * BEATS_PER_CYCLE
const REVOLUTION_INTERVAL = CYCLE_INTERVAL * CYCLES_PER_REVOLUTION

const outlineSize = 10
const outlineX = outlineSize * 5
const outlineY = outlineSize * 20
const outlineColor = `#333`

const rad = parseInt(canvasX / 10)
const twoPI = Math.PI * .6

const ctx = canvas.getContext('2d')

const random = (factor) => parseInt(Math.random() * factor)
const withinRange = (num, min, max) => parseInt(Math.max(Math.min(num, max), min))
const safeColor = (num) => withinRange(num, 0, 255)
const clearCanvas = () => ctx.clearRect(0, 0, canvas.width, canvas.height)

const randomRect = (code, count) => {
  let w = withinRange(random(code) * count * 50, 50 * count, canvasX)
  let h = withinRange(random(code) * count * 50, 50 * count, canvasY)
  let x = withinRange(random(canvasX) - w/2, parseInt(-w/2), canvasX + w/2)
  let y = withinRange(random(canvasY) - h/2, parseInt(-h/2), canvasY + h/2)
  ctx.fillStyle = outlineColor
  ctx.fillRect(x - outlineSize, y - outlineSize, w + outlineX, h + outlineY)

  let r = random(255)
  let g = 255 - random(255)
  let b = 127 + random(255) - (random(128))
  ctx.fillStyle = `rgba(${safeRGB(r, g, b)}, 0.8)`
  ctx.fillRect(x, y, w, h)
}

const safeRGB = (r, g, b) => `${safeColor(r)}, ${safeColor(g)}, ${safeColor(b)}`

let currentRunCycle;

const wait = window.setTimeout
const stop = window.clearTimeout

const run = () => {
  revolution()
  currentRunCycle = wait(() => {
    run()
  }, REVOLUTION_INTERVAL)
}

const revolution = () => {
  for (let i=0; i<CYCLES_PER_REVOLUTION; i++) {
    wait( () => {
      cycle(i + 1)
    }, CYCLE_INTERVAL * i)
  }
}

const cycle = (count) => {
  for (let i=0; i<BEATS_PER_CYCLE; i++) {
    wait(() => {
      beat(i + 1, count)
      if (i == 2) {
        wait(() => beat(i + 1, count), BEAT_INTERVAL * .5)
        wait(() => beat(i + 1, count), BEAT_INTERVAL * .6)
        wait(() => beat(i + 1, count), BEAT_INTERVAL * .8)
        wait(() => beat(i + 1, count), BEAT_INTERVAL * .9)
      }
    }, BEAT_INTERVAL * i)
  }
}

const beat = (beatCount, cycleCount) => {
  if (pause) return
  let r = random(255)
  let g = 255 - random(255)
  let b = 127 + random(255) - (random(128))
  randomRect(random(255), beatCount)
  for (let cycleI = 1; cycleI <= cycleCount; cycleI++) {
    let x, y
    for (let beatI = 1; beatI <= beatCount; beatI++) {
      if (cycleI === 1) {
        x = canvasX * (beatI / 4) - (canvasX / 8)
        y = random(canvasY / 10)
      } else if (cycleI === 2) {
        x = canvasX - random(canvasX / 10) + 10
        y = canvasY * (beatI / 4) - (canvasY / 8)
      } else if (cycleI === 3) {
        x = canvasX - (canvasX * ((beatI-1)/4)) - (canvasX / 8)
        y = canvasY - random(canvasY / 5) - 10
      } else if (cycleI === 4) {
        x = random(canvasX / 30)
        y = canvasY - (canvasY * ((beatI-1)/4)) - (canvasY / 8)
      }
      ctx.beginPath()
      ctx.fillStyle = outlineColor
      ctx.arc(x, y, rad + outlineSize, 0, twoPI)
      ctx.fill()

      ctx.beginPath()
      ctx.fillStyle = `rgb(${safeRGB(r, g, b)})`
      ctx.arc(x, y, rad, 0, twoPI)
      ctx.fill()
    }
  }
}

run()

document.body.onclick = (e) => {
  pause = !pause
  if (!pause) run()
  else stop(currentRunCycle)
}

document.body.onkeypress = (e) => {
  if (e.code === 'KeyW')
    BEATS_PER_MINUTE += 1;
  else if (e.code === 'KeyS')
    BEATS_PER_MINUTE -= 1;
  else if (e.code === 'Space')
    clearCanvas()
  console.log(BEATS_PER_MINUTE)
}