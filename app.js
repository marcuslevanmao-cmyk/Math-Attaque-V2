// ============================================================
// app.js — toute la logique de Math Attaque en un seul fichier.
// Remplace : intro.js, homepage.js, name.js, gameGenerale.js,
// gameCanonique.js, gameFactorisée.js.
//
// Le site est maintenant une page unique (index.html) avec 4
// "ecrans" (<div class="screen">) que showScreen() bascule entre
// eux, plutot que 4 pages HTML separees.
// ============================================================

// ---------------- Navigation entre ecrans ----------------

function showScreen(name) {
    document.querySelectorAll('.screen').forEach(function (s) { s.hidden = true })
    document.getElementById('screen-' + name).hidden = false
}

// ---------------- Intro (video d'ouverture -> chargement -> accueil) ----------------

const opening = document.getElementById("opening")
const loading = document.getElementById("loading")

// Joue une video et appelle next() quand elle se termine
// fallbackTime = delai de secours si la video ne se lance pas
// https://developer.mozilla.org/fr/docs/Web/API/HTMLMediaElement/play
function playVideo(video, next, fallbackTime = 6000) {
    const fallback = setTimeout(next, fallbackTime)
    video.play().then(function () {
        video.onended = function () {
            clearTimeout(fallback) // annule le secours si la video se termine normalement
            next()
        }
    }).catch(function () {
        // la lecture echoue on passe quand meme
        clearTimeout(fallback)
        next()
    })
}

function startIntro() {
    opening.hidden = false
    loading.hidden = true
    playVideo(opening, startLoading, 8000)
}

function startLoading() {
    opening.hidden = true
    loading.hidden = false
    playVideo(loading, goToHome, 10000)
}

function goToHome() {
    showScreen('home')
    initHome()
}

// ---------------- Accueil : nom du joueur + classement ----------------

// Pre-remplit le champ si un nom est deja sauvegarde, et branche
// le clic/Entree sur le bouton SOUMETTRE. Appele une fois l'intro finie.
function initHome() {
    var nomSauvegarde = localStorage.getItem('mathAttaqueUser')
    if (nomSauvegarde) {
        document.getElementById('username-input').value = nomSauvegarde
        document.getElementById('niveau').style.display = 'block'
    }
    afficherLeaderboard()
}

// Appele quand on clique sur SOUMETTRE (ou Entree dans le champ)
function nouveauNom() {
    var ancienNom = localStorage.getItem('mathAttaqueUser')
    var username = document.getElementById('username-input').value.trim()
    if (username === "") {
        alert("S'il vous plaît, entrez un nom!")
        return
    }
    // Si le joueur a change de nom, on transfere son score vers le nouveau nom
    if (ancienNom && ancienNom !== username) {
        var scores = getScores()
        if (scores[ancienNom] !== undefined) {
            scores[username] = scores[ancienNom]
            delete scores[ancienNom]
            localStorage.setItem('leaderboard', JSON.stringify(scores))
        }
    }
    localStorage.setItem('mathAttaqueUser', username)
    document.getElementById('niveau').style.display = 'block'
    afficherLeaderboard()
}

document.getElementById('username-input').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') nouveauNom()
})

// Lit les scores depuis localStorage sous forme d'objet {nom: niveau}
// https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/JSON
function getScores() {
    return JSON.parse(localStorage.getItem('leaderboard') || '{}')
}

// Sauvegarde le score seulement si c'est un meilleur score
function sauvegarderScoreJoueur(username, niveau) {
    var scores = getScores()
    if (!scores[username] || niveau > scores[username]) {
        scores[username] = niveau
        localStorage.setItem('leaderboard', JSON.stringify(scores))
    }
}

// Affiche le leaderboard dans le tableau HTML
function afficherLeaderboard() {
    var scores = getScores()
    var tbody = document.getElementById('leaderboard-body')
    tbody.innerHTML = ''
    var tries = Object.entries(scores).sort(function (a, b) { return b[1] - a[1] })
    if (tries.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" style="text-align:center; color:#555">Aucun score</td></tr>'
        return
    }
    // Couleur doree, argentee, bronze pour le top 3
    for (var i = 0; i < tries.length; i++) {
        var nom = tries[i][0]
        var niveau = tries[i][1]
        var couleur = '#cccccc'
        if (i === 0) couleur = '#ffe44d'
        if (i === 1) couleur = '#aaaaaa'
        if (i === 2) couleur = '#cd7f32'
        var tr = document.createElement('tr')
        tr.innerHTML =
            '<td style="color:' + couleur + '; font-weight:bold">' + (i + 1) + '</td>' +
            '<td>' + nom + '</td>' +
            '<td style="color:' + couleur + '">' + niveau + '</td>'
        tbody.appendChild(tr)
    }
}

// ---------------- Moteur de jeu (partage par les 3 formes) ----------------

const canvas = document.getElementById("myCanvas")
const ctx = canvas.getContext("2d")
const largeure = window.innerWidth
const hauteure = window.innerHeight

canvas.style.position = "fixed"
canvas.style.top = "0"
canvas.style.left = "0"
canvas.style.zIndex = "0"
canvas.width = largeure
canvas.height = hauteure

// Retourne un entier aleatoire entre min et max inclus
function randomPosition(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
}

var playerX, playerY, enemyX, enemyY

const griCol = 16
const gridRow = 10
const celWid = largeure / griCol
const celHei = hauteure / gridRow

// Convertit des coordonnees de grille en pixels sur le canvas
// Y est inverse : 0 en bas, hauteure en haut
function griToPix(gx, gy) {
    return { px: gx * celWid, py: hauteure - gy * celHei }
}

let tire = false
let path = []
let highlightPaths = []
let t = 0
let tirsRestants = 5
let level = 1
let currentMode = 'generale' // 'generale' | 'canonique' | 'factorisee'

function drawScene() {
    ctx.fillStyle = "#000"
    ctx.fillRect(0, 0, largeure, hauteure)

    ctx.strokeStyle = "rgba(255,255,255,0.4)"
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

    drawHighlight()

    ctx.font = "16px Rajdhani, sans-serif"
    ctx.fillStyle = "#0cc"
    ctx.fillText("Joueur (" + playerX + ", " + playerY + ")", player.px + 12, player.py - 12)
    ctx.fillStyle = "#e44"
    ctx.fillText("Ennemi (" + enemyX + ", " + enemyY + ")", enemy.px + 12, enemy.py - 12)
}

function drawHighlight() {
    for (let p = 0; p < highlightPaths.length; p++) {
        let currentPath = highlightPaths[p]
        if (currentPath.length < 2) continue
        ctx.beginPath()
        ctx.strokeStyle = "rgba(255, 255, 255, 0.5)"
        ctx.lineWidth = 2
        ctx.moveTo(currentPath[0].px, currentPath[0].py)
        for (let i = 1; i < currentPath.length; i++) ctx.lineTo(currentPath[i].px, currentPath[i].py)
        ctx.stroke()
    }
}

function drawTrail(path, currentPos) {
    if (path.length < 2) return
    ctx.beginPath()
    ctx.strokeStyle = "rgba(100, 180, 255, 0.9)"
    ctx.lineWidth = 2
    ctx.moveTo(path[0].px, path[0].py)
    for (let i = 1; i < path.length; i++) ctx.lineTo(path[i].px, path[i].py)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(currentPos.px, currentPos.py, 5, 0, Math.PI * 2)
    ctx.fillStyle = "#fff"
    ctx.fill()
}

function isNearEnemy(px, py) {
    var e = griToPix(enemyX, enemyY)
    var dx = px - e.px
    var dy = py - e.py
    return Math.sqrt(dx * dx + dy * dy) < 14
}

function mettreAJourTirs() {
    document.getElementById("tirs-restants").innerText = "Tirs: " + tirsRestants + " / 5"
}

function sauvegarderScore() {
    var username = localStorage.getItem('mathAttaqueUser') || "Joueur"
    sauvegarderScoreJoueur(username, level)
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
            setTimeout(function () {
                showScreen('home')
                afficherLeaderboard()
            }, 2000)
        } else {
            document.getElementById("divAffiche").innerText = "Miss!"
            mettreAJourTirs()
            drawScene()
        }
    }
}

// Lance le projectile pour les coefficients (a, b, c) de la forme standard
// Y = aX² + bX + c — chaque mode de jeu calcule a/b/c a sa maniere (voir lancer())
function lancerProjectile(a, b, c) {
    if (tirsRestants <= 0) {
        document.getElementById("divAffiche").innerText = "Plus de tirs!"
        return
    }
    if (tire) return

    tire = true
    t = 0
    path = []
    document.getElementById("divAffiche").innerText = ""

    function step() {
        var worldX = playerX + t
        var worldY = playerY + (a * t * t + b * t + c)
        var pos = griToPix(worldX, worldY)
        path.push(pos)
        drawScene()
        drawTrail(path, pos)
        if (isNearEnemy(pos.px, pos.py)) { finishShot(true); return }
        if (worldX > griCol || worldY < 0 || worldX < 0) { finishShot(false); return }
        t += 0.05
        requestAnimationFrame(step)
    }
    step()
}

// Choisit un mode au hasard parmi les 3 formes (pour les niveaux 2+)
function pickRandomMode() {
    var modes = ['generale', 'canonique', 'factorisee']
    return modes[Math.floor(Math.random() * modes.length)]
}

// Change le mode actif et affiche la bonne rangee d'equation
function setMode(mode) {
    currentMode = mode
    document.getElementById('equation-generale').hidden = mode !== 'generale'
    document.getElementById('equation-canonique').hidden = mode !== 'canonique'
    document.getElementById('equation-factorisee').hidden = mode !== 'factorisee'
}

function nouvelleparabole() {
    sauvegarderScore()
    // Niveau 1 = toujours forme generale, ensuite un mode aleatoire a chaque niveau
    setMode(pickRandomMode())
    playerX = randomPosition(1, 3)
    playerY = randomPosition(2, 6)
    enemyX = randomPosition(12, 15)
    enemyY = randomPosition(2, 6)
    tire = false
    path = []
    t = 0
    tirsRestants = 5
    mettreAJourTirs()
    clearFields()
    document.getElementById("divAffiche").innerText = ""
    drawScene()
}

function levelCounter() {
    level += 1
    document.getElementById("level").textContent = "Niveau: " + level
}

function screenShake() {
    document.body.classList.remove("screenShake")
    void document.body.offsetWidth
    document.body.classList.add("screenShake")
}

// Vide les champs de saisie des 3 formes (seule celle du mode actif est visible)
function clearFields() {
    ['gen_a', 'gen_b', 'gen_c', 'can_a', 'can_h', 'can_k', 'fac_a', 'fac_x1', 'fac_x2'].forEach(function (id) {
        document.getElementById(id).value = ""
    })
}

// Lit les inputs du mode actif, convertit en forme standard (a, b, c) et tire
function lancer() {
    let a, b, c

    if (currentMode === 'generale') {
        a = parseFloat(document.getElementById("gen_a").value)
        b = parseFloat(document.getElementById("gen_b").value)
        c = parseFloat(document.getElementById("gen_c").value)
        if (isNaN(a) || isNaN(b)) {
            document.getElementById("divAffiche").innerText = "Entrez des valeurs pour a et b!"
            return
        }
        if (isNaN(c)) c = 0 // le champ c est optionnel

    } else if (currentMode === 'canonique') {
        a = parseFloat(document.getElementById("can_a").value)
        let h = parseFloat(document.getElementById("can_h").value)
        let k = parseFloat(document.getElementById("can_k").value)
        if (isNaN(a) || isNaN(h) || isNaN(k)) {
            document.getElementById("divAffiche").innerText = "Entrez a, h et k!"
            return
        }
        // Forme canonique : Y = a(X - h)² + k  ->  b = -2ah, c = ah² + k
        b = -2 * a * h
        c = a * h * h + k

    } else if (currentMode === 'factorisee') {
        a = parseFloat(document.getElementById("fac_a").value)
        let x1 = parseFloat(document.getElementById("fac_x1").value)
        let x2 = parseFloat(document.getElementById("fac_x2").value)
        if (isNaN(a) || isNaN(x1) || isNaN(x2)) {
            document.getElementById("divAffiche").innerText = "Entrez a, x1 et x2!"
            return
        }
        // Forme factorisee : Y = a(X - x1)(X - x2)  ->  b = -a(x1+x2), c = a*x1*x2
        b = -a * (x1 + x2)
        c = a * x1 * x2
    }

    lancerProjectile(a, b, c)
}

// (Re)demarre une partie  le niveau 1 est toujours en forme generale,
// les niveaux suivants choisissent une forme au hasard (voir nouvelleparabole)
function startGame() {
    setMode('generale')

    playerX = randomPosition(1, 3)
    playerY = randomPosition(2, 6)
    enemyX = randomPosition(12, 15)
    enemyY = randomPosition(2, 6)
    tire = false
    path = []
    highlightPaths = []
    t = 0
    tirsRestants = 5
    level = 1
    clearFields()
    document.getElementById("level").textContent = "Niveau: " + level
    document.getElementById("divAffiche").innerText = ""

    var username = localStorage.getItem('mathAttaqueUser') || "Joueur"
    document.getElementById("usernameDisplay").innerText = "Joueur : " + username

    showScreen('game')
    mettreAJourTirs()
    drawScene()
}

// ---------------- Demarrage ----------------

startIntro()
