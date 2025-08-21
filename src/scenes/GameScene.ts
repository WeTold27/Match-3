import Phaser from "phaser";
import Board from "../board/Board";

export default class GameScene extends Phaser.Scene {
    private board: Board;
    private selected: any = null;


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
        
    }
}
