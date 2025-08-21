import Phaser from "phaser";

class Preload extends Phaser.Scene {
    constructor() {
        super('PreloadScene');
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
        this.scene.start('GameScene');
    }
}

export default Preload;