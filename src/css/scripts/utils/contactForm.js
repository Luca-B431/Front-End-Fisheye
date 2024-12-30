export function displayModal(name) {
  const modal = document.getElementById("contact_modal");
  const body = document.getElementById("body");
  const h2 = document.querySelector(".modal h2");
  const footer = document.getElementById("footer");
  modal.style.display = "block";
  h2.textContent = `Contactez-moi ${name}`;
  h2.classList.add("modal-title");
  body.classList.add("no-scroll");
  footer.classList.add("hide");
}

export function closeModal() {
  const modal = document.getElementById("contact_modal");
  const body = document.getElementById("body");
  const footer = document.getElementById("footer");
  modal.style.display = "none";
  body.classList.remove("no-scroll");
  footer.classList.remove("hide");
}
