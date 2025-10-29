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
  const randomDeg = Math.floor(Math.random() * 360) + 3600;
  curentDeg += randomDeg;
  wheel.style.transition = "transform 5s ease-out";
  wheel.style.transform = `rotate(${curentDeg}deg)`;
});

wheel.addEventListener("transitionend", () => {
  confettiImg.style.display = "flex";
  setTimeout(() => {
    confettiImg.style.display = "none";
  }, 1500);
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

      const div = activeImg.closest(".slice__img");
      const p = div.querySelector("p");
      if (p) p.style.display = "none"; 

      const imgId = activeImg.dataset.id;
      localStorage.setItem(imgId, e.target.result);
    };
    reader.readAsDataURL(file);
    saveWheelState();
  }
});


window.addEventListener("load", () => {
  updateWheelRotation();

  const name = localStorage.getItem("name");
  const email = localStorage.getItem("email");

  if (name && email) {
    form.style.display = "none";
    wheelContainer.style.display = "flex";
  } else {
    form.style.display = "flex";
    wheelContainer.style.display = "none";
  }

 
  const savedSlices = JSON.parse(localStorage.getItem("savedWheelSlices"));
  if (savedSlices && savedSlices.length > 0) {
    const allSlices = document.querySelectorAll(".slice__img img");
    allSlices.forEach((img, index) => {
      if (savedSlices[index]) {
        img.src = savedSlices[index];
        const p = img.closest(".slice__img").querySelector("p");
        if (p) p.style.display = "none";
      }
    });
  }
});


const modal = document.getElementById("winnerModal");
const winnerImage = document.getElementById("winnerImage");
const closeBtn = document.querySelector(".close");
const arrowDiv = document.querySelector(".arrow__div");

function showWinnerModal(imgSrc) {
  winnerImage.src = imgSrc;
  modal.style.display = "flex";
}


wheel.addEventListener("transitionend", () => {
  const slices = document.querySelectorAll(".slice__img img");
  const sliceCount = slices.length;
  const degPerSlice = 360 / sliceCount;
  const actualDeg = curentDeg % 360;
  const winnerIndex = Math.floor(360 - actualDeg / degPerSlice ) % sliceCount;
  const winnerImgSrc = slices[winnerIndex].src;
  showWinnerModal(winnerImgSrc)
});

closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
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
    }`
    const p = document.createElement("p");
    p.innerText = "Text"; 
    sliceImgDiv.appendChild(p);
    
    ;

  sliceImgDiv.appendChild(img);
  newSlice.appendChild(sliceImgDiv);
  wheel.appendChild(newSlice);

  updateWheelRotation();
  saveWheelState();
});

const addTextBtn = document.querySelector(".add__text__btn");
const font = document.getElementById("font");
const fontSize = document.getElementById("font__size");
let selectText = false;

addTextBtn.addEventListener("click", () => {
  selectText = true;
  addTextBtn.innerText = "Select Slice for Text";
  addTextBtn.style.background = "#bdc3c7";
  addTextBtn.style.color = "black";
});

wheel.addEventListener("click", (e) => {
  const div = e.target.closest(".slice__img");
  if (!div) return;

  if (selectText) {
    const img = div.querySelector("img");
    const p = div.querySelector("p");

    if (img) img.style.display = "none";

  if (p) {
    p.innerText = font.value;
    p.style.fontSize = fontSize.value + "px";
    p.style.display = "block"; // show it
  } else {
    const newP = document.createElement("p");
    newP.innerText = font.value;
    newP.style.fontSize = fontSize.value + "px";
    div.appendChild(newP);
    saveWheelState();
  }


    addTextBtn.innerText = "Add Text";
    addTextBtn.style.background = "#303030";
    addTextBtn.style.color = "white";
    selectText = false;
  }
});






const removeSliceBtn = document.getElementById("remove__slice");
const removeImgBtn = document.getElementById("remove__img");

removeSliceBtn.addEventListener("click", () => {
  const allSlices = document.querySelectorAll(".slice");
  if (allSlices.length > 3) {
    const lastSlice = allSlices[allSlices.length - 1];
    lastSlice.remove();
    updateWheelRotation();
    saveWheelState();
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
    changeButton.innerText = "Add image";
    changeButton.style.background = "#303030";
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
  removeImgBtn.style.background = "#303030";
  removeImgBtn.style.color = "white";
});

const colorPicker = document.getElementById("slice__color__change");
const changeSliceColor = document.getElementById("color__cng__btn");
const borderColor = document.getElementById("border_color");
const wBorder = document.querySelector(".w__border__px");
const sBorder = document.querySelector(".s__border__px");
const borderColorPicker = document.getElementById("border__color__change");
const sImgTop = document.getElementById("s__img__top");
const sImgLeft = document.getElementById("s_img__left");
const sImgWidth = document.getElementById("s__img__width");
const sImgHeigth = document.getElementById("s_img__heigth");
const editOptin = document.getElementById("edit__opiton");
const editSection = document.querySelector(".wheel__edit__section");
const editDone = document.querySelector(".edit__section__icon");

editOptin.addEventListener("click", () => {
  editSection.style.display = "flex";
  editOptin.style.display = "none";
});

editDone.addEventListener("click", () => {
  editSection.style.display = "none";
  editOptin.style.display = "block";
  
;
});






let activeSlice = null;
let selectSlice = false;

changeSliceColor.addEventListener("click", () => {
  selectSlice = true;
  changeSliceColor.innerText = "Select slice";
  changeSliceColor.style.background = "#bdc3c7";
  changeSliceColor.style.color = "black";
});

wheel.addEventListener("click", (e) => {
  const box = e.target.closest(".slice");
  if (!box) return;

  if (selectSlice) {
    activeSlice = box;
    colorPicker.click();
    selectSlice = false;
    changeSliceColor.innerText = "Change slice color";
    changeSliceColor.style.background = "#303030";
    changeSliceColor.style.color = "#FFF";
  }
});

colorPicker.addEventListener("input", () => {
  if (activeSlice) {
    activeSlice.style.background = colorPicker.value;
  }
});

borderColor.addEventListener("click", () => {
  borderColorPicker.click();
  borderColorPicker.addEventListener("input", () => {
    let color = borderColorPicker.value;
    console.log(color);
    spinBtn.style.background = color;
    wheel.style.border = `5px solid ${color}`;
    document.querySelectorAll(".slice").forEach((slice) => {
      slice.style.border = `2.5px solid ${color}`;
      saveWheelState();
    });
  });
});

wBorder.addEventListener("input", () => {
  let wPx = wBorder.value;
  wheel.style.border = `${wPx}px solid #242ffa`;
  saveWheelState();
});

sBorder.addEventListener("input", () => {
  let sPx = sBorder.value;
  document.querySelectorAll(".slice").forEach((slice) => {
    slice.style.border = `${sPx}px solid #242ffa`;
    saveWheelState();
  });
});

sImgTop.addEventListener("input", () => {
  let top = sImgTop.value;
  document.querySelectorAll(".slice__img").forEach((img) => {
    img.style.top = `${top}px`;
    saveWheelState();
  });
});
sImgLeft.addEventListener("input", () => {
  let left = sImgLeft.value;
  document.querySelectorAll(".slice__img").forEach((img) => {
    img.style.left = `${left}px`;
    saveWheelState();
  });
});
sImgWidth.addEventListener("input", () => {
  let width = sImgWidth.value;
  document.querySelectorAll(".slice__img").forEach((widths) => {
    widths.style.width = `${width}px`;
    saveWheelState();
  });
});
sImgHeigth.addEventListener("input", () => {
  let heigth = sImgHeigth.value;
  document.querySelectorAll(".slice__img ").forEach((heights) => {
    heights.style.height = `${heigth}px`;
    saveWheelState();
  });
});


function saveWheelState() {
  const slices = document.querySelectorAll(".slice");
  const wheelData = [];

  slices.forEach((slice, index) => {
    const img = slice.querySelector(".slice__img img");
    const text = slice.querySelector(".slice__img p");
    const bgColor = slice.style.background;

    wheelData.push({
      imgSrc: img ? img.src : "",
      text: text ? text.innerText : "",
      bgColor: bgColor || "",
    });
  });

  localStorage.setItem("wheelState", JSON.stringify(wheelData));
}

window.addEventListener("load", () => {
  updateWheelRotation();

  const savedState = JSON.parse(localStorage.getItem("wheelState"));
  if (savedState && savedState.length > 0) {
    wheel.innerHTML = "";

    savedState.forEach((sliceData, index) => {
      const newSlice = document.createElement("div");
      newSlice.classList.add("slice");
      newSlice.style.background = sliceData.bgColor;

      const sliceImgDiv = document.createElement("div");
      sliceImgDiv.classList.add("slice__img");

      const img = document.createElement("img");
      img.classList.add("images");
      img.src = sliceData.imgSrc || "";
      img.dataset.id = `slice${index + 1}`;

      const p = document.createElement("p");
      if (sliceData.text) {
        p.innerText = sliceData.text;
        sliceImgDiv.appendChild(p);
      }

      sliceImgDiv.appendChild(img);
      newSlice.appendChild(sliceImgDiv);
      wheel.appendChild(newSlice);
    });

    updateWheelRotation();
  }
});
