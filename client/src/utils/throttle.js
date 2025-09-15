// Simple throttle utility to prevent rapid API calls
const throttleMap = new Map();

export const throttle = (key, func, delay = 1000) => {
  const now = Date.now();
  const lastCall = throttleMap.get(key) || 0;
  
  if (now - lastCall >= delay) {
    throttleMap.set(key, now);
    return func();
  }
  
  return Promise.resolve();
};