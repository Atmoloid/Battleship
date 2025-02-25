# Battleship Game

## Description
This is a simple implementation of the classic Battleship game using HTML, CSS, and JavaScript. The game allows players to place their ships on a grid and take turns attacking enemy ships. The enemy AI makes random attacks on the player's grid.

## Technologies Used
- HTML
- CSS
- JavaScript

## How to Play
1. Ships are placed randomly on the player's grid at the start of the game.
2. The player clicks on enemy grid cells to attack.
3. A hit is marked with an '×', while a miss is marked with '●'.
4. After each player move, the enemy AI attacks a random cell on the player's grid.
5. The game continues until all ships of one side are destroyed.

## Code Breakdown

### 1. **HTML Structure (index.html)**
- Defines the game layout with two grids: `#playerGrid` and `#enemyGrid`.
- Includes a `script.js` file to handle game logic.

### 2. **Grid Creation (script.js)**
```javascript
function createGrid(gridId) {
    const grid = document.getElementById(gridId);
    for (let i = 0; i < 100; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = i;
        grid.appendChild(cell);
    }
}
```
- Generates a 10x10 grid dynamically.
- Each cell is assigned an index for tracking.

### 3. **Handling Player Attacks (script.js)**
```javascript
function handleHit(event) {
    const cell = event.target;
    if (cell.classList.contains('hit') || cell.classList.contains('miss')) return;
    
    let hit = checkIfHit(cell);
    if (hit) {
        cell.classList.add('hit');
        cell.innerHTML = '<span class="hit-marker">×</span>';
    } else {
        cell.classList.add('miss');
        cell.innerHTML = '<span class="miss-marker">●</span>';
    }
    setTimeout(enemyTurn, 1000);
}
```
- Prevents attacking the same cell twice.
- Checks if a ship is hit and marks the cell accordingly.
- Initiates the enemy turn after a short delay.

### 4. **Enemy AI Logic (script.js)**
```javascript
function enemyTurn() {
    let validMove = false, cell;
    while (!validMove) {
        let cellIndex = Math.floor(Math.random() * 100);
        cell = document.querySelector(`#playerGrid .cell[data-index="${cellIndex}"]`);
        if (!cell.classList.contains('hit') && !cell.classList.contains('miss')) validMove = true;
    }
    cell.classList.add(cell.classList.contains('ship-occupied') ? 'hit' : 'miss');
    cell.innerHTML = cell.classList.contains('hit') ? '<span class="hit-marker">×</span>' : '<span class="miss-marker">●</span>';
}
```
- Randomly selects an unmarked cell.
- Determines whether the cell contains a ship.
- Marks it as hit or miss.

### 5. **Ship Class & Placement (script.js)**
```javascript
class Ship {
    constructor(length, gridId) {
        this.length = length;
        this.grid = document.getElementById(gridId);
        this.placeRandomly();
    }

    placeRandomly() {
        let validPlacement = false;
        while (!validPlacement) {
            let x = Math.floor(Math.random() * (10 - this.length + 1));
            let y = Math.floor(Math.random() * 10);
            validPlacement = this.checkPlacement(x, y);
        }
    }
}
```
- Creates ship objects with a specific length.
- Places them randomly while avoiding overlaps.

### 6. **CSS Styling (styles.css)**
```css
body {
    background-color: black;
    color: green;
    text-align: center;
    font-family: 'Press Start 2P', cursive;
}

.grid {
    display: grid;
    grid-template-columns: repeat(10, 40px);
    grid-template-rows: repeat(10, 40px);
    border: 2px solid green;
}

.cell {
    width: 40px;
    height: 40px;
    border: 1px solid green;
}
```
- Uses a retro gaming theme with pixel-style fonts.
- Defines a 10x10 grid with a green border.
- Cells are styled to fit within the grid structure.

