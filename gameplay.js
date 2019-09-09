// use strict;
var { build } = require('./objectDefs/brick')
build()
var canvas = document.getElementById('myCanvas')
var ctx = canvas.getContext('2d')

document.addEventListener('keydown', keyDownHandler, false)
document.addEventListener('keyup', keyUpHandler, false)

const colors = ['maroon', 'crimson', 'salmon', 'lightcoral', 'indianred', 'coral']
var score = 0

var ballRadius = 10
var x = canvas.width / 2
var y = canvas.height - 30
var dx = 2
var dy = -2
var colorChoice = 1

var paddleHeight = 10
var paddleWidth = 75
var paddleX = (canvas.width - paddleWidth) / 2
var rightPressed = false
var leftPressed = false

var brickRowCount = 2
var brickColumnCount = 5
var brickWidth = 50
var brickHeight = 50
var brickPadding = 50
var brickOffsetTop = 30
var brickOffsetLeft = 25
var bricks = []
for (var c = 0; c < brickColumnCount; c++) {
  bricks[c] = []
  for (var r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 }
  }
}

var img = new Image()
img.src = 'shrimp.png'

// ENTRY POINT TO THE ACTION:
img.onload = function () {
  draw()
}

function drawBricks () {
  for (var c = 0; c < brickColumnCount; c++) {
    for (var r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft
        var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop
        bricks[c][r].x = brickX
        bricks[c][r].y = brickY
        ctx.drawImage(img, brickX, brickY, brickWidth, brickHeight)
      }
    }
  }
}

function collisionDetection () {
  for (var c = 0; c < brickColumnCount; c++) {
    for (var r = 0; r < brickRowCount; r++) {
      var b = bricks[c][r]
      if (b.status === 1) {
        if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
          console.log('direct hit!')
          dy = -dy
          b.status = 0
          score++
          if (score === brickRowCount * brickColumnCount) {
            alert('YOU WIN, CONGRATULATIONS!')
            document.location.reload()
          }
        }
      }
    }
  }
}

function drawScore () {
  ctx.font = '16px Monospace'
  ctx.fillStyle = 'black'
  ctx.fillText('Score: ' + score, 8, 20)
}

function keyDownHandler (e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = true
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    leftPressed = true
  }
}

function keyUpHandler (e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = false
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    leftPressed = false
  }
}

function drawBall () {
  if (colorChoice >= colors.length) {
    colorChoice = 0
  }
  ctx.beginPath()
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2)
  ctx.fillStyle = colors[colorChoice]
  ctx.fill()
  ctx.closePath()
}

function drawPaddle () {
  ctx.beginPath()
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight)
  ctx.fillStyle = 'midnightblue'
  ctx.fill()
  ctx.closePath()
}

function draw () {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  drawBricks()
  drawBall()
  drawPaddle()
  drawScore()
  collisionDetection()

  // detect collisions with border of the game area
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    // hitting wall is okay
    dx = -dx
    colorChoice += 1
  }
  if (y + dy < ballRadius) {
    // hitting ceiling is okay
    dy = -dy
    colorChoice += 1
  } else if (y + dy > canvas.height - ballRadius) {
    // count as paddle hit if any part of ball hits it
    if ((x + ballRadius) > paddleX && (x - ballRadius) < paddleX + paddleWidth) {
      // hitting paddle is good, but changes your angle
      console.log('dx: ', dx, 'dy:', dy)
      dx = randomerD(dx)
      dy = randomerD(dy)
      dy = -dy
      colorChoice += 1
    } else {
      // hitting floor is not okay
      console.log('GAME OVER')
      document.location.reload()
    }
  }

  // move the paddle
  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 7
  }

  // move the ball
  x += dx
  y += dy
  requestAnimationFrame(draw)
}

function randomerD (d) {
  // TODO: make these faster at higher levels
  const multipliers = [1.25, 1.75, 2, 2.25, 2.75, 3, 3.5]
  const randomishIndex = Math.floor(Math.random() * (multipliers.length))
  const newD = multipliers[randomishIndex]
  // set sign to match sign of current d
  return newD * Math.sign(d)
}
