<script>const renderPairs = [
  {
    shapeName: "9236",
    link: `df3b76a383a149de8330c088fd1e17ea`,
  },
  {
    shapeName: "8375",
    link: `f83ea6822eb443bc9a38f3e7f3508eb3`,
  },
  {
    shapeName: "7128",
    link: `f10c460a1b884289925bc03008f5db3f`,
  },
  {
    shapeName: "5264",
    link: `a29f4e63121b4a79afcbafa9637b5c3f`,
  },
];

//Inicializando variables

// const shapesNames = [];
var currentTextureUid = [];
var texturesNames = ["935", "937"];
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
      (pair) => pair.shapeName == shapeNameRef
    );
    loadTitles();
    if (tempRenderPair[0]) {
      setSrc(tempRenderPair);
    }
  }
};
const setSrc = (tempRenderPair) => {
  if (tempRenderPair[0].link) {
    model.src = `https://sketchfab.com/models/${tempRenderPair[0].link}/embed?autostart=1`;
    uIdRef = tempRenderPair[0].link;
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

renderPairs.forEach((shape) => {
  const tempShapeDiv = document.createElement("DIV");
  tempShapeDiv.style.display = "flex";
  tempShapeDiv.style.flexDirection = "column";
  tempShapeDiv.style.justifyContent = "center";
  tempShapeDiv.style.alignItems = "center";
  const tempShapeButton = document.createElement("BUTTON");
  const tempButtonText = document.createTextNode(shape.shapeName);
  tempShapeButton.style.backgroundImage = `url('/assets/models/${shape.shapeName}.png')`;
  tempShapeButton.style.backgroundSize = "auto 50px";
  tempShapeButton.style.backgroundRepeat = "no-repeat";
  tempShapeButton.style.backgroundPosition = "center center";
  tempShapeButton.style.height = "50px";
  tempShapeButton.style.width = "100";
  tempShapeButton.style.border = "none";
  tempShapeDiv.appendChild(tempShapeButton);
  tempShapeDiv.appendChild(tempButtonText);
  tempShapeButton.onclick = () => setShapeNameRef(shape.shapeName);
  const shapesButtons = document.getElementById("shapes-buttons");
  shapesButtons.appendChild(tempShapeDiv);
});
//Ciclo generador de botones para texturas
const constructTextureButtons = (upDateTexture) => {
  let texturesButtons = document.getElementById("texture-buttons");
  texturesButtons.innerHTML = "";
  texturesNames.forEach((texture) => {
    const tempTextureDiv = document.createElement("DIV");
    tempTextureDiv.style.display = "flex";
    tempTextureDiv.style.flexDirection = "column";
    tempTextureDiv.style.justifyContent = "center";
    tempTextureDiv.style.alignItems = "center";
    const tempTextureButton = document.createElement("BUTTON");
    const tempButtonText = document.createTextNode(texture);
    tempTextureButton.style.backgroundSize = "40px 40px";
    tempTextureButton.style.height = "40px";
    tempTextureButton.style.width = "40px";
    tempTextureButton.style.border = "none";
    tempTextureButton.style.borderRadius = "50%";
    tempTextureDiv.appendChild(tempTextureButton);
    tempTextureDiv.appendChild(tempButtonText);
    tempTextureButton.onclick = () => upDateTexture(texture, textureNameRef);
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
        api.getTextureList(function (err, materials) {
          if (!err) {
            materialsList = [...materials];
            // texturesNames = materialsList.map((material) => material.name);
            currentTextureUid = materialsList.map((material) => material.uid);
            constructTextureButtons(upDateTexture);
          }
        });
        const upDateTexture = (shape, textureId) => {
          const textureNames = ["COL", "NMR", "ROU"];
          for (let i = 0; i < 3; i++) {
            api.updateTexture(
              /*`/assets/models/${shape}/${textureId}/${textureNames[i]}.png`*/ "https://i.imgur.com/yMgbFqs.png",
              currentTextureUid[i],
              function (err, textureUid) {
                if (!err) {
                  window.console.log(
                    "Replaced texture with UID",
                    `/assets/models/${shape}/${textureId}/${textureNames[i]}.png`
                  );
                }
              }
            );
          }
        };
      });
    });
  };
  client.init(uid, {
    success: success,
    error: function onError() {
      console.log("Viewer error");
    },
  });
}
</script>