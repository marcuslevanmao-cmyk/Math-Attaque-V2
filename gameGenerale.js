// Niveau choisi sur la page d'accueil
// https://developer.mozilla.org/fr/docs/Web/API/Window/localStorage
let choixNiv = parseInt(localStorage.getItem("choixNiv"))

function choixNiveau(niveau) {
    localStorage.setItem("choixNiv", parseInt(niveau))
    choixNiv = parseInt(niveau)
}

// Recupere le canvas et son contexte 2D
// https://developer.mozilla.org/fr/docs/Web/API/Document/getElementById
const canvas = document.getElementById("myCanvas")

// https://developer.mozilla.org/fr/docs/Web/API/HTMLCanvasElement/getContext
const ctx = canvas.getContext("2d")

// Taille de la fenetre
// https://developer.mozilla.org/fr/docs/Web/API/Window/innerWidth
const largeure = window.innerWidth
const hauteure = window.innerHeight

// Place le canvas en fond fixe derriere l'interfaces
// https://developer.mozilla.org/fr/docs/Web/CSS/position
canvas.style.position = "fixed"
canvas.style.top  = "0"
canvas.style.left = "0"
canvas.style.zIndex = "0"

canvas.width  = largeure
canvas.height = hauteure

// Retourne un entier aléatoire entre minX et maxX inclus
// https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Math/floor
function randomPositionPlayerX(minX, maxX) {
    minX = Math.ceil(minX)  // arrondit vers le haut
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

// Positions de depart aleatoires
var playerX = randomPositionPlayerX(1, 3)
var playerY = randomPositionPlayerY(2, 6)
var enemyX  = randomPositionEnemyX(12, 15)
var enemyY  = randomPositionEnemyY(2, 6)

const griCol  = 16 // nombre de colonnes
const gridRow = 10 // nombre de rangees
const celWid  = largeure / griCol
const celHei  = hauteure / gridRow

// Convertit des coordonnees de grille en pixels sur le canvas
// Y est inverse : 0 en bas, hauteure en haut
// https://developer.mozilla.org/fr/docs/Web/API/Canvas_API/Tutorial/Drawing_shapes
function griToPix(gx, gy) {
    return {
        px: gx * celWid,
        py: hauteure - gy * celHei
    }
}

let tire = false       // true si un tir est en cours
let path = []          // points du tir actuel
let highlightPaths = []// anciens tirs rates
let t = 0              // parametre de progression du tir

// Efface et redessine la scene entiere a chaque frame
// https://developer.mozilla.org/fr/docs/Web/API/Canvas_API/Tutorial/Basic_usage
function drawScene() {
    // Fond noir
    // https://developer.mozilla.org/fr/docs/Web/API/CanvasRenderingContext2D/fillRect
    ctx.fillStyle = "#000"
    ctx.fillRect(0, 0, largeure, hauteure)

    // Lignes verticales de la grille
    ctx.strokeStyle = "rgba(255,255,255,0.4)"
    ctx.lineWidth = 1
    for (let j = 0; j <= griCol; j++) {
        ctx.beginPath()
        ctx.moveTo(j * celWid, 0)
        ctx.lineTo(j * celWid, hauteure)
        ctx.stroke()
    }
    // Lignes horizontales de la grille
    for (let i = 0; i <= gridRow; i++) {
        ctx.beginPath()
        ctx.moveTo(0, i * celHei)
        ctx.lineTo(largeure, i * celHei)
        ctx.stroke()
    }

    // Point du joueur (cyan)
    // https://developer.mozilla.org/fr/docs/Web/API/CanvasRenderingContext2D/arc
    var player = griToPix(playerX, playerY)
    ctx.beginPath()
    ctx.arc(player.px, player.py, 8, 0, Math.PI * 2)
    ctx.fillStyle = "#0cc"
    ctx.fill()

    // Point de l'ennemi (rouge)
    var enemy = griToPix(enemyX, enemyY)
    ctx.beginPath()
    ctx.arc(enemy.px, enemy.py, 8, 0, Math.PI * 2)
    ctx.fillStyle = "#e44"
    ctx.fill()

    // Trainee des anciens tirs rates
    drawHighlight()

    // Coordonnees affichees a cote de chaque point
    // https://developer.mozilla.org/fr/docs/Web/API/CanvasRenderingContext2D/fillText
    ctx.font = "16px Rajdhani, sans-serif"
    ctx.fillStyle = "#0cc"
    ctx.fillText("Joueur (" + playerX + ", " + playerY + ")", player.px + 12, player.py - 12)
    ctx.fillStyle = "#e44"
    ctx.fillText("Ennemi (" + enemyX + ", " + enemyY + ")", enemy.px + 12, enemy.py - 12)
}

// Redessine les tirs rates en blanc semi-transparent
// https://developer.mozilla.org/fr/docs/Web/API/CanvasRenderingContext2D/setLineDash
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

// Dessine la trainee bleue du tir en cours et le point blanc du projectile
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

// Retourne true si le projectile est a moins de 14px de l'ennemi
// https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Math/sqrt
function isNearEnemy(px, py) {
    var e  = griToPix(enemyX, enemyY)
    var dx = px - e.px
    var dy = py - e.py
    return Math.sqrt(dx*dx + dy*dy) < 14
}

let tirsRestants = 5

// Met a jour le compteur de tirs affiche dans le HTML
function mettreAJourTirs() {
    document.getElementById("tirs-restants").innerText = "Tirs: " + tirsRestants + " / 5"
}

// Sauvegarde le score du joueur si c'est son meilleur niveau atteint
function sauvegarderScore() {
    // Relit le nom a chaque fois  capte les changements de nom
    // https://developer.mozilla.org/fr/docs/Web/API/Window/localStorage
    var username = localStorage.getItem('mathAttaqueUser') || "Joueur"
    var niveau   = level

    // Recupere les scores existants depuis localStorage
    // https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse
    var scores = JSON.parse(localStorage.getItem('leaderboard') || '{}')

    // Sauvegarde seulement si c'est un meilleur score que l'ancien
    if (!scores[username] || niveau > scores[username]) {
        scores[username] = niveau
        // JSON.stringify convertit l'objet en texte pour pouvoir le sauvegarder
        // https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
        localStorage.setItem('leaderboard', JSON.stringify(scores))
    }
}

// Appele quand le projectile s'arrete  gere HIT et Miss
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
            // Redirige vers l'accueil apres 2 secondes
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

// Lit les inputs a, b, c et lance le projectile (forme generale Y = aX² + bX + c)
function lancer() {
    if (tirsRestants <= 0) {
        document.getElementById("divAffiche").innerText = "Plus de tirs!"
        return
    }
    // https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/parseFloat
    let a = parseFloat(document.getElementById("a").value)
    let b = parseFloat(document.getElementById("b").value)
    // https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/isNaN
    if (isNaN(a) || isNaN(b)) {
        document.getElementById("divAffiche").innerText = "Entrez des valeurs pour a et b!"
        return
    }

    if (tire) return

    tire = true
    t = 0
    path = []
    document.getElementById("divAffiche").innerText = ""
    // https://developer.mozilla.org/fr/docs/Web/API/window/requestAnimationFrame
    function step() {
        var worldX = playerX + t
        var worldY = playerY + (a*t*t + b*t)
        var pos = griToPix(worldX, worldY)
        // https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/push
        path.push(pos)
        drawScene()
        drawTrail(path, pos)
        if (isNearEnemy(pos.px, pos.py)) { finishShot(true);  return }
        if (worldX > griCol || worldY < 0 || worldX < 0) { finishShot(false); return }
        t += 0.05
        requestAnimationFrame(step)
    }
    step()
}

drawScene()
mettreAJourTirs()
function nouvelleparabole() {
    sauvegarderScore()
    playerX = randomPositionPlayerX(1, 3)
    playerY = randomPositionPlayerY(2, 6)
    enemyX  = randomPositionEnemyX(12, 15)
    enemyY  = randomPositionEnemyY(2, 6)
    tire = false
    path = []
    t = 0
    tirsRestants = 5
    mettreAJourTirs()
    // Vide les champs a, b  correspond aux ids dans gameGenerale.html
    document.getElementById("a").value = ""
    document.getElementById("b").value = ""
    document.getElementById("divAffiche").innerText = ""
    drawScene()
}

drawScene()

// Affiche le nom du joueur recupere depuis localStorage
// https://developer.mozilla.org/fr/docs/Web/API/Window/localStorage
let username = localStorage.getItem('mathAttaqueUser') || "Joueur"
document.getElementById("usernameDisplay").innerText = "Joueur : " + username

let level = 1
function levelCounter() {
    level += 1
    document.getElementById("level").textContent = "Niveau: " + level
}
function screenShake() {
    document.body.classList.remove("screenShake")
    // https://developer.mozilla.org/fr/docs/Web/API/HTMLElement/offsetWidth
    void document.body.offsetWidth
    document.body.classList.add("screenShake")
}
