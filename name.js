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

// 'keydown' se declencher quand on appuie sur une touche du clavier
// https://developer.mozilla.org/fr/docs/Web/API/Element/keydown_event
document.getElementById('username-input').addEventListener('keydown', function(e) {
    if (e.key === 'Enter')
        nouveauNom()
})

// FIX: var au lieu de const — const ne peut pas etre re-declare si homepage.js
// a deja utilise le meme nom dans le meme scope global
// https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Statements/var
var nomSauvegarde = localStorage.getItem('mathAttaqueUser')
if (nomSauvegarde) {
    document.getElementById('username-input').value = nomSauvegarde
    document.getElementById('niveau').style.display = 'block'
}
