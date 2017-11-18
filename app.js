'use strict'
const canvas = document.getElementById('canvas')

class BPMInput extends HTMLInputElement {
}

const BPM = document.registerElement('bpm-control', BPMInput)

document.body.appendChild(
  new BPM()
)

let pause = false

const canvasX = window.innerWidth - 9
const canvasY = window.innerHeight - 9
canvas.width = canvasX
canvas.height = canvasY

const BEATS_PER_MINUTE = 128
const BEATS_PER_CYCLE = 4
const CYCLES_PER_REVOLUTION = 4
const BEATS_PER_SECOND = BEATS_PER_MINUTE / 60
const BEAT_INTERVAL = 1000 / BEATS_PER_SECOND
const CYCLE_INTERVAL = BEAT_INTERVAL * BEATS_PER_CYCLE
const REVOLUTION_INTERVAL = CYCLE_INTERVAL * CYCLES_PER_REVOLUTION

const outlineSize = 22
const outlineXY = outlineSize * 2
const outlineColor = `#444`

const rad = parseInt(canvasX / 20)
const twoPI = Math.PI * 2

const ctx = canvas.getContext('2d')

const random = (factor) => parseInt(Math.random() * factor)
const withinRange = (num, min, max) => parseInt(Math.max(Math.min(num, max), min))
const safeColor = (num) => withinRange(num, 0, 255)
const clearCanvas = () => ctx.clearRect(0, 0, canvas.width, canvas.height)

const randomRect = (code, count) => {
  let w = withinRange(random(code) * count * 5, 50 * count, canvasX - outlineSize)
  let h = withinRange(random(code) * count * 50, 50 * count, canvasY - outlineSize)
  let x = withinRange(random(canvasX) - w/2, parseInt(-w/2), canvasX + w/2)
  let y = withinRange(random(canvasY) - h/2, parseInt(-h/2), canvasY + h/2)
  ctx.fillStyle = outlineColor
  ctx.fillRect(x - outlineSize, y - outlineSize, w + outlineXY, h + outlineXY)

  let r = random(255)
  let g = 255 - random(255)
  let b = 127 + random(255) - (random(128))
  ctx.fillStyle = `rgba(${safeRGB(r, g, b)}, 0.8)`

  ctx.fillRect(x, y, w, h)
}

const safeRGB = (r, g, b) => `${safeColor(r)}, ${safeColor(g)}, ${safeColor(b)}`

const run = () => {
  revolution()
  window.setTimeout(() => {
    run()
  }, REVOLUTION_INTERVAL)
}

const revolution = () => {
  clearCanvas()
  for (let i=0; i<CYCLES_PER_REVOLUTION; i++) {
    window.setTimeout( () => {
      cycle(i + 1)
    }, CYCLE_INTERVAL * i)
  }
}

const cycle = (count) => {
  for (let i=0; i<BEATS_PER_CYCLE; i++) {
    window.setTimeout(() => {
      beat(i + 1, count)
    }, BEAT_INTERVAL * i)
  }
}

const beat = (beatCount, cycleCount) => {
  let r = random(255)
  let g = 255 - random(255)
  let b = 127 + random(255) - (random(128))
  if (beatCount !== 1) randomRect(random(255), beatCount)
  if (beatCount === 4) {
    window.setTimeout( () => randomRect(random(500), beatCount), BEAT_INTERVAL * .7)
    window.setTimeout( () => randomRect(random(500), beatCount), BEAT_INTERVAL * .85)
  }
  for (let cycleI = 1; cycleI <= cycleCount; cycleI++) {
    let x, y
    for (let beatI = 1; beatI <= beatCount; beatI++) {
      if (cycleI === 1) {
        x = canvasX * (beatI / 4) - (canvasX / 8)
        y = 0
      } else if (cycleI === 2) {
        x = canvasX
        y = canvasY * (beatI / 4) - (canvasY / 8)
      } else if (cycleI === 3) {
        x = canvasX - (canvasX * ((beatI-1)/4)) - (canvasX / 8)
        y = canvasY
      } else if (cycleI === 4) {
        x = 0
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
}

document.body.onkeypress = (e) => {
  pause = !pause
  if (!pause) run()
}