import Phaser from "phaser";
import Board from "../core/Board";
import SwapHandler from "../core/SwapHandler";
import MatchChecker from "../core/MatchChecker";

export default class GameScene extends Phaser.Scene {
    private board!: Board;
    private swapHandler!: SwapHandler;
    private matchChecker!: MatchChecker;
   
    private ui: {
        score: number;
        scoreText: Phaser.GameObjects.Text;
    } = {} as any;
    
    constructor() {
        super("GameScene");
    }

    create() {
        this.add.image(this.scale.width / 2, this.scale.height / 2, "sky")
            .setDisplaySize(this.scale.width, this.scale.height);

        const uiWidth = 150;
        
        this.board = new Board(9, 9, 81, [
            "donut", "cracker", "croissant", "cookie", "icecream", "candy", "cake",
            "wrapper", "lollipop", "cupcake", 'star', 'cchups', 'chocolate', 'piececake'
        ], this);
        
        this.board.create(this);

        this.ui.score = 0;
        this.ui.scoreText = this.add.text(
            this.board.cols * this.board.cellSize + 50, // справа от поля
           20, // вертикально по центру
            `Score: \n${this.ui.score}`,
            {
                fontSize: '24px',
                color: '#ffffff',
                align: 'center'
            
            });
        
        // this.ui.totalScoreText = this.add.text(
        //     this.board.cols * this.board.cellSize + 20,
        //     120, // чуть ниже текущих очков
        //     `Total Score:\n${this.totalScore}`,
        //     { fontSize: '24px', color: '#ffffff', align: 'center' }
        // );
    
        
        
        // создаём менеджеров
        this.matchChecker = new MatchChecker(this, this.board);
        this.swapHandler = new SwapHandler(this, this.board, this.matchChecker);

        // включаем ввод (клики по гемам)
        this.swapHandler.enableInput();
    }
    addScore(points: number) {
        this.ui.score += points;
        this.ui.scoreText.setText(`Score: \n${this.ui.score}`);
        // this.ui.totalScoreText.setText(`Total Score:\n${this.ui.totalScore}`);
    }
}
