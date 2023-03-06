/**
 * Definición variables
 */
var renderPairs = ""; //Lista de pares que contiene: shape(ID de la forma), group(Grupo al que pertenece), UID(identificador usado para sketchfav)
var texturesIds = ""; //Lista con los ids de las texturas
const dataUrl =
  "https://vajillascorona.s3.sa-east-1.amazonaws.com/personalizador/recursos/json_pares.txt"; // Link con la informacion de sobre de los id de las texturas
// "/json_pares.txt";
var currentTextureUid = []; // Lista con los UID de las texturas actuales del modelo
var isShapeButtons = false; // Variable booleana que indica si los botones de formas ya fueron creados
var isTextureButtons = false; // Variable booleana que indica si los botones de textura ya fueron creados
var shapeGroupRef = "Platos"; // Grupo mostrad incialmente
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
      toogleTextureLoad (false);
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
const renderShapeButtons = (group, isFirstTime) => {
  const shapesButtons = document.getElementById("shapes-buttons");
  shapesButtons.classList.add("shapes-buttons");
  const matchingButtons = shapeButtonsPairs.filter(
    (buttonPair) => buttonPair.group == group
  );
  shapesButtons.innerHTML = "";
  matchingButtons.forEach((button, index) => {

    shapesButtons.appendChild(button.element);
  });
};
/**
 * Basado en la lista de grupos crea botones que permiten filtrar los botones de fomra
 */
const createGroupsButtons = () => {
  const shapesDiv = document.getElementById("shapes-groups");
  listOfGroups.forEach((group, index) => {
    const tempGroupButton = document.createElement("BUTTON");
    tempGroupButton.innerText = group;
    tempGroupButton.classList.add("group-button");
    if (index == 0) tempGroupButton.classList.add("active-goup");
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
const constructShapeButtons = (isFirstTime) => {
  renderPairs.forEach((shape, index) => {
    const tempShapeDiv = createTempDiv();
    tempShapeDiv.classList.add("shape-div");
    const tempShapeButton = createShapeButton(shape.shape);
    tempShapeDiv.appendChild(tempShapeButton);
    if (index == 0)
    activateShape(tempShapeButton);
    shapeButtonsPairs.push({ group: shape.group, element: tempShapeDiv });
  });
  renderShapeButtons(shapeGroupRef, isFirstTime);
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
    toogleTextureLoad (false);
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
  texturesIds.forEach((textureId, index) => {
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
  tempMessurmentImg.addEventListener("click", () =>
    openModal(tempMessurmentImg.src)
  );
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
      listOfGroups = [...newPairs.groups];
      renderPairs = [...newPairs.pairs];
      texturesIds = [...newPairs.texturesIds];
      if (!isShapeButtons) constructShapeButtons(true);
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
        toogleTextureLoad (true);
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
                  toogleTextureLoad (true);
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
      quantity: 24,
    };
    likedPairs = [...likedPairs, likedPair];
    liked = true;
  }
  fillLiked();
  fillForm();
  changeIcon();
};

var likedCards = document.querySelector(".liked-cards");
var newElement = document.querySelector(".liked-card").cloneNode(true);
likedCards.innerHTML = "";
const fillLiked = () => {
  likedCards.innerHTML = "";
  likedPairs.forEach((pair, index) => {
    let element = newElement.cloneNode(true);
    element.querySelector(".codigo-forma").innerText = pair.shape;
    element.querySelector(".codig-textura").innerText = pair.texture;
    element.querySelector(".texto-medidas").innerText = renderPairs.find(
      (shape) => shape.shape === pair.shape
    ).messurments;
    element.querySelector(".w-input").value = pair.quantity;
    element.querySelector(".w-input").addEventListener("input", function (evt) {
      inputCantidad(
        Number(this.value),
        index,
        element.querySelector(".w-input")
      );
    });
    element.querySelector(
      ".image-40"
    ).srcset = `https://vajillascorona.s3.sa-east-1.amazonaws.com/personalizador/recursos/recursos_formas/${pair.shape}.png`;
    element
      .querySelector(".decrese")
      .addEventListener("click", () =>
        changeCantidad(-1, index, element.querySelector(".w-input"))
      );
    element
      .querySelector(".increse")
      .addEventListener("click", () =>
        changeCantidad(1, index, element.querySelector(".w-input"))
      );
    likedCards.appendChild(element);
  });
};

const fillForm = () => {
  let likedForm = document.querySelector(".liked-list");
  likedForm.value = "";
  likedPairs.forEach((pair) => {
    likedForm.value =
      likedForm.value +
      `For:${pair.shape} Tex:${pair.texture} Can:${pair.quantity},\n`;
  });
};

const inputCantidad = (number, pair, element) => {
  likedPairs[pair].quantity = number;
  if (likedPairs[pair].quantity < 24) {
    if (confirm("Estás a punto de descartar la pieza\n ¿estás seguro?")) {
      likedPairs.splice(pair, 1);
      checkLiked();
      fillLiked();
      fillForm();
    } else {
      likedPairs[pair].quantity = likedPairs[pair].quantity - number;
    }
  } else {
    element.value = likedPairs[pair].quantity;
    fillForm();
  }
};

const changeCantidad = (number, pair, element) => {
  likedPairs[pair].quantity = likedPairs[pair].quantity + number;
  if (likedPairs[pair].quantity < 1) {
    if (confirm("Estás a punto de descartar la pieza\n ¿estás seguro?")) {
      likedPairs.splice(pair, 1);
      checkLiked();
      fillLiked();
      fillForm();
    } else {
      likedPairs[pair].quantity = likedPairs[pair].quantity - number;
    }
  } else {
    element.value = likedPairs[pair].quantity;
    fillForm();
  }
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
  let likeButton = document.querySelector(".heart-button");
  if (liked) {
    likeButton.src =
      "https://uploads-ssl.webflow.com/63d28e442de3a6220d413f4a/6400d4f43969541c21f5a82e_hearth_filled.svg";
  } else {
    likeButton.src =
      "https://assets.website-files.com/63d28e442de3a6220d413f4a/63f3cbefa7086e1913c53bbd_heart_plus.svg";
  }
}

document
  .querySelector(".heart-button")
  .addEventListener("click", () => likeClicked());

const closeModal = () => {
  document.querySelector(".modal-container").style.display = "none";
};

const openModal = (src) => {
  let modalImage = document.querySelector(".modal-container");
  let additionalInformation = document.querySelector(".additional-information");
  additionalInformation.src = src;
  modalImage.style.display = "block";
};
const toogleTextureLoad = (toogle) =>{
  if(toogle)document.querySelector(".texture-buttons").style.pointerEvents = "auto";
  else document.querySelector(".texture-buttons").style.pointerEvents = "none";
}
