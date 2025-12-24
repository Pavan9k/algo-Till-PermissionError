export const runtime = {
  connected: false,
  lastTickAt: null
};

export const setConnected = () => {
  runtime.connected = true;
};

export const setDisconnected = () => {
  runtime.connected = false;
};

export const updateTickTime = () => {
  runtime.lastTickAt = new Date().toISOString();
};
