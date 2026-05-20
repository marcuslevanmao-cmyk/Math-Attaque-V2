

//https://developer.mozilla.org/fr/docs/Web/API/Document/getElementById
const canvas = document.getElementById("myCanvas")

//https://developer.mozilla.org/fr/docs/Web/API/HTMLCanvasElement/getContext
const ctx = canvas.getContext("2d")
//https://developer.mozilla.org/fr/docs/Web/API/Window/innerWidth
const largeure = window.innerWidth
const hauteure = window.innerHeight

// Référence CSS : https://developer.mozilla.org/fr/docs/Web/CSS/position
canvas.style.position = "fixed"
canvas.style.top= "0"
canvas.style.left = "0"
canvas.style.zIndex = "0"

canvas.width = largeure
canvas.height = hauteure

// https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Math/floor
function randomPositionPlayerX(minX, maxX) {
    minX = Math.ceil(minX)// arrondit vers le haut
    maxX = Math.floor(maxX) // arrondit vers le bas
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
let playerX = randomPositionPlayerX(1, 3)
let playerY = randomPositionPlayerY(2, 6)
let enemyX = randomPositionEnemyX(12, 15)
let enemyY = randomPositionEnemyY(2, 6)

const griCol = 16 // nombre de colonnes
const gridRow = 10 // nombre de rangées
const celWid = canvas.width / griCol
const celHei = canvas.height / gridRow 

// https://developer.mozilla.org/fr/docs/Web/API/Canvas_API/Tutorial/Drawing_shapes
function griToPix(gx, gy) {
    return {
        px: gx * celWid,// X normal — va de gauche à droite
        py: hauteure - gy * celHei
    }
}
let tire= false
let path = []
let highlightPaths = []
let t= 0


// https://developer.mozilla.org/fr/docs/Web/API/Canvas_API/Tutorial/Basic_usage
function drawScene() {
   //https://developer.mozilla.org/fr/docs/Web/API/CanvasRenderingContext2D/fillRect
    ctx.fillStyle = "#000"
    ctx.fillRect(0, 0, largeure, hauteure)

    ctx.strokeStyle = "#fdfdfd"
    ctx.lineWidth = 1
    for (let j = 0; j <= griCol; j++) {
        ctx.beginPath()
        ctx.moveTo(j * celWid, 0)// part du haut
        ctx.lineTo(j * celWid, hauteure) // va jusqu'en bas
        ctx.stroke()
    }
    for (let i = 0; i <= gridRow; i++) {
        ctx.beginPath()
        ctx.moveTo(0, i * celHei) // part de la gauche
        ctx.lineTo(largeure, i * celHei) // va jusqu'à droite
        ctx.stroke()
    } 

    //https://developer.mozilla.org/fr/docs/Web/API/CanvasRenderingContext2D/arc
    let player = griToPix(playerX, playerY)
    ctx.beginPath()
    ctx.arc(player.px, player.py, 8, 0, Math.PI * 2)
    ctx.fillStyle = "#0cc"// cyan
    ctx.fill()
    let enemy = griToPix(enemyX, enemyY)
    ctx.beginPath()
    ctx.arc(enemy.px, enemy.py, 8, 0, Math.PI * 2)
    ctx.fillStyle = "#e44"// rouge
    ctx.fill()

    drawHighlight()
}
//https://developer.mozilla.org/fr/docs/Web/API/CanvasRenderingContext2D/setLineDash
function drawHighlight() {
    for (let p = 0; p < highlightPaths.length; p++) {
        let currentPath = highlightPaths[p]
        if (currentPath.length < 2) continue
        ctx.beginPath()
        ctx.strokeStyle = "rgba(255, 255, 255, 0.5)"
        ctx.lineWidth = 2
        ctx.moveTo(currentPath[0].px, currentPath[0].py)
        for (let i = 1; i < currentPath.length; i++) {
            ctx.lineTo(currentPath[i].px, currentPath[i].py)
        }
        ctx.stroke()
    }
}
//https://developer.mozilla.org/fr/docs/Web/API/Canvas_API/Tutorial/Advanced_animations
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

// https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Math/sqrt
function isNearEnemy(px, py) {
    let e  = griToPix(enemyX, enemyY)
    let dx = px - e.px 
    let dy = py - e.py
    return Math.sqrt(dx*dx + dy*dy) < 14 // distance totale < 14px = touché!
}
let tirsRestants = 5  
function mettreAJourTirs() {
    document.getElementById("tirs-restants").innerText = "Tirs: " + tirsRestants + " / 5"
}

function finishShot(didHit) {
    tire = false

    if (didHit) {
        document.getElementById("divAffiche").innerText = "HIT!"
        highlightPaths = []
        tirsRestants = 5
        mettreAJourTirs()
        levelCounter()
        nouvelleparabole()
    } else {
        highlightPaths.push(path.slice())
        tirsRestants -= 1
        if (tirsRestants <= 0) {
            document.getElementById("divAffiche").innerText = "Plus de balles, retourne a l'acceuil!"
            setTimeout(function() {
                window.location.href = "homepage.html"
            }, 2000)
        } else {
            document.getElementById("divAffiche").innerText = "Miss!"
            mettreAJourTirs()
            drawScene()
        }
    }
}
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
drawScene()

mettreAJourTirs()
function nouvelleparabole() {
    playerX = randomPositionPlayerX(1, 3)
    playerY = randomPositionPlayerY(2, 6)
    enemyX = randomPositionEnemyX(12, 15)
    enemyY = randomPositionEnemyY(2, 6)
    tire= false
    path= []
    t= 0
    tirsRestants = 5
    mettreAJourTirs()
    document.getElementById("a").value = ""
    document.getElementById("b").value= ""
    document.getElementById("divAffiche").innerText = ""
    drawScene()


}
drawScene()


//https://developer.mozilla.org/fr/docs/Web/API/Window/localStorage
let username = localStorage.getItem('mathAttaqueUser') || "Joueur"
document.getElementById("usernameDisplay").innerText = "Joueur : " + username

let level = 1
function levelCounter(){
    level += 1
    document.getElementById("level").textContent = "Niveau: " + level;
}
