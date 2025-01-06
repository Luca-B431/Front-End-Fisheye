import { photographerTemplate } from "../templates/template";

let cache = null;

// définition des types pour la documentation jsdoc

/**
 * fonction asynchrone pour récupérer les données des photographes et des médias depuis un fichier json.
 */
async function getPhotographers() {
  if (cache) {
    return cache;
  }

  // envoie une requête pour récupérer le fichier json contenant les données des photographes et des médias
  const request = await fetch("/data/photographers.json");

  // convertit la réponse en json et stocke les données
  /**
   * @type {PhotographersData}
   */
  const data = await request.json();

  cache = data;

  return data;
}

// fonction pour extraire l'identifiant du photographe depuis les paramètres de l'url
function getID() {
  const searchParams = new URLSearchParams(window.location.search);

  return parseInt(searchParams.get("id"));
}

// fonction pour vérifier si un média est une image ou une vidéo et créer les éléments html correspondants
function isTheMediaImgOrVideo(link, id, mediaTitle) {
  // récupère l'extension du fichier (jpg, jpeg, mp4, etc.)
  const extension = link.split(".").pop().toLowerCase();
  const article = document.createElement("article");
  article.classList.add("article");

  // fonction pour créer un élément image
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

  // fonction pour créer un élément vidéo
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

  // si le fichier est une vidéo mp4
  if (extension === "mp4") {
    return createElementVideo(link, id);
  } else if (extension === "jpg" || extension === "jpeg") {
    return createElementImg(link, id);
  }
  return article;
}

// fonction pour récupérer le bon format de média (image ou vidéo)
function getVideoOrImg(media) {
  if ("video" in media) {
    return media.video;
  } else {
    return media.image;
  }
}

// fonction pour trier les médias en fonction du critère sélectionné
function sortMedias(mediaArray) {
  const buttonSpan = document.querySelector("#filter-button span");
  const value = buttonSpan.textContent.trim();

  if (value === "Popularité") {
    mediaArray.sort((a, b) => b.likes - a.likes); // trie par nombre de likes décroissant
  }

  if (value === "Date") {
    mediaArray.sort((a, b) => new Date(b.date) - new Date(a.date)); // trie par date décroissante
  }

  if (value === "Titre") {
    mediaArray.sort((a, b) => a.title.localeCompare(b.title)); // trie par ordre alphabétique
  }

  return mediaArray;
}

let compteurLikes = 0;

// fonction pour afficher le pied de page avec le nombre de likes et le tarif du photographe
function displayFooter(photograph) {
  const ftrLikes = document.getElementById("ftr-likes");
  ftrLikes.textContent = `${compteurLikes}`;

  const ftrPrice = document.getElementById("ftr-price");
  ftrPrice.textContent = `${photograph.price}€ / jour`;
}

function showDropdownMenu() {
  const button = document.getElementById("filter-button");
  const dropdown = document.getElementById("dropdown-menu");
  const menuButtons = dropdown.querySelectorAll(".dropdown-button");

  // bouton click event
  button.addEventListener("click", () => {
    const hidden = dropdown.classList.toggle("hide");

    // si le menu est visible, mettre le focus sur le premier bouton
    if (!hidden) {
      // s'assurer que le premier bouton peut recevoir le focus
      menuButtons[0].focus();
    }
  });

  // window click event
  window.addEventListener("click", (e) => {
    if (!button.contains(e.target) && !dropdown.classList.contains("hide")) {
      dropdown.classList.toggle("hide");

      // aria
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

  // aria

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
      mediaDiv.innerHTML = "";
    }
  });

  lightboxModal.addEventListener("cancel", () => {
    lightboxModal.close();
    mediaDiv.innerHTML = "";
  });

  // function declaration for media change (previous or next) in the lightbox modal
  // used for keyevent & clickevent
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

  // clickevent listener

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

  // keyevent listener
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      carouselChange(-1);
    } else if (e.key === "ArrowRight") {
      carouselChange(1);
    }
  });
}

// fonction asynchrone pour afficher les données du photographe et insérer le contenu dans le dom
async function displayPhotographData() {
  const photographID = getID(); // récupère l'id du photographe depuis l'url
  const photographers = await getPhotographers(); // récupère les données des photographes
  const mediaArray = photographers.media; // récupère les données des médias

  // filtre les médias correspondant à l'id du photographe
  const mediaOfThisPhotographer = mediaArray.filter(
    (eachMediaItem) => eachMediaItem.photographerId === photographID
  );

  // trouve les données du photographe correspondant à l'id
  const thisPhotographer = photographers.photographers.find(
    (photograph) => photograph.id === photographID
  );

  if (thisPhotographer) {
    const impFunction = photographerTemplate(thisPhotographer);
    impFunction.getHeaderCardDOM();

    // création de la section médias dans le dom
    const mediaSection = document.getElementById("media-section");
    mediaSection.classList.add("media-section");
    mediaSection.setAttribute("tabindex", "-1");

    mediaSection.innerHTML = "";

    const sorted = sortMedias(mediaOfThisPhotographer);
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

// appels des fonctions principales
displayPhotographData();
showDropdownMenu();
