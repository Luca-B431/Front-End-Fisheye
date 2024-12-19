export function displayModal() {
  const modal = document.getElementById("contact_modal");
  const main = document.getElementById("main");
  modal.style.display = "block";
  main.style.filter = "blur(10px)";
}

export function closeModal() {
  const modal = document.getElementById("contact_modal");
  const main = document.getElementById("main");
  modal.style.display = "none";
  main.style.filter = "blur(0px)";
  main.removeAttribute("style");
}
