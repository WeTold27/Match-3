
import Phaser from "phaser";
import GameScene from "./scenes/GameScene";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 730,
  height: 730, 
  backgroundColor: "#222222",
  physics: {
    default: 'arcade'
  },
  
  scene: [ GameScene]
};


new Phaser.Game(config);
