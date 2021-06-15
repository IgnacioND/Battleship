let objCenter;
let id;
let pickPoint;
let initialPos;
let finalPos;
let dropzone = document.querySelector("#dropzone");
let totalX;
let totalY;
let htmlObj;
let allReady = document.querySelector("#all-ready");
let parcelSize = 50;
allReady.addEventListener("click", getPositions);
dropzone.addEventListener("dragover", onDragOver);
dropzone.addEventListener("drop", onDrop);
dropzone.addEventListener("mousemove", (event) => {});
function addButtons() {
  let buttonsArray = Array.from(document.getElementsByClassName("button"));
  buttonsArray.forEach((element) => {
    element.addEventListener("dragstart", onDragStart);
    element.addEventListener("click", onClickEvent);
  });
}

let boats = {
  carrier: {
    name: "carrier",
    sizeX: parcelSize * 5,
    sizeY: parcelSize,
    rotated: false,
    oldPosX: 0,
    oldPosY: 0,
    array: [],
    abbr: "ca",
    error: false,
  },
  battleship: {
    name: "battleship",
    sizeX: parcelSize * 4,
    sizeY: parcelSize,
    rotated: false,
    oldPosX: 0,
    oldPosY: 0,
    array: [],
    abbr: "ba",
    error: false,
  },
  cruiser: {
    name: "cruiser",
    sizeX: parcelSize * 3,
    sizeY: parcelSize,
    rotated: false,
    oldPosX: 0,
    oldPosY: 0,
    array: [],
    abbr: "cr",
    error: false,
  },
  submarine: {
    name: "submarine",
    sizeX: parcelSize * 3,
    sizeY: parcelSize,
    rotated: false,
    oldPosX: 0,
    oldPosY: 0,
    array: [],
    abbr: "su",
    error: false,
  },
  destroyer: {
    name: "destroyer",
    sizeX: parcelSize * 2,
    sizeY: parcelSize,
    rotated: false,
    oldPosX: 0,
    oldPosY: 0,
    array: [],
    abbr: "de",
    error: false,
  },
};
let styles = {
  transform: "",
};

function onDragStart(event) {
  console.log(event.target.id)
  id = boats[event.target.id];
  htmlObj = document.querySelector(`#${id["name"]}`);
  event.dataTransfer.setData("text/plain", id);
  objCenter = [event.offsetX, event.offsetY];
  pickPoint = [event.pageX, event.pageY];
}
function onDragOver(event) {
  initialPos = [event.offsetX, event.offsetY];
  event.preventDefault();
}
function onDrop(event) {
  let target = event.target.id;
  let htmlTarget = document.querySelector(`#${target}`);
  finalPos = [event.pageX, event.pageY];

  if (htmlTarget.parentNode == dropzone) {
    totalX =
      finalPos[0] -
      dropzone.getBoundingClientRect().x -
      pickPoint[0] +
      id["oldPosX"];
    totalY =
      finalPos[1] -
      pickPoint[1] +
      id["oldPosY"] -
      dropzone.getBoundingClientRect().y;
  } else {
    totalX =
      Math.round((initialPos[0] - objCenter[0]) / parcelSize) * parcelSize;
    totalY =
      Math.round((initialPos[1] - objCenter[1]) / parcelSize) * parcelSize;
  }
  if (checkDropPosition()) {
    moveObject(event);
    makeBoatArray(event);
    invalidPosition();
    paintErrors();
  }
}
function moveObject(event) {
  styles["transform"] = `translate(${totalX}px,${totalY}px)`;
  Object.assign(htmlObj.style, styles);
  dropzone.appendChild(htmlObj);
  event.dataTransfer.clearData();
  id["oldPosX"] = totalX;
  id["oldPosY"] = totalY;
}
function checkDropPosition() {
  let bottomLimit = parcelSize * 10;
  let sideLimit = parcelSize * 10;
  if (id["rotated"]) {
    bottomLimit -= id["sizeX"];
    sideLimit -= id["sizeY"];
  } else {
    bottomLimit -= id["sizeY"];
    sideLimit -= id["sizeX"];
  }
  return (
    totalX >= 0 && totalX <= sideLimit && totalY >= 0 && totalY <= bottomLimit
  );
}
function makeBoatArray() {
  id.array = [];
  let parcels = parseInt(id.sizeX) / 50;
  for (i = 0; i < parcels / 50; i++) {
    let originX = id.oldPosX / 50;
    let originY = id.oldPosY / 50;
    if (id.rotated) {
      for (let i = 0; i < parcels; i++) {
        id.array.push(`${originX+i}${originY}`);
      }
    } else {
      for (let i = 0; i < parcels; i++) {
        id.array.push(`${origin}${originY+i}`);
      }
    }
  }
}


function onClickEvent(event) {
  id = boats[event.currentTarget.id];
  htmlObj = document.querySelector(`#${id["name"]}-body`);
  htmlContainer = document.querySelector(`#${id["name"]}`);
  if (id["rotated"]) {
    id["rotated"] = false;
    htmlObj.classList.remove(`${id["name"]}R`);
    htmlObj.classList.add(`${id["name"]}`);
    htmlContainer.classList.remove(`${id["name"]}-containerR`);
    htmlContainer.classList.add(`${id["name"]}-container`);
    if (!checkDropPosition()) {
      htmlObj.classList.remove(`${id["name"]}`);
      htmlObj.classList.add(`${id["name"]}R`);
      htmlContainer.classList.remove(`${id["name"]}-container`);
    htmlContainer.classList.add(`${id["name"]}-containerR`);
      id["rotated"] = true;
    }
  } else {
    id["rotated"] = true;
    htmlObj.classList.remove(`${id["name"]}`);
    htmlObj.classList.add(`${id["name"]}R`);
    htmlContainer.classList.remove(`${id["name"]}-container`);
    htmlContainer.classList.add(`${id["name"]}-containerR`);
    if (!checkDropPosition()) {
      htmlObj.classList.remove(`${id["name"]}R`);
      htmlObj.classList.add(`${id["name"]}`);
      htmlContainer.classList.remove(`${id["name"]}-containerR`);
    htmlContainer.classList.add(`${id["name"]}-container`);
      id["rotated"] = false;
    }
  }
  makeBoatArray();
  invalidPosition();
  paintErrors();
}
function invalidPosition() {
  let invalidPreparation;
  let boatsArray = Object.entries(boats);
  for (i = 0; i < boatsArray.length; i++) {
    boatsArray[i][1].error = false;
  }
  for (i = 0; i < boatsArray.length; i++) {
    //Barco ppal selecc para comparar
    let mainBoat = boatsArray[i][1]; //array del barco ppal
    for (j = 0; j < mainBoat.array.length; j++) {
      //recorrido del array ppal
      for (k = i + 1; k < boatsArray.length; k++) {
        secondaryBoat = boatsArray[k][1];
        if (secondaryBoat.array.includes(mainBoat.array[j])) {
          boats[mainBoat.name].error = true;
          boats[secondaryBoat.name].error = true;
          invalidPreparation = true;
          break;
        }
      }
    }
  }
  return invalidPreparation;
}
function paintErrors() {
  let boatsArray = Object.entries(boats);
  for (i = 0; i < boatsArray.length; i++) {
    let boatName = boatsArray[i][1].name;
    let boatToApplyClass = document.querySelector(`#${boatName}-body`);
    if (boatsArray[i][1].error) {
      boatToApplyClass.classList.add("red-border");
    } else {
      boatToApplyClass.classList.remove("red-border");
    }
  }
}
function cleanArray() {
  const array = [
    ["w", "w", "w", "w", "w", "w", "w", "w", "w", "w"],
    ["w", "w", "w", "w", "w", "w", "w", "w", "w", "w"],
    ["w", "w", "w", "w", "w", "w", "w", "w", "w", "w"],
    ["w", "w", "w", "w", "w", "w", "w", "w", "w", "w"],
    ["w", "w", "w", "w", "w", "w", "w", "w", "w", "w"],
    ["w", "w", "w", "w", "w", "w", "w", "w", "w", "w"],
    ["w", "w", "w", "w", "w", "w", "w", "w", "w", "w"],
    ["w", "w", "w", "w", "w", "w", "w", "w", "w", "w"],
    ["w", "w", "w", "w", "w", "w", "w", "w", "w", "w"],
    ["w", "w", "w", "w", "w", "w", "w", "w", "w", "w"],
  ];
  return array;
}
const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

let playerOneArray = cleanArray();

function getPositions() {
  let boatsArray = Object.entries(boats);
  for (i = 0; i < boatsArray.length; i++) {
    let parcels = boatsArray[i][1].sizeX / 50;
    let originX = boatsArray[i][1].oldPosX / 50;
    let originY = boatsArray[i][1].oldPosY / 50;
    let boatParcels = [];
    if (boatsArray[i][1].rotated) {
      for (let i = 0; i < parcels; i++) {
        boatParcels.push(`${originX}${originY+i}`);
      }
      putBoatInArray(playerOneArray, boatParcels, boatsArray[i][1].abbr);
    } else {
      for (let i = 0; i < parcels; i++) {
        boatParcels.push(`${originX+i}${originY }`);
      }
      putBoatInArray(playerOneArray, boatParcels, boatsArray[i][1].abbr);
    }
  }
  console.table(playerOneArray);
}

function putBoatInArray(array, boatParcels, newContent) {
  for (let i = 0; i < boatParcels.length; i++) {
    let [column, row] = boatParcels[i];
    array[row][column] = newContent;
  }
}


addButtons()
