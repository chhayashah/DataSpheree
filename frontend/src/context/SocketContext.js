import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";
import { SOCKET_URL } from "../constants";

const SocketContext = createContext(null);

const isAuthError = (message = "") => message.startsWith("Unauthorized");

export const SocketProvider = ({ children }) => {
  const { user, logout } = useAuth();
  const socketRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [lastError, setLastError] = useState(null);

  const logoutRef = useRef(logout);
  useEffect(() => {
    logoutRef.current = logout;
  }, [logout]);

  useEffect(() => {
    if (!user) return undefined;
    if (socketRef.current) return undefined;

    const token = localStorage.getItem("token");
    if (!token) return undefined;

    const instance = io(SOCKET_URL, {
      auth: { token },
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    const handleConnect = () => {
      setConnected(true);
      setConnecting(false);
      setLastError(null);
    };

    const handleDisconnect = (reason) => {
      setConnected(false);
      setConnecting(reason !== "io client disconnect");
    };

    const handleReconnectAttempt = () => {
      setConnecting(true);
    };

    const handleConnectError = (error) => {
      setConnecting(false);
      setLastError(error.message);

      if (isAuthError(error.message)) {
        instance.disconnect();
        logoutRef.current();
      }
    };

    instance.on("connect", handleConnect);
    instance.on("disconnect", handleDisconnect);
    instance.on("reconnect_attempt", handleReconnectAttempt);
    instance.on("connect_error", handleConnectError);

    socketRef.current = instance;
    setSocket(instance);
    setConnecting(true);

    return () => {
      instance.off("connect", handleConnect);
      instance.off("disconnect", handleDisconnect);
      instance.off("reconnect_attempt", handleReconnectAttempt);
      instance.off("connect_error", handleConnectError);
      instance.disconnect();
      socketRef.current = null;
      setSocket(null);
      setConnected(false);
      setConnecting(false);
      setLastError(null);
    };
  }, [user]);

  return (
    <SocketContext.Provider
      value={{ socket, connected, connecting, lastError }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error("useSocket must be used within SocketProvider");
  return ctx;
};
