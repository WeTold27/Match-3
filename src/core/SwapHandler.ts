import Board from "./Board";
import Gem from "../entities/Gem";
import MatchChecker from "./MatchChecker";

export default class SwapHandler {
    scene: Phaser.Scene;
    board: Board;
    matchChecker: MatchChecker;
    selected: Gem | null = null;

    constructor(scene: Phaser.Scene, board: Board, matchChecker: MatchChecker) {
        this.scene = scene;
        this.board = board;
        this.matchChecker = matchChecker;
    }

    enableInput() {
        this.scene.input.on("gameobjectdown", (_: any, gameObject: any) => {
            const gem = gameObject as Gem;

            if (!this.selected) {
                this.selected = gem;
                gem.highlight();
            } else {
                this.selected.resetHighlight();
                this.board.swap(this.selected, gem);
                this.matchChecker.checkMatches();
                this.selected = null;
            }
        });
    }
}
