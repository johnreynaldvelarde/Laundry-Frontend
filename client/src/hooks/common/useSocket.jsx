import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = "https://web-production-dd1d.up.railway.app";
//const SOCKET_URL = import.meta.env.VITE_SOCKET_API;

const useSocket = (userDetails) => {
  const [socket, setSocket] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userDetails || !userDetails.userId || !userDetails.storeId) return; // Ensure userDetails are valid

    const newSocket = io(SOCKET_URL, {
      transports: ["websocket"],
      reconnectionAttempts: 5, // Automatically attempt reconnection 5 times
      reconnectionDelay: 1000, // Delay between reconnection attempts
      reconnectionDelayMax: 5000, // Maximum delay between reconnections
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      newSocket.emit("register", {
        userId: userDetails.userId,
        storeId: userDetails.storeId,
        userType: userDetails.roleName,
      });
    });

    newSocket.on("connect_error", (error) => {
      setError("Connection failed: " + error.message);
      console.error("Socket connection error:", error);
    });

    newSocket.on("disconnect", () => {
      console.error("Socket disconnected");
    });

    return () => {
      newSocket.off("connect");
      newSocket.off("connect_error");
      newSocket.off("disconnect");
      newSocket.disconnect();
    };
  }, [userDetails]);

  return { socket, error };
};

export default useSocket;
