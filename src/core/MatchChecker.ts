import Phaser from "phaser";
import Board from "./Board";
import Gem from "../entities/Gem";

export default class MatchChecker {
    private scene: Phaser.Scene;
    private board: Board;

    constructor(scene: Phaser.Scene, board: Board) {
        this.scene = scene;
        this.board = board;
    }

    findMatches(): Gem[][] {
        const matches: Gem[][] = [];

        // горизонтали
        for (let row = 0; row < this.board.rows; row++) {
            let run: Gem[] = [];
            let lastType: string | null = null;

            for (let col = 0; col < this.board.cols; col++) {
                const gem = this.board.grid[row][col];
                if (!gem) continue;

                if (gem.type === lastType) {
                    run.push(gem);
                } else {
                    if (run.length >= 3) matches.push(run);
                    run = [gem];
                }
                lastType = gem.type;
            }
            if (run.length >= 3) matches.push(run);
        }

        // вертикали
        for (let col = 0; col < this.board.cols; col++) {
            let run: Gem[] = [];
            let lastType: string | null = null;

            for (let row = 0; row < this.board.rows; row++) {
                const gem = this.board.grid[row][col];
                if (!gem) continue;

                if (gem.type === lastType) {
                    run.push(gem);
                } else {
                    if (run.length >= 3) matches.push(run);
                    run = [gem];
                }
                lastType = gem.type;
            }
            if (run.length >= 3) matches.push(run);
        }

        return matches;
    }

    handleMatches(matches: Gem[][]) {
        matches.forEach(group => {
            group.forEach(gem => {
                this.board.grid[gem.row][gem.col] = null!;
                gem.destroy();
            });
        });

        this.scene.time.delayedCall(250, () => {
            this.board.dropGems(this.scene);

            // после падения снова проверяем
            this.scene.time.delayedCall(400, () => {
                const newMatches = this.findMatches();
                if (newMatches.length > 0) {
                    this.handleMatches(newMatches);
                }
            });
        });
    }
}
