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
        this.element.draggable = true ;
        this.element.setAttribute("data-length", "4");
        this.element.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', JSON.stringify({ length, gridId }));
        });
        this.grid.appendChild(this.element);
    }
}

function dropShip(event) {
    event.preventDefault();
    const data = JSON.parse(event.dataTransfer.getData('text/plain'));
    const cellIndex = parseInt(event.target.dataset.index);
    const x = cellIndex % 10;
    const y = Math.floor(cellIndex / 10);

    if (x + data.length > 10) return;
    
    const shipElement = document.querySelector(`.ship[style*="left: ${data.x * 40}px;"][style*="top: ${data.y * 40}px;"]`);
    if (shipElement) {
        shipElement.style.left = `${x * 40}px`;
        shipElement.style.top = `${y * 40}px`;
    }
}

new  Ship(2,3, 'playerGrid');