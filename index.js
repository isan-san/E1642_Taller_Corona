/**
 * Definición variables
 */
var renderPairs = ""; //Lista de pares que contiene: shape(ID de la forma), group(Grupo al que pertenece), UID(identificador usado para sketchfav)
var texturesIds = ""; //Lista con los ids de las texturas
const dataUrl =
  // "https://vajillascorona.s3.sa-east-1.amazonaws.com/personalizador/recursos/json_pares.txt"; // Link con la informacion de sobre de los id de las texturas
  "/json_pares.txt";
var currentTextureUid = []; // Lista con los UID de las texturas actuales del modelo
var isShapeButtons = false; // Variable booleana que indica si los botones de formas ya fueron creados
var isTextureButtons = false; // Variable booleana que indica si los botones de textura ya fueron creados
var shapeGroupRef = "Bandejas"; // Grupo mostrad incialmente
var shapeNameRef = "7128"; // Id del modelo inicial
var textureNameRef = "000"; // Id de la textura inicial
var shapeMessurmentsRef = "13cmx12cm"; // Id del modelo inicial
var likedPairs = [];
var liked = false;
var uIdRef = ""; // UID del modelo que esta siendo mostrado
var width = window.innerWidth;
console.log(width);
var model;
if (width < 480) {
  model = document.getElementById("web-model-mobile");
} else {
  model = document.getElementById("web-model");
}
// Elemento HTML que contiene al modelo
var updateTextureFunction; //Funcion definida durante la carga del cliente usada para actializar los modelos
loadClient("19c542ed76f74e8c8b7a2ca28291128a"); // Inicializacion del modelo
var listOfGroups = []; //Lista de grupos disponibles
var shapeButtonsPairs = []; // Lista de objetos que incluyen grupo y un boton HTML
var isGroupButtons = false; // variable booleana que indica si ya se crearon los botones de grupos
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//Definicion funciones
/**
 * Ingresa el codigo de la forma. a partir de este filtra en la lista de objetos de forma el contiene este codigo.
 * Asigna a la variable shapeNameRef este objeto para más adelante usar su UID
 * @param {String que representa el codigo de la forma} shape
 */
const setShapeNameRef = (shapeId) => {
  if (shapeId) {
    shapeNameRef = shapeId;
    const tempRenderPair = renderPairs.filter(
      (pair) => pair.shape == shapeNameRef
    );
    if (tempRenderPair[0]) {
      setSrc(tempRenderPair);
      loadTitles();
      reloadClient(tempRenderPair);
    }
  }
};
/**
 * Ingresa un objeto de la lista de pares desde el que se extrae el UID para actualizar el SRC del la etiqueta <iframe> en el html
 * @param {Objeto de la lista de pares} tempRenderPair
 */
const setSrc = (tempRenderPair) => {
  if (tempRenderPair[0].UID) {
    model.src = `https://sketchfab.com/models/${tempRenderPair[0].UID}/embed?autostart=1`;
    shapeGroupRef = tempRenderPair[0].group;
    shapeMessurmentsRef = tempRenderPair[0].messurments;
    textureNameRef = "000";
    createOtherMedia(0);
    checkLiked();
  } else {
    throw "Unable to set new model source";
  }
};
/**
 * Ingresa un objeto de la lista de pares desde el cual se extrae el UID y se usa para
 * recargar el cliente del API usado en la comunicacion con Skethfav
 * @param {Objeto de la lista de pares} tempRenderPair
 */
const reloadClient = (tempRenderPair) => {
  if (tempRenderPair[0].UID) {
    uIdRef = tempRenderPair[0].UID;
    const modelCanvas = document.getElementById("model-canvas");
    loadClient(uIdRef);
  } else {
    throw "Unable to reload client";
  }
};
/**
 * Re carga los titulos a partir de las variables de referencia
 */
const loadTitles = () => {
  document
    .querySelectorAll(".shape-name")
    .forEach((title) => (title.innerText = shapeNameRef));
  document
    .querySelectorAll(".texture-name")
    .forEach((title) => (title.innerText = textureNameRef));
  document
    .querySelectorAll(".group-name")
    .forEach((title) => (title.innerText = shapeGroupRef));
  document
    .querySelectorAll(".messurments-name")
    .forEach((title) => (title.innerText = shapeMessurmentsRef));
  checkLiked();
};
/**
 * Crea una etiqueta HTML div para contener los botones tanto de forma como de textura
 * @returns Etiqueta div con los estilos listados en el metooo
 */
const createTempDiv = () => {
  const tempDiv = document.createElement("DIV");
  tempDiv.classList.add("image-holder");
  return tempDiv;
};
/**
 * Crea y retorn aun boton, le da de fondo una imagen que extrae desde AWS y los estilos listados en el metodo
 * @param {Id de un objeto de la lista de pares usado para referenciar una imagen en AWS} shapeId
 * @returns Un boton con la imagen de una forma y los estilos listados en el metodo
 */
const createShapeButton = (shapeId) => {
  const tempShapeButton = document.createElement("BUTTON");
  tempShapeButton.classList.add("shape-button");
  const buttonBGImage = document.createElement("IMG");
  buttonBGImage.classList.add("button-image");
  buttonBGImage.src = `https://vajillascorona.s3.sa-east-1.amazonaws.com/personalizador/recursos/recursos_formas/${shapeId}.png`;
  tempShapeButton.onclick = () => {
    activateShape(tempShapeButton);
    setShapeNameRef(shapeId);
  };
  tempShapeButton.appendChild(buttonBGImage);
  return tempShapeButton;
};
const activateGroup = (groupButton) => {
  document
    .querySelectorAll(".shape-button")
    .forEach((button) => button.classList.remove("active-shape"));
  document
    .querySelectorAll(".group-button")
    .forEach((button) => button.classList.remove("active-goup"));
  groupButton.classList.add("active-goup");
};
const activateShape = (tempShapeButton) => {
  document
    .querySelectorAll(".shape-button")
    .forEach((button) => button.classList.remove("active-shape"));
  document
    .querySelectorAll(".texture-button")
    .forEach((button) => button.classList.remove("active-texture"));
  tempShapeButton.classList.add("active-shape");
};
const activateTextures = (tempTextureButton) => {
  document
    .querySelectorAll(".texture-button")
    .forEach((button) => button.classList.remove("active-texture"));
  tempTextureButton.classList.add("active-texture");
};
/**
 * Filtra de la lista de botones de formas los que coinciden con el grupo del parametro y los inyecta en el div de los botones de formas
 * @param {Grupo usado para flitrar en la lista de botones de formas} group
 */
const renderShapeButtons = (group) => {
  const shapesButtons = document.getElementById("shapes-buttons");
  shapesButtons.classList.add("shapes-buttons");
  const matchingButtons = shapeButtonsPairs.filter(
    (buttonPair) => buttonPair.group == group
  );
  shapesButtons.innerHTML = "";
  matchingButtons.forEach((button) => {
    shapesButtons.appendChild(button.element);
  });
};
/**
 * Basado en la lista de grupos crea botones que permiten filtrar los botones de fomra
 */
const createGroupsButtons = () => {
  const shapesDiv = document.getElementById("shapes-groups");
  listOfGroups.forEach((group) => {
    const tempGroupButton = document.createElement("BUTTON");
    tempGroupButton.innerText = group;
    tempGroupButton.classList.add("group-button");
    tempGroupButton.onclick = () => {
      if (!tempGroupButton.classList.contains("active-goup")) {
        activateGroup(tempGroupButton);
        renderShapeButtons(group);
      }
    };
    shapesDiv.appendChild(tempGroupButton);
  });
  isGroupButtons = true;
};
/**
 * Usando la lista de pares como base construye los botones que permiten seleccionar los modelos y los inyecta en una etiqueta DIV
 */
const constructShapeButtons = () => {
  renderPairs.forEach((shape) => {
    const tempShapeDiv = createTempDiv();
    tempShapeDiv.classList.add("shape-div");
    const tempShapeButton = createShapeButton(shape.shape);
    tempShapeDiv.appendChild(tempShapeButton);
    shapeButtonsPairs.push({ group: shape.group, element: tempShapeDiv });
  });
  renderShapeButtons(shapeGroupRef);
  isShapeButtons = true;
};
/**
 * Crea y retorn aun boton, le da de fondo una imagen que extrae desde AWS y los estilos listados en el metodo
 * @param {Id de una textura de la lista de texturas usado para referenciar una imagen en AWS} shapeId
 * @returns Un boton con la imagen de una forma y los estilos listados en el metodo
 */
createTextureButton = (textureId) => {
  const tempTextureButton = document.createElement("BUTTON");
  tempTextureButton.classList.add("texture-button");
  tempTextureButton.style.backgroundImage = `url('https://vajillascorona.s3.sa-east-1.amazonaws.com/personalizador/recursos/iconos_texturas/${textureId}.jpg')`;
  tempTextureButton.onclick = () => {
    activateTextures(tempTextureButton);
    updateTextureFunction(textureId);
  };
  return tempTextureButton;
};
/**
 * Usando la lista de texturas como base construye los botones que permiten seleccionar los modelos y los inyecta en una etiqueta DIV
 */
const constructTextureButtons = () => {
  let texturesButtons = document.getElementById("texture-buttons");
  texturesButtons.innerHTML = "";
  texturesIds.forEach((textureId) => {
    const tempTextureDiv = createTempDiv();
    const tempTextureButton = createTextureButton(textureId);
    tempTextureDiv.appendChild(tempTextureButton);
    texturesButtons.appendChild(tempTextureDiv);
  });
  isTextureButtons = true;
};
/**
 *
 * @param {*} index
 */
const createOtherMedia = (index) => {
  const contextImages = document.getElementById("context-images");
  contextImages.innerHTML = "";
  const messurmentImages = document.getElementById("messurment-images");
  messurmentImages.innerHTML = "";
  const tempContextImg = document.createElement("IMG");
  tempContextImg.classList.add("context-images");
  const tempMessurmentImg = document.createElement("IMG");
  tempMessurmentImg.classList.add("messurment-images");
  tempContextImg.src = `https://vajillascorona.s3.sa-east-1.amazonaws.com/personalizador/recursos/recursos_formas/${shapeNameRef}_context${index}.jpg`;
  tempMessurmentImg.src = `https://vajillascorona.s3.sa-east-1.amazonaws.com/personalizador/recursos/recursos_formas/${shapeNameRef}_messurment${index}.jpg`;
  tempContextImg.addEventListener("click", () => openModal(tempContextImg.src));
  tempMessurmentImg.addEventListener("click", () => openModal(tempMessurmentImg.src));
  const tempContextDiv = createTempDiv();
  tempContextDiv.classList.add("other-media-div");
  tempContextDiv.appendChild(tempContextImg);
  const tempMessurmentDIV = createTempDiv();
  tempMessurmentDIV.classList.add("other-media-div");
  tempMessurmentDIV.appendChild(tempMessurmentImg);
  contextImages.appendChild(tempContextDiv);
  messurmentImages.appendChild(tempMessurmentDIV);
};
/**
 *
 */
// for (let index = 0; index < 3; index++) {
//   const contextButton = document.getElementById(`set-context-image-${index}`);
//   contextButton.onclick = () => {
//     document.getElementById(
//       "context-image"
//     ).src = `https://vajillascorona.s3.sa-east-1.amazonaws.com/personalizador/recursos/recursos_formas/${shapeNameRef}_context${index}.png`;
//     for (let index2 = 0; index2 < 3; index2++) {
//       document.getElementById(
//         `set-context-image-${index2}`
//       ).style.backgroundColor = "#c9c9c9";
//     }
//     contextButton.style.backgroundColor = "#332b17";
//   };
//   const messurmentButton = document.getElementById(
//     `set-messurment-image-${index}`
//   );
//   messurmentButton.onclick = () => {
//     document.getElementById(
//       "messurment-image"
//     ).src = `https://vajillascorona.s3.sa-east-1.amazonaws.com/personalizador/recursos/recursos_formas/${shapeNameRef}_messurment${index}.png`;
//     for (let index2 = 0; index2 < 3; index2++) {
//       document.getElementById(
//         `set-messurment-image-${index2}`
//       ).style.backgroundColor = "#c9c9c9";
//     }
//     messurmentButton.style.backgroundColor = "#332b17";
//   };
// }
/**
 * Usando un URL extrae un documento TXT desde AWS que usa para definir la lista de pares y la lista de texturas
 * @param {Link a TXT con la informacion sobre modelos y texturas}
 */
const getData = () => {
  fetch(dataUrl)
    .then((r) => r.text())
    .then((t) => {
      const newPairs = JSON.parse(t);
      listOfGroups = newPairs.groups;
      renderPairs = newPairs.pairs;
      texturesIds = newPairs.texturesIds;
      if (!isShapeButtons) constructShapeButtons();
      if (!isTextureButtons) constructTextureButtons();
      if (!isGroupButtons) createGroupsButtons();
      shapeNameRef = renderPairs[0].shape;
      shapeGroupRef = renderPairs[0].group;
      shapeMessurmentsRef = renderPairs[0].messurments;
      loadTitles();
    });
};
// Model Control ---------------------------------------------------------------------------------------
function loadClient(uIdRef) {
  var version = "1.12.1";
  var client = new Sketchfab(version, model);
  var uid = uIdRef;
  let success = function success(api) {
    api.start(() => {
      api.addEventListener("viewerready", function () {
        model.style.opacity = "100%";
        createOtherMedia(0);
        if (!isShapeButtons && !isTextureButtons && !isGroupButtons) getData();
        api.getTextureList(function (err, materials) {
          if (!err) {
            const materialsList = [...materials];
            let orderdMaterials = [];
            materialsList.forEach((material) => {
              if (material.name.includes("_COL")) {
                orderdMaterials[0] = material;
              } else if (material.name.includes("_ROU")) {
                orderdMaterials[1] = material;
              } else if (material.name.includes("_NRM")) {
                orderdMaterials[2] = material;
              } else {
                orderdMaterials[3] = material;
              }
            });
            currentTextureUid = orderdMaterials.map((material) => material.uid);
          }
        });
        updateTextureFunction = (textureId) => {
          const textureNames = ["COL", "ROU", "NRM"];
          let loaded = false;
          for (let i = 0; i < 3; i++) {
            api.updateTexture(
              `https://vajillascorona.s3.sa-east-1.amazonaws.com/personalizador/texturas/${shapeNameRef}/${shapeNameRef}_${textureId}_${textureNames[i]}.jpg`,
              currentTextureUid[i],
              function (err, textureUid) {
                textureNameRef = textureId;
                if (!loaded) {
                  loaded = true;
                  loadTitles();
                }
              }
            );
          }
        };
      });
    });
  };
  /**
   * Inicializa el cliente del API de Sketchfav
   */
  client.init(uid, {
    success: success,
    error: function onError() {
      console.log("Viewer error");
    },
    ui_watermark: 0,
    ui_controls: 0,
    ui_loading: 0,
    ui_inspector: 0,
    ui_infos: 0,
    ui_general_controls: 0,
    ui_stop: 0,
    ui_fullscreen: 0,
    dnt: 0,
    ui_start: 0,
  });
}

const likeClicked = () => {
  let pairIndex;
  let foundPair = likedPairs.find((pair, index) => {
    pairIndex = index;
    return pair.shape == shapeNameRef && pair.texture == textureNameRef;
  });
  if (foundPair) {
    likedPairs.splice(pairIndex, 1);
    liked = false;
  } else {
    let likedPair = {
      shape: shapeNameRef,
      texture: textureNameRef,
    };
    likedPairs = [...likedPairs, likedPair];
    liked = true;
  }
  fillLiked();
  changeIcon();
};

const fillLiked = () => {
  let likedCards = document.querySelector(".liked-cards");
  let likedForm = document.querySelector(".liked-list");
  likedCards.innerHTML = "";
  likedForm.value = "";
  likedPairs.forEach((pair, index) => {
    let element = `<div class="likedCard"><h4>${index}. Liked pair</h4><div><p class="text-button">Forma: ${pair.shape} Texture: ${pair.texture}</p></div></div>`;
    likedCards.innerHTML = likedCards.innerHTML + element;
    likedForm.value =
      likedForm.value + `For:${pair.shape} Tex:${pair.texture},\n`;
  });
};

const checkLiked = () => {
  let foundPair = likedPairs.find(
    (pair) => pair.shape == shapeNameRef && pair.texture == textureNameRef
  );
  if (foundPair) {
    liked = true;
  } else {
    liked = false;
  }
  changeIcon();
};

function changeIcon() {
  let likeButton = document.querySelector(".like-button");
  if (liked) {
    likeButton.innerHTML =
      '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><mask id="mask0_835_7779" style="mask-type:alpha"maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><rect width="24" height="24" fill="#D9D9D9"/></mask><g mask="url(#mask0_835_7779)"><path d="M12 21.35L10.55 20.05C8.86667 18.5333 7.475 17.225 6.375 16.125C5.275 15.025 4.4 14.0373 3.75 13.162C3.1 12.2873 2.646 11.4833 2.388 10.75C2.12933 10.0167 2 9.26667 2 8.5C2 6.93333 2.525 5.625 3.575 4.575C4.625 3.525 5.93333 3 7.5 3C8.36667 3 9.19167 3.18333 9.975 3.55C10.7583 3.91667 11.4333 4.43333 12 5.1C12.5667 4.43333 13.2417 3.91667 14.025 3.55C14.8083 3.18333 15.6333 3 16.5 3C18.0667 3 19.375 3.525 20.425 4.575C21.475 5.625 22 6.93333 22 8.5C22 9.26667 21.871 10.0167 21.613 10.75C21.3543 11.4833 20.9 12.2873 20.25 13.162C19.6 14.0373 18.725 15.025 17.625 16.125C16.525 17.225 15.1333 18.5333 13.45 20.05L12 21.35ZM12 18.65C13.6 17.2167 14.9167 15.9873 15.95 14.962C16.9833 13.9373 17.8 13.046 18.4 12.288C19 11.5293 19.4167 10.854 19.65 10.262C19.8833 9.67067 20 9.08333 20 8.5C20 7.5 19.6667 6.66667 19 6C18.3333 5.33333 17.5 5 16.5 5C15.7167 5 14.9917 5.22067 14.325 5.662C13.6583 6.104 13 6.85 12.5 7.3501H11.5C11 6.85 10.3417 6.104 9.675 5.662C9.00833 5.22067 8.28333 5 7.5 5C6.5 5 5.66667 5.33333 5 6C4.33333 6.66667 4 7.5 4 8.5C4 9.08333 4.11667 9.67067 4.35 10.262C4.58333 10.854 5 11.5293 5.6 12.288C6.2 13.046 7.01667 13.9373 8.05 14.962C9.08333 15.9873 10.4 17.2167 12 18.65Z" fill="#332B17"/><path d="M12 18.65C13.6 17.2167 14.9167 15.9873 15.95 14.962C16.9833 13.9373 17.8 13.046 18.4 12.288C19 11.5293 19.4167 10.854 19.65 10.262C19.8833 9.67067 20 9.08333 20 8.5C20 7.5 19.6667 6.66667 19 6C18.3333 5.33333 17.5 5 16.5 5C15.7167 5 14.9917 5.22067 14.325 5.662C13.6583 6.104 13 6.85 12.5 7.3501H11.5C11 6.85 10.3417 6.104 9.675 5.662C9.00833 5.22067 8.28333 5 7.5 5C6.5 5 5.66667 5.33333 5 6C4.33333 6.66667 4 7.5 4 8.5C4 9.08333 4.11667 9.67067 4.35 10.262C4.58333 10.854 5 11.5293 5.6 12.288C6.2 13.046 7.01667 13.9373 8.05 14.962C9.08333 15.9873 10.4 17.2167 12 18.65Z" fill="#332B17"/></g></svg>';
  } else {
    likeButton.innerHTML =
      '<svg width="24" height="24" viewBox="0 0 24 24"fill="none"xmlns="http://www.w3.org/2000/svg"><mask id="mask0_835_7773" style="mask-type:alpha"maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><rect width="24" height="24"fill="#D9D9D9"/></mask><g mask="url(#mask0_835_7773)"><path d="M12 21L8.825 18.15C7.625 17.0667 6.596 16.1 5.738 15.25C4.87933 14.4 4.171 13.6 3.613 12.85C3.05433 12.1 2.646 11.375 2.388 10.675C2.12933 9.975 2 9.24167 2 8.475C2 6.90833 2.525 5.604 3.575 4.562C4.625 3.52067 5.93333 3 7.5 3C8.36667 3 9.19167 3.18333 9.975 3.55C10.7583 3.91667 11.4333 4.43333 12 5.1C12.5667 4.43333 13.2417 3.91667 14.025 3.55C14.8083 3.18333 15.6333 3 16.5 3C17.85 3 18.9833 3.379 19.9 4.137C20.8167 4.89567 21.4417 5.85 21.775 7H19.65C19.35 6.33333 18.9083 5.83333 18.325 5.5C17.7417 5.16667 17.1333 5 16.5 5C15.65 5 14.9167 5.22933 14.3 5.688C13.6833 6.146 13.1083 6.75 12.575 7.5H11.425C10.9083 6.75 10.321 6.146 9.663 5.688C9.00433 5.22933 8.28333 5 7.5 5C6.55 5 5.729 5.329 5.037 5.987C4.34567 6.64567 4 7.475 4 8.475C4 9.025 4.11667 9.58333 4.35 10.15C4.58333 10.7167 5 11.371 5.6 12.113C6.2 12.8543 7.01667 13.7207 8.05 14.712C9.08333 15.704 10.4 16.9 12 18.3C12.4333 17.9167 12.9417 17.475 13.525 16.975C14.1083 16.475 14.575 16.0583 14.925 15.725L15.15 15.95L15.637 16.438L16.125 16.925L16.35 17.15C15.9833 17.4833 15.5167 17.8957 14.95 18.387C14.3833 18.879 13.8833 19.3167 13.45 19.7L12 21ZM19 17V14H16V12H19V9H21V12H24V14H21V17H19Z" fill="#332B17"/></g></svg>';
  }
}

const closeModal = () => {
  document.querySelector(".modal-container").style.display = "none";
};

const openModal = (src) => {
  let modalImage = document.querySelector(".modal-container");
  let additionalInformation = document.querySelector(".additional-information");
  additionalInformation.src = src;
  modalImage.style.display = "block";
};
