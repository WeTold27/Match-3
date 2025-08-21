import Gem from "../entities/Gem";

export default class Board {
    rows: number;
    cols: number;
    cellSize: number;
    gemTypes: string[];
    grid: Gem[][];

    constructor(rows: number, cols: number, cellSize: number, gemTypes: string[]) {
        this.rows = rows;
        this.cols = cols;
        this.cellSize = cellSize;
        this.gemTypes = gemTypes;
        this.grid = [];
    }

    create(scene: Phaser.Scene) {
        const offsetX = (scene.scale.width - this.cols * this.cellSize) / 2;
        const offsetY = (scene.scale.height - this.rows * this.cellSize) / 2;

        for (let row = 0; row < this.rows; row++) {
            this.grid[row] = [];
            for (let col = 0; col < this.cols; col++) {
                const type = Phaser.Utils.Array.GetRandom(this.gemTypes);
                const x = offsetX + col * this.cellSize + this.cellSize / 2;
                const y = offsetY + row * this.cellSize + this.cellSize / 2;
                const gem = new Gem(scene, x, y, type, row, col);
                this.grid[row][col] = gem;
            }
        }
    }
}
