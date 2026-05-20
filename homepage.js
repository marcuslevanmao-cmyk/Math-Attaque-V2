
// https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/String/trim
function nouveauNom() {
    const input = document.getElementById('username-input')
    // .trim() enleve les espaces au debut et a la fin
    const username = input.value.trim()

    if (username === "") {
        // https://developer.mozilla.org/fr/docs/Web/API/Window/alert
        alert("S'il vous plaît, entrez un nom!")
        return // arrete la fonction ici, on ne continue pas
    }

    // localStorage garde les donnees meme apres fermeture du navigateur
    // https://developer.mozilla.org/fr/docs/Web/API/Window/localStorage
    localStorage.setItem('mathAttaqueUser', username)

    // .style.display = 'block' rend un element visible
    // https://developer.mozilla.org/fr/docs/Web/CSS/display
    document.getElementById('niveau').style.display = 'block'
    afficherLeaderboard()
}

// 'keydown' se declenche quand on appuie sur une touche du clavier
// https://developer.mozilla.org/fr/docs/Web/API/Element/keydown_event
document.getElementById('username-input').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') nouveauNom() // meme effet que cliquer le bouton
})

// Si le joueur a deja entre son nom avant, on le remet automatiquement
const nomSauvegarde = localStorage.getItem('mathAttaqueUser')
if (nomSauvegarde) {
    document.getElementById('username-input').value = nomSauvegarde
    document.getElementById('niveau').style.display = 'block'
}

//LEADERBOARDDDDDDDDDDDDDDDDDDDDDDDDDD
/*
  Les scores sont sauvegardes dans localStorage sous la cle "leaderboard".
  Format : un objet JSON  →  { "Alice": 5, "Bob": 3 }

  JSON.parse  : convertit le texte sauvegarde en objet JavaScript
  JSON.stringify : convertit un objet JavaScript en texte pour le sauvegarder
  https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/JSON
*/
function getScores() {
    return JSON.parse(localStorage.getItem('leaderboard') || '{}')
}

function sauvegarderScore(username, niveau) {
    let scores = getScores()
    // On garde seulement le meilleur score pour chaque joueur
    if (!scores[username] || niveau > scores[username]) {
        scores[username] = niveau
        localStorage.setItem('leaderboard', JSON.stringify(scores))
    }
}

function afficherLeaderboard() {
    let scores = getScores()

    // Object.entries convertit l'objet en tableau de paires [nom, score]
    // .sort trie par score decroissant (b[1] - a[1])
    // https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
    let tries = Object.entries(scores).sort(function(a, b) { return b[1] - a[1] })

    const tbody = document.getElementById('leaderboard-body')
    // .innerHTML = '' vide le tableau avant de le reremplir
    // https://developer.mozilla.org/fr/docs/Web/API/Element/innerHTML
    tbody.innerHTML = ''

    if (tries.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" style="text-align:center; color:#555">Aucun score</td></tr>'
        return
    }

    // .forEach parcourt chaque entree du tableau
    // https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
    tries.forEach(function(entry, index) {
        const username = entry[0]
        const niveau   = entry[1]

        // Couleur differente pour les 3 premieres places
        let couleur = '#cccccc'
        if (index === 0) couleur = '#ffe44d' // or
        if (index === 1) couleur = '#aaaaaa' // argent
        if (index === 2) couleur = '#cd7f32' // bronze

        // document.createElement cree un nouvel element HTML
        // https://developer.mozilla.org/fr/docs/Web/API/Document/createElement
        const tr = document.createElement('tr')
        tr.innerHTML =
            '<td style="color:' + couleur + '; font-weight:bold">'+(index + 1) + '</td>' +'<td>' + username + '</td>' +'<td style="color:' + couleur + '">' + niveau + '</td>'
        // .appendChild ajoute la ligne dans le tableau
        // https://developer.mozilla.org/fr/docs/Web/API/Node/appendChild
        tbody.appendChild(tr)
    })
}

afficherLeaderboard()
