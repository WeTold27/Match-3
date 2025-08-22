import Board from "./Board";

export default class MatchChecker {
    scene: Phaser.Scene;
    board: Board;

    constructor(scene: Phaser.Scene, board: Board) {
        this.scene = scene;
        this.board = board;
    }

    checkMatches() {
        const matches = this.board.findMatches();
        if (matches.length === 0) return;

        for (const group of matches) {
            this.board.removeGems(group);
        }
        
        this.scene.time.delayedCall(500, () => this.checkMatches());
    }
}
