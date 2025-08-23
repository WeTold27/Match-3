import Phaser from "phaser";
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

    enableInput(swapHandler: any) {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const gem = this.grid[row][col];
                if (!gem) continue;
                gem.setInteractive();
                gem.removeAllListeners();
                gem.on("pointerdown", () => swapHandler.onGemClicked(gem));
            }
        }
    }

    getX(col: number) { return col * this.cellSize + this.cellSize / 2; }
    getY(row: number) { return row * this.cellSize + this.cellSize / 2; }

    create(scene: Phaser.Scene) {
        const uiWidth = 50;
        const offsetX = (scene.scale.width - this.cols * this.cellSize - uiWidth) / 2 - uiWidth;
        const offsetY = (scene.scale.height - this.rows * this.cellSize) / 2;

        for (let row = 0; row < this.rows; row++) {
            this.grid[row] = [];
            for (let col = 0; col < this.cols; col++) {
                const gem = this.createGem(scene, row, col, offsetX, offsetY);
                this.grid[row][col] = gem;
            }
        }
    }

    private createGem(scene: Phaser.Scene, row: number, col: number, offsetX = 0, offsetY = 0): Gem {
        const type = Phaser.Utils.Array.GetRandom(this.gemTypes);
        const gem = new Gem(
            scene,
            offsetX + this.getX(col),
            offsetY + this.getY(row) - this.cellSize * 2, // появление сверху
            type,
            row,
            col
        );
        scene.tweens.add({
            targets: gem,
            y: offsetY + this.getY(row),
            duration: 300,
        });
        return gem;
    }

    getGem(row: number, col: number): Gem | null {
        return this.grid[row]?.[col] ?? null;
    }

    swapGemPositions(gemA: Gem | null, gemB: Gem | null) {
        if (!gemA || !gemB) return;

        [gemA.row, gemB.row] = [gemB.row, gemA.row];
        [gemA.col, gemB.col] = [gemB.col, gemA.col];

        this.grid[gemA.row][gemA.col] = gemA;
        this.grid[gemB.row][gemB.col] = gemB;
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

    dropGems(scene: Phaser.Scene) {
        for (let col = 0; col < this.cols; col++) {
            for (let row = this.rows - 1; row >= 0; row--) {
                if (this.grid[row][col] === null) {
                    // ищем ближайший гем выше
                    for (let rowAbove = row - 1; rowAbove >= 0; rowAbove--) {
                        if (this.grid[rowAbove][col] !== null) {
                            const gem = this.grid[rowAbove][col];
                            this.grid[row][col] = gem;
                            this.grid[rowAbove][col] = null;

                            gem.row = row;
                            scene.tweens.add({
                                targets: gem,
                                y: this.getY(row),
                                duration: 200,
                            });

                            break;
                        }
                    }
                }
            }

            // Если наверху пустота – создаём новые фишки
            for (let row = 0; row < this.rows; row++) {
                if (!this.grid[row][col]) {
                    const gem = this.createGem(scene, row, col);
                    this.grid[row][col] = gem;
                    
                }
            }
        }
    }
}

