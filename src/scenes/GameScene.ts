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

    preload() {
        this.load.image('sand', 'assets/ico/1.png');
        this.load.image('ice', 'assets/ico/2.png');
        this.load.image('donat', 'assets/ico/3.png');
        this.load.image('sandstone', 'assets/ico/4.png');
        this.load.image('cracker', 'assets/ico/5.png');
        this.load.image('croissant', 'assets/ico/6.png');
        this.load.image('cookie', 'assets/ico/7.png');
        this.load.image('icecream', 'assets/ico/8.png');
        this.load.image('candy-fence', 'assets/ico/9.png');
        this.load.image('candy', 'assets/ico/10.png');
        this.load.image('cake', 'assets/ico/11.png');
        this.load.image('bomb', 'assets/ico/12.png');
        this.load.image('wrapper', 'assets/ico/13.png');
        this.load.image('lollipop', 'assets/ico/14.png');
        this.load.image('cupcake', 'assets/ico/15.png');
        this.load.image('star', 'assets/ico/16.png');
        this.load.image('cchups', 'assets/ico/17.png');
        this.load.image('watch', 'assets/ico/18.png');
        this.load.image('rainbow-bomb', 'assets/ico/19.png');
        this.load.image('chocolate', 'assets/ico/20.png');
        this.load.image('piececake', 'assets/ico/21.png');
        this.load.image('sky', 'assets/bg.png');
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