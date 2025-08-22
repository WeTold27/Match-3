import Gem from "../entities/Gem";
import Phaser from "phaser";

export default class Board {
    rows: number;
    cols: number;
    cellSize: number;
    gemTypes: string[];
    grid: Gem[][];
    private selectedGem: Gem | null = null;

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

                // Сразу делаем интерактивным и вешаем обработчик
                gem.setInteractive();
                gem.on('pointerdown', () => this.onGemClicked(scene, gem));

                this.grid[row][col] = gem;
            }
        }
    }

    private onGemClicked(scene: Phaser.Scene, gem: Gem) {
        if (!this.selectedGem) {
            this.selectedGem = gem;
            gem.setScale(1.2);
        } else {
            const dx = Math.abs(gem.col - this.selectedGem.col);
            const dy = Math.abs(gem.row - this.selectedGem.row);

            if (dx + dy === 1) {
                // Меняем местами в логике
                [gem.row, this.selectedGem.row] = [this.selectedGem.row, gem.row];
                [gem.col, this.selectedGem.col] = [this.selectedGem.col, gem.col];

                this.grid[gem.row][gem.col] = gem;
                this.grid[this.selectedGem.row][this.selectedGem.col] = this.selectedGem;

                // Анимация через scene.tweens
                scene.tweens.add({
                    targets: gem,
                    x: this.selectedGem.x,
                    y: this.selectedGem.y,
                    duration: 200
                });
                scene.tweens.add({
                    targets: this.selectedGem,
                    x: gem.x,
                    y: gem.y,
                    duration: 200
                });
            }

            this.selectedGem.setScale(1);
            this.selectedGem = null;
        }
    }
}
