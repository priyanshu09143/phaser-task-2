import { io } from 'socket.io-client';

let socket = io("https://phaser2backend.onrender.com")
export default socket