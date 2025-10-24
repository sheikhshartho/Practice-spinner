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
  changeButton.innerText = "Select slice image";
  changeButton.style.background = "#bdc3c7";
  changeButton.style.color = "black";
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

  updateWheelRotation();
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
  const winnerIndex = Math.floor((360 - actualDeg) / degPerSlice) % sliceCount;
  const winnerImgSrc = slices[winnerIndex].src;
  showWinnerModal(winnerImgSrc);
});

function updateWheelRotation() {
  const allSlices = document.querySelectorAll(".slice");
  const sliceCount = allSlices.length;
  const degPerSlice = 360 / sliceCount;
  const skewAngle = 90 - degPerSlice;

  allSlices.forEach((slice, index) => {
    slice.style.transform = `rotate(${
      degPerSlice * index
    }deg) skewY(${skewAngle}deg)`;
    const imgDiv = slice.querySelector(".slice__img");
    imgDiv.style.transform = `skewY(${-skewAngle}deg)`;

    const scale = Math.max(0.4, 1 - skewAngle / 100);
    imgDiv.style.width = `${scale * 40}%`;
    imgDiv.style.height = `${scale * 40}%`;
  });
}

const addSliceBtn = document.getElementById("add__slice");

addSliceBtn.addEventListener("click", () => {
  const newSlice = document.createElement("div");
  newSlice.classList.add("slice");

  const sliceImgDiv = document.createElement("div");
  sliceImgDiv.classList.add("slice__img");

  const img = document.createElement("img");
  img.classList.add("images");
  img.dataset.id = `slice${
    document.querySelectorAll(".slice__img img").length + 1
  }`;

  sliceImgDiv.appendChild(img);
  newSlice.appendChild(sliceImgDiv);
  wheel.appendChild(newSlice);

  updateWheelRotation();
});

const removeSliceBtn = document.getElementById("remove__slice");
const removeImgBtn = document.getElementById("remove__img");

removeSliceBtn.addEventListener("click", () => {
  const allSlices = document.querySelectorAll(".slice");
  if (allSlices.length > 3) {
    const lastSlice = allSlices[allSlices.length - 1];
    lastSlice.remove();
    updateWheelRotation();
  }
});

selectImgRemove = null;

removeImgBtn.addEventListener("click", () => {
  selectImgRemove = true;
  removeImgBtn.innerText = "Select slice image";
  removeImgBtn.style.background = "#bdc3c7";
  removeImgBtn.style.color = "black";
});

wheel.addEventListener("click", (e) => {
  const div = e.target.closest(".slice__img");
  if (!div) return;

  if (selectImg) {
    activeImg = div.querySelector(".images");
    changeButton.innerText = "Change image";
    changeButton.style.background = "#242ffa";
    changeButton.style.color = "white";
    fileInput.click();
    selectImg = false;
  }

  if (selectImgRemove === true) {
    const img = div.querySelector(".images");
    if (img) {
      img.src = "";
      const imgId = img.dataset.id;
      localStorage.removeItem(imgId);
      div.style.border = "";
      selectImgRemove = null;
    }
  }
  removeImgBtn.innerText = "Remove Image";
  removeImgBtn.style.background = "#242ffa";
  removeImgBtn.style.color = "white";
});
