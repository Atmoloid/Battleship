function createGrid(gridId) {
    const grid = document.getElementById(gridId);
    for (let i = 0; i < 100; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        grid.appendChild(cell);
    }
}

createGrid('player-grid');
createGrid('enemy-grid');