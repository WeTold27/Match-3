import Board from "./Board";
import Gem from "../entities/Gem";
import MatchChecker from "./MatchChecker";
import BoardShuffler from "./BoardShuffler";
export default class SwapHandler {
    private scene: Phaser.Scene;
    private board: Board;
    private matchChecker: MatchChecker;
    private selected: Gem | null = null;
    private readonly SCALE_SELECTED = 1.2;
    private readonly TWEEN_DURATION = 200;
    private readonly DELAY_AFTER_DROP = 300;

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
            return;
        }

        const firstGem = this.selected;
        this.selected = null;

        const dx = Math.abs(gem.col - firstGem.col);
        const dy = Math.abs(gem.row - firstGem.row);

        if (dx + dy !== 1) {
            this.selected = gem;
            return;
        }

        this.swapGems(gem, firstGem, () => {
            const matches = this.board.findMatches();
            if (matches.length > 0) {
                matches.forEach(group => this.board.removeGems(group));
                this.board.dropGems(this.scene);
               
                this.scene.time.delayedCall(this.DELAY_AFTER_DROP, () => { 
                    const shuffler = new BoardShuffler(this.board, this.scene);
                if (!shuffler.hasPossibleMoves()) {
                    shuffler.shuffle();
                }
                this.enableInput();
            });
                
            } else {
                // Откат, если совпадений нет
                this.swapGems(gem, firstGem);
            }
        });
    }

    private swapGems(g1: Gem, g2: Gem, onComplete?: () => void) {
        this.board.swapGemPositions(g1, g2);


        let tweensCompleted = 0;
        const onTweenComplete = () => {
            tweensCompleted++;
            if (tweensCompleted === 2 && onComplete) {
                onComplete();
            }
        };
        
        this.scene.tweens.add({
            targets: g1,
            x: this.board.getX(g1.col),
            y: this.board.getY(g1.row),
            duration: this.TWEEN_DURATION,
            onComplete: onTweenComplete
        });

        this.scene.tweens.add({
            targets: g2,
            x: this.board.getX(g2.col),
            y: this.board.getY(g2.row),
            duration: this.TWEEN_DURATION,
            onComplete: onTweenComplete
        });
    }
}
