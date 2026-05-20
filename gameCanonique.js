// ============================================================
// canonique.js — forme canonique :  Y = a(X - h)² + k
// Utilise par : canonique.html
// ============================================================

const canvas = document.getElementById("myCanvas")
const ctx = canvas.getContext("2d")
const largeure = window.innerWidth
const hauteure = window.innerHeight

canvas.style.position = "fixed"
canvas.style.top = "0"; canvas.style.left = "0"; canvas.style.zIndex = "0"
canvas.width = largeure; canvas.height = hauteure

const griCol = 16, gridRow = 10
const celWid = largeure / griCol
const celHei = hauteure / gridRow

function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min }

let playerX = rand(1,3), playerY = rand(2,6)
let enemyX  = rand(12,15), enemyY = rand(2,6)

function griToPix(gx, gy) { return { px: gx * celWid, py: hauteure - gy * celHei } }

let tire = false, path = [], highlightPaths = [], t = 0
let tirsRestants = 5, level = 1

function mettreAJourTirs() {
    document.getElementById("tirs-restants").innerText = "Tirs: " + tirsRestants + " / 5"
}

function drawScene() {
    ctx.fillStyle = "#000"; ctx.fillRect(0, 0, largeure, hauteure)
    ctx.strokeStyle = "rgba(255,255,255,0.35)"; ctx.lineWidth = 1
    for (let i = 0; i <= griCol; i++) {
        ctx.beginPath(); ctx.moveTo(i*celWid, 0); ctx.lineTo(i*celWid, hauteure); ctx.stroke()
    }
    for (let i = 0; i <= gridRow; i++) {
        ctx.beginPath(); ctx.moveTo(0, i*celHei); ctx.lineTo(largeure, i*celHei); ctx.stroke()
    }
    let p = griToPix(playerX, playerY)
    ctx.beginPath(); ctx.arc(p.px, p.py, 8, 0, Math.PI*2); ctx.fillStyle = "#0cc"; ctx.fill()
    let e = griToPix(enemyX, enemyY)
    ctx.beginPath(); ctx.arc(e.px, e.py, 8, 0, Math.PI*2); ctx.fillStyle = "#e44"; ctx.fill()
    for (let h = 0; h < highlightPaths.length; h++) {
        let hp = highlightPaths[h]; if (hp.length < 2) continue
        ctx.beginPath(); ctx.strokeStyle = "rgba(255,255,255,0.5)"; ctx.lineWidth = 2
        ctx.moveTo(hp[0].px, hp[0].py)
        for (let i = 1; i < hp.length; i++) ctx.lineTo(hp[i].px, hp[i].py)
        ctx.stroke()
    }
}

function drawTrail(path, pos) {
    if (path.length < 2) return
    ctx.beginPath(); ctx.strokeStyle = "rgba(100,180,255,0.9)"; ctx.lineWidth = 2
    ctx.moveTo(path[0].px, path[0].py)
    for (let i = 1; i < path.length; i++) ctx.lineTo(path[i].px, path[i].py)
    ctx.stroke()
    ctx.beginPath(); ctx.arc(pos.px, pos.py, 5, 0, Math.PI*2); ctx.fillStyle = "#fff"; ctx.fill()
}

function isNearEnemy(px, py) {
    let e = griToPix(enemyX, enemyY)
    let dx = px - e.px, dy = py - e.py
    return Math.sqrt(dx*dx + dy*dy) < 14
}

function screenShake() {
    document.body.classList.remove("screenShake")
    void document.body.offsetWidth
    document.body.classList.add("screenShake")
}

function nouvelleparabole() {
    playerX = rand(1,3); playerY = rand(2,6)
    enemyX  = rand(12,15); enemyY = rand(2,6)
    tire = false; path = []; t = 0; tirsRestants = 5
    mettreAJourTirs()
    document.getElementById("a").value = ""
    document.getElementById("h").value = ""
    document.getElementById("k").value = ""
    document.getElementById("divAffiche").innerText = ""
    highlightPaths = []; drawScene()
}

function finishShot(didHit) {
    tire = false
    if (didHit) {
        document.getElementById("divAffiche").innerText = "HIT!"
        screenShake(); highlightPaths = []; tirsRestants = 5; mettreAJourTirs()
        level++; document.getElementById("level").textContent = "Niveau: " + level
        nouvelleparabole()
    } else {
        highlightPaths.push(path.slice()); tirsRestants--
        if (tirsRestants <= 0) {
            document.getElementById("divAffiche").innerText = "Plus de balles!"
            setTimeout(() => window.location.href = "homepage.html", 2000)
        } else {
            document.getElementById("divAffiche").innerText = "Miss!"
            mettreAJourTirs(); drawScene()
        }
    }
}

function lancer() {
    if (tirsRestants <= 0 || tire) return

    let a = parseFloat(document.getElementById("a").value)
    let h = parseFloat(document.getElementById("h").value)
    let k = parseFloat(document.getElementById("k").value)

    if (isNaN(a) || isNaN(h) || isNaN(k)) {
        document.getElementById("divAffiche").innerText = "Entrez a, h et k!"
        return
    }

    // Forme canonique : Y = a(X - h)² + k
    // On convertit en forme standard :
    // b = -2*a*h
    // c =  a*h*h + k
    // Reference : https://www.khanacademy.org/math/algebra/x2f8bb11595b61c86:quadratic-functions-equations
    let b = -2 * a * h
    let c =  a * h * h + k

    tire = true; t = 0; path = []
    document.getElementById("divAffiche").innerText = ""

    function step() {
        let worldX = playerX + t
        let worldY = playerY + (a*t*t + b*t + c)
        let pos = griToPix(worldX, worldY)
        path.push(pos); drawScene(); drawTrail(path, pos)
        if (isNearEnemy(pos.px, pos.py)) { finishShot(true); return }
        if (worldX > griCol || worldY < 0 || worldX < 0) { finishShot(false); return }
        t += 0.05; requestAnimationFrame(step)
    }
    step()
}

let username = localStorage.getItem('mathAttaqueUser') || "Joueur"
document.getElementById("usernameDisplay").innerText = "Joueur : " + username
drawScene(); mettreAJourTirs()
