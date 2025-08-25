import Phaser from "phaser";

export default class Gem extends Phaser.GameObjects.Image {
    row: number;
    col: number;
    type: string;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, row: number, col: number) {
        super(scene, x, y, texture);
        this.row = row;
        this.col = col;
        this.type = texture;

        this.setInteractive();
        this.setDisplaySize(67, 67);
        scene.add.existing(this);
        
    }
}
