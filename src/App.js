import React, { useEffect, useRef, useState } from 'react';
import Phaser from "phaser";
import './App.css';
import socket from './socket';

function App() {
  const gameInitialized = useRef(false);
  const ballRef = useRef(null);
  
  const [check, setCheck] = useState("");
  const [data, setData] = useState([])

  useEffect(() => {
    if (!gameInitialized.current) {
      let GameScene = new Phaser.Scene('Game');

      GameScene.preload = function () {
        this.load.image('background', '/assets/background.jpg');
        this.load.image('ball', '/assets/ball.png');
      };

      GameScene.create = function () {
        this.add.image(400, 300, 'background');
        ballRef.current = this.matter.add.sprite(400, 514, 'ball');
        let body = ballRef.current.body;
        this.matter.body.setInertia(body, Infinity);
        ballRef.current.setScale(0.1);
        ballRef.current.setVelocity(10, 10);
        ballRef.current.setFriction(0, 0);
        ballRef.current.setBounce(1);
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
        disableVisibilityChange : true
      };
      new Phaser.Game(config);
      gameInitialized.current = true;
    }

  }, []);



  useEffect(() => {
    socket.on("connected", (arr) => {
      console.log(arr[0], socket.id)
      if (arr[0] === socket.id) {
        setCheck("admin")
      }
    })

  }, [])

  function changeBallState() {
    if (document.visibilityState === "hidden") {
      // Emit position and velocity when tab is hidden
      socket.emit("position", { x: ballRef.current.x, y: ballRef.current.y, vx: ballRef.current.body.velocity.x, vy: ballRef.current.body.velocity.y });
    }
    if (document.visibilityState === "visible") {
      // Listen for updates to position and velocity when tab is visible
      socket.on("newPos", (msg) => {
        if (msg !== null) {
          ballRef.current.setPosition(msg.x, msg.y);
          // If the velocity is zero, set a default velocity to prevent the ball from falling
          const vx = msg.vx !== 0 ? msg.vx : 10;
          const vy = msg.vy !== 0 ? msg.vy : 10;
          ballRef.current.setVelocity(vx, vy);
          ballTween(msg.x, msg.y);
        }
      })
    }
  }
  

  useEffect(() => {
    document.addEventListener("visibilitychange", changeBallState)

    socket.on("newPos", (msg) => {
      if (msg !== null) {
        ballRef.current.setPosition(msg.x, msg.y)
        ballTween(msg.x, msg.y);
      }
    })
    return () => {
      socket.off("newPos");
      document.removeEventListener('visibilitychange', changeBallState);
    };
  }, [])

  socket.on("newclick", ({x , y , btn})=>{
    ballTween(x ,y)
  })
  const handleButtonClick = (x, y, btn) => {
    socket.emit("click", btn)
    socket.emit("clickPos", {x, y})
    if (ballRef.current) {
      ballTween(x, y);
    }
  };

  const ballTween = (x, y) => {
    const scene = ballRef.current.scene;
    const distance = Phaser.Math.Distance.Between(ballRef.current.x, ballRef.current.y, x, y);
    const duration = distance / 550 * 500;

    scene.tweens.add({
      targets: ballRef.current,
      x: x,
      y: y,
      duration: duration,
      ease: 'Linear',
      onComplete: () => {
        ballRef.current.setVelocity(10, 10);
      },
    });
  };

  socket.on("btnClicks", (btn) => {
    setData([...data, btn])
  })
  return (
    <div className='main'>
      {check === "admin" && <div className="admin"><h2>Admin</h2></div>}
      {check === "" && <div className="user">
        <h2>User</h2>
        <ul>
          {data.map((item, index) => {
            return <li key={index}>Admin Clicked on {item}</li>
          })}
        </ul>
      </div>}

      <div className="canvas"></div>
      <div className="left">
        <button onClick={() => handleButtonClick(0, 200, 1)}  disabled = {check !== "admin"}>Button 1⚽</button>
        <button onClick={() => handleButtonClick(0, 400, 2)}  disabled = {check !== "admin"}>Button 2⚽</button>
      </div>
      <div className="top">
        <button onClick={() => handleButtonClick(200, 0, 3)}  disabled = {check !== "admin"}>Button 3⚽</button>
        <button onClick={() => handleButtonClick(600, 0, 4)}  disabled = {check !== "admin"}>Button 4⚽</button>
      </div>
      <div className="right">
        <button onClick={() => handleButtonClick(800, 200, 5)}  disabled = {check !== "admin"}>Button 5⚽</button>
        <button onClick={() => handleButtonClick(800, 400, 6)}  disabled = {check !== "admin"}>Button 6⚽</button>
      </div>
      <div className="bottom">
        <button onClick={() => handleButtonClick(200, 600, 7)}  disabled = {check !== "admin"}>Button 7⚽</button>
        <button onClick={() => handleButtonClick(600, 600, 8)}  disabled = {check !== "admin"}>Button 8⚽</button>
      </div>
    </div>
  )
}

export default App;
