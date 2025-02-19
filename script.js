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

    // Check for overlaps
    for (let i = 0; i < shipLength; i++) {
        const targetCellIndex = cellIndex + i;
        const targetCell = document.querySelector(`#playerGrid .cell[data-index="${targetCellIndex}"]`);
        if (targetCell.classList.contains('ship-occupied')) {
            return;
        }
    }

    // Position the ship relative to the grid container
    shipElement.style.left = `${x * 40}px`;
    shipElement.style.top = `${y * 40}px`;

    // Update ship's coordinates
    const ship = getShipById(data.shipId);
    ship.x = x;
    ship.y = y;

    // Mark cells as occupied
    for (let i = 0; i < shipLength; i++) {
        const targetCellIndex = cellIndex + i;
        const targetCell = document.querySelector(`#playerGrid .cell[data-index="${targetCellIndex}"]`);
        targetCell.classList.add('ship-occupied');
    }

    // Remove the ship from its initial position (if it was placed there)
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
        this.element.dataset.orientation = "horizontal"; // Imposta inizialmente orizzontale
        this.element.style.width = `${length * 40}px`;
        this.element.style.height = "40px"; // Altezza fissa per nave orizzontale

        this.element.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', JSON.stringify({
                length: this.length,
                shipId: this.element.id,
                startX: this.x,
                startY: this.y
            }));
        });

        // ** Aggiunge il listener per la rotazione al click **
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
    x = Math.floor(Math.random() * (10 - this.length + 1)); // Evita che la nave esca dalla griglia
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

    // Cambia l'orientamento nei dati
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