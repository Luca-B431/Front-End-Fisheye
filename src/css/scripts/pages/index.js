import { photographerTemplate } from "../templates/template";

/**
 * Fonction asynchrone pour récupérer les données des photographes depuis un fichier JSON.
 * @async
 * @function getPhotographers
 * @returns {Promise<Object>} - Retourne une promesse résolue avec les données des photographes.
 */
async function getPhotographers() {
  // Envoie une requête pour récupérer le fichier JSON contenant les données des photographes
  const request = await fetch("/data/photographers.json");

  // Convertit la réponse en JSON
  const photographers = await request.json();

  return photographers;
}

/**
 * Affiche les données des photographes sur la page web.
 * @async
 * @function displayData
 * @param {Array} photographers - Tableau des données des photographes.
 */
async function displayData(photographers) {
  // Sélectionne la section où les cartes des photographes seront ajoutées
  const photographersSection = document.querySelector(".photographer_section");

  // Parcourt chaque photographe et crée une carte pour lui
  photographers.forEach((photographer) => {
    // Crée un modèle de carte pour chaque photographe
    const photographerModel = photographerTemplate(photographer);

    // Génère l'élément DOM de la carte du photographe
    const userCardDOM = photographerModel.getUserCardDOM();

    // Ajoute la carte à la section des photographes
    photographersSection.appendChild(userCardDOM);
  });
}

/**
 * Initialise l'application en récupérant et affichant les données des photographes.
 * @async
 * @function init
 */
async function init() {
  // Récupère les données des photographes depuis le fichier JSON
  const { photographers } = await getPhotographers();

  // Affiche les données des photographes sur la page
  displayData(photographers);
}

init();
