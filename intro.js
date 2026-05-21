// Gère la séquence d'intro : vidéo d'ouverture → écran de chargement → homepage

const opening = document.getElementById("opening")
const loading  = document.getElementById("loading")

// Joue une vidéo et appelle next() quand elle se termine
// fallbackTime = délai de secours si la vidéo ne se lance pas
function play(video, next, fallbackTime = 6000) {
    const fallback = setTimeout(next, fallbackTime)
 
    video.play().then(() => {
        video.onended = () => {
            clearTimeout(fallback) // annule le secours si la vidéo se termine normalement
            next()                
        }
    }).catch(() => {
        // Si la lecture échoue (ex: autoplay bloqué), on passe quand même
        clearTimeout(fallback)
        next()
    })
}

// Étape 1  affiche la vidéo d'ouverture
function startIntro() {
    opening.hidden = false  
    loading.hidden = true  
    play(opening, startLoading, 8000) 
}

// Étape 2  affiche l'écran de chargement
function startLoading() {
    opening.hidden = true 
    loading.hidden = false
    play(loading, goToHome, 10000) 
}

// Étape 3  redirige vers la page d'accueil
// https://developer.mozilla.org/fr/docs/Web/API/Location/href
function goToHome() {
    window.location.href = "homepage.html"
}

// Lance la séquence au chargement de la page
startIntro()
