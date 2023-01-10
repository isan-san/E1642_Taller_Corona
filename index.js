//lista de objetos que representan los pares Textura-Forma, el link es el modelo correspondiente
var renderPairs = "";
var texturesIds = "";
const dataUrl =
  "https://vajillascorona.s3.sa-east-1.amazonaws.com/personalizador/recursos/json_pares.txt";
var currentTextureUid = [];
var isShapeButtons = false;
var materialsList = [];
var shapeNameRef = "5264";
var textureNameRef = "937";
var uIdRef = "";
const model = document.getElementById("web-model");
loadClient("f83ea6822eb443bc9a38f3e7f3508eb3");

const setShapeNameRef = (shape) => {
  shapeNameRef = shape;
  if (shapeNameRef) {
    const tempRenderPair = renderPairs.filter(
      (pair) => pair.shape == shapeNameRef
    );
    loadTitles();
    if (tempRenderPair[0]) {
      setSrc(tempRenderPair);
    }
  }
};
const setSrc = (tempRenderPair) => {
  if (tempRenderPair[0].UID) {
    model.src = `https://sketchfab.com/models/${tempRenderPair[0].UID}/embed?autostart=1`;
    uIdRef = tempRenderPair[0].UID;
    const modelCanvas = document.getElementById("model-canvas");
    modelCanvas.style.display = "none";
    modelCanvas.style.display = "block";
    loadClient(uIdRef);
  }
};

const loadTitles = () => {
  const shapeTitle = document.getElementById("shape-name");
  shapeTitle.innerText = shapeNameRef;
};

//Ciclo generador de botones para formas

const constructShapeButtons = () => {
  renderPairs.forEach((shape) => {
    const tempShapeDiv = document.createElement("DIV");
    tempShapeDiv.style.display = "flex";
    tempShapeDiv.style.flexDirection = "column";
    tempShapeDiv.style.justifyContent = "center";
    tempShapeDiv.style.alignItems = "center";
    const tempShapeButton = document.createElement("BUTTON");
    const tempButtonText = document.createTextNode(shape.shape);
    tempShapeButton.style.backgroundImage = `url('https://vajillascorona.s3.sa-east-1.amazonaws.com/personalizador/recursos/recursos_formas/${shape.shape}.png')`;
    tempShapeButton.style.backgroundSize = "auto 50px";
    tempShapeButton.style.backgroundRepeat = "no-repeat";
    tempShapeButton.style.backgroundPosition = "center center";
    tempShapeButton.style.height = "50px";
    tempShapeButton.style.width = "100px";
    tempShapeButton.style.border = "none";
    tempShapeDiv.appendChild(tempShapeButton);
    tempShapeDiv.appendChild(tempButtonText);
    tempShapeButton.onclick = () => setShapeNameRef(shape.shape);
    const shapesButtons = document.getElementById("shapes-buttons");
    shapesButtons.appendChild(tempShapeDiv);
  });
  isShapeButtons = true;
};
const constructTextureButtons = (upDateTexture) => {
  let texturesButtons = document.getElementById("texture-buttons");
  texturesButtons.innerHTML = "";
  texturesIds.forEach((texture) => {
    const tempTextureDiv = document.createElement("DIV");
    tempTextureDiv.style.display = "flex";
    tempTextureDiv.style.flexDirection = "column";
    tempTextureDiv.style.justifyContent = "center";
    tempTextureDiv.style.alignItems = "center";
    const tempTextureButton = document.createElement("BUTTON");
    tempTextureButton.style.backgroundImage = `url('https://vajillascorona.s3.sa-east-1.amazonaws.com/personalizador/recursos/iconos_texturas/${texture}.png')`;
    const iconsSize = "40px";
    tempTextureButton.style.backgroundSize = `${iconsSize} ${iconsSize}`;
    tempTextureButton.style.height = iconsSize;
    tempTextureButton.style.width = iconsSize;
    tempTextureButton.style.border = "none";
    tempTextureButton.style.borderRadius = "50%";
    tempTextureDiv.appendChild(tempTextureButton);
    tempTextureButton.onclick = () => upDateTexture(texture);
    texturesButtons.appendChild(tempTextureDiv);
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
        console.log("Viewer is ready");
        fetch(dataUrl)
          .then((r) => r.text())
          .then((t) => {
            const newPairs = JSON.parse(t);
            renderPairs = newPairs.pairs;
            texturesIds = newPairs.texturesIds;
            if (!isShapeButtons) constructShapeButtons();
            api.getTextureList(function (err, materials) {
              if (!err) {
                materialsList = [...materials];
                currentTextureUid = materialsList.map(
                  (material) => material.uid
                );
                console.log(materialsList);
                constructTextureButtons(upDateTexture);
              }
            });
            const upDateTexture = (textureId) => {
              const textureNames = ["COL", "NRM", "ROU"];
              for (let i = 0; i < 3; i++) {
                api.updateTexture(
                  `https://vajillascorona.s3.sa-east-1.amazonaws.com/personalizador/texturas/${shapeNameRef}/${shapeNameRef}_${textureId}_${textureNames[i]}.png`,
                  currentTextureUid[i],
                  function (err, textureUid) {
                    if (!err) {
                      window.console.log("Replaced texture with UID");
                    }
                  }
                );
              }
            };
          });
      });
    });
  };
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
const logMaterials = () => {
  console.log(materialsList);
};
