import Board from "./Board";
import Gem from "../entities/Gem";
import MatchChecker from "./MatchChecker";
export default class SwapHandler {
    private scene: Phaser.Scene;
    private board: Board;
    private matchChecker: MatchChecker
    private selected: Gem | null = null;

    constructor(scene: Phaser.Scene, board: Board, matchChecker: MatchChecker) {
        this.scene = scene;
        this.board = board;
        this.matchChecker = matchChecker;
    }

    enableInput() {
        for (let row = 0; row < this.board.rows; row++) {
            for (let col = 0; col < this.board.cols; col++) {
                const gem = this.board.grid[row][col];
                if (!gem) continue;
                gem.setInteractive();
                gem.on("pointerdown", () => this.onGemClicked(gem));
            }
        }
    }
    
    private onGemClicked(gem: Gem) {
        if (!this.selected) {
            this.selected = gem;
            gem.setScale(1.2);
            return;
        }

        const dx = Math.abs(gem.col - this.selected.col);
        const dy = Math.abs(gem.row - this.selected.row);

        if (dx + dy === 1) {
            const first = this.selected;
            this.selected.setScale(1);
            this.selected = null;
            this.swapGems(gem, first, () => {
                const matches = this.board.findMatches();
                if (matches.length > 0) this.matchChecker.handleMatches(matches);
                 else {
                    matches.forEach(group => this.board.removeGems(group));
                    this.board.dropGems(this.scene);

                    this.scene.time.delayedCall(250, () => {
                        const newMatches = this.board.findMatches();
                        if (newMatches.length > 0) {
                            newMatches.forEach(group => this.board.removeGems(group));
                            this.board.dropGems(this.scene);
                        }
                    });
                }
            });
        } else {
            this.selected.setScale(1);
            this.selected = gem;
            gem.setScale(1.2);
        }
    }
    

    private swapGems(g1: Gem, g2: Gem, onComplete?: () => void) {
        this.board.swapGemPositions(g1, g2);

        // Анимация
        this.scene.tweens.add({
            targets: g1,
            x: this.board.getX(g1.col),
            y: this.board.getY(g1.row),
            duration: 200,
        });

        this.scene.tweens.add({
            targets: g2,
            x: this.board.getX(g2.col),
            y: this.board.getY(g2.row),
            duration: 200,
            onComplete,
        });
    }
}
