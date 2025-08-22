import Phaser from "phaser";
import Board from "../core/Board";
import SwapHandler from "../core/SwapHandler";
import MatchChecker from "../core/MatchChecker";

export default class GameScene extends Phaser.Scene {
    private board!: Board;
    private swapHandler!: SwapHandler;
    private matchChecker!: MatchChecker;


    constructor() {
        super("GameScene");
    }

    create() {
        this.add.image(this.scale.width / 2, this.scale.height / 2, "sky")
            .setDisplaySize(this.scale.width, this.scale.height);
    
        this.board = new Board(9, 9, 81, [
            "donut", "cracker", "croissant", "cookie", "icecream", "candy", "cake",
            "wrapper", "lollipop", "cupcake", 'star', 'cchups', 'chocolate', 'piececake'
        ]);
        
        this.board.create(this);


        // создаём менеджеров
        this.matchChecker = new MatchChecker(this, this.board);
        this.swapHandler = new SwapHandler(this, this.board);

        // включаем ввод (клики по гемам)
        this.swapHandler.enableInput();
    }
}
