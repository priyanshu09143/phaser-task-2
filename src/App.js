import React, { useEffect, useRef } from 'react';
import Phaser from "phaser";
import './App.css';

function App() {
  const gameInitialized = useRef(false);
  let ball;

  useEffect(() => {
    if (!gameInitialized.current) {
      let GameScene = new Phaser.Scene('Game');

      GameScene.preload = function () {
        this.load.image('background', '/assets/background.jpg');
        this.load.image('ball', '/assets/ball.png');
      };

      GameScene.create = function () {
        this.add.image(400, 300, 'background');
        ball = this.matter.add.sprite(400, 514, 'ball');
        let body = ball.body;
        this.matter.body.setInertia(body, Infinity);
        ball.setScale(0.1);
        ball.setVelocity(10, 10);
        ball.setFriction(0, 0);
        ball.setBounce(1);
      };

      let config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        physics: {
          default: 'matter',
          matter: {
            gravity: { y: 0 },
            setBounds: true,
            debug: false,
          },
        },
        scene: GameScene,
      };

      new Phaser.Game(config);
      gameInitialized.current = true;
    }
  }, []);

  const handleButtonClick = (x, y) => {
    if (ball) {
      ballTween(x, y);
    }
  };

  const ballTween = (x, y) => {
    const scene = ball.scene;
    const distance = Phaser.Math.Distance.Between(ball.x, ball.y, x, y);
    const duration = distance / 550 * 500; 
  
    scene.tweens.add({
      targets: ball,
      x: x,
      y: y,
      duration: duration,
      ease: 'Linear',
      onComplete: () => {
        ball.setVelocity(10, 10);
      }
    });
  
  };
  return (
    <div className='main'>
    <div className="canvas"></div>
    <div className="left">
      <button onClick={() => handleButtonClick(0,200)}>⚽</button>
      <button onClick={() => handleButtonClick(0,400)}>⚽</button>
    </div>
    <div className="top">
      <button onClick={() => handleButtonClick(200,0)}>⚽</button>
      <button onClick={() => handleButtonClick(600,0)}>⚽</button>
    </div>
    <div className="right">
      <button onClick={() => handleButtonClick(800,200)}>⚽</button>
      <button onClick={() => handleButtonClick(800,400)}>⚽</button>
    </div>
    <div className="bottom">
      <button onClick={() => handleButtonClick(200,600)}>⚽</button>
      <button onClick={() => handleButtonClick( 600,600)}>⚽</button>
    </div>
  </div>
  )
}

export default App;
