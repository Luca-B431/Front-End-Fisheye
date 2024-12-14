const contactButton = document.querySelector(".contact_button");
const closeCross = document.getElementById("close-cross");

function displayModal() {
  const modal = document.getElementById("contact_modal");
  modal.style.display = "block";
}

function closeModal() {
  const modal = document.getElementById("contact_modal");
  modal.style.display = "none";
}

contactButton.addEventListener("click", () => displayModal());
closeCross.addEventListener("click", () => closeModal());
