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
  const request = await fetch("/data/photographers.json");

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

function isTheMediaImgOrVideo(link, id, mediaTitle) {
  // Récupère l'extension du fichier (jpg, jpeg, mp4, etc.)
  const extension = link.split(".").pop().toLowerCase();
  const article = document.createElement("article");
  article.classList.add("article");

  function createElementImg(link, id) {
    const imgLink = document.createElement("a");
    const img = document.createElement("img");
    img.classList.add("article-media");
    img.setAttribute("src", `/assets/photographers/${id}/${link}`);
    img.setAttribute("aria-label", mediaTitle);
    imgLink.classList.add("article-link");
    imgLink.setAttribute("href", "#");
    imgLink.setAttribute("aria-label", `${mediaTitle}, closeup view`);
    imgLink.appendChild(img);
    article.appendChild(imgLink);
    return article;
  }

  function createElementVideo(link, id) {
    const videoLink = document.createElement("a");
    const video = document.createElement("video");
    const source = document.createElement("source");
    video.classList.add("article-media");
    video.classList.add("video-click");
    video.setAttribute("aria-label", mediaTitle);
    video.appendChild(source);
    source.classList.add("lightbox-display");
    source.setAttribute("type", `video/mp4`);
    source.setAttribute("src", `/assets/photographers/${id}/${link}`);
    videoLink.classList.add("article-link");
    videoLink.setAttribute("href", "#");
    videoLink.setAttribute("aria-label", `${mediaTitle}, closeup view`);
    article.appendChild(videoLink);
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

  if (value === "Date") {
    mediaArray.sort((a, b) => new Date(b.date) - new Date(a.date)); // Trier par date (du plus récent au plus ancien)
  }

  if (value === "Titre") {
    mediaArray.sort((a, b) => a.title.localeCompare(b.title)); // Trier par titre (ordre alphabétique)
  }

  return mediaArray;
}

let compteurLikes = 0;

function displayFooter(photograph) {
  const ftrLikes = document.getElementById("ftr-likes");
  ftrLikes.textContent = `${compteurLikes}`;

  const ftrPrice = document.getElementById("ftr-price");
  ftrPrice.textContent = `${photograph.price}€ / jour`;
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
    mediaSection.setAttribute("tabindex", "-1");

    mediaSection.innerHTML = "";

    const sorted = sortMedias(mediaOfThisPhotographer);
    console.log(sorted);
    sorted.forEach((mediaItem) => {
      let link = getVideoOrImg(mediaItem);
      const mediaCard = impFunction.getMediaArticle(
        mediaItem,
        isTheMediaImgOrVideo(link, thisPhotographer.id, mediaItem.title),
        getVideoOrImg(mediaItem)
      );
      compteurLikes += mediaItem.likes;
      mediaSection.appendChild(mediaCard);
    });
  }

  displayLightboxModal();
  displayFooter(thisPhotographer);
}

function showDropdownMenu() {
  const button = document.getElementById("filter-button");
  const dropdown = document.getElementById("dropdown-menu");
  const menuButtons = dropdown.querySelectorAll(".dropdown-button");
  console.log(menuButtons);

  // Bouton click event
  button.addEventListener("click", () => {
    const hidden = dropdown.classList.toggle("hide");

    // Si le menu est visible, mettre le focus sur le premier bouton
    if (!hidden) {
      // S'assurer que le premier bouton peut recevoir le focus
      menuButtons[0].focus();
    }
  });

  // window click event
  window.addEventListener("click", (e) => {
    if (!button.contains(e.target) && !dropdown.classList.contains("hide")) {
      dropdown.classList.toggle("hide");

      // ARIA
      button.setAttribute("aria-expanded", false);
    }
  });

  // filter buttons handling
  const filterButtons = document.querySelectorAll(".dropdown-button");
  const span = document.querySelector("#filter-button span");

  filterButtons.forEach((element) => {
    element.addEventListener("click", (event) => {
      span.textContent = event.target.textContent;
      displayPhotographData();
      compteurLikes = 0;
    });
  });

  // ARIA

  // button labelled by the div label
  const spanLabel = document.getElementById("filter-label");
  let labelContent = spanLabel.textContent;
  button.setAttribute("aria-labelledby", labelContent);
}

function displayLightboxModal() {
  const lightboxModal = document.getElementById("lightbox-modal");
  const cross = document.querySelector(".close-cross");
  const body = document.getElementById("body");
  const mediaDiv = document.getElementById("media");
  const footer = document.getElementById("footer");
  const articles = document.querySelectorAll("#media-section article");

  let index = 0;

  articles.forEach((article, i) => {
    const mediaLink = article.querySelector(".article-link");
    const mediaTitle = article.querySelector(".media-title");

    const clickListener = (e) => {
      e.preventDefault();

      // index var take the article index value
      index = i;

      const media = article.querySelector(".article-media");
      const title = mediaTitle.textContent;

      // clone the article media
      let cloneMedia = media.cloneNode(true);

      // add controls attribute if the clone is a video
      if (cloneMedia.tagName === "VIDEO") {
        cloneMedia.setAttribute("controls", "");
      }

      let titleClone = document.createElement("span");
      titleClone.textContent = title;
      titleClone.classList.add("brown");

      mediaDiv.appendChild(cloneMedia);
      mediaDiv.appendChild(titleClone);

      // here is the lightbox modal display
      // hide the footer, apply "controls" attribute on video medias and no-scroll the window behind the modal (2.1)
      lightboxModal.showModal();
      footer.classList.add("hide");
      body.classList.add("no-scroll");
    };

    mediaLink.addEventListener("click", clickListener);
    mediaTitle.addEventListener("click", clickListener);
  });

  // cross element listener for close the lightbox modal
  // display the footer, remove "controls" attribute and window scroll enable (2.1)
  const videoControls = document.querySelector(".video-click");
  cross.addEventListener("click", () => {
    lightboxModal.close();
    body.classList.remove("no-scroll");
    footer.classList.remove("hide");
    mediaDiv.innerHTML = "";
    videoControls.removeAttribute("controls");
  });

  cross.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      lightboxModal.close();
    }
  });

  lightboxModal.addEventListener("cancel", () => {
    lightboxModal.close();
  });

  // function declaration for media change (previous or next) in the lightbox modal
  // used for keyEvent & clickEvent
  function carouselChange(value) {
    index = (index + value + articles.length) % articles.length;

    const newMedia = articles[index].querySelector(".article-media");
    const newTitle = articles[index].querySelector(".media-title");

    if (newMedia) {
      mediaDiv.innerHTML = "";
      const clonedMedia = newMedia.cloneNode(true);

      // vérification des controls sur le retour sur la vidéo dans le caroussel
      if (clonedMedia.tagName === "VIDEO") {
        clonedMedia.setAttribute("controls", "");
      }

      mediaDiv.appendChild(clonedMedia);
    }

    if (newTitle) {
      let cloneTitle = document.createElement("span");
      cloneTitle.textContent = newTitle.textContent;
      cloneTitle.classList.add("brown");
      mediaDiv.appendChild(cloneTitle);
    }
  }

  function tabKeyPress(ev, direction) {
    if (ev.key === "Enter") {
      carouselChange(direction);
    }
  }

  const leftArrow = document.querySelector(".left-vector");
  const rightArrow = document.querySelector(".right-vector");

  // clickEvent listener

  // left arrow click, display previous media
  leftArrow.addEventListener("click", () => {
    carouselChange(-1);
  });
  leftArrow.addEventListener("keydown", (e) => {
    tabKeyPress(e, -1);
  });

  // right arrow click, display next media
  rightArrow.addEventListener("click", () => {
    carouselChange(1);
  });
  rightArrow.addEventListener("keydown", (e) => {
    tabKeyPress(e, +1);
  });

  // keyEvent listener
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      carouselChange(-1);
    } else if (e.key === "ArrowRight") {
      carouselChange(1);
    }
  });
}

// calls
displayPhotographData();
showDropdownMenu();
