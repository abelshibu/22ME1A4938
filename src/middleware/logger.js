const logs = [];

export const logEvent = (message, data = {}) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    message,
    data
  };
  logs.push(logEntry);
};

export const getLogs = () => logs;
