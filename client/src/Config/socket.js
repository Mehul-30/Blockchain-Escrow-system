
import { io } from "socket.io-client";

const socket = io("http://localhost:5123", {
  transports: ["websocket"], // avoids polling issues
});

export default socket;