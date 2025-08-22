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
            let streak: Gem[] = [];
            for (let col = 0; col < this.board.cols; col++) {
                const gem = this.board.grid[row][col];
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

        // вертикали
        for (let col = 0; col < this.board.cols; col++) {
            let streak: Gem[] = [];
            for (let row = 0; row < this.board.rows; row++) {
                const gem = this.board.getGem(row, col);
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

    handleMatches(matches: Gem[][]) {
        if (matches.length === 0) return;

        matches.forEach(group => {
            group.forEach(gem => {
                this.board.grid[gem.row][gem.col] = null;
                gem.destroy();
            });
        });

        this.scene.time.delayedCall(200, () => {
            this.board.dropGems(this.scene);
            
            this.scene.time.delayedCall(300, () => {
                const newMatches = this.findMatches();
                if (newMatches.length > 0) this.handleMatches(newMatches);
            });
        });
    }
}
