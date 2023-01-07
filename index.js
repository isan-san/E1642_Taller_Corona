//lista de objetos que representan los pares Textura-Forma, el link es el modelo correspondiente
const renderPairs = [
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
var texturesNames = [
  {
    shape: "5264",
    name: "938",
    COL: "https://uploads-ssl.webflow.com/631149747bab4a213513b49c/63b896a0f0a91c2a8b72fffe_5264_938_COL.png",
    ROU: "https://uploads-ssl.webflow.com/631149747bab4a213513b49c/63b896a0d42b38fa39e65f94_5264_938_ROU.png",
    NRM: "https://uploads-ssl.webflow.com/631149747bab4a213513b49c/63b896a0d42b385dc8e65f95_5264_938_NRM.png",
  },
  {
    shape: "5264",
    name: "937",
    COL: "https://uploads-ssl.webflow.com/631149747bab4a213513b49c/63b8969f1bad1614caad2837_5264_000_COL.png",
    ROU: "https://uploads-ssl.webflow.com/631149747bab4a213513b49c/63b896a0d5dfaa99db41c3e7_5264_000_ROU.png",
    NRM: "https://uploads-ssl.webflow.com/631149747bab4a213513b49c/63b896a0be6b58490007d859_5264_000_NRM.png",
  },
  {
    shape: "5264",
    name: "936",
    COL: "https://uploads-ssl.webflow.com/631149747bab4a213513b49c/63b896a11bad16b34cad283c_5264_936_COL.png",
    ROU: "https://uploads-ssl.webflow.com/631149747bab4a213513b49c/63b896a291a3015fd1968af1_5264_936_ROU.png",
    NRM: "https://uploads-ssl.webflow.com/631149747bab4a213513b49c/63b89c9d6b861918c627ac3a_5264_936_NRM.png",
  },
  {
    shape: "5264",
    name: "935",
    COL: "https://uploads-ssl.webflow.com/631149747bab4a213513b49c/63b896a16e20f124fe8e903c_5264_935_COL.png",
    ROU: "https://uploads-ssl.webflow.com/631149747bab4a213513b49c/63b896a175b8e516156fa213_5264_935_ROU.png",
    NRM: "https://uploads-ssl.webflow.com/631149747bab4a213513b49c/63b8931e80985b5a81f9741c_5264_935_NRM.png",
  },
  {
    shape: "5264",
    name: "809",
    COL: "https://uploads-ssl.webflow.com/631149747bab4a213513b49c/63b89c9d80985b2d33fa25e6_5264_809_COL.png",
    ROU: "https://uploads-ssl.webflow.com/631149747bab4a213513b49c/63b896a175b8e516156fa213_5264_935_ROU.png",
    NRM: "https://uploads-ssl.webflow.com/631149747bab4a213513b49c/63b89c9e1ae677d677ae497c_5264_809_NRM.png",
  },
  {
    shape: "5264",
    name: "000",
    COL: "https://uploads-ssl.webflow.com/631149747bab4a213513b49c/63b8969f1bad1614caad2837_5264_000_COL.png",
    ROU: "https://uploads-ssl.webflow.com/631149747bab4a213513b49c/63b896a0d5dfaa99db41c3e7_5264_000_ROU.png",
    NRM: "https://uploads-ssl.webflow.com/631149747bab4a213513b49c/63b896a0be6b58490007d859_5264_000_NRM.png",
  },
];
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
    const tempButtonText = document.createTextNode(texture.name);
    tempTextureButton.style.backgroundSize = "40px 40px";
    tempTextureButton.style.height = "40px";
    tempTextureButton.style.width = "40px";
    tempTextureButton.style.border = "none";
    tempTextureButton.style.borderRadius = "50%";
    tempTextureDiv.appendChild(tempTextureButton);
    tempTextureDiv.appendChild(tempButtonText);
    tempTextureButton.onclick = () =>
      upDateTexture(texture.shape, texture.name);
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
          const textureNames = ["COL", "ROU", "NMR",];
          tempTextureObject = texturesNames.filter(
            (texture) => texture.shape == shape && texture.name == textureId
          )[0];
          console.log(tempTextureObject);
          for (let i = 0; i < 3; i++) {
            api.updateTexture(
              tempTextureObject[textureNames[i]],
              currentTextureUid[i],
              function (err, textureUid) {
                if (!err) {
                  window.console.log(
                    "Replaced texture with UID",
                    tempTextureObject
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
    ui_watermark:0,
    ui_controls:0,
    ui_loading:0,
    ui_inspector:0,
    ui_infos:0,
    ui_general_controls:0,
    ui_stop:0,
    ui_fullscreen:0,
    dnt:0,
  });
}
const logMaterials = () => {
  console.log(materialsList);
};
