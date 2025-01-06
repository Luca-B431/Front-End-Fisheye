import { displayModal, closeModal } from "../utils/contactForm";

/**
 * @typedef {Object} Media
 * @property {number} id - The media's ID.
 * @property {number} photographerId - The photographer's ID associated with this media.
 * @property {string} title - The media's title.
 * @property {string} image - The media's image file name.
 * @property {number} likes - The number of likes for the media.
 * @property {string} date - The media's publication date.
 * @property {number} price - The media's price.
 */

/**
 * Generates a template for a given photographer.
 * @function photographerTemplate
 * @param {Object} data - Photographer data.
 * @param {string} data.name - The photographer's name.
 * @param {string} data.portrait - The photographer's portrait image file name.
 * @param {string} data.city - The photographer's city.
 * @param {string} data.country - The photographer's country.
 * @param {string} data.tagline - A tagline or brief description of the photographer.
 * @param {number} data.price - The photographer's daily rate.
 * @param {number} data.id - A unique ID for the photographer.
 * @returns {Object} An object containing methods to generate DOM elements.
 */
export function photographerTemplate(data) {
  const { name, portrait, city, country, tagline, price, id } = data;

  const picture = `/assets/photographers/PhotographersID/${portrait}`;

  /**
   * Generates a user card with photographer information.
   * @function
   * @returns {HTMLElement} The `<a>` element containing the photographer's information.
   */
  function getUserCardDOM() {
    const article = document.createElement("article");
    const aCard = document.createElement("a");
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
    h5.textContent = `${price}€/day`;
    h5.classList.add("grey");
    article.appendChild(aCard);
    aCard.setAttribute("href", `photographer.html?id=${id}`);
    aCard.setAttribute("aria-label", name);
    aCard.appendChild(img);
    article.appendChild(div);
    aCard.appendChild(h2);
    div.appendChild(h3);
    div.appendChild(h4);
    div.appendChild(h5);

    return article;
  }

  /**
   * Generates the header for the photographer's profile.
   * @function
   * @returns {HTMLElement} The `<section>` element containing the profile header.
   */
  function getHeaderCardDOM() {
    const photographHeader = document.getElementById("photograph-header");
    photographHeader.classList.add("photograph-header");
    photographHeader.innerHTML = "";

    const textDiv = document.createElement("div");
    textDiv.classList.add("text-div");
    const contactButton = document.createElement("button");
    const closeCross = document.getElementById("close-cross");
    contactButton.setAttribute("id", "contact_button");
    contactButton.setAttribute("aria-label", "Contactez moi");
    contactButton.textContent = "Contactez-moi";

    contactButton.addEventListener("click", () => {
      displayModal(name);
    });

    closeCross.addEventListener("click", () => {
      closeModal(name);
    });

    const img = document.createElement("img");
    img.setAttribute("src", picture);
    img.setAttribute("aria-label", name);
    img.classList.add("header-img");

    const h1 = document.createElement("h1");
    h1.textContent = name;
    h1.classList.add("light-brown");
    const h2 = document.createElement("h2");
    h2.textContent = `${city}, ${country}`;
    h2.classList.add("brown");
    const h3 = document.createElement("h3");
    h3.textContent = tagline;
    h3.classList.add("grey");

    photographHeader.appendChild(textDiv);
    textDiv.appendChild(h1);
    textDiv.appendChild(h2);
    textDiv.appendChild(h3);
    photographHeader.appendChild(contactButton);
    photographHeader.appendChild(img);

    return photographHeader;
  }

  /**
   * Generates a media article (image or video) and adds it to the DOM.
   *
   * @param {Object} media - The media object.
   * @param {string} media.image - The media's image or video file name.
   * @param {string} media.title - The media's title.
   * @param {number} media.likes - The number of likes for the media.
   * @returns {HTMLElement} - An `<a>` element containing the article with the image or video.
   */
  function getMediaArticle(media, article) {
    /**
     * Function to determine if the provided link is an image or video.
     *
     * @param {string} link - The media file link (image or video).
     * @returns {string} - The HTML for the <img> or <video> element based on the file extension.
     */

    // Creates a section for the media information (title and likes)
    const mediaTextDiv = document.createElement("div");
    mediaTextDiv.classList.add("media-textdiv");
    mediaTextDiv.setAttribute("tabindex", "-1");

    const buttonLike = document.createElement("button");
    buttonLike.setAttribute("type", "button");
    buttonLike.classList.add("button-like");

    // Creates an <a> element for the media title
    const titleLink = document.createElement("a");
    titleLink.setAttribute("href", "#");
    titleLink.textContent = media.title;
    titleLink.classList.add("brown");
    titleLink.classList.add("media-title");

    // Creates an <span> for displaying the number of likes
    let likesValue = document.createElement("span");
    likesValue.textContent = media.likes;
    likesValue.classList.add("brown");
    likesValue.classList.add("span-value");
    const heartSVG = document.createElement("object");
    heartSVG.classList.add("heartSVG");
    heartSVG.setAttribute("type", "image/svg+xml");
    heartSVG.setAttribute("data", "/assets/icons/heart.svg");
    heartSVG.setAttribute("width", "17");
    heartSVG.setAttribute("height", "18");
    heartSVG.setAttribute("aria-label", "likes");
    heartSVG.setAttribute("tabindex", "-1");

    article.appendChild(mediaTextDiv);
    article.classList.add("article");
    article.setAttribute("tabindex", "-1");
    mediaTextDiv.appendChild(titleLink);
    mediaTextDiv.appendChild(buttonLike);
    buttonLike.appendChild(likesValue);
    buttonLike.appendChild(heartSVG);

    let like = false;

    // listener for the like events
    buttonLike.addEventListener("click", () => {
      const ftrLike = document.getElementById("ftr-likes");
      const nbrFtrLike = Number(ftrLike.textContent);

      // if no like display normal likes else +1
      likesValue.textContent = like ? media.likes : media.likes + 1;

      like = !like;

      // if like var truthy so the like button is pressed = allLikes +1 in footer
      if (like) {
        ftrLike.textContent = nbrFtrLike + 1;
      } else {
        ftrLike.textContent = nbrFtrLike - 1;
      }
    });

    // Returns the <a> element containing the article with the image or video
    return article;
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
