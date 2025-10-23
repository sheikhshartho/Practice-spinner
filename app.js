const inputName = document.getElementById("name");
const inputEmail = document.getElementById("email");
const form = document.querySelector(".login__main__container");
const submiBtn = document.getElementById("submit__btn");
const spinBtn = document.getElementById("spin");
const wheel = document.querySelector(".wheel");
const wheelContainer = document.querySelector(".wheel__spin__container");
const confettiImg = document.querySelector(".confetti__img");

submiBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const name = inputName.value;
  const email = inputEmail.value;

  if (!name && !email) {
    inputName.style.border = "1px solid red";
    inputEmail.style.border = "1px solid red";
    return;
  }
  if (!name) {
    inputName.style.border = "1px solid red";
    return;
  }
  if (!email) {
    inputEmail.style.border = "1px solid red";
    return;
  }

  localStorage.setItem("name", name);
  localStorage.setItem("email", email);

  form.style.display = "none";
  wheelContainer.style.display = "flex";
});

let curentDeg = 0;
spinBtn.addEventListener("click", () => {
  const randomDeg = Math.floor(Math.random() * 1800) + 1440;
  curentDeg += randomDeg;
  wheel.style.transition = "transform 5s ease-out";
  wheel.style.transform = `rotate(${curentDeg}deg)`;

  confettiImg.style.display = "none";
});

wheel.addEventListener("transitionend", () => {
  confettiImg.style.display = "flex";

  setTimeout(() => {
    confettiImg.style.display = "none";
  }, 3000);
});

const wheelImgContainer = document.querySelectorAll(".slice__img");
const changeButton = document.getElementById("change__img");
const fileInput = document.getElementById("fileInput");

let activeImg = null;
let selectImg = false;

changeButton.addEventListener("click", () => {
  selectImg = true;
  changeButton.innerText = "Select slice";
  changeButton.style.background = "#bdc3c7";
  changeButton.style.color = "black";
});

wheelImgContainer.forEach((div) => {
  div.addEventListener("click", () => {
    if (selectImg) {
      activeImg = div.querySelector(".images");
      changeButton.innerText = "Change image";
      changeButton.style.background = "#242ffa";
      changeButton.style.color = "white";
      fileInput.click();
      selectImg = false;
    }
  });
});

fileInput.addEventListener("change", (event) => {
  const file = event.target.files[0];

  if (file && activeImg) {
    const reader = new FileReader();
    reader.onload = function (e) {
      activeImg.src = e.target.result;
      const imgId = activeImg.dataset.id;
      localStorage.setItem(imgId, e.target.result);
    };

    reader.readAsDataURL(file);
  }
});

window.addEventListener("load", () => {
  document.querySelectorAll(".images").forEach((img) => {
    const imgId = img.dataset.id;
    const savedImg = localStorage.getItem(imgId);
    if (savedImg) {
      img.src = savedImg;
    }
  });
});

const modal = document.getElementById("winnerModal");
const winnerImage = document.getElementById("winnerImage");
const closeBtn = document.querySelector(".close");

function showWinnerModal(imgSrc) {
  winnerImage.src = imgSrc;
  modal.style.display = "flex";
}

closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

wheel.addEventListener("transitionend", () => {
  const slices = document.querySelectorAll(".slice__img img");
  const sliceCount = slices.length;
  const degPerSlice = 360 / sliceCount;
  const actualDeg = curentDeg % 360;
  const winnerIndex =
    Math.floor((360 - actualDeg) / degPerSlice + 7) % sliceCount;
  const winnerImgSrc = slices[winnerIndex].src;
  showWinnerModal(winnerImgSrc);
});
