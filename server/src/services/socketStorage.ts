import { Socket } from "socket.io";

const socketStorage = new Map<string, { socket: Socket; playerId?: string }>();
const playerIdToSocketId = new Map<string, string>();

const getSocketFromId = async (socketId: string) => socketStorage.get(socketId);

const getSocketFromPlayerId = async (playerId: string) => {
  const socketId = playerIdToSocketId.get(playerId);
  if (!socketId) {
    return;
  }

  return socketStorage.get(socketId);
};

const registerSocket = async (socketId: string, socket: Socket) => {
  socketStorage.set(socketId, {
    socket,
    playerId: undefined,
  });

  console.log(socketStorage.size + " client connected");

  return true;
};

const unregisterSocket = async (socketId: string) => {
  socketStorage.delete(socketId);

  console.log(socketStorage.size + " client connected");

  return true;
};

const setUserInfo = async (socketId: string, playerId: string) => {
  const socketData = socketStorage.get(socketId);
  if (!socketData) {
    return false;
  }

  socketData.playerId = playerId;

  playerIdToSocketId.set(playerId, socketId);

  return true;
};

export {
  getSocketFromId,
  getSocketFromPlayerId,
  registerSocket,
  setUserInfo,
  unregisterSocket,
};
