
const opening = document.getElementById("opening")
const loading  = document.getElementById("loading")
function play(video, next, fallbackTime = 6000) {
    const fallback = setTimeout(next, fallbackTime)
 
    video.play().then(() => {
        video.onended = () => {
            clearTimeout(fallback) 
            next()                
        }
    }).catch(() => {
        clearTimeout(fallback)
        next()
    })
}

function startIntro() {
    opening.hidden = false  
    loading.hidden = true  
    play(opening, startLoading, 8000) 
}
function startLoading() {
    opening.hidden = true 
    loading.hidden = false
    play(loading, goToHome, 10000) 
}
// https://developer.mozilla.org/fr/docs/Web/API/Location/href
function goToHome() {
    window.location.href = "homepage.html"
}

startIntro()