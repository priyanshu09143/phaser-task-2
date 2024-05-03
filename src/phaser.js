import Phaser from "phaser";

let GameScene = new Phaser.Scene("Game");

  GameScene.preload = function() {
    this.load.image("background", "/assets/background.jpg");
    this.load.image("ball", "/assets/ball.png");
  };

  GameScene.create = function() {
    this.add.sprite(400 , 300, "background");
    this.add.sprite(400 , 514, "ball");
  };

  let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 300 },
        debug: false
      }
    },
    scene: GameScene
  };

export default new Phaser.Game(config);