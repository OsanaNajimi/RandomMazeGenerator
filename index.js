let mazecontainer = document.querySelector(".maze");
let gridWidth = document.getElementById("width-range");
let gridHeight = document.getElementById("height-range");
let speed = document.getElementById("speed");
let widthValue = document.getElementById("width-value");
let heightValue = document.getElementById("height-value");
let speedValue = document.getElementById("speed-value");
let start = document.getElementById("start");
let showOrigin = document.getElementById("showOrigin");
let stylesheet = document.styleSheets[0];

class Node {
  constructor(parent, parent_id) {
    this.parent = parent;
    this.parent_id = parent_id;
  }
}

class Maze {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.origin = width * height - 1;
    this.grid = [];
    for (let i = 0; i < gridHeight.value; i++) {
      for (let j = 0; j < gridWidth.value; j++) {
        let parent = j === gridWidth.value - 1 ? "bottom" : "right";
        let parent_id =
          j === gridWidth.value - 1
            ? (i + 1) * gridWidth.value + j
            : i * gridWidth.value + (j + 1);
        if (i === gridHeight.value - 1 && j === gridWidth.value - 1) {
          parent = "left";
          parent_id = i * gridWidth.value + j - 1;
        }
        this.grid.push(new Node(parent, parent_id));
      }
    }
  }
}

let maze;
let running = false;

function updateGrid(id) {
  let grid = document.getElementById(`grid${id}`);
  let parent = document.getElementById(`grid${maze.grid[id].parent_id}`);
  if (maze.origin === id) {
    if (maze.grid[id].parent === "top") {
      grid.classList.remove("top_connected");
      parent.classList.remove("bottom_connected");
    } else if (maze.grid[id].parent === "right") {
      grid.classList.remove("right_connected");
      parent.classList.remove("left_connected");
    } else if (maze.grid[id].parent === "bottom") {
      grid.classList.remove("bottom_connected");
      parent.classList.remove("top_connected");
    } else if (maze.grid[id].parent === "left") {
      grid.classList.remove("left_connected");
      parent.classList.remove("right_connected");
    }
  } else {
    if (maze.grid[id].parent === "top") {
      grid.classList.add("top_connected");
      parent.classList.add("bottom_connected");
    } else if (maze.grid[id].parent === "right") {
      grid.classList.add("right_connected");
      parent.classList.add("left_connected");
    } else if (maze.grid[id].parent === "bottom") {
      grid.classList.add("bottom_connected");
      parent.classList.add("top_connected");
    } else if (maze.grid[id].parent === "left") {
      grid.classList.add("left_connected");
      parent.classList.add("right_connected");
    }
  }
}

function random_choice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function updateOrigin() {
  if (!running) return;
  let origin_grid = document.getElementById(`grid${maze.origin}`);
  origin_grid.classList.remove("origin");
  let neighbors = [];
  if (Math.floor(maze.origin / maze.width) != 0) {
    neighbors.push(["top", maze.origin - maze.width]);
  }
  if (maze.origin % maze.width != maze.width - 1) {
    neighbors.push(["right", maze.origin + 1]);
  }
  if (Math.floor(maze.origin / maze.width) != maze.height - 1) {
    neighbors.push(["bottom", maze.origin + +maze.width]);
  }
  if (maze.origin % maze.width != 0) {
    neighbors.push(["left", maze.origin - 1]);
  }
  let new_parent, new_origin;
  [new_parent, new_origin] = random_choice(neighbors);
  maze.grid[maze.origin].parent = new_parent;
  maze.grid[maze.origin].parent_id = new_origin;
  let tmp = maze.origin;
  maze.origin = new_origin;
  updateGrid(new_origin);
  updateGrid(tmp);
  let new_origin_grid = document.getElementById(`grid${new_origin}`);
  new_origin_grid.classList.add("origin");
  timeouts = [1000, 50, 0];
  setTimeout(updateOrigin, timeouts[speed.value - 1]);
}

function run() {
  if (!running) {
    start.innerHTML = "<h3>PAUSE</h3>";
    start.setAttribute("id", "pause");
    running = true;
    updateOrigin();
  } else {
    start.innerHTML = "<h3>START</h3>";
    start.setAttribute("id", "start");
    running = false;
  }
}

function reset() {
  start.innerHTML = "<h3>START</h3>";
  start.setAttribute("id", "start");
  running = false;
  maze = new Maze(gridWidth.value, gridHeight.value);
  mazecontainer.innerHTML = "";
  let id = 0;
  for (let i = 0; i < gridHeight.value; i++) {
    let div = document.createElement("div");
    div.classList.add("gridRow");
    for (let j = 0; j < gridWidth.value; j++) {
      let col = document.createElement("div");
      col.classList.add("gridCol");
      col.setAttribute("id", `grid${id}`);
      if (maze.origin === id) {
        col.classList.add("origin");
      }
      div.appendChild(col);
      id++;
    }
    mazecontainer.appendChild(div);
  }
  id = 0;
  for (let i = 0; i < gridHeight.value; i++) {
    for (let j = 0; j < gridWidth.value; j++) {
      if (!(i === gridHeight.value - 1 && j === gridWidth.value - 1))
        updateGrid(id);
      id++;
    }
  }
  for (let e of stylesheet.cssRules) {
    if (e.selectorText === ".gridRow") {
      e.style.width = `${15 * gridWidth.value}px`;
    }
  }
}

reset();

gridWidth.addEventListener("input", () => {
  widthValue.innerHTML =
    gridWidth.value < 9 ? `0${gridWidth.value}` : gridWidth.value;
});

gridHeight.addEventListener("input", () => {
  heightValue.innerHTML =
    gridHeight.value < 9 ? `0${gridHeight.value}` : gridHeight.value;
});

speed.addEventListener("input", () => {
  if (speed.value === "1") speedValue.innerHTML = "slow";
  if (speed.value === "2") speedValue.innerHTML = "med";
  if (speed.value === "3") speedValue.innerHTML = "fast";
});

showOrigin.addEventListener("change", function () {
  let originRule;
  for (let e of stylesheet.cssRules) {
    if (e.selectorText === ".origin") {
      originRule = e;
    }
  }
  if (this.checked) {
    originRule.style.setProperty("background-color", "#f55");
  } else {
    originRule.style.setProperty("background-color", "transparent");
  }
});
