// Gère la soumission du nom, le transfert de score et l'affichage du leaderboard

// Pré-remplit le champ si un nom est déjà sauvegardé
// https://developer.mozilla.org/fr/docs/Web/API/Window/localStorage
var nomSauvegarde = localStorage.getItem('mathAttaqueUser')
if (nomSauvegarde) {
    document.getElementById('username-input').value = nomSauvegarde
    document.getElementById('niveau').style.display = 'block'
}

// Appele quand on clique sur SOUMETTRE
function nouveauNom() {
    var ancienNom = localStorage.getItem('mathAttaqueUser')
    var username  = document.getElementById('username-input').value.trim()
    if (username === "") {
        alert("S'il vous plaît, entrez un nom!")
        return
    }
    // Si le joueur a change de nom, on transfere son score vers le nouveau nom
    if (ancienNom && ancienNom !== username) {
        var scores = getScores()
        // Si l'ancien nom avait un score, on le deplace vers le nouveau nom
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

// Permet de soumettre avec la touche Enter
// https://developer.mozilla.org/fr/docs/Web/API/Element/keydown_event
document.getElementById('username-input').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') nouveauNom()
})

// LEADERBOARDDDDDDDDDDDDDDDDDDDDDDDDDDdasdasd

// Lit les scores depuis localStorage sous forme d'objet {nom: niveau}
// https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/JSON
function getScores() {
    return JSON.parse(localStorage.getItem('leaderboard') || '{}')
}

// Sauvegarde le score seulement si c'est un meilleur score
function sauvegarderScore(username, niveau) {
    var scores = getScores()
    if (!scores[username] || niveau > scores[username]) {
        scores[username] = niveau
        localStorage.setItem('leaderboard', JSON.stringify(scores))
    }
}

// Affiche le leaderboard dans le tableau HTML
function afficherLeaderboard() {
    var scores = getScores()
    var tbody  = document.getElementById('leaderboard-body')
    tbody.innerHTML = ''
    // Trie les scores du plus grand au plus petit
    // https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
    var tries = Object.entries(scores).sort(function(a, b) {
        return b[1] - a[1]
    })
    if (tries.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" style="text-align:center; color:#555">Aucun score</td></tr>'
        return
    }
    // Couleur dorée, argentée, bronze pour le top 3
    for (var i = 0; i < tries.length; i++) {
        var nom    = tries[i][0]
        var niveau = tries[i][1]
        var couleur = '#cccccc'
        if (i === 0) couleur = '#ffe44d'
        if (i === 1) couleur = '#aaaaaa'
        if (i === 2) couleur = '#cd7f32'
        // https://developer.mozilla.org/fr/docs/Web/API/Document/createElement
        var tr = document.createElement('tr')
        tr.innerHTML =
            '<td style="color:' + couleur + '; font-weight:bold">' + (i + 1) + '</td>' +
            '<td>' + nom + '</td>' +
            '<td style="color:' + couleur + '">' + niveau + '</td>'
        tbody.appendChild(tr)
    }
}

// Affiche le leaderboard dès le chargement de la page
afficherLeaderboard()
