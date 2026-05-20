//https://developer.mozilla.org/fr/docs/Web/API/Document/getElementById
//constante qui nous permet de chercher et changer la grandeure du canvas
const canvas = document.getElementById("myCanvas")

//https://developer.mozilla.org/fr/docs/Web/API/HTMLCanvasElement/getContext
//constante qui nous permet de dessiner sur le canvas
const ctx = canvas.getContext("2d")
let largeure = window.innerWidth
let hauteure = window.innerHeight
// Référence CSS : https://developer.mozilla.org/fr/docs/Web/CSS/position
canvas.style.position = "fixed"
canvas.style.top= "0"
canvas.style.left = "0"
canvas.style.zIndex = "0"

canvas.width = largeure
canvas.height = hauteure
//fonction qui change les coordonnées des joueurs
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
let spawnPlayerX = (canvas.width / 20) / 2

let playerX = randomPositionPlayerX(0, spawnPlayerX)
let playerY = randomPositionPlayerY(0, (canvas.height / 20))
let enemyX = randomPositionEnemyX(spawnPlayerX, (canvas.width / 20))
let enemyY = randomPositionEnemyY(0, (canvas.height / 20))

playerX = playerX * 20
playerY = playerY * 20
enemyX = enemyX * 20
enemyY = enemyY * 20

console.log("playerX:", playerX, "playerY:", playerY, "enemyX:", enemyX, "enemyY:", enemyY, "spawnPlayerX:", spawnPlayerX, "canvas.width:", canvas.width, "canvas.height:", canvas.height)

//variables pour dessiner la parabole
let tire= false
let path = []
let highlightPaths = []
let t= 0

/*
//fonction qui redimensionne le canvas pour qu'il prenne toute la page
function resizeCanvas(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    drawGrid(1, 20, 20, "rgba(255,255,255,0.08) 1px, transparent 1pxfd")
    drawScene()
}
// fonction qui dessine les lignes du canvas pour faire une grille
 function drawGrid(lineWidth, cellWidth, cellHeight, color){
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        
        
        
        for(let x = 0; x <= canvas.width; x += cellWidth){
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
          ctx.stroke();
        }
        
        for(let y = 0; y <= canvas.height; y += cellHeight){
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
*/

const griCol = (canvas.width / 20) // nombre de colonnes
const gridRow = (canvas.height / 20) // nombre de rangées
const celWid = 20
const celHei = 20


// https://developer.mozilla.org/fr/docs/Web/API/Canvas_API/Tutorial/Drawing_shapes
function griToPix(gx, gy) {
    return {
        px: gx * celWid,// X normal — va de gauche à droite
        py: canvas.height - gy * celHei
    }
}

    
// https://developer.mozilla.org/fr/docs/Web/API/Canvas_API/Tutorial/Basic_usage
//dessine le joueur, l'ennemi sur le canvas
function drawScene() {
   
   // drawGrid(1, 20, 20, "#fdfdfd")

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
    
    ctx.beginPath()
    ctx.arc(playerX, playerY, 8, 0, Math.PI * 2)
    ctx.fillStyle = "#0cc"// cyan
    ctx.fill()
  
    ctx.beginPath()
    ctx.arc(enemyX, enemyY, 8, 0, Math.PI * 2)
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
    ctx.reset();
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
let username = localStorage.getItem('mathAttaqueUser')
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