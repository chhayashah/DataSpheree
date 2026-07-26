import { useEffect, useRef } from "react";
import { useSocket } from "../context/SocketContext";

export const useSocketEvent = (eventName, handler) => {
  const { socket } = useSocket();
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!socket) return undefined;

    const listener = (...args) => handlerRef.current(...args);
    socket.on(eventName, listener);

    return () => {
      socket.off(eventName, listener);
    };
  }, [socket, eventName]);
};
