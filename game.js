//variable et fonction qui definnissent la forme de parabole usilisé, la fonction change la valeure, et la variable vais chercher la valeure sauvé
let choixNiv = parseInt(localStorage.getItem("choixNiv"))

function choixNiveau(niveau) {
    localStorage.setItem("choixNiv", parseInt(niveau))
    choixNiv = parseInt(niveau)
}


//https://developer.mozilla.org/fr/docs/Web/API/Document/getElementById
// definition du canvas pour trouver et changer la hauteure du canvas
const canvas = document.getElementById("myCanvas")

//https://developer.mozilla.org/fr/docs/Web/API/HTMLCanvasElement/getContext
const ctx = canvas.getContext("2d")
//https://developer.mozilla.org/fr/docs/Web/API/Window/innerWidth
//definir largeure et hauteure comme les dimenttions de l'écran
const largeure = window.innerWidth
const hauteure = window.innerHeight

// Référence CSS : https://developer.mozilla.org/fr/docs/Web/CSS/position
//definir les syles de canvas
canvas.style.position = "fixed"
canvas.style.top= "0"
canvas.style.left = "0"
canvas.style.zIndex = "0"

//changer les dimenssions du canvas pour qu'il soit la grandeure de l'écran
canvas.width = largeure
canvas.height = hauteure
// https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Math/floor
//4 fonctions qui definnent au hazard les coordonées x et y de l'enemi et le joeure
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
//metre let valeures dans de variables, et definir la valeure maximum et minimum
let playerX = randomPositionPlayerX(1, 3)
let playerY = randomPositionPlayerY(2, 6)
let enemyX = randomPositionEnemyX(12, 15)
let enemyY = randomPositionEnemyY(2, 6)

//definir le nombre de collones et l'espace entre les rangées en pixels
const griCol = 16 // nombre de colonnes
const gridRow = 10 // nombre de rangées
const celWid = largeure / griCol
const celHei = hauteure / gridRow 

// https://developer.mozilla.org/fr/docs/Web/API/Canvas_API/Tutorial/Drawing_shapes
//touver ou nous devons metre les rangées
function griToPix(gx, gy) {
    return {
        px: gx * celWid,// X normal — va de gauche à droite
        py: hauteure - gy * celHei
    }
}
//definir des variables necessaire pour dessiner la parabole
//la bouléenne tir assure que nous pouvons seulement 
let tire= false
//le tableau ou on sauve les points de la paraboles pour pouvoir la dessiner
let path = []
let highlightPaths = []
let t= 0
// https://developer.mozilla.org/fr/docs/Web/API/Canvas_API/Tutorial/Basic_usage
//my7
function drawScene() {
    //https://developer.mozilla.org/fr/docs/Web/API/CanvasRenderingContext2D/fillRect
    //re initialisé le Canvas, éfacer la viellle parabole et les joueurs
    ctx.fillStyle = "#000"
    ctx.fillRect(0, 0, largeure, hauteure)
    //dessiner les lignes quadrillé(255,255,255) define la couleure, le 0.2 est l'opacité
    ctx.strokeStyle = "rgba(255 255 255 / 0.35)"
    //define l'épaisseure de la ligne, ici c'est un pixel
    ctx.lineWidth = 1
    //deux for loop qui dessine les grilles
    //dessine les grille verticale
    for (let i = 0; i <= griCol; i++) {
        ctx.beginPath()
        ctx.moveTo(i * celWid, 0)// part du haut
        ctx.lineTo(i * celWid, hauteure) // va jusqu'en bas
        ctx.stroke()
    }
    //dessine les grilles verticale
    for (let i = 0; i <= gridRow; i++) {
        ctx.beginPath()
        ctx.moveTo(0, i * celHei) // part de la gauche
        ctx.lineTo(largeure, i * celHei) // va jusqu'à droite
        ctx.stroke()
    }
    //https://developer.mozilla.org/fr/docs/Web/API/CanvasRenderingContext2D/arc
    // dessiner le joueur sur le grille
    let player = griToPix(playerX, playerY)
    //fonction qui commence à dessiner
    ctx.beginPath()
    //dessiner un cercle
    ctx.arc(player.px, player.py, 8, 0, Math.PI * 2)
    //definir la couleure du remplissage
    ctx.fillStyle = "#0cc"// cyan
    //remplir le cercle
    ctx.fill()

    //dessiner l'enemie sur la grille
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
//une fonction qui dessine la parabole
function drawTrail(path, currentPos) {
    if (path.length < 2) return

    //commence à dessiner
    ctx.beginPath()
    //definir la couleure de dessin
    ctx.strokeStyle = "rgba(100, 180, 255, 0.9)"
    //definir l'épaisseure de la ligne de la parabole, 2 pixels
    ctx.lineWidth = 2
    //bouger au joueur pour commencer la parabole
    ctx.moveTo(path[0].px, path[0].py)
    //un for loop qui vais dessiner la parabole avec des points defini dans un tableau
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
//fonction qui detecque la proximité la parabole à l'enemie
function isNearEnemy(px, py) {
    let e  = griToPix(enemyX, enemyY)
    let dx = px - e.px 
    let dy = py - e.py
    return Math.sqrt(dx*dx + dy*dy) < 14 // distance totale < 14px = touché!
}

//variable et fonction pour afficher le nombre de tirs restant dans le jeux
let tirsRestants = 5  
function mettreAJourTirs() {
    document.getElementById("tirs-restants").innerText = "Tirs: " + tirsRestants + " / 5"
}
let currentB = 0
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
    if (tirsRestants <= 0) {
        document.getElementById("divAffiche").innerText = "Plus de tirs!"
        return
    }
    //https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/parseFloat
    let a = parseFloat(document.getElementById("a").value)
    let b = parseFloat(document.getElementById("b").value)
    let c = 0
    // https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/isNaN
    if (isNaN(a) || isNaN(b) || isNaN(c)) {
        document.getElementById("divAffiche").innerText = "Entrez des valeurs pour a et b!"
        return
    }

    switch (choixNiv){
        case 2 :
            b = -2*a*b
            break
        case 3 :
            b = -a*(r+s)
            break
    }

    if (tire) return

    tire = true
    t = 0
    path = []
    document.getElementById("divAffiche").innerText = ""

    function step() {
        let worldX = playerX + t
        let worldY = playerY + (a*t*t + b*t)

        let pos = griToPix(worldX, worldY)
        // https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/push
        path.push(pos)
        drawScene()
        drawTrail(path, pos)
        // Cas 1 : touche l'ennemi
        if (isNearEnemy(pos.px, pos.py)) {
            finishShot(true)
            return
        }
        if (worldX > griCol || worldY < 0 || worldX < 0) {
            finishShot(false)
            return
        }

        t += 0.05 
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
function screenShake() {
    // Ceci remet l'animation à zéro
    document.body.classList.remove("screenShake")
    // Cette ligne permet à l'animation de pouvoir rejouer immédiatement
    void document.body.offsetWidth
    // Rajoute la classe "screenShake"
    // l'animation CSS "shake" recommence
    document.body.classList.add("screenShake")
}

