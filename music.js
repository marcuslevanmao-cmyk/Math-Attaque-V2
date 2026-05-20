/*Si un onglet avec ce nom existe deja, le navigateur le reutilise
  au lieu d'en ouvrir un nouveau — donc la musique ne recharge jamais.
  Reference : https://developer.mozilla.org/fr/docs/Web/API/Window/open*/
function ouvrirMusiqueTab() {
  window.open('music.html', 'music-tab');
}
 
/*
  On ne peut pas appeler window.open() sans un clic utilisateur —
  les navigateurs le bloquent comme popup.
  On attend donc le premier clic n'importe ou sur la page.
*/
document.addEventListener('click', ouvrirMusiqueTab, { once: true });
