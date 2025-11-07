
import { io, Socket } from "socket.io-client";

const SOCKET_URL = "http://localhost:4000";

let socket: Socket;

// ✅ Prevent multiple connections (especially during HMR)
if (!(window as any)._socketInstance) {
  (window as any)._socketInstance = io(SOCKET_URL, {
    transports: ["websocket"],
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });
}

socket = (window as any)._socketInstance;

export { socket };
