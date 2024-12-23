import { photographerTemplate } from "../templates/template";

let cache = null;

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
  if (cache) {
    return cache;
  }

  // Envoie une requête pour récupérer le fichier JSON contenant les données des photographes et des médias
  const request = await fetch("./public/data/photographers.json");

  // Convertit la réponse en JSON et typifie le retour
  /**
   * @type {PhotographersData}
   */
  const data = await request.json();

  cache = data;

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
    const imgLink = document.createElement("a");
    imgLink.classList.add("article-link");
    const img = document.createElement("img");
    img.classList.add("article-media");
    img.setAttribute("src", `public/assets/photographers/${id}/${link}`);
    article.appendChild(imgLink);
    imgLink.setAttribute("href", "#");
    imgLink.appendChild(img);
    return article;
  }

  function createElementVideo(link, id) {
    const videoLink = document.createElement("a");
    videoLink.classList.add("article-link");
    const video = document.createElement("video");
    const source = document.createElement("source");
    video.classList.add("article-media");
    video.setAttribute("controls", "true");
    video.classList.add("video-click");
    source.setAttribute("type", `video/mp4`);
    video.appendChild(source);
    source.setAttribute("src", `public/assets/photographers/${id}/${link}`);
    article.appendChild(videoLink);
    videoLink.setAttribute("href", "#");
    videoLink.appendChild(video);
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
  } else {
    return media.image;
  }
}

function sortMedias(mediaArray) {
  const buttonSpan = document.querySelector("#filter-button span");
  const value = buttonSpan.textContent.trim();

  if (value === "Popularité") {
    mediaArray.sort((a, b) => b.likes - a.likes); // Trier par likes (du plus élevé au plus bas)
  }

  if (value === "Dates") {
    mediaArray.sort((a, b) => new Date(b.date) - new Date(a.date)); // Trier par date (du plus récent au plus ancien)
  }

  if (value === "Titres") {
    mediaArray.sort((a, b) => a.title.localeCompare(b.title)); // Trier par titre (ordre alphabétique)
  }

  return mediaArray;
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

  const mediaOfThisPhotographer = mediaArray.filter(
    (eachMediaItem) => eachMediaItem.photographerId === photographID
  );
  // Trouve les données du photographe correspondant à l'ID
  const thisPhotographer = photographers.photographers.find(
    (photograph) => photograph.id === photographID
  );

  if (thisPhotographer) {
    const impFunction = photographerTemplate(thisPhotographer);
    impFunction.getHeaderCardDOM();

    // media section DOM creaction part
    const mediaSection = document.getElementById("media-section");
    mediaSection.classList.add("media-section");

    mediaSection.innerHTML = "";

    const sorted = sortMedias(mediaOfThisPhotographer);
    console.log(sorted);
    sorted.forEach((mediaItem) => {
      let link = getVideoOrImg(mediaItem);
      const mediaCard = impFunction.getMediaArticle(
        mediaItem,
        isTheMediaImgOrVideo(link, thisPhotographer.id),
        getVideoOrImg(mediaItem)
      );
      mediaSection.appendChild(mediaCard);
    });
  }

  displayLightboxModal();
}

function showDropdownMenu() {
  const button = document.getElementById("filter-button");
  const dropdown = document.getElementById("dropdown-menu");

  button.addEventListener("click", () => {
    dropdown.classList.toggle("hide");
  });

  window.addEventListener("click", (e) => {
    if (!button.contains(e.target) && !dropdown.classList.contains("hide")) {
      dropdown.classList.toggle("hide");
    }
  });

  const filterButtons = document.querySelectorAll(".dropdown-button");
  const span = document.querySelector("#filter-button span");

  filterButtons.forEach((element) => {
    element.addEventListener("click", (event) => {
      span.textContent = event.target.textContent;
      displayPhotographData();
    });
  });
}

function displayLightboxModal() {
  const lightboxModal = document.getElementById("lightbox-modal");
  const body = document.getElementById("body");
  const mediaDiv = document.getElementById("media");

  let index = 0;

  // je veux tout les a du grid
  const articles = document.querySelectorAll("#media-section a");
  console.log(articles);

  // je veux écouter les clicks sur tout les a

  articles.forEach((article, i) =>
    article.addEventListener("click", (e) => {
      e.preventDefault();

      // index prends l'index de l'article
      index = i;

      // affiche la lightbox si clique sur un des liens
      const mediaDOM = article.querySelector(".article-media");
      mediaDiv.appendChild(mediaDOM.cloneNode());
      lightboxModal.classList.remove("hide");
      body.classList.add("no-scroll");

      // écoute de la croix pour fermer la lightbox
      const cross = document.querySelector(".close-cross");
      cross.addEventListener("click", () => {
        if (lightboxModal) {
          body.classList.remove("no-scroll");
          lightboxModal.classList.add("hide");
          mediaDiv.innerHTML = "";
        }
      });

      function carouselChange(value) {
        index = (index + value + articles.length) % articles.length;

        const newMedia = articles[index].querySelector(".article-media");
        if (newMedia) {
          mediaDiv.innerHTML = "";
          mediaDiv.appendChild(newMedia.cloneNode(true));
        }
      }

      // écoute des flèches du caroussel
      const leftArrow = document.querySelector(".left-vector");
      const rightArrow = document.querySelector(".right-vector");

      leftArrow.addEventListener("click", () => {
        carouselChange(-2);
      });

      rightArrow.addEventListener("click", () => {
        carouselChange(2);
      });
    })
  );
}

// Appelle la fonction principale pour afficher les données
displayPhotographData();
showDropdownMenu();
