/**
 * Definición variables
 */
var renderPairs = ""; //Lista de pares que contiene: shape(ID de la forma), group(Grupo al que pertenece), UID(identificador usado para sketchfav)
var texturesIds = ""; //Lista con los ids de las texturas
const dataUrl =
  "https://vajillascorona.s3.sa-east-1.amazonaws.com/personalizador/recursos/json_pares.txt"; // Link con la informacion de sobre de los id de las texturas
var currentTextureUid = []; // Lista con los UID de las texturas actuales del modelo
var isShapeButtons = false; // Variable booleana que indica si los botones de formas ya fueron creados
var isTextureButtons = false; // Variable booleana que indica si los botones de textura ya fueron creados
var shapeNameRef = "5264"; // Id del modelo inicial
var textureNameRef = "937"; // Id de la textura inicial
var uIdRef = ""; // UID del modelo que esta siendo mostrado
const model = document.getElementById("web-model"); // Elemento HTML que contiene al modelo
var updateTextureFunction; //Funcion definida durante la carga del cliente usada para actializar los modelos
loadClient("f83ea6822eb443bc9a38f3e7f3508eb3"); // Inicializacion del modelo
var listOfGroups = ["otros", "bowls", "platos", "vasos", "bandejas", "tazas"]; //Lista de grupos disponibles
var shapeGroupRef = "vasos"; // Grupo mostrad incialmente
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
  shapeNameRef = shapeId;
  if (shapeNameRef) {
    const tempRenderPair = renderPairs.filter(
      (pair) => pair.shape == shapeNameRef
    );
    if (tempRenderPair[0]) {
      loadTitles();
      setSrc(tempRenderPair);
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
    createOtherMedia(0);
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
    modelCanvas.style.display = "none";
    modelCanvas.style.display = "block";
    loadClient(uIdRef);
  } else {
    throw "Unable to reload client";
  }
};
/**
 * Re carga los titulos a partir de las variables de referencia
 */
const loadTitles = () => {
  const shapeTitle = document.getElementById("shape-name");
  shapeTitle.innerText = shapeNameRef;
};
/**
 * Crea una etiqueta HTML div para contener los botones tanto de forma como de textura
 * @returns Etiqueta div con los estilos listados en el metooo
 */
const createTempDiv = () => {
  const tempDiv = document.createElement("DIV");
  tempDiv.style.display = "flex";
  tempDiv.style.flexDirection = "column";
  tempDiv.style.justifyContent = "center";
  tempDiv.style.alignItems = "center";
  return tempDiv;
};
/**
 * Crea y retorn aun boton, le da de fondo una imagen que extrae desde AWS y los estilos listados en el metodo
 * @param {Id de un objeto de la lista de pares usado para referenciar una imagen en AWS} shapeId
 * @returns Un boton con la imagen de una forma y los estilos listados en el metodo
 */
const createShapeButton = (shapeId) => {
  const tempShapeButton = document.createElement("BUTTON");
  tempShapeButton.style.backgroundImage = `url('https://vajillascorona.s3.sa-east-1.amazonaws.com/personalizador/recursos/recursos_formas/${shapeId}.png')`;
  tempShapeButton.style.backgroundSize = "auto 100%";
  tempShapeButton.style.backgroundRepeat = "no-repeat";
  tempShapeButton.style.backgroundPosition = "center center";
  tempShapeButton.style.height = "50px";
  tempShapeButton.style.width = "20vw";
  tempShapeButton.style.border = "none";
  tempShapeButton.onclick = () => setShapeNameRef(shapeId);
  return tempShapeButton;
};
/**
 * Filtra de la lista de botones de formas los que coinciden con el grupo del parametro y los inyecta en el div de los botones de formas
 * @param {Grupo usado para flitrar en la lista de botones de formas} group
 */
const renderShapeButtons = (group) => {
  const shapesButtons = document.getElementById("shapes-buttons");
  shapesButtons.style.scrollSnapType="x mandatory";
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
    tempGroupButton.onclick = () => renderShapeButtons(group);
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
    tempShapeDiv.style.width="30vw";
    tempShapeDiv.style.scrollSnapAlign="center";
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
  const iconsSize = "40px";
  const tempTextureButton = document.createElement("BUTTON");
  tempTextureButton.style.backgroundImage = `url('https://vajillascorona.s3.sa-east-1.amazonaws.com/personalizador/recursos/iconos_texturas/${textureId}.png')`;
  tempTextureButton.style.backgroundSize = `${iconsSize} ${iconsSize}`;
  tempTextureButton.style.height = iconsSize;
  tempTextureButton.style.width = iconsSize;
  tempTextureButton.style.border = "none";
  tempTextureButton.style.borderRadius = "50%";
  tempTextureButton.onclick = () => updateTextureFunction(textureId);
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
  tempContextImg.id = "context-image";
  const tempMessurmentImg = document.createElement("IMG");
  tempMessurmentImg.id = "messurment-image";
  tempContextImg.src = `https://vajillascorona.s3.sa-east-1.amazonaws.com/personalizador/recursos/recursos_formas/${shapeNameRef}_context${index}.png`;
  tempMessurmentImg.src = `https://vajillascorona.s3.sa-east-1.amazonaws.com/personalizador/recursos/recursos_formas/${shapeNameRef}_messurment${index}.png`;
  tempContextImg.style.objectFit = "cover";
  tempContextImg.style.height = "15vh";
  tempContextImg.style.maxWidth = "none";
  tempContextImg.style.width = "100%";
  tempMessurmentImg.style.objectFit = "cover";
  tempMessurmentImg.style.height = "15vh";
  tempMessurmentImg.style.maxWidth = "none";
  tempMessurmentImg.style.width = "100%";
  const tempContextDiv = createTempDiv();
  tempContextDiv.style.maxHeight = "100%";
  tempContextDiv.style.minWidth = "100%";
  tempContextDiv.appendChild(tempContextImg);
  const tempMessurmentDIV = createTempDiv();
  tempMessurmentDIV.style.maxHeight = "100%";
  tempMessurmentDIV.style.minWidth = "100%";
  tempMessurmentDIV.appendChild(tempMessurmentImg);
  contextImages.appendChild(tempContextDiv);
  messurmentImages.appendChild(tempMessurmentDIV);
};
/**
 *
 */
for (let index = 0; index < 3; index++) {
  const contextButton = document.getElementById(`set-context-image-${index}`);
  contextButton.onclick = () => {
    document.getElementById(
      "context-image"
    ).src = `https://vajillascorona.s3.sa-east-1.amazonaws.com/personalizador/recursos/recursos_formas/${shapeNameRef}_context${index}.png`;
    for (let index2 = 0; index2 < 3; index2++) {
      document.getElementById(
        `set-context-image-${index2}`
      ).style.backgroundColor = "#c9c9c9";
    }
    contextButton.style.backgroundColor = "#332b17";
  };
  const messurmentButton = document.getElementById(
    `set-messurment-image-${index}`
  );
  messurmentButton.onclick = () => {
    document.getElementById(
      "messurment-image"
    ).src = `https://vajillascorona.s3.sa-east-1.amazonaws.com/personalizador/recursos/recursos_formas/${shapeNameRef}_messurment${index}.png`;
    for (let index2 = 0; index2 < 3; index2++) {
      document.getElementById(
        `set-messurment-image-${index2}`
      ).style.backgroundColor = "#c9c9c9";
    }
    messurmentButton.style.backgroundColor = "#332b17";
  };
}
/**
 * Usando un URL extrae un documento TXT desde AWS que usa para definir la lista de pares y la lista de texturas
 * @param {Link a TXT con la informacion sobre modelos y texturas}
 */
const getData = () => {
  fetch(dataUrl)
    .then((r) => r.text())
    .then((t) => {
      const newPairs = JSON.parse(t);
      renderPairs = newPairs.pairs;
      texturesIds = newPairs.texturesIds;
      if (!isShapeButtons) constructShapeButtons();
      if (!isTextureButtons) constructTextureButtons();
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
        if (!isGroupButtons) createGroupsButtons();
        if (!isShapeButtons && !isTextureButtons) getData();
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
          for (let i = 0; i < 3; i++) {
            api.updateTexture(
              `https://vajillascorona.s3.sa-east-1.amazonaws.com/personalizador/texturas/${shapeNameRef}/${shapeNameRef}_${textureId}_${textureNames[i]}.jpg`,
              currentTextureUid[i],
              function (err, textureUid) {
                textureNameRef = textureId;
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
