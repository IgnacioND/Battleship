let dropzone = document.querySelector("#dropzone");
dropzone.addEventListener("drop", drop);
dropzone.addEventListener("dragover", dragOver);

function addButtons() {
  let buttonsArray = Array.from(document.getElementsByClassName("boat"));
  buttonsArray.forEach((element) => {
    element.addEventListener("dragstart", dragStart);
    element.addEventListener("click", clickBoat);
  });
}
let parcelSize = 50;
let currentBoat = {};
let arraySize = 10;

let gameVariables = {
  boatsPlaced:0,
}

let boats = {
  carrier: {
    name: "carrier",
    placed: false,
    turnable: false,
    size: 5,
    direction: 0,
    position:[],
    array:[],
    maxParcel: arraySize-5,
  },
  battleship: {
    name: "battleship",
    placed: false,
    turnable: false,
    size: 4,
    direction: 0,
    position:[],
    array:[],
    maxParcel: arraySize-4,
  },
  cruiser: {
    name: "cruiser",
    placed: false,
    turnable: false,
    size: 3,
    direction: 0,
    position:[],
    array:[],
    maxParcel: arraySize-3,
  },
  submarine: {
    name: "submarine",
    placed: false,
    turnable: false,
    size: 3,
    direction: 0,
    position:[],
    array:[],
    maxParcel: arraySize-3,
  },
  destroyer: {
    name: "destroyer",
    placed: false,
    turnable: false,
    size: 2,
    direction: 0,
    position:[],
    array:[],
    maxParcel: arraySize-2,
  }
}


function dragStart(e){
  currentBoat.id = e.target.id
  currentBoat.dom = document.querySelector(`#${e.target.id}`)
  currentBoat.pickpoint = [e.offsetX, e.offsetY]
}

function dragOver(e) {
  let direction = boats[currentBoat.id].direction;
  
  currentBoat.parcelDrop = [Math.round((e.offsetX-currentBoat.pickpoint[0]) / parcelSize), Math.round((e.offsetY-currentBoat.pickpoint[1]) / parcelSize)];
  let endPos = [currentBoat.parcelDrop[0] * parcelSize, currentBoat.parcelDrop[1] * parcelSize]
  currentBoat.endPos = [endPos[0], endPos[1]];
  e.preventDefault();
  if (currentBoat.parcelDrop[direction] > boats[currentBoat.id].maxParcel){currentBoat.droppable = false} else {currentBoat.droppable = true}
  
}

function drop(e){
  let rotation = boats[currentBoat.id].direction === 0 ? 1 : 0;
  if (e.target.id !== "dropzone" || !currentBoat.droppable){return}
  dropzone.appendChild(currentBoat.dom);
  if (currentBoat.parcelDrop[rotation] > boats[currentBoat.id].maxParcel){boats[currentBoat.id].turnable = false} else {boats[currentBoat.id].turnable = true}
  boats[currentBoat.id].position = currentBoat.parcelDrop;
  boats[currentBoat.id].placed = true;
  currentBoat.dom.style.transform = `translate(${currentBoat.endPos[0]}px,${currentBoat.endPos[1]}px)`
  endPlacement()
}

function clickBoat(e){
  currentBoat.id = e.currentTarget.id
  currentBoat.dom = document.querySelector(`#${e.currentTarget.id}-body`)
  currentBoat.domContainer = document.querySelector(`#${e.currentTarget.id}`)
  if (boats[currentBoat.id].turnable){
    if (boats[currentBoat.id].direction === 0) {
      currentBoat.dom.classList.remove(`${currentBoat.id}`);
      currentBoat.dom.classList.add(`${currentBoat.id}R`);
      currentBoat.domContainer.classList.remove(`${currentBoat.id}-container`);
      currentBoat.domContainer.classList.add(`${currentBoat.id}-containerR`);
      boats[currentBoat.id].direction = 1
    } else {
      currentBoat.dom.classList.remove(`${currentBoat.id}R`);
      currentBoat.dom.classList.add(`${currentBoat.id}`);
      currentBoat.domContainer.classList.remove(`${currentBoat.id}-containerR`);
      currentBoat.domContainer.classList.add(`${currentBoat.id}-container`);
      boats[currentBoat.id].direction = 0
    }
  }
  endPlacement()
}

function getBoatArrays(){
  let start
  let size
  let orientation
  let name
  let boatsArray = Object.entries(boats);
  for (i = 0; i < boatsArray.length; i++) {
    let arr = [];
    start = boatsArray[i][1].position;
    size =  boatsArray[i][1].size;
    orientation = boatsArray[i][1].direction;
    name = boatsArray[i][1].name
    if (boatsArray[i][1].placed){
    if (orientation === 0){
      for (let i = 0 ; i < size;i++){
        arr.push(Number(`${start[0]+i}${start[1]}`))
        boats[name].array = arr
      }
   } else {
      for (let i = 0 ; i < size;i++){
        arr.push(Number(`${start[0]}${start[1]+i}`))
        boats[name].array = arr
      }
    }
   }
  }
}


function endPlacement(){
  getBoatArrays()
}

function start(){
  addButtons()
}

start()