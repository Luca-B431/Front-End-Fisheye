const inputs = document.querySelectorAll(".input");

export function displayModal(name) {
  const modal = document.getElementById("contact_modal");
  const body = document.getElementById("body");
  const h2 = document.querySelector(".modal h2");
  const footer = document.getElementById("footer");

  // recup form
  modal.style.display = "block";
  h2.textContent = `Contactez-moi ${name}`;
  h2.classList.add("modal-title");
  body.classList.add("no-scroll");
  footer.classList.add("hide");

  // ARIA
  const form = document.querySelector("#form");

  inputs.forEach((input) => {
    const label = document.querySelector(`label[for="${input.id}"]`); // Sélectionner le label correspondant par l'attribut `for`
    if (label) {
      const labelText = label.textContent.trim(); // Récupérer le contenu texte du label
      input.setAttribute("aria-labelledby", labelText); // Ajouter l'attribut aria-labelledby
    }
  });

  let content = h2.textContent;
  form.setAttribute("aria-labelledby", content);
}

export function closeModal() {
  const modal = document.getElementById("contact_modal");
  const body = document.getElementById("body");
  const footer = document.getElementById("footer");
  modal.style.display = "none";
  body.classList.remove("no-scroll");
  footer.classList.remove("hide");
}

const form = document.querySelector("form");

form.addEventListener("submit", (e) => {
  e.preventDefault(); // Empêche la soumission par défaut du formulaire

  // Récupération des champs du formulaire
  const inputName = document.getElementById("name");
  const inputLastname = document.getElementById("lastname");
  const inputEmail = document.getElementById("email");
  const inputMessage = document.getElementById("message"); // Correction de l'ID

  // Regex de validation
  const regexName = /^[a-zA-Z]{2,}$/;
  const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const regexMessage = /^[a-zA-Z0-9\s.,!?'"()&-]{1,}$/; // Permet lettres, chiffres, espaces, et certains caractères spéciaux

  // Validation des champs
  let isValid = true;

  // Validation pour le nom
  if (!regexName.test(inputName.value)) {
    console.log("Nom invalide");
    isValid = false;
  }

  // Validation pour le prénom
  if (!regexName.test(inputLastname.value)) {
    console.log("Prénom invalide");
    isValid = false;
  }

  // Validation pour l'email
  if (!regexEmail.test(inputEmail.value)) {
    console.log("Email invalide");
    isValid = false;
  }

  // Validation pour le message
  if (!regexMessage.test(inputMessage.value)) {
    console.log("Message invalide");
    isValid = false;
  }

  // Si tous les champs sont valides
  if (isValid) {
    console.log(
      inputName.value,
      inputLastname.value,
      inputEmail.value,
      inputMessage.value
    );
  }
});
