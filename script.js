function createGrid(gridId) {
    const grid = document.getElementById(gridId);
    for (let i = 0; i < 100; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = i;
        grid.appendChild(cell);

        cell.addEventListener('dragover', allowDrop);
        cell.addEventListener('drop', dropShip);
    }
    const enemyCells = document.querySelectorAll('#enemyGrid .cell');
enemyCells.forEach(cell => {
    cell.addEventListener('click', handleHit);
});

function handleHit(event) {
    const cell = event.target;
    const cellIndex = parseInt(cell.dataset.index);
    const x = cellIndex % 10;
    const y = Math.floor(cellIndex / 10);

    if (cell.classList.contains('hit') || cell.classList.contains('miss')) {
        return;
    }

    let hitShip = false;
    let hitShipObject = null;

    for (const ship of [enemyShip1, enemyShip2, enemyShip3, enemyShip4, enemyShip5]) {
        if (ship.x !== null && ship.y !== null) {
            for (let i = 0; i < ship.length; i++) {
                if (ship.element.dataset.orientation === "horizontal") {
                    if (ship.x + i === x && ship.y === y) {
                        hitShip = true;
                        hitShipObject = ship;
                        break;
                    }
                } else {
                    if (ship.x === x && ship.y + i === y) {
                        hitShip = true;
                        hitShipObject = ship;
                        break;
                    }
                }
            }
        }
        if (hitShip) break;
    }

    if (hitShip) {
        cell.classList.add('hit');
        cell.innerHTML = '<span class="hit-marker">×</span>';
        cell.style.color = 'green';
        cell.style.zIndex = '1';

        if (hitShipObject) {
            hitShipObject.destroy(); 
            for(let i = 0; i < hitShipObject.length; i++){
                if(hitShipObject.element.dataset.orientation === "horizontal"){
                    const cellIndexToRemove = (hitShipObject.y * 10) + (hitShipObject.x + i);
                    const cellToRemove = document.querySelector(`#enemyGrid .cell[data-index="${cellIndexToRemove}"]`);
                    if(cellToRemove){
                        cellToRemove.classList.remove('ship-occupied')
                    }
                } else {
                    const cellIndexToRemove = ((hitShipObject.y + i) * 10) + hitShipObject.x;
                    const cellToRemove = document.querySelector(`#enemyGrid .cell[data-index="${cellIndexToRemove}"]`);
                    if(cellToRemove){
                        cellToRemove.classList.remove('ship-occupied')
                    }
                }
            }
        }
    } else {
        cell.classList.add('miss');
        cell.innerHTML = '<span class="miss-marker">●</span>';
        cell.style.color = 'green';
    }

    // Dopo il turno del giocatore, il nemico spara con un ritardo di 1 secondo
    setTimeout(enemyTurn, 1000);
}

function enemyTurn() {
    let validMove = false;
    let cellIndex;
    let cell;

    while (!validMove) {
        cellIndex = Math.floor(Math.random() * 100);
        cell = document.querySelector(`#playerGrid .cell[data-index="${cellIndex}"]`);
        
        if (!cell.classList.contains('hit') && !cell.classList.contains('miss')) {
            validMove = true;
        }
    }

    if (cell.classList.contains('ship-occupied')) {
        cell.classList.add('hit');
        cell.innerHTML = '<span class="hit-marker">×</span>';
        cell.style.color = 'black';  
    } else {
        cell.classList.add('miss');
        cell.innerHTML = '<span class="miss-marker">●</span>';
        cell.style.color = 'green';
    }
}

}

function allowDrop(event) {
    event.preventDefault();
}


function dropShip(event) {
    event.preventDefault();
    const data = JSON.parse(event.dataTransfer.getData('text/plain'));
    const droppedCell = event.target;

    if (!droppedCell.classList.contains('cell')) {
        return;
    }

    const cellIndex = parseInt(droppedCell.dataset.index);
    const x = cellIndex % 10;
    const y = Math.floor(cellIndex / 10);

    const shipLength = parseInt(data.length);
    if (x + shipLength > 10) {
        return;
    }

    const shipElement = document.getElementById(data.shipId);

    
    for (let i = 0; i < shipLength; i++) {
        const targetCellIndex = cellIndex + i;
        const targetCell = document.querySelector(`#playerGrid .cell[data-index="${targetCellIndex}"]`);
        if (targetCell.classList.contains('ship-occupied')) {
            return;
        }
    }

    
    shipElement.style.left = `${x * 40}px`;
    shipElement.style.top = `${y * 40}px`;

   
    const ship = getShipById(data.shipId);
    ship.x = x;
    ship.y = y;

    
    for (let i = 0; i < shipLength; i++) {
        const targetCellIndex = cellIndex + i;
        const targetCell = document.querySelector(`#playerGrid .cell[data-index="${targetCellIndex}"]`);
        targetCell.classList.add('ship-occupied');
    }

    
    if (data.startX !== undefined && data.startY !== undefined) {
        for (let i = 0; i < shipLength; i++) {
            const originalCellIndex = data.startX + i;
            const originalCell = document.querySelector(`#playerGrid .cell[data-index="${originalCellIndex}"]`);
            if (originalCell) {
                originalCell.classList.remove('ship-occupied');
            }
        }
    }
}

function getShipById(shipId) {
    return [ship1, ship2, ship3, ship4, ship5].find(ship => ship.element.id === shipId);
}

class Ship {
     constructor(length, playerGrid) {
        this.length = length;
        this.grid = document.getElementById(playerGrid);
        this.element = document.createElement('div');
        this.element.classList.add('ship');
        this.element.draggable = true;
        this.element.id = `ship-${Date.now()}`;
        this.element.dataset.length = length;
        this.element.dataset.orientation = "horizontal"; 
        this.element.style.width = `${length * 40}px`;
        this.element.style.height = "40px"; 

        this.element.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', JSON.stringify({
                length: this.length,
                shipId: this.element.id,
                startX: this.x,
                startY: this.y
            }));
        });

        
        this.element.addEventListener('click', () => this.rotate());

        let shipContainer = this.grid.querySelector('.ship-container');
        if (!shipContainer) {
            shipContainer = document.createElement('div');
            shipContainer.classList.add('ship-container');
            shipContainer.style.position = 'absolute';
            this.grid.appendChild(shipContainer);
        }
        shipContainer.appendChild(this.element);

        this.x = null;
        this.y = null;
        this.placeRandomly();
    }

placeRandomly() {
let x, y;
let validPlacement = false;

while (!validPlacement) {
    x = Math.floor(Math.random() * (10 - this.length + 1)); 
    y = Math.floor(Math.random() * 10);

    validPlacement = true;
    for (let i = 0; i < this.length; i++) {
        const cellIndex = y * 10 + x + i;
        const cell = document.querySelector(`#playerGrid .cell[data-index="${cellIndex}"]`);
        if (cell.classList.contains('ship-occupied')) {
            validPlacement = false;
            break;
        }
    }
}

this.setPosition(x, y);
}


setPosition(x, y) {
this.x = x;
this.y = y;
this.element.style.left = `${x * 40}px`;
this.element.style.top = `${y * 40}px`;
for (let i = 0; i < this.length; i++) {
    const cellIndex = y * 10 + x + i;
    const cell = document.querySelector(`#playerGrid .cell[data-index="${cellIndex}"]`);
    if (cell) {
        cell.classList.add('ship-occupied');
    }
}
}
rotate() {
    const currentOrientation = this.element.dataset.orientation;
    const newOrientation = currentOrientation === "horizontal" ? "vertical" : "horizontal";

   
    this.element.dataset.orientation = newOrientation;

    if (newOrientation === "vertical") {
        this.element.style.width = "40px";
        this.element.style.height = `${this.length * 40}px`;
    } else {
        this.element.style.width = `${this.length * 40}px`;
        this.element.style.height = "40px";
    }
 }

}


createGrid('playerGrid');
createGrid('enemyGrid');

const ship1 = new Ship(4, 'playerGrid');
const ship2 = new Ship(3, 'playerGrid');
const ship3 = new Ship(2, 'playerGrid');
const ship4 = new Ship(2, 'playerGrid');
const ship5 = new Ship(1, 'playerGrid');

class EnemyShip {
    constructor(length, enemyGrid) {
        this.length = length;
        this.grid = document.getElementById(enemyGrid);
        this.element = document.createElement('div');
        this.element.classList.add('ship');
        this.element.draggable = false;
        this.element.id = `enemy-ship-${Date.now()}`;
        this.element.dataset.length = length;
        this.element.dataset.orientation = "horizontal";
        this.element.style.width = `${length * 40}px`;
        this.element.style.height = "40px";
        this.element.style.opacity = "0%";
        this.hits = 0;

        let shipContainer = this.grid.querySelector('.ship-container');
        if (!shipContainer) {
            shipContainer = document.createElement('div');
            shipContainer.classList.add('ship-container');
            shipContainer.style.position = 'absolute';
            this.grid.appendChild(shipContainer);
        }
        shipContainer.appendChild(this.element);

        this.placeRandomly();
    }

    placeRandomly() {
        let x, y;
        let validPlacement = false;

        while (!validPlacement) {
            x = Math.floor(Math.random() * (10 - this.length + 1));
            y = Math.floor(Math.random() * 10);

            validPlacement = true;
            for (let i = 0; i < this.length; i++) {
                const cellIndex = y * 10 + x + i;
                const cell = document.querySelector(`#enemyGrid .cell[data-index="${cellIndex}"]`);
                if (cell.classList.contains('ship-occupied')) {
                    validPlacement = false;
                    break;
                }
            }
        }

        this.setPosition(x, y);
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
        this.element.style.left = `${x * 40}px`;
        this.element.style.top = `${y * 40}px`;

        for (let i = 0; i < this.length; i++) {
            const cellIndex = y * 10 + x + i;
            const cell = document.querySelector(`#enemyGrid .cell[data-index="${cellIndex}"]`);
            if (cell) {
                cell.classList.add('ship-occupied');
            }
        }
    }
    hit() {
        this.hits++;
        console.log(`Nave ${this.element.id} colpita! Colpi: ${this.hits}`);
        if (this.hits >= this.length) {
            console.log(`Ship ${this.element.id} sunken!`);
            this.element.style.opacity = "100%";
        }
    }
    destroy() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
            this.element = null; 
        }
    }
}


const enemyShip1 = new EnemyShip(4, 'enemyGrid');
const enemyShip2 = new EnemyShip(3, 'enemyGrid');
const enemyShip3 = new EnemyShip(2, 'enemyGrid');
const enemyShip4 = new EnemyShip(2, 'enemyGrid');
const enemyShip5 = new EnemyShip(1, 'enemyGrid');
