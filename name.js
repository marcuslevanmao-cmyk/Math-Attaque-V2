// Gère la saisie du nom du joueur et la persistance via localStorage

// https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/String/trim
function nouveauNom() {
    const input = document.getElementById('username-input')
    // .trim() enleve les espaces au debut et a la fin
    const username = input.value.trim()
    if (username === "") {
        // https://developer.mozilla.org/fr/docs/Web/API/Window/alert
        alert("S'il vous plaît, entrez un nom!")
        return
    }
    //  garde les donnees meme apres fermetur
    // https://developer.mozilla.org/fr/docs/Web/API/Window/localStorage
    localStorage.setItem('mathAttaqueUser', username)
    // .style.display = 'block' = element visible
    // https://developer.mozilla.org/fr/docs/Web/CSS/display
    document.getElementById('niveau').style.display = 'block'
    // reload le leaderboard apres soumission du nom
    // afficherLeaderboard() est defini dans homepage.js
    if (typeof afficherLeaderboard === 'function') afficherLeaderboard()
}
// sur les pages de jeu, #username-input n'existe pas → evite le TypeError
// https://developer.mozilla.org/fr/docs/Web/API/Element/keydown_event
var inputField = document.getElementById('username-input')
if (inputField) {
    inputField.addEventListener('keydown', function(e) {
        if (e.key === 'Enter')
            nouveauNom()
    })
}
// a deja utilise le meme nom dans le meme scope global
// https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Statements/var
var nomSauvegarde = localStorage.getItem('mathAttaqueUser')
if (nomSauvegarde) {
    if (document.getElementById('username-input'))
        document.getElementById('username-input').value = nomSauvegarde
    if (document.getElementById('niveau'))
        document.getElementById('niveau').style.display = 'block'
}
