/*const canvas = document.getElementById("myCanvas")
const ctx = canvas.getContext("2d")
const largeure = canvas.width
const hauteure = canvas.height

function genereParabole() {
    let a = parseFloat(document.getElementById("a").value)
    let b = parseFloat(document.getElementById("b").value)
    let c = parseFloat(document.getElementById("c").value)
    ctx.reset()

    ctx.beginPath()
    ctx.strokeStyle = "blue"

    const diminution = 20
    for (let x = 0; x <= largeure; x++) {
        let yDessin = (a * x * x + b * x + c)
        yDessin = (-1 * (yDessin * diminution)) + hauteure
        let xDessin
    }
    ctx.stroke()
}
drawEnemyTank()
drawTank()

function genereParabole() {
    let a = parseFloat(document.getElementById("a").value) || 1
    let b = parseFloat(document.getElementById("b").value) || 0
    let c = parseFloat(document.getElementById("c").value) || 0
    ctx.reset()
    drawEnemyTank()
    drawTank()
    ctx.beginPath()
    ctx.strokeStyle = "blue"
    ctx.lineWidth = 2

    const diminution = 20
    ctx.moveTo(0, c)
    for (let x = 0; x <= 1000; x++) {
        let mathX = x / diminution
        let mathY = (a * Math.pow(mathX, 2) + (b * mathX) + c)
                 
        let xDessin = x
        let y = (-1 * (mathY * diminution)) + 400

        ctx.lineTo(xDessin, y)
        /*if ( x === c) {
            ctx.moveTo(0, c)
        } else if (!(x <= 1)) {
            ctx.lineTo(xDessin, y)
        }
            
    }
    ctx.stroke()
}*/
// https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Basic_usage
const canvas= document.getElementById("myCanvas")
const ctx= canvas.getContext("2d")
const largeure = canvas.width
const hauteure = canvas.height
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function randomPositionPlayerX(minX, maxX) {
    minX = Math.ceil(minX)
    maxX = Math.floor(maxX)
    return Math.floor(Math.random() * (maxX - minX + 1)) + minX
}
function randomPositionPlayerY(minY, maxY) {
    minY = Math.ceil(minY)
    maxY = Math.floor(maxY)
    return Math.floor(Math.random() * (maxY - minY + 1)) + minY
}
function randomPositionEnemyX(minX, maxX) {
    minX = Math.ceil(minX)
    maxX = Math.floor(maxX)
    return Math.floor(Math.random() * (maxX - minX + 1)) + minX
}
function randomPositionEnemyY(minY, maxY) {
    minY = Math.ceil(minY)
    maxY = Math.floor(maxY)
    return Math.floor(Math.random() * (maxY - minY + 1)) + minY
}
var playerX = randomPositionPlayerX(1, 3)
var playerY = randomPositionPlayerY(2, 6)
var enemyX  = randomPositionEnemyX(12, 15)
var enemyY  = randomPositionEnemyY(2, 6)
const griCol  = 16
const gridRow = 10
const celWid  = largeure / griCol
const celHei  = hauteure / gridRow
function griToPix(gx, gy) {
    return {
px: gx * celWid,
py: hauteure - gy * celHei
    }
}
let tire = false
let path = []
let t    = 0
// https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Basic_usage
function drawScene() {
ctx.fillStyle = "#000"
ctx.fillRect(0, 0, largeure, hauteure)
    ctx.strokeStyle = "rgba(255,255,255,0.1)"
    ctx.lineWidth = 1
    for (let j = 0; j <= griCol; j++) {
        ctx.beginPath()
        ctx.moveTo(j * celWid, 0)
        ctx.lineTo(j * celWid, hauteure)
        ctx.stroke()
    }
    for (let i = 0; i <= gridRow; i++) {
        ctx.beginPath()
        ctx.moveTo(0, i * celHei)
        ctx.lineTo(largeure, i * celHei)
        ctx.stroke()
    }
    var player = griToPix(playerX, playerY)
    ctx.beginPath()
    ctx.arc(player.px, player.py, 8, 0, Math.PI * 2)
    ctx.fillStyle = "#0cc"
    ctx.fill()

    var enemy = griToPix(enemyX, enemyY)
    ctx.beginPath()
    ctx.arc(enemy.px, enemy.py, 8, 0, Math.PI * 2)
    ctx.fillStyle = "#e44"
    ctx.fill()
}
// https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Advanced_animations
function drawTrail(path, currentPos) {
    if (path.length < 2) return
    ctx.beginPath()
    ctx.strokeStyle = "rgba(100, 180, 255, 0.9)"
    ctx.lineWidth = 2
    ctx.moveTo(path[0].px, path[0].py)
    for (let i = 1; i < path.length; i++) {
        ctx.lineTo(path[i].px, path[i].py)
    }
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(currentPos.px, currentPos.py, 5, 0, Math.PI * 2)
    ctx.fillStyle = "#fff"
    ctx.fill()
}
function isNearEnemy(px, py) {
    var e= griToPix(enemyX, enemyY)
    var dx= px - e.px
    var dy= py - e.py
    return Math.sqrt(dx*dx + dy*dy) < 14
}
function finishShot(didHit) {
    tire = false
    if (didHit) {
    document.getElementById("divAffiche").innerText = "HIT!"
    } else {
    document.getElementById("divAffiche").innerText = "Miss"
    }
    drawScene()
}
// https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
// https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Transformations
function lancer() {
    let a = parseFloat(document.getElementById("a").value)
    let b = parseFloat(document.getElementById("b").value)
    let c = 0
    if (isNaN(a) || isNaN(b)) {
        document.getElementById("divAffiche").innerText = "Entrez des valeurs pour a et b!"
        return
    }
    if (tire) { return }
    tire = true
    t= 0
    path = []
    document.getElementById("divAffiche").innerText = ""
    function step() {
        var worldX = playerX + t
        var worldY = playerY + (-a*t*t + b*t)
        var pos= griToPix(worldX, worldY)
        path.push(pos)
        drawScene()
        drawTrail(path, pos)
        if (isNearEnemy(pos.px, pos.py)) {
            finishShot(true)
            return
        }
        if (worldX > griCol || worldY < 0 || worldX < 0) {
            finishShot(false)
            return
        }
        t += 0.05
        // https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
        requestAnimationFrame(step)
    }
    step()
}
function nouvelleparabole() {
    playerX = randomPositionPlayerX(1, 3)
    playerY = randomPositionPlayerY(2, 6)
    enemyX = randomPositionEnemyX(12, 15)
    enemyY  = randomPositionEnemyY(2, 6)
    tire= false
    path= []
    t= 0
    document.getElementById("divAffiche").innerText = ""
    drawScene()
}
drawScene()

