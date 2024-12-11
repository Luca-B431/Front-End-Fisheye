function photographerTemplate(data) {
  //    data =  data.name data.portrait dans la fonction
  const { name, portrait, city, country, tagline, price } = data;

  const picture = `assets/photographers/PhotographersID/${portrait}`;

  function getUserCardDOM() {
    const article = document.createElement("article");
    const img = document.createElement("img");
    const div = document.createElement("div");
    const aLink = document.createElement("a");
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
    aLink.setAttribute("href", "photographer.html");
    article.appendChild(img);
    article.appendChild(div);
    div.appendChild(h2);
    div.appendChild(h3);
    div.appendChild(h4);
    div.appendChild(h5);

    return aLink;
  }
  return { name, picture, city, country, tagline, price, getUserCardDOM };
}
