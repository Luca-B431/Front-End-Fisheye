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
 *
 *
 * Génère un modèle pour un photographe donné.
 * @function photographerTemplate
 * @param {Object} data - Les données d'un photographe.
 * @param {string} data.name - Nom du photographe.
 * @param {string} data.portrait - Nom du fichier image du portrait.
 * @param {string} data.city - Ville du photographe.
 * @param {string} data.country - Pays du photographe.
 * @param {string} data.tagline - Slogan ou description courte du photographe.
 * @param {number} data.price - Tarif journalier du photographe.
 * @param {number} data.id - Identifiant unique du photographe.
 * @returns {Object} Un objet contenant des méthodes pour générer des éléments DOM.
 */
export function photographerTemplate(data) {
  const { name, portrait, city, country, tagline, price, id } = data;

  const picture = `public/assets/photographers/PhotographersID/${portrait}`;

  /**
   * Génère une carte utilisateur avec les informations du photographe.
   * @function
   * @returns {HTMLElement} L'élément `<a>` contenant les informations du photographe.
   */
  function getUserCardDOM() {
    const aLink = document.createElement("a");
    const article = document.createElement("article");
    const img = document.createElement("img");
    const div = document.createElement("div");
    img.setAttribute("src", picture);
    const h2 = document.createElement("h2");
    h2.textContent = name;
    h2.classList.add("light-brown");
    const h3 = document.createElement("h3");
    h3.textContent = `${city}, ${country}`;
    h3.classList.add("brown");
    const h4 = document.createElement("h4");
    h4.textContent = tagline;
    h4.classList.add("black");
    const h5 = document.createElement("h5");
    h5.textContent = `${price}€/jour`;
    h5.classList.add("grey");
    aLink.appendChild(article);
    aLink.setAttribute("href", `photographer.html?id=${id}`);
    aLink.setAttribute("aria-label", `Voir le profil de ${name}`);
    article.appendChild(img);
    article.appendChild(div);
    div.appendChild(h2);
    div.appendChild(h3);
    div.appendChild(h4);
    div.appendChild(h5);

    return aLink;
  }

  /**
   * Génère l'en-tête pour le profil du photographe.
   * @function
   * @returns {HTMLElement} L'élément `<section>` contenant l'en-tête du profil.
   */
  function getHeaderCardDOM() {
    const photographHeader = document.createElement("section");
    photographHeader.classList.add("photograph-header");

    const textDiv = document.createElement("div");
    textDiv.classList.add("text-div");

    const contactButton = document.createElement("button");
    contactButton.classList.add("contact_button");
    contactButton.textContent = "Contactez-moi";

    const img = document.createElement("img");
    img.setAttribute("src", picture);
    img.classList.add("header-img");

    const h2 = document.createElement("h2");
    h2.textContent = name;
    h2.classList.add("light-brown");
    const h3 = document.createElement("h3");
    h3.textContent = `${city}, ${country}`;
    h3.classList.add("brown");
    const h4 = document.createElement("h4");
    h4.textContent = tagline;
    h4.classList.add("grey");

    photographHeader.appendChild(textDiv);
    textDiv.appendChild(h2);
    textDiv.appendChild(h3);
    textDiv.appendChild(h4);
    photographHeader.appendChild(contactButton);
    photographHeader.appendChild(img);

    return photographHeader;
  }

  /**
   * Génère un article de média (image ou vidéo) et l'ajoute au DOM.
   *
   * @param {Object} media - L'objet représentant le média.
   * @param {string} media.image - Le nom de l'image ou vidéo du média.
   * @param {string} media.title - Le titre du média.
   * @param {number} media.likes - Le nombre de likes du média.
   * @returns {HTMLElement} - Un élément `<a>` contenant l'article avec l'image ou la vidéo.
   */
  function getMediaArticle(media, article) {
    /**
     * Fonction pour déterminer si le lien fourni est une image ou une vidéo.
     *
     * @param {string} link - Le lien du fichier média (image ou vidéo).
     * @returns {string} - Le HTML pour l'élément <img> ou <video> en fonction de l'extension du fichier.
     */

    // Crée un élément <a> pour l'article du média
    const aLink = document.createElement("a");
    aLink.classList.add("a");

    // Crée une section pour les informations du média (titre et likes)
    const mediaTextDiv = document.createElement("div");
    mediaTextDiv.classList.add("media-textdiv");

    // Crée un titre h2 pour afficher le titre du média
    const h2 = document.createElement("h2");
    h2.textContent = media.title;
    h2.classList.add("light-brown");

    // Crée un sous-titre h3 pour afficher le nombre de likes du média
    const h3 = document.createElement("h3");
    h3.textContent = media.likes;
    h3.classList.add("black");

    aLink.appendChild(article);
    article.appendChild(mediaTextDiv);
    article.classList.add("article");
    mediaTextDiv.appendChild(h2);
    mediaTextDiv.appendChild(h3);

    // Retourne l'élément <a> contenant l'article avec l'image ou la vidéo
    return aLink;
  }

  return {
    name,
    picture,
    city,
    country,
    tagline,
    price,
    id,
    getUserCardDOM,
    getHeaderCardDOM,
    getMediaArticle,
  };
}
