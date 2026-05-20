// https://developer.mozilla.org/fr/docs/Web/API/Window/localStorage
let choixNiv = parseInt(localStorage.getItem("choixNiv"))

function choixNiveau(niveau) {
    localStorage.setItem("choixNiv", parseInt(niveau))
    choixNiv = parseInt(niveau)
}

// https://developer.mozilla.org/fr/docs/Web/API/Document/getElementById
const canvas = document.getElementById("myCanvas")

// https://developer.mozilla.org/fr/docs/Web/API/HTMLCanvasElement/getContext
const ctx = canvas.getContext("2d")

// https://developer.mozilla.org/fr/docs/Web/API/Window/innerWidth
const largeure = window.innerWidth
const hauteure = window.innerHeight

// https://developer.mozilla.org/fr/docs/Web/CSS/position
canvas.style.position = "fixed"
canvas.style.top  = "0"
canvas.style.left = "0"
canvas.style.zIndex = "0"

canvas.width  = largeure
canvas.height = hauteure

// https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Math/floor
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

// https://developer.mozilla.org/fr/docs/Web/API/Canvas_API/Tutorial/Drawing_shapes
function griToPix(gx, gy) {
    return {
        px: gx * celWid,
        py: hauteure - gy * celHei
    }
}

let tire = false
let path = []
let highlightPaths = []
let t = 0

// https://developer.mozilla.org/fr/docs/Web/API/Canvas_API/Tutorial/Basic_usage
function drawScene() {
    // https://developer.mozilla.org/fr/docs/Web/API/CanvasRenderingContext2D/fillRect
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

    // https://developer.mozilla.org/fr/docs/Web/API/CanvasRenderingContext2D/arc
    var player = griToPix(playerX, playerY)
    ctx.beginPath()
    ctx.arc(player.px, player.py, 8, 0, Math.PI * 2)
    ctx.fillStyle = "#0cc"
    ctx.fill()

    // Coordonnees du joueur affichees a cote du point
    ctx.fillStyle = "rgba(255,255,255,0.6)"
    ctx.font = "bold 13px sans-serif"
    ctx.textAlign = "left"
    ctx.fillText("(" + playerX + ", " + playerY + ")", player.px + 12, player.py - 4)

    var enemy = griToPix(enemyX, enemyY)
    ctx.beginPath()
    ctx.arc(enemy.px, enemy.py, 8, 0, Math.PI * 2)
    ctx.fillStyle = "#e44"
    ctx.fill()

    // Coordonnees de l'ennemi affichees a cote du point
    ctx.fillStyle = "rgba(255,255,255,0.6)"
    ctx.textAlign = "right"
    ctx.fillText("(" + enemyX + ", " + enemyY + ")", enemy.px - 12, enemy.py - 4)

    drawHighlight()
}

// https://developer.mozilla.org/fr/docs/Web/API/CanvasRenderingContext2D/setLineDash
function drawHighlight() {
    for (let p = 0; p < highlightPaths.length; p++) {
        let currentPath = highlightPaths[p]
        if (currentPath.length < 2) continue
        ctx.beginPath()
        ctx.strokeStyle = "rgba(255, 255, 255, 0.5)"
        ctx.lineWidth = 2
        ctx.setLineDash([6, 4])
        ctx.moveTo(currentPath[0].px, currentPath[0].py)
        for (let i = 1; i < currentPath.length; i++) {
            ctx.lineTo(currentPath[i].px, currentPath[i].py)
        }
        ctx.stroke()
        ctx.setLineDash([])
    }
}

// https://developer.mozilla.org/fr/docs/Web/API/Canvas_API/Tutorial/Advanced_animations
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
    var e  = griToPix(enemyX, enemyY)
    var dx = px - e.px
    var dy = py - e.py
    return Math.sqrt(dx * dx + dy * dy) < 14
}

let tirsRestants = 5

function mettreAJourTirs() {
    document.getElementById("tirs-restants").innerText = "Tirs: " + tirsRestants + " / 5"
}

function finishShot(didHit) {
    tire = false
    if (didHit) {
        document.getElementById("divAffiche").innerText = "HIT!"
        screenShake()
        highlightPaths = []
        tirsRestants = 5
        mettreAJourTirs()
        levelCounter()
        nouvelleparabole()
    } else {
        highlightPaths.push(path.slice())
        tirsRestants -= 1
        if (tirsRestants <= 0) {
            document.getElementById("divAffiche").innerText = "Plus de balles, retourne a l'accueil!"
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
    if (tirsRestants <= 0 || tire) return

    // Lit les inputs a, h, k (forme standard Y = aX² + hX + k)
    // Les ids correspondent exactement aux champs dans le HTML
    // https://developer.mozilla.org/fr/docs/Web/API/Document/getElementById
    let a = parseFloat(document.getElementById("a").value)
    let h = parseFloat(document.getElementById("h").value)
    let k = parseFloat(document.getElementById("k").value)

    if (isNaN(a) || isNaN(h) || isNaN(k)) {
        document.getElementById("divAffiche").innerText = "Entrez a, h et k!"
        return
    }

    // Forme standard : Y = aX² + hX + k
    // Le moteur de tir calcule la position relative au joueur :
    //   worldX = playerX + t
    //   worldY = playerY + (a*t² + h*t + k_offset)
    // k decale la hauteur de depart — on l'ajoute a playerY au moment du tir.
    // Reference equations du second degre :
    // https://www.w3schools.com/js/js_math.asp

    tire = true
    t = 0
    path = []
    document.getElementById("divAffiche").innerText = ""

    // Ajuste playerY avec k pour que k=0 signifie "partir de sa propre hauteur"
    var startY = playerY + k

    function step() {
        var worldX = playerX + t
        var worldY = startY + (a * t * t + h * t)

        var pos = griToPix(worldX, worldY)

        // https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/push
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
        // https://developer.mozilla.org/fr/docs/Web/API/window/requestAnimationFrame
        requestAnimationFrame(step)
    }
    step()
}

drawScene()
mettreAJourTirs()

function nouvelleparabole() {
    playerX = randomPositionPlayerX(1, 3)
    playerY = randomPositionPlayerY(2, 6)
    enemyX  = randomPositionEnemyX(12, 15)
    enemyY  = randomPositionEnemyY(2, 6)
    tire = false
    path = []
    t = 0
    tirsRestants = 5
    mettreAJourTirs()
    // Remet les champs a, h, k a vide — correspond aux ids dans le HTML
    document.getElementById("a").value = ""
    document.getElementById("h").value = ""
    document.getElementById("k").value = ""
    document.getElementById("divAffiche").innerText = ""
    drawScene()
}

// https://developer.mozilla.org/fr/docs/Web/API/Window/localStorage
let username = localStorage.getItem('mathAttaqueUser') || "Joueur"
document.getElementById("usernameDisplay").innerText = "Joueur : " + username

let level = 1
function levelCounter() {
    level += 1
    document.getElementById("level").textContent = "Niveau: " + level
}

function screenShake() {
    // Retire la classe pour remettre l'animation a zero
    document.body.classList.remove("screenShake")
    // Force un reflow pour que l'animation puisse rejouer immediatement
    // https://developer.mozilla.org/fr/docs/Web/API/HTMLElement/offsetWidth
    void document.body.offsetWidth
    // Rajoute la classe — l'animation CSS "shake" recommence
    document.body.classList.add("screenShake")
}
