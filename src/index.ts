
import Phaser from "phaser";

import GameScene from "./scenes/GameScene";
import PreloadScene from './scenes/Preload';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 900,
  height: 730, 
  backgroundColor: "#222222",
  scene: [PreloadScene, GameScene],
  physics: {
    default: 'arcade'
  },
};


const game = new Phaser.Game(config);

window.onload = () => {
  const canvas = game.canvas

  canvas.style.position = "absolute";
  canvas.style.left = "50%";
  canvas.style.top = "50%";
  canvas.style.transform = "translate(-50%, -50%)";

  document.body.style.background = "#111";
  document.body.style.margin = "0";
  document.body.style.overflow = "hidden";
}
