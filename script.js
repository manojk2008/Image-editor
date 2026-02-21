let filters = {
    brightness: {
        value: 100,
        min: 0,
        max:  200,
        unit: "%"
    },
    contrast: {
        value: 100,
        min: 0,
        max:  200,
        unit: "%"
    },
    saturation: {
        value: 100,
        min: 0,
        max:  200,
        unit: "%"
    },
    hueRotation : {
        value: 0,
        min: 0,
        max:  360,
        unit: "deg"
    },
    blur: {
        value: 0,
        min: 0,
        max:  20,
        unit: "px"
    },
    grayscale: {
        value: 0,
        min: 0,
        max:  100,
        unit: "%"
    },
    sepia: {
        value: 0,
        min: 0,
        max:  100,
        unit: "%"
    } ,
    opacity: {
        value: 100,
        min: 0,
        max:  100,
        unit: "%"
    },
    invert:  {
        value: 0,
        min: 0,
        max:  100,
        unit: "%"
    },
}

const imageCanvas = document.querySelector("#image-canvas")
const imgInput = document.querySelector("#image-input")
const canvasCtx = imageCanvas.getContext("2d")
const exportBtn = document.querySelector("#export-btn")

let file = null;
let img = null;
let rotation = 0;
let flipX = 1;
let flipY = 1;

const filterscontainer = document.querySelector(".filters")


function createFilterElement(name, unit = "%", value, min, max){

    const div = document.createElement("div");
    div.classList.add("filter")

    const input = document.createElement("input")
    input.type = "range"
    input.min = min
    input.max = max
    input.value = value
    input.id = name

    const p = document.createElement("p")
    p.innerText = name

    div.appendChild(p)
    div.appendChild(input)


    input.addEventListener("input", (event) => {
        filters[ name ].value = input.value
        applyFilters()

        
    })

    return div;
}

Object.keys(filters).forEach(keys => {

    const filterElement = createFilterElement(keys, filters[keys].unit, filters[keys].value, filters[keys].min, filters[keys].max)
    
    filterscontainer.appendChild(filterElement)

})

const presets = [
  { name: "Vintage", values: { sepia: 60, contrast: 120 } },
  { name: "B&W", values: { grayscale: 100 } },
  { name: "Cool", values: { hueRotation: 180, saturation: 120 } },
  { name: "Warm", values: { hueRotation: 20, saturation: 130 } }
];

presets.forEach(preset => {
  const btn = document.createElement("button");
  btn.className = "btn";
  btn.innerText = preset.name;

  btn.onclick = () => {
    Object.keys(preset.values).forEach(key => {
      filters[key].value = preset.values[key];
      const slider = document.getElementById(key);
      if (slider) slider.value = preset.values[key];
    });
    applyFilters();
  };

  filterscontainer.appendChild(btn);
});


imgInput.addEventListener("change", (event) => {

     file = event.target.files[ 0 ]
    const imageplaceholder = document.querySelector(".placeholder")
    imageCanvas.style.display = "block"
    imageplaceholder.style.display = "none"


    img = new Image();
    img.src = URL.createObjectURL(file)

    img.onload = () => {

      const maxW = window.innerWidth * 0.9;
      const maxH = window.innerHeight * 0.6;


        imageCanvas.width = img.width
        imageCanvas.height = img.height
        applyFilters();
    }


})


// function applyFilters() {
//   if (!img) return; // 🔥 prevents crash

//   canvasCtx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);

//   canvasCtx.filter = `
//     brightness(${filters.brightness.value}${filters.brightness.unit})
//     contrast(${filters.contrast.value}${filters.contrast.unit})
//     saturate(${filters.saturation.value}${filters.saturation.unit})
//     hue-rotate(${filters.hueRotation.value}${filters.hueRotation.unit})
//     blur(${filters.blur.value}${filters.blur.unit})
//     grayscale(${filters.grayscale.value}${filters.grayscale.unit})
//     sepia(${filters.sepia.value}${filters.sepia.unit})
//     opacity(${filters.opacity.value}${filters.opacity.unit})
//     invert(${filters.invert.value}${filters.invert.unit})
//   `.trim();


//     canvasCtx.filter = filterString;

//   canvasCtx.drawImage(img, 0, 0, imageCanvas.width, imageCanvas.height);

//   canvasCtx.filter = "none";
// }


function applyFilters() {
  if (!img) return;

  const filterString = `
    brightness(${filters.brightness.value}%)
    contrast(${filters.contrast.value}%)
    saturate(${filters.saturation.value}%)
    hue-rotate(${filters.hueRotation.value}deg)
    blur(${filters.blur.value}px)
    grayscale(${filters.grayscale.value}%)
    sepia(${filters.sepia.value}%)
    opacity(${filters.opacity.value}%)
    invert(${filters.invert.value}%)
  `.replace(/\s+/g, " ");

  canvasCtx.save();

  canvasCtx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);

  // 🔥 center transform (PRO)
  canvasCtx.translate(imageCanvas.width / 2, imageCanvas.height / 2);
  canvasCtx.rotate((rotation * Math.PI) / 180);
  canvasCtx.scale(flipX, flipY);

  canvasCtx.filter = filterString;

  canvasCtx.drawImage(
    img,
    -imageCanvas.width / 2,
    -imageCanvas.height / 2,
    imageCanvas.width,
    imageCanvas.height
  );

  canvasCtx.restore();
}


document.querySelector("#rotate-left").onclick = () => {
  rotation -= 90;
  applyFilters();
};

document.querySelector("#rotate-right").onclick = () => {
  rotation += 90;
  applyFilters();
};

document.querySelector("#flip-x").onclick = () => {
  flipX *= -1;
  applyFilters();
};

document.querySelector("#flip-y").onclick = () => {
  flipY *= -1;
  applyFilters();
};




document.querySelector("#reset-btn").addEventListener("click", () => {
  Object.keys(filters).forEach(key => {
    filters[key].value =
      key === "brightness" ||
      key === "contrast" ||
      key === "saturation" ||
      key === "opacity"
        ? 100
        : 0;
  });

  document.querySelectorAll(".filter input").forEach(input => {
    input.value = filters[input.id].value;
  });

  applyFilters();
});



// resetButton.addEventListener("click", () => {
//     filters = {
//     brightness: {
//         value: 100,
//         min: 0,
//         max:  200,
//         unit: "%"
//     },
//     contrast: {
//         value: 100,
//         min: 0,
//         max:  200,
//         unit: "%"
//     },
//     saturation: {
//         value: 100,
//         min: 0,
//         max:  200,
//         unit: "%"
//     },
//     hueRotation : {
//         value: 0,
//         min: 0,
//         max:  360,
//         unit: "deg"
//     },
//     blur: {
//         value: 0,
//         min: 0,
//         max:  20,
//         unit: "px"
//     },
//     grayscale: {
//         value: 0,
//         min: 0,
//         max:  100,
//         unit: "%"
//     },
//     sepia: {
//         value: 0,
//         min: 0,
//         max:  100,
//         unit: "%"
//     } ,
//     opacity: {
//         value: 100,
//         min: 0,
//         max:  100,
//         unit: "%"
//     },
//     invert:  {
//         value: 0,
//         min: 0,
//         max:  100,
//         unit: "%"
//     },
// }
//  applyFilters()
// })

exportBtn.addEventListener("click", () =>{
    if(!img) return;


    const link = document.createElement("a");
link.download = "edited-image.png";
link.href = imageCanvas.toDataURL;
link.click();
})

