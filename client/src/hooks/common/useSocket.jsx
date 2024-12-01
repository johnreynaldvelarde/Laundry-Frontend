import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

const useSocket = (userDetails) => {
  const [socket, setSocket] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userDetails) return;
    const newSocket = io(SOCKET_URL, {
      transports: ["websocket"],
    });
    setSocket(newSocket);

    newSocket.on("connect", () => {
      if (userDetails?.userId && userDetails?.storeId) {
        newSocket.emit("register", {
          userId: userDetails.userId,
          storeId: userDetails.storeId,
          userType: userDetails.roleName,
        });
      }
    });

    newSocket.on("connect_error", (error) => {
      setError("Connection failed: " + error.message);
      console.error("Socket connection error:", error);
    });

    return () => {
      newSocket.off("connect");
      newSocket.off("connect_error");
      newSocket.disconnect();
    };
  }, [userDetails]);

  return { socket, error };
};

export default useSocket;
