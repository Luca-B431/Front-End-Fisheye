import { photographerTemplate } from "../templates/template";

// asynchronous function to fetch photographers data from a json file
async function getPhotographers() {
  // sends a request to fetch the json file containing photographers data
  const request = await fetch("/data/photographers.json");

  // converts the response to json
  const photographers = await request.json();

  return photographers;
}

// displays photographers data on the web page
async function displayData(photographers) {
  // selects the section where photographers' cards will be added
  const photographersSection = document.querySelector(".photographer_section");

  // iterates over each photographer and creates a card
  photographers.forEach((photographer) => {
    // creates a card template for each photographer
    const photographerModel = photographerTemplate(photographer);

    // generates the dom element for the photographer's card
    const userCardDOM = photographerModel.getUserCardDOM();

    // appends the card to the photographers section
    photographersSection.appendChild(userCardDOM);
  });
}

// initializes the application by fetching and displaying photographers data
async function init() {
  // fetches photographers data from the json file
  const { photographers } = await getPhotographers();

  // displays the photographers data on the page
  displayData(photographers);
}

init();
