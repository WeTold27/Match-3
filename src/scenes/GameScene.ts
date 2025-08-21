import Phaser from "phaser";

interface Gem extends Phaser.GameObjects.Image {
    row: number;
    col: number;
    type: string;
}

export default class GameScene extends Phaser.Scene {

    private rows: number;
    private cols: number;
    private cellSize: number;
    private gemTypes: string[];
    private board: Gem[][];


    constructor() {
        super("GameScene");
    }

    create() {
        this.rows = 9;
        this.cols = 9;
        this.cellSize = 81;
        this.add.image(400, 400, "sky");

        this.gemTypes = ['sand', 'ice', 'donat', 'sandstone', 'cracker',
            'croissant', 'cookie', 'icecream', 'candy-fence', 'candy',
            'cake', 'bomb', 'wrapper', 'lollipop', 'cupcake', 'star',
            'cchups', 'watch', 'rainbow-bomb', 'chocolate', 'piececake',];

        this.board = [];
        for (let row = 0; row < this.rows; row++) {
            this.board[row] = [];
            for (let col = 0; col < this.cols; col++) {
                let gemType = Phaser.Utils.Array.GetRandom(this.gemTypes as string[]);

                let x = col * this.cellSize + this.cellSize / 2;
                let y = row * this.cellSize + this.cellSize / 2;

                let gem = this.add.image(x, y, gemType)
                    .setInteractive() as Gem;
                gem.setDisplaySize(this.cellSize - 4, this.cellSize - 4);

                gem.type = gemType;
                gem.row = row;
                gem.col = col;

                this.board[row][col] = gem;
            }
        }
    }
}
