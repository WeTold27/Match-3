import Board from "./Board";
import Gem from "../entities/Gem";
import MatchChecker from "./MatchChecker";
import BoardShuffler from "./BoardShuffler";
export default class SwapHandler {
    private scene: Phaser.Scene;
    private board: Board;
    private matchChecker: MatchChecker;
    private selected: Gem | null = null;
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
                if (!gem || !gem.active || !gem.scene) continue;
                gem.setInteractive();
                gem.removeAllListeners();
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
            if (this.board.findMatches().length > 0) {
                this.board.resolveMatches(this.scene, (this.scene as any).ui).then(() => {
                    const shuffler = new BoardShuffler(this.board, this.scene);
                    if (!shuffler.hasPossibleMoves()) {
                        shuffler.shuffle();
                    }
                    this.enableInput();
                });
            } else {
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
