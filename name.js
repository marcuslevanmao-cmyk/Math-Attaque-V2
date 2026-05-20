//define le div du nom d'utilisateur au nom d'utilisateur
document.getElementById("usernameDisplay").innerText = "Joueur : " + localStorage.getItem("nom")
//fonction qui change le nom d'utilisateur stocké
function nouveauNom() {
    nom = document.getElementById("username-input").value
    if (nom == ""){
        localStorage.setItem("nom", "iconu")
        document.getElementById("niveau").style.display = "block"
    } else {
        localStorage.setItem("nom", nom)
        document.getElementById("niveau").style.display = "block"
    }
}