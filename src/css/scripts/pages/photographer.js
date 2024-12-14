import { photographerTemplate } from "../templates/template";

/**
 * @typedef {Object} Photographer
 * @property {string} name - Le nom du photographe.
 * @property {number} id - L'ID du photographe.
 * @property {string} city - La ville du photographe.
 * @property {string} country - Le pays du photographe.
 * @property {string} tagline - La devise du photographe.
 * @property {number} price - Le prix par photo du photographe.
 * @property {string} portrait - Le nom de l'image du portrait du photographe.
 */

/**
 * @typedef {Object} Media
 * @property {number} id - L'ID du média.
 * @property {number} photographerId - L'ID du photographe associé à ce média.
 * @property {string} title - Le titre du média.
 * @property {string} image - Le nom du fichier image du média.
 * @property {number} likes - Le nombre de likes du média.
 * @property {string} date - La date de publication du média.
 * @property {number} price - Le prix du média.
 */

/**
 * @typedef {Object} PhotographersData
 * @property {Photographer[]} photographers - Un tableau des photographes.
 * @property {Media[]} media - Un tableau des médias associés aux photographes.
 */

/**
 * Fonction asynchrone pour récupérer les données des photographes et des médias depuis un fichier JSON.
 * @async
 * @function getPhotographers
 * @returns {Promise<PhotographersData>} - Retourne une promesse contenant un objet avec deux clés :
 *   - "photographers" : un tableau d'objets représentant les photographes.
 *   - "media" : un tableau d'objets représentant les médias associés aux photographes.
 */
async function getPhotographers() {
  // Envoie une requête pour récupérer le fichier JSON contenant les données des photographes et des médias
  const request = await fetch("./public/data/photographers.json");

  // Convertit la réponse en JSON et typifie le retour
  /**
   * @type {PhotographersData}
   */
  const data = await request.json();

  return data;
}

/**
 * Fonction pour extraire l'identifiant du photographe depuis les paramètres de l'URL.
 * @function getID
 * @returns {number} - Retourne l'identifiant du photographe en tant que nombre.
 */
function getID() {
  const searchParams = new URLSearchParams(window.location.search);

  return parseInt(searchParams.get("id"));
}

function isTheMediaImgOrVideo(link, id) {
  // Récupère l'extension du fichier (jpg, jpeg, mp4, etc.)
  const extension = link.split(".").pop().toLowerCase();
  const article = document.createElement("article");
  article.classList.add("article");

  function createElementImg(link, id) {
    const img = document.createElement("img");
    img.classList.add("media-img");
    img.setAttribute("src", `public/assets/photographers/${id}/${link}`);
    article.appendChild(img);
    return article;
  }

  function createElementVideo(link, id) {
    const video = document.createElement("video");
    const source = document.createElement("source");
    video.classList.add("media-video");
    video.setAttribute("controls", "true");
    source.setAttribute("type", `video/mp4`);
    video.appendChild(source);
    source.setAttribute("src", `public/assets/photographers/${id}/${link}`);
    article.appendChild(video);
    return article;
  }

  // Si le fichier est une vidéo mp4
  if (extension === "mp4") {
    // Retourne le code HTML pour une balise vidéo
    return createElementVideo(link, id);
  } else if (extension === "jpg" || extension === "jpeg") {
    return createElementImg(link, id);
  }
  return article;
}

function getVideoOrImg(media) {
  if ("video" in media) {
    return media.video;
  } else if ("image") {
    return media.image;
  }
}

/**
 * Fonction asynchrone pour afficher les données du photographe et insérer le contenu dans le DOM.
 * @async
 * @function displayPhotographData
 * @returns {void}
 */
async function displayPhotographData() {
  const photographID = getID(); // Récupère l'ID du photographe depuis l'URL
  const photographers = await getPhotographers(); // Récupère les données des photographes
  const mediaArray = photographers.media; // Récupère les données des médias

  const mediaForThisPhotographer = mediaArray.filter(
    (eachMediaItem) => eachMediaItem.photographerId === photographID
  );

  console.log(mediaForThisPhotographer);

  // Trouve les données du photographe correspondant à l'ID
  const thisPhotographer = photographers.photographers.find(
    (photograph) => photograph.id === photographID
  );

  if (thisPhotographer) {
    // Insère les données dans le DOM si le photographe est trouvé
    const main = document.getElementById("main");
    const impFunction = photographerTemplate(thisPhotographer);
    // create section

    const headerDOM = impFunction.getHeaderCardDOM();
    main.appendChild(headerDOM);

    const mediaSection = document.createElement("section");
    main.appendChild(mediaSection);
    mediaSection.classList.add("media-section");

    mediaForThisPhotographer.forEach((mediaItem) => {
      let link = getVideoOrImg(mediaItem);
      const mediaCard = impFunction.getMediaArticle(
        mediaItem,
        isTheMediaImgOrVideo(link, thisPhotographer.id)
      );
      mediaSection.appendChild(mediaCard);
    });
  }
}

// Appelle la fonction principale pour afficher les données
displayPhotographData();
