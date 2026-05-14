
// https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/String/trim
function handlePlay() {
    //https://developer.mozilla.org/fr/docs/Web/API/Document/getElementById
    const input = document.getElementById('username-input')
    const username = input.value.trim()
    if (username === "") {
        // Référence : https://developer.mozilla.org/fr/docs/Web/API/Window/alert
        alert("S'il vous plaît, entrez un nom d'utilisateur !")
        return// "return" arrête la fonction ici — on ne va pas à game.html
    }
    localStorage.setItem('mathAttaqueUser', username)
    // https://developer.mozilla.org/fr/docs/Web/API/Window/location
    window.location.href = "game.html"
}
document.getElementById('username-input').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        handlePlay()// même effet que cliquer sur le bouton
    }
})
