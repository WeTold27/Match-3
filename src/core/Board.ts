import Phaser from "phaser";
import Gem from "../entities/Gem";

export default class Board {
    rows: number;
    cols: number;
    cellSize: number;
    gemTypes: string[];
    grid: (Gem | null)[][];
    private offsetX: number = 0;
    private offsetY: number = 0;
    private scene: Phaser.Scene;
    private ui: any;

    private resolving = false;

    constructor(rows: number, cols: number, cellSize: number, gemTypes: string[], scene: Phaser.Scene, ui: any) {
        this.rows = rows;
        this.cols = cols;
        this.cellSize = cellSize;
        this.gemTypes = gemTypes;
        this.scene = scene;
        this.ui = ui;
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

    getX(col: number) {
        return this.offsetX + col * this.cellSize + this.cellSize / 2;
    }

    getY(row: number) {
        return this.offsetY + row * this.cellSize + this.cellSize / 2;
    }

    create(scene: Phaser.Scene) {
        const uiWidth = 50;
        this.offsetX = (scene.scale.width - this.cols * this.cellSize - uiWidth) / 2 - uiWidth;
        this.offsetY = (scene.scale.height - this.rows * this.cellSize) / 2;

        for (let row = 0; row < this.rows; row++) {
            this.grid[row] = [];
            for (let col = 0; col < this.cols; col++) {
                const gem = this.createGem(scene, row, col);
                this.grid[row][col] = gem;
            }
        }
        scene.time.delayedCall(10, () => this.resolveMatches(scene, this.ui));
    }

    private createGem(scene: Phaser.Scene, row: number, col: number): Gem {
        const type = Phaser.Utils.Array.GetRandom(this.gemTypes);
        const gem = new Gem(
            scene,
            this.getX(col),
            this.getY(row) - this.cellSize * 2, // появление сверху
            type,
            row,
            col
        );
        scene.tweens.add
        ({
            targets: gem,
            y: this.getY(row),
            duration: 300,
        });
        return gem;
    }

    getGem(row: number, col: number): Gem | null {
        return this.grid[row]?.[col] ?? null;
    }

    swapGemPositions(gemA: Gem | null, gemB: Gem | null) {
        if (!gemA || !gemB) return;
        return new Promise<void>((resolve) => {
            // меняем местами координаты в grid
            [gemA.row, gemB.row] = [gemB.row, gemA.row];
            [gemA.col, gemB.col] = [gemB.col, gemA.col];
            this.grid[gemA.row][gemA.col] = gemA;
            this.grid[gemB.row][gemB.col] = gemB;

            // анимация обмена
            this.scene.tweens.add({
                targets: gemA,
                x: this.getX(gemA.col),
                y: this.getY(gemA.row),
                duration: 200,
                onComplete: () => {
                    this.scene.tweens.add({
                        targets: gemB,
                        x: this.getX(gemB.col),
                        y: this.getY(gemB.row),
                        duration: 200,
                        onComplete: () => {
                            // теперь только после завершения анимации
                            this.resolveMatches(this.scene, this.ui);
                            resolve();
                        }
                    });
                }
            });
        });
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

    private calculatePoints(matchLength: number): number {
        if (matchLength < 3) return 0;
        if (matchLength === 3) return 100;
        return 100 + (matchLength - 3) * 50;
    }

    removeGems(group: Gem[]) {
        const points = this.calculatePoints(group.length);
        for (const gem of group) {
            this.grid[gem.row][gem.col] = null;
            gem.destroy();
        }
        return points;
    }

    async dropGems(scene: Phaser.Scene) {
        const tweens: Promise<void>[] = [];
        
        for (let col = 0; col < this.cols; col++) {
            for (let row = this.rows - 1; row >= 0; row--) {
                if (this.grid[row][col] === null) {
                    for (let rowAbove = row - 1; rowAbove >= 0; rowAbove--) {
                        if (this.grid[rowAbove][col] !== null) {
                            const gem = this.grid[rowAbove][col];
                            this.grid[row][col] = gem;
                            this.grid[rowAbove][col] = null;
                            gem.row = row;

                            tweens.push(new Promise<void>(resolve => {
                            scene.tweens.add({
                                targets: gem,
                                y: this.getY(row),
                                duration: 200,
                                onComplete: () => resolve()
                            });
                            }));
                            break;
                        }
                    }
                }
            }

            for (let row = 0; row < this.rows; row++) {
                if (!this.grid[row][col]) {
                    const gem = this.createGem(scene, row, col);
                    this.grid[row][col] = gem;

                    tweens.push(new Promise(res => {
                        scene.tweens.add({
                            targets: gem,
                            y: this.getY(row),
                            duration: 200,
                            onComplete: () => res()
                        });
                    }));
                }
            }
        }
        
        await Promise.all(tweens);
    }

    async resolveMatches(scene: Phaser.Scene, ui: any) {
            let matches = this.findMatches();

        while (matches.length > 0) {
            for (const group of matches) {
                const points = this.removeGems(group);
                ui.score += points;
                ui.scoreText.setText(`Score:${ui.score}`);
            }

            await this.dropGems(scene); // ✅ ждём падения

            matches = this.findMatches();
        }
    }
}