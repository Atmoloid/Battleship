function createGrid(gridId) {
    const grid = document.getElementById(gridId);
    for (let i = 0; i < 100; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        grid.appendChild(cell);
    }
}

createGrid('playerGrid');
createGrid('enemy-grid');

class Ship{
    constructor(x, y, playerGrid) {
        this.x = x;
        this.y = y;
        this.grid = document.getElementById(playerGrid);
        this.element = document.createElement('div');
        this.element.classList.add('ship');
        this.grid.appendChild(this.element);
    }
}

new  Ship(2,3, 'playerGrid');