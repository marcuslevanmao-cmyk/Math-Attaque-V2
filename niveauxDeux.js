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
    let h = parseFloat(document.getElementById("h").value)
    let k = parseFloat(document.getElementById("k").value)
    let c = 0
    let b = -2*a*h
    if (isNaN(a) || isNaN(h) || isNaN(k)) {
        document.getElementById("divAffiche").innerText = "Entrez des valeurs pour a, h et k!"
        return
    }
    let modifier = (playerX-h)**2 + k - playerY
    if (tire) { return }
    tire = true
    t= 0
    path = []
    document.getElementById("divAffiche").innerText = ""
    function step() {
        var worldX = playerX + t
        var worldY = (a*t*t+b*t) + playerY
        var pos= griToPix(worldX, worldY)
        path.push(pos)
        drawScene()
        drawTrail(path, pos)
        if (isNearEnemy(pos.px, pos.py)) {
            finishShot(true)
            return
        }
        if (worldX > griCol || worldX < 0) {
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

