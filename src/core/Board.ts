import Gem from "../entities/Gem";

export default class Board {
    rows: number;
    cols: number;
    cellSize: number;
    gemTypes: string[];
    grid: (Gem | null)[][];

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
                this.grid[row][col] = new Gem(scene, x, y, type, row, col);
            }
        }
    }

    getGem(row: number, col: number): Gem | null {
        return this.grid[row]?.[col] ?? null;
    }

    swap(g1: Gem, g2: Gem) {
        [g1.row, g2.row] = [g2.row, g1.row];
        [g1.col, g2.col] = [g2.col, g1.col];

        this.grid[g1.row][g1.col] = g1;
        this.grid[g2.row][g2.col] = g2;
    }

    findMatches(): Gem[][] {
        const matches: Gem[][] = [];

        // горизонтальные
        for (let row = 0; row < this.rows; row++) {
            let streak: Gem[] = [];
            for (let col = 0; col < this.cols; col++) {
                const gem = this.getGem(row, col);
                if (!gem) continue;

                if (streak.length === 0 || streak[0].type === gem.type) {
                    streak.push(gem);
                } else {
                    if (streak.length >= 3) matches.push([...streak]);
                    streak = [gem];
                }
            }
            if (streak.length >= 3) matches.push([...streak]);
        }

        // вертикальные
        for (let col = 0; col < this.cols; col++) {
            let streak: Gem[] = [];
            for (let row = 0; row < this.rows; row++) {
                const gem = this.getGem(row, col);
                if (!gem) continue;

                if (streak.length === 0 || streak[0].type === gem.type) {
                    streak.push(gem);
                } else {
                    if (streak.length >= 3) matches.push([...streak]);
                    streak = [gem];
                }
            }
            if (streak.length >= 3) matches.push([...streak]);
        }

        return matches;
    }

    removeGems(gems: Gem[]) {
        for (const gem of gems) {
            this.grid[gem.row][gem.col] = null;
            gem.destroy();
        }
    }
}
